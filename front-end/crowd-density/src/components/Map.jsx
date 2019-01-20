import React, {Component} from 'react'
import h337 from 'heatmap.js';
import _ from 'lodash';
import ReactDOM, { render } from 'react-dom';



class Map extends Component {
    constructor (props) {
        super(props);      
        this.state = { cfg: null };  
    }


    componentDidMount(){
        let container = ReactDOM.findDOMNode(this);
        const cfg = {
            container: container
        }
        this.heatmapInstance = h337.create( cfg );
      }
    
    componentWillReceiveProps(nextProps){
        return nextProps != this.props;
    }

    shouldComponentUpdate(nextProps){
        return nextProps != this.props;
    }
    
    render = () => {
        const {data} = this.props;
        if (this.heatmapInstance) {
            this.heatmapInstance.setData( data );
        }
        return (
            <div className="heatmap" ref="react-heatmap"></div>
        );
    }
}

export default Map;