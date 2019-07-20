import DS from "ember-data"
import { dasherize, camelize } from "@ember/string"
import { singularize, pluralize } from "ember-inflector"

export default DS.JSONAPISerializer.extend( {
	modelNameFromPayloadKey( key ) {
		const perfix = "model/"
		return perfix + singularize( dasherize( key ) )
	},
	payloadKeyFromModelName( modelName ) {
		const key = modelName.replace( ".", "/" ).split( "/" )[1]
		return pluralize( camelize( key ) )
	},
	keyForAttribute( key ) {
		return key
	},
	modelNameFromPayloadType(payloadType) {
		debugger
		return payloadType
	},
	keyForRelationship(key, typeClass, method) {
		if (method === "deserialize") {
			if (key === "quota") {
				return key
			} else if (typeClass === "belongsTo") {
				return singularize( camelize( key ) )
			} else if (typeClass === "hasMany") {
				return pluralize( camelize( key ) )
			} else {
				return key
			}
		} else return key
	}
} )