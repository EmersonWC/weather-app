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
    var city = cities[i];

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

        // api for uvindex
        var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?appid="+ key+ "&lat=" + CoordLat + "&lon=" + CoordLon;
        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function(responseuv) {
            var cityUV = $("<span>").text(responseuv.value);
            var cityUVp = $("<p>").text("UV Index: ");
            cityUVp.append(cityUV);
            $("#today-weather").append(cityUVp);
            console.log(typeof responseuv.value);
            if(responseuv.value > 0 && responseuv.value <= 2){
                cityUV.attr("class", "yellow")
            }
            else if (responseuv.value > 2 && responseuv.value <= 5){
                cityUV.attr("class", "orange")
            }
            else if (responseuv.value > 5 && responseuv.value <= 10){
                cityUV.attr("class", "red")
            }
            else{
                cityUV.attr("class", "purple")
            }
        });

        // 5 day forecast api
        var queryURL3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + key;
        $.ajax({
            url: queryURL3,
            method: "GET"
        }).then(function(response5day){
            $("#boxes").empty();
            console.log(response5day);
            for(var i=0, j=0; j<=5; i=i+6){
                var read_date = response5day.list[i].dt;
                if(response5day.list[i].dt != response5day.list[i+1].dt){
                    var FivedayDiv = $("<div>");
                    FivedayDiv.attr("class", "col-3 m-2 bg-primary")
                    // 0 sets date to epoch
                    var d = new Date(0); 
                    d.setUTCSeconds(read_date);
                    var date = d;
                    console.log(date);
                    var month = date.getMonth()+1;
                    var day = date.getDate();
                    var dayOutput = date.getFullYear() + '/' +
                    (month<10 ? '0' : '') + month + '/' +
                    (day<10 ? '0' : '') + day;
                    var Fivedayh4 = $("<h6>").text(dayOutput);

                // img src
                var imgtag = $("<img>");
                var skyconditions = response5day.list[i].weather[0].main;
                   if(skyconditions==="Clouds"){
                       imgtag.attr("src", "https://img.icons8.com/color/48/000000/cloud.png")
                   } else if(skyconditions==="Clear"){
                       imgtag.attr("src","https://img.icons8.com/color/48/000000/summer.png")
                   } else if(skyconditions==="Rain"){
                       imgtag.attr("src", "https://img.icons8.com/color/48/000000/rain.png")
                   }

                var pTemperatureK = response5day.list[i].main.temp;
                console.log(skyconditions);
                var TempetureToNum = parseInt((pTemperatureK)* 9/5 - 459);
                var pTemperature = $("<p>").text("Tempeture: "+ TempetureToNum + " °F");
                var pHumidity = $("<p>").text("Humidity: "+ response5day.list[i].main.humidity + " %");
                FivedayDiv.append(Fivedayh4);
                FivedayDiv.append(imgtag);
                FivedayDiv.append(pTemperature);
                FivedayDiv.append(pHumidity);
                $("#boxes").append(FivedayDiv);
                console.log(response5day);
                j++;
                }
            }
        });
    });
}


// click funtion for each li
$(document).on("click", "#listC", function(){
    var thisCity = $(this).attr("data-city");
    getResponseWeather(thisCity);
});
