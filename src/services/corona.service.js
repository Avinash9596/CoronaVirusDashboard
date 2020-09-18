import code from "./../countrycordinates.json";

const coronoService ={

    structureData:function(value,presentRegion){
        console.log("str called");
        let structuredData={};

        //INITIALISING ALL THE FIELDS 
        structuredData["affectedcountries"]=[];
        structuredData["tableData"] = [];
        structuredData["highestactive"] = {};
        structuredData["highestrecovered"] = {};
        structuredData["highestdeaths"] = {};
        structuredData["mapdata"]=[];

        try{
        structuredData["TotalConfirmed"] = value.total.confirmed[value.total.confirmed.length-1][1];
        structuredData["TotalDeaths"] = value.total.deaths[value.total.deaths.length-1][1];
        structuredData["TotalRecovered"] = value.total.recovered[value.total.recovered.length-1][1];
        structuredData["NewConfirmed"] = structuredData["TotalConfirmed"]-value.total.confirmed[value.total.confirmed.length-2][1];
        structuredData["NewRecovered"] = structuredData["TotalRecovered"]-value.total.recovered[value.total.recovered.length-2][1];
        structuredData["NewDeaths"] = structuredData["TotalDeaths"]-value.total.deaths[value.total.deaths.length-2][1];
        structuredData["activecases"] = structuredData["TotalConfirmed"]-(structuredData["TotalDeaths"]+structuredData["TotalRecovered"]);    

        //get country wise data
        value.countries.forEach((element) => {
            let confirmed = value.data[element].confirmed;
            let deaths = value.data[element].deaths;
            let recovered = value.data[element].recovered;

            // AFFECTED COUNTRIES
            structuredData["affectedcountries"].push({"name":element,"cases":confirmed[confirmed.length-1][1],"percentage":(confirmed[confirmed.length-1][1]/structuredData["TotalConfirmed"])*100});
            
            // ALL COUNTRIES/STATES DATA
            structuredData["tableData"].push({"name":element,
            "cases":confirmed[confirmed.length-1][1],
            "deaths":deaths[deaths.length-1][1],
            "recovered":recovered[recovered.length-1][1],
            "changeinConfirmed":confirmed[confirmed.length-1][1]-confirmed[confirmed.length-2][1],
            "changeinRecovered" : recovered[recovered.length-1][1]-recovered[recovered.length-2][1],
            "changeinDeaths":deaths[deaths.length-1][1]-deaths[deaths.length-2][1],
            "changeinActive":((confirmed[confirmed.length-1][1]-confirmed[confirmed.length-2][1]) - (recovered[recovered.length-1][1]-recovered[recovered.length-2][1]) - (deaths[deaths.length-1][1]-deaths[deaths.length-2][1])),
            "active":confirmed[confirmed.length-1][1]-deaths[deaths.length-1][1]-recovered[recovered.length-1][1],
            "recoveredRate" : ((recovered[recovered.length-1][1]/confirmed[confirmed.length-1][1])*100).toFixed(2)
            })

            // FOR HIGHEST ACTIVE/RECOVERED/DEATHS RATES
            if(Object.keys(structuredData.highestactive).length>0){
                if(structuredData.highestactive.active_percentage < ((confirmed[confirmed.length-1][1]-recovered[recovered.length-1][1]-deaths[deaths.length-1][1])/confirmed[confirmed.length-1][1])*100){
                    structuredData.highestactive.name = element;
                    structuredData.highestactive.active_percentage = ((confirmed[confirmed.length-1][1]-recovered[recovered.length-1][1]-deaths[deaths.length-1][1])/confirmed[confirmed.length-1][1])*100
                }
                if(structuredData.highestrecovered.rec_percentage < (recovered[recovered.length-1][1]/confirmed[confirmed.length-1][1])*100){
                    structuredData.highestrecovered.name=element;
                    structuredData.highestrecovered.rec_percentage=(recovered[recovered.length-1][1]/confirmed[confirmed.length-1][1])*100
                }
                if(structuredData.highestdeaths.death_percentage < (deaths[deaths.length-1][1]/confirmed[confirmed.length-1][1])*100){
                    structuredData.highestdeaths.name = element;
                    structuredData.highestdeaths.death_percentage = (deaths[deaths.length-1][1]/confirmed[confirmed.length-1][1])*100
                }
            }
            else{
              structuredData.highestactive={name:element,active_percentage: ((confirmed[confirmed.length-1][1] - recovered[recovered.length-1][1]-deaths[deaths.length-1][1])/confirmed[confirmed.length-1][1])*100};
              structuredData.highestrecovered={name:element,rec_percentage:(recovered[recovered.length-1][1]/confirmed[confirmed.length-1][1])*100};
              structuredData.highestdeaths={name:element,death_percentage:(deaths[deaths.length-1][1]/confirmed[confirmed.length-1][1])*100};   
            }
            
            //TO MAP CASES IN MAP CHART
            if(presentRegion === 'India'){
                element = element === "Arunachal Pradesh"?"arunanchal pradesh": (element === "Delhi"?"nct of delhi": (element === "Andaman and Nicobar Islands"?"andaman and nicobar" : element.toLowerCase()));
                structuredData["mapdata"].push([element === "Arunachal Pradesh"?"arunanchal pradesh":element.toLowerCase(),parseInt(confirmed[confirmed.length-1][1]).toLocaleString()]);
            }       
            else
                code.ref_country_codes.forEach(x=>{
                   if(x.country.toLowerCase() === element.toLowerCase())
                     structuredData["mapdata"].push({"country":x.country,"alpha3":x.alpha3,"lat":x.lat,"lon":x.lon,"value":parseInt(confirmed[confirmed.length-1][1]).toLocaleString()})
                   
                })
              
        });
        }
        catch(err){
            console.log(err);
        }
        
        return structuredData;
    },
    
}

export default coronoService;