import React from 'react';
import ReactDOM from 'react-dom';
import './css/entry1.css';

class App extends React.Component {
    render() {
        return <div className="app-text">App Text</div>;
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));
