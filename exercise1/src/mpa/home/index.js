import React from 'react';
import {createRoot} from 'react-dom/client';
import '../../css/entry1.css';
import '../../less/entry2.less';
import image from '../../imgs/home.jpg';
import {sayHi} from '../../js/common';

class App extends React.Component {
    render() {
        sayHi();
        return <div className="app-text">
            <span>Home</span>
            <img className="app-img" src={image} alt="Home"/>
        </div>;
    }
}

createRoot(document.getElementById('react-app')).render(<App/>);
