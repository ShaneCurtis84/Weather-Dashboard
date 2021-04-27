// My Open Weather Map API key
var myApiKey = "dbbda951f3cd2c69000c03b9ba68c24f";

//Selecting exisiting html elements
var currentWeather = document.getElementById("current-weather");
var futureWeather = document.getElementById("future-weather");
var searchCityInput = document.querySelector(".searchInput");
var searchButtonEl = document.querySelector(".btn");
var pastCityUl = document.getElementById("past-search-list");

//Variable for current day
var today = moment().format("DD/MM/YYYY");

//Array to store saved history
var pastCitiesSearched = [];

//Create past Cities searched list based on local storage history
function generateCityHistory() {
  var pastCities = JSON.parse(localStorage.getItem("pastCities"));

  if (pastCities === null) {
    return;
  } else {
    //Loop to create element and append for each city in local storage
    for (var i = 0; i < pastCities.length; i++) {
      previousCityLi = document.createElement("li");
      previousCityLi.setAttribute("class", "title is-4 list-items");
      previousCityLi.innerHTML = "<a>" + pastCities[i] + "</a>";
      pastCityUl.append(previousCityLi);
    }
  }
}

// Function to call weather when previous cities links are clicked
var pastCitiesWeatherCall = function (event) {
  // Target city in Link
  var city = event.target.textContent;
  // Call weather api
  callWeather(city);
};

//Create search history from form input
function createSearchHistory() {
  //Form input variable
  var city = searchCityInput.value.trim().toUpperCase();

  if (city) {
    //create elements for city list
    previousCityLi = document.createElement("li");
    previousCityLi.setAttribute("class", "title is-4 list-items");
    previousCityLi.innerHTML = "<a>" + city + "</a>";
    pastCityUl.append(previousCityLi);

    //Push new cities searched to array
    pastCitiesSearched.push(city);
    //Save to local storage
    localStorage.setItem("pastCities", JSON.stringify(pastCitiesSearched));

    //Call weather api function
    callWeather(city);

    //Clear form input once search has been clicked
    searchCityInput.value = "";
  } else {
    // Alert if incorrect city
    alert("Please enter valid city.");
  }
}

function callWeather(city) {
  //Api call for current city and weather info
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${myApiKey}&units=metric`,
    {}
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      //Variables for weather data
      var cityName = data.name;
      var cityTemp = data.main.temp;
      var cityWind = data.wind.speed;
      var cityHumid = data.main.humidity;

      //Empty current weather data before displaying new city
      currentWeather.innerHTML = "";

      //current city elements
      currentWeather.setAttribute("style", "border: 1px solid grey");

      var cityDateImageEl = document.createElement("section");
      var currentCity = document.createElement("h4");
      currentCity.setAttribute("class", ".cityName title is-4");
      currentCity.textContent = cityName + "  " + today;

      var weatherIconEl = document.createElement("img");
      weatherIconEl.setAttribute(
        "src",
        "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png"
      );

      var currentTemp = document.createElement("h5");
      currentTemp.setAttribute("class", ".temp subtitle is-5");
      currentTemp.textContent = "Temp: " + cityTemp + " °C";

      var currentWind = document.createElement("h5");
      currentWind.setAttribute("class", ".wind subtitle is-5");
      currentWind.textContent = "Wind: " + cityWind + " KPH";

      var currentHumidity = document.createElement("h5");
      currentHumidity.setAttribute("class", ".humid subtitle is-5");
      currentHumidity.textContent = "Humidity: " + cityHumid + "%";

      cityDateImageEl.append(currentCity, weatherIconEl);
      cityDateImageEl.setAttribute("class", "city-section");
      currentWeather.append(
        cityDateImageEl,
        currentTemp,
        currentWind,
        currentHumidity
      );
      //Call api to retrieve UV index data
      callUVIndex(data.coord.lon, data.coord.lat);
    });

  //Call api to retrive 5 day forecast
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${myApiKey}&units=metric`,
    {}
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      //Empty city data in 5 day forecast cards
      futureWeather.innerHTML = "";

      //loop to generate a card and data for next 5 days
      for (var i = 1; i < 6; i++) {
        var date = moment().add(i, "d").format("DD/MM/YYYY");

        //Data variables
        var fiveDayTemp = data.list[i].main.temp;
        var fiveDayWind = data.list[i].wind.speed;
        var fiveDayHumid = data.list[i].main.humidity;

        //Create 5 day forecast cards
        var cardColumn = document.createElement("div");
        cardColumn.setAttribute(
          "class",
          "column is-one-fifth card-columns-nested"
        );

        //Elements for weather data

        var fiveCards = document.createElement("div");
        fiveCards.setAttribute("class", "card");

        var fiveDayDate = document.createElement("h3");
        fiveDayDate.textContent = date;

        var fiveIconEl = document.createElement("img");
        fiveIconEl.setAttribute(
          "src",
          "https://openweathermap.org/img/wn/" +
            data.list[i].weather[0].icon +
            ".png"
        );

        var fiveTemp = document.createElement("h3");
        fiveTemp.textContent = "Temp: " + fiveDayTemp + " °C";

        var fiveWind = document.createElement("h3");
        fiveWind.textContent = "Wind: " + fiveDayWind + " KPH";

        var fiveHumid = document.createElement("h3");
        fiveHumid.textContent = "Humidity: " + fiveDayHumid + "%";

        futureWeather.append(cardColumn);
        cardColumn.append(fiveCards);
        fiveCards.append(
          fiveDayDate,
          fiveIconEl,
          fiveTemp,
          fiveWind,
          fiveHumid
        );
      }
    })

    .catch(function (error) {
      alert(error.message);
      searchCityInput.value = "";
      return;
    });
}

//UV index api function
function callUVIndex(lon, lat) {
  fetch(
    `https://api.openweathermap.org/data/2.5/uvi?appid=${myApiKey}&lat=${lat}&lon=${lon}`,
    {}
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      var UVI = data.value;

      var currentUVIndex = document.createElement("h5");
      currentUVIndex.setAttribute("class", "subtitle is-5");
      currentUVIndex.textContent = "UV Index: " + UVI;

      currentWeather.append(currentUVIndex);
      if (UVI > 6) {
        currentUVIndex.setAttribute("style", "background-color:red;");
      } else if (UVI < 2) {
        currentUVIndex.setAttribute("style", "background-color:green;");
      } else {
        currentUVIndex.setAttribute("style", "background-color:orange;");
      }
      return UVI;
    });
}

//Click Handler for search input and past cities links

searchButtonEl.addEventListener("click", createSearchHistory);
pastCityUl.addEventListener("click", pastCitiesWeatherCall);

//Load city history when page loads
generateCityHistory();
