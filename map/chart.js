var headers = new Headers();
let username = "share";
let password = "123456";

headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));
fetch("https://nas.tonychen.page:5006/WebDavShare/ChinaVis%202021%20Data/201708/CN-Reanalysis-daily-2017083100.csv", {headers: headers})
    .then(r => r.text())
    .then(t => {
        const csv = d3.csvParse(t, d3.autoType);
        const chart = chart0(csv, csv.columns[0], [
            {value: "0", color: "#1f005c"},
            {value: "80", color: "#BB375D"},
            {value: "110", color: "#ffb56b"}
        ]);
        document.body.append(chart);
    })


function chart0(data, column, colorScheme) {
    const height = 480;
    const width = 800;
    const margin = ({top: 30, right: 30, bottom: 30, left: 30});

    const x = d3.scaleLinear()
            .domain([0, data.length])
            .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
            .domain([0, d3.max(data.map(d => d[column]))]).nice()
            .range([height - margin.bottom, margin.top]);
        
    const area = (data, x) => d3.area()
            .curve(d3.curveStepAfter)
            .x((d, i) => x(i))
            .y0(y(0))
            .y1(d => d[column])
            (data);

    const svg = d3.create("svg")
            .attr("viewBox", [0, 0, width, height]);

    svg.append("linearGradient")
            .attr("id", "gradient0")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", height - margin.bottom)
            .attr("x2", 0).attr("y2", margin.top)
        .selectAll("stop")
        .data(colorScheme)
        .enter().append("stop")
            .attr("offset", 
                d => (100 * d.value / y.domain()[1]).toFixed(0) + '%')
            .attr("stop-color", d => d.color);

    svg.append('g')
            .attr('transform', 'translate(' + 0 + ' ' + (height - margin.bottom) + ')')
            .call(d3.axisBottom(x));

    svg.append('g')
            .attr('transform', 'translate(' + margin.left + ' ' + 0 + ')')
            .call(d3.axisLeft(y));
            
    svg.append("path")
            .attr("fill", 'url(#gradient0)')
            .attr("d", area(data, x));
    
    return svg.node();
}
