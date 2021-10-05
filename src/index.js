require('file-loader?name=[name].[ext]!./index.html');
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from 'components/App.js';

import './index.css';
import '/node_modules/weather-icons/css/weather-icons.min.css';
import '/node_modules/weather-icons/css/weather-icons-wind.min.css';

const appElement = document.getElementById('app');

ReactDOM.render(<App />, appElement);