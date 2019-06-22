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

import {default as React, FunctionComponent, useCallback} from 'react';
import {ToggleButton, ToggleButtonGroup} from "react-bootstrap";

interface Props {
    defaultGrading: Grading;
    onGradingChanged?: (grading: Grading) => any;
}

interface GradingButtonPayload {
    label: string;
    description: string;
}

type GradingButtonsType = { [key in Grading]: GradingButtonPayload };

const gradingButtons: GradingButtonsType = {
    dept3: {
        label: 'ソーシャルスタイル診断.xlsx',
        description: '帰社日に使用した選択とバイアスを使用する',
    },
    original2: {
        label: '2択',
        description: '2択を使用する',
    },
    original5: {
        label: '5択',
        description: 'オリジナルのバイアスの 5択を使用する',
    },
    original7: {
        label: '7択',
        description: 'オリジナルのバイアスの 7択を使用する',
    },
    original10: {
        label: '10択',
        description: 'オリジナルのバイアスの 10択を使用する',
    },
};

type Grading = 'dept3' | 'original2' | 'original5' | 'original7' | 'original10';

const CheckSheetPreferences: FunctionComponent<Props> = (props) => {
    const cbQuestionSelection = useCallback((grading: Grading) => {
        if (props.onGradingChanged) {
            props.onGradingChanged(grading);
        }
    }, [props]);

    return <ToggleButtonGroup
        name='grading'
        vertical
        defaultValue={props.defaultGrading}
        style={{width: '100%'}}
        onChange={cbQuestionSelection}
    >
        {Object.entries(gradingButtons).map(([key, value]) =>
            <ToggleButton key={key} className='text-left btn-block' variant='outline-primary' value={key}>
                <div>
                    {value.label}:
                </div>
                <div>
                    {value.description}
                </div>
            </ToggleButton>
        )}
    </ToggleButtonGroup>;
};

export {Grading};
export default CheckSheetPreferences;
