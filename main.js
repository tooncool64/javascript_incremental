/* var game = {
    cookies: 0,
    totals: 0
};

function cookieClick(number){
    game.cookies += number;
    document.getElementById("cookies").innerHTML = game.cookies;
};

function getTotal(number) {
    game.totals += number;
    document.getElementById("totals").innerHTML = game.totals;
};

function saveGame() {
    window.localStorage.setItem("mySaveData", JSON.stringify(game));
};

function loadGame() {
    game = JSON.parse(window.localStorage.getItem("mySaveData"));
};

function deleteSave() {
    localStorage.removeItem("mySaveData");
};

function gameLoop() {
    if (game.totals > 50) {
        document.write("Goal Complete!");
        document.getElementById("totals").innerHTML = game.totals;
    };
}

setInterval(gameLoop, 100); */
var cookies = 0
var totals = 0
var globalGame = {
    cookies: cookies,
    totals: totals
};
 
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
 
function save() {
var globalGame = {
    cookies: cookies,
    totals: totals
}
    window.localStorage['globalGame'] = JSON.stringify(globalGame);
};
 
function load() {
var globalGame = {
    cookies: cookies,
    totals: totals
}
    globalGame = JSON.parse(window.localStorage['globalGame']);
};
 
function deleteSave() {
var globalGame = {
    cookies: cookies,
    totals: totals
}
    localStorage.removeItem('globalGame');
};
