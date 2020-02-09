var tab = 0;

//function to get the weather for the city searched
function getWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&APPID=db9b79a42e674bfb91782df53b8c0084";
    
    //creates an AJAX request to the weather API for a 5 day forecast
    $.get(queryURL).then(function (response) {
        var icon = response.list[0].weather[0].icon;
        var date = "  (" + moment().format("l") + ")";
        $("#display").empty();
        var currentCity = $("<div>", {
            "text": response.city.name + ", " + response.city.country + date,
            "style": "font-size: 24px"
        });
        
        //creates the display for the current weather forecast  
        var iconImg = $("<img>", {
            "class": "weatherIcon",
            "width": "70px",
            "height": "70px",
            "src": "http://openweathermap.org/img/wn/" + icon + "@2x.png"});
       var currentTemp = $("<div>").text("Temperature: " + response.list[0].main.temp + "°F");
       var currentFeel = $("<div>").text("Feels Like: " + response.list[0].main.feels_like + "°F");
       var currentHumidity = $("<div>").text("Humidity: " + response.list[0].main.humidity + "%");
       var currentWind = $("<div>").text("Wind Speed: " + response.list[0].wind.speed + " MPH");
       var currentUV = $("<div>").text("UV Index: " + getUV(response.list[0].clouds.all));
       
        currentCity.append(iconImg);
        $("#display").append(currentCity);
        $("#display").append(currentTemp);
        $("#display").append(currentFeel);
        $("#display").append(currentHumidity);
        $("#display").append(currentWind);
        $("#display").append(currentUV);
        
        $("#forecast").empty();

        //creates the next 5 day forecast for the city 
        for (let index = 1; index < 6; index++) {
            icon = response.list[(index*8)-1].weather[0].icon;
            var imgIcon = $("<img>", {
                "src": "http://openweathermap.org/img/wn/" + icon + "@2x.png",
                "class": "tinyIcons",
                "width": "40px",
                "height": "40px"
            })
            var block = $("<span>", {
                "class": "blocks"
            });
            var temp = $("<p>", {
                "id": "blockText",
                "text": "Temp: " + response.list[(index*8)-1].main.temp + "°F"
            });
            var hum = $("<p>", {
                "id": "blockText",
                "text": "Hum: " + response.list[(index*8)-1].main.humidity + "%"
            });
            var wind = $("<p>", {
                "id": "blockText",
                "text": "Wind: " + response.list[(index*8)-1].wind.speed + " MPH"
            });

            block.text(moment().add(index, "days").format("l"));
            block.append(imgIcon);
            block.append(temp);
            block.append(hum);
            block.append(wind);
            $("#forecast").append(block);
        }
        
    //prevents a city block being made twice when a previous city is gone back to 
    if (tab == 0)
            addCityPanel(response.city.name);
    tab = 0;
    });
}

//calculates UV index. Needs adjustment for elevation.
function getUV(clouds) {
    var ratingUV = ((280 * (((100 - parseInt(clouds)) / 100))) / 25).toFixed(2);
    return ratingUV;
}

//creates a city block and adds it to the panel
function addCityPanel(city){
    var cityBlock = $("<div>", {
        "class": "cityBlock"
    });
    cityBlock.text(city);
    $(".city-panel").append(cityBlock);
    $("#searchBar").val("");
}

//handles a new city search on the click of the search button
$("#btn-search").on("click", function(){
    getWeather($("#searchBar").val())
});
    
//enables the user to go back to an already searched city
$(document).on("click", ".cityBlock", function () {
    tab = 1;
    getWeather($(this).text());
})

//makes an initial call to automatically show San Diego
//want to enable it for current location with a better API then the Windows position coordinates
getWeather("San Diego");