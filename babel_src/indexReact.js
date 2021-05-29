// function renderCitySidebar() {
//     ReactDOM.render(<CitySidebar />, document.getElementById('citySidebarContainer'));
// }
// renderCitySidebar();
function renderChartTimelineZoomableEmpty() {
    const data = [];
    data.columns = ['so2', 'no2', 'pm10', 'co', 'o3'];
    for (let i = 0; i < 365; i++) {
        data.push({date: new Date(date.year, 0, i+1), so2: 0, no2: 0, pm10: 0, co: 0, o3: 0});
    }
    ReactDOM.render(<D3Chart chartType={ChartTimelineZoomable} data={data} config={{column: 'so2', defaultDate: getDate()}} />, document.getElementById('chartTimelineZoomableContainer'));
}

function renderChartTimelineZoomable() {
    if (city.adcode == null || pollutant == null) {
        renderChartTimelineZoomableEmpty();
        return;
    }
    const query = `select avg(so2), avg(no2), avg(pm10), avg(pm25), avg(co), avg(o3), year, month, day, hour from cities join weatherdata on cities.adcode='${city.adcode}' and cities.adcode=weatherdata.city and year=${date.year} and hour is null group by year, month, day, hour order by year, month, day, hour asc limit 10000;`;
    console.log(query);
    doQuery(query).then(resp => {
        resp = resp.map(d => {
            data = {};
            Object.entries(d).forEach(([key, value]) => {
                if (key != 'year' && key != 'month' && key != 'day' && key != 'hour') {
                    data[key.replace('avg(', '').replace(')', '')] = value;
                }
            });
            data.date = new Date(d.year, d.month-1, d.day, d.hour);
            return data;
        });
        resp.columns = Object.entries(resp[0]).map(([key, value]) => key);
        // fill missing data
        const lastDate = resp[resp.length-1].date;
        for (let i = (lastDate.getTime() - new Date(date.year, 0, 1).getTime()) / 86400000 + 1; i < 365; i++) {
            resp.push({date: new Date(2013, 0, i+1), so2: 0, no2: 0, pm10: 0, co: 0, o3: 0});
        }
        console.log(resp);
        ReactDOM.render(<D3Chart chartType={ChartTimelineZoomable} data={resp} config={{column: pollutant, defaultDate: getDate()}} />, document.getElementById('chartTimelineZoomableContainer'));
    });
}

renderChartTimelineZoomable();