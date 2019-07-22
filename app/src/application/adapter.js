import DS from "ember-data"
import { computed } from "@ember/object"
import { dasherize } from "@ember/string"
import { pluralize } from "ember-inflector"
import { inject as service } from "@ember/service"
import Ember from "ember"

export default DS.JSONAPIAdapter.extend( {
	// namespace: ENV.API.Version,
	cookies: service(),
	pathForType( type ) {
		Ember.Logger.info( `query with model ${type}` )
		const res = type.split( "/" )
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
