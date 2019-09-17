import { helper } from "@ember/component/helper"

export function calcTotalSales( params/*, hash*/ ) {
	if ( params.length === 0 ) {
		return 0
	}

	let arr = params[0],
		all = 0

	if ( arr instanceof Array ) {
		arr.forEach( a => {
			all += a.sales
		} )
		return all
	} else {
		return 0
	}

}

export default helper( calcTotalSales )
