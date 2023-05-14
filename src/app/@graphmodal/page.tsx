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

import SocialStyleGraph from "@/_components/SocialStyleGraph";
import {graphResultState, isGraphModalOpenState} from "@/app/_app-store/graph-modal-state";
import {JSX, useCallback, useMemo} from "react";
import {Modal} from "react-bootstrap";
import {useRecoilState, useRecoilValue} from "recoil";

export default function GraphModal(): JSX.Element {
  const graphLayout = useMemo(() => {
    return typeof window === 'undefined' || window.innerWidth < 480 ?
      {
        width: 320,
        height: 320,
      } :
      {
        width: 480,
        height: 480,
      };
  }, []);

  const [showModal, setShowModal] = useRecoilState(isGraphModalOpenState);
  const hideModal = useCallback(() => setShowModal(false), [setShowModal]);

  const result = useRecoilValue(graphResultState);

  return (
    <Modal show={showModal} size='xl' onHide={hideModal}>
      <Modal.Header closeButton onHide={hideModal}>
        <Modal.Title>
          Social Style
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='px-0'>
        <div className='mx-auto' style={{width: 'max-content'}}>
          <SocialStyleGraph data={result} layout={graphLayout}/>
        </div>
      </Modal.Body>
    </Modal>
  );
}
