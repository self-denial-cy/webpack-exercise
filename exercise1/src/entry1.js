import React from 'react';
import ReactDOM from 'react-dom';
import './css/entry1.css';
import image from './imgs/1.png';

class App extends React.Component {
    render() {
        return <div className="app-text">
            <span>App Text</span>
            <img src={image}/>
        </div>;
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));
