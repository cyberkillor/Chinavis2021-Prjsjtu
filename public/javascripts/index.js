var date = { year: 2000, month: 1, date: 1 }, city = { adcode: null, city: null, province: null }, pollutant = null;
setDate({ year: 2013, month: 1, date: 1 });
//setCity({adcode: "330109", city: "杭州市", province: "浙江省"});
//setPollutant('so2')

function setDate(newDate) {
    const oldDate = { ...date };
    Object.assign(date, newDate);
    // do something:
    console.log(getDate());
    document.getElementById("year-select").value = date.year;
    if (window.renderChartTimelineZoomable != null) {
        renderChartTimelineZoomable();
    }
    fetchData();    // heatmap
}
function getDate() {
    return new Date(date.year, date.month - 1, date.date);
}

function setCity(newCity) {
    const oldCity = { ...city };
    Object.assign(city, newCity);
    // do something:
    console.log(city);
    if (oldCity.adcode != city.adcode && window.renderChartTimelineZoomable != null) {
        renderChartTimelineZoomable();
    }
}

function setPollutant(newP) {
    const oldP = pollutant;
    pollutant = newP;
    // do something:
    console.log(pollutant);
    if (oldP != pollutant) {
        if (window.renderChartTimelineZoomable != null)
            renderChartTimelineZoomable();
        fetchData();    // heatmap
    }
}

function doQuery(command) {
    return fetch('/db/' + encodeURI(command)).then(resp => {
        if (resp.ok) {
            return resp.json();
        } else {
            resp.text().then(reason => console.error('"' + command + '":\n' + reason));
            throw new Error('query failed');
        }
    })
}

let pollutants = ["PM 2.5", "PM 10", "SO2", "NO2", "CO", "O3"];

// function mapCreatedHandler(mapInstance) {
//     let map = mapInstance;
//     map.setZoom(4);
//     map.setCenter([105, 35]);
// }
let dataSet = {
    data: []
};

let map = new AMap.Map("container", {
    resizeEnable: true,
    center: [121.4737, 31.2304],
    zoom: 5
});
let heatmap;
let windmap;

bindDirt();
//let pollutant, year, month, day, mode;
let mode;

function bindDirt() {
    let btns = document.getElementsByClassName("btn-dirt");
    // console.log(btns);
    // console.log(btns.length);
    document.querySelectorAll(".btn-dirt").forEach(btn => {
        btn.onclick = _ => {
            //pollutant = btn.value;
            setPollutant(btn.value);
            document.querySelectorAll(".btn-dirt").forEach(b => {
                b.classList.remove("selected");
            });
            btn.className += " selected";
            //fetchData();
        }
    })
    // for(let i = 0; i < btns.length; i++){
    //     btns[i].idx = i;
    //     btns[i].addEventListener("click", e => {
    //         // if(e.target.innerHTML === "")
    //         pollutant = e.target.idx;
    //         document.querySelectorAll(".btn-dirt").forEach(btn => {
    //             console.log(btn);
    //             btn.className.replace(" selected", "");
    //         })
    //         e.target.className += " selected";
    //         //console.log(e.target.value);
    //         fetchData()
    //     });
    // }

    // btns = document.getElementsByClassName("btn-m");
    // console.log(btns);
    // console.log(btns.length);
    // for(let i = 0; i < btns.length; i++){
    //     btns[i].addEventListener("click", e => {
    //         month = e.target.value;
    //         // console.log(e.target.innerText);
    //         fetchData()
    //     });
    // }
    // document.querySelectorAll(".btn-m").forEach(btn => {
    //     btn.onclick = _ => {
    //         month = btn.value;
    //         document.querySelectorAll(".btn-m").forEach(b => {
    //             b.classList.remove("selected");
    //         });
    //         btn.className += " selected";
    //         fetchData();
    //     }
    // })

    let select = document.getElementById("year-select");
    select.addEventListener('change', e => {
        setDate({ year: e.target.value });
    })
    // select = document.getElementById("day-select");
    // select.addEventListener('change', e => {
    //     day = e.target.value;
    //     fetchData()
    // })
    // select = document.getElementById("mode-select");
    // select.addEventListener('change', e => {
    //     mode = e.target.value;
    //     fetchData()
    // })
}

function fetchData() {
    const year = date.year,
        month = date.month,
        day = date.date,
        mode = 'day';
    // day = document.getElementById("day-select").value;
    // year = document.getElementById("year-select").value;
    // mode = document.getElementById("mode-select").value;
    //console.log(pollutant, year + month, day, mode);
    if (pollutant == undefined || month == undefined || day == undefined || year == undefined || mode == undefined) {
        return null;
    }

    // // update citySidebar
    // if (citySidebar_setDate != null) {
    //     citySidebar_setDate(new Date(parseInt(year), parseInt(month)-1, parseInt(day)));
    // }

    // return null;
    let ym = year + month;

    // TODO: database connection
    stmt = `SELECT ${pollutant},lat,lon,u,v FROM weatherdata WHERE year=${year} AND month=${Number(month)} AND day=${Number(day)} AND hour is null`;
    url = `db/${stmt}`
    console.log(url)
    fetch(url)
        .then(r => r.json())
        .then(t => {
            dataSet = {
                data: []
            };

            t.forEach(d => {
                dataSet.data.push({
                    "lng": d.lon,
                    "lat": d.lat,
                    "count": d[pollutant],
                    "u": d.u,
                    "v": d.v
                })
            });
            // console.log(dataSet.data);

            createMap(dataSet.data);
        })

    // let headers = new Headers();
    // let username = "share";
    // let password = "123456";
    //
    // headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));
    //
    // let url = `https://nas.tonychen.page:5006/WebDavShare/ChinaVis%202021%20Data/${ym}/CN-Reanalysis-daily-${ym}${day}00.csv`;
    //
    //
    // console.log(url);
    // fetch(url, {headers: headers})
    //     .then(r => r.text())
    //     .then(t => {
    //         let data = t.split("\n");
    //         data.shift();
    //         dataSet = {
    //             data: []
    //         };
    //
    //         data.forEach(d => {
    //             d = d.split(",");
    //             if (d.length > 1) {
    //                 dataSet.data.push({
    //                     "lng": Number(d[12]),
    //                     "lat": Number(d[11]),
    //                     "count": Number(d[pollutant]),
    //                     "u": Number(d[6]),
    //                     "v": Number(d[7])
    //                 })
    //             }
    //         });
    //         // return heatmapData;
    //         createMap(dataSet.data);
    //     })
}

// https://lbs.amap.com/demo/javascript-api/example/selflayer/heatmap
function createMap(data) {

    if (!isSupportCanvas()) {
        alert('热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~')
    }

    // let hs = document.getElementById("_amap_heatmap_div_");
    // hs.remove();

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
    // let current_layers = map.getLayers(); 
    // console.log(current_layers[3]);
    // if(current_layers[3] != undefined){
    //     map.remove(current_layers[3]); // 因为自定义图层：风向图层 是加在current_layer[3]处的

    // }
    //console.log(windmap);
    if (windmap !== undefined) {
        windmap.hide();
    }
    if (heatmap !== undefined) {
        heatmap.hide();
    }
    heatmap_switch(true);
    map.plugin(["AMap.Heatmap"], function () {
        //初始化heatmap对象
        // heatmap.destroy();
        // heatmap.hide();
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
        // console.log(data.reduce((r, a, idx) => {
        //     if (isNaN(a["count"])) { console.log(a, idx) }
        //     return Math.max(r, a["count"])}, 0));
        heatmap.setDataSet({
            data: data
        });
    });


    //判断浏览区是否支持canvas
    function isSupportCanvas() {
        let elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    }
}

function addLayer(data, map) {
    map.plugin('AMap.CustomLayer', function () {
        let canvas = document.createElement('canvas');
        windmap = new AMap.CustomLayer(canvas, {
            zooms: [3, 10],
            alwaysRender: true,//缩放过程中是否重绘，复杂绘制建议设为false
            zIndex: 120
        });
        //windmap.setAttribute("id", "wind_layer");
        let onRender = function () {
            let retina = AMap.Browser.retina;
            let size = map.getSize();//resize
            let width = size.width;
            let height = size.height;
            canvas.style.width = width + 'px'
            canvas.style.height = height + 'px'
            if (retina) {//高清适配
                width *= 2;
                height *= 2;
            }
            canvas.width = width;
            canvas.height = height;//清除画布
            let ctx = canvas.getContext("2d");
            ctx.fillStyle = '#08f';
            ctx.strokeStyle = '#fff';
            ctx.beginPath();
            for (let i = 0; i < data.length; i += 1) {
                let center = new AMap.LngLat(data[i]['lng'], data[i]['lat']);
                let pos = map.lngLatToContainer(center);
                let u = data[i]['u'];
                let v = data[i]['v'];
                //var length = Math.sqrt(Math.pow(u) + Math.pow(v));
                if (retina) {
                    pos = pos.multiplyBy(2);
                    u *= 2;
                    v *= 2;
                }
                //let r = length/2;
                draw_arrow(ctx, pos.x - u, pos.y - v, pos.x + u, pos.y + v);
            }
            ctx.lineWidth = retina ? 2 : 1
            ctx.closePath();
            ctx.stroke();
            //ctx.fill();
        }
        windmap.render = onRender;
        windmap.setMap(map);
        console.log(windmap);
    });
}

function draw_arrow(context, fromx, fromy, tox, toy) {
    let headlen = 4; // length of head in pixels
    let dx = tox - fromx;
    let dy = toy - fromy;
    let angle = Math.atan2(dy, dx);
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}


pollutant_company.active = false;
pollutant_company.show = _ => {
    if (pollutant_company.active === false) {
        pollutant_company.forEach(d => {
            var marker = new AMap.Marker({
                position: new AMap.LngLat(d['lon'], d['lat'])
            });
            map.add(marker);
        });
        pollutant_company.active = true
    }
}
// pollutant_company.show()

pollutant_company.hide = _ => {
    if (pollutant_company.active === true) {
        map.remove(map.getAllOverlays('marker'));
    }
    pollutant_company.active = false;
}

pollutant_company.toggle = _ => {
    if (pollutant_company.active === true) {
        pollutant_company.hide();
        document.querySelector("#pollutant-company-toggle").textContent = "显示污染源";
    } else {
        pollutant_company.show();
        document.querySelector("#pollutant-company-toggle").textContent = "隐藏污染源";
    }
}

heatmap_active = false

function heatmap_switch(tf = null) {
    if (tf === null) {
        return heatmap_active;
    }
    if (tf) {
        heatmap_active = true;
        document.querySelector("#heatmap-toggle").textContent = "关闭热力图";
    } else {
        heatmap_active = false;
        document.querySelector("#heatmap-toggle").textContent = "显示热力图";
    }
}

toggleHeatmap = _ => {
    if (heatmap === undefined) {
        return;
    }
    if (heatmap_active) {
        heatmap.hide();
        heatmap_switch(false);
    } else {
        heatmap.show();
        heatmap_switch(true);
    }
}

windmap_active = false;
windmap_show = _ => {
    if (windmap_active === false) {
        addLayer(dataSet.data, map);
        windmap_active = true;
    }
}
windmap_show()

windmap_hide = _ => {
    if (windmap_active === true) {
        let current_layers = map.getLayers();
        console.log(current_layers[3]);
        if (current_layers[3] != undefined) {
            map.remove(current_layers[3]); // 因为自定义图层：风向图层 是加在current_layer[3]处的
        }
    }
    windmap_active = false;
}

toggleWindmap = _ => {
    if (windmap === undefined) {
        return;
    }
    if (windmap_active === true) {
        windmap_hide();
        document.querySelector("#windmap-toggle").textContent = "显示风向";
    } else {
        windmap_show();
        document.querySelector("#windmap-toggle").textContent = "隐藏风向";
    }
}

let autoplayOn = false, autoplayIntervalID = null;

toggleAutoplay = _ => {
    if (autoplayOn) {
        clearInterval(autoplayIntervalID);
        autoplayOn = false;
        document.querySelector("#autoplay-toggle").textContent = "播放";
    } else {
        autoplayIntervalID = window.setInterval(nextDay, 1000);
        autoplayOn = true;
        document.querySelector("#autoplay-toggle").textContent = "暂停";
    }
}

function nextDay() {
    let d = new Date(getDate().getTime() + 86400000);
    setDate({year: d.getFullYear(), month: d.getMonth()+1, date: d.getDate()});
}


map.on('click', this.mapClickHandler);

function mapClickHandler(e) {
    map.setZoom(8);
    map.setCenter(e.lnglat);

    queryCity(e.lnglat).then(city => setCity(city));
}

function queryCity(lnglat) {
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
        console.log('closestCity: ', closestCity);
        return closestCity;
    });

    function simpleDistance(x, y, x2, y2) {
        return Math.abs(x - x2) + Math.abs(y - y2);
    }
}