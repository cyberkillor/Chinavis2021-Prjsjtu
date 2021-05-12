import * as d3 from "d3";
import React, {Component} from "react";
import geoData from "./中华人民共和国.json"

const colorConfig = {
    "#6495ED": [800000, 899999],
    "#191970": [700000, 799999],
    "#000080": [600000, 699999],
    "#87CEFA": [500000, 599999],
    "#87CEEB": [400000, 499999],
    "#00BFFF": [300000, 399999],
    "#1E90FF": [200000, 299999],
    "#4169E1": [100001, 199999],
    "#FFFFFF": [100000]
}

class ChinaMap extends Component{

    componentDidMount() {
        // const geoData = geoData.features.filter((m) => m.properties.name);
        const width = 1100;
        const height = 900;
        const svg = d3.select("#ChinaMap").attr('height', height).attr('width', width);

        this.renderMainLand(svg, [105, 31], 800, width, height);
        this.renderSouthSea(svg, [62, 39], 400, width, height);
    }

    renderMainLand = (svg, center, scale, width, height) =>{
        const g = svg.append('g');
        const mainLand = geoData[0].features.filter((m) => m.properties.name !== "海南省" && m.properties.name);

        // console.log(colors);
        const projection = d3.geoMercator()
            .center(center)
            .scale(scale)
            .translate([width/2, height/2+20])

        const path = d3.geoPath().projection(projection);

        // svg.append("g")
        //     .attr("fill", "#032352")
        g.selectAll("path")
            .data(mainLand)
            .enter()
            .append("path")
            .attr("stroke", "#E0FFFF")
            .attr("stroke-width", 1)
            .attr("fill", function (d, i) {
                const adcode = d.properties.adcode;
                const ranges = Object.values(colorConfig);
                const index = ranges.findIndex((v, i) => {
                    if(v.length === 1 && adcode === v[0]) return true;
                    if(v.length === 2 && adcode >= v[0] && adcode <= v[1]) return true;
                })

                return Object.keys(colorConfig)[index];
            })
            .attr("d", path)
            .attr("style", "opacity:0.6")

        g.selectAll('text')
            .data(mainLand)
            .enter().append('text')
            .attr('transform', (d) => {
                // console.log(d.properties.name, d.properties.center || d.properties.centroid);
                const coor = projection(d.properties.center);
                if(d.properties.name.slice(0, 2) === "青海") coor[0] -= 15;
                if(d.properties.name.slice(0, 2) === "宁夏") coor[1] += 20;
                if(d.properties.name.slice(0, 2) === "江苏") coor[0] += 15;
                if(d.properties.name.slice(0, 2) === "重庆") coor[0] += 15;
                if(d.properties.name.slice(0, 2) === "浙江") coor[1] += 15;
                if(d.properties.name.slice(0, 2) === "台湾") {coor[0] += 15; coor[1] += 20;}
                if(d.properties.name.slice(0, 2) === "香港") coor[0] += 15;
                if(d.properties.name.slice(0, 2) === "澳门") coor[1] += 10;
                if(d.properties.name.slice(0, 2) === "海南") {coor[0] += 15; coor[1] += 20;}
                return "translate(" + coor[0] + "," + coor[1] + ")";
            })
            .text((d) => {
                // console.log(d.properties.name);
                if(d.properties.name.slice(0, 2) === "黑龙") return "黑龙江";
                if(d.properties.name.slice(0, 2) === "内蒙") return "内蒙古";
                return d.properties.name.slice(0, 2);
            })
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('color', '#6E6E6E')
    }

    renderSouthSea = (svg, center, scale, width, height) =>{
        const g = svg.append('g');
        const southSea = geoData[0].features.filter((m) => m.properties.name === "海南省" || !m.properties.name);

        // console.log(colors);
        const projection = d3.geoMercator()
            .center(center)
            .scale(scale)
            .translate([width/2, height/2+20])

        const path = d3.geoPath().projection(projection);
        g.selectAll("path")
            .data(southSea)
            .enter()
            .append("path")
            .attr("stroke", "#191970")
            .attr("stroke-width", 1)
            .attr("fill", function (d, i) {
                const adcode = d.properties.adcode;
                const ranges = Object.values(colorConfig);
                const index = ranges.findIndex((v, i) => {
                    if(v.length === 1 && adcode === v[0]) return true;
                    if(v.length === 2 && adcode >= v[0] && adcode <= v[1]) return true;
                })

                return Object.keys(colorConfig)[index];
            })
            .attr("d", path)
            .attr("style", "opacity:0.6")

        svg.append('rect').attr('width', 130).attr('height', 180)
            .attr('fill', 'rgba(0, 0, 0, 0)').attr('stroke', '#000').attr('stroke-width', 2)
            .attr('transform', 'translate('+ (width - 240) + ',' + (height - 320) + ')')

        g.selectAll('text')
            .data(southSea.filter((m) => m.properties.name === "海南省"))
            .enter().append('text')
            .attr('transform', (d) => {
                // console.log(d.properties.name, d.properties.center || d.properties.centroid);
                const coor = projection(d.properties.center);
                coor[0] += 10; coor[1] -= 10;
                return "translate(" + coor[0] + "," + coor[1] + ")";
            })
            .text((d) => {
                // console.log(d.properties.name);
                return d.properties.name.slice(0, 2);
            })
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('color', '#6E6E6E')
    }

    render() {
        return (
            <svg id='ChinaMap'>

            </svg>
        )
    };
}
export default ChinaMap