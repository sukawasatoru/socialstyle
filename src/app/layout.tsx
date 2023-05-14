/*
 * Copyright 2021, 2023 sukawasatoru
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

import AppNavBar from "@/_components/AppNavBar";
import AppProvider from "@/app/_app-component/AppProvider";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'material-design-icons/iconfont/material-icons.css';
import {Metadata} from "next";
import process from "process";
import {JSX, ReactNode} from "react";

export const metadata: Metadata = {
  title: 'Social Styles',
};

export default function RootLayout(
  {children, graphmodal}: { children: ReactNode; graphmodal: ReactNode },
): JSX.Element {
  const basePath = getBasePath();

  return (
    <html lang="ja">
    <body>
    <AppProvider>
      <AppNavBar basePath={basePath}/>
      {children}
      {graphmodal}
    </AppProvider>
    </body>
    </html>
  );
}

function getBasePath(): string {
  // #44197 basePath for <Link/>.
  return process.env.PATH_CONTEXT ?? '';
}
