import React from 'react';
import Highcharts from 'highcharts/highcharts';
import HighchartsReact from 'highcharts-react-official';
import ColumnGraph from './ColumnGraph';

import DataContext from './../dataContext';

const nf = new Intl.NumberFormat();

class WorldPieChart extends React.Component{
  static contextType=DataContext;

  constructor()
  {
    super();
    this.state={options:{},data:[]};

  }
  
  componentDidMount()
  {
    this.structureData();
  }

  async structureData()
  {
    try{
     let  obj =[{"name": "Active","data":this.context.data.activecases,"y": parseFloat(((this.context.data.activecases/this.context.data.TotalConfirmed)*100).toFixed(2))},{color:"rgb(239, 60, 60)","name":"Deaths","data":this.context.data.TotalDeaths,"y":parseFloat(((this.context.data.TotalDeaths/this.context.data.TotalConfirmed)*100).toFixed(2))},{"name":"Recovered","data":this.context.data.TotalRecovered,"y":parseFloat(((this.context.data.TotalRecovered/this.context.data.TotalConfirmed)*100).toFixed(2))}];
     await this.setState({
      options:{
        chart: {
            type: 'pie',
            height:'270',
          },
          title: {
            text: this.context.presentRegion +' Coronovirus Cases'
          },    
          tooltip: {
            formatter: function() {
              return this.point.name+":<b>"+this.point.y+"%</b>"
            },
          },
          accessibility: {
            point: {
              valueSuffix: '%'
            }
          },
          plotOptions: {
            pie: {
              size:'104%',
              cursor: 'pointer',
              dataLabels: {
                enabled: false,
                format: '{point.y}%'
              },
              showInLegend: false
            }
          },
          credits: {
            enabled: false
        },
          series: [{
            innerSize: '58%',
            name: 'Cases',
            colorByPoint: true,
            data: obj,
          }]
      },
      data:[
        nf.format(this.context.data.TotalConfirmed),
        nf.format(this.context.data.NewConfirmed),
        nf.format(this.context.data.TotalRecovered),
        nf.format(this.context.data.NewRecovered),
        nf.format(this.context.data.TotalDeaths),
        nf.format(this.context.data.NewDeaths),
        nf.format(this.context.data.TotalConfirmed-this.context.data.TotalRecovered-this.context.data.TotalDeaths),
        obj[0]["y"], // active percenatage
        obj[1]["y"], // deaths percentage
        obj[2]["y"]  // recovered percenatge
      ]
     });
    }
    catch(err){
     console.log(err);
    }    
  }


  render() {
      return(     
        <div>
          <div className="container-fluid">
          <div className="row">
            <div className="col-xl-2 col-md-6">
               <div className="card casescountcard" style={{borderLeft:'4px solid rgb(124, 181, 236)'}}>
                  <div className='card-header'>
                     <i className="fa fa-users" style={{fontSize:'25px',color:"rgb(124, 181, 236)"}}></i><br></br>
                     <span style={{textAlign:"center",fontSize:'24px',fontWeight:'500'}}>{this.state.data[0]}</span>   
                  </div>
                  <div className="card-body" style={{marginTop:"-24px"}}><span>Total Confirmed</span></div>
               </div>  
            </div>
            <div className="col-xl-2 col-md-6 ">
              <div className="card casescountcard" style={{borderLeft:'4px solid rgb(124, 181, 236)'}}>
                  <div className='card-header'>
                    <i className="fa fa-users" style={{fontSize:'25px',color:"rgb(124, 181, 236)"}}></i><br></br>
                    <span style={{textAlign:"center",fontSize:'24px',fontWeight:'500'}}>{this.state.data[1]}</span>
                  </div>  
                  <div className="card-body" style={{marginTop:"-24px"}}>New Confirmed</div>
               </div> 
            </div>
             <div className="col-xl-2 col-md-6">
               <div className="card casescountcard" style={{borderLeft:'4px solid #7aed7a'}}>
                  <div className='card-header'>
                    <i className="fa case-icon fa-inverse fa-child" style={{fontSize:'25px',color:"#7aed7a",fontWeight:"bold"}}></i><br></br>
                    <span style={{textAlign:"center",fontSize:'24px',fontWeight:'500'}}>{this.state.data[2]}</span>
                  </div>
                  <div className="card-body" style={{marginTop:"-24px"}}>Total Recovered</div>
               </div>  
              </div>
             <div className="col-xl-2 col-md-6">
              <div className="card casescountcard" style={{borderLeft:'4px solid #7aed7a'}}>
                  <div className='card-header'>
                     <i className="fa case-icon fa-inverse fa-child" style={{fontSize:'25px',color:"#7aed7a",fontWeight:"bold"}}></i><br></br>
                     <span style={{textAlign:"center",fontSize:'24px',fontWeight:'500'}}>{this.state.data[3]}</span>        
                  </div>
                  <div className="card-body" style={{marginTop:"-24px"}}>New Recovered</div>
               </div> 
              </div>
            
            <div className="col-xl-2 col-md-6">
               <div className="card casescountcard" style={{borderLeft:'4px solid #ef3c3c'}}>
                  <div className='card-header'>
                    <i className="fas fa-heart-broken" style={{fontSize:'25px',color:"#ef3c3c"}}></i><br></br>
                    <span style={{textAlign:"center",fontSize:'23px',fontWeight:'500'}}>{this.state.data[4]}</span>
                  </div>
                  <div className="card-body" style={{marginTop:"-24px"}}>Total Deaths</div>
               </div> 
            </div> 
            <div className="col-xl-2 col-md-6">
              <div className="card casescountcard" style={{borderLeft:'4px solid #ef3c3c'}}>
                 <div className='card-header'>
                    <i className="fas fa-heart-broken" style={{fontSize:'25px',color:"#ef3c3c"}}></i><br></br> 
                    <span style={{textAlign:"center",fontSize:'23px',fontWeight:'500'}}>{this.state.data[5]}</span>
                 </div>   
                  <div className="card-body" style={{marginTop:"-24px"}}>New Deaths</div>
               </div> 
            </div>    
          </div>
          

          <div className="row">
            <div className="col-xl-3 col-md-12">
              <div className="card ">
                 <div className="card-body">
                   <HighchartsReact highcharts={Highcharts} options={this.state.options} />
                 </div>
               <div className="table-responsive">
                <table className="table align-items-center">
                  <tbody>
                    <tr>
                      <td style={{fontSize:"14px",fontWeight:"500"}}><i className="fa fa-circle mr-2" style={{color: "rgb(124, 181, 236)"}}></i> Active</td>
                      <td>{this.state.data[6]}</td>
                      <td>{this.state.data[7]}%</td>
                    </tr>
                    <tr>
                      <td style={{fontSize:"14px",fontWeight:"500"}}><i className="fa fa-circle mr-2" style={{color: "rgb(144, 237, 125)"}}></i>Recovered</td>
                      <td>{this.state.data[2]}</td>
                      <td>{this.state.data[9]}%</td>
                    </tr>
                    <tr>
                      <td style={{fontSize:"14px",fontWeight:"500"}}><i className="fa fa-circle mr-2" style={{color: "rgb(239, 60, 60)"}}></i>Deaths</td>
                      <td>{this.state.data[4]}</td>
                      <td>{this.state.data[8]}%</td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </div>
            </div>
           
            <div className="col-xl-9 col-md-12">
              <ColumnGraph  presentRegion={this.props.presentRegion} data={this.props.columnData}/>
            </div>
          </div>
          </div>
        </div>
      );
    }
}

export default WorldPieChart;