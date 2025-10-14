import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// 引入 Tailwind 基础样式
import './styles/tailwind.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

