import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router'
import App from './container/App';
//import ComingSoonPage from './container/ComingSoonPage'
import MainPage from './container/MainPage';
import LoginPage from './container/LoginPage';
import SignupPage from './container/SignupPage'
import PromotionPage from './container/PromotionPage';
import AddPromotionPage from './container/AddPromotionPage';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import './styles/index.css';

injectTapEventPlugin();

const muiTheme = getMuiTheme({
    fontFamily: 'sans-serif',
    appBar: {
        color: '#619DE5',
    },
    textField: {
        primaryTextColor: '#ffffff'
    },
    flatButton: {
        primaryTextColor: '#ffffff'
    },
    palette: {
        primary1Color: '#619DE5',
    }
});

const routes = <Route component={App}>
    <Route path="/" component={MainPage} />
    <Route path="/main" component={MainPage} />
    <Route path="/login" component={LoginPage} />
    <Route path="/signup" component={SignupPage} />
    <Route path="/promotionList" component={PromotionPage} />
    <Route path="/addPromotion" component={AddPromotionPage} />
</Route>

ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
        <div>
            <Router history={hashHistory}>{routes}</Router>
        </div>
    </MuiThemeProvider>,
  document.getElementById('root')
);
