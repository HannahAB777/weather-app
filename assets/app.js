const button = document.getElementById("button");
const city = document.getElementById("city");
const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const UV = document.getElementById("UV");
const todayIcon = document.getElementById("icon");
const dayContainer = document.getElementById("five-day-forecast");
const searchHistoryContainer = document.getElementById("search-history");
const currentdate = document.getElementById("current-date");
const todaysDate = moment().format("dddd D/MM");
const placeInput = document.getElementById("search");
const currentForecast = document.getElementById("current-forecast");
const errorEl = document.getElementById("error");

let cityarray = [];

function init() {
  // if array loop through it and append lis
  const cityarraystring = localStorage.getItem("citys"); // localStorage returns strings
  cityarray = JSON.parse(cityarraystring);

    for (let i = 0; i < cityarray[i]; i++) {
      const cityvalue = cityarray[i];
      const cityLi = document.createElement("li");
      cityLi.classList.add("search");
      searchHistoryContainer.appendChild(cityLi);
      cityLi.textContent = cityvalue;
    }

}

init();

//current date show at the top of the page
currentdate.textContent = todaysDate;
//click event to retrieve the search input for API retrieval and to store in local storage
button.addEventListener("click", function (event) {
  event.preventDefault();
  errorEl.textContent = "";
  const placeInput = document.getElementById("search");
  let place = placeInput.value;

  if (place != "") {

    cityarray.push(place);


    const cityarraystring = JSON.stringify(cityarray);
    localStorage.setItem("citys", cityarraystring);

    const cityLi = document.createElement("li");
    cityLi.classList.add("search");
    searchHistoryContainer.appendChild(cityLi);
    cityLi.textContent = place;

  
    NewForecast();
    placeInput.value = "";
  }

});
//creating a function for a card for future forecast to be displayed
function createCards(date, icon, temp, humidity, wind) {


  const card = document.createElement('div');
  card.setAttribute('class', 'card');
  card.setAttribute('class', 'col');

  const iconEl = document.createElement("img");
  iconEl.setAttribute("src", "https://openweathermap.org/img/w/" + icon + ".png");
  card.appendChild(iconEl);

  const weathercontainer = document.createElement('div');
  weathercontainer.setAttribute("class", "card-body");
  card.appendChild(weathercontainer);

  const dateheader = document.createElement("h4");
  dateheader.setAttribute("class", "card-title");
  weathercontainer.appendChild(dateheader);
  dateheader.textContent = moment.unix(date).format("dddd D/MM");
  
  const p = document.createElement('p');
  weathercontainer.appendChild(p);
  
  const ul = document.createElement('ul');
  p.appendChild(ul);
  
  const tempLi = document.createElement('li');
  ul.appendChild(tempLi);
  tempLi.textContent = "Temperature: " + (Math.floor(temp - 273.15)) + "°C";
  
  const humidityEl = document.createElement('li');
  ul.appendChild(humidityEl);
  humidityEl.textContent = "Humidity: " + humidity;
  
  const windEl = document.createElement('li');
  ul.appendChild(windEl);
  windEl.textContent = "Wind: " + wind + "km/h";
  
  return card;
}
function NewForecast() {
  //taking the input and searching for weather data
  let place = placeInput.value;
  const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + place + '&appid=8036ed1d4d3026cb916b26417cd7e2c8';

  fetch(weatherUrl)
    .then(function (response) {
      if (response.ok)
        return response.json();
      if (!response.ok)
        errorEl.textContent = "City not found";
    })
    .then(function (data) {
      //entering the data into the container for todays forecast
      city.textContent = "City: " + data.name;
      temp.textContent = "Temperature: " + (Math.floor(data.main.temp - 273.15)) + "°C";
      humidity.textContent = "Humidity: " + data.main.humidity;
      wind.textContent = "Wind: " + data.wind.speed + "km/h";
      todayIcon.src = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
      const todayLat = data.coord.lat;
      const todayLon = data.coord.lon;
      //retrieving the icon
      const UVToday = "https://api.openweathermap.org/data/2.5/onecall?lat=" + todayLat + "&lon=" + todayLon + "&appid=8036ed1d4d3026cb916b26417cd7e2c8";
      return fetch(UVToday)
        .then(function (response) {
          return response.json();
        });
    }).then(function (oneCallData) {
      UV.textContent = "UV-Index: " + Math.floor(oneCallData.current.uvi);
      const UVdata = Math.floor(oneCallData.current.uvi);
      //if statments to change the colour of the UV element in correlation with UV intensity
      UV.classList.remove("favourable");
      UV.classList.remove("moderate");
      UV.classList.remove("high");
      UV.classList.remove("severe");
      if (UVdata < 3) {
        UV.classList.add("favourable");
      }
      if (UVdata >= 3 && UVdata <= 5) {
        UV.classList.add("moderate");
      }
      if (UVdata > 5 && UVdata <= 8) {
        UV.classList.add("high");
      }
      if (UVdata >= 9) {
        UV.classList.add("severe");
      }
      dayContainer.textContent = "";
      const forecast = oneCallData.daily.slice(1, 6);
      //looping through the data and creating cards and filling them with the data shown below
      for (let i = 0; i < forecast.length; i++) {
        const weather = forecast[i];

        const card = createCards(weather.dt, weather.weather[0].icon, weather.temp.day, weather.humidity, weather.wind_speed);

        dayContainer.appendChild(card);
      }
    });

}

//when a list item is clicked the forecast is then shown for the place that its textcontent refers to
searchHistoryContainer.addEventListener("click", function (event) {
  const listItem = event.target;
  console.log(event.target);
  const newSearch = listItem.textContent;
  placeInput.value = newSearch;
  NewForecast();
  placeInput.value = "";
});