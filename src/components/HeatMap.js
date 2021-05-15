import { useState, useEffect } from "react"
import {Map} from "react-amap"
import Heatmap from "react-amap-plugin-heatmap"

let visible = true;
let radius = 25;
let resizeEnable = true;
let center = [121.4737, 31.2304];
let opacity = [0, 0.8];
let zoom = 10;
let dataSet = {
    data: [],
    max: 1000
};

const HeatMap = () => {
    let pollutant, month, day;
    const [data, setData] = useState(
        {data: [],
            max: 1000}
    )

    function generatePollutantBtn() {
        let pollutants = ["PM 2.5", "PM 10", "SO2", "NO2", "CO", "O3"];

        let div = document.querySelector("#pollutant_btn");
        while(div.hasChildNodes()){
            div.removeChild(div.firstChild)
        }
        for (let idx in pollutants) {
            let p = pollutants[idx];
            let btn = document.createElement("input");
            btn.type = "radio";
            btn.name = "pollutant";
            btn.id = p;
            btn.value = idx;

            btn.addEventListener("change", e => {
                pollutant = e.target.value;
                console.log(e.target.id);
                fetchData()
            });

            let label = document.createElement("label");
            label.htmlFor = p;
            label.textContent = p;

            div.appendChild(btn);
            div.appendChild(label);
        }
    }

    function generateMonthBtn() {
        let months = ["201306", "201312", "201405", "201411", "201504", "201510", "201603", "201609", "201702", "201708", "201801", "201807",
            "201301", "201307", "201406", "201412", "201505", "201511", "201604", "201610", "201703", "201709", "201802", "201808",
            "201302", "201308", "201401", "201407", "201506", "201512", "201605", "201611", "201704", "201710", "201803", "201809",
            "201303", "201309", "201402", "201408", "201501", "201507", "201606", "201612", "201705", "201711", "201804", "201810",
            "201304", "201310", "201403", "201409", "201502", "201508", "201601", "201607", "201706", "201712", "201805", "201811",
            "201305", "201311", "201404", "201410", "201503", "201509", "201602", "201608", "201701", "201707", "201806", "201812"];

        let div = document.querySelector("#month_btn");
        while(div.hasChildNodes()){
            div.removeChild(div.firstChild)
        }

        for (let idx in months) {
            let m = months[idx];
            let btn = document.createElement("input");
            btn.type = "radio"
            btn.name = "month";
            btn.id = m;
            btn.value = m;

            btn.addEventListener("change", e => {
                month = e.target.id;
                console.log(e.target.id);
                fetchData()
            });

            let label = document.createElement("label");
            label.htmlFor = m;
            label.textContent = m;

            div.appendChild(btn);
            div.appendChild(label);
        }

    }

    function generateDayBtn() {
        let div = document.querySelector("#day_btn");
        while(div.hasChildNodes()){
            div.removeChild(div.firstChild)
        }

        for (let d = 1; d <= 31; d++) {
            let btn = document.createElement("input");
            btn.type = "radio"
            btn.name = "day";
            btn.id = String(d).padStart(2, '0');
            btn.value = d;

            btn.addEventListener("change", e => {
                day = e.target.id;
                console.log(e.target.id);
                fetchData()
            });

            let label = document.createElement("label");
            label.htmlFor = d;
            label.textContent = d;

            div.appendChild(btn);
            div.appendChild(label);
        }
    }

    function fetchData() {
        if (pollutant === undefined || month === undefined || day === undefined) {
            return null;
        }

        let headers = new Headers();
        let username = "share";
        let password = "123456";

        headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));
        let url = `https://nas.tonychen.page:5006/WebDavShare/ChinaVis%202021%20Data/${month}/CN-Reanalysis-daily-${month}${day}00.csv`;
        console.log(url);
        fetch(url, {headers: headers})
            .then(r => r.text())
            .then(t => {
                let data = t.split("\n");
                data.shift();
                dataSet = {
                    data: [],
                    max: 1000
                };
                data.forEach(d => {
                    d = d.split(",");
                    if (d.length > 1) {
                        dataSet.data.push({
                            "lng": Number(d[12]),
                            "lat": Number(d[11]),
                            "count": Number(d[pollutant])
                        })
                    }
                });
                dataSet.max = dataSet.data.reduce((r, a) => Math.max(r, a["count"]), 0);
                console.log(dataSet.max);
                // return heatmapData;
                setData(dataSet);
                console.log(dataSet.key, data.max);
            })
    }

    generatePollutantBtn();
    generateMonthBtn();
    generateDayBtn();

    const pluginProps = {
        resizeEnable,
        visible,
        radius,
        opacity,
        zoom,
        center,
        dataSet
    }

    return (
        <div className='heatmapContainer' key={data.max}>
            <Map>
                <Heatmap  {...pluginProps} />
            </Map>
        </div>
    )
}
export default HeatMap