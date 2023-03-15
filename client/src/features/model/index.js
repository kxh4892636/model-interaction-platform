//引入react核心库
import React from 'react'
//引入ReactDOM
import { createRoot } from 'react-dom/client';
// 路由
import {BrowserRouter} from 'react-router-dom'
//引入App
import App from './App'



const container = document.getElementById('root');
const root = createRoot(container);
root.render(	
    <BrowserRouter>
        <App/>
    </BrowserRouter>
)