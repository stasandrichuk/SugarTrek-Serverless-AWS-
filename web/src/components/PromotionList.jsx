import React, { Component } from 'react';
import Table from 'material-ui/Table/Table'
import TableRow from 'material-ui/Table/TableRow'
import TableHeader from 'material-ui/Table/TableHeader'
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn'
import TableBody from 'material-ui/Table/TableBody'
import TableRowColumn from 'material-ui/Table/TableRowColumn'
import FlatButton from 'material-ui/FlatButton/FlatButton';
import * as API from '../util/API'
import * as http from '../util/http'

class PromotionList extends Component {

    constructor(props) {
        super(props);
        this.state = { promotions: [] };
        this.startButtonTouchTapped = this.startButtonTouchTapped.bind(this);
    }

    handleRowSelection(rowIds) {
        console.log("row selection");
        var self = this;

        console.log(rowIds);

        var selectedPromotion = this.state.promotions[rowIds[0]];

        var body = {
            promotionId: selectedPromotion.id
        }

        http.oca_post(API.SAVE_PROMOTION_INSTANCE, body, function (res) {
            var data = res.text;
            console.log("promotion instance: " + data);

            var notificationBody = {
                promotionId: selectedPromotion.id
            }
            http.oca_post(API.SEND_NOTIFICATION_FOR_PROMOTION, notificationBody, function(res) {
                console.log("sent notifications");
                self.forceUpdate();
            })
        });
    }

    deleteButtonTouchTapped(e) {
        e.preventDefault();
        console.log("deleting");
    }

    startButtonTouchTapped(e) {

        var selectedPromotionId = e.currentTarget.name;

        var body = {
            promotionId: selectedPromotionId
        }

        http.oca_post(API.SAVE_PROMOTION_INSTANCE, body, function (res) {
            var data = res.text;
            console.log("promotion instance: " + data);

            var notificationBody = {
                promotionId: selectedPromotionId
            }
            http.oca_post(API.SEND_NOTIFICATION_FOR_PROMOTION, notificationBody, function(res) {
                console.log("sent notifications");
            })
        });

        //console.log(e.currentTarget.name);

        //console.log(this.state.promotions);
        //console.log("button clicked");
    }

    componentWillMount() {
        var self = this;
        var newPromotions = [];

        var businessId = sessionStorage.getItem("businessId")

        var query = {
            businessId: businessId
        }

        http.oca_get(API.GET_PROMOTIONS, query, function(res) {
            var promotions = res.body;
            if (res.body != null) {
                promotions.forEach(function (promotion) {
                    var id = promotion.promotionId;
                    var message = promotion.promotionMessage;
                    var numberAvailable = promotion.promotionNumberAvailable;
                    var minimumUsers = promotion.promotionMinimumUsers;
                    var currentTimeLeft = promotion.currentTimeLeft;

                    newPromotions.push({id: id, promotion: message, numberAvailable: numberAvailable, minimumUsers: minimumUsers, timeLeft: currentTimeLeft});
                });
                self.setState({promotions: newPromotions});
            }
        });
    }

    renderTableRow(promotion) {
        return (
            <TableRow key={promotion.id}>
                <TableRowColumn>{promotion.promotion}</TableRowColumn>
                <TableRowColumn>{promotion.numberAvailable}</TableRowColumn>
                <TableRowColumn>{promotion.minimumUsers}</TableRowColumn>
                <TableRowColumn>{promotion.timeLeft != null ? promotion.timeLeft : <FlatButton name={promotion.id} secondary label="start" onTouchTap={this.startButtonTouchTapped} /> }</TableRowColumn>
            </TableRow>
        )
    }

    render() {
        return (
            <Table fixedHeader>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn>Promotion</TableHeaderColumn>
                        <TableHeaderColumn>Number Available</TableHeaderColumn>
                        <TableHeaderColumn>Minimum Users</TableHeaderColumn>
                        <TableHeaderColumn>Actions</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false} showRowHover>
                    {this.state.promotions.map(promotion =>
                        this.renderTableRow(promotion)
                    )}
                </TableBody>
            </Table>
        )
    }
}

export default PromotionList