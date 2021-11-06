const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

require("dotenv").config()

const apiKey = `${process.env.API_KEY}`

const dttxt = []
const temp = []
const pressure = []
const icon = []
const desc = []
const hum = []
const clou = []
const visi = []
const mainW = []
const fah = []
const weath = []

let place,
  weatherTimezone,
  weatherTemp,
  weatherPressure,
  weatherIcon,
  weatherDescription,
  humidity,
  clouds,
  visibility,
  main,
  lon,
  lat,
  dt_txt,
  weatherFahrenheit

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs")

app.get("/", (req, res) => {
  res.render("index", { weather: null, error: null })
})

app.get("/five", (req, res) => {
  res.render("five", { weather: null, error: null })
})

app.post('/', (req, res) => {
  let city = req.body.city
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

  request(url, (err, response, body) => {
    if (err) {
      res.render('index', { weather:null, error: 'Error  please try again' })
    } else {
      let weather = JSON.parse(body)

      //console.log(weather)

      if (weather.main == undefined) {
        res.render('index', { weather:null, error: 'Error  please try again' })
      } else {
        place = `${weather.name}, ${weather.sys.country}`,
        weatherTimezone = `${new Date(
          weather.dt * 1000 - weather.timezone * 1000
        )}`
        weatherTemp = `${weather.main.temp}`,
        weatherPressure = `${weather.main.pressure}`,
        weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
        weatherDescription = `${weather.weather[0].description}`,
        humidity = `${weather.main.humidity}`,
        clouds = `${weather.clouds.all}`,
        visibility = `${weather.visibility}`,
        main = `${weather.weather[0].main}`,
        lon = `${weather.coord.lon}`,
        lat = `${weather.coord.lat}`,
        weatherFahrenheit
        weatherFahrenheit = (weatherTemp * 9) / 5 + 32

        function roundToTwo(num) {
          return +(Math.round(num + "e+2") + "e-2")
        }
        weatherFahrenheit = roundToTwo(weatherFahrenheit)

        res.render("index", {
          weather: weather,
          place: place,
          temp: weatherTemp,
          pressure: weatherPressure,
          icon: weatherIcon,
          description: weatherDescription,
          timezone: weatherTimezone,
          humidity: humidity,
          fahrenheit: weatherFahrenheit,
          clouds: clouds,
          visibility: visibility,
          main: main,
          lon: lon,
          lat: lat,
          error: null,
        })
      }
    }
  })
})

app.post('/five', (req, res) => {
  let city = req.body.city
  let url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`

  request(url, (err, response, body) => {
    if (err) {
      res.render('/five', { weather:null, error: 'Error  please try again' })
    } else {
      let weather = JSON.parse(body)

      //console.log(weather)
      //console.log(weather.list[1]);

      for (var i = 0; i < weather.cnt; i++) {
        if (weather.list[i].main == undefined) {
          res.render("/five", { weather:null, error:'Error please try again'})
        } else {
          place = `${weather.city.name}, ${weather.city.country}`,
          weatherTimezone = `${new Date(
            weather.list[i].dt * 1000 - weather.city.timezone * 1000
          )}`
          weatherTemp = `${weather.list[i].main.temp}`,
          weatherPressure = `${weather.list[i].main.pressure}`,
          weatherIcon = `http://openweathermap.org/img/wn/${weather.list[i].weather[0].icon}@2x.png`,
          weatherDescription = `${weather.list[i].weather[0].description}`,
          humidity = `${weather.list[i].main.humidity}`,
          clouds = `${weather.list[i].clouds.all}`,
          visibility = `${weather.list[i].visibility}`,
          main = `${weather.list[i].weather[0].main}`,
          lon = `${weather.city.coord.lon}`,
          lat = `${weather.city.coord.lat}`,
          dt_txt = `${weather.list[i].dt_txt}`,
          weatherFahrenheit

          function roundToTwo(num) {
            return +(Math.round(num + "e+2") + "e-2")
          }

          weatherTemp = roundToTwo(weatherTemp - 273.15)
          weatherFahrenheit = (weatherTemp * 9) / 5 + 32
          weatherFahrenheit = roundToTwo(weatherFahrenheit)

          temp[i] = weatherTemp
          fah[i] = weatherFahrenheit
          pressure[i] = weatherPressure
          icon[i] = weatherIcon
          desc[i] = weatherDescription
          hum[i] = humidity
          clou[i] = clouds
          visi[i] = visibility
          mainW[i] = main
          dttxt[i] = dt_txt

          weath[i] = {
            temp: temp,
            pressure: pressure,
            dt_txt: dttxt,
            icon: icon,
            description: desc,
            humidity: hum,
            fahrenheit: fah,
            clouds: clou,
            visibility: visi,
            main: mainW,
          }

        }
      }
      res.render("five.ejs", {
        weather: weather.list[i],
        place: place,
        timezone: weatherTimezone,
        lon: lon,
        lat: lat,
        weath,
        error: null,
      })
    }
  })
})

app.listen(3000, () => {
  console.log("Weather app on port 3000!");
})
