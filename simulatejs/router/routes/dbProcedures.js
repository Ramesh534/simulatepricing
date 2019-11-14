async function insertBasketMaterials(req,input){
	       console.log('Enter')
	   var client = req.db;
	   var hdbext = require("@sap/hdbext");
		var partnerRole = req.params.a;
		var inputParams = "";
		if (typeof partnerRole === "undefined" || partnerRole === null) {
			inputParams = {};
		} else {
			inputParams = {
				a: partnerRole
			};
		}
		 console.log('Input' +inputparams)
		//(cleint, Schema, Procedure, callback)
		hdbext.loadProcedure(client, null, "test", (err, sp) => {
			if (err) {
				console.log("Error - " +JSON.stringify(err));
				return null;
			}
			//(Input Parameters, callback(errors, Output Scalar Parameters, [Output Table Parameters])
			sp(inputParams, (err, parameters, results) => {
				if (err) {
					console.log("Error - " +JSON.stringify(err));
			   	    return null;
				}
				 console.log('inputparams'+inputparams)
				var result = JSON.stringify({
					b: results
				}); 
				console.log(result)
			});
		});
		return result;
}
module.exports = {
	insertBasketMaterials
};
  