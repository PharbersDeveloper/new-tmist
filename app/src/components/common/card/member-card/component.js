import Component from "@ember/component"
import { computed } from "@ember/object"
// import { A } from "@ember/array"
// import { isEmpty } from "@ember/utils"
import { later } from "@ember/runloop"
import GenerateCondition from "new-tmist/mixins/generate-condition"

export default Component.extend( GenerateCondition, {
	positionalParams: ["resource"],
	classNames: ["mb-4"],
	localClassNames: "resource",
	showContent: false,
	icon: computed( "showContent", function () {
		let showContent = this.get( "showContent" )

		return showContent ? "right" : "down"
	} ),
	// jobId: "a466abd2-9010-4e93-b946-a279ee8f01cf",

	// radarData: computed( "resourceId", function () {
	// 	let averageAbilityObject =
	// 		this.get( "averageAbility" ).get( "firstObject" ),
	// 		resourceId = this.get( "resourceId" ),
	// 		originalAbility = A( [] ),
	// 		resourceAbilities = this.get( "resourceAbilities" ),
	// 		reallyAbility = null

	// 	if ( isEmpty( resourceId ) ) {
	// 		return [
	// 			{
	// 				value: [0, 0, 0, 0, 0],
	// 				name: "代表个人能力"
	// 			},
	// 			{
	// 				value: averageAbilityObject,
	// 				name: "团队平均能力"
	// 			}
	// 		]
	// 	}
	// 	resourceAbilities.forEach( ele => {
	// 		if ( ele.get( "resource.id" ) === resourceId ) {
	// 			reallyAbility = ele
	// 		}
	// 	} )

	// 	if ( isEmpty( reallyAbility ) ) {
	// 		originalAbility = [0, 0, 0, 0, 0]
	// 	} else {

	// 		originalAbility.push( reallyAbility.get( "jobEnthusiasm" ) )
	// 		originalAbility.push( reallyAbility.get( "productKnowledge" ) )
	// 		originalAbility.push( reallyAbility.get( "behaviorValidity" ) )
	// 		originalAbility.push( reallyAbility.get( "regionalManagementAbility" ) )
	// 		originalAbility.push( reallyAbility.get( "salesAbility" ) )
	// 	}
	// 	return [
	// 		{
	// 			value: originalAbility,
	// 			name: "代表个人能力"
	// 		},
	// 		averageAbilityObject
	// 	]
	// }),
	init() {
		this._super( ...arguments )

		const that = this

		new Promise( function ( resolve ) {
			later( function () {
				let tmRadar = {
						id: "tmRadarContainer",
						height: 356,
						panels: [{
							name: "member ability",
							id: "tmRadaro1",
							tooltip: {
								show: true,
								trigger: "item"
							},
							color: ["#3172E0", "#979797"],
							legend: {
								show: true,
								x: "center",
								y: "bottom",
								orient: "vertical"
							},
							radar: {
								radius: "65%",
								name: {
									textStyle: {
										color: "#7A869A",
										borderRadius: 3,
										padding: [0, 0]
									}
								},
								indicator: [
									{ text: "产品知识", max: 10 },
									{ text: "工作积极性", max: 10 },
									{ text: "行为有效性", max: 10 },
									{ text: "区域管理能力", max: 10 },
									{ text: "销售知识", max: 10 }
								],
								splitNumber: 5, //default
								axisLine: {
									lineStyle: {
										color: "#DFE1E6"
									}
								},
								splitLine: {
									lineStyle: {
										color: "#DFE1E6"
									}
								},
								splitArea: {
									areaStyle: {
										color: ["#fff", "#fff"]
									}
								}
							},
							series: [{
								name: "",
								type: "radar",

								areaStyle: {
									opacity: 0.3
								},
								encode: {
									itemName: 0,
									value: 0
								}
							}]

						}]
					},
					tmRadarCondition = that.generateRepRadarCondition( "小兰",-3 )

				resolve( {
					tmRadar, tmRadarCondition
				} )
			}, 400 )
		} ).then( data => {
			this.set( "tmRadar", data.tmRadar )
			this.set( "tmRadarCondition", data.tmRadarCondition )
		} )
	},
	actions: {
		showContent() {
			this.toggleProperty( "showContent" )
		}
	}
} )
