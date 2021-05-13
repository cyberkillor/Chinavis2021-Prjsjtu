import React from 'react';
import Script from 'react-load-script';
class DynamicScript extends React.Component {
    constructor(props) {
        super(props);
        this.state = {scriptURL: props.url}
    }
    handleScriptCreate() {
        this.setState({ scriptLoaded: false })
    }

    handleScriptError() {
        this.setState({ scriptError: true })
    }

    handleScriptLoad() {
        this.setState({ scriptLoaded: true})
    }
    render() {
        return (
            <>
                <Script
                    url={this.state.scriptURL}
                    onCreate={this.handleScriptCreate.bind(this)}
                    onError={this.handleScriptError.bind(this)}
                    onLoad={this.handleScriptLoad.bind(this)}
                />
            </>
        );
    }
}
export default DynamicScript;