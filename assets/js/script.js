var pastSearchList = JSON.parse(localStorage.getItem("cityList")) || [];

function displayPastSearches() {
    var pastSearch = JSON.parse(localStorage.getItem("cityList")) || [];
    var pastSearchesEl = document.querySelector(".past-searches");

    for (var i=0; i < pastSearch.length; i++) {
        var pastSearchesLi = document.createElement("button");
        pastSearchesLi.classList.add("past-button");
        pastSearchesLi.setAttribute("id", pastSearch[i])
        pastSearchesLi.innerHTML = pastSearch[i];
        pastSearchesEl.appendChild(pastSearchesLi);

    };
};

function updatePastSearches() {
    var pastSearchesEl = document.querySelector(".search-history");
    var pastSearch = document.querySelector("#city").value;
        if (pastSearchList.indexOf(pastSearch) == -1) {
            pastSearchList.push(pastSearch)
            localStorage.setItem("cityList", JSON.stringify(pastSearchList));
        }

    pastSearchesEl.innerHTML = "";

    displayPastSearches();
    
};

function forecast(response) {

    $(".forecast").append("<h3>5-Day Forecast:</h3>");
    var count = 0;

    $(".forecast-days").each(function() {
        var dayDate = moment().add(count + 1, 'days').format("MM/DD/YY");
        var htmlDay = "<p class='date'>" + dayDate + "</p>" + 
        "<img class='icon' id='wicon' src='http://openweathermap.org/img/wn/" + response.daily[count].weather[0].icon + "@2x.png'>" +
        "<p>Temp: " + response.daily[count].temp.day + " F</p>" +
        "<p>Wind: " + response.daily[count].wind_speed + " mph</p>" +
        "<p>Humidity: " + response.daily[count].humidity + "</p>";
        $(this).append(htmlDay);
        count++;
      });
};

function search() {

    var textInput = document.querySelector("#city").value;
    var locationApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + textInput + "&appid=03a0fca083f2a917c2b44f34472f77e8";
    var cityName = "";

    fetch(locationApiUrl)

        .then(function(locationResponse) {
            return locationResponse.json();

        })

        .then(function(locationResponse) {
            var longitude = locationResponse.coord.lon;
            var latitude = locationResponse.coord.lat;
            cityName = locationResponse.name;

            return fetch(
                "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=minutely,hourly,alerts&units=imperial&appid=03a0fca083f2a917c2b44f34472f77e8"
            )
        })

        .then(function(response) {
            return response.json();
        })

        .then(function(response) {
            clearContent();
            forecast(response);
            updatePastSearches();
            today(response, cityName);
        })
};



function clearContent() {
    $(".forecast-day").empty();
    document.querySelector(".current").innerHTML = "";
    document.querySelector(".forecast").innerHTML = "";
};

displayPastSearches();

$(".past-searches").on("click", "button", function() {
    var pastSearch = $(this).attr("id");
    document.querySelector("#city").value = pastSearch;
    document.querySelector(".button").click();
  });