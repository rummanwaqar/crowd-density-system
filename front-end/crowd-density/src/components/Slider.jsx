import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/lab/Slider';

const styles = {
  root: {
    width: 300,
  },
  slider: {
    padding: '22px 0px',
  },
};

class StepSlider extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.props.handleHeatMap(value);
    this.setState({ value });
};

  render() {
    const {value} = this.state;
    const {max} = this.props;

    return (
        <Slider
            value={value}
            min={0}
            max={max}
            step={1}
            onChange={this.handleChange}
        />
    );
  }
}


export default withStyles(styles)(StepSlider);