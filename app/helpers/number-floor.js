import { helper } from "@ember/component/helper"
import { isEmpty } from "@ember/utils"

export function numberFloor( params/*, hash*/ ) {
    let number = typeof params === "object" ? params[0] : params,
		result = "",
		fixedNumber = Math.floor( params[1] )

	if ( isEmpty( number ) ) {
		return number
	}
	if ( !isEmpty( fixedNumber ) && !isEmpty( number ) ) {
		number = Number( number ).toFixed( fixedNumber )
	}
	result = number.toString().indexOf( "." ) !== -1 ? number.toLocaleString() : number.toString().replace( /(\d)(?=(?:\d{3})+$)/g, "$1," )

	return result
}

export default helper( numberFloor )
