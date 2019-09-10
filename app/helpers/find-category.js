import { helper } from "@ember/component/helper"

export function findCategory( params/*, hash*/ ) {
	if ( params.length !== 2 ) {
		window.console.error( `error in helper filter category with params ${params}` )
		return params
	}

	const lst = params[0],
		cat = params[1]

	return lst.find( x => x.get( "category" ) === cat )
}

export default helper( findCategory )
