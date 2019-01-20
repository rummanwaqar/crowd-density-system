import React, {Component} from 'react';
import * as dataProvider from '../data/CrowdDensityDataProvider';
import CrowdDensity from '../components/CrowdDensity';

class CrowdDensityContainer extends Component {
    constructor (props) {
        super(props);

        const d = new Date("Sun Jan 20 2019");
        d.setHours(d.getHours() - 2);

        this.state = {
            datasets: [],
            labels: [],
            params: {
                start: d.toString()
            },
            map: []
        }

    }

    componentDidMount = () => {
        this.getData(this.state.params);
        this.getHeatMap();
        // this.interval = setInterval(() => this.intervalGetData(this.state.params), 60000);
    }

    intervalGetData = (params) => {
        if (params.end) {
            this.getData(params);
        }
    }

    getData = (params) => {
        dataProvider.getData(params).then((response)=> {
            this.setState({
                datasets: response.datasets,
                labels: response.labels,
                params: params
            });
        }).catch((error) => {
            this.setState(error);
        });
    }

    getHeatMap = () => {
        dataProvider.getHeatMap().then((response) => {
            this.setState({
                map: response.map
            })
        }).catch((error) => {
            console.log(error);
        })
    }

    render = () => {
        // console.log(this.state);
        return (
            <CrowdDensity rawDatasets={this.state} getData={this.getData}/>
        )
    }
}

export default CrowdDensityContainer;

// 2015-10-22T19:50:08