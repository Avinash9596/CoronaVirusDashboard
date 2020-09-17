import React from 'react';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
//components
import WorldPieChart from './components/WorldPieChart';
import CoronoMap from './components/CoronaMap';
import CountryData from './components/tableData';
import AffectedCountries from './components/AffectedCountries';
import Rates from './components/Rates';
//Services 
import Data from './services/coronadata.service';
import coronoService from './services/corona.service';
import DataContext from './dataContext';

class App extends React.Component {

  mybutton = document.getElementById("myBtn");

  constructor() {
    super();
    this.state = {presentRegion:'India',loading:true,is_visible:false};
  }

  componentDidMount() {
    var scroll = this;
    document.addEventListener("scroll", function(e) {
      scroll.toggleVisibility();
    });
    this.getData();
  }

  async toggleVisibility() {
    if (window.pageYOffset >100) {
      await this.setState({
        is_visible: true
      });
    } else {
      await this.setState({
        is_visible: false
      });
    }
  }

  async getData()
  {
     try{
        //clear session storage on change of region or refresh of the GUI
        if(sessionStorage.getItem("districtdata")!= undefined) sessionStorage.clear();
        let data = await Data.getData(this.state.presentRegion);
        await this.setState({data: await coronoService.structureData(data,this.state.presentRegion),actualData:data,loading: false})
      } 
     catch(err){
       console.log(err);
     } 
  }

  showRegionData = async(region) =>{
     try{
        await this.setState({
          presentRegion:region,
          data:[],
          actualData:{},
          loading:true
        })
        await this.getData();
     }
     catch(err)
     {
       console.log(err)
     }
  }

  //SCROLL TO TOP 
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  render() {
    const {loading,presentRegion,is_visible} = this.state;
    let pageData,loader;

   
    let regionnavigationStyleindia = "2.6px solid red" ;
    let regionnavigationStyleWorld = "2.6px solid transparent";

    if(this.state.presentRegion === "World"){
      regionnavigationStyleindia ="2.6px solid transparent";
      regionnavigationStyleWorld = "2.6px solid red";
    }

    pageData = <div>
    <div className="header">
      <h5 style={{ padding: '10px' }}>
        <a href="/" className="navbar-brand router-link-exact-active active" target="_self"><img src={require("./viruslogo.png")} alt="Covid" height="30" width="30" className="d-inline-block align-top mr-1" />COVID-19 </a>
        <div style={{display:"flex",float:"right"}}>
          <p val="india"  onClick={()=>this.showRegionData('India')} style={{height:"40px",cursor:"pointer",color:presentRegion==='India'?'red':'black',borderBottom:regionnavigationStyleindia,fontWeight:"500"}}> <i className="fa fa-map-marker"></i>&nbsp;India</p>
          <p val="world" onClick={()=>this.showRegionData('World')} style={{cursor:"pointer",marginLeft:'25px',color:presentRegion==='India'?'black':'red',borderBottom:regionnavigationStyleWorld}}><i className="fa fa-globe"></i>&nbsp;World</p>
        </div>
      </h5>
    </div><br></br><br></br><br></br>
    <DataContext.Provider value={this.state}>
        <WorldPieChart />
    <div className="container-fluid">
      <div className="row">
        <AffectedCountries />
        <CoronoMap/>
        <Rates/>
        <CountryData/>
      </div>
    </div>
    </DataContext.Provider>

    {/* FOR SCROLL TO TOP */}
    <div>
     {is_visible && (
      <div  className="scroll-to-top" onClick={() => this.scrollToTop()}>
         <span className="fa fa-angle-double-up"></span>
      </div>
     )}
    </div>
    <br></br><br></br><br></br>

    <div style={{backgroundColor:"light",height:"40px"}}>
      <span style={{textAlign:"center",display:"block",fontWeight:"300"}}>Source: MOHFW(India) and John Hopkins </span>
    </div>

    {/* FOOTER */}
    <div className="footer">
      <div style={{textAlign:"center",margin:"0px auto",display:"block",marginTop:"12px"}}>
        <span style={{fontSize:"15px"}}>Copyright © 2020, Matcha Avinash</span>
      </div>
    </div>

    </div>

    //FOR LOADER 
    loader = 
    <div className = "fetching">
      <span><img className="rotate" src={require("./viruslogo.png")} width="70"></img></span>
    </div>
      

    return (
      <div style={{ backgroundColor: "rgb(250,250,250)"}}>
        {loading?loader:pageData}
      </div>
    );
  }
}

export default App;
