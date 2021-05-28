var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// function renderCitySidebar() {
//     ReactDOM.render(<CitySidebar />, document.getElementById('citySidebarContainer'));
// }
// renderCitySidebar();
function renderChartTimelineZoomableEmpty() {
    var data = [];
    data.columns = ['so2', 'no2', 'pm10', 'co', 'o3'];
    for (var i = 0; i < 365; i++) {
        data.push({ date: new Date(2013, 0, i + 1), so2: 0, no2: 0, pm10: 0, co: 0, o3: 0 });
    }
    ReactDOM.render(React.createElement(D3Chart, { chartType: ChartTimelineZoomable, data: data, config: { column: 'so2' } }), document.getElementById('chartTimelineZoomableContainer'));
}

function renderChartTimelineZoomable() {
    if (city.adcode == null || pollutant == null) {
        renderChartTimelineZoomableEmpty();
        return;
    }
    var query = 'select avg(so2), avg(no2), avg(pm10), avg(pm25), avg(co), avg(o3), year, month, day, hour from cities join weatherdata on cities.adcode=\'' + city.adcode + '\' and cities.adcode=weatherdata.city and year=' + date.year + ' and hour is null group by year, month, day, hour order by year, month, day, hour asc limit 10000;';
    console.log(query);
    doQuery(query).then(function (resp) {
        resp = resp.map(function (d) {
            data = {};
            Object.entries(d).forEach(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    key = _ref2[0],
                    value = _ref2[1];

                if (key != 'year' && key != 'month' && key != 'day' && key != 'hour') {
                    data[key.replace('avg(', '').replace(')', '')] = value;
                }
            });
            data.date = new Date(d.year, d.month - 1, d.day, d.hour);
            return data;
        });
        resp.columns = Object.entries(resp[0]).map(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
                key = _ref4[0],
                value = _ref4[1];

            return key;
        });
        // fill missing data
        var lastDate = resp[resp.length - 1].date;
        for (var i = (lastDate.getTime() - new Date(date.year, 0, 1).getTime()) / 86400000 + 1; i < 365; i++) {
            resp.push({ date: new Date(2013, 0, i + 1), so2: 0, no2: 0, pm10: 0, co: 0, o3: 0 });
        }
        console.log(resp);
        ReactDOM.render(React.createElement(D3Chart, { chartType: ChartTimelineZoomable, data: resp, config: { column: pollutant } }), document.getElementById('chartTimelineZoomableContainer'));
    });
}

renderChartTimelineZoomable();