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

import {default as React, useCallback, useEffect, useState} from 'react';
import {Nav, Navbar} from 'react-bootstrap';
import CheckSheet from './CheckSheet';
import DeptSocialStyles from './DeptSocialStyles';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'material-design-icons/iconfont/material-icons.css';
import './app.css';

type PageType = 'checkSheet' | 'user';

const App = () => {
    const [currentPage, setCurrentPage] = useState<PageType>('checkSheet');
    const [plotly, setPlotly] = useState<typeof import('plotly.js') | undefined>();
    const cbSetCurrentPage = useCallback(eventKey => setCurrentPage(eventKey), [setCurrentPage]);
    useEffect(() => {
        const load = async (): Promise<void> => setPlotly(await import('plotly.js'));
        // noinspection JSIgnoredPromiseFromCall
        load();
    }, [setPlotly]);

    return <>
        <Navbar bg='primary' variant='dark' onSelect={cbSetCurrentPage}>
            <Navbar.Brand>Social Styles</Navbar.Brand>
            <Nav defaultActiveKey='checkSheet'>
                <Nav.Link eventKey='checkSheet'>診断する</Nav.Link>
                <Nav.Link eventKey='user'>ファイルの読み込み</Nav.Link>
            </Nav>
        </Navbar>
        {currentPage === 'checkSheet' && <CheckSheet plotly={plotly}/>}
        {currentPage === 'user' && <DeptSocialStyles plotly={plotly}/>}
    </>;
};

export default App;
