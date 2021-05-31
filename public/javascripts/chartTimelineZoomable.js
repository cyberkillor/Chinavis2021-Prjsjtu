var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var colorSchemePollution = ['rgb(0, 255, 0)', 'rgb(255, 255, 0)', 'rgb(255, 126, 0)', 'rgb(255, 0, 0)', 'rgb(153, 0, 76)', 'rgb(126, 0, 35)'];
var pollutionLevelDefinition = {
    'so2': {
        '20': 0,
        '60': 1,
        '800': 2,
        '1600': 3,
        '2100': 4,
        '2620': 5
    },
    'no2': {
        '20': 0,
        '40': 1,
        '280': 2,
        '565': 3,
        '750': 4,
        '940': 5
    },
    'pm10': {
        '40': 0,
        '70': 1,
        '350': 2,
        '420': 3,
        '500': 4,
        '600': 5
    },
    'co': {
        '2': 0,
        '4': 1,
        '24': 2,
        '36': 3,
        '48': 4,
        '60': 5
    },
    'o3': {
        '100': 0,
        '160': 1,
        '265': 2,
        '800': 3
    },
    'pm25': {
        '0': 0
    }
};

var ChartTimelineZoomable = function () {
    function ChartTimelineZoomable(data, config) {
        _classCallCheck(this, ChartTimelineZoomable);

        this.data = data;
        this.config = config;

        this.svg = d3.create('svg');
        this.gradient = this.svg.append('linearGradient');
        this.path = this.svg.append('path');
        this.axisX = this.svg.append('g');
        this.axisY = this.svg.append('g');
        this.backgroudLine = this.svg.append('g').append('rect');
        this.monthLabel = this.svg.append('g').classed('monthLabel', true).append('text');
        this.cityLabel = this.svg.append('g').classed('cityLabel', true).append('text');
    }

    _createClass(ChartTimelineZoomable, [{
        key: 'update',
        value: function update() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.data;
            var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.config;

            // update data and config
            this.data = data;
            this.config = config;

            var height = config.height || 100;
            var width = config.width || 800;
            var margin = config.margin || { top: 30, right: 30, bottom: 1, left: 30 };
            this.svg.attr('viewBox', [0, 0, width, height]);

            var column = config.column || data.columns[0];
            var colorScheme = config.colorScheme || pollutionLevelDefinition[column] && Object.entries(pollutionLevelDefinition[column]).map(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    value = _ref2[0],
                    level = _ref2[1];

                return { value: value.toString(), color: colorSchemePollution[level] };
            }) || [{ value: "0", color: colorSchemePollution[0] }];

            var defaultDate = config.defaultDate;
            console.log('defaultDate:', defaultDate);

            // variables
            var zoomScale = 1,
                xz = null,
                isChoosingMonth = false;

            // constants
            var scaleMonth = 1,
                scaleDate = 0.6,
                scaleDateSmall = 0,
                circleR = 16,
                dateZoomThresholdStart = 3,
                dateZoomThresholdEnd = 12;

            // update x and y axis
            var x = d3.scaleUtc().domain(d3.extent(data, function (d) {
                return d.date;
            })).range([margin.left, width - margin.right]);
            xz = x;

            var y = d3.scaleLinear().domain([0, d3.max(data.map(function (d) {
                return d[column];
            })) || 1]).nice().range([height - margin.bottom, margin.top]);

            //         this.axisX.selectAll('*').remove();
            //         this.axisX.attr('transform', 'translate(' + 0 + ' ' + (height - margin.bottom) + ')')
            //                 .call(d3.axisBottom(x));

            //         this.axisY.selectAll('*').remove();
            //         this.axisY.attr('transform', 'translate(' + margin.left + ' ' + 0 + ')')
            //                 .call(d3.axisLeft(y));

            // update chart content
            this.backgroudLine.attr('transform', 'translate(' + margin.left + ' ' + (height - margin.bottom) + ')').attr('width', width - margin.right - margin.left).attr('height', '1').attr('fill', 'white');

            this.monthLabel.attr('text-anchor', 'start').attr('alignment-baseline', 'middle').attr('transform', 'translate(' + width * 0.03 + ' ' + (height - margin.bottom - 40) + ') scale(1.5)').text(isChoosingMonth ? '' : defaultDate.getMonth() + 1 + '月');

            this.cityLabel.attr('text-anchor', 'start').attr('alignment-baseline', 'middle').attr('transform', 'translate(' + (margin.left + 100) + ' ' + (height - margin.bottom - 40) + ') scale(1)').text(city.province == null ? '' : city.province + ' ' + city.city);

            var timeLabels = this.svg.selectAll('.timeLabel').data(data.filter(function (d) {
                return d.date.getHours() == 0;
            })).join('g').classed('timeLabel', true).attr('transform', function (d) {
                return 'translate(' + x(d.date) + ' ' + (height - margin.bottom - 10) + ') ' + 'scale(' + calcTimeLabelScale(d) + ')';
            });

            function calcTimeLabelScale(d) {
                if (!isChoosingMonth && d.date.getTime() == defaultDate.getTime()) {
                    return scaleMonth;
                } else if (!isChoosingMonth && d.date.getDate() == 1) {
                    return scaleDate;
                } else if (isChoosingMonth && d.date.getDate() == 1) {
                    return scaleMonth;
                } else if (zoomScale < dateZoomThresholdStart) {
                    return scaleDateSmall;
                } else if (zoomScale > dateZoomThresholdEnd) {
                    return scaleDate;
                } else {
                    return scaleDateSmall + (scaleDate - scaleDateSmall) * (zoomScale - dateZoomThresholdStart) / (dateZoomThresholdEnd - dateZoomThresholdStart);
                }
            }

            timeLabels.selectAll('*').remove();

            timeLabels.append('circle').attr('r', circleR).attr('stroke', 'none').attr('fill', 'transparent');

            timeLabels.append('text').attr('text-anchor', 'middle').attr('alignment-baseline', 'middle').text(calcTimeLabelText);

            function calcTimeLabelText(d) {
                if (d.date.getDate() == 1) {
                    if (isChoosingMonth || zoomScale < dateZoomThresholdStart || d.date.getMonth() != defaultDate.getMonth()) {
                        return d.date.getMonth() + 1 + '月';
                    } else {
                        return '1';
                    }
                } else {
                    return d.date.getDate();
                }
            }

            var area = function area(data, x) {
                return d3.area().curve(d3.curveNatural).x(function (d) {
                    return x(d.date);
                }).y0(y(0)).y1(function (d) {
                    return y(d[column]);
                })(data);
            };

            var gradientID = Math.floor(Math.random() * 999999).toString();
            var stops = this.gradient.attr('id', gradientID).attr('gradientUnits', 'userSpaceOnUse').attr('x1', 0).attr('y1', height - margin.bottom).attr('x2', 0).attr('y2', margin.top).selectAll('stop').data(colorScheme);
            stops.enter().append('stop').attr('offset', function (d) {
                return d.value / y.domain()[1];
            }).attr('stop-color', function (d) {
                return d.color;
            });
            stops.attr('stop-color', function (d) {
                return d.color;
            }).transition().duration(1000).attr('offset', function (d) {
                return d.value / y.domain()[1];
            });
            stops.exit().remove();

            this.path.attr('fill', 'url(#' + gradientID + ')').attr('d', area(data, xz));

            // zoom
            var zoom = d3.zoom().scaleExtent([1, 32]).extent([[margin.left, 0], [width - margin.right, height]])
            //.translateExtent([[margin.left, -Infinity], [width - margin.right, Infinity]])
            .on("zoom", zoomed.bind(this));

            this.svg.call(zoom).call(zoom.translateTo, x(new Date(defaultDate.getFullYear(), defaultDate.getMonth(), 1)), 0, [margin.left, 0]).call(zoom.scaleTo, dateZoomThresholdEnd, [margin.left, 0]);

            function zoomed(event) {
                //const oldZoomScale = zoomScale;
                zoomScale = event.transform.k;
                //console.log(zoomScale);
                xz = event.transform.rescaleX(x);
                this.path.attr("d", area(data, xz));
                // this.axisX.call(d3.axisBottom(xz));
                timeLabels.attr('transform', function (d) {
                    return 'translate(' + xz(d.date) + ' ' + (height - margin.bottom - 10) + ') ' + 'scale(' + calcTimeLabelScale(d) + ')';
                });
                timeLabels.selectAll('text').text(calcTimeLabelText);
                this.monthLabel.text(isChoosingMonth ? '' : defaultDate.getMonth() + 1 + '月');
            }

            // custom events
            timeLabels.on('click', timeLabelClickHandler.bind(this));
            function timeLabelClickHandler(e, d) {
                // this.svg
                //     .transition()
                //     .duration(300)
                //     .call(zoom.translateTo, x(new Date(d.date.getFullYear(), d.date.getMonth(), 1)), 0, [margin.left, 0])
                //     .transition()
                //     .duration(500)
                //     .call(zoom.scaleTo, dateZoomThresholdEnd, [margin.left, 0]);

                setDate({ year: d.date.getFullYear(), month: d.date.getMonth() + 1, date: d.date.getDate() });
                // chosenMonth = d.date.getMonth() + 1;
                // this.monthLabel.text(chosenMonth + '月');
            }

            timeLabels.on('mouseenter', timeLabelMouseenterHandler);
            function timeLabelMouseenterHandler(e, d) {
                d3.select(this).select('circle').transition().duration(0).attr('fill', 'white');
            }

            timeLabels.on('mouseleave', timeLabelMouseleaveHandler);
            function timeLabelMouseleaveHandler(e, d) {
                d3.select(this).select('circle').transition().duration(500).attr('fill', 'transparent');
            }

            this.monthLabel.on('click', svgMouseleaveHandler.bind(this));
            function svgMouseleaveHandler(e, d, target) {
                this.svg.transition().duration(500).call(zoom.scaleTo, 1, [margin.left, 0]).transition().duration(300).call(zoom.translateTo, x(data[0].date), 0, [margin.left, 0]);
                isChoosingMonth = true;
            }
        }
    }]);

    return ChartTimelineZoomable;
}();