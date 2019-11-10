import React from "react";
import {Modal} from "react-bootstrap";
import _ from "lodash";

export default class CharacterList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(props, state) {
        state.initializing = _.isEmpty(props.characters);
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onEnd}>
                <Modal.Dialog>
                    <Modal.Header closeButton>
                        <Modal.Title>Select Character</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.initializing && "Loading..."}
                        {!this.state.initializing &&
                        <ul>
                            {
                                this.props.characters.map(wrapper => {
                                    const loadThis = () => {
                                        this.props.selectCharacter(wrapper.character).then(this.props.onEnd);
                                    };
                                    return (<li>
                                        <button class="btn btn-link" href="#" onClick={loadThis}>
                                            {wrapper.character.name || `Unnamed Character ${wrapper.id}` }
                                        </button>
                                    </li>);
                                })
                            }
                        </ul>
                        }
                    </Modal.Body>
                </Modal.Dialog>
            </Modal>
        );
    }
}