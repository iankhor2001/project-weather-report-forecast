import React from 'react';
import {getTodayWeather, cancelWeather} from 'api/open-weather-map';

import TodayWeatherDisplay from './TodayWeatherDisplay';

export default class Today extends React.Component {
    static getInitWeatherState() { 
        return {
            city: 'na',
            code: -1,
            group: 'na',
            description: 'N/A',
            temp: NaN,
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            ...Today.getInitWeatherState(),
            loading: true,
            masking: true,
        };

        this.handleFormQuery = this.handleFormQuery.bind(this);
    }

    render() {
        return (
            <div className={`today weather-bg ${this.state.group}`}>
                <div className={`mask ${this.state.masking ? 'masking' : ''}`}>
                    <TodayWeatherDisplay {...this.state}/>
                    {/* WeatherForm */}
                    Hello Today
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.getWeather('Hsinchu', 'metric');
    }

    componentWillUnmount() {
        this.state.loading && cancelWeather();
    }

    getWeather(city, unit) { 
        this.setState({
            loading: true,
            masking: true,
            city: city
        }, () => {
            getTodayWeather(city, unit).then(weather => {
                this.setState({
                    ...weather,
                    loading: false,
                }, () => this.notifyUnitChange(unit));
            }).catch(err => {
                console.error('Error getting weather', err);

                this.setState({
                    ...Today.getInitWeatherState(unit),
                    loading: false,
                }, () => this.notifyUnitChange(unit));
            });
        });

        setTimeout(() => {
            this.setState({
                masking: false
            });
        }, 600);
    }

    handleFormQuery(city, unit) {
        this.getWeather(city, unit);
    }

    notifyUnitChange(unit) {
        (this.props.units !== unit) &&
            this.props.onUnitChange(unit);    
    }
}