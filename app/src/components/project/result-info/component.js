import Component from "@ember/component"
import { computed } from "@ember/object"
import { A } from "@ember/array"

export default Component.extend( {
	positionalParams: ["project", "results", "evaluations", "reports", "summary", "hospitals", "resources", "products", "periods"],
	curSelPeriod: null,
	treatmentAreaArr: A( [] ),
	didReceiveAttrs() {
		this._super( ...arguments )
		this.set( "curSelPeriod", this.periods.lastObject )
		let tmpArr = A( [] )

		tmpArr = this.products.map( ele=>ele.treatmentArea )

		this.treatmentAreaArr = Array.from( new Set( tmpArr ) )
		this.set( "curTreatmentArea", this.treatmentAreaArr[0] )
	},
	// overallInfo: computed(results function () {

	// } ),
	// overallInfo: null,
	// init() {
	// this._super( ...arguments )
	// new Promise( function ( resolve ) {
	// 	later( function () {
	// 		let tmResultProductCircle = {
	// 				id: "circleproductcontainer1",
	// 				height: 319,
	// 				panels: [
	// 					{
	// 						name: "tmResultProducts",
	// 						id: "tmResultProducts",
	// 						color: ["#73ABFF", "#FFC400", "#57D9A3"],
	// 						tooltip: {
	// 							show: true,
	// 							trigger: "item"
	// 						},
	// 						legend: {
	// 							show: false
	// 						},
	// 						series: [{
	// 							name: "",
	// 							type: "pie",
	// 							radius: ["70", "100"],
	// 							avoidLabelOverlap: false,
	// 							hoverOffset: 3,
	// 							labelLine: {
	// 								normal: {
	// 									show: true
	// 								}
	// 							},
	// 							label: {
	// 								color: "#7A869A",
	// 								formatter: "{b}  {d}%"
	// 							}

	// 						}]
	// 					}
	// 				]
	// 			},
	// 			tmResultProductCircleCondition = [{
	// 				data: {
	// 					"_source": [
	// 						"product",
	// 						"sales",
	// 						"date",
	// 						"salesRate"
	// 					],
	// 					"query": {
	// 						"bool": {
	// 							"must": [
	// 								{
	// 									"match": {
	// 										"date": "2018Q1"
	// 									}
	// 								},
	// 								{
	// 									"match": {
	// 										"rep": "all"
	// 									}
	// 								},
	// 								{
	// 									"match": {
	// 										"region": "all"
	// 									}
	// 								},
	// 								{
	// 									"match": {
	// 										"hosp_level": "all"
	// 									}
	// 								},
	// 								{
	// 									"match": {
	// 										"hosp_name": "all"
	// 									}
	// 								}
	// 							],
	// 							"must_not": [
	// 								{
	// 									"match": {
	// 										"product": "all"
	// 									}
	// 								}
	// 							]
	// 						}
	// 					}
	// 				}
	// 			}]

	// 		resolve( {
	// 			tmResultProductCircle, tmResultProductCircleCondition
	// 		} )

	// 	}, 400 )
	// } ).then( data => {
	// 	this.set( "tmResultProductCircleCondition", data.tmResultProductCircleCondition )
	// 	this.set( "tmResultProductCircle", data.tmResultProductCircle )
	// } )
	// },
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
	actions: {
		toReport() {
			this.transitionToReport()
		},
		toIndex() {
			window.location = "/"
		}
	}
} )
