import * as React from 'react';
import {useMemo, useState} from 'react';
import {Col, Table, ToggleButton, ToggleButtonGroup} from 'react-bootstrap';

type Props = {
    entities: Entity[];
    levelNum?: number;
    input?: (data: Map<string, number>) => void;
}

export type Entity = {
    name: string;
    lhDescription: string;
    rhDescription: string;
}

const doNothing = (): void => {
    // do nothing.
};

const SocialStyleGraphInput = (props: Props) => {
    const input = useMemo(() => props.input ? props.input : doNothing, [props.input]);
    const levelNum = useMemo(() => props.levelNum ? props.levelNum : 4, [props.levelNum]);
    const [result] = useState(new Map());

    return <Table striped bordered className='table-sm table-hover'>
        <tbody>
        {props.entities.map(data =>
            <tr key={data.name}>
                <td className='pl-4 align-middle'>
                    {data.lhDescription}
                </td>
                <td style={{width: '30%'}}>
                    <Col style={{padding: 0}}>
                        <ToggleButtonGroup
                            type='radio'
                            name={data.name}
                            style={{width: 'inherit'}}
                            onChange={(value: number) => {
                                result.set(data.name, value);
                                input(new Map(result));
                            }}>
                            {[...Array(levelNum).keys()].map(num =>
                                <ToggleButton key={`${name}-${num}`} variant='outline-primary' value={num}>
                                    {num + 1}
                                </ToggleButton>
                            )}
                        </ToggleButtonGroup>
                    </Col>
                </td>
                <td className='pl-4 align-middle'>
                    {data.rhDescription}
                </td>
            </tr>
        )}
        </tbody>
    </Table>;
};

export default SocialStyleGraphInput;
