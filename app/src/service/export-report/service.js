import Service from "@ember/service"
import { inject as service } from "@ember/service"

export default Service.extend( {
	ossService: service( "service/oss" ),
	ajax: service(),
	cookies: service(),
	downloadURI( urlName ) {
		window.console.log( urlName )
		fetch( urlName.url )
			.then( response => {
				if ( response.status === 200 ) {
					return response.blob()
				}
				throw new Error( `status: ${response.status}` )
			} )
			.then( blob => {
				var link = document.createElement( "a" )

				link.download = urlName.name
				// var blob = new Blob([response]);
				link.href = URL.createObjectURL( blob )
				// link.href = url;
				document.body.appendChild( link )
				link.click()
				document.body.removeChild( link )
				// delete link;

				window.console.log( "success" )
			} )
			.catch( error => {
				window.console.log( "failed. cause:", error )
			} )
	},
	genDownloadUrl( project, phase ,isReport ) {
		let reqUrl = "",
			fileName = ""

		if ( isReport ) {
			reqUrl = `/export/${project.get( "id" )}/phase/${phase}`
			fileName = "历史销售报告"
		} else {
			reqUrl = `/exportInput/${project.get( "id" )}/phase/${phase}`
			fileName = "数据输入报告"
		}
		this.get( "ajax" ).request( reqUrl, {
			headers: {
				"dataType": "json",
				"Content-Type": "application/json",
				"Authorization": `Bearer ${this.cookies.read( "access_token" )}`
			}
		} ).then( res => {
			window.console.log( res )
			let { jobId } = res,
				downloadUrl = jobId + ".xlsx",
				client = this.ossService.get( "ossClient" ),
				url = client.signatureUrl( "tm-export/" + downloadUrl, { expires: 43200 } )

			window.console.log( res )
			window.console.log( "Success!" )
			this.downloadURI( { url: url, name: fileName } )
			// return { url: url, name: downloadUrl }
		} )
	},
	exportReport( project, phase ) {
		this.genDownloadUrl( project, phase ,true )
	},
	exportInput( project, phase ) {
		this.genDownloadUrl( project, phase ,false )
	}
} )
