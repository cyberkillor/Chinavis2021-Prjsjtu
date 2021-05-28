
const colorSchemePollution = ['rgb(0, 255, 0)', 'rgb(255, 255, 0)', 'rgb(255, 126, 0)', 'rgb(255, 0, 0)', 'rgb(153, 0, 76)', 'rgb(126, 0, 35)'];
const pollutionLevelDefinition = {
    'so2': {
        '20': 0,
        '60': 1,
        '800': 2,
        '1600': 3,
        '2100': 4,
        '2620': 5,
    },
    'no2': {
        '20': 0,
        '40': 1,
        '280': 2,
        '565': 3,
        '750': 4,
        '940': 5,
    },
    'pm10': {
        '40': 0,
        '70': 1,
        '350': 2,
        '420': 3,
        '500': 4,
        '600': 5,
    },
    'co': {
        '2': 0,
        '4': 1,
        '24': 2,
        '36': 3,
        '48': 4,
        '60': 5,
    },
    'o3': {
        '100': 0,
        '160': 1,
        '265': 2,
        '800': 3
    },
    'pm25': {
        '0': 0,
    }
}

class ChartTimelineZoomable {
    constructor(data, config) {
        this.data = data;
        this.config = config;

        this.svg = d3.create('svg');
        this.gradient = this.svg.append('linearGradient')
        this.path = this.svg.append('path');
        this.axisX = this.svg.append('g');
        this.axisY = this.svg.append('g');
        this.backgroudLine = this.svg.append('g')
            .append('rect');
        this.monthLabel = this.svg.append('g')
            .classed('monthLabel', true)
            .append('text');
        this.cityLabel = this.svg.append('g')
            .classed('cityLabel', true)
            .append('text');
    }

    update(data = this.data, config = this.config) {
        // update data and config
        this.data = data;
        this.config = config;

        const height = config.height || 100;
        const width = config.width || 800;
        const margin = config.margin || ({ top: 30, right: 30, bottom: 1, left: 30 });
        this.svg.attr('viewBox', [0, 0, width, height]);

        const column = config.column || data.columns[0];
        const colorScheme = config.colorScheme || (pollutionLevelDefinition[column] && Object.entries(pollutionLevelDefinition[column]).map(([value, level]) => ({ value: value.toString(), color: colorSchemePollution[level] }))) || [{ value: "0", color: colorSchemePollution[0] }];


        // variables
        let zoomScale = 1,
            xz = null,
            chosenMonth = null;

        // constants
        const scaleMonth = 1,
            scaleDate = 0.6,
            scaleDateSmall = 0,
            circleR = 16,
            dateZoomThresholdStart = 3,
            dateZoomThresholdEnd = 12;

        // update x and y axis
        const x = d3.scaleUtc()
            .domain(d3.extent(data, d => d.date))
            .range([margin.left, width - margin.right]);
        xz = x;

        const y = d3.scaleLinear()
            .domain([0, d3.max(data.map(d => d[column])) || 1]).nice()
            .range([height - margin.bottom, margin.top]);

        //         this.axisX.selectAll('*').remove();
        //         this.axisX.attr('transform', 'translate(' + 0 + ' ' + (height - margin.bottom) + ')')
        //                 .call(d3.axisBottom(x));

        //         this.axisY.selectAll('*').remove();
        //         this.axisY.attr('transform', 'translate(' + margin.left + ' ' + 0 + ')')
        //                 .call(d3.axisLeft(y));

        // update chart content
        this.backgroudLine
            .attr('transform', 'translate(' + margin.left + ' ' + (height - margin.bottom) + ')')
            .attr('width', width - margin.right - margin.left)
            .attr('height', '1')
            .attr('fill', 'white');

        this.monthLabel
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('transform', 'translate(' + margin.left + ' ' + (height - margin.bottom - 40) + ') scale(1.5)')
            .text('');

        this.cityLabel
            .attr('text-anchor', 'start')
            .attr('alignment-baseline', 'middle')
            .attr('transform', 'translate(' + (margin.left + 100) + ' ' + (height - margin.bottom - 40) + ') scale(1)')
            .text((city.province == null)? '' : city.province + ' ' + city.city);

        const timeLabels = this.svg.selectAll('.timeLabel')
            .data(data.filter(d => d.date.getHours() == 0))
            .join('g')
            .classed('timeLabel', true)
            .attr('transform', d => 'translate(' + x(d.date) + ' ' + (height - margin.bottom - 10) + ') '
                + 'scale(' + (calcTimeLabelScale(d)) + ')');

        function calcTimeLabelScale(d) {
            if (chosenMonth != null && d.date.getMonth() + 1 != chosenMonth) {
                return 0;
            } else if (chosenMonth == null && d.date.getDate() == 1) {
                return scaleMonth;
            } else if (chosenMonth != null && d.date.getTime() == getDate().getTime()) {
                return scaleMonth;
            } else if (chosenMonth != null && d.date.getDate() == 1) {
                return scaleDate;
            } else if (zoomScale < dateZoomThresholdStart) {
                return scaleDateSmall;
            } else if (zoomScale > dateZoomThresholdEnd) {
                return scaleDate;
            } else {
                return scaleDateSmall + (scaleDate - scaleDateSmall) * (zoomScale - dateZoomThresholdStart) / (dateZoomThresholdEnd - dateZoomThresholdStart);
            }
        }

        timeLabels.selectAll('*').remove();

        timeLabels
            .append('circle')
            .attr('r', circleR)
            .attr('stroke', 'none')
            .attr('fill', 'transparent');

        timeLabels
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .text(calcTimeLabelText);

        function calcTimeLabelText(d) {
            if (chosenMonth != null && d.date.getMonth() + 1 != chosenMonth) {
                return '';
            } else if (d.date.getDate() == 1) {
                if (zoomScale >= dateZoomThresholdStart) {
                    return '1';
                } else {
                    return d.date.getMonth() + 1 + '月';
                }
            } else {
                return d.date.getDate();
            }
        }

        const area = (data, x) => d3.area()
            .curve(d3.curveNatural)
            .x(d => x(d.date))
            .y0(y(0))
            .y1(d => y(d[column]))
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
            .attr('d', area(data, xz));

        // zoom
        const zoom = d3.zoom()
            .scaleExtent([1, 32])
            .extent([[margin.left, 0], [width - margin.right, height]])
            //.translateExtent([[margin.left, -Infinity], [width - margin.right, Infinity]])
            .on("zoom", zoomed.bind(this));

        this.svg.call(zoom);

        function zoomed(event) {
            //const oldZoomScale = zoomScale;
            zoomScale = event.transform.k;
            //console.log(zoomScale);
            xz = event.transform.rescaleX(x);
            this.path.attr("d", area(data, xz));
            // this.axisX.call(d3.axisBottom(xz));
            timeLabels
                .attr('transform', d => 'translate(' + xz(d.date) + ' ' + (height - margin.bottom - 10) + ') '
                    + 'scale(' + (calcTimeLabelScale(d)) + ')');
            timeLabels.selectAll('text')
                .text(calcTimeLabelText);
        }

        // custom events
        timeLabels.on('click', timeLabelClickHandler.bind(this));
        function timeLabelClickHandler(e, d) {
            this.svg
                .transition()
                .duration(300)
                .call(zoom.translateTo, x(new Date(d.date.getFullYear(), d.date.getMonth(), 1)), 0, [margin.left, 0])
                .transition()
                .duration(500)
                .call(zoom.scaleTo, dateZoomThresholdEnd, [margin.left, 0]);

            setDate({ year: d.date.getFullYear(), month: d.date.getMonth() + 1, date: d.date.getDate() });
            chosenMonth = d.date.getMonth() + 1;
            this.monthLabel.text(chosenMonth + '月');
        }
        let d = { date: getDate() };
        this.svg
            .call(zoom.translateTo, x(new Date(d.date.getFullYear(), d.date.getMonth(), 1)), 0, [margin.left, 0])
            .call(zoom.scaleTo, dateZoomThresholdEnd, [margin.left, 0]);

        setDate({ year: d.date.getFullYear(), month: d.date.getMonth() + 1, date: d.date.getDate() });
        chosenMonth = d.date.getMonth() + 1;
        this.monthLabel.text(chosenMonth + '月');

        timeLabels.on('mouseenter', timeLabelMouseenterHandler);
        function timeLabelMouseenterHandler(e, d) {
            d3.select(this)
                .select('circle')
                .transition()
                .duration(500)
                .attr('fill', 'white');
        }

        timeLabels.on('mouseleave', timeLabelMouseleaveHandler);
        function timeLabelMouseleaveHandler(e, d) {
            d3.select(this)
                .select('circle')
                .transition()
                .duration(500)
                .attr('fill', 'transparent');
        }

        this.monthLabel.on('click', svgMouseleaveHandler.bind(this));
        function svgMouseleaveHandler(e, d, target) {
            this.svg
                .transition()
                .duration(500)
                .call(zoom.scaleTo, 1, [margin.left, 0])
                .transition()
                .duration(300)
                .call(zoom.translateTo, x(data[0].date), 0, [margin.left, 0]);
            chosenMonth = null;
            this.monthLabel.text('');
        }
    }
}