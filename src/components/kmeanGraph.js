import React, { Component } from 'react';

import Axios from 'axios';

import CanvasJSReact from '../lib/canvasjs-3.2.5/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class KmeanGraph extends Component {

    constructor(props){
        super(props);
    }

    componentWillReceiveProps (newProps, oldProps){
        this.updateChart();
    }

    updateChart() {
		this.chart.render();
    }

	render() {

    

		return (
		<div>
			<CanvasJSChart options = {this.props.options} onRef={ref => this.chart = ref} />

		</div>
		);
	}
}
export default KmeanGraph;