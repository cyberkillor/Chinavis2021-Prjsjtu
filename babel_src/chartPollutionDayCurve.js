
const colorSchemePollution = ['green', 'yellow', 'orange', 'red', 'purple', 'black'];
const pollutionLevelDefinition = {
    'so2': {
        '0': 0,
        '800': 2,
        '1600': 3,
        '2100': 4,
        '2620': 5,
    },
    'no2': {
        '0': 0,
        '280': 2,
        '565': 3,
        '750': 4,
        '940': 5,
    },
    'pm10': {
        '0': 0,
        '350': 2,
        '420': 3,
        '500': 4,
        '600': 5,
    },
    'co': {
        '0': 0,
        '24': 2,
        '36': 3,
        '48': 4,
        '60': 5,
    },
    'o3': {
        '0': 0,
        '265': 2,
        '800': 3
    },
}

class ChartPollutionDayCurve {
    constructor(data, config) {
        this.data = data;
        this.config = config;

        this.svg = d3.create('svg');
        this.gradient = this.svg.append('linearGradient')
        this.path = this.svg.append('path');
        this.axisX = this.svg.append('g');
        this.axisY = this.svg.append('g');
    }

    update(data = this.data, config = this.config) {
        if (this.data == null) {
            return;
        }

        this.data = data;
        this.config = config;

        const height = config.height || 480;
        const width = config.width || 800;
        const margin = config.margin || ({ top: 30, right: 30, bottom: 30, left: 30 });
        this.svg.attr('viewBox', [0, 0, width, height]);

        const column = config.column || data.columns[0];
        const colorScheme = config.colorScheme || (pollutionLevelDefinition[column] && Object.entries(pollutionLevelDefinition[column]).map(([value, level]) => ({ value: value.toString(), color: colorSchemePollution[level] }))) || [{ value: "0", color: colorSchemePollution[0] }];

        const x = d3.scaleLinear()
            .domain([0, 23])
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data.map(d => d[column]))]).nice()
            .range([height - margin.bottom, margin.top]);

        const area = (data, x) => d3.area()
            .curve(d3.curveNatural)
            .x(d => x(d['hour']))
            .y0(y(0))
            .y1(d => y(d[column]))
            (data);

        /*
        this.path.transition()
                .duration(1000)
                .attr('fill', 'red')
                .attr('d', area(data, x));
                */

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
