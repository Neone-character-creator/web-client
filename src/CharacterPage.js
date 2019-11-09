import React from "react";
import {Container} from "react-bootstrap";
import LoginModal from "./LoginModal";

export default class CharacterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: localStorage.getItem("googleUser") != null
        };
        this.beginLoginFlow = () => {
            this.setState({
                loginInProgress: true
            })
        };

        this.endLoginFlow = () => {
            this.setState({
                loggedIn: localStorage.getItem("googleUser") !== undefined,
                loginInProgress: false
            });
        };

        this.beginLoginFlow = this.beginLoginFlow.bind(this);
        this.endLoginFlow = this.endLoginFlow.bind(this);
        this.logout = () => {
            localStorage.removeItem("googleUser");
            this.setState({
                loggedIn: false
            });
        };
        this.logout = this.logout.bind(this);
        this.initiateSave = () => {
            this.contentIframe.contentWindow.postMessage("get-character");
        };
        this.initiateSave = this.initiateSave.bind(this);
    }

    render() {
        let {version, author, system} = this.props.match.params;
        return (
            <Container id="character-page-container">
                <LoginModal show={this.state.loginInProgress} onLoginComplete={this.endLoginFlow}/>
                <div id="loading-modal" className="modal fade" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div id="modal-content" className="modal-body">
                                Loading...
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <nav id="navbar" className="navbar navbar-expand-md bg-light">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" href="#" id="new-character">
                                    <span className="glyphicon glyphicon-file"/>
                                    New Character
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#" id="save-character" onClick={this.initiateSave}>
                                    <span className="glyphicon glyphicon-floppy-save"/>
                                    Save Character
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#" id="open-character">
                                    <span className="glyphicon glyphicon-floppy-open"/>
                                    Open Character
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#" id="delete-character">
                                    <span className="glyphicon glyphicon-floppy-remove"/>
                                    Delete Character
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#" id="export-character">
                                    <span className="glyphicon glyphicon-download-alt"/>
                                    Export to PDF
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
                {!this.state.loggedIn && <div className="row text-center" id="signin-warning">
                    <div className="container">
                        <button className="btn btn-link login-menu" type="button" id="login"
                                onClick={this.beginLoginFlow}>
                            You're not logged in. Login here to save, load and delete characters.
                        </button>
                    </div>
                </div>}
                {this.state.loggedIn && <div className="row text-center" id="signout">
                    <button className="btn btn-link logout" type="button" id="logout" onClick={this.logout}>
                        Click here to logout.
                    </button>
                </div>}
                <div className="embed-responsive embed-responsive-4by3 bordered">
                    <iframe src={process.env.REACT_APP_PLUGIN_API_URL + `/pluginresource/${author}/${system}/${version}`} id="content"
                            className="embed-responsive-item" ref={element => {this.contentIframe = element}}>
                    </iframe>
                </div>
            </Container>
        )
    }
}