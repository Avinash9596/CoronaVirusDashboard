const data={
 
    getData:async function(regionName){
        const WorldDataApi = "https://nprelease.indiatimes.com/ncov19/trend_data_toi.json"; //API TO GET WORLD DATA
        const IndiaDataApi = "https://nprssfeeds.indiatimes.com/ncov19/trend_data_india_toi.json"; //API TO GET INDIA DATA

        try{
            return await(await fetch(regionName==="India"?IndiaDataApi:WorldDataApi)).json();
        }
        catch(err){
            console.log(err);
        }
    },

    //TO GET DISCTRICT DATA CORRESPONDING TO ALL STATES IN CASE OF 'INDIA'
    getDistrictWiseData:async function(){
        const api = "https://api.covid19india.org/state_district_wise.json";
        
        try{
            return await(await fetch(api)).json();
        }
        catch(err){
            console.log(err);
        }
    }

}

export default data;