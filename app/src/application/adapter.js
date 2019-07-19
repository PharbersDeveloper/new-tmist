import DS from "ember-data"
import { computed } from "@ember/object"
import { dasherize } from "@ember/string"
import { pluralize } from "ember-inflector"
import { inject as service } from "@ember/service"

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
			"Content-Type": "application/vnd.api+json",
			"Authorization": `Bearer ${cookies.read( "access_token" )}`
		}
	} )
} )
