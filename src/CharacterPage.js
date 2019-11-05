import React from "react";
import {Container, Modal} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export default class CharacterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.beginLoginFlow = () => {
            this.setState({
                loginInProgress: true
            })
        };

        this.endLoginFlow = () => {
            this.setState({
                loginInProgress: false
            });
        };

        this.beginLoginFlow = this.beginLoginFlow.bind(this);


    }

    render() {
        let {version, author, system} = this.props.match.params;
        return (
            <Container id="character-page-container">
                <Modal show={this.state.loginInProgress} onHide={this.endLoginFlow}>
                    <Modal.Dialog >
                        <Modal.Header closeButton>
                            <Modal.Title>Select Auth Provider</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <a className="btn btn-block btn-social btn-google">
                                <FontAwesomeIcon icon={faGoogle} />Sign in with Google
                            </a>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal>
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
                                <a className="nav-link" href="#" id="save-character">
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
                <div className="row text-center" id="signin-warning">
                    <div className="container">
                        <button className="btn btn-link login-menu" type="button" id="login" onClick={this.beginLoginFlow}>
                            You're not logged in. Login here to save, load and delete characters.
                        </button>
                    </div>
                </div>
                <div className="row text-center" id="signout">
                    <button className="btn btn-link logout" type="button" id="logout">
                        Click here to logout.
                    </button>
                </div>
                <div className="embed-responsive">
                    <iframe src={`/games/${author}/${system}/${version}`} id="content"
                            className="embed-responsive-item">

                    </iframe>
                </div>
            </Container>
        )
    }
}