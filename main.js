var cookies = 0
var totals = 0

function cookieClick(number){
    cookies = cookies + 1
    document.getElementById("cookies").innerHTML = cookies;
};

function cookieClick2(number){
    cookies = cookies + 2
    document.getElementById("cookies").innerHTML = cookies;
};
function getTotal(number) {
    totals = totals + 1
    document.getElementById("totals").innerHTML = totals;
};
if (totals > 50) {
    document.write("Goal Complete!");
    document.getElementById("totals").innerHTML = totals;
};
function save(){
var save = {
    cookies: cookies,
    totals: totals
    
};
    localStorage.setItem("save",JSON.stringify(save)); 
};
window.onload = function load(){
var save = {
    cookies: cookies,
    totals: totals
    
};
var savegame = JSON.parse(localStorage.getItem("save")); 
    if (typeof savegame.cookies !== "undefined") cookies = savegame.cookies;
    if (typeof savegame.totals !== "undefined") totals = savegame.totals;
    
};
function deleteSave(){
localStorage.removeItem("save")    
};
