import React from "react";
import { useState} from "react"
import ReactAMAP, {Map} from 'react-amap'
import Heatmap from "react-amap-plugin-heatmap"


let pollutants = ["PM 2.5", "PM 10", "SO2", "NO2", "CO", "O3"];

// function mapCreatedHandler(mapInstance) {
//     let map = mapInstance;
//     map.setZoom(4);
//     map.setCenter([105, 35]);
// }
let dataSet = {
    data: []
};

const MainPage = () => {
    bindDirt();
    let pollutant, year, month, day, mode;
    const [data, setData] = useState(
        {data: [],
            max: 1000}
    )

    function bindDirt(){
        let btns = document.getElementsByClassName("btn");
        // console.log(btns);
        // console.log(btns.length);
        for(let i = 0; i < btns.length; i++){
            btns[i].idx = i;
            btns[i].addEventListener("click", e => {
                // if(e.target.innerHTML === "")
                pollutant = e.target.idx;
                //console.log(e.target.value);
                fetchData()
            });
        }

        btns = document.getElementsByClassName("btn-m");
        // console.log(btns);
        // console.log(btns.length);
        for(let i = 0; i < btns.length; i++){
            btns[i].addEventListener("click", e => {
                month = e.target.value;
                // console.log(e.target.innerText);
                fetchData()
            });
        }

        let select = document.getElementById("year-select");
        select.addEventListener('change', e => {
            year = e.target.value;
            fetchData()
        })
        select = document.getElementById("day-select");
        select.addEventListener('change', e => {
            day = e.target.value;
            fetchData()
        })
        select = document.getElementById("mode-select");
        select.addEventListener('change', e => {
            mode = e.target.value;
            fetchData()
        })
    }

    function fetchData() {
        day = document.getElementById("day-select").value;
        year = document.getElementById("year-select").value;
        mode = document.getElementById("mode-select").value;
        console.log(pollutants[pollutant], year+month, day, mode);
        if (pollutant === undefined || month === undefined || day === undefined || year ==- undefined || mode === undefined) {
            return null;
        }

        // return null;
        month = year+month;

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
            })
    }


    // let radius = 25;
    // let opacity = [0, 0.8];
    // let dataSet = {
    //     data: []
    // };
    const pluginProps = {
        radius: 30,
        opacity: [0, 0.8],
        zooms: [4, 18],
        dataSet: data
    }
    return (

        <div id='main-map' key={data.max}>
            <Map>
                <Heatmap {...pluginProps} />
            </Map>
             {/*<ReactAMAP.Map amapkey={'ecb9288ffdad7c96ea95abae13789da7'} events={ {created: mapCreatedHandler} }/>*/}
        </div>
    )
}
export default MainPage