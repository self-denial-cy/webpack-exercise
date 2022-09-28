import React from 'react';
import {createRoot} from 'react-dom/client';
import '../../css/entry1.css';
import '../../less/entry2.less';
import image from '../../imgs/index.gif';

class App extends React.Component {
    render() {
        return <div className="app-text">
            <span>Index</span>
            <img className="app-img" src={image} alt="Index"/>
        </div>;
    }
}

createRoot(document.getElementById('react-app')).render(<App/>);
