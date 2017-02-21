var game = {
    clicks: 0,
    totals: 0,
    macros: 0
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
};
setInterval(gameLoop, 100)(function() {
    clickClick(game.macros)
});
