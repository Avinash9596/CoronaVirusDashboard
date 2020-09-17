import  React  from "react";
import {ProgressBar} from 'primereact/progressbar';
import DataContext from './../dataContext';



class Rates extends React.Component{  

    render(){
        return(
          <DataContext.Consumer>
            {
              (value)=> {
                const {highestactive,highestrecovered,highestdeaths} = value.data;  
                 return (
                  <div className="col-xl-3 col-md-12">
                  <div className="card" style={{height:"360px"}}>
                    <div className="card-body">
                        <div>
                          <h6 style={{fontWeight:"400"}}>Highest Active Rate</h6>
                          <ProgressBar className="active" value={highestactive.active_percentage} showValue ={false} style={{height:'5px'}} />
                          <span style={{float:"left"}}>{highestactive.name}</span>
                          <span style={{float:"right"}}>{highestactive.active_percentage.toFixed(2)}%</span>
                        </div><br></br><br></br><hr></hr>
    
                        <div>
                          <h6 style={{fontWeight:"400"}}>Highest Recovery Rate</h6>
                          <ProgressBar className="recovered" style={{background:"green !important"}} value={highestrecovered.rec_percentage} showValue ={false} style={{height:'5px'}} />
                          <span style={{float:"left"}}>{highestrecovered.name.split(" ")[0]}</span>
                          <span style={{float:"right"}}>{highestrecovered.rec_percentage.toFixed(2)}%</span>
                        </div>
                        <br></br><br></br><hr></hr>
                        <div>
                          <h6 style={{fontWeight:"400"}}>Highest Death Rate</h6>
                          <ProgressBar className="deaths" value={highestdeaths.death_percentage} showValue ={false} style={{height:'5px'}} />
                          <span style={{float:"left"}}>{highestdeaths.name}</span>
                          <span style={{float:"right"}}>{highestdeaths.death_percentage.toFixed(2)}%</span>
                        </div>
    
                    </div>
                  </div>
                </div>
                 );
            }
          }
          </DataContext.Consumer>
        )
    } 
}

export default Rates;