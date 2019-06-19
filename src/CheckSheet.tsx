/*
 * Copyright 2019 sukawasatoru
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

import {default as React, FunctionComponent, useCallback, useMemo, useState} from 'react';
import {Button, Col, Container, Modal, Row, Spinner} from "react-bootstrap";
import SocialStyleGraphInput, {Entity} from "./SocialStyleGraphInput";
import SocialStyleGraph from "./SocialStyleGraph";

const questions: Entity[] = [
    {
        name: 'telling1',
        lhDescription: 'ゆっくり慎重に行動する',
        rhDescription: '迅速に行動する',
    },
    {
        name: 'telling2',
        lhDescription: 'ゆっくりソフトに話す',
        rhDescription: '速く強く話す',
    },
    {
        name: 'telling3',
        lhDescription: '発言はうつむきがち',
        rhDescription: '発言は前のめり',
    },
    {
        name: 'telling4',
        lhDescription: '遠慮がちに対話する',
        rhDescription: '遠慮せずに対話する',
    },
    {
        name: 'telling5',
        lhDescription: '思い切った行動はしない',
        rhDescription: '思い切った行動をする',
    },
    {
        name: 'telling6',
        lhDescription: '話すよりも聞く',
        rhDescription: '聞くよりも話す',
    },
    {
        name: 'telling7',
        lhDescription: 'フォロワー志向',
        rhDescription: 'リーダー志向',
    },
    {
        name: 'telling8',
        lhDescription: '決断が遅い',
        rhDescription: '決断が速い',
    },
    {
        name: 'telling9',
        lhDescription: 'リスクを回避する',
        rhDescription: 'リスクを恐れない',
    },
    {
        name: 'telling10',
        lhDescription: 'プレッシャーを与えない',
        rhDescription: 'プレッシャーを与える',
    },
    {
        name: 'telling11',
        lhDescription: '視線を合わせない',
        rhDescription: '視線を合わせる',
    },
];

const questions2: Entity[] = [
    {
        name: 'emotion1',
        lhDescription: '身振り手振りが少ない',
        rhDescription: '身振り手振りが多い',
    },
    {
        name: 'emotion2',
        lhDescription: '決められた行動をとる',
        rhDescription: '自由な行動をとる',
    },
    {
        name: 'emotion3',
        lhDescription: '真面目な表情で話す',
        rhDescription: '表情豊かに話す',
    },
    {
        name: 'emotion4',
        lhDescription: 'うちとけにくい',
        rhDescription: '親しみやすい',
    },
    {
        name: 'emotion5',
        lhDescription: 'フォーマル',
        rhDescription: 'カジュアル',
    },
    {
        name: 'emotion6',
        lhDescription: '感情は出さない',
        rhDescription: '感情を出す',
    },
    {
        name: 'emotion7',
        lhDescription: '決断は事実重視',
        rhDescription: '決断は感覚重視',
    },
    {
        name: 'emotion8',
        lhDescription: '仕事志向',
        rhDescription: '人間志向',
    },
    {
        name: 'emotion9',
        lhDescription: '雑談が苦手',
        rhDescription: '雑談が得意',
    },
    {
        name: 'emotion10',
        lhDescription: '時間に厳しい',
        rhDescription: '時間に無頓着',
    },
    {
        name: 'emotion11',
        lhDescription: '規律に従う',
        rhDescription: '自分に従う',
    },
];

export interface Props {
    plotly?: typeof import('plotly.js');
}

const CheckSheet: FunctionComponent<Props> = (props) => {
    const level = 4;
    const [tell, setTell] = useState(new Map<string, number>());
    const [emote, setEmote] = useState(new Map<string, number>());
    const result = useMemo(() => {
        if (tell.size < questions.length || emote.size < questions2.length) {
            return [];
        }

        const xRatio = 100 / questions.length / (level - 1);
        let x = 0;
        for (let value of tell.values()) {
            x += value * xRatio;
        }
        const yRatio = 100 / questions2.length / (level - 1);
        let y = 0;
        for (let value of emote.values()) {
            y += value * yRatio;
        }
        return [{name: 'You', x, y}];
    }, [tell, emote]);
    const [showModal, setShowModal] = useState(false);
    const cbShowModal = useCallback(() => setShowModal(true), [setShowModal]);
    const hideModal = useCallback(() => setShowModal(false), [setShowModal]);

    return <>
        <Container className='my-4'>
            <Row>
                <Col style={{maxWidth: '48em'}}>
                    <SocialStyleGraphInput entities={questions} input={setTell} levelNum={level}/>
                    <SocialStyleGraphInput entities={questions2} input={setEmote} levelNum={level}/>
                    <Row noGutters>
                        <Button
                            className='ml-auto'
                            variant='primary'
                            disabled={result.length === 0}
                            onClick={cbShowModal}
                        >
                            診断
                        </Button>
                    </Row>
                </Col>
            </Row>
        </Container>
        <Modal show={showModal} size='xl' onHide={hideModal}>
            <Modal.Header closeButton onHide={hideModal}>
                <Modal.Title>
                    Social Style
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.plotly === undefined &&
                <div className='mx-auto' style={{width: 'max-content'}}>
                    <Spinner animation='border' variant='primary'/>
                </div>
                }
                {props.plotly &&
                <SocialStyleGraph data={result} plotly={props.plotly}/>
                }
            </Modal.Body>
        </Modal>
    </>;
};

export default CheckSheet;
