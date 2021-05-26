class Sidebar extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className='sidebar' style={{float: this.props.float, width: this.props.sidebarWidth, height: '100%'}}>
                <button className='sidebar_closebtn' onClick={this.props.close}>xxx</button>
                {this.props.content}
            </div>
        );
    }
}