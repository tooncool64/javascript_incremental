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
window.localStorage['globalGame'] = JSON.stringify(game);
};

function load() {
game = JSON.parse(window.localStorage['globalGame']);
};

function deleteSave() {
localStorage.removeItem('globalGame');
};
