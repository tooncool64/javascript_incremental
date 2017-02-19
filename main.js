var cookies = 0;

function cookieClick(number){
    cookies = Math.pow(3, 4) + cookies
    document.getElementById("cookies").innerHTML = cookies;
};
if cookies < 1000 {
    console.log("wow");
}
