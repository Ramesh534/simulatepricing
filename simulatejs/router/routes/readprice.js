const fetch = require('node-fetch'),
      express = require('express'),
      app = express(); 
      
var payload=`{
    "DB_KEY": "",
    "PARENT_KEY": "AA06sNvvHtmwhkmWmZOA3g==",
    "LAUFI": "",
    "LAUFD": "\/Date(1571263200000)\/",
    "KUNNR": "0000000006",
    "VKORG": "1000",
    "VTWEG": "10",
    "SPART": "00",
    "WERKS": "1000",
    "PRSDT": "\/Date(1571263200000)\/",
    "KALSM": "ZVAA02",
    "AUART": "OR",
    "PSTYV": "TAN",
    "RATECARD": "",
    "WAERK": "EUR",
    "KUNWE": "",
    "SIMULATE_HEAD_TO_ITEM": [{
        "ROOT_KEY": "AA06sNvvHtmwhkmWmZOA3g==",
        "MATNR": "000000000000000023",
        "MATKL": "01",
        "VRKME": "M2",
        "MGAME": "1"
    },{
        "ROOT_KEY": "AA06sNvvHtmwhkmWmZOA3g==",
        "MATNR": "000000000000000004",
        "MATKL": "01",
        "VRKME": "EA",
        "MGAME": "1"
    } ]
}`  ;
 
async function makeRequest(url, config) {
    try {
       
        const response = await fetch(url, config) 
         
        return {
            "status": response.status,
            "payload": await response.json(),
            "headers":response.headers.raw()
        }
    } catch (error) {
        console.log(error)
        return {
            "status": null,
            "payload": error.message
        }
    }
}

async function getDBKey(header,payload) {
     const config = {
		method: "POST",
   	    headers: {
               "X-CSRF-Token" : header.csrf,
               "Cookie" : header.cookie,
               'Accept':'application/json',
               'Content-type':'application/json' 
		} ,
		body:payload
	};
let statement = `SELECT "seqrunid".nextval RUNID FROM DUMMY`;
let result =await runquery(statement);
let runid = result[0].RUNID;
let url = 'https://proxyec8-ee0278a83.dispatcher.eu2.hana.ondemand.com/sposea-qac/sap/opu/odata/SPOSEA/BPM_ODATA_HANA_V1_SRV/DATASET_HEADCollection' 
let response = await makeRequest(url,config);	

return response;
}

async function readPriceData(header,payload) {
     const config = {
		method: "POST",
   	    headers: {
               "X-CSRF-Token" : header.csrf,
               "Cookie" : header.cookie,
               'Accept':'application/json',
               'Content-type':'application/json' 
		} ,
		body:payload
	}; 
let url = 'https://proxyec8-ee0278a83.dispatcher.eu2.hana.ondemand.com/sposea-qac/sap/opu/odata/SPOSEA/BPM_ODATA_HANA_V1_SRV/SIMULATE_HEADSet' 
let response = await makeRequest(url,config);	

return response;
}


async function fetchCSRF () { 
    let url= 'http://proxyec8-ee0278a83.dispatcher.eu2.hana.ondemand.com/sposea-qac/sap/opu/odata/SPOSEA/BPM_ODATA_HANA_V1_SRV/'
    var options = { method: 'GET',
                    
                    headers: 
                    { 'Accept':'application/json',
                      'X-CSRF-Token':'fetch',
                      'Content-type':'application/json'
                    } 
                  };

    let response = await makeRequest(url,options); 
    let csrf =  response.headers['x-csrf-token']; 
    let cookie = response.headers['set-cookie'];
    let headerData={}
    headerData.csrf=csrf.toString();
    headerData.cookie=cookie.toString();
    return headerData;
};


async function readprice (){
 
     let header = await fetchCSRF ();
     let DBKey  = await getDBKey(header);
     let price = await readPriceData(header,payload);
     let result = price.payload.d.SIMULATE_HEAD_TO_ITEM.results;
     return result;
   
};

module.exports = {
	readprice
};
 