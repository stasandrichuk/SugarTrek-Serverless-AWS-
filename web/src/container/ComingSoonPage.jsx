import React, { Component } from 'react';
import logo from '../images/sugartrek_logo.png';
import '../styles/index.css';

class ComingSoonPage extends Component {

    render() {
        return (
            <div>
                <div className="div-logo"><img alt="sugartrek logo" src={logo} /></div>
                <h2>SugarTrek is coming! Please check back soon for updates.</h2>
            </div>
        );
    }
}

export default ComingSoonPage