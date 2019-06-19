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

import {default as React, useCallback, useMemo, useState} from 'react';
import plotComponentFactory from 'react-plotly.js/factory';
import {Button, ButtonGroup, Container, Row} from 'react-bootstrap';

const createPoint = (name: string, x: number, y: number): import('plotly.js').Data => {
    return {
        x: [x],
        y: [y],
        text: name,
        textposition: 'top center',
        type: 'scatter',
        mode: 'text+markers',
        hoverinfo: 'x+y',
    };
};

export interface SocialStyleEntity {
    name: string;
    x: number;
    y: number;
}

const socialStyleLayout: Partial<import('plotly.js').Layout> = {
    showlegend: false,
    hovermode: 'closest',
    margin: {t: 0, b: 0, l: 0, r: 0},
    xaxis: {
        zeroline: false,
        showticklabels: false,
        range: [-5, 105],
        hoverformat: '.1f',
    },
    yaxis: {
        zeroline: false,
        showticklabels: false,
        range: [-5, 105],
        hoverformat: '.1f',
    },
    shapes: [
        {
            type: 'line',
            line: {width: 1},
            x0: 50,
            y0: -10,
            x1: 50,
            y1: 110,
        },
        {
            type: 'line',
            line: {width: 1},
            x0: -10,
            y0: 50,
            x1: 110,
            y1: 50,
        }
    ],
    annotations: [
        {
            x: 85,
            y: 100,
            text: 'エクスプレッシブ',
            showarrow: false,
        },
        {
            x: 85,
            y: 0,
            text: 'エミアブル',
            showarrow: false,
        },
        {
            x: 10,
            y: 0,
            text: 'アナリティカル',
            showarrow: false,
        },
        {
            x: 10,
            y: 100,
            text: 'ドライビング',
            showarrow: false,
        },
    ],
};

interface Props {
    data: SocialStyleEntity[];
    layout?: Partial<import('plotly.js').Layout>;
    plotly: typeof import('plotly.js');
}

const SocialStyleGraph = (props: Props) => {
    const Plot = plotComponentFactory(props.plotly);
    const [windowSize, setWindowSize] = useState(() => 480 <= window.innerWidth ? 480 : 320);
    const plotlyLayout = useMemo(() => {
        const data = props.layout ? props.layout : socialStyleLayout;
        return {
            ...data,
            width: windowSize,
            height: windowSize,
        };
    }, [props.layout, windowSize]);
    const cbZoomOut = useCallback(() => setWindowSize(prevState => prevState - 20), [setWindowSize]);
    const cbZoomIn = useCallback(() => setWindowSize(prevState => prevState + 20), [setWindowSize]);

    return <Container>
        <Row className='mb-1'>
            <ButtonGroup>
                <Button variant='outline-primary' onClick={cbZoomOut}>
                    <i className='material-icons'>
                        zoom_out
                    </i>
                </Button>
                <Button variant='outline-primary' onClick={cbZoomIn}>
                    <i className='material-icons'>
                        zoom_in
                    </i>
                </Button>
            </ButtonGroup>
        </Row>
        <Row>
            <Plot
                className='border border-primary'
                data={props.data.map(data => createPoint(data.name, data.x, data.y))}
                layout={plotlyLayout}
            />
        </Row>
    </Container>;
};

export default SocialStyleGraph;

