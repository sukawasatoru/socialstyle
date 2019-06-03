import * as xlsx from 'xlsx';
import {WorkBook} from 'xlsx';

const createBookByWorkBook = (book: WorkBook): JsonBook => {
    const sheets = new Map<string, JsonSheet>();
    for (const [key, sheet] of Object.entries(book.Sheets)) {
        sheets.set(key, new JsonSheet(xlsx.utils.sheet_to_json(sheet, {header: 1})));
    }

    return new JsonBook(sheets);
};

const createBookByPath = (filePath: string): JsonBook => {
    return createBookByWorkBook(xlsx.readFile(filePath));
};

const createBookByFile = (file: File): Promise<JsonBook> => {
    const reader = new FileReader();
    const isBinary = !!reader.readAsBinaryString;

    return new Promise(resolve => {
        // https://github.com/microsoft/TSJS-lib-generator/pull/704
        reader.onload = (e: any) => {
            const book = xlsx.read(e.target.result, {type: isBinary ? 'binary' : 'array'});
            resolve(createBookByWorkBook(book));
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

    private readonly sheet: any[][];

    constructor(json: any[][]) {
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
    private readonly data: any[];
    private readonly keyIndex: number;

    constructor(data: any[], keyIndex: number) {
        this.data = data;
        this.keyIndex = keyIndex;
    }

    getKey(): any {
        return this.data[this.keyIndex];
    }

    getValue(index: number): any {
        return this.data[index];
    }

    findIndex(value: any): number {
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
