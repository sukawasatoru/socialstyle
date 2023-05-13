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

import {default as React, FunctionComponent, useCallback, useEffect, useState} from 'react';
import {Button, ButtonGroup} from "react-bootstrap";

interface Props {
    defaultSize: number;
    onSizeChanged: (size: number) => void;
}

const ZoomInOutButton: FunctionComponent<Props> = (props) => {
    const [windowSize, setWindowSize] = useState(() => 480 <= window.innerWidth ? 480 : 320);
    const cbZoomOut = useCallback(() => setWindowSize(prevState => prevState - 20), [setWindowSize]);
    const cbZoomIn = useCallback(() => setWindowSize(prevState => prevState + 20), [setWindowSize]);
    useEffect(() => props.onSizeChanged && props.onSizeChanged(windowSize), [props, windowSize]);

    return <ButtonGroup>
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
    </ButtonGroup>;
};

export default ZoomInOutButton;
