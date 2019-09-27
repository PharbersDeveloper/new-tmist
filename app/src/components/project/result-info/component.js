import Component from "@ember/component"
import { computed } from "@ember/object"
import { inject as service } from "@ember/service"
import { A } from "@ember/array"
import GenerateCondition from "new-tmist/mixins/generate-condition"
import GenerateChartConfig from "new-tmist/mixins/generate-chart-config"
// import { inject as service } from "@ember/service"

export default Component.extend( GenerateCondition, GenerateChartConfig, {
	// ossService: service( "service/oss" ),
	ajax: service(),
	// cookies: service(),
	exportService: service( "service/export-report" ),
	runtimeConfig: service( "service/runtime-config" ),
	positionalParams: ["project", "results", "evaluations", "reports", "summary", "hospitals", "resources", "products", "periods", "goRoundOver", "proposal"],
	curSelPeriod: null,
	roundOver: computed( function() {

		return this.runtimeConfig.roundHistory

		// let old = window.document.referrer

		// if ( old.indexOf( "round-over" ) !== -1 || old.indexOf( "history" ) !== -1 ) {
		// 	return true
		// } else {
		// 	return false
		// }
	} ),
	yoyFlag: computed( "yoy", function () {
		if ( this.yoy < 0 ) {
			return "priority-low"
		} else if ( this.yoy > 0 ) {
			return "priority-high"
		} else {
			return "priority-flat"
		}
	} ),
	momFlag: computed( "mom", function () {
		if ( this.mom < 0 ) {
			return "priority-low"
		} else if ( this.mom > 0 ) {
			return "priority-high"
		} else {
			return "priority-flat"
		}
	} ),
	treatmentAreaArr: A( [] ),
	salesReports: A( [] ),
	curSalesReports: null,
	init() {
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

		tmResultProductCircleCondition = this.generateResultProductCircleCondition( this.project.get( "proposal.case" ), currentPeriodPhase, this.buttonGroupValue )

		this.set( "tmResultProductCircleCondition", tmResultProductCircleCondition )
		this.set( "tmResultProductCircle", tmResultProductCircle )
		this.set( "salesReports", this.project.finals )
		this.set( "curSalesReports", this.project.finals.lastObject )
	},
	// didReceiveAttrs() {

	// 	this._super( ...arguments )
	// 	console.log( "didreceiveAttrs ================" )
	// 	this.set( "curSelPeriod", this.periods.lastObject )
	// 	let tmpArr = A( [] ),
	// 		sortPeriods = this.periods.sortBy( "phase" ),
	// 		currentPeriodPhase = sortPeriods.lastObject.get( "phase" ),
	// 		tmResultProductCircle = this.generateResultProductCircle( "circleproductcontainer1", "tmResultProducts" ),
	// 		tmResultProductCircleCondition = null

	// 	tmpArr = this.products.map( ele => ele.treatmentArea )

	// 	this.set( "treatmentAreaArr", Array.from( new Set( tmpArr ) ) )
	// 	this.set( "curTreatmentArea", this.treatmentAreaArr[0] )
	// 	this.set( "buttonGroupValue", this.treatmentAreaArr[0] )

	// 	tmResultProductCircleCondition = this.generateResultProductCircleCondition( this.project.get( "proposal.case" ), currentPeriodPhase, this.buttonGroupValue )

	// 	this.set( "tmResultProductCircleCondition", tmResultProductCircleCondition )
	// 	this.set( "tmResultProductCircle", tmResultProductCircle )
	// 	this.set( "salesReports", this.project.finals )
	// 	this.set( "curSalesReports", this.project.finals.lastObject )
	// },

	salesReport: computed( "project", function () {
		return this.project
	} ),

	actions: {
		exportReport() {
			this.exportService.exportReport( this.project, this.curSelPeriod.get( "phase" ) + 1 )
			// this.genDownloadUrl()
		},
		toReport() {
			this.transitionToReport()
		},
		toRoundOver() {
			history.go( -1 )
		},
		toIndex() {
			window.location = "/"
		},
		changeProductArea( value ) {
			this.set( "curTreatmentArea", value )
			// this.set( "buttonGroupValue", value )
			// let sortPeriods = this.periods.sortBy( "phase" ),
			let	currentPeriodPhase = this.curSelPeriod.get( "phase" ),
				tmResultProductCircleCondition = this.generateResultProductCircleCondition( this.project.get( "proposal.case" ), currentPeriodPhase, value )

			this.set( "tmResultProductCircleCondition", tmResultProductCircleCondition )

		},
		selPeriod( item ) {
			this.set( "curSelPeriod", item )
			this.set( "curSalesReports", this.project.finals.objectAt( item.phase ) )

			this.get( "ajax" ).request( "http://pharbers.com:9202/v1.0/CALC/yoy", {
				method: "GET",
				data: JSON.stringify( {
					"model": "tmrs_new",
					"query": {
						"proposal_id": this.proposal.get( "id" ),
						"project_id": this.project.get( "id" ),
						"phase": this.curSelPeriod.phase
					}
				}
				),
				dataType: "json"
			} ).then( res => {
				this.set( "yoy", res )
			} )

			this.get( "ajax" ).request( "http://pharbers.com:9202/v1.0/CALC/mom", {
				method: "GET",
				data: JSON.stringify( {
					"model": "tmrs_new",
					"query": {
						"proposal_id": this.proposal.get( "id" ),
						"project_id": this.project.get( "id" ),
						"phase": this.curSelPeriod.phase
					}
				}
				),
				dataType: "json"
			} ).then( res => {
				this.set( "mom", res )
			} )
			// 修改 我司产品份额 图表
			let curTreatmentArea = this.curTreatmentArea,
				tmResultProductCircleCondition = this.generateResultProductCircleCondition( this.project.get( "proposal.case" ), item.phase, curTreatmentArea )

			this.set( "tmResultProductCircleCondition", tmResultProductCircleCondition )
		}
	}
} )
