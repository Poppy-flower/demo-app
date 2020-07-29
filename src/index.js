// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';
//
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
//
// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();


/**
 * 手写 react-redux

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import App from './my_react-redux/App';
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux';
import store from './my_react-redux/store';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

 */

/**
 * 学习context
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './context学习/App';
// import App from './context学习/官方demo_动态context值/App';
// import App from './context学习/官方demo_嵌套组件更新context/App';
import App from './context学习/官方demo_消费多个context/App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App theme={'light'} signedInUser={"hahah"}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

