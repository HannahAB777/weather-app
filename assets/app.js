let button = document.getElementById("button");
let city = document.getElementById("city");
let temp = document.getElementById("temp");
let humidity = document.getElementById("humidity");
let wind = document.getElementById("wind");
let UV = document.getElementById("UV");
let todayIcon = document.getElementById("icon");
const dayOne = document.getElementById("day-one")
const dayTwo = document.getElementById("day-two");
const dayThree = document.getElementById("day-three");
const dayFour = document.getElementById("day-four");
const dayFive = document.getElementById("day-five");
const dayContainer = document.getElementsByClassName("days");


button.addEventListener("click", function (event) {
  event.preventDefault();
  let placeInput = document.getElementById("search");
  let place = placeInput.value;
  const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + place + '&appid=8036ed1d4d3026cb916b26417cd7e2c8';

  fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      city.textContent = "City: " + data.name;
      temp.textContent = "Temperature: " + (Math.floor(data.main.temp - 273.15)) + "°C";
      humidity.textContent = "Humidity: " + data.main.humidity;
      wind.textContent = "Wind: " + data.wind.speed + "km/h";
      todayIcon.src = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
      let todayLat = data.coord.lat;
      let todayLon = data.coord.lon;
      let UVToday = "https://api.openweathermap.org/data/2.5/onecall?lat=" + todayLat + "&lon=" + todayLon + "&appid=8036ed1d4d3026cb916b26417cd7e2c8";
      return fetch(UVToday)
        .then(function (response) {
          return response.json();
        });
    }).then(function (data) {
      console.log(data);
      UV.textContent = "UV-Index: " + data.current.uvi;
    });

  futureForecast();
});



function futureForecast() {
  let placeInput = document.getElementById("search");
  let place = placeInput.value;
  const fiveDayForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + place + "&appid=8036ed1d4d3026cb916b26417cd7e2c8";

  return fetch(fiveDayForecast)
    .then(function (response) {
      return response.json();
    }).then(function (weekdata) {
      console.log(weekdata);

      const fiveDayForecast = weekdata.daily.slice(0,5);

      for (let i = 0; i < fiveDayForecast.length; i++) {
        const weather = fiveDayForecast[i];

        const col = createCards(weather.dt, '', weather.temp.day, weather.humidity, weather.wind_speed);

        dayContainer.appendChild(col);

        
      }

    });
    
    function createCards(date, icon, temp, humidity, wind) {
  
  
      const card = document.createElement('div');
      card.setAttribute('class', 'card');
      dayContainer.appendChild(card);
  
      const iconEl = document.createElement("img");
      iconEl.setAttribute("src", icon);
      card.appendChild(iconEl);
  
      const weathercontainer = document.createElement('div');
      weathercontainer.setAttribute("class", "card-body");
      card.appendChild(weathercontainer);
  
      const dateheader = document.createElement("h4");
      dateheader.setAttribute("class", "card-title");
      weathercontainer.appendChild(dateheader);
      dateheader.textContent = date;
  
      const p = document.createElement('p');
      weathercontainer.appendChild(p);
  
      const ul = document.createElement('ul');
      p.appendChild(ul);
  
      const tempLi = document.createElement('li');
      ul.appendChild(tempLi);
      tempLi.textContent = temp;
  
      const humidityEl = document.createElement('li');
      ul.appendChild(humidityEl);
      humidityEl.textContent = humidity;
  
      const windEl = document.createElement('li');
      ul.appendChild(windEl);
      windEl.textContent = wind;
      
      return col;
    }
  }
  
  //time input
  
  
  
  
  
  
  
  //a colour loop for the uv
  
  
  //local storage create a looped list for searched items
  
  