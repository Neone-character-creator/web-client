import React from "react";
import {Modal} from "react-bootstrap";
import Row from "react-bootstrap/Row";

export default class ContactModal extends React.Component {

    render() {
        return (<Modal show={this.props.show} onHide={this.props.onEnd}>
            <Modal.Dialog>
                <Modal.Header closeButton>
                    Get In Touch
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <Row>
                            Have comments, suggestions or bug reports? Send an email to <a
                            href="mailto:neonecharactercreatoe@gmail.com">neonecharactercreator@gmail.com</a>.
                        </Row>
                        <Row>
                            When submitting a bug report, please include the url where the bug was encountered.
                        </Row>
                    </div>
                </Modal.Body>
            </Modal.Dialog>
        </Modal>)
    }
}