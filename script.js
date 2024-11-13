const searchButton = document.querySelector(".search-button");
const cityInput = document.querySelector(".city-input");
const locationButton = document.querySelector(".location-btn");
const weatherCardsDiv = document.querySelector(".other-day-for-box");
const currentWeatherDiv = document.querySelector(".weather-box");

const API_Key = "7cd78ad00e6a12c5440049d42f3f821e";
const createWeatherCard = (cityName,weatherItem,index) => {
    if(index === 0){
        return `<div class="weather-details">
                <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                <h3>Temperature : ${(weatherItem.main.temp - 273.15).toFixed(2)} C</h3>
                <h3>Wind : ${weatherItem.wind.speed} M/S</h3>
                <h3>Humidity : ${weatherItem.main.humidity} %</h3>
            </div>
            <div class="img">
                <img src="http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png"alt="Weather-img" height="100px">
                <h2>${weatherItem.weather[0].description}</h2>
            </div>`;
    }else{
    return `<div class="Day-one">
                 <h2>(${weatherItem.dt_txt.split(" ")[0]})</h2>
                 <img src="http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png"alt="Weather-img" height="100px">
                <h3>Temperature:${(weatherItem.main.temp - 273.15).toFixed(2)}C</h3>
                <h3>Wind:${weatherItem.wind.speed} M/S</h3>
                <h3>Humidity:${weatherItem.main.humidity}%</h3>
                </div>`
}
}
const getWeatherDetails = (cityName,lat,lon) => {
    const WEATHER_API_URL=`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_Key}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
   
    const uniqueForecastDays = [];
    
    const fiveDaysForecast = data.list.filter(forecast => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if(!uniqueForecastDays.includes(forecastDate)){
            return uniqueForecastDays.push(forecastDate);
        }   
    });
    cityInput.value = "";
    currentWeatherDiv.innerHTML = "";
    weatherCardsDiv.innerHTML = "";
    console.log(fiveDaysForecast);
    fiveDaysForecast.forEach((weatherItem,index) => {
        if(index === 0){
            currentWeatherDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName,weatherItem,index));
        } else{
        weatherCardsDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName,weatherItem,index));
        } 
    });
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if(!cityName) return;
    const Geocding_Api_URL=`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_Key}`;
    fetch(Geocding_Api_URL).then(res => res.json()).then(data => {
        if(!data.length)return alert(`No coordinates found for ${cityName}`);
        const{ name,lat,lon } = data[0];
        getWeatherDetails(name,lat,lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude} = position.coords;
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit={limit}&appid=${API_Key}`;
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                const{ name } = data[0];
                getWeatherDetails(name,latitude,longitude);
            }).catch(() => {
                alert("An error occurred while fetching the city!");
            });
        },
        error => {
            if(error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied .Please reset location permission to grant access ")
            }
        }
    );
}
locationButton.addEventListener("click",getUserCoordinates);
searchButton.addEventListener("click",getCityCoordinates);
cityInput.addEventListener("Keyup",e => e.key == "Enter" && getCityCoordinates());
    
