let pollutants = ["PM 2.5", "PM 10", "SO2", "NO2", "CO", "O3"];

// function mapCreatedHandler(mapInstance) {
//     let map = mapInstance;
//     map.setZoom(4);
//     map.setCenter([105, 35]);
// }
let dataSet = {
    data: []
};

let mmap = new AMap.Map("container", {
    resizeEnable: true,
    center: [121.4737, 31.2304],
    zoom: 5
});

bindDirt();
let pollutant, year, month, day, mode;

function bindDirt(){
    let btns = document.getElementsByClassName("btn-dirt");
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
    if (pollutant === undefined || month === undefined || day === undefined || year === undefined || mode === undefined) {
        return null;
    }

    // return null;
    let ym = year+month;

    let headers = new Headers();
    let username = "share";
    let password = "123456";

    headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));

    let url = `https://nas.tonychen.page:5006/WebDavShare/ChinaVis%202021%20Data/${ym}/CN-Reanalysis-daily-${ym}${day}00.csv`;

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
            // return heatmapData;
            createMap(dataSet.data);
        })
}

// https://lbs.amap.com/demo/javascript-api/example/selflayer/heatmap
function createMap(data) {
    let map = new AMap.Map("container", {
        resizeEnable: true,
        center: [121.4737, 31.2304],
        zoom: 5
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
