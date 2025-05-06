// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import './assest/css/style.css'
// import './assest/css/responsive.css'
// import { Provider } from 'react-redux';
// import Store from './Store/store.js';

// ReactDOM.render(
//   <Provider store={Store}>
//     <App />
//   </Provider>,
//   document.getElementById('root')
// );

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import './assest/css/style.css';
import './assest/css/responsive.css';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import store from './store/store'; // Adjusted import
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
<>
<Provider store={store}>
    <App />
  </Provider>
</>
);
