const searchButton = document.querySelector(".search-button");
const cityInput = document.querySelector(".city-input");

const API_Key = "7cd78ad00e6a12c5440049d42f3f821e";

const getWeatherDetails = (cityName,lat,lon) => {
    const WEATHER_API_URL=`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_Key}
`;
fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
    console.log(data);
}).catch( () => {
    alert("An error occurred while fetching the weather forecast!");
});
}

const getCityCoordinates = () => {
    const cityName=cityInput.value.trim();
    if(!cityName)return;
    const Geocding_Api_URL=`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_Key}`;
    fetch(Geocding_Api_URL).then(res => res.json()).then(data => {
        if(!data.length)return alert(`No coordinates found for ${cityName}`);
        const{ name,lat,lon } = data[0];
        getWeatherDetails(name,lat,lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
}
searchButton.addEventListener("click", getCityCoordinates);