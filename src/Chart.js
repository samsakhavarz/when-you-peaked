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
                            responsive: true,
                            legend: {
                                display:false
                            },
                            tooltips: {
                                callbacks: {
                                    label: (tooltipItem, data) => {
                                        // data for manipulation
                                        return data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                    },
                                },
                            },
                            title: {
                                display: true,
                                text: 'Average Rating per Publication Year'
                            },
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        //beginAtZero: true,
                                        max: 5
                                    },
                                    scaleLabel: {
                                    display: true,
                                    labelString: "Average Rating",
                                    },
                                }],
                                xAxes: [{
                                    scaleLabel: {
                                        display: true,
                                        labelString: "Original Publication Year",
                                    },
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