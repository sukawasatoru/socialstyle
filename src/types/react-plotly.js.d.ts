import {FunctionComponent} from 'react';
import {PlotParams} from "react-plotly.js";
import * as Plotly from 'plotly.js';

export declare function plotComponentFactory(plotly: typeof Plotly): FunctionComponent<PlotParams>;
