import React, {Component} from 'react';
import * as dataProvider from '../data/CrowdDensityDataProvider';
import CrowdDensity from '../components/CrowdDensity';

class CrowdDensityContainer extends Component {
    constructor (props) {
        super(props);

        this.state = {
            dataset: [],
            labels: []
        }

    }

    componentDidMount = () => {
        this.getData()
        this.interval = setInterval(() => this.getData(this.state.params), 10000);
    }

    getData = (params) => {
        console.log(params);
        dataProvider.getData(this.setData).then((response)=> {
            this.setState({
                datasets: response.datasets,
                labels: response.labels,
                params: params
            });
        }).catch((error) => {
            this.setState(error);
        });
    }

    render = () => {
        return (
            <CrowdDensity rawDatasets={this.state} getData={this.getData}/>
        )
    }
}

export default CrowdDensityContainer;

// 2015-10-22T19:50:08