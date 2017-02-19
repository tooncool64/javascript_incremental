var cookies = 0;
var totals = 0;

function cookieClick(number){
    cookies = cookies + 1
    document.getElementById("cookies").innerHTML = cookies;
};

function cookieClick2(number){
    cookies = cookies + 2
    document.getElementById("cookies").innerHTML = cookies;
};
function getTotal(number) {
    totals = cookies - 50
    document.getElementById("totals").innerHTML = totals;
};
if (totals < 50) {
    document.write("Goal Complete!");
};
