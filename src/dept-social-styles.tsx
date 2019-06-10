import * as React from 'react';
import {ChangeEvent, FunctionComponent, useCallback, useEffect, useState} from 'react';
import {Container, InputGroup, Row, Spinner} from "react-bootstrap";
import {createBookByFile} from "./json-book";
import SocialStyleGraph, {SocialStyleEntity} from "./social-style-graph";

const supportFileTypes = [
    '.xlsx',
    '.xlsb',
    '.xlsm',
    '.xls',
    '.xml',
    '.csv',
    '.txt',
    '.ods',
    '.fods',
    '.uos',
    '.sylk',
    '.dif',
    '.dbf',
    '.prn',
    '.qpw',
    '.123',
    '.wb*',
    '.wq*',
    '.html',
    '.htm',
];

class DeptGraphEntity {
    readonly name: string;
    readonly x: number | undefined;
    readonly y: number | undefined;

    private readonly base: number;
    private readonly ratio: number;

    constructor(name: any, x: any, y: any) {
        this.name = name;
        this.x = typeof x === 'number' ? x : undefined;
        this.y = typeof y === 'number' ? y : undefined;
        this.base = 50;
        this.ratio = (100 - this.base) / 33;
    }

    toSocialStyleEntity(): SocialStyleEntity {
        return {
            name: this.name,
            x: this.calc(this.x),
            y: this.calc(this.y),
        };
    }

    toString(): string {
        return `GraphEntity{name: ${this.name}, x: ${this.x}, y: ${this.y}}`;
    }

    private calc(data: number | undefined): number {
        return data === undefined ? 0 : this.base + data * this.ratio;
    }
}

export interface Props {
    plotly?: typeof import('plotly.js');
}

const DeptSocialStyles: FunctionComponent<Props> = (props) => {
    const [inputFile, setInputFile] = useState<File>();
    const [graphSource, setGraphSource] = useState<SocialStyleEntity[]>([]);
    const onInputFile = useCallback((args: ChangeEvent<HTMLInputElement>) => {
        if (!args.target.files) {
            return
        }

        const file = args.target.files.item(0);
        if (!file) {
            return;
        }

        setInputFile(file);
    }, [setInputFile]);

    useEffect(() => {
        const load = async () => {
            if (!inputFile) {
                return;
            }

            const book = await createBookByFile(inputFile);
            const sheet = book.getSheetByName('採点入力');
            if (!sheet) {
                console.log('Sheet not found: 採点入力');
                return;
            }
            sheet.headerRowIndex = 0;
            sheet.payloadStartRowIndex = 1;
            sheet.keyColumnIndex = 1;
            const xIndex = sheet.findColumnIndex('感情軸（横）');
            const yIndex = sheet.findColumnIndex('主張軸（縦）');
            const entities: SocialStyleEntity[] = Array.from(sheet.records())
                .map(data => new DeptGraphEntity(data.getKey(), data.getValue(xIndex), data.getValue(yIndex)))
                .filter(data => typeof data.x === 'number' && typeof data.y === 'number')
                .map(data => data.toSocialStyleEntity());
            setGraphSource(entities);
        };

        // noinspection JSIgnoredPromiseFromCall
        load();
    }, [inputFile]);

    return <Container className='my-4'>
        <Row className='mb-2'>
            <InputGroup style={{maxWidth: '48em'}}>
                <div className='custom-file'>
                    <input
                        id='input-sheet'
                        className='custom-file-input'
                        type='file'
                        accept={supportFileTypes.join(',')}
                        onChange={onInputFile}
                    />
                    <label className='custom-file-label' form='input-sheet'>
                        ソーシャルスタイル診断.xlsx ...
                    </label>
                </div>
            </InputGroup>
        </Row>
        <Row>
            {props.plotly === undefined &&
            <div className='mx-auto' style={{width: 'max-content'}}>
                <Spinner animation='border' variant='primary'/>
            </div>
            }
            {props.plotly &&
            <SocialStyleGraph data={graphSource} plotly={props.plotly}/>
            }
        </Row>
    </Container>;
};

export default DeptSocialStyles;
