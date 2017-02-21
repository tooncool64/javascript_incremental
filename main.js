var game = {
    clicks: 0,
    totals: 0,
    macros: 0,
    mouses: 0
};

function clickClick(number){
    game.clicks += number;
    document.getElementById("clicks").innerHTML = game.clicks;
};

function getTotal(number) {
    game.totals += number;
    document.getElementById("totals").innerHTML = game.totals;
};

function buyMacro() {
    var macroCost = Math.floor(10 * Math.pow(1.1, game.macros));
    if (game.clicks >= macroCost) {
        game.macros = game.macros + 1;
        game.clicks = game.clicks - macroCost;
        document.getElementById('macros').innerHTML = game.macros;
        document.getElementById('clicks').innerHTML = game.clicks;
    };
    var nextCost = Math.floor(10 * Math.pow(1.1, game.macros));
    document.getElementById('macroCost').innerHTML = nextCost;
};

function buyMouse() {
    var mouseCost = Math.floor(100 * Math.pow(1.1, game.mouses));
    if (game.clicks >= mouseCost) {
        game.mouses = game.mouses + 1;
        game.clicks = game.clicks - mouseCost;
        document.getElementById('mouses').innerHTML = game.mouses;
        document.getElementById('clicks').innerHTML = game.mouses;
    };
    var nextCost2 = Math.floor(100 * Math.pow(1.1, game.mouses));
    document.getElementById('mouseCost').innerHTML = nextCost2;
};

function upgradeMacros() {
    if (game.mouses >= 1) {
        game.macros = game.macros + 1;
        document.getElementById('mouses').innerHTML = game.mouses;
        document.getElementById('macros').innerHTML = game.macros;
    };
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
    return upgradeMacros(game.mouses);
};

function gameLoop2() {
    return clickClick(game.macros);

};
setInterval(gameLoop, 100);
setInterval(gameLoop2, 1000);
