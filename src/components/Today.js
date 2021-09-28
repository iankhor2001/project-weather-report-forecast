import React from 'react';

import TodayWeatherDisplay from './TodayWeatherDisplay';
import TodayWeatherForm from './TodayWeatherForm';

export default class Today extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={`today weather-bg ${this.props.group}`}>
                <div className={`mask ${this.props.masking ? 'masking' : ''}`}>
                    <TodayWeatherForm 
                        city={this.props.city} 
                        unit={this.props.unit} 
                        onQuery={this.props.handleFormQuery}
                        getGeoWeather={this.props.handleGetGeolocationWeather}
                    />
                    <TodayWeatherDisplay {...this.props}/>
                    
                </div>
            </div>
        )
    }
}
