import { helper } from "@ember/component/helper"
import { isEmpty } from "@ember/utils"

export function formatDateQ( params/*, hash*/ ) {

	if ( isEmpty( params ) || isEmpty( params[0] ) ) {
		return params
	}
	let date = params[0],
		year = date.getFullYear(),
		month = date.getMonth(),
		season = ""

	switch ( true ) {
	case month < 3:
		season = "Q1"
		break
	case month < 6:
		season = "Q2"
		break
	case month < 9:
		season = "Q3"
		break
	default:
		season = "Q4"
		break
	}
	return `${year}${season}`
}

export default helper( formatDateQ )
