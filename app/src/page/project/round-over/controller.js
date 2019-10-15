import Controller from "@ember/controller"
import { computed } from "@ember/object"
import { inject as service } from "@ember/service"

export default Controller.extend( {
	// ossService: service( "service/oss" ),
	// ajax: service(),
	// cookies: service(),
	roundOver: true,
	noNavButton: true,
	runtimeConfig: service( "service/runtime-config" ),
	exportService: service( "service/export-report" ),
	tmSalesAchv: computed( "model.tmReports", function() {
		return this.model.tmReports.get( "lastObject.sales" ) / this.model.tmReports.get( "lastObject.salesQuota" )
	} ),
	// endTime: computed( "this.model.project", function () {
	// 	let date = new Date( this.model.project.endTime ),
	// 		y = date.getFullYear() + "-",
	// 		m = ( date.getMonth() + 1 < 10 ? "0" + ( date.getMonth() + 1 ) : date.getMonth() + 1 ) + "-",
	// 		d = date.getDate() + " ",
	// 		h = ( date.getHours() + 1 < 10 ? "0" + date.getHours() : date.getHours() ) + ":",
	// 		mins = date.getMinutes() + 1 < 10 ? "0" + date.getMinutes() : date.getMinutes(),
	// 		time = y + m + d + h + mins

	// 	return time
	// } ),
	// spendTime: computed( "this.model.project", function () {
	// 	if ( this.model.project.endTime < this.model.project.startTime ) {
	// 		return 0
	// 	}

	// 	let date = new Date( this.model.project.endTime - this.model.project.startTime ),
	// 		h = date.getHours(),
	// 		m = date.getMinutes()

	// 	if ( h ) {

	// 		return h + "时" + m + "分"
	// 	} else {
	// 		return m + "分"
	// 	}
	// } ),
	// downloadURI( urlName ) {
	// 	window.console.log( urlName )
	// 	fetch( urlName.url )
	// 		.then( response => {
	// 			if ( response.status === 200 ) {
	// 				return response.blob()
	// 			}
	// 			throw new Error( `status: ${response.status}` )
	// 		} )
	// 		.then( blob => {
	// 			var link = document.createElement( "a" )

	// 			link.download = urlName.name
	// 			// var blob = new Blob([response]);
	// 			link.href = URL.createObjectURL( blob )
	// 			// link.href = url;
	// 			document.body.appendChild( link )
	// 			link.click()
	// 			document.body.removeChild( link )
	// 			// delete link;

	// 			window.console.log( "success" )
	// 		} )
	// 		.catch( error => {
	// 			window.console.log( "failed. cause:", error )
	// 		} )
	// },
	// genDownloadUrl() {
	// 	this.get( "ajax" ).request( `/export/${this.model.project.get( "id" )}/phase/${this.model.project.get( "periods" ).length}`, {
	// 		headers: {
	// 			"dataType": "json",
	// 			"Content-Type": "application/json",
	// 			"Authorization": `Bearer ${this.cookies.read( "access_token" )}`
	// 		}
	// 	} ).then( res => {
	// 		window.console.log( res )
	// 		let { jobId } = res,
	// 			downloadUrl = jobId + ".xlsx",
	// 			client = this.ossService.get( "ossClient" ),
	// 			url = client.signatureUrl( "tm-export/" + downloadUrl, { expires: 43200 } )

	// 		window.console.log( res )
	// 		window.console.log( "Success!" )
	// 		this.downloadURI( { url: url, name: "历史销售报告" } )
	// 		// return { url: url, name: downloadUrl }
	// 	} )
	// },
	actions: {
		exportReport() {
			// this.genDownloadUrl()
			this.exportService.exportReport( this.model.project, this.model.project.get( "periods" ).length )
		},
		exportInput() {
			this.exportService.exportInput( this.model.project, this.model.project.get( "periods" ).length )
		},
		toIndex() {
			if ( localStorage.getItem( "isUcb" ) === "1" ) {
				window.location = "/ucbprepare"
			} else {
				window.location = "/"
			}
			// this.transitionToRoute( "/" )
		},
		toReport() {
			// window.localStorage.setItem( "roundHistory", true )
			this.runtimeConfig.setRoundHistoryTrue()
			this.transitionToRoute( "page.project.result", this.model.project.id, { queryParams: { state: "history" }} )
			// window.location = "/project/" + this.model.project.id + "/result"
		},
		toDecisionReview() {
			this.transitionToRoute( "page.project.review", this.model.project.id )
		},
		showTestPerformance() {
			this.set( "testPerformance", true )
		}
	}
} )
