import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack'; 

export default class TodayWeatherForm extends React.Component {
    static propTypes = {
        city: PropTypes.string,
        unit: PropTypes.string,
    }

    constructor(props) {
        super(props);

        this.inputElement = null;
        this.state = {
            inputValue: props.city,
            tempToggle: false,
            unit: props.unit
        };
        this.autocomplete = null;
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUnitChange = this.handleUnitChange.bind(this);
        this.handleAutocompleteChange = this.handleAutocompleteChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            inputValue: nextProps.city,
            unit: nextProps.unit
        });
    }

    componentDidMount() {
        this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('location-autocomplete'), {});
        this.autocomplete.setOptions({
            types: ['(cities)'],  // set types to only autocomplete Cities
            fields: ['formatted_address']  // set field to only get formatted_address
        })
        this.autocomplete.addListener("place_changed", this.handleAutocompleteChange);
    }

    render() {
        return (
            <div className='weather-form py-5 container'>
                <Form onSubmit={this.handleSubmit} className='form-inline justify-content-center px-3'>
                    <Form.Control 
                        className='px-4'
                        type='text' 
                        name='city' 
                        className='d-sm-none mb-2' 
                        id='location-autocomplete'
                        value={this.state.inputValue}
                        onChange={this.handleInputChange} 
                    />
                    <Stack direction='horizontal' gap={3}>
                        <Form.Select
                            className='ms-auto w-auto d-sm-none' 
                            aria-label='TodayTempUnitSelect'
                            onChange={this.handleUnitChange}
                        >
                            <option value='C'>&ordm; C</option>
                            <option value='F'>&ordm; F</option>
                        </Form.Select>
                        <Button 
                            type='submit'
                            className='d-sm-none' 
                        >
                            Submit
                        </Button>
                        <Button 
                            onClick={() => this.props.getGeoWeather(this.props.unit)}
                            className='d-sm-none me-auto' 
                        >
                            Current&nbsp;Location
                        </Button>
                    </Stack>

                    <Stack direction='horizontal' gap={3}>
                        <Form.Control 
                            className='px-4'
                            size='lg'
                            type='text' 
                            name='city' 
                            className='d-none d-sm-block' 
                            id='location-autocomplete'
                            value={this.state.inputValue}
                            onChange={this.handleInputChange} 
                        />
                        <Form.Select
                            size='lg'
                            className='w-auto d-none d-sm-block'
                            aria-label='TodayTempUnitSelect'
                            onChange={this.handleUnitChange}
                        >
                            <option value='C'>&ordm; C</option>
                            <option value='F'>&ordm; F</option>
                        </Form.Select>
                        <div className="vr vr-weather-form d-none d-sm-block" />
                        <Button 
                            type='submit'
                            size='lg'
                            className='d-none d-sm-block' 
                        >
                            Submit
                        </Button>
                        <div className="vr vr-weather-form d-none d-sm-block" />
                        <Button 
                            onClick={() => this.props.getGeoWeather(this.props.unit)}
                            size='lg'
                            className='d-none d-sm-block' 
                        >
                            Current&nbsp;Location
                        </Button>
                    </Stack>
                </Form>
            </div>
        )
    }

    handleInputChange(element) {
        this.setState({
            inputValue: element.target.value
        })
    }

    handleAutocompleteChange() {
        const cityObject = this.autocomplete.getPlace();
        this.setState({
            inputValue: String(cityObject.formatted_address)
        })
    }

    handleSubmit(element) {
        element.preventDefault();
        if (this.state.inputValue && this.state.inputValue.trim()) {
            const location = this.state.inputValue.replace(', ', ',');
            this.props.onQuery(location, this.state.unit);
        } else {
            this.state.inputElement = this.props.city;
        }
    }

    handleUnitChange(element) {
        this.setState({
            unit: element.target.value === 'C' ? 'metric' : 'imperial'
        });
    }

}