/*
 * Copyright 2023 sukawasatoru
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

import styles from "@/_components/AppNavBar.module.css";
import clsx from "clsx";
import {Route} from "next";
import Link from "next/link";
import {useSelectedLayoutSegment} from "next/navigation";
import {FC} from "react";
import {Nav, Navbar, NavbarBrand} from "react-bootstrap";

const AppNavBar: FC<{ isGhPages: boolean }> = ({isGhPages}) => {
  const activeNavItem = useSelectedLayoutSegment();

  return (
    <Navbar bg='primary' variant='dark'>
      {isGhPages ?
        <NavbarBrand className={styles.brandStyle}>
          Social Styles
        </NavbarBrand>
        :
        <Link className={clsx('navbar-brand', styles.brandStyle)} href={'/' as Route}>
          Social Styles
        </Link>
      }
      <Nav>
        {
          !isGhPages && <>
            <Nav.Item className={clsx(activeNavItem === null && 'active')}>
              <Link className='nav-link' href={'/' as Route}>
                診断する
              </Link>
            </Nav.Item>
            <Nav.Item className={clsx(activeNavItem === 'from-xlsx' && 'active')}>
              <Link className='nav-link' href='/from-xlsx'>
                ファイルの読み込み
              </Link>
            </Nav.Item>
          </>
        }
      </Nav>
    </Navbar>
  );
};

export default AppNavBar;
