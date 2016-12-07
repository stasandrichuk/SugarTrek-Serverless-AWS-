import React, { Component } from 'react';
import TextField from 'material-ui/TextField/TextField';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import * as API from '../util/API'
import * as http from '../util/http'
import logo from '../images/sugartrek_logo.png';

var geocoding = require('geocoding')

class SignupPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            business_name: '',
            business_address: '',
            email: '',
            password: '',
            hasError: null
        };
        this.handleUpdate = this.handleUpdate.bind(this);
        this.signupButtonTouchTapped = this.signupButtonTouchTapped.bind(this);
        this.geoCodeAddress = this.geoCodeAddress.bind(this);
    }

    handleUpdate(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    geoCodeAddress(callback) {
        geocoding({address: this.state.business_address}).then(function(results) {
            if (results === null || results.length === 0) {
                callback(null);

            } else {
                var lat = results[0].geometry.location.lat;
                var lon = results[0].geometry.location.lng;

                console.log(lat + "," + lon);
                callback(lat,lon);
            }
        });
    }

    signupButtonTouchTapped(e) {
        e.preventDefault();
        var self = this;

        this.geoCodeAddress(function(lat, lon) {
            if (lat === null) {
                this.setState({hasError: "true"});
            } else {

                var businessBody = {
                    email: self.state.email,
                    password: self.state.password,
                    business_name: self.state.business_name,
                    business_address: self.state.business_address,
                    business_latitude: lat,
                    business_longitude: lon,
                }

                http.oca_post(API.SAVE_BUSINESS_LOGIN, businessBody, function(res) {
                    var businessId = res.text.substring(1,res.text.length-1);
                    console.log("businessId:" + businessId);
                    if (res.text !== '""') {
                        sessionStorage.setItem("businessId", businessId);
                        self.props.history.push('/promotionList');
                    }
                });
            }
        });
    }

    render() {
        var errorStyle = {
            marginTop:'20px',
            color: 'red'
        }

        var hidden = {
            display:'none'
        }

        var textField = {
            width:'100%'
        }

        return (
            <div>
                <form>
                    <div className="div-logo"><img alt="sugartrek logo" src={logo} /></div>
                    <div style={this.state.hasError ? errorStyle : hidden}>Could not find business address</div>
                    <div className="div-center"><TextField name="email" style={textField} hintText="Email Address" floatingLabelText="Email Address" onChange={this.handleUpdate} /></div>
                    <div className="div-center"><TextField name="password" style={textField} type="password" hintText="Password" floatingLabelText="Password" onChange={this.handleUpdate} /></div>
                    <div className="div-center"><TextField name="business_name" style={textField} hintText="Business Name" floatingLabelText="Business Name" onChange={this.handleUpdate} /></div>
                    <div className="div-center"><TextField name="business_address" style={textField} hintText="Street, City, State" floatingLabelText="Business Address" onChange={this.handleUpdate} /></div>
                    <div className="div-center"><RaisedButton className="button" primary label="Signup" onTouchTap={this.signupButtonTouchTapped} /></div>
                </form>
            </div>
        );
    }
}

export default SignupPage