var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChartTest = function () {
    function ChartTest(data, config) {
        _classCallCheck(this, ChartTest);

        console.log("chart init", data, config);
        this.svg = d3.create('div');
        this.data = data;
        this.config = config;
        this.svg.append('p').text('init: ' + Object.entries(config));
    }

    _createClass(ChartTest, [{
        key: 'update',
        value: function update() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.data;
            var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.config;

            console.log("chart update", data, config);
            this.svg.append('p').text('update: ' + Object.entries(config));
        }
    }]);

    return ChartTest;
}();

var D3Chart = function (_React$Component) {
    _inherits(D3Chart, _React$Component);

    function D3Chart(props) {
        _classCallCheck(this, D3Chart);

        return _possibleConstructorReturn(this, (D3Chart.__proto__ || Object.getPrototypeOf(D3Chart)).call(this, props));
    }

    _createClass(D3Chart, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this._chart = new this.props.chartType(this.props.data, this.props.config);

            this._rootNode.appendChild(this._chart.svg.node());

            this._chart.update();
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            this._chart.update(this.props.data, this.props.config);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this._rootNode.removeChild(this._chart.svg.node());
        }
    }, {
        key: '_setRef',
        value: function _setRef(componentNode) {
            this._rootNode = componentNode;
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement('div', { className: 'd3chart-container', ref: this._setRef.bind(this) });
        }
    }]);

    return D3Chart;
}(React.Component);

var D3ChartWithColumnSelect = function (_React$Component2) {
    _inherits(D3ChartWithColumnSelect, _React$Component2);

    function D3ChartWithColumnSelect(props) {
        _classCallCheck(this, D3ChartWithColumnSelect);

        var _this2 = _possibleConstructorReturn(this, (D3ChartWithColumnSelect.__proto__ || Object.getPrototypeOf(D3ChartWithColumnSelect)).call(this, props));

        _this2.state = { column: props.data.columns[props.defaultColumnIndex || 0] };

        _this2.handleChangeColumn = _this2.handleChangeColumn.bind(_this2);
        return _this2;
    }

    _createClass(D3ChartWithColumnSelect, [{
        key: 'handleChangeColumn',
        value: function handleChangeColumn(event) {
            this.setState({ column: event.target.value });
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'label',
                    null,
                    React.createElement(
                        'select',
                        { value: this.state.column, onChange: this.handleChangeColumn },
                        this.props.data.columns.map(function (d) {
                            return React.createElement(
                                'option',
                                { key: d, value: d },
                                d
                            );
                        })
                    )
                ),
                React.createElement(D3Chart, { chartType: this.props.chartType, data: this.props.data, config: { column: this.state.column } })
            );
        }
    }]);

    return D3ChartWithColumnSelect;
}(React.Component);