import React from 'react';
import {createRoot} from 'react-dom/client';
import './css/entry1.css';
import image from './imgs/1.png';

class App extends React.Component {
    render() {
        return <div className="app-text">
            <span>富婆饿饿饭饭</span>
            <img className="app-img" src={image} alt="富婆饿饿饭饭"/>
            <div className="bg-img"></div>
        </div>;
    }
}

createRoot(document.getElementById('react-app')).render(<App/>);
