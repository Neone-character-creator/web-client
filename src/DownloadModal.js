import React from "react";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

export default class DownloadModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<Modal show={this.props.show}>
            <Modal.Dialog>
                <Modal.Title>

                </Modal.Title>
                <Modal.Body>
                    <Container>
                        <Row>
                            <a href={this.props.exportUrl}>
                                Click here to download
                            </a>
                        </Row>
                    </Container>

                </Modal.Body>
            </Modal.Dialog>
        </Modal>);
    }
}