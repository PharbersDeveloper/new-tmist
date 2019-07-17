import DS from "ember-data"
import { dasherize } from "@ember/string"
import { singularize } from "ember-inflector"

export default DS.JSONAPISerializer.extend( {
	modelNameFromPayloadKey( key ) {
		const perfix = "model/"

		return perfix + singularize( dasherize( key ) )
	},
	keyForAttribute( key ) {
		return key
	}
} )