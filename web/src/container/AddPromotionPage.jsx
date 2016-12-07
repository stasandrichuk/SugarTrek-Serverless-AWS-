import React, { Component } from 'react';
import TextField from 'material-ui/TextField/TextField';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
//import DatePicker from 'material-ui/DatePicker/DatePicker'
import * as API from '../util/API'
import * as http from '../util/http'

class AddPromotionPage extends Component {

    constructor(props) {
        super(props);
        this.state = { description: '', numberAvailable: 0, minimumUsers: 0 };
        this.handleUpdate = this.handleUpdate.bind(this);
        this.addPromotionButtonTapped = this.addPromotionButtonTapped.bind(this);
    }

    componentWillMount() {
        if (sessionStorage.getItem("businessId") == null) {
            this.props.history.push('/');
        }
    }

    handleUpdate(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    addPromotionButtonTapped(e) {
        e.preventDefault();
        var self = this;

        var businessId = sessionStorage.getItem("businessId")

        var body = {
            promotion_message: self.state.description,
            promotion_number_available: self.state.numberAvailable,
            promotion_minimum_users: self.state.minimumUsers,
            promotion_business_id: businessId
        }

        http.oca_post(API.SAVE_PROMOTION, body, function (res) {
            var data = res.text;
            console.log(data)
            if (data !== "") {
                self.props.history.goBack();
            }
        });
    }

    render() {
        var divStyle = {
            marginLeft:'20px'
        }

        var buttonDivStyle = {
            marginTop:'20px'
        }

        return (
            <div style={divStyle}>
                <form>
                    <div><TextField name="description" hintText="Promotion Description" floatingLabelText="Promotion Description" onChange={this.handleUpdate} /></div>
                    <div><TextField name="numberAvailable" type="number" hintText="Number Available" floatingLabelText="Number Available" onChange={this.handleUpdate} /></div>
                    <div><TextField name="minimumUsers" hintText="Minimum Players" floatingLabelText="Minimum Players" onChange={this.handleUpdate} /></div>
                    <div style={buttonDivStyle}>
                        <RaisedButton primary label="Save" onTouchTap={this.addPromotionButtonTapped} />
                    </div>
                </form>
            </div>
        );
    }
}

export default AddPromotionPage