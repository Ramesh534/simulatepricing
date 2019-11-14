"use strict";

module.exports = (app, server) => {
	  // app.use("/node", require("./routes/connect")(server));   
	 	app.use("/node", require("./routes/simulatepricing")(server));  
}