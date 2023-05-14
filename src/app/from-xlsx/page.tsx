/*
 * Copyright 2019, 2021, 2023 sukawasatoru
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

'use client';

import SocialStyleGraph, {GraphLayout, SocialStyleEntity} from "@/_components/SocialStyleGraph";
import ZoomInOutButton from "@/_components/ZoomInOutButton";
import {createBookByFile} from "@/_function/JsonBook";
import {DeptGraphEntity} from "@/_model/dept-graph-entry";
import {ChangeEvent, JSX, useCallback, useEffect, useMemo, useState} from "react";
import {Container, InputGroup, Row} from "react-bootstrap";

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

export default function FromXLSXPage(): JSX.Element {
  const [graphSize, setGraphSize] = useState(
    () => typeof window !== 'undefined' && 480 <= window.innerWidth ? 480 : 320
  );
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

  const cbSizeChanged = useCallback((size: number) => setGraphSize(size), [setGraphSize]);
  const graphLayout = useMemo<GraphLayout>(() => ({
    width: graphSize,
    height: graphSize,
  }), [graphSize]);

  useEffect(() => {
    void (async () => {
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
        .map(data => new DeptGraphEntity(data.getKey() as string, data.getValue(xIndex), data.getValue(yIndex)))
        .filter(data => typeof data.x === 'number' && typeof data.y === 'number')
        .map(data => data.toSocialStyleEntity());
      setGraphSource(entities);
    })();
  }, [inputFile]);

  return (
    <Container className='my-4' style={{maxWidth: '48em'}}>
      <InputGroup className='mb-2'>
        <div className='custom-file'>
          <input
            id='input-sheet'
            className='custom-file-input'
            type='file'
            accept={supportFileTypes.join(',')}
            onChange={onInputFile}
          />
          <label className='custom-file-label' htmlFor='input-sheet'>
            ソーシャルスタイル診断.xlsx ...
          </label>
        </div>
      </InputGroup>
      <Row noGutters className='mb-1'>
        <ZoomInOutButton defaultSize={graphSize} onSizeChanged={cbSizeChanged}/>
      </Row>
      <SocialStyleGraph data={graphSource} layout={graphLayout}/>
    </Container>
  );
}
