import React from 'react';
import loadSpinner from "./ajax-loader.gif";
import axios from "axios";
import {Link} from "react-router-dom";

export default class Plugins extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            plugins: []
        };
        axios.get(process.env.REACT_APP_PLUGIN_API_URL + "/plugins").then((response) => {
            this.setState({
                loading: false,
                plugins: response.data
            });
        }, err => {
            this.setState({
                loading: false,
                statusMessage: "The was an error contacting the server."
            });
            console.error(err);
        });
        this.loadDescription = function (plugin) {
            axios.get(`${process.env.REACT_APP_PLUGIN_API_URL}/games/${plugin.author}/${plugin.system}/${plugin.version}/pages/info`)
                .then(response => {
                    this.setState({
                        description: response.data
                    })
                }, err => {
                    console.error(err);
                })
        };

        this.loadDescription = this.loadDescription.bind(this);
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 scrollable">
                        <div className="row">
                            <div className="center-block">
                                Welcome to the NEOne Character creator v{process.env.REACT_APP_VERSION}.
                            </div>
                        </div>
                        <div className="row">
                            Select a system below to get started:
                            <div className="list-group" id="available-plugins">
                            </div>
                        </div>
                        <div className="row">
                            <ul>
                                {this.state.plugins.map(plugin => {
                                    return (<li onMouseEnter={this.loadDescription.bind(null, plugin)}>
                                        <Link to={`/plugins/${plugin.author}/${plugin.system}/${plugin.version}`}>
                                            {plugin.system} {plugin.version} by {plugin.author}
                                        </Link>
                                    </li>)
                                })}
                            </ul>
                            {!this.state.loading && this.state.plugins.length === 0 && this.state.statusMessage}
                        </div>
                    </div>
                    <div className="col-md-6 scrollable" id="plugin-description"
                         style={{height: 100, minHeight: 100}}
                         dangerouslySetInnerHTML={{__html: this.state.description}}>
                    </div>
                </div>
                < div
                    className="row">
                    {
                        this.state.loading &&
                        <img id="spinner" class="mx-auto" src={loadSpinner} alt="Plugins are loading"/>
                    }
                </div>
            </div>
        );
    }
}