import React, {Component} from 'react'
import {Line} from 'react-chartjs-2';

// import * as zoom from 'chartjs-plugin-zoom'

const colors = [
    'rgb(255, 99, 132)',
    'rgb(99, 132, 255)',
    'rgb(132, 255, 99)',
    'rgb(99, 255, 132)',
    'rgb(132, 99, 255)',
    'rgb(255, 132, 99)',    
]

class Chart extends Component {
    constructor (props) {
        super(props);        
    }

    convertRawDataset = (rawDataset, index) => {
        const data = rawDataset.data;
        const color = colors[index];
        return {
            label: rawDataset.label,
            fill: false,
            lineTension: 0.1,
            backgroundColor: color,
            borderColor: color,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: color,
            pointBackgroundColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgb(135,206,250)',
            pointHoverBorderColor: color,
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            pointHitRadius: 10,
            data: data
        };
    }

    createDatasets = (rawDatasets) => {
        if (rawDatasets && rawDatasets.datasets && rawDatasets.datasets.length) {
            const datasets = rawDatasets.datasets.map((rawDataset, i) => {
                return this.convertRawDataset(rawDataset, i);
            });
            return {
                labels: rawDatasets.labels,
                datasets: datasets
            }
        } else {
            return {
                labels: [],
                datasets: []
            } 
        }
        
    }

    render = () => {
        const {rawDatasets} = this.props;
        const data = this.createDatasets(rawDatasets);
        return (
            <div className="chart">
                <Line
                    data={data}
                    options={{
                        scales: {
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Number of People'
                                }
                            }],
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Time'
                                }
                            }],
                        }   
                    }}
                />
            </div>
        );
    }
}

export default Chart;


