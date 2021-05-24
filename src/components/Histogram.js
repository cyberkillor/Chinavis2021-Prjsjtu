import * as d3 from "d3";
import React from "react";
import ReactDOM from "react-dom"

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

const colorSchemePollution = ['green', 'yellow', 'orange', 'red', 'purple', 'black', 'black'];
const pollutionLevelDefinition = {
    'PM2.5(微克每立方米)': {
        '15': 0,
        '20': 2,
        '25': 3,
        '35': 4,
        '999': 5,
    },
    ' PM10(微克每立方米)': {
        '15': 0,
        '20': 2,
        '25': 3,
        '35': 4,
        '999': 5,
    }
}

function smoothAccessor(radius, accessor) {
    return function(d, i, array) {
        if (i - radius < 0 || i + radius + 1 >= array.length) {
            return accessor(d, i, array);
        } else {
            let sum = 0;
            for (let j = i - radius; j < i + radius + 1; j++) {
                sum += accessor(d, j, array);
            }
            return sum / (2 * radius + 1);
        }
    }
}

class ChartCurvePollution {
    constructor(data, config) {
        this.data = data;
        this.config = config;

        this.svg = d3.create('svg');
        this.gradient = this.svg.append('linearGradient')
        this.path = this.svg.append('path');
        this.axisX = this.svg.append('g');
        this.axisY = this.svg.append('g');
    }

    update(data=this.data, config=this.config) {
        this.data = data;
        this.config = config;

        const height = config.height || 480;
        const width = config.width || 800;
        const margin = config.margin || ({top: 30, right: 30, bottom: 30, left: 30});
        this.svg.attr('viewBox', [0, 0, width, height]);

        const column = config.column || data.columns[0];
        const colorScheme = config.colorScheme || (pollutionLevelDefinition[column] && Object.entries(pollutionLevelDefinition[column]).map(([value, level]) => ({value: value.toString(), color: colorSchemePollution[level]}))) || [{value: "0", color: colorSchemePollution[0]}];
        const smoothRange = Number.parseInt(config.smoothRange) || 0;

        const x = d3.scaleLinear()
            .domain([0, data.length])
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data.map(smoothAccessor(smoothRange, (d, i, array) => array[i][column])))]).nice()
            .range([height - margin.bottom, margin.top]);

        const area = (data, x) => d3.area()
            .curve(d3.curveStepAfter)
            .x((d, i) => x(i))
            .y0(y(0))
            .y1(smoothAccessor(smoothRange, (d, i, array) => y(array[i][column])))
            (data);

        const gradientID = Math.floor(Math.random() * 999999).toString();
        const stops = this.gradient
            .attr('id', gradientID)
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', 0).attr('y1', height - margin.bottom)
            .attr('x2', 0).attr('y2', margin.top)
            .selectAll('stop')
            .data(colorScheme);
        stops.enter()
            .append('stop')
            .attr('offset',
                d => d.value / y.domain()[1])
            .attr('stop-color', d => d.color);
        stops.attr('stop-color', d => d.color)
            .transition()
            .duration(1000)
            .attr('offset',
                d => d.value / y.domain()[1]);
        stops.exit().remove();

        this.path.attr('fill', 'url(#' + gradientID + ')')
            .transition()
            .duration(1000)
            .attr('d', area(data, x));

        this.axisX.selectAll('*').remove();
        this.axisX.attr('transform', 'translate(' + 0 + ' ' + (height - margin.bottom) + ')')
            .call(d3.axisBottom(x));

        this.axisY.selectAll('*').remove();
        this.axisY.attr('transform', 'translate(' + margin.left + ' ' + 0 + ')')
            .call(d3.axisLeft(y));
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
        this.state = {column: props.data.columns[0], smoothRange: '0'};

        this.handleChangeColumn = this.handleChangeColumn.bind(this);
        this.handleChangeSmoothRange = this.handleChangeSmoothRange.bind(this);
    }

    handleChangeColumn(event) {
        this.setState({column: event.target.value});
    }

    handleChangeSmoothRange(event) {
        this.setState({smoothRange: event.target.value});
    }

    render() {
        return (
            <div>
                <label>
                    污染物:
                    <select value={this.state.column} onChange={this.handleChangeColumn}>
                        {this.props.data.columns.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </label>
                <label>
                    平滑度:
                    <select value={this.state.smoothRange} onChange={this.handleChangeSmoothRange}>
                        <option value='0'>0</option>
                        <option value='10'>10</option>
                        <option value='50'>50</option>
                        <option value='100'>100</option>
                    </select>
                </label>
                <D3Chart chartType={this.props.chartType} data={this.props.data} config={{column: this.state.column, smoothRange: this.state.smoothRange}} />
            </div>
        );
    }
}

let headers = new Headers();
let username = "share";
let password = "123456";

headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));

let pollutant, month, day;
let url = `https://nas.tonychen.page:5006/WebDavShare/ChinaVis%202021%20Data/${month}/CN-Reanalysis-daily-${month}${day}00.csv`;

fetch("https://nas.tonychen.page:5006/WebDavShare/ChinaVis%202021%20Data/201708/CN-Reanalysis-daily-2017083100.csv", {headers: headers})
    .then(r => r.text())
    .then(t => {
        const csv = d3.csvParse(t, d3.autoType);
        ReactDOM.render(
            <div>
                <D3ChartWithColumnSelect chartType={ChartCurvePollution} data={csv} />
                <D3ChartWithColumnSelect chartType={ChartTest} data={csv} />
            </div>,
            document.getElementById('root')
        );
    })