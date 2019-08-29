import { isEmpty } from "@ember/utils"

export function number2percent( value,fixed = 0 ) {
	if ( isEmpty( value ) ) {
		return value
	}
	return ( Number( value ) * 100 ).toFixed( fixed )
}
export function number2thousand( number,fixed = 0 ) {
	let result = "",
		fixedNumber = fixed,
		value = number

	if ( isEmpty( value ) ) {
		return value
	}
	if ( !isEmpty( fixedNumber ) && !isEmpty( value ) ) {
		value = Number( value ).toFixed( fixedNumber )
	}
	result = value.toString().indexOf( "." ) !== -1 ? value.toLocaleString() : value.toString().replace( /(\d)(?=(?:\d{3})+$)/g, "$1," )

	return result
}