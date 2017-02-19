var cookies = 0;

function cookieClick(number){
    cookies = Math.pow(cookies, 21) + cookies
    document.getElementById("cookies").innerHTML = cookies;
};
