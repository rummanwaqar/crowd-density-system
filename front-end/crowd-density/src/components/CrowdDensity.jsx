import React, {Component} from 'react'
import Chart from './Chart'

class CrowdDensity extends Component {
    constructor (props) {
        super(props);
    }

    render = () => {
        const {rawDatasets} = this.props;
        console.log(rawDatasets)
        return (
            <div className="CrowdDensity">
                <Chart rawDatasets={rawDatasets}/>
            </div>
        )
    }
}

export default CrowdDensity;

