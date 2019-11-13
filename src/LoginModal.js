import React from "react";
import {Modal} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";

export default class LoginModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.initializeGoogle = this.initializeGoogle.bind(this);
    }

    initializeGoogle(element) {
        window.gapi.auth2.getAuthInstance().attachClickHandler(element, {}, (googleUser) => {
            this.props.onComplete();
        }, error => {
            alert("Something went wrong when logging in. If problem persists, please try a private browser window.");
            console.error(error);
        });
        this.setState({
            googleInitialized: true
        });
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onEnd}>
                <Modal.Dialog>
                    <Modal.Header closeButton>
                        <Modal.Title>Select Auth Provider</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {<div id="googleLoginButton" className="btn btn-block btn-social btn-google g-signin2"
                              hidden={!this.state.googleInitialized} ref={this.initializeGoogle}>
                            <FontAwesomeIcon icon={faGoogle}/>Sign in with Google
                        </div>}
                    </Modal.Body>
                </Modal.Dialog>
            </Modal>
        )
    }
}