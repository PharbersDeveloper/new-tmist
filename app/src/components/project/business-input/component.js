import Component from "@ember/component"
import { computed } from "@ember/object"

export default Component.extend( {
	positionalParams: ["project", "period", "hospitals", "products", "resources", "preset", "answers", "validation"],
	currentName: computed( "products", function() {
		const cur = this.get( "products" ).find( x => x.productType === 0 )

		return cur ? cur.name : ""
	} ),
	currentBudget: 0,
	currentSalesTarget: 0,
	currentMeetingPlaces: 0,
	inputTypeNumber( input ) {
		let cur = Number( input )

		window.console.log( input )
		if ( cur === -1 ) {
			cur = 0
		}
		if ( isNaN( cur ) ) {
			window.console.log( cur )
			this.set( "warning", {
				open: true,
				title: "非法值警告",
				detail: "请输入数字。"
			} )
			return false
		}
		return cur
	},
	inputMaxValue( all, value, type ) {
		let sum = 0

		this.get( "answers" ).forEach( answer => {
			let curValue = answer.get( value )

			if ( type === "Number" ) {
				let checkValue = this.inputTypeNumber( curValue )

				if ( checkValue ) {
					sum += checkValue
					if ( all < sum ) {
						this.set( "warning", {
							open: true,
							title: "总预算超额",
							detail: "总预算设定已超过限制，请重新分配。"
						} )
					}
				}
			}
		} )

		if ( value === "budget" ) {
			this.set( "currentBudget", sum )
		} else if ( value === "salesTarget" ) {
			this.set( "currentSalesTarget", sum )
		} else if ( value === "meetingPlaces" ) {
			this.set( "currentMeetingPlaces", sum )
		}
	},
	actions: {
		budgetValidationHandle() {
			// get from validation

			let maxValueRules = this.validation["maxValue"].split( "*" ),
				typeRules = this.validation["inputType"].split( "*" ),
				businessMaxBudgetRule = "",
				businessInputTypeRule = ""

			maxValueRules.forEach( e => {
				if ( e.startsWith( "businessMaxBudget" ) ) {
					businessMaxBudgetRule = e
				}
			} )
			typeRules.forEach( e => {
				if ( e.startsWith( "businessBudgetInputType" ) ) {
					businessInputTypeRule = e
				}
			} )
			// 1 第一周期
			let allBudget = Number( businessMaxBudgetRule.split( "#" )[1] ),
				inputType = String( businessInputTypeRule.split( "#" )[1] )


			// let allBudget = 100000, inputType = "Number"

			this.inputMaxValue( allBudget, "budget", inputType )
		},
		salesTargetValidationHandle() {
			let maxValueRules = this.validation["maxValue"].split( "*" ),
				typeRules = this.validation["inputType"].split( "*" ),
				businessMaxSalesTargetRule = "",
				businessInputTypeRule = ""

			maxValueRules.forEach( e => {
				if ( e.startsWith( "businessMaxSalesTarget" ) ) {
					businessMaxSalesTargetRule = e
				}
			} )
			typeRules.forEach( e => {
				if ( e.startsWith( "businessSalesTargetInputType" ) ) {
					businessInputTypeRule = e
				}
			} )
			// 1 第一周期
			let allSalesTarget = Number( businessMaxSalesTargetRule.split( "#" )[1] ),
				inputType = String( businessInputTypeRule.split( "#" )[1] )

			window.console.log( businessMaxSalesTargetRule )
			window.console.log( inputType )

			// let allSalesTarget = 100000, inputType = "Number"

			this.inputMaxValue( allSalesTarget, "salesTarget", inputType )
		},
		meetingPlacesValidationHandle() {
			let maxValueRules = this.validation["maxValue"].split( "*" ),
				typeRules = this.validation["inputType"].split( "*" ),
				businessMaxMeetingPlacesRule = "",
				businessInputTypeRule = ""

			maxValueRules.forEach( e => {
				if ( e.startsWith( "businessMaxMeetingPlaces" ) ) {
					businessMaxMeetingPlacesRule = e
				}
			} )
			typeRules.forEach( e => {
				if ( e.startsWith( "businessMeetingPlacesInputType" ) ) {
					businessInputTypeRule = e
				}
			} )
			// 1 第一周期
			let allMeetingPlaces = Number( businessMaxMeetingPlacesRule.split( "#" )[1] ),
				inputType = String( businessInputTypeRule.split( "#" )[1] )

			window.console.log( businessMaxMeetingPlacesRule )
			window.console.log( allMeetingPlaces )

			// let allMeetingPlaces = 6, inputType = "Number"

			// this.get( "answers" ).forEach( answer => {
			// 	let curMeetingPlaces = answer.get( "meetingPlaces" )

			// 	if ( inputType === "Number" ) {
			// 		let checkMeetingPlaces = this.inputTypeNumber( curMeetingPlaces )

			// 		if ( checkMeetingPlaces ) {
			// 			allMeetingPlaces -= checkMeetingPlaces
			// 			if ( allMeetingPlaces < 0 ) {
			// 				this.set( "warning", {
			// 					open: true,
			// 					title: "总预算超额",
			// 					detail: "总预算设定已超过限制，请重新分配。"
			// 				} )
			// 			}
			// 		}
			// 	}
			// } )
			this.inputMaxValue( allMeetingPlaces, "meetingPlaces", inputType )
		}
	}
} )
