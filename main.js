var cookies = 0;

function cookieClick(number){
    cookies = cookies + Math.pow(number, 2)
    document.getElementById("cookies").innerHTML = cookies;
};
