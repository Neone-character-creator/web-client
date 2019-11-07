import React from "react";
import { Link } from "react-router-dom";

export default class HandleAuth extends React.Component {
    constructor(props){
        super(props);
        const parsedUrl = new URL(window.location.href);
        const redirectBackToUrl = parsedUrl.searchParams.get("state");
        const googleAuthorizationToken = parsedUrl.searchParams.get("code");
        this.state = {
            redirectBackToUrl
        }
    }

    componentDidMount() {
        this.props.history.push(this.state.redirectBackToUrl);
    }

    render(){
        return(
            <div>
                Redirecting...

                <Link to={this.state.redirectBackToUrl}>
                Click here if this takes more than a second.
                </Link>
            </div>
        )
    }
}