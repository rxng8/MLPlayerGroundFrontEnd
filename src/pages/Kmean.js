import React, { Component } from 'react';

import Axios from 'axios';
import KmeanGraph from './components/kmeanGraph';

import CanvasJSReact from './lib/canvasjs-3.2.5/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Kmean extends Component {
  constructor(props){
    super(props);
    this.eventSource = null;
    this.req = this.req.bind(this);
    this.updateChart = this.updateChart.bind(this);
    this.state = {
      ping: new Date(),
      centroids: [],
      originalDataPoints: [
        { x: 14.2, y: 215},
        { x: 12.9, y: 175},
        { x: 16.4, y: 325},
        { x: 26.9, y: 635},
        { x: 32.5, y: 464},
        { x: 22.1, y: 522},
        { x: 19.4, y: 412},
        { x: 25.1, y: 614},
        { x: 34.9, y: 374},
        { x: 28.7, y: 625},
        { x: 23.4, y: 544},
        { x: 31.4, y: 502},
        { x: 40.8, y: 262},
        { x: 37.4, y: 312},
        { x: 42.3, y: 202},
        { x: 39.1, y: 302},
        { x: 17.2, y: 408}
      ],
      options : {
        theme: "dark2",
        animationEnabled: true,
        zoomEnabled: true,
        title:{
          text: "K-nearest neighbor"
        },
        axisX: {
          title:"x",
          suffix: "",
          crosshair: {
            enabled: true,
            snapToDataPoint: true
          }
        },
        axisY:{
          title: "y",
          crosshair: {
            enabled: true,
            snapToDataPoint: true
          }
        },
        data: [{
          type: "scatter",
          markerSize: 15,
          toolTipContent: "x: {x} y: {y}",
          dataPoints: [

          ]
        }]
      }
    }
  
    // connect to the realtime database stream
    this.startEventSource =this.startEventSource.bind(this);
    this.startEventSource();
    // this.listens();
  }

  async listens(){
    const results = await fetch(`http://localhost:5000/kmean`, {
      method: 'get', // HTTP POST to send query to server
      headers: {
        // Accept: 'application/json, text/plain, */*', // indicates which files we are able to understand
        'Content-Type': 'text/event-stream', // indicates what the server actually sent
      },
      body: JSON.stringify([[1,4],[2,5],[2,6],[3,5],[2,8]]), // server is expecting JSON
      credentials: 'include', // sends the JSESSIONID cookie wxith the address
      mode: "no-cors",
    }).then(res => res.json()) // turn the ReadableStream response back into JSON
      .then((res) => {
        if (res.ok) {
          // boolean, true if the HTTP status code is 200-299.
          console.log('response.ok!');
        } else if (res.status === 401) {
          throw Error(`You are not authenticated. Please login.`);
        } else if (res.status === 403) {
          throw Error(`You are not authorized to access this data.`);
        } else {
          throw Error(`Request rejected with status ${res.status}`);
        }
      })
      .catch((error) => {
        // catches error case and if fetch itself rejects
        error.response = {
          status: 0,
          statusText:
            'Cannot connect. Please make sure you are connected to internet.',
        };
        throw error;
      });

    console.log(results);
  }

  startEventSource() {
    // head = new Headers(['Access-Control-Allow-Origin': true])
    this.eventSource = new EventSource("http://localhost:5000/kmean", {withCredentials: false});
    this.eventSource.onmessage = e =>
    this.updateGraphState(JSON.parse(e.data));
  }

  updateGraphState(data) {
    console.log(data);
  }

  // componentDidMount() {
  //   this.setState({
  //     dataPoints: [{x: 3, y:4}]
  //   });
  //   this.updateChart();
  // }

  // componentWillReceiveProps (newProps, oldProps){
  //   this.setState(this.getInitialState(newProps));
  // }

  updateChart() {
		this.chart.render();
	}

  req(e) {
    e.preventDefault();
    console.log('The link was clicked.');
    // Make request to get the centroids

    let centr = [];
    let cur = this.state.originalDataPoints;
    cur = cur.concat(centr)
    
    this.setState(
      state => {
        state.options.data[0].dataPoints = cur
        return state
      }
    );
    // var s = this.state.options.data[0].dataPoints
    // s = cur;
    // this.setState({s});
    console.log(cur);
    console.log(this.state.options.data[0].dataPoints);
    this.updateChart();
  }

	render() {
		return (
            <div>
                <CanvasJSChart options = {this.state.options} onRef={ref => this.chart = ref} />
                <button onClick={this.req}>
                    Clusterize!
                </button>
            </div>
		);
	}
}
export default Kmean;