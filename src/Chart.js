import React, { Component } from 'react';
import {Line} from "react-chartjs-2";

class Chart extends Component{
    render(){
        return(
            <div>
                <div className="chart">                
                   <Line data={{
                            labels: this.props.years,
                            datasets: [{
                                label: 'Average Rating per Year',
                                fill: false,
                                lineTension: 0.1,
                                backgroundColor: '#e0e2e2',
                                borderColor: '#ea4136',
                                data: this.props.ratings
                            }]
                        }}

                        options = {{
                            scales: {
                                yAxes: [{
                                        ticks: {
                                            beginAtZero:true
                                        }
                                }]
                            }}
                         }
                    />
                </div>
            </div>
        )
    }
}

export default Chart;