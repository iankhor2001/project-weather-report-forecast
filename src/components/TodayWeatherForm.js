import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUnitChange = this.handleUnitChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            inputValue: nextProps.city,
            unit: nextProps.unit
        });
    }

    render() {
        return (
            <div className='weather-form'>
                <Form onSubmit={this.handleSubmit} className='form-inline justify-content-center'>
                    <Row>
                        <Col>
                            <Form.Control
                                type='text' 
                                name='city' 
                                // innerRef={element => {this.inputElement = element}} 
                                value={this.state.inputValue}
                                onChange={this.handleInputChange} 
                            />
                        </Col>
                        <Col>
                            <Form.Select
                                aria-label='TodayTempUnitSelect'
                                onChange={this.handleUnitChange}
                            >
                                <option value='C'>&ordm; C</option>
                                <option value='F'>&ordm; F</option>
                            </Form.Select>
                        </Col>
                        <Col><Button type='submit'>Submit</Button></Col>
                    </Row>
                </Form>
            </div>
        )
    }

    handleInputChange(element) {
        console.log(element.target.value)
        this.setState({
            inputValue: element.target.value
        })
    }

    handleSubmit(element) {
        element.preventDefault();
        console.log('submit'+this.state.inputValue)
        if (this.state.inputValue && this.state.inputValue.trim()) {
            this.props.onQuery(this.state.inputValue, this.state.unit);
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