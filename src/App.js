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
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Plugins} />
                    <Route path="/plugins/:author/:system/:version" component={CharacterPage} />
                </Switch>
            </Router>
        );
    }
}