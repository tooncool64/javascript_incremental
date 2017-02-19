var cookies = 0;

function cookieClick(number){
    cookies = Math.pow(cookies, 4);
    document.getElementById("cookies").innerHTML = cookies;
};
