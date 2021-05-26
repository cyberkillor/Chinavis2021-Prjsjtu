var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var colorSchemePollution = ['green', 'yellow', 'orange', 'red', 'purple', 'black'];
var pollutionLevelDefinition = {
    'so2': {
        '0': 0,
        '800': 2,
        '1600': 3,
        '2100': 4,
        '2620': 5
    },
    'no2': {
        '0': 0,
        '280': 2,
        '565': 3,
        '750': 4,
        '940': 5
    },
    'pm10': {
        '0': 0,
        '350': 2,
        '420': 3,
        '500': 4,
        '600': 5
    },
    'co': {
        '0': 0,
        '24': 2,
        '36': 3,
        '48': 4,
        '60': 5
    },
    'o3': {
        '0': 0,
        '265': 2,
        '800': 3
    }
};

var ChartPollutionDayCurve = function () {
    function ChartPollutionDayCurve(data, config) {
        _classCallCheck(this, ChartPollutionDayCurve);

        this.data = data;
        this.config = config;

        this.svg = d3.create('svg');
        this.gradient = this.svg.append('linearGradient');
        this.path = this.svg.append('path');
        this.axisX = this.svg.append('g');
        this.axisY = this.svg.append('g');
    }

    _createClass(ChartPollutionDayCurve, [{
        key: 'update',
        value: function update() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.data;
            var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.config;

            if (this.data == null) {
                return;
            }

            this.data = data;
            this.config = config;

            var height = config.height || 480;
            var width = config.width || 800;
            var margin = config.margin || { top: 30, right: 30, bottom: 30, left: 30 };
            this.svg.attr('viewBox', [0, 0, width, height]);

            var column = config.column || data.columns[0];
            var colorScheme = config.colorScheme || pollutionLevelDefinition[column] && Object.entries(pollutionLevelDefinition[column]).map(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    value = _ref2[0],
                    level = _ref2[1];

                return { value: value.toString(), color: colorSchemePollution[level] };
            }) || [{ value: "0", color: colorSchemePollution[0] }];

            var x = d3.scaleLinear().domain([0, 23]).range([margin.left, width - margin.right]);

            var y = d3.scaleLinear().domain([0, d3.max(data.map(function (d) {
                return d[column];
            }))]).nice().range([height - margin.bottom, margin.top]);

            var area = function area(data, x) {
                return d3.area().curve(d3.curveNatural).x(function (d) {
                    return x(d['hour']);
                }).y0(y(0)).y1(function (d) {
                    return y(d[column]);
                })(data);
            };

            /*
            this.path.transition()
                    .duration(1000)
                    .attr('fill', 'red')
                    .attr('d', area(data, x));
                    */

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

            this.path.attr('fill', 'url(#' + gradientID + ')').transition().duration(1000).attr('d', area(data, x));

            this.axisX.selectAll('*').remove();
            this.axisX.attr('transform', 'translate(' + 0 + ' ' + (height - margin.bottom) + ')').call(d3.axisBottom(x));

            this.axisY.selectAll('*').remove();
            this.axisY.attr('transform', 'translate(' + margin.left + ' ' + 0 + ')').call(d3.axisLeft(y));
        }
    }]);

    return ChartPollutionDayCurve;
}();