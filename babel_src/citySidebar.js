function doQuery(command) {
    return fetch('https://34077828v5.oicp.vip/' + encodeURI(command)).then(resp => {
        if (resp.ok) {
            return resp.json();
        } else {
            resp.text().then(reason => console.error('"' + command + '":\n' + reason));
            throw new Error('query failed');
        }
    })
}

let citySidebar_setDate;

class CitySidebar extends React.Component {
    constructor(props) {
        super(props);
        let defaultData = [];
        defaultData.columns = [];
        this.state = {
            date: new Date(2013, 0, 1),
            lnglat: null,
            city: null,
            data: defaultData,
            showSidebar: false,
        }
        this.map = map;
        this.map.on('click', this.mapClickHandler.bind(this));

        citySidebar_setDate = this.setDate.bind(this);
    }

    setDate(newDate) {
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

    mapClickHandler(e) {
        this.map.setZoom(6);
        this.map.setCenter(e.lnglat);

        this.setState({ lnglat: e.lnglat });
        this.queryCity(e.lnglat)
            .then(city => this.queryData(city, this.state.date))
            .then(() => this.showSidebar());
    }

    queryCity(lnglat) {
        const query = `select cities.adcode, city, province, coordinates.lat, coordinates.lon from coordinates join cities on coordinates.lat>${lnglat.lat - 1} and coordinates.lat<${lnglat.lat + 1} and coordinates.lon>${lnglat.lng - 1} and coordinates.lon<${lnglat.lng + 1} and cities.adcode=coordinates.adcode limit 10000;`;
        return doQuery(query).then(result => {
            if (result.length == 0) {
                return;
            }
            let closestCity = result[0];
            result.forEach(c => {
                if (simpleDistance(lnglat.lng, lnglat.lat, c.lon, c.lat) < simpleDistance(lnglat.lng, lnglat.lat, closestCity.lon, closestCity.lat)) {
                    closestCity = c;
                }
            });
            console.log(closestCity);
            this.setState({ city: closestCity });
            return closestCity;
        });

        function simpleDistance(x, y, x2, y2) {
            return Math.abs(x - x2) + Math.abs(y - y2);
        }
    }

    queryData(city, date) {
        //const query = `select avg(pm10), avg(pm25), day from weatherdata where year=${date.getFullYear()} and month=${date.getMonth()+1} and hour is null and lat>${e.lnglat.lat - 1} and lat<${e.lnglat.lat + 1} and lon>${e.lnglat.lng - 1} and lon<${e.lnglat.lng + 1} group by day limit 1000;`;  // month, area
        //const query = `select avg(pm10), avg(co), hour from weatherdata where year=${date.getFullYear()} and month=${date.getMonth()+1} and day=${date.getDate()} and hour is not null and lat>${lnglat.lat - 1} and lat<${lnglat.lat + 1} and lon>${lnglat.lng - 1} and lon<${lnglat.lng + 1} group by hour order by hour asc limit 1000;`;    // day, area
        //const query = `select avg(so2), avg(no2), avg(pm10), avg(co), avg(o3), hour from cities join weatherdata on cities.province='${city.province}' and cities.adcode=weatherdata.city and year=${date.getFullYear()} and month=${date.getMonth()+1} and day=${date.getDate()} and hour is not null group by hour order by hour asc limit 10000;`;    // day, province
        const query = `select avg(so2), avg(no2), avg(pm10), avg(co), avg(o3), hour from cities join weatherdata on cities.adcode='${city.adcode}' and cities.adcode=weatherdata.city and year=${date.getFullYear()} and month=${date.getMonth() + 1} and day=${date.getDate()} and hour is not null group by hour order by hour asc limit 10000;`;    // day, city
        console.log(query);
        return doQuery(query).then(resp => {
            resp = resp.map(d => {
                data = {};
                Object.entries(d).forEach(([key, value]) => data[key.replace('avg(', '').replace(')', '')] = value);
                return data;
            });
            resp.columns = Object.entries(resp[0]).map(([key, value]) => key);
            console.log(resp);
            this.setState({ data: resp });
            return resp;
        });
    }

    showSidebar() {
        this.setState({ showSidebar: true });
    }

    hideSidebar() {
        this.setState({ showSidebar: false });
    }

    render() {
        return (
            <div>
                {
                    this.state.showSidebar &&
                    <div id='sidebar'>
                        <button id='sidebarCloseBtn' onClick={this.hideSidebar.bind(this)}>x</button>
                        <h3 id="sidebarTitle">{this.state.city != null ? this.state.city.province + ', ' + this.state.city.city : 'click map to draw chart'}</h3>
                        <div id="chart_container">
                            <D3ChartWithColumnSelect chartType={ChartPollutionDayCurve} data={this.state.data} defaultColumnIndex={0} />
                            <D3ChartWithColumnSelect chartType={ChartPollutionDayCurve} data={this.state.data} defaultColumnIndex={1} />
                            <D3ChartWithColumnSelect chartType={ChartPollutionDayCurve} data={this.state.data} defaultColumnIndex={2} />
                            <D3ChartWithColumnSelect chartType={ChartPollutionDayCurve} data={this.state.data} defaultColumnIndex={3} />
                            <D3ChartWithColumnSelect chartType={ChartPollutionDayCurve} data={this.state.data} defaultColumnIndex={4} />
                        </div>
                    </div>
                }
            </div>
        );
    }
}

ReactDOM.render(<CitySidebar />, document.getElementById('root'));