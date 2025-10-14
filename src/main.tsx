import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// å¼•å…¥ Tailwind åŸºç¡€æ ·å¼
import './styles/tailwind.css';
import '@reactflow/node-resizer/dist/style.css';
import './i18n';
import '@reactflow/node-resizer/dist/style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

