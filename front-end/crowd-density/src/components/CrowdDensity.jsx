import React, {Component} from 'react';
import Chart from './Chart';
import FilterModal from './Modals/FilterModal';

import StepSlider from './Slider';

import Map from './Map';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
class CrowdDensity extends Component {
    constructor (props) {
        super(props);

        this.state = {
            showFilterModal: false,
            value: 1,
            sliderValue: 0
        }
    }

    prettyDate2 = (time) => {
        const date = new Date(time * 1000);
        return date.toLocaleString();
    }

    onShowFilter = () => {
        this.setState({showFilterModal: true});
    }    

    handleCloseFilter = () => {
        this.setState({showFilterModal: false});
    }

    filter = () => {
        console.log("Filter");
    }

    handleChange = (event, newValue) => {
        this.setState({value: newValue});
    }


    handleHeatMap = (value) => {
        this.setState({sliderValue: value});
    }

    getMapData = (map, i) => {
        if (!map || !map[i] || !map[i].points) {
            return {
                max: 50,
                data: []
            }
        }
        const max = 1;
        const width = 1503;
        const height = 500;

        const points = map[i].points.map((item) => {
            const {x, y} = item;
            return {
                x: Math.floor(Math.min(x+0.1, 0.9)*width),
                y: Math.floor(Math.min(y+0.1, 0.9)*height)
            }
        })

        return {
            max: max,
            data: points,
            time: map[i].time
        }

    }

    render = () => {
        const {rawDatasets, getData} = this.props;
        const map = rawDatasets.map;
        const max = map && map.length;

        const mapData = this.getMapData(map, this.state.sliderValue);
        const {value} = this.state;

        const time = mapData.time && this.prettyDate2(mapData.time);
        const content = (value === 0) ? (
            <div className="content">
                <Chart rawDatasets={rawDatasets}/>
                <FilterModal show={this.state.showFilterModal}
                    handleClose={this.handleCloseFilter}
                    filter={this.filter} getData={getData}/>
                <div className="filter-button-container">
                    <button className="filter-button" onClick={this.onShowFilter}>Filter</button>
                </div>
            </div>
        ) : (
            <div className="content">
                <Map data={mapData}/>
                <div className="slider-container">
                    <StepSlider max={max} 
                        value={this.state.sliderValue} handleHeatMap={this.handleHeatMap}/>
                </div>
                {
                    time && <div className="heat-time">{time}</div>
                }
            </div>
        );

        return (
            <div className="crowd-density">
                <div className="header">Crowd Density</div>
                <Tabs value={value} onChange={this.handleChange}
                    centered>
                    <Tab label="Chart" />
                    <Tab label="Density" />
                </Tabs>
                {content}
            </div>
        )
    }
}

export default CrowdDensity;

