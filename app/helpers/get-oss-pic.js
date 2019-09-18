import { helper } from "@ember/component/helper"

export function getOssPic( params/*, hash*/ ) {
	let img = params[0],
		client = params[1].get( "ossClient" )

	if ( img ) {
		let url = client.signatureUrl( "tm-resources/" + img )

		window.console.log( img )
		window.console.log( url )
		return url
	} else {
		return ""
	}
}

export default helper( getOssPic )
