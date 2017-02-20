var game = {
    cookies: game.cookies,
    totals: game.totals
};

function cookieClick(number){
    game.cookies += number;
    document.getElementById("cookies").innerHTML = game.cookies;
};

function getTotal(number) {
    game.totals += number;
    document.getElementById("totals").innerHTML = game.totals;
};

function save() {
    window.localStorage.setItem("mySaveData", JSON.stringify(game));
};

function load() {
    game = JSON.parse(window.localStorage.getItem("mySaveData"));
};

function deleteSave() {
    localStorage.removeItem("mySaveData");
};

function gameLoop() {
   var game = {
    cookies: game.cookies,
    totals: game.totals
};
    if (game.totals > 50) {
        document.write("Goal Complete!");
        document.getElementById("totals").innerHTML = game.totals;
      
    };
    window.localStorage.setItem("mySaveData", JSON.stringify(game));
}

setInterval(gameLoop, 100);
