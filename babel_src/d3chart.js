class ChartTest {
    constructor(data, config) {
        console.log("chart init", data, config);
        this.svg = d3.create('div');
        this.data = data;
        this.config = config;
        this.svg.append('p').text('init: ' + Object.entries(config));
    }
    
    update(data=this.data, config=this.config) {
        console.log("chart update", data, config);
        this.svg.append('p').text('update: ' + Object.entries(config));
    }
}

class D3Chart extends React.Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
        this._chart = new this.props.chartType(
            this.props.data,
            this.props.config
        );
        
        this._rootNode.appendChild(this._chart.svg.node());
        
        this._chart.update();
    }

    componentDidUpdate() {
        this._chart.update(
           this.props.data,
           this.props.config,
        );
    }

    componentWillUnmount() {
        this._rootNode.removeChild(this._chart.svg.node());
    }

    _setRef(componentNode) {
        this._rootNode = componentNode;
    }

    render() {
        return (
            <div className="d3chart-container" ref={this._setRef.bind(this)} />
       );
    }
}

class D3ChartWithColumnSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = { column: props.data.columns[props.defaultColumnIndex || 0] };

        this.handleChangeColumn = this.handleChangeColumn.bind(this);
    }

    handleChangeColumn(event) {
        this.setState({ column: event.target.value });
    }

    render() {
        return (
            <div>
                <label>
                    <select value={this.state.column} onChange={this.handleChangeColumn}>
                        {this.props.data.columns.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </label>
                <D3Chart chartType={this.props.chartType} data={this.props.data} config={{ column: this.state.column, }} />
            </div>
        );
    }
}