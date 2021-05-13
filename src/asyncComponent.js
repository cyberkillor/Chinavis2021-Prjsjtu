import React from "react";

// 支持按需载入的包装组件
export function asyncComponent (importComponent) {
    class AsyncComponent extends React.Component {
        constructor (props) {
            super(props);

            this.state = {
                component: null
            };
        }

        componentDidMount () {
            importComponent()
                .then(cmp => {
                    this.setState({ component: cmp.default });
                });
        }

        render () {
            const C = this.state.component;

            return C ? <C {...this.props} /> : null;
        }
    }

    return AsyncComponent;
}