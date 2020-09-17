import React from 'react';

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import 'primeicons/primeicons.css';

import DataContext from './../dataContext';

//service to get districts data
import DistrictData from '../services/coronadata.service';


class tableData extends React.Component
{
  static contextType = DataContext;

    constructor()
    {
      super();
      this.state={data:[],districtData:[]};
    }

    componentDidMount()
    {
      this.getData();
    }

    async getData(){
      try{
        //assign data
        await this.setState({data:this.context.data.tableData,tempObj:this.context.data.tableData});
      }
      catch(err){
        console.log(err);
      }
    }

    getDistrictData = async(data) => {

      try{

        if(this.context.presentRegion === "World") return;    
        //for in case of India 
        let obj =[];
        let districtdata = sessionStorage.getItem("districtdata")!= undefined?JSON.parse(sessionStorage.getItem("districtdata")):await DistrictData.getDistrictWiseData();

        Object.keys(districtdata[data].districtData).forEach(x=>{    
        obj.push({name:x,active:districtdata[data].districtData[x].active,deaths:districtdata[data].districtData[x].deceased,recovered:districtdata[data].districtData[x].recovered,cases:districtdata[data].districtData[x].confirmed})    
        })

        await this.setState({districtData:obj,flag:true,tempdistrictObj:obj,presentState:data+" - District Wise Status"})

        if(sessionStorage.getItem("districtdata") == undefined)  
            sessionStorage.setItem("districtdata",JSON.stringify(districtdata));

        // scroll to the specified district table
        var element = document.querySelector("#district");
        element.scrollIntoView();
      }
      catch(err){
          console.log(err);
      }
    }

    //GLOBAL SEARCH FUNCTIONALITY
    getFilteredData=async(name,searchIn)=>{
            let obj =[];
            try{
            if(searchIn !== 'district'){
                this.state.tempObj.forEach(x=>{
                    if(x.name.toLowerCase().includes(name.toLowerCase())) obj.push(x)
                })
                await this.setState({data:obj})
                return;
            }
            else{
                this.state.tempdistrictObj.forEach(x=>{
                    if(x.name.toLowerCase().includes(name.toLowerCase())) obj.push(x)
                })
                await this.setState({districtData:obj})
            }
            }
            catch(err){console.log(err);}
    }

    render(){
      
        const name = this.context.presentRegion === "World"?"Country":"State";
        let districtTable;
            
        const header = <div className="headerdiv">
         <span className="headertext">{name} Wise Status</span>
         <div  className="col-sm-12 col-xl-3" className="p-datatable-globalfilter-container">
           <span className="p-input-icon-left"><i className="pi pi-search" style={{fontSize:"1rem",position:"absolute",display:"inline-block",top:"20px",marginLeft:"0.5%"}}></i>
             <InputText type="search" style={{paddingLeft:"1.8rem"}} onChange={(e)=>this.getFilteredData(e.target.value,"")} placeholder="Search By Place Name" />
           </span>
         </div>
        </div>

        const districttableheader = <div className="headerdiv">
        <span className="headertext">{this.state.presentState}</span>
        <div  className="col-sm-12 col-xl-3"  className="p-datatable-globalfilter-container">
            <span className="p-input-icon-left"><i className="pi pi-search" style={{fontSize:"1rem",position:"absolute",display:"inline-block",top:"20px",marginLeft:"0.5%"}}></i>
               <InputText type="search" style={{paddingLeft:"1.8rem"}} onChange={(e)=>this.getFilteredData(e.target.value,"district")} placeholder="Search By Place Name" />
            </span>
        </div>
        </div>
        
        
        if(this.context.presentRegion === 'India' && this.state.flag){
         districtTable = 
         <div className="datatable" id="districttable">
         <DataTable id="district" className="p-datatable-places" emptyMessage="No records found" responsive={true} style={{border:'none'}} header={districttableheader} value={this.state.districtData}  paginator rows={10}>
         <Column field="name"  body={this.dateTemplate=(rowData)=>{return <span style={{fontWeight:"bold"}}>{rowData.name}</span>}} header="District" sortable={true} />
         <Column field="cases"  header="Confirmed" sortable={true}  />
         <Column field="active" header="Active" sortable={true}  />
         <Column field="recovered" header="Recovered" sortable={true} />
         <Column field="deaths" header="Deaths" sortable={true}/>
         </DataTable>
         </div>
        }
        
        return(
            <div className="col-sm-12 datatable">
              <DataTable onRowClick ={(event)=>this.getDistrictData(event.data.name)} className="p-datatable-places" rowHover emptyMessage="No records found" header={header} value={this.state.data} responsive={true} paginator={true} rows={10}>
                 <Column field="name" header={name} sortable={true} body={(rowData)=>{
                     let textdecoration="underline"; 
                     if(name === 'Country') textdecoration="none";
                     return <span title="Click to get District Wise Data" style={{fontWeight:"550",textDecoration:textdecoration,color:"#337ab7"}}>{rowData.name}</span>}} />     
                 <Column field="cases" body={(rowData)=>{
                      let changes;
                      if(rowData.changeinConfirmed !== 0) changes = <span title="Change since yesterday" className="fa fa-arrow-up" style={{fontWeight:'500',color:"#ef3c3c"}}>{rowData.changeinConfirmed}</span>
                      return <span>{rowData.cases} &nbsp;&nbsp;&nbsp;{changes}</span>}} header="Confirmed" sortable={true}  />
                 <Column field="active" header="Active" body ={(rowData) => {
                     let changes;
                     if(rowData.changeinActive !== 0) {
                         if(rowData.changeinActive >0)
                           changes = <span title="Change since yesterday" className="fa fa-arrow-up" style={{fontWeight:'500',color:"#ef3c3c"}}>{rowData.changeinActive}</span> 
                         else
                           changes = <span title="Change since yesterday" className="fa fa-arrow-down" style={{fontWeight:'500',color:"#009933"}}>{-rowData.changeinActive}</span>
                     }
                     return <span>{rowData.active}&nbsp;&nbsp;&nbsp;{changes}</span>}} sortable={true}  />
                 <Column field="recovered" header="Recovered"  body ={(rowData)=>{
                     let changes;
                     if(rowData.changeinRecovered !== 0) changes = <span title="Change since yesterday" className="fa fa-arrow-up" style={{fontWeight:'500',color:"#009933"}}>{rowData.changeinRecovered}</span> 
                     return <span>{rowData.recovered}&nbsp;&nbsp;&nbsp;{changes}</span>}} sortable={true}  />
                 <Column field="deaths" body ={(rowData)=>{
                     let changes;
                     if(rowData.changeinDeaths !== 0)  changes = <span title="Change since yesterday" className="fa fa-arrow-up" style={{fontWeight:'500',color:"#ef3c3c"}}>{rowData.changeinDeaths}</span>
                 return <span>{rowData.deaths}&nbsp;&nbsp;&nbsp;{changes}</span>}} header="Deaths" sortable={true}  />
                 
              </DataTable>
              <br></br>
              {districtTable}
            </div>
        )
    }
}

export default tableData;