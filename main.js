const api = {
    base: 'https://api.openweathermap.org/data/2.5/',
    key: '31eb2be081777629346bd0a91aa3f1e4'
};

const dateBuilder = (d) => {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    const day = days[d.getDay()];
    const date = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
}

let city = localStorage.getItem('city') || 'Ekaterinburg';
const app = document.querySelector('.app');
const input = document.querySelector('.searchbar');
const container = document.querySelector('.location-container');

let store = {};

input.addEventListener('keyup', (e) => {
    const value = e.target.value;
    if (e.key == 'Enter' && value) {
        city = value;
        localStorage.setItem('city', city);
        fetchData();
        e.target.value = '';
    }
});

const fetchData = async () => {
    getLoader();
    const response = await fetch(`${api.base}weather?q=${city}&appid=${api.key}`)
        .then(res => res.json());
    const {name, weather, main: {temp}, sys: {country}} = response;
    store = {
        name,
        weather: weather[0].main,
        temp,
        country
    };
    renderComponent();
};

const getTempCelsius = (temp) => Math.floor(temp - 273);

const getLoader = () => {
    container.innerHTML = `<span class="loader"></span>`;
}

const renderComponent = () => {
    container.innerHTML = getContent();
}

const getContent = () => {
    const {name, weather, temp, country} = store;

    if (getTempCelsius(temp) >= 0) {
        app.classList.add('warm');
    } else {
        app.classList.remove('warm');
    }

    return `<div class="location-box">
        <div class="location">
            ${name}, ${country}
        </div>
    <div class="date">${dateBuilder(new Date())}</div>
    </div>
    <div class="weather-box">
        <div class="temp">${getTempCelsius(temp)} °С</div>
        <div class="weather">${weather}</div>
    </div>`;
}

fetchData();