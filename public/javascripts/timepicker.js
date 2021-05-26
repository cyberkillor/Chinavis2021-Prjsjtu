var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Date.prototype.addDay = function () {
    this.setDate(this.getDate() + 1);
    return this.getTime();
};

Date.prototype.minusDay = function () {
    this.setDate(this.getDate() - 1);
    return this.getTime();
};

Date.prototype.addMonth = function () {
    this.setMonth(this.getMonth() + 1);
    return this.getTime();
};

Date.prototype.minusMonth = function () {
    this.setMonth(this.getMonth() - 1);
    return this.getTime();
};

Date.prototype.addFullYear = function () {
    this.setFullYear(this.getFullYear() + 1);
    return this.getTime();
};

Date.prototype.minusFullYear = function () {
    this.setFullYear(this.getFullYear() - 1);
    return this.getTime();
};

function SinglePicker(props) {
    return React.createElement(
        'div',
        null,
        React.createElement(
            'button',
            { onClick: props.previousHandler },
            props.previousIcon || '<'
        ),
        React.createElement(
            'label',
            null,
            props.value
        ),
        React.createElement(
            'button',
            { onClick: props.nextHandler },
            props.nextIcon || '>'
        )
    );
}

var TimePicker = function (_React$Component) {
    _inherits(TimePicker, _React$Component);

    function TimePicker(props) {
        _classCallCheck(this, TimePicker);

        var _this = _possibleConstructorReturn(this, (TimePicker.__proto__ || Object.getPrototypeOf(TimePicker)).call(this, props));

        _this.state = { date: props.defaultDate };

        _this.previousYear = _this.previousYear.bind(_this);
        _this.previousMonth = _this.previousMonth.bind(_this);
        _this.previousDay = _this.previousDay.bind(_this);
        _this.nextYear = _this.nextYear.bind(_this);
        _this.nextMonth = _this.nextMonth.bind(_this);
        _this.nextDay = _this.nextDay.bind(_this);
        return _this;
    }

    _createClass(TimePicker, [{
        key: 'previousYear',
        value: function previousYear() {
            this.setState(function (state, props) {
                var date = new Date(state.date.getTime());
                date.minusFullYear();
                props.setDate(date);
                return { date: date };
            });
        }
    }, {
        key: 'previousMonth',
        value: function previousMonth() {
            this.setState(function (state, props) {
                var date = new Date(state.date.getTime());
                date.minusMonth();
                props.setDate(date);
                return { date: date };
            });
        }
    }, {
        key: 'previousDay',
        value: function previousDay() {
            this.setState(function (state, props) {
                var date = new Date(state.date.getTime());
                date.minusDay();
                props.setDate(date);
                return { date: date };
            });
        }
    }, {
        key: 'nextYear',
        value: function nextYear() {
            this.setState(function (state, props) {
                var date = new Date(state.date.getTime());
                date.addFullYear();
                props.setDate(date);
                return { date: date };
            });
        }
    }, {
        key: 'nextMonth',
        value: function nextMonth() {
            this.setState(function (state, props) {
                var date = new Date(state.date.getTime());
                date.addMonth();
                props.setDate(date);
                return { date: date };
            });
        }
    }, {
        key: 'nextDay',
        value: function nextDay() {
            this.setState(function (state, props) {
                var date = new Date(state.date.getTime());
                date.addDay();
                props.setDate(date);
                return { date: date };
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement(SinglePicker, { value: this.state.date.getFullYear(), previousHandler: this.previousYear, nextHandler: this.nextYear }),
                React.createElement(SinglePicker, { value: this.state.date.getMonth() + 1, previousHandler: this.previousMonth, nextHandler: this.nextMonth }),
                React.createElement(SinglePicker, { value: this.state.date.getDate(), previousHandler: this.previousDay, nextHandler: this.nextDay })
            );
        }
    }]);

    return TimePicker;
}(React.Component);