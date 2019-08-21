import Component from "@ember/component"
import { computed } from "@ember/object"
import { inject as service } from "@ember/service"
import { A } from "@ember/array"
import GenerateCondition from "new-tmist/mixins/generate-condition"
import GenerateChartConfig from "new-tmist/mixins/generate-chart-config"
// import { inject as service } from "@ember/service"

export default Component.extend( GenerateCondition, GenerateChartConfig, {
	ossService: service( "service/oss" ),
	ajax: service(),
	cookies: service(),
	positionalParams: ["project", "results", "evaluations", "reports", "summary", "hospitals", "resources", "products", "periods"],
	curSelPeriod: null,
	treatmentAreaArr: A( [] ),
	salesReports: A( [] ),
	curSalesReports :null,
	didReceiveAttrs() {
		this._super( ...arguments )
		this.set( "curSelPeriod", this.periods.lastObject )
		let tmpArr = A( [] ),
			sortPeriods = this.periods.sortBy( "phase" ),
			currentPeriodPhase = sortPeriods.lastObject.get( "phase" ),
			tmResultProductCircle = this.generateResultProductCircle( "circleproductcontainer1", "tmResultProducts" ),
			tmResultProductCircleCondition = null

		tmpArr = this.products.map( ele => ele.treatmentArea )

		this.set( "treatmentAreaArr", Array.from( new Set( tmpArr ) ) )
		this.set( "curTreatmentArea", this.treatmentAreaArr[0] )
		this.set( "buttonGroupValue", this.treatmentAreaArr[0] )

		tmResultProductCircleCondition = this.generateResultProductCircleCondition( this.project.get( "proposal.case" ), currentPeriodPhase,this.buttonGroupValue )

		this.set( "tmResultProductCircleCondition", tmResultProductCircleCondition )
		this.set( "tmResultProductCircle", tmResultProductCircle )
		this.set( "salesReports", this.project.finals )
		this.set( "curSalesReports", this.project.finals.lastObject )

		console.log( this.salesReports )
		console.log( this.curSalesReports )
	},
	// overallInfo: computed(results function () {

	// } ),
	// overallInfo: null,

	// didReceiveAttrs() {
	// this._super( ...arguments )
	// let tmpOverall = {
	// 	abilityLevel: "",
	// 	abilityDes: "",
	// 	abilityImg: "",
	// 	awardLevel: "",
	// 	awardDes: "",
	// 	awardImg: ""
	// }

	// this.results.map( ele => {
	// 	this.evaluations.map( elem => {
	// 		if ( ele.category === "Overall" && elem.category === "Overall" ) {
	// 			if ( ele.get( "awardLevel.rank" ) === elem.level ) {
	// 				tmpOverall.abilityLevel = ele.get( "awardLevel.rank" )
	// 				tmpOverall.abilityDes = elem.abilityDescription
	// 				tmpOverall.abilityImg = ele.abilityLevel.get( "rankImg" )
	// 			}
	// 			if ( ele.get( "awardLevel.rank" ) === elem.level ) {
	// 				tmpOverall.awardLevel = ele.get( "awardLevel.rank" )
	// 				tmpOverall.awardDes = elem.awardDescription
	// 				tmpOverall.awardImg = ele.abilityLevel.get( "awardImg" )
	// 			}
	// 		}
	// 	} )
	// } )

	// this.set( "overallInfo", tmpOverall )
	// },
	salesReport: computed( "project", function () {
		return this.project
	} ),
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
	genDownloadUrl() {

		this.get( "ajax" ).request( `/export/${this.project.get( "id" )}/phase/${this.curSelPeriod.get( "phase" )}`, {
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
			this.downloadURI( { url: url, name: "历史销售报告" } )
			// return { url: url, name: downloadUrl }
		} )
	},
	actions: {
		exportReport() {

			this.genDownloadUrl()
		},
		toReport() {
			this.transitionToReport()
		},
		toIndex() {
			window.location = "/"
		},
		changeProductArea( value ) {
			this.set( "curTreatmentArea", value )
			// this.set( "buttonGroupValue", value )
			let sortPeriods = this.periods.sortBy( "phase" ),
				currentPeriodPhase = sortPeriods.lastObject.get( "phase" ),
				tmResultProductCircleCondition = this.generateResultProductCircleCondition( this.project.get( "proposal.case" ), currentPeriodPhase,value )

			this.set( "tmResultProductCircleCondition", tmResultProductCircleCondition )

		},
		selPeriod( item ) {
			this.set( "curSelPeriod", item )
			this.set( "curSalesReports", this.project.finals.objectAt( item.phase ) )
		}
	}
} )
