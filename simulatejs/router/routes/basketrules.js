const fetch = require("node-fetch"),
	  xsenv = require("@sap/xsenv"),
   	  express = require("express"),
	  app = express();

const {	URLSearchParams} = require('url');
const uaa_service = xsenv.getServices({	uaa: {	tag: "xsuaa"}}).uaa;
const dest_service = xsenv.getServices({destination: {tag: "destination"}}).destination;

let sDestCredentials = dest_service.clientid + ':' + dest_service.clientsecret;
let destination_url = '';
let conn_access_token = '';

async function makeRequest(url, config) {
	try {
		const response = await fetch(url, config);
		return {
			status: response.status,
			payload: await response.json()
		};
	} catch (error) {
		console.log(error);
		return {
			status: null,
			payload: error.message
		};
	}
}

async function getAccessToken(clientid, crendentials) {
	const data = new URLSearchParams();
	data.append("client_id", clientid);
	data.append("grant_type", "client_credentials");
	const config = {
		method: "POST",
		headers: {
			Authorization: "Basic " + Buffer.from(crendentials).toString("base64")
		},
		body: data
	};
	const url = uaa_service.url + "/oauth/token";
	let response = await makeRequest(url, config);
	if (response.status === 200 && response.status < 300) {
		return response.payload.access_token;
	} else {
		console.log("Error - " + response.payload);
		return null;
	}
}
// Access token for Destination service
async function getDestinationToken() {
	let access_token = await getAccessToken(dest_service.clientid, sDestCredentials)
	return access_token

}

// Get Destination credentials for the MG4
async function getDestinationConfig() {
	let access_token = await getDestinationToken();
	if (access_token != null) {

		const url = dest_service.uri + '/destination-configuration/v1/destinations/' + 'Business_Rules_Dev'
		const config = {
			headers: {
				'Authorization': 'Bearer ' + access_token
			}
		}

		let response = await makeRequest(url, config)
		if (response.status >= 200 && response.status < 300) {
			destination_url = response.payload.destinationConfiguration.URL
			let credentials = response.payload.destinationConfiguration.clientId + ':' + response.payload.destinationConfiguration.clientSecret;
			conn_access_token = await getAccessToken(response.payload.destinationConfiguration.clientId, credentials)
			return true

		} else {
			console.log("Error in fetching Destination - " + response.payload)
			return false

		}

	} else {
		console.log("Destination Access Token not found. Call aborted")
	}

}


async function readMaterials(input) {


	let url = await getDestinationConfig();
	url = destination_url + '/rules-service/rest/v1/rule-services/java/csrBasket/basketService';
	
	const payload = {};
	payload.__type__       = 'inputBasketData';
    payload.BasketNumber   = input.BasketNumber;
    payload.VKORG		   = input.VKORG;
    payload.VTWEG          = input.VTWEG;
    payload.SPART          = input.SPART;
    payload.STATE          = input.STATE;
    
	const config = {
		method: "POST",

		headers: {
			Authorization: "Bearer " + conn_access_token,
			"content-type": "application/json",
			Accept: "application/json",
			"Accept-Charset": "utf-8"
		},

		body: JSON.stringify(payload)
	}; 
	let response = await makeRequest(url, config);
	let data = response.payload;
	
	let materials = data.map(item => item.MATNR);

	return materials;
}

module.exports = {
	readMaterials
};