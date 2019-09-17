import { helper } from "@ember/component/helper"

export function calcQuotaAchv( params/*, hash*/ ) {
	if ( params.length === 0 ) {
		return 0
	}

	let arr = params[0],
		allQuota = 0,
		allSales = 0

	arr.forEach( a => {
		allQuota += a.quota
		allSales += a.sales
	} )

	return ( allSales * 100 / allQuota ).toFixed( 2 )

}

export default helper( calcQuotaAchv )
