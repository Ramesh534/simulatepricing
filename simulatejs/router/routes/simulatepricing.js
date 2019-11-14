let materials = require('./basketrules'),
	price = require('./readprice'),
	db = require('./dbInsert'),
	dbProc = require('./dbProcedures'),
    bodyParser = require('body-parser'),
    express = require('express'),
    app = express.Router() 
    payload = {},matarr=[], matnrs={};    
    app.use(bodyParser.json());


async function runquery(query){
	
      	 try {
            const dbClass = require("./dbPromises");
            let client = await dbClass.createConnection();
            let db = new dbClass(client);  
            const statement = await db.preparePromisified(query);
            const results = await db.statementExecPromisified(statement, []);
            return results; 
            
        } catch (e) {
            	console.log("Error - " +JSON.stringify(e));
				return null;
        }
        
 	} 
       
async function basketMaterials (input)  {
//	let ml		  =  await materials.readMaterials(input);
  let result= await	dbProc.insertBasketMaterials(req,'Mani');
	// console.log(ml);
	return result;
	
	// ml.forEach(function(value){
	//       	    matnrs={}; 
	       	    
	// 			matnrs.ROOT_KEY=''; 
	// 	        matnrs.MATNR= value;
	// 	        matnrs.MATKL= '';
	// 	        matnrs.VRKME= '';
	// 	        matnrs.MGAME= '';

	// 			matarr.push(matnrs);
				
	// 		});
			
	// let statement = ` `;  
	// let result    =  await runquery(statement);   
	
	//     payload.DB_KEY	    =result[0].DB_KEY; 
	// 	payload.PARENT_KEY  =result[0].PARENT_KEY;
	// 	payload.LAUFI	    =result[0].LAUFI;
	// 	payload.LAUFD	    =result[0].LAUFD;
	// 	payload.KUNNR		=input.KUNNR;
	// 	payload.VKORG		=input.VKORG;
	// 	payload.VTWEG		=input.VTWEG;
	// 	payload.SPART		=input.SPART;
	// 	payload.WERKS		=input.WERKS||'';
	// 	payload.PRSDT		='';
	// 	payload.KALSM		='';
	// 	payload.AUART		='';
	// 	payload.PSTYV		='';
	// 	payload.RATECARD	=input.RATECARD;
	// 	payload.WAERK		='';
	// 	payload.KUNWE		='';
 //   payload.SIMULATE_HEAD_TO_ITEM=matarr;
//	return(ml);
} ;

module.exports = function() {
app.post("/simulate", async (req, res) => {
 
 //    let payload = await basketMaterials (req.body);
 //  let pricedata = await price.readprice(payload); 
//   let insertprice = await db.insert(pricedata);   
//   res.send(pricedata)
     res.send(payload);
}
);

return app;
}