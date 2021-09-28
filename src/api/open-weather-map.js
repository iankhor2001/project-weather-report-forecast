import axios from 'axios';

const key = 'ecad5734e51e8f8b8441eceb76606453';
const baseUrl = `http://api.openweathermap.org/data/2.5/weather?appid=${key}`;
const baseGeocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?appid=${key}`;
const baseWeatherUrl = `http://api.openweathermap.org/data/2.5/onecall?appid=${key}`;

const excludeField = ['minutely', 'hourly', 'daily', 'alert']

export function getWeatherGroup(code) {
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

export function capitalize(string) {
    return string.replace(/\b\w/g, l => l.toUpperCase());
}

let weatherSource = axios.CancelToken.source();

export function getTodayWeather(city, unit) {
    var geocodingUrl = `${baseGeocodingUrl}&q=${encodeURIComponent(city)}&limit=1`;
    var baseOneCallUrl = `${baseWeatherUrl}&exclude=${excludeField.join(',')}`;
    console.log(`Making request to: ${geocodingUrl}`);
    var requestTime = new Date().toLocaleTimeString();

    return axios.get(geocodingUrl, {cancelToken: weatherSource.token}
        ).then(function(res) {
        if (res.data.cod && res.data.message) {
            debugger;
            throw new Error(res.data.message);
        } else {
            return {
                lat: res.data[0].lat,
                lon: res.data[0].lon,
                country: res.data[0].country
                }
            }
        }).then(function(res) {
            console.log(`Get coordinate successful, requesting ${res.lat},${res.lon}`);
            const oneCallUrl = `${baseOneCallUrl}&lat=${res.lat}&lon=${res.lon}&unit=${unit}`;
            console.log(`Making request to: ${oneCallUrl}`);
            return axios.get(oneCallUrl, {cancelToken: weatherSource.token}).then(function(oneCallRes) {
                if (oneCallRes.data.cod && oneCallRes.data.message) {
                    debugger;
                    throw new Error(oneCallRes.data.message);
                } else {
                    console.log(oneCallRes)
                    return {
                            requestTime: requestTime,
                            city: capitalize(city.replace(',', ', ')),
                            country: res.country,
                            code: oneCallRes.data.current.weather[0].id,
                            group: getWeatherGroup(oneCallRes.data.current.weather[0].id),
                            description: capitalize(oneCallRes.data.current.weather[0].description),
                            temp: oneCallRes.data.current.temp,
                            unit: unit
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
    // window.navigator.geolocation.getCurrentPosition((returnPosition)=>{logReturnPositon(returnPosition)}, (err)=>{throw err;});
    
    var url = `${baseUrl}&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&units=${unit}`;
    var requestTime = new Date().toLocaleTimeString();
    console.log(`Making request to: ${url}`);

    return axios.get(url, {cancelToken: weatherSource.token}).then(function(res) {
        if (res.data.cod && res.data.message) {
            throw new Error(res.data.message);
        } else {
            // console.log(res)
            return {
                requestTime: requestTime,
                city: res.data.name,
                country: res.data.sys.country,
                currentLocation: res.data.name,
                code: res.data.weather[0].id,
                group: getWeatherGroup(res.data.weather[0].id),
                description: capitalize(res.data.weather[0].description),
                temp: res.data.main.temp,
                unit: unit
            };
        }
    }).catch(function(err) {
        if (axios.isCancel(err)) {
            console.error(err.message, err);
        } else {
            throw err;
        }
    });
}

export function cancelWeather() {
    weatherSource.cancel('Request canceled');
}

// export function getForecast(city, unit) {
//     // TODO
// }

// export function cancelForecast() {
//     // TODO
// }
