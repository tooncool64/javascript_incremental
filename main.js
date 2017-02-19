var cookies = 0;

function cookieClick(number){
    cookies = cookies + number * cookies * 4
    document.getElementById("cookies").innerHTML = cookies;
};
