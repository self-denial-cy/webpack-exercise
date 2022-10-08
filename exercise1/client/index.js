const React=require('react');
require('../src/css/entry1.css');
require('../src/less/entry2.less');
const image=require('../src/imgs/1.png');

class Home extends React.Component {
    render() {
        return <div className="app-text">
            <span>富婆饿饿饭饭</span>
            <img className="app-img" src={image} alt="富婆饿饿饭饭"/>
        </div>;
    }
}

module.exports = <Home/>;
