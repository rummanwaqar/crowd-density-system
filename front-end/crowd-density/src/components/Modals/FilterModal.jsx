import React, {Component} from 'react'
import Datetime from 'react-datetime';

class Filter extends Component {
    constructor (props) {
        super(props);
        const start = new Date();
        start.setHours(start.getHours() - 2);
        
        this.state = {
            start: start.toDateString(),
            end: "",
            timeUnit: "seconds,"
            // enabled: []
        }
    }

    handleStartChange = (moment) => {
        // console.log(event);
        this.setState({start: moment._d});
    }

    handleEndChange = (moment) => {
        this.setState({end: moment._d});
    }

    handleTimeUnitChange = (event) => {
        this.setState({timeUnit: event.target.value});
    }

    filter = () => {
        this.props.getData(this.state);
        this.props.handleClose();
    }
    
    render = () => {
        const {
            show, filter, handleClose
        } = this.props
        const showHideClassName = show ? "modal display-block" : "modal display-none";
        return (            
            <div className={showHideClassName}>
                <div className="modal-main">
                    <div className="modal-input-container">
                        
                        <div className="label-and-input">
                            {/* <select name="timeunit-list" onChange={this.handleTimeUnitChange}>
                                <option value="seconds">Seconds</option>
                                <option value="minutes">Minutes</option>
                                <option value="hours">Hours</option>
                                <option value="days">Days</option>
                            </select> */}
                            <Datetime value={this.state.start} onChange={this.handleStartChange}/>
                            <span>to</span>
                            <Datetime onChange={this.handleEndChange}/>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={this.filter}>Save</button>
                            <button className="cancel" onClick={handleClose}>Cancel</button>
                        </div>

                    </div>

                </div>
            </div>
        );
    }
}

export default Filter