import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMap from "highcharts/modules/map";
import world from "@highcharts/map-collection/custom/world.geo.json";
import india from "@highcharts/map-collection/countries/in/custom/in-all-disputed.geo.json";

import DataContext from './../dataContext';

highchartsMap(Highcharts);


var data=[];
class CoronoMap extends React.Component{
  static contextType = DataContext;

  constructor()
  {
    super();
    data=[];
    this.state={options:{}};
  }

  componentDidMount(){
    let options={};
    if(this.context.presentRegion === 'India')
    options = {
      chart: {
        map:india,
        height:320
      },
      title: {
        text: this.context.presentRegion+" Map Plot with Cases <span className='fa fa-expand'></span>",
        useHTML:true
      },      
      credits:{
        enabled:false
      },
      mapNavigation: {
        enabled: true,
        
      },
      tooltip: {
        headerFormat: '{point.key}<br>',
        pointFormat: 'Cases : <b>{point.value}</b>',
        shared: true
    },
      series: [
        {
          mapData: india,
          data: this.context.data.mapdata,
          name: this.context.presentRegion === 'World'?'Countries':'States',
          borderColor: '#A0A0A0',
          nullColor: 'rgba(200, 200, 200, 0.3)',
         showInLegend: false,
          states: {
            hover: {
              color: "red"
            }
          }
        }
      ]
    }
    else
       options = {
         chart: {
           map:world,
           height:320
      },
      title: {
        text: this.context.presentRegion+" Map Plot with Cases"
      },
      
      credits:{
        enabled:false
      },
      mapNavigation: {
        enabled: true,
      },
      tooltip: {
        headerFormat: '{point.key}<br>',
        pointFormat: 'Cases : <b>{point.value}</b>',
        shared: true
    },
      series: [
        {
          data: this.context.data.mapdata,
          joinBy: ["iso-a3", "alpha3"],
          name: this.context.presentRegion === 'World'?'Countries':'States',
          borderColor: '#A0A0A0',
          nullColor: 'rgba(200, 200, 200, 0.3)',
          showInLegend: false,
          states: {
            hover: {
              color: "red"
            }
          }
        }
      ]};
     this.setState({
      mapOptions: options
  });
}


  render(){
      return (
        <div className="col-xl-6 col-md-12">
            <div className="card">
                <div className="card-body">
                  <HighchartsReact constructorType ={'mapChart'} highcharts={Highcharts} options={this.state.mapOptions} />
                </div>
            </div>
        </div>
        );
    }
}
export default CoronoMap;