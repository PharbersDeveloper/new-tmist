import { helper } from "@ember/component/helper"

export function twoNumberPercent( params/*, hash*/ ) {
	if ( params.lenth < 2 ) {
		return null
	}
	let a = Number( params[0] ),
		b = Number( params[1] )

	if ( !isNaN( a ) && !isNaN( b ) ) {
		return ( a / b * 100 ).toFixed( 1 ) + "%"
	}
	return null
}

export default helper( twoNumberPercent )
