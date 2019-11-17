import React from "react";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import spinner from "./ajax-loader.gif";

export default class DownloadModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {};

        this.downloadStart = () => {
            this.setState.bind(this, {
                downloadInProgress: true
            });
            window.open(this.props.exportUrl, "_target");
        }
    }

    render() {
        return (<Modal show={this.props.show}>
            <Modal.Dialog>
                <Modal.Title>

                </Modal.Title>
                <Modal.Body>
                    <Container>
                        <Row>
                            <button className="btn btn-link" onClick={this.downloadStart} >
                                Click here to download
                            </button>
                        </Row>
                        {this.state.downloadInProgress && <Row>
                            <img alt="Loading in progress" src={spinner}/>
                        </Row>}
                    </Container>

                </Modal.Body>
            </Modal.Dialog>
        </Modal>);
    }
}