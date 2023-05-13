/*
 * Copyright 2019, 2023 sukawasatoru
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const createBookByWorkBook = async (book: import('xlsx').WorkBook): Promise<JsonBook> => {
    const xlsx = await import('xlsx');
    const sheets = new Map<string, JsonSheet>();
    for (const [key, sheet] of Object.entries(book.Sheets)) {
        sheets.set(key, new JsonSheet(xlsx.utils.sheet_to_json(sheet, {header: 1})));
    }

    return new JsonBook(sheets);
};

const createBookByPath = async (filePath: string): Promise<JsonBook> => {
    const {readFile} = await import('xlsx');
    return createBookByWorkBook(readFile(filePath));
};

const createBookByFile = (file: File): Promise<JsonBook> => {
    const reader = new FileReader();
    const isBinary = !!reader.readAsBinaryString;

    return new Promise(resolve => {
        // https://github.com/microsoft/TSJS-lib-generator/pull/704
        reader.onload = async (e: ProgressEvent<FileReader>) => {
            const {read} = await import('xlsx');
            const book = read(e.target?.result, {type: isBinary ? 'binary' : 'array'});
            resolve(await createBookByWorkBook(book));
        };
        if (isBinary) {
            reader.readAsBinaryString(file);
        } else {
            reader.readAsArrayBuffer(file);
        }
    });
};

export {createBookByPath, createBookByFile};

export class JsonBook {
    private readonly sheets: Map<string, JsonSheet>;

    constructor(sheets: Map<string, JsonSheet>) {
        this.sheets = sheets;
    }

    getSheetByName(name: string): JsonSheet | undefined {
        return this.sheets.get(name);
    }

    getSheetNames(): IterableIterator<string> {
        return this.sheets.keys();
    }
}

class JsonSheet {
    keyColumnIndex: number;
    headerRowIndex: number;
    payloadStartRowIndex: number;

    private readonly sheet: unknown[][];

    constructor(json: unknown[][]) {
        this.sheet = json;
        this.keyColumnIndex = 0;
        this.headerRowIndex = 0;
        this.payloadStartRowIndex = 0;
    }

    getRecord(index: number): JsonSheetRecord {
        return new JsonSheetRecord(this.sheet[index], this.keyColumnIndex);
    }

    findColumnIndex(value: string): number {
        return this.getRecord(this.headerRowIndex).findIndex(value);
    }

    records(): IterableIterator<JsonSheetRecord> {
        return new SheetRecordIterator(this, this.payloadStartRowIndex, this.sheet.length);
    }
}

export class JsonSheetRecord {
    private readonly data: unknown[];
    private readonly keyIndex: number;

    constructor(data: unknown[], keyIndex: number) {
        this.data = data;
        this.keyIndex = keyIndex;
    }

    getKey(): unknown {
        return this.data[this.keyIndex];
    }

    getValue(index: number): unknown {
        return this.data[index];
    }

    findIndex(value: unknown): number {
        return this.data.indexOf(value);
    }
}

export class SheetRecordIterator implements IterableIterator<JsonSheetRecord> {
    private readonly sheet: JsonSheet;
    private readonly recordEndIndex: number;

    private recordIndex: number;
    private retEntry!: JsonSheetRecord;

    constructor(sheet: JsonSheet, recordStartIndex: number, recordEndIndex: number) {
        this.sheet = sheet;
        this.recordIndex = recordStartIndex;
        this.recordEndIndex = recordEndIndex;
    }

    [Symbol.iterator](): IterableIterator<JsonSheetRecord> {
        return this;
    }

    next(): IteratorResult<JsonSheetRecord> {
        if (this.recordIndex < this.recordEndIndex) {
            this.retEntry = this.sheet.getRecord(this.recordIndex);
            const result = {value: this.retEntry, done: false};
            this.recordIndex++;
            return result;
        }
        return {value: this.retEntry, done: true};
    }
}
