var game = {
    clicks: 0,
    macros: 0,
    mouses: 0,
    totals: 0,
    humans: 0
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
    var macroCost = Math.floor(10));
    if (game.clicks >= macroCost) {
        game.macros = game.macros + 1;
        game.clicks = game.clicks - macroCost;
        document.getElementById('macros').innerHTML = game.macros;
        document.getElementById('clicks').innerHTML = game.clicks;
    };
    var nextCost = Math.floor(10));
    document.getElementById('macroCost').innerHTML = nextCost;
};

function buyMouse() {
    var mouseCost = Math.floor(100));
    if (game.clicks >= mouseCost) {
        game.mouses = game.mouses + 1;
        game.clicks = game.clicks - mouseCost;
        document.getElementById('mouses').innerHTML = game.mouses;
        document.getElementById('clicks').innerHTML = game.clicks;
    };
    var nextCost2 = Math.floor(100));
    document.getElementById('mouseCost').innerHTML = nextCost2;
};

function buyHuman() {
    var humanCost = Math.floor(10000));
    if (game.clicks >= humanCost) {
        game.humans = game.humans + 1;
        game.clicks = game.clicks - humanCost;
        document.getElementById('humans').innerHTML = game.humans;
        document.getElementById('clicks').innerHTML = game.clicks;
    };
    var nextCost3 = Math.floor(10000));
    document.getElementById('humanCost').innerHTML = nextCost3;
};

function upgradeMacros(number) {
    if (game.mouses >= 1) {
        game.macros += number;
        document.getElementById('mouses').innerHTML = game.mouses;
        document.getElementById('macros').innerHTML = game.macros;
    };
};

function upgradeMouses(number) {
    if (game.humans >= 1) {
        game.mouses += number;
        document.getElementById('mouses').innerHTML = game.mouses;
        document.getElementById('humans').innerHTML = game.humans;
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
    return upgradeMouses(game.humans);
};

function gameLoop3() {
    return clickClick(game.macros);
};

setInterval(gameLoop, 1000);
setInterval(gameLoop2, 1000);
setInterval(gameLoop3, 1000);
