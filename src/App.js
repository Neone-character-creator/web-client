import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Plugins from "./Plugins";
import CharacterPage from "./CharacterPage";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        window.gapi.load("auth2", () => {
            this.auth2 = window.gapi.auth2.init({
                client_id: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
                cookiepolicy: "single_host_origin"
            });
        });
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Plugins}/>
                    <Route path="/plugins/:author/:system/:version" component={CharacterPage}/>
                </Switch>
            </Router>
        );
    }
}