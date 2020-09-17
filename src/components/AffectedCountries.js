import React from 'react';
import {ProgressBar} from 'primereact/progressbar';

import DataContext from "./../dataContext";

class AffectedCountries extends React.Component
{
    static contextType=DataContext;
    constructor()
    {
        super();
        this.state={
           data:[],
        }
    }

    componentDidMount()
    {
      this.sortData();       
    }

    async sortData()
    {
      try{

        //sort mapped data according the cases confirmed
        this.context.data.affectedcountries.sort((a,b) => {return b.cases-a.cases})

        // get the top five affected places according to the confirmed cases
        this.context.data.affectedcountries = this.context.data.affectedcountries.splice(0,5);
    
        await this.setState({data: this.context.data.affectedcountries});
      }
      catch(err)
      {
        console.log(err);
      } 
    }

    render()
    {
        const name = this.context.presentRegion === "World" ? "Countries" : "States";
        return(
           <div className="col-xl-3 col-md-12">
              <div className="card" style={{height:'360px'}}>
                <div className="card-header">
                  <span style={{fontSize:"17px"}}>5 Most Affected {name}</span>
                </div>
                <div className="card-body">
                  { this.state.data.map(data => ( 
                     <div key={data.name}>
                       <span  style={{float:'left'}}>{data.name}</span>  <span style={{float:"right"}}>{data.cases.toLocaleString()}</span><br></br>
                       <ProgressBar value={data.percentage} showValue ={false} style={{height:'5px'}} />
                       <br></br>
                     </div>   ))}
                </div>
              </div>
            </div>
        );
    }
}

export default AffectedCountries;