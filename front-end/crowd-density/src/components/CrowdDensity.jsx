import React, {Component} from 'react';
import Chart from './Chart';
import FilterModal from './Modals/FilterModal';

class CrowdDensity extends Component {
    constructor (props) {
        super(props);

        this.state = {
            showFilterModal: false
        }
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

    render = () => {
        const {rawDatasets, getData} = this.props;
        return (
            <div className="crowd-density">
                <div className="header">Crowd Density App</div>
                <Chart rawDatasets={rawDatasets}/>
                <FilterModal show={this.state.showFilterModal}
                    handleClose={this.handleCloseFilter}
                    filter={this.filter} getData={getData}/>
                <div className="filter-button">
                    <button onClick={this.onShowFilter}>Filter</button>
                </div>
            </div>
        )
    }
}

export default CrowdDensity;

