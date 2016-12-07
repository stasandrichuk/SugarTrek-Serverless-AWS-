import React, { Component } from 'react';
import PromotionList from '../components/PromotionList'
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import Paper from 'material-ui/Paper/Paper'

class PromotionPage extends Component {

    constructor(props) {
        super(props);
        this.addPromotionTouchTapped = this.addPromotionTouchTapped.bind(this);
    }

    componentWillMount() {
        if (sessionStorage.getItem("businessId") == null) {
            this.props.history.push('/');
        }
    }

    addPromotionTouchTapped(e) {
        e.preventDefault();
        this.props.history.push('/addPromotion');
    }

    render() {
        var divStyle = {
            marginTop:'20px'
        }

        var paperStyle = {
            marginLeft: '50px',
            marginRight: '50px'
        }

        var buttonStyle = {
            marginLeft: '50px',
            marginRight: '50px',
            marginBottom: '20px'
        }

        return (
            <div style={divStyle}>
                <div><RaisedButton primary style={buttonStyle} label="Add Promotion" onTouchTap={this.addPromotionTouchTapped} /></div>
                <Paper style={paperStyle}>
                    <PromotionList />
                </Paper>
            </div>
        )
    }
}

export default PromotionPage