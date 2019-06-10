import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {Nav, Navbar} from 'react-bootstrap';
import CheckSheet from './check-sheet';
import DeptSocialStyles from './dept-social-styles';
import 'bootstrap/dist/css/bootstrap.css';
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
