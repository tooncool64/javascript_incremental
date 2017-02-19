var cookies = document.getElementById("cookies");

function cookieClick(number){
    cookies = cookies + 1
    document.getElementById("cookies").innerHTML = cookies;
};

function cookieClick2(number){
    cookies = cookies + 2
    document.getElementById("cookies").innerHTML = cookies;
};
function getTotal(number) {
    totals = cookies
    document.getElementById("totals").innerHTML = totals;
};
if (cookies > 50) {
    document.write("Goal Complete!");
};
