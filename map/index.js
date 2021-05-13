'use strict';

let pollutant, month, day;

function generatePollutantBtn() {
    let pollutants = ["PM 2.5", "PM 10", "SO2", "NO2", "CO", "O3"];

    let div = document.querySelector("#pollutant_btn");

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

generatePollutantBtn();
generateMonthBtn();
generateDayBtn();

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
            let heatmapData = [];
            data.forEach(d => {
                d = d.split(",");
                if (d.length > 1) {
                    heatmapData.push({
                        "lng": Number(d[12]),
                        "lat": Number(d[11]),
                        "count": Number(d[pollutant])
                    })
                }
            });
            createMap(heatmapData);
        })
}

// https://lbs.amap.com/demo/javascript-api/example/selflayer/heatmap
function createMap(data) {
    let map = new AMap.Map("container", {
        resizeEnable: true,
        center: [121.4737, 31.2304],
        zoom: 10
    });
    
    if (!isSupportCanvas()) {
        alert('热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~')
    }
    
    //详细的参数,可以查看heatmap.js的文档 http://www.patrick-wied.at/static/heatmapjs/docs.html
    //参数说明如下:
    /* visible 热力图是否显示,默认为true
    * opacity 热力图的透明度,分别对应heatmap.js的minOpacity和maxOpacity
    * radius 势力图的每个点的半径大小
    * gradient  {JSON} 热力图的渐变区间 . gradient如下所示
    *	{
    .2:'rgb(0, 255, 255)',
    .5:'rgb(0, 110, 255)',
    .8:'rgb(100, 0, 255)'
    }
    其中 key 表示插值的位置, 0-1
    value 为颜色值
    */
    let heatmap;
    map.plugin(["AMap.Heatmap"], function () {
        //初始化heatmap对象
        heatmap = new AMap.Heatmap(map, {
            radius: 25, //给定半径
            opacity: [0, 0.8]
            /*,
            gradient:{
                0.5: 'blue',
                0.65: 'rgb(117,211,248)',
                0.7: 'rgb(0, 255, 0)',
                0.9: '#ffea00',
                1.0: 'red'
            }
            */
        });
        console.log(data.reduce((r, a, idx) => {
            if (isNaN(a["count"])) { console.log(a, idx) }
            return Math.max(r, a["count"])}, 0));
        heatmap.setDataSet({
            data: data,
            max: data.reduce((r, a) => Math.max(r, a["count"]), 0)
        });
    });
    
    //判断浏览区是否支持canvas
    function isSupportCanvas() {
        let elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    }
}
