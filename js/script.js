//time
const time = document.querySelector(".time");

function showTime() {
  time.textContent = new Date().toLocaleTimeString("en-RU", { hour12: false });
}

setInterval(showTime, 1000);

//date
const date = document.querySelector(".date");

const options = {
  weekday: "long",
  month: "long",
  day: "numeric",
};

function showDate() {
  date.textContent = new Date().toLocaleDateString("en-RU", options);
}

setInterval(showDate, 1000);

/********************************************************************************
 ********************************************************************************
 *******************************************************************************/

//greeting
const greeting = document.querySelector(".greeting");

let hours;

function showGreeting() {
  function getTimeOfDay(hours) {
    hours = new Date().getHours();

    return hours < 6
      ? "night"
      : hours < 12
      ? "morning"
      : hours < 18
      ? "afternoon"
      : "evening";
  }

  greeting.textContent = `Good ${getTimeOfDay()}`;
}

setInterval(showGreeting, 1000);

//user name
const nameInput = document.querySelector('[placeholder="[Enter name]"]');

//adding the value of nameInput field in the local storage
nameInput.oninput = function () {
  window.localStorage.setItem("name", nameInput.value);
};

//getting the value to the nameInput field from the local storage
window.onload = function () {
  nameInput.value = window.localStorage.getItem("name");

  //weather local storage
  city.value = window.localStorage.getItem("city") || "Minsk";
  showWeather();

  //Quote of the day
  showQuoteOfTheDay();
};

/********************************************************************************
 ********************************************************************************
 *******************************************************************************/

//Background

//I repeat the same function as in greeting to get the appropriate word to look for images
function nightMorningAfternoonEvening(hours) {
  hours = new Date().getHours();

  return hours < 6
    ? "night"
    : hours < 12
    ? "morning"
    : hours < 18
    ? "afternoon"
    : "evening";
}

let timeInLink = nightMorningAfternoonEvening();

//getting random number
function getRandomNum() {
  return Math.ceil(Math.random() * 20);
}

let bgNum = getRandomNum().toString().padStart(2, "0");

//setting the background:

function setBg() {
  //smooth background change
  const img = new Image();

  img.src = `https://raw.githubusercontent.com/simokitkat/stage1-tasks/assets/images/${timeInLink}/${bgNum}.jpg`;

  img.onload = () => {
    document.body.style.backgroundImage = `url(https://raw.githubusercontent.com/simokitkat/stage1-tasks/assets/images/${timeInLink}/${bgNum}.jpg)`;
  };
}

setBg();

//making the slider arrows work
let slideNext = document.querySelector(".slide-next");
let slidePrev = document.querySelector(".slide-prev");

function getSlideNext() {
  if (+bgNum === 20) {
    bgNum = "01";
    setBg();
  } else {
    bgNum = (+bgNum + 1).toString().padStart(2, "0");
    setBg();
  }
}

function getSlidePrev() {
  if (+bgNum === 1) {
    bgNum = "20";
    setBg();
  } else {
    bgNum = (+bgNum - 1).toString().padStart(2, "0");
    setBg();
  }
}

slideNext.addEventListener("click", getSlideNext);
slidePrev.addEventListener("click", getSlidePrev);

/********************************************************************************
 ********************************************************************************
 *******************************************************************************/

//weather

// const weatherIcon = document.querySelector(".weather-icon");

// const temperature = document.querySelector(".temperature");

// const weatherDescription = document.querySelector(".weather-description");

// let city = document.querySelector('[placeholder="Enter City"]');

// let wind = document.querySelector(".wind");

// let humidity = document.querySelector(".humidity");

// let weatherError = document.querySelector(".weather-error");

// async function getWeather() {
//   const url =
//     city.value === ""
//       ? `https://api.openweathermap.org/data/2.5/weather?q=Minsk&lang=en&appid=3dd91f1c4372960bfa4e35f08539b09c&units=metric`
//       : `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=3dd91f1c4372960bfa4e35f08539b09c&units=metric`;

//   const res = await fetch(url);

//   const data = await res.json();

//   weatherIcon.className = "weather-icon owf";
//   weatherIcon.classList.add(`owf-${data.weather[0].id}`);

//   temperature.textContent = `${Math.round(data.main.temp)}°C`;

//   weatherDescription.textContent = data.weather[0].description;

//   wind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`;

//   humidity.textContent = `Humidity: ${Math.round(data.main.humidity)}%`;

//   console.log(data);
// }
// // getWeather();

//I decided to do the same using the old XHR object CUZ I know how to get the error using it
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
let city = document.querySelector('[placeholder="Enter City"]');
let wind = document.querySelector(".wind");
let humidity = document.querySelector(".humidity");
let weatherError = document.querySelector(".weather-error");

function showWeather() {
  let request = new XMLHttpRequest();

  //pass the link to it
  request.open(
    "GET",
    `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=3dd91f1c4372960bfa4e35f08539b09c&units=metric`,
    true
  );

  //send the request
  request.send();

  //the load function means that the readyState of the request is 4
  request.onload = function () {
    let jsObject = JSON.parse(this.response);

    if (this.status == 200) {
      weatherIcon.className = "weather-icon owf";
      weatherIcon.classList.add(`owf-${jsObject.weather[0].id}`);

      temperature.textContent = `${Math.round(jsObject.main.temp)}°C`;

      weatherDescription.textContent = jsObject.weather[0].description;

      wind.textContent = `Wind speed: ${Math.round(jsObject.wind.speed)} m/s`;

      humidity.textContent = `Humidity: ${Math.round(jsObject.main.humidity)}%`;

      weatherError.textContent = "";
    } else {
      if (city.value == "") {
        weatherError.textContent = "You entered an empty string";
      } else {
        weatherError.textContent = "Error: You entered an invalid city!";
      }

      //delete all classes from WeatherIcon so that it disappears
      weatherIcon.classList = "";

      temperature.textContent = "";
      weatherDescription.textContent = "";
      wind.textContent = "";
      humidity.textContent = "";
    }
  };
}

showWeather();

city.addEventListener("change", showWeather);

//saving the city details in the local storage
city.oninput = () => {
  window.localStorage.setItem("city", city.value);
};

// I added the load getItem in the window.onload function above at line 61

/********************************************************************************
 ********************************************************************************
 *******************************************************************************/

//quote of the day

//I will use the same technique of XHR for the quote of the day

let quote = document.querySelector(".quote");
let author = document.querySelector(".author");
let quoteBtn = document.querySelector(".change-quote");

function showQuoteOfTheDay() {
  let quotesRequest = new XMLHttpRequest();

  quotesRequest.open("GET", "js/quotesFree.json", true);

  quotesRequest.send();

  quotesRequest.onreadystatechange = function () {
    let quotesJsObject = JSON.parse(quotesRequest.responseText);

    if (this.status == 200 && this.readyState == 4) {
      console.log(quotesJsObject);
      console.log(Array.isArray(quotesJsObject));

      let randomQuoteNum = Math.floor(Math.random() * quotesJsObject.length);

      quote.textContent = quotesJsObject[randomQuoteNum].text;
      author.textContent = quotesJsObject[randomQuoteNum].author;
    }
  };
}

//Now that I created the function, I need to make two things:
// [1] add the function in the window.onload function above at line 61 to make it generate a random quote everytime the page reloads
//[2] make an onclick function for the quoteBtn that calls

quoteBtn.addEventListener("click", showQuoteOfTheDay);

/********************************************************************************
 ********************************************************************************
 *******************************************************************************/
