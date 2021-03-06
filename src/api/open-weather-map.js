import axios from 'axios';

const key = 'ecad5734e51e8f8b8441eceb76606453';
// const baseUrl = `http://api.openweathermap.org/data/2.5/weather?appid=${key}`;
const baseGeocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?appid=${key}`;
const baseReverseGeocodingUrl = `http://api.openweathermap.org/geo/1.0/reverse?appid=${key}`;
const baseWeatherUrl = `http://api.openweathermap.org/data/2.5/onecall?appid=${key}`;

const excludeField = ['minutely', 'hourly', 'daily', 'alert']

function getLocalTime(timestamp, offset=0) {
    let time = new Date((timestamp+offset)*1000);
    let hour = time.getUTCHours();
    let minute = time.getUTCMinutes();
    let timeInDay = `${hour>10?hour:'0'+hour}:${minute>10?minute:'0'+minute}`;
    return timeInDay;
}

function getWeatherGroup(code) {
    let group = 'na';
    if (200 <= code && code < 300) {
        group = 'thunderstorm';
    } else if (300 <= code && code < 400) {
        group = 'drizzle';
    } else if (500 <= code && code < 600) {
        group = 'rain';
    } else if (600 <= code && code < 700) {
        group = 'snow';
    } else if (700 <= code && code < 800) {
        group = 'atmosphere';
    } else if (800 === code) {
        group = 'clear';
    } else if (801 <= code && code < 900) {
        group = 'clouds';
    }
    return group;
}

function capitalize(string) {
    return string.replace(/\b\w/g, l => l.toUpperCase());
}

let weatherSource = axios.CancelToken.source();

export function getTodayWeather(city, unit) {
    var geocodingUrl = `${baseGeocodingUrl}&q=${encodeURIComponent(city)}&limit=1`;
    var baseOneCallUrl = `${baseWeatherUrl}&exclude=${excludeField.join(',')}`;
    console.log(`Making request to: ${geocodingUrl}`);

    return axios.get(geocodingUrl, {cancelToken: weatherSource.token}
        ).then(function(geocodingRes) {
        if (geocodingRes.data.cod && geocodingRes.data.message) {
            debugger;
            throw new Error(geocodingRes.data.message);
        } else {
            return {
                lat: geocodingRes.data[0].lat,
                lon: geocodingRes.data[0].lon,
                country: geocodingRes.data[0].country
                }
            }
        }).then(function(locationData) {
            console.log(`Get coordinate successful, requesting ${locationData.lat},${locationData.lon}`);
            const oneCallUrl = `${baseOneCallUrl}&lat=${locationData.lat}&lon=${locationData.lon}&units=${unit}`;
            console.log(`Making request to: ${oneCallUrl}`);
            return axios.get(oneCallUrl, {cancelToken: weatherSource.token}).then(function(oneCallRes) {
                if (oneCallRes.data.cod && oneCallRes.data.message) {
                    debugger;
                    throw new Error(oneCallRes.data.message);
                } else {
                    // console.log(oneCallRes)
                    return {
                        unit: unit,
                        city: capitalize(city.replace(',', ', ')),
                        country: locationData.country,
                        ...handleWeatherInformation(oneCallRes.data)
                    };
                };
            });
        }).catch(function(err) {
            if (axios.isCancel(err)) {
                console.error(err.message, err);
            } else {
                debugger;
                throw err;
            }
            debugger;
            
        });
}

export function getGeolocationWeather(lat, lon, unit) {
    const oneCallUrl = `${baseWeatherUrl}&lat=${lat}&lon=${lon}&units=${unit}&exclude=${excludeField.join(',')}`;

    var reverseGeocodingUrl = `${baseReverseGeocodingUrl}&lat=${lat}&lon=${lon}&limit=1`;
    console.log(`Making request to: ${reverseGeocodingUrl}`);

    return axios.get(reverseGeocodingUrl, {cancelToken: weatherSource.token}
        ).then(function(geocodingRes) {
        if (geocodingRes.data.cod && geocodingRes.data.message) {
            debugger;
            throw new Error(geocodingRes.data.message);
        } else {
            return {
                city: geocodingRes.data[0].name,
                country: geocodingRes.data[0].country,
                }
            }
        }).then(function(locationData) {
            console.log(`Get coordinate successful, requesting ${lat},${lon}`);
            console.log(`Making request to: ${oneCallUrl}`);
            return axios.get(oneCallUrl, {cancelToken: weatherSource.token}).then(function(oneCallRes) {
                if (oneCallRes.data.cod && oneCallRes.data.message) {
                    debugger;
                    throw new Error(oneCallRes.data.message);
                } else {
                    return {
                            unit: unit,
                            city: capitalize(locationData.city.replace(',', ', ')),
                            country: locationData.country,
                            ...handleWeatherInformation(oneCallRes.data)
                        };
                };
            });
        }).catch(function(err) {
            if (axios.isCancel(err)) {
                console.error(err.message, err);
            } else {
                debugger;
                throw err;
            }
            debugger;
            
        });
}

export function cancelWeather() {
    weatherSource.cancel('Request canceled');
}

function handleWeatherInformation(weatherInfo) {
    // console.log(oneCallRes)
    let currentInfo = weatherInfo.current;
    let timezoneOffset = weatherInfo.timezone_offset;
    let furtherCurrentInfo = {
        sunrise: getLocalTime(currentInfo.sunrise, timezoneOffset),
        sunset: getLocalTime(currentInfo.sunset, timezoneOffset),
        feelsLike: currentInfo.feels_like,
        pressure: currentInfo.pressure,  // Atmospheric pressure on the sea level, hPa
        humidity: currentInfo.humidity,  // %
        dewPoint: currentInfo.dew_point, // Atmospheric temperature below which water droplets begin to condense
        clouds: currentInfo.clouds,  // cloudiness, %
        uvi: currentInfo.uvi,  // Midday UV index
        visibility: currentInfo.visibility,  // Average visibility, meters
        windSpeed: currentInfo.wind_speed, // Wind speed
        // windGust: currentInfo.wind_gust, // (where available) Wind gust. 
        windDeg: currentInfo.wind_deg, // Wind direction, degrees (meteorological)
    }
    let isDayTime = currentInfo.dt<=currentInfo.sunset && currentInfo.dt>currentInfo.sunrise;
    return {
        isDayTime: isDayTime,
        requestTime: getLocalTime(currentInfo.dt, timezoneOffset),
        code: currentInfo.weather[0].id,
        group: getWeatherGroup(currentInfo.weather[0].id),
        description: capitalize(currentInfo.weather[0].description),
        temp: currentInfo.temp,
        furtherCurrentInfo: furtherCurrentInfo,
    };
}