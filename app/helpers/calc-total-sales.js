import { helper } from "@ember/component/helper"

export function calcTotalSales( params/*, hash*/ ) {

	if ( params.length === 0 ) {
		return 0
	}

	let arr = params[0],
		all = 0

	// console.log( arr )
	// arr.then( data=> {
	// 	console.log( "||||||||" )
	// 	console.log( data )
	// 	arr.forEach( a => {
	// 		all += a.sales
	// 	} )
	// 	console.log( all )
	// 	return all
	// } )
	if ( arr.length !== 0 ) {
		arr.forEach( a => {
			all += a.sales
		} )
		return all.toFixed( 0 ).toString().replace( /(\d)(?=(?:\d{3})+$)/g, "$1," )
	} else {
		return 0
	}

}

export default helper( calcTotalSales )
