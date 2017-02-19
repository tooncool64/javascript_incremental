var cookies = 0;

function cookieClick(number){
    cookies = Math.pow(cookies, 21) + 2
    document.getElementById("cookies").innerHTML = cookies;
};
