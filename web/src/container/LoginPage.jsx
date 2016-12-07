import React, { Component } from 'react';
import TextField from 'material-ui/TextField/TextField';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import * as API from '../util/API'
import * as http from '../util/http'
import logo from '../images/sugartrek_logo.png';

class LoginPage extends Component {

    constructor(props) {
        super(props);
        this.state = { email: '', password: '', hasError: 'false' };
        this.handleUpdate = this.handleUpdate.bind(this);
        this.loginButtonTouchTapped = this.loginButtonTouchTapped.bind(this);
        this.signupButtonTouchTapped = this.signupButtonTouchTapped.bind(this);
    }

    handleUpdate(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    loginButtonTouchTapped(e) {
        e.preventDefault();
        var self = this;

        var body = {
            email: self.state.email,
            password: self.state.password
        }

        self.setState({hasError: 'false'});

        http.oca_post(API.LOGIN_USER, body, function(res) {
            var businessId = res.text.substring(1,res.text.length-1);
            console.log("businessId:" + businessId);

            if (res.text !== '""') {
                sessionStorage.setItem("businessId", businessId);
                self.props.history.push('/promotionList');

            } else {
                self.setState({hasError: 'true'});
            }
        });
    }

    signupButtonTouchTapped(e) {
        e.preventDefault();
        this.props.history.push('/signup');
    }

    render() {

        var errorStyle = {
            marginTop:'20px',
            color: 'red',
        }

        var hidden = {
            display:'none'
        }

        var textField = {
            width:'100%'
        }

        return (
            <div>
                <div className="div-logo"><img alt="sugartrek logo" src={logo} /></div>
                <div style={this.state.hasError === 'true' ? errorStyle : hidden}>Username or password is incorrect</div>
                <div className="div-center"><TextField name="email" style={textField} hintText="Email Address" floatingLabelText="Email Address" onChange={this.handleUpdate} /></div>
                <div className="div-center"><TextField name="password" style={textField} type="password" hintText="Password" floatingLabelText="Password" onChange={this.handleUpdate} /></div>
                <div className="div-center"><RaisedButton primary className="button" label="Login" onTouchTap={this.loginButtonTouchTapped} /></div>
                <div className="div-center"><RaisedButton secondary className="button" label="Signup" onTouchTap={this.signupButtonTouchTapped} /></div>
            </div>
        );
    }
}

export default LoginPage