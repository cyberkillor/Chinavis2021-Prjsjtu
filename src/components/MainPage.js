import React from "react";
import { useState, useEffect } from "react"
import * as d3 from "d3";
import ReactAMAP from 'react-amap'


function mapCreatedHandler(mapInstance) {
    let map = mapInstance;
    map.setZoom(4);
    map.setCenter([105, 35]);
}

let pollutant, month, day;
function bindDirt(){
    let btns = document.getElementsByClassName("btn");
    console.log(btns);
    console.log(btns.length);
    for(let i = 0; i < btns.length; i++){
        btns[i].addEventListener("click", e => {
            pollutant = e.target.innerText;
            console.log(e.target.innerText);
            // fetchData()
        });
    }

    btns = document.getElementsByClassName("btn-m");
    console.log(btns);
    console.log(btns.length);
    for(let i = 0; i < btns.length; i++){
        btns[i].addEventListener("click", e => {
            month = e.target.innerText;
            console.log(e.target.innerText);
            // fetchData()
        });
    }
}

const MainPage = () => {
    bindDirt();
    return (
        <div id='main-map'>
            <ReactAMAP.Map amapkey={'ecb9288ffdad7c96ea95abae13789da7'} events={ {created: mapCreatedHandler} }/>
        </div>
    )
}
export default MainPage