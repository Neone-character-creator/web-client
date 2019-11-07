import React from "react";
import {Modal} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import axios from "axios";


export default class LoginModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {};

        // this.beginGoogleLogin = async () => {
        //     const response = await axios.post(process.env.REACT_APP_GOOGLE_OAUTH_ENDPOINT_URL);
        //     const authUrl = response.data.redirectUrl;
        //     const parsedUrl = new URL(authUrl);
        //     parsedUrl.searchParams.set("redirect_uri", `${window.location.protocol}//${window.location.hostname}:${window.location.port}/handleAuth`);
        //     parsedUrl.searchParams.set("state", window.location.pathname);
        //     window.location = parsedUrl.toString();
        // }
        this.initializeGoogle = this.initializeGoogle.bind(this);
    }

    initializeGoogle(element) {
        window.gapi.load("auth2", () => {
            const clientId = console.log(process.env)
            this.auth2 = window.gapi.auth2.init({
                client_id: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
                cookiepolicy: "single_host_origin"
            });
            this.auth2.attachClickHandler(element, {}, (googleUser) => {
                localStorage.setItem("googleUser", googleUser.getId());
                this.props.onLoginComplete();
            }, error => {
                console.error(error);
            });
            this.setState({
                googleInitialized: true
            });
        });
    }

    render(){
        return (
            <Modal show={this.props.show} onHide={this.endLoginFlow}>
                <Modal.Dialog >
                    <Modal.Header closeButton>
                        <Modal.Title>Select Auth Provider</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {<div id="googleLoginButton" className="btn btn-block btn-social btn-google g-signin2" hidden={!this.state.googleInitialized} ref={this.initializeGoogle} >
                            <FontAwesomeIcon icon={faGoogle} />Sign in with Google
                        </div>}
                    </Modal.Body>
                </Modal.Dialog>
            </Modal>
        )
    }
}