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
	keyForRelationship( key ) {
		return key
	}
	// keyForRelationship(key, typeClass, method) {
	// 	if (method === "deserialize") {
	// 		if (key === "splitRequirements") { // 这尼玛是Ember的Bug
	// 			return key
	// 		}
	// 		else if (key === "quota") {
	// 			return key
	// 		} else if (typeClass === "belongsTo") {
	// 			return singularize( camelize( key ) )
	// 		} else if (typeClass === "hasMany") {
	// 			return pluralize( camelize( key ) )
	// 		} else {
	// 			return key
	// 		}
	// 	} else return key
	// }
} )