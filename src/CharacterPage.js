import _ from "lodash";
import React from "react";
import {Container} from "react-bootstrap";
import LoginModal from "./LoginModal";
import axios from "axios";
import CharacterList from './CharacterList';
import spinner from "./ajax-loader.gif";
import ContactModal from "./ContactModal";
import DownloadModal from "./DownloadModal";

export default class CharacterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contentLoading: true,
            loggedIn: false,
            loadedCharacters: []
        };

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
        this.endLoginFlow = this.endLoginFlow.bind(this);
        this.logout = () => {
            global.gapi.auth2.getAuthInstance().disconnect().then(() => {
                this.setState({
                    user: null
                });
            });
        };
        this.doSave = character => {
            window.gapi.load("auth2", async () => {
                const {version, author, system} = this.props.match.params;
                const isExistingCharacter = character.id !== undefined;
                const endpointUrl = !character.id ? process.env.REACT_APP_PLUGIN_API_URL + `/games/${author}/${system}/${version}/characters` :
                    process.env.REACT_APP_PLUGIN_API_URL + `/games/${author}/${system}/${version}/characters/${character.id}`;
                axios({
                    method: isExistingCharacter ? 'PUT' : 'POST',
                    url: endpointUrl,
                    data: character,
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${this.state.user.Zi.id_token}`,
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    const postSaveCharacterData = response.data;
                    this.contentIframe.contentWindow.postMessage({
                        action: 'set-character',
                        character: JSON.stringify(postSaveCharacterData)
                    }, process.env.REACT_APP_PLUGIN_API_URL);
                    alert("Character saved")
                }, error => {
                    alert("There was an error saving the character");
                });
            });
        };
        this.doExport = character => {
            window.gapi.load("auth2", async () => {
                const {version, author, system} = this.props.match.params;
                const endpointUrl = process.env.REACT_APP_PLUGIN_API_URL + `/games/${author}/${system}/${version}/characters/pdf`;
                axios({
                    method: 'POST',
                    url: endpointUrl,
                    data: character,
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${this.state.user.Zi.id_token}`,
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    this.setState({
                        exportId: response.data,
                        exportInProgress: true
                    });
                }, error => {
                    alert("There was an error during the export");
                    console.error(error);
                });
            });
        };

        this.logout = this.logout.bind(this);
        this.actionCorrelations = {};
        window.addEventListener("message", event => {
            switch (this.actionCorrelations[event.data.correlationId]) {
                case "save":
                    this.doSave(event.data.character);
                    break;
                case "export":
                    this.doExport(event.data.character);
                    break;
                default:
                    console.warn(`${this.actionCorrelations[event.data.correlationId]} not handled`);
            }
        });
        this.initiateSave = () => {
            const correlationId = Math.random() * (Number.MAX_SAFE_INTEGER - Number.MIN_SAFE_INTEGER) + Number.MIN_SAFE_INTEGER;
            this.actionCorrelations[correlationId] = "save";
            this.contentIframe.contentWindow.postMessage({
                action: "get-character",
                correlationId
            }, process.env.REACT_APP_PLUGIN_API_URL);
        };
        this.initiateSave = this.initiateSave.bind(this);

        this.initiateNew = () => {
            var proceed = window.confirm("This will lose any current unsaved data.");
            if (proceed) {
                this.contentIframe.contentWindow.postMessage({

                });
            }
        };

        this.initiateLoad = () => {
            const {version, author, system} = this.props.match.params;
            this.setState({
                    loadInProgress: true
                }, () => {
                    axios.get(process.env.REACT_APP_PLUGIN_API_URL + `/games/${author}/${system}/${version}/characters`, {
                        headers: {
                            authorization: `Bearer ${this.state.user.Zi.id_token}`
                        }
                    }).then(response => {
                        this.setState({
                            loadedCharacters: response.data
                        })
                    }, error => {
                        alert("There was an error loading the characters from the server");
                    })
                }
            );
        };
        this.selectCharacter = async character => {
            this.contentIframe.contentWindow.postMessage({
                action: "set-character",
                character: JSON.stringify(character)
            }, process.env.REACT_APP_PLUGIN_API_URL);
        };
        this.endLoadFlow = async () => {
            this.setState({
                loadInProgress: false
            });
        };

        this.contentLoaded = () => {
            this.setState({
                contentLoading: false
            });
        };

        this.beginContactFlow = () => {
            this.setState({
                contactInProgress: true
            });
        };
        this.endContactFlow = () => {
            this.setState({
                contactInProgress: false
            });
        };

        this.exportToPdf = () => {
            const correlationId = Math.random() * (Number.MAX_SAFE_INTEGER - Number.MIN_SAFE_INTEGER) + Number.MIN_SAFE_INTEGER;
            this.actionCorrelations[correlationId] = "export";
            this.contentIframe.contentWindow.postMessage({
                action: "get-character",
                correlationId
            }, process.env.REACT_APP_PLUGIN_API_URL);
        };

        this.endExportFlow = () => {
            this.setState({
                exportInProgress: false
            });
        };

        this.loadCharacterIfAuthorized = () => {
            if (this.state.user) {
                const {version, author, system} = this.props.match.params;
                axios({
                    method: 'GET',
                    url: process.env.REACT_APP_PLUGIN_API_URL + `/games/${author}/${system}/${version}/characters/${this.props.match.params.characterId}`,
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${this.state.user.Zi.id_token}`,
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    const character = response.data.character;
                    this.selectCharacter(character);
                }, error => {
                    console.error(error);
                    alert("Something went wrong loading the character");
                });
            }
        }
    }

    componentDidMount() {
        window.gapi.load("auth2", async () => {
            const auth = await global.gapi.auth2.getAuthInstance();
            const user = global.gapi.auth2.getAuthInstance().currentUser.get();
            this.setState({
                user: user.Zi ? user : null
            }, () => {
                if (this.props.match.params.characterId) {
                    this.loadCharacterIfAuthorized();
                }
            });
            global.gapi.auth2.getAuthInstance().currentUser.listen(user => {
                this.setState({
                    user: user.Zi ? user : null
                });
                if (this.props.match.params.characterId) {
                    this.loadCharacterIfAuthorized();
                }
            });
        });
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        const {version, author, system, characterId} = this.props.match.params;
        if(_.isNull(nextState.user) && characterId) {
            const {version, author, system} = this.props.match.params;
            this.props.history.replace(`/plugins/${author}/${system}/${version}`);
        }
    }

    render() {
        const {version, author, system} = this.props.match.params;
        return (
            <Container id="character-page-container">
                <LoginModal show={this.state.loginInProgress} onEnd={this.endLoginFlow} onComplete={this.endLoginFlow}/>
                <CharacterList show={this.state.loadInProgress} characters={this.state.loadedCharacters}
                               onEnd={this.endLoadFlow}
                               onSelect={this.selectCharacter} selectCharacter={this.selectCharacter}/>
                <ContactModal show={this.state.contactInProgress} onEnd={this.endContactFlow}
                              onComplete={this.endContactFlow}/>
                <DownloadModal show={this.state.exportInProgress} onEnd={this.endExportFlow}
                               onComplete={this.endExportFlow}
                               exportUrl={process.env.REACT_APP_PLUGIN_API_URL + `/games/${author}/${system}/${version}/characters/pdf/${this.state.exportId}`}
                />
                <div className="container">
                    <nav id="navbar" className="navbar navbar-expand-md bg-light">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <button className="btn btn-link" href="#" onClick={this.initiateNew} id="new-character">
                                    <span className="glyphicon glyphicon-file"/>
                                    New Character
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-link" href={this.state.user ? "#" : undefined}
                                        id="save-character"
                                        onClick={this.initiateSave}
                                        disabled={this.state.user === undefined}>
                                    <span className="glyphicon glyphicon-floppy-save"/>
                                    Save Character
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-link" href={this.state.user ? "#" : undefined}
                                        id="open-character"
                                        disabled={this.state.user === undefined}
                                        onClick={this.initiateLoad}>
                                    <span className="glyphicon glyphicon-floppy-open"/>
                                    Open Character
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-link" href={this.state.user ? "#" : undefined}
                                        id="delete-character"
                                        disabled={this.state.user === undefined}>
                                    <span className="glyphicon glyphicon-floppy-remove"/>
                                    Delete Character
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-link" href={this.state.user ? "#" : undefined}
                                        id="export-character"
                                        disabled={this.state.user === undefined}
                                        onClick={this.exportToPdf}>
                                    <span className="glyphicon glyphicon-download-alt"/>
                                    Export to PDF
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-link" href="#"
                                        id="contact"
                                        onClick={this.beginContactFlow}>
                                    Contact Us
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
                {!this.state.user && <div className="row text-center" id="signin-warning">
                    <div className="container">
                        <button className="btn btn-link login-menu" type="button" id="login"
                                onClick={this.beginLoginFlow}>
                            You're not logged in. Login here to save, load and delete characters.
                        </button>
                    </div>
                </div>}
                {this.state.user && <div className="row text-center" id="signout">
                    <div className="container">
                        <button className="btn btn-link logout" type="button" id="logout" onClick={this.logout}>
                            Click here to logout.
                        </button>
                    </div>
                </div>}
                {this.state.contentLoading && <div className="row text-center">
                    <div className="container">
                        <img src={spinner} alt="Loading"></img>
                    </div>
                </div>}
                <div className="embed-responsive embed-responsive-16by9 bordered">

                    <iframe
                        title="Plugin content"
                        src={process.env.REACT_APP_PLUGIN_API_URL + `/pluginresource/${author}/${system}/${version}`}
                        id="content"
                        onLoad={this.contentLoaded}
                        className="embed-responsive-item" ref={element => {
                        this.contentIframe = element
                    }}>
                    </iframe>
                </div>
            </Container>
        )
    }
}