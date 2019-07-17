import DS from "ember-data"
import { computed } from "@ember/object"
import { dasherize } from "@ember/string"
import { pluralize } from "ember-inflector"
import { inject as service } from "@ember/service"
// import ENV from "new-tmist/config/environment"
// import { camelize } from "@ember/string"
// import { pluralize } from "ember-inflector"

export default DS.JSONAPIAdapter.extend( {
	// namespace: ENV.API.Version,
	cookies: service(),
	pathForType( type ) {
		var res = type.split( "/" )
		let newType = pluralize( dasherize( res[res.length - 1] ) )

		return newType
	},
	headers: computed( function () {
		let cookies = this.get( "cookies" )

		return {
			"dataType": "json",
			"contentType": "application/json",
			"Content-Type": "application/json",
			"Authorization": `Bearer ${cookies.read( "access_token" )}`
		}
	} )

	// urlForQuery ( query , modelName) {
	// 	debugger
	// 	let baseUrl = this.buildURL(modelName);
	// 	return `${baseUrl}?filter=${query.filter}`
	// },
	// urlForQueryRecord({ slug }, modelName) {
	// 	debugger
	// 	let baseUrl = this.buildURL();
	// 	return `${baseUrl}/${slug}`;
	// }
} )
