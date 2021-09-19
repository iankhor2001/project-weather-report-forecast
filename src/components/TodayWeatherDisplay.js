import React from 'react';
import PropTypes from 'prop-types';

export default class TodayWeatherDisplay extends React.Component {
    static propTypes = {
        masking: PropTypes.bool,
        group: PropTypes.string,
        description: PropTypes.string,
        temp: PropTypes.number,
        unit: PropTypes.string,
    };

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className={`weather-display ${this.props.masking ? 'masking' : ''}`}>
                <img src={require(`images/w-${this.props.group}.png`).default}/>
                <p className='description'>{this.props.description}</p>&nbsp;
                <h1 className='temp'>
                    <span className='display-3'>{this.props.temp.toFixed(1)}&ordm;</span>
                    &nbsp;
                    {(this.props.unit === 'metric') ? 'C' : 'F'}
                </h1>
            </div>
        )
    }
}