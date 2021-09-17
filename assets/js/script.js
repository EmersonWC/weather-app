var cityList =$("#city-list");
var cities = [];
var key = "495437428674bb2867626ec4c0bdcf64";

// format for day 
function FormatDay(date){
var date = new Date();
console.log(date);
var month = date.getMonth()+1;
var day = date.getDate();

var dayOutput = date.getFullYear() + '/' +
(month<10 ? '0' : '') + month + '/' +
(day<10 ? '0' : '') + day;
return dayOutput;
}

// Calling function init();
init();


function init (){
    // retrieve saved cities from localstorage 
    // then we parse the json string to an object
    var storedCities = JSON.parse(localStorage.getItem("cities"));

    // if cities were recieved from LS, update the cities array to match
    if (storedCities !== null) {
        cities = storedCities;
    }
    // render citiess to the dom
    renderCities();
    console.log(cities);
}

function storeCities(){
    //stringify and place "cities" key in LS to the cities array
    localStorage.setItem("cities", JSON.stringify(cities));
    console.log(localStorage);
}

function renderCities() {
    //clear the citylist element
    cityList.empty();

for (var i = 0; i < cities.length; i++) {
    var city = cities[1];

    var li = $("<li>").text(city);
    li.attr("id", "listC");
    li.attr("data-city", city);
    li.attr("class", "list-group-item");
    console.log(li);
    cityList.prepend(li);
}
// retrieve response weather for first city
if (!city){
    return
}
else {
    getResponseWeather(city)
};
}

// on form submit
$("#add-city").on("click", function(event){
    event.preventDefault();

    // grab city from input box
    var city = $("#city-input").val().trim();

    // return if submit is blank
    if (city === "") {
        return;
    }
    // passing city input to the city array
    cities.push(city);
    // save new cities in LS, refresh list
    storeCities();
    renderCities();
});

// get the response header

function getResponseWeather(cityName){
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&appid=" + key;

    // empty content for today-weather
    $("#today-weather").empty();
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {

        // new table row
        cityTitle = $("<h3>").text(response.name + " "+ FormatDay());
        $("#today-weather").append(cityTitle);
        var TempetureToNum = parseInt((response.main.temp)* 9/5 - 459);
        var cityTemperature = $("<p>").text("Tempeture: "+ TempetureToNum + " °F");
        $("#today-weather").append(cityTemperature);
        var cityHumidty = $("<p>").text("Humidity: "+ response.main.humidity + " %");
        $("#today-weather").append(cityHumidty);
        var cityWindSpeed = $("<p>").text("Wind Speed: "+ response.wind.speed + " MPH");
        $("#today-weather").append(cityWindSpeed);
        var CoordLon = response.coord.lon;
        var CoordLat = response.coord.lat;
    })
}

