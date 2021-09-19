import React from 'react';
import {getTodayWeather, cancelWeather} from 'api/open-weather-map';

import TodayWeatherDisplay from './TodayWeatherDisplay';
import TodayWeatherForm from './TodayWeatherForm';

export default class Today extends React.Component {
    static getInitWeatherState() { 
        return {
            city: 'Hsinchu',
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
                    <TodayWeatherForm 
                        city={this.state.city} 
                        unit={this.props.unit} 
                        onQuery={this.handleFormQuery}
                    />
                    Hello Today
                </div>
            </div>
        )
    }

    componentDidMount() {
        // console.log('componentDidMount');
        this.getWeather(this.state.city, this.props.unit);
    }

    componentWillUnmount() {
        // this.state.loading && cancelWeather();
        if (this.state.loading) {
            cancelWeather();
        }
    }

    getWeather(city, unit) { 
        console.log('Getting Weather from '+ String(city));
        this.setState({
            loading: true,
            masking: true,
            city: city
        }, () => {
            getTodayWeather(city, unit).then(weather => {
                console.log('Received Information');
                console.log(weather);
                this.setState({
                    ...weather,
                    loading: false,
                }, () => this.notifyUnitChange(unit));
            }).catch(err => {
                console.error('Error getting weather, displaying default location\n', err);
                this.setState({
                    ...Today.getInitWeatherState(unit),
                    loading: false,
                }, () => {
                    this.notifyUnitChange(unit)
                    this.getWeather(this.state.city, this.props.unit);
                });
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