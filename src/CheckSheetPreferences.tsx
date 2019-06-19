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

import {default as React, FormEvent, FunctionComponent, useCallback, useState} from 'react';
import {Form} from "react-bootstrap";

interface Props {
    defaultQuestionLevel: number;
    onQuestionLevelChanged?: (level: number) => any;
}

const CheckSheetPreferences: FunctionComponent<Props> = (props) => {
    const [questionLevel, setQuestionLevel] = useState(props.defaultQuestionLevel.toString());
    const supportQuestionLevel = [2, 3, 4, 5];
    const cbQuestionLevel = useCallback((event: FormEvent<HTMLFormElement>) => {
        if (props.onQuestionLevelChanged) {
            const value = event.currentTarget.value;
            setQuestionLevel(value);
            props.onQuestionLevelChanged(parseInt(value));
        }
    }, [props, setQuestionLevel]);

    return <Form>
        <Form.Group>
            <Form.Label>
                Level
            </Form.Label>
            <Form.Control as='select' value={questionLevel} onChange={cbQuestionLevel}>
                {supportQuestionLevel.map(level =>
                    <option key={level} value={level}>
                        {level}
                    </option>
                )}
            </Form.Control>
        </Form.Group>
    </Form>;
};

export default CheckSheetPreferences;
