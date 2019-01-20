import React, {Component} from 'react'

class Filter extends Component {
    constructor (props) {
        super(props);
        this.state = {
            start: "",
            end: "",
            timeUnit: "seconds"
        }
    }

    handleStartChange = (event) => {
        this.setState({start: event.target.value});
    }

    handleEndChange = (event) => {
        this.setState({end: event.target.value});
    }

    handleTimeUnitChange = (event) => {
        this.setState({timeUnit: event.target.value});
    }

    filter = () => {
        this.props.filter();
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
                            <span>Type</span>
                            
                        </div>
                        <div className="label-and-input">
                        <select name="timeunit-list" onChange={this.handleTimeUnitChange}>
                        <option value="seconds">Seconds</option>
                            <option value="minutes">Minutes</option>
                            <option value="hours">Hours</option>
                            <option value="days">Days</option>
                        </select>
                            <input type="number" pattern="[0-9]" onChange={this.handleStartChange}/>
                            <span>to</span>
                            <input type="number" pattern="[0-9]" onChange={this.handleEndChange}/>
                        </div>
                        <div className="label-and-input">
                            <span>Detail</span>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={this.filter}>Filter</button>
                            <button onClick={handleClose}>Cancel</button>
                        </div>

                    </div>

                </div>
            </div>
        );
    }
}

export default Filter