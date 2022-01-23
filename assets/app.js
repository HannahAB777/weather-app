const button = document.getElementById("button");
const city = document.getElementById("city");
const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const UV = document.getElementById("UV");
const todayIcon = document.getElementById("icon");
const dayContainer = document.getElementById("five-day-forecast");
const searchHistoryContainer = document.getElementById("search-history");

button.addEventListener("click", function (event) {
  event.preventDefault();
  const placeInput = document.getElementById("search");
  const place = placeInput.value;

  if(place != ""){

    localStorage.setItem("city", place);
    
    for (let i = 0; i < localStorage.length; i++) {
      const value= localStorage.city[i];
      ;
      const cityLi = document.createElement("li");
      searchHistoryContainer.appendChild(cityLi);
      cityLi.textContent= value;
      console.log(localStorage);
    }
    
  }








  const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + place + '&appid=8036ed1d4d3026cb916b26417cd7e2c8';

  fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      city.textContent = "City: " + data.name;
      temp.textContent = "Temperature: " + (Math.floor(data.main.temp - 273.15)) + "°C";
      humidity.textContent = "Humidity: " + data.main.humidity;
      wind.textContent = "Wind: " + data.wind.speed + "km/h";
      todayIcon.src = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
      const todayLat = data.coord.lat;
      const todayLon = data.coord.lon;
      const UVToday = "https://api.openweathermap.org/data/2.5/onecall?lat=" + todayLat + "&lon=" + todayLon + "&appid=8036ed1d4d3026cb916b26417cd7e2c8";
      return fetch(UVToday)
        .then(function (response) {
          return response.json();
        });
    }).then(function (oneCallData) {
      UV.textContent = "UV-Index: " + Math.floor(oneCallData.current.uvi);
      const UVdata = Math.floor(oneCallData.current.uvi);
      if (UVdata < 3){
        UV.classList.add("favourable");
      }
      if (UVdata >= 3 && UVdata <= 5){
        UV.classList.add("moderate");
      }
      if(UVdata >5 && UVdata <= 8){
        UV.classList.add("high");
      }
      if(UVdata >= 9){
        UV.classList.add("severe");
      }
      dayContainer.textContent= "";
      const forecast = oneCallData.daily.slice(1,6);
      
          for (let i = 0; i < forecast.length; i++) {
            const weather = forecast[i];
            
            const card = createCards(weather.dt, weather.weather[0].icon, weather.temp.day, weather.humidity, weather.wind_speed);
      
            dayContainer.appendChild(card);
          }
    });

});
function createCards(date, icon, temp, humidity, wind) {
  
  
      const card = document.createElement('div');
      card.setAttribute('class', 'card');
      card.setAttribute('class', 'col');
  
      const iconEl = document.createElement("img");
      iconEl.setAttribute("src", "https://openweathermap.org/img/w/"+ icon + ".png");
      card.appendChild(iconEl);
  
      const weathercontainer = document.createElement('div');
      weathercontainer.setAttribute("class", "card-body");
      card.appendChild(weathercontainer);
  
      const dateheader = document.createElement("h4");
      dateheader.setAttribute("class", "card-title");
      weathercontainer.appendChild(dateheader);
      dateheader.textContent = moment.unix(date).format("dddd");
  
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


  
  