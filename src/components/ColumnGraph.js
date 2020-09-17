import React from 'react';
import Highcharts from 'highcharts/highcharts';
import drilldown from 'highcharts/modules/drilldown.js'
import HighchartsReact from 'highcharts-react-official';
import { TabView,TabPanel } from 'primereact/tabview';

import DataContext from "./../dataContext";

drilldown(Highcharts);

const indexObject={0:'confirmed',1:"recovered",2:"deaths"};

class ColumnGraph extends React.Component
{
    static contextType = DataContext;
    constructor()
    {
        super();
        this.state={
        options: {},
        activeIndex:0
       }
    }

    componentDidMount()
    {
        this.structureData(0);
    }

    async structureData(index)
    { 
      try{
          
        let data =this.context.actualData.total[indexObject[index]];

        let i=0,DaysInMonths =[31,29,31,30,31,30,31,31,30,31,30,31];
        let nameOfMonths = {0:"Jan",1:"Feb",2:"March",3:"Apr",4:"May",5:"Jun",6:"Jul",7:"Aug",8:"Sept",9:"Oct",10:"Nov",11:"Dec"}

        let obj =[],month=0,prevdata=0,ddrObject=[],daysdata=[],daysPrevData=0;


        data.forEach((element,index) => {
            month = new Date(element[0]).toISOString().split("-")[1];
            daysPrevData = 0;

            if(index>0)
                daysPrevData+=data[index-1][1];
        
            daysdata.push([new Date(element[0]).toISOString().split("-")[2].split("T")[0],element[1]-daysPrevData]);

            if(new Date(element[0]).toISOString().split("-")[2].split("T")[0] == DaysInMonths[month-1]){

                ddrObject.push({name:nameOfMonths[month-1],"id":i.toString(),"data":daysdata});
                daysdata=[];
                if(i>0) prevdata+=obj[i-1].y;

                obj[i]={name:nameOfMonths[month-1],"y":element[1]-prevdata,drilldown:i.toString()};

                i++;
            }
            else if(index === data.length-1){
                prevdata+=obj[i-1].y;
                ddrObject.push({name:nameOfMonths[month-1],"id":i.toString(),"data":daysdata});
                daysdata=[];
                obj[i] = {name:nameOfMonths[month-1],"y":element[1]-prevdata,drilldown:i.toString()};
            }      
        });

        await this.setState({
            activeIndex:index,
            options: {
                chart: {
                    type: 'column',
                    height:365
                },
                title: {
                    text: this.context.presentRegion+' Coronovirus Cases, 2020'
                },
                subtitle: {
                    text: 'Monthly/Daily Cases'
                },
                xAxis: {
                    type: 'category',
                },
                yAxis: {
                    title: {
                        text: 'Cases'
                    }
                },
                legend: {
                    enabled: false
                },
                credits:{
                    enabled:false
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y}'
                        }
                    }
                },
                accessibility: {
                    announceNewData: {
                        enabled: true
                    }
                },
                tooltip: {
                    enabled:true,
                    formatter: function() {
                        return this.series.name+" <b>"+this.point.name+"</b><br/>" +indexObject[index]+":<b>"+(this.point.y).toLocaleString()+"</b>"
                    },
                     useHTML:true
                },
            
                series: [
                    {
                       name:"Month", 
                        data:obj,
                    }
                ],
                drilldown: {
                    name:"Dates",
                    series: ddrObject
                }
            }
        });
       }
       catch(err)
       {
           console.log(err);
       }
    }

    render()
    {
        return(
            <div className="card">  
               <div className="card-body column">
                    <TabView  activeIndex={this.state.activeIndex} onTabChange={(e)=>{if(e.index===this.state.activeIndex) return;this.structureData(e.index)}}>
                        <TabPanel header="Confirmed">
                           <HighchartsReact highcharts={Highcharts} options={this.state.options} />
                        </TabPanel>
                        <TabPanel header="Recovered">
                           <HighchartsReact highcharts={Highcharts} options={this.state.options} />
                        </TabPanel>
                        <TabPanel header="Deaths">
                           <HighchartsReact highcharts={Highcharts} options={this.state.options} />
                        </TabPanel>
                    </TabView>
                </div>
            </div>
            
        )
    }
}

export default ColumnGraph;