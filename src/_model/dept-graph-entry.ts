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

import {SocialStyleEntity} from "@/_components/SocialStyleGraph";

export class DeptGraphEntity {
  readonly name: string;
  readonly x: number | undefined;
  readonly y: number | undefined;

  private readonly base: number;
  private readonly ratio: number;

  constructor(name: string, x: unknown, y: unknown) {
    this.name = name;
    this.x = typeof x === 'number' ? x : undefined;
    this.y = typeof y === 'number' ? y : undefined;
    this.base = 50;
    this.ratio = (100 - this.base) / 33;
  }

  toSocialStyleEntity(): SocialStyleEntity {
    return {
      name: this.name,
      x: this.calc(this.x),
      y: this.calc(this.y),
    };
  }

  toString(): string {
    return `GraphEntity{name: ${this.name}, x: ${this.x}, y: ${this.y}}`;
  }

  private calc(data: number | undefined): number {
    return data === undefined ? 0 : this.base + data * this.ratio;
  }
}
