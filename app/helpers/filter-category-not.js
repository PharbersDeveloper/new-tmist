import { helper } from "@ember/component/helper"
import Ember from "ember"

export function fileterCategoryNot( params/*, hash*/ ) {

	if ( params.length !== 2 ) {
		Ember.Logger.error( `error in helper filter category with params ${params}` )
		return params
	}

	const lst = params[0],
		cat = params[1]

	return lst.filter( x => x.get( "category" ) !== cat )
}

export default helper( fileterCategoryNot )
