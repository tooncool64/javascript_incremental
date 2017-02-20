var game = {
    cookies: {
        amount: [1]
    },
    totals: {
        amount: [1]
    }
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

setInterval(gameLoop, 100);
