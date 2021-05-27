var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function doQuery(command) {
    return fetch('/db/' + encodeURI(command)).then(function (resp) {
        if (resp.ok) {
            return resp.json();
        } else {
            resp.text().then(function (reason) {
                return console.error('"' + command + '":\n' + reason);
            });
            throw new Error('query failed');
        }
    });
}

var CitySidebar = function (_React$Component) {
    _inherits(CitySidebar, _React$Component);

    function CitySidebar(props) {
        _classCallCheck(this, CitySidebar);

        var _this = _possibleConstructorReturn(this, (CitySidebar.__proto__ || Object.getPrototypeOf(CitySidebar)).call(this, props));

        var defaultData = [];
        defaultData.columns = [];
        _this.state = {
            date: new Date(2013, 0, 1),
            lnglat: null,
            city: null,
            data: defaultData,
            showSidebar: false
        };
        _this.map = map;

        console.log(_this.map);
        _this.map.on('click', _this.mapClickHandler.bind(_this));
        //this.map.addEventListener('click', this.mapClickHandler.bind(this));
        return _this;
    }

    _createClass(CitySidebar, [{
        key: 'setDate',
        value: function setDate(newDate) {
            this.setState({ date: newDate });
            if (this.state.city) {
                this.queryData(this.state.city, newDate);
            }
        }

        // mapCreatedHandler(mapInstance) {
        //     this.map = mapInstance;
        //     this.map.setZoom(4);
        //     this.map.setCenter([105, 35]);
        // }

    }, {
        key: 'mapClickHandler',
        value: function mapClickHandler(e) {
            var _this2 = this;

            this.map.setZoom(6);
            this.map.setCenter(e.lnglat);

            this.setState({ lnglat: e.lnglat });
            this.queryCity(e.lnglat).then(function (city) {
                return _this2.queryData(city, _this2.state.date);
            }).then(function () {
                return _this2.showSidebar();
            });
        }
    }, {
        key: 'queryCity',
        value: function queryCity(lnglat) {
            var _this3 = this;

            var query = 'select cities.adcode, city, province, coordinates.lat, coordinates.lon from coordinates join cities on coordinates.lat>' + (lnglat.lat - 1) + ' and coordinates.lat<' + (lnglat.lat + 1) + ' and coordinates.lon>' + (lnglat.lng - 1) + ' and coordinates.lon<' + (lnglat.lng + 1) + ' and cities.adcode=coordinates.adcode limit 10000;';
            return doQuery(query).then(function (result) {
                if (result.length == 0) {
                    return;
                }
                var closestCity = result[0];
                result.forEach(function (c) {
                    if (simpleDistance(lnglat.lng, lnglat.lat, c.lon, c.lat) < simpleDistance(lnglat.lng, lnglat.lat, closestCity.lon, closestCity.lat)) {
                        closestCity = c;
                    }
                });
                console.log(closestCity);
                _this3.setState({ city: closestCity });
                return closestCity;
            });

            function simpleDistance(x, y, x2, y2) {
                return Math.abs(x - x2) + Math.abs(y - y2);
            }
        }
    }, {
        key: 'queryData',
        value: function queryData(city, date) {
            var _this4 = this;

            //const query = `select avg(pm10), avg(pm25), day from weatherdata where year=${date.getFullYear()} and month=${date.getMonth()+1} and hour is null and lat>${e.lnglat.lat - 1} and lat<${e.lnglat.lat + 1} and lon>${e.lnglat.lng - 1} and lon<${e.lnglat.lng + 1} group by day limit 1000;`;  // month, area
            //const query = `select avg(pm10), avg(co), hour from weatherdata where year=${date.getFullYear()} and month=${date.getMonth()+1} and day=${date.getDate()} and hour is not null and lat>${lnglat.lat - 1} and lat<${lnglat.lat + 1} and lon>${lnglat.lng - 1} and lon<${lnglat.lng + 1} group by hour order by hour asc limit 1000;`;    // day, area
            //const query = `select avg(so2), avg(no2), avg(pm10), avg(co), avg(o3), hour from cities join weatherdata on cities.province='${city.province}' and cities.adcode=weatherdata.city and year=${date.getFullYear()} and month=${date.getMonth()+1} and day=${date.getDate()} and hour is not null group by hour order by hour asc limit 10000;`;    // day, province
            var query = 'select avg(so2), avg(no2), avg(pm10), avg(co), avg(o3), hour from cities join weatherdata on cities.adcode=\'' + city.adcode + '\' and cities.adcode=weatherdata.city and year=' + date.getFullYear() + ' and month=' + (date.getMonth() + 1) + ' and day=' + date.getDate() + ' and hour is not null group by hour order by hour asc limit 10000;'; // day, city
            console.log(query);
            return doQuery(query).then(function (resp) {
                resp = resp.map(function (d) {
                    data = {};
                    Object.entries(d).forEach(function (_ref) {
                        var _ref2 = _slicedToArray(_ref, 2),
                            key = _ref2[0],
                            value = _ref2[1];

                        return data[key.replace('avg(', '').replace(')', '')] = value;
                    });
                    return data;
                });
                resp.columns = Object.entries(resp[0]).map(function (_ref3) {
                    var _ref4 = _slicedToArray(_ref3, 2),
                        key = _ref4[0],
                        value = _ref4[1];

                    return key;
                });
                console.log(resp);
                _this4.setState({ data: resp });
                return resp;
            });
        }
    }, {
        key: 'showSidebar',
        value: function showSidebar() {
            this.setState({ showSidebar: true });
        }
    }, {
        key: 'hideSidebar',
        value: function hideSidebar() {
            this.setState({ showSidebar: false });
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                this.state.showSidebar && React.createElement(
                    'div',
                    { id: 'sidebar' },
                    React.createElement(
                        'button',
                        { id: 'sidebarCloseBtn', onClick: this.hideSidebar.bind(this) },
                        'x'
                    ),
                    React.createElement(
                        'h3',
                        { id: 'sidebarTitle' },
                        this.state.city != null ? this.state.city.province + ', ' + this.state.city.city : 'click map to draw chart'
                    ),
                    React.createElement(
                        'div',
                        { id: 'chart_container' },
                        React.createElement(D3ChartWithColumnSelect, { chartType: ChartPollutionDayCurve, data: this.state.data, defaultColumnIndex: 0 }),
                        React.createElement(D3ChartWithColumnSelect, { chartType: ChartPollutionDayCurve, data: this.state.data, defaultColumnIndex: 1 }),
                        React.createElement(D3ChartWithColumnSelect, { chartType: ChartPollutionDayCurve, data: this.state.data, defaultColumnIndex: 2 }),
                        React.createElement(D3ChartWithColumnSelect, { chartType: ChartPollutionDayCurve, data: this.state.data, defaultColumnIndex: 3 }),
                        React.createElement(D3ChartWithColumnSelect, { chartType: ChartPollutionDayCurve, data: this.state.data, defaultColumnIndex: 4 })
                    )
                )
            );
        }
    }]);

    return CitySidebar;
}(React.Component);

ReactDOM.render(React.createElement(CitySidebar, null), document.getElementById('root'));