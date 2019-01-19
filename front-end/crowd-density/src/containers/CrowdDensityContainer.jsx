import React, {Component} from 'react';
import * as dataProvider from '../data/CrowdDensityDataProvider';
import CrowdDensity from '../components/CrowdDensity';

class CrowdDensityContainer extends Component {
    constructor (props) {
        super(props);

    }

    getData = () => {
        return {
            datasets: [
                {
                    label: 'Dataset1',
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'Dataset2',
                    data: [15, 39, 20, 71, 12, 40, 30]
                }
            ],
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July']
        }
    }

    render = () => {
        return (
            <CrowdDensity rawDatasets={this.getData()}/>
        )
    }
}

export default CrowdDensityContainer;

// 2015-10-22T19:50:08