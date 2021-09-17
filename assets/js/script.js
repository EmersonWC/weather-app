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