 

async function processPayload(payload,runid){
	var obj=payload; 
 
	const res = Object.values(obj.reduce((acc, {MANDT,MATNR,NETPR,KMEIN,KNUMH,KONWS,KONMS,KOPOS,
                                               KPEIN,KRECH,KSTBM,KSTB,KZBZG, KSCHL,KBETR,STFKZ,TXPRF}) => {
								const {TYPES = []} = acc[MATNR] || {}; 
									acc[MATNR] = {MANDT,MATNR,NETPR,KMEIN,KNUMH,KONWS,KONMS,KOPOS,KPEIN,KRECH,KSTBM,KZBZG,STFKZ,TXPRF, TYPES: [...TYPES, {KSCHL,KBETR}]};
													return acc;
								}, Object.create(null)));
  

	const condtypes=res.map(({TYPES})=>TYPES.map(({KSCHL}) => KSCHL))[0];
 
	const string = res.map(({MANDT,MATNR,NETPR,KMEIN,KNUMH,KONWS,KONMS,KOPOS,KPEIN,KRECH,KSTBM,KZBZG,STFKZ,TXPRF, TYPES}) => {
    let len = TYPES.length;
    var no =Array.from(Array(len+1).keys()).map(i=>(String("0" + i).slice(-2))).splice(1, len)
    
    var arr = no.map(i=>'USR'+i);   
    const types = TYPES.map(({KBETR}) => KBETR).join(',');
    
    
    // const string = res.map(async({MANDT,MATNR,NETPR,KMEIN,KNUMH,KONWS,KONMS,KOPOS,KPEIN,KRECH,KSTBM,KZBZG,STFKZ,TXPRF, TYPES}) => {
    // const condtypes = (TYPES.map(item=>item.KSCHL));
    // const squote = "'" + condtypes.join("','") + "'"
    // const query = `SELECT USER_FIELD,COND_TYPE FROM USERFIELD_CONFIG WHERE COND_TYPE IN(`+squote+`)`;
    // const result = await runquery(query); 
    // const userfield = (result.map(item=>item.USER_FIELD));
    // const types = TYPES.map(({KBETR}) => KBETR).join(',');
    
    return `INSERT INTO D_ITEMS(MANDT,MATNR,VALUE,KMEIN,KNUMH,KONWS,KONMS,KOPOS,KPEIN,KRECH,KSTBM,KZBZG,STFKZ,TXPRF,DB_KEY,ROOT_KEY,${arr}) VALUES(${MANDT},${MATNR},${NETPR},'${KMEIN}','${KNUMH}','${KONWS}','${KONMS}',${KOPOS},${KPEIN},'${KRECH}',${KSTBM},'${KZBZG}','${STFKZ}','${TXPRF}',SYSUUID,{runid},${types})`
         }).join(';') ;
   return string;
};

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
        
              
  	
async function insertHead(input){
   
    let statement = `SELECT "seqrunid".nextval RUNID FROM DUMMY`;
    result =await runquery(statement);
    runid = result[0].RUNID;
	statement = `INSERT INTO D_HEAD(MANDT,DB_KEY,PARENT_KEY,LAUFI,LAUFD) VALUES(100,SYSUUID,SYSUUID,LPAD(${runid},6,'0'),TO_CHAR(CURRENT_DATE,'YYYYMMDD'))`;
	result =await runquery(statement); 
	 
    let results = await insertItem(input,runid);
    return results;
  };
async function insertItem(input,pkey){
 
	let statements = await  processPayload(input,pkey);
	
	let stmt= statements.split(';');
	console.log(stmt)
    stmt.forEach( async(query)=> {
	 try {
	 	   
            result =await runquery(query);
            
        } catch (e) {
            	console.log("Error - " +JSON.stringify(e));
				return null;
        }
 	});
 	return 'Success';
      
  };
 
async function insert(input) { 
	let item=await insertHead(input);

	return item;
}
 
module.exports = {
	insert
};