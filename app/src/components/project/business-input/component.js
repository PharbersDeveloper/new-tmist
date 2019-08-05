import Component from "@ember/component"
import { computed } from "@ember/object"
import { A } from "@ember/array"

export default Component.extend( {
	positionalParams: ["project", "period", "hospitals", "products", "resources", "preset", "answers", "validation"],
	allVisitTime: 100,
	currentName: computed( "products", function() {
		const cur = this.get( "products" ).find( x => x.productType === 0 )

		return cur ? cur.name : ""
	} ),
	currentBudget: 0,
	currentSalesTarget: 0,
	currentMeetingPlaces: 0,
	circleData: A( [{ value: 40, name: "大扶康" }, { value: 20, name: "美素" }, { value: 40, name: "未分配" }] ),
	circleColor: A( ["#8777D9", "#FFC400", "#DFE1E6"] ),
	circleSize: A( ["70%", "95%"] ),
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
		let sum = 0,
			showTitle = ""

		if ( value === "budget" ) {
			showTitle = "预算"
		} else if ( value === "salesTarget" ) {
			showTitle = "销售额"
		} else if ( value === "meetingPlaces" ) {
			showTitle = "会议名额"
		}

		this.get( "answers" ).forEach( answer => {
			let curValue = answer.get( value )

			if ( type === "Number" ) {
				let checkValue = this.inputTypeNumber( curValue )

				if ( checkValue ) {
					sum += checkValue
					if ( all < sum ) {
						this.set( "warning", {
							open: true,
							title: `总${showTitle}超额`,
							detail: `总${showTitle}设定已超过限制，请重新分配。`
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
	getInputType( str ) {
		let typeRules = this.validation["inputType"].split( "*" ),
			businessInputTypeRule = ""

		typeRules.forEach( e => {
			if ( e.startsWith( str ) ) {
				businessInputTypeRule = e
			}
		} )
		return String( businessInputTypeRule.split( "#" )[1] )
	},
	getInputMaxValue( str ) {
		let maxValueRules = this.validation["maxValue"].split( "*" ),
			businessInputMaxValueRule = ""

		maxValueRules.forEach( e => {
			if ( e.startsWith( str ) ) {
				businessInputMaxValueRule = e
			}
		} )
		// 传入i  取第[i]周期
		return Number( businessInputMaxValueRule.split( "#" )[1] )
	},
	actions: {
		selectResource( rs ) {
			this.set( "curResource", rs )
		},
		calculateVisitTime( visitTime ) {
			this.set( this.allVisitTime, this.allVisitTime - visitTime )
		},
		budgetValidationHandle() {
			let allBudget = this.getInputMaxValue( "businessMaxBudget" ),
				inputType = this.getInputType( "businessBudgetInputType" )

			this.inputMaxValue( allBudget, "budget", inputType )
		},
		salesTargetValidationHandle() {

			// let allSalesTarget = 100000, inputType = "Number"
			let allSalesTarget = this.getInputMaxValue( "businessMaxSalesTarget" ),
				inputType = this.getInputType( "businessSalesTargetInputType" )

			this.inputMaxValue( allSalesTarget, "salesTarget", inputType )
		},
		meetingPlacesValidationHandle() {
			// 1 第一周期
			let allMeetingPlaces = this.getInputMaxValue( "businessMaxMeetingPlaces" ),
				inputType = this.getInputType( "businessMeetingPlacesInputType" )

			this.inputMaxValue( allMeetingPlaces, "meetingPlaces", inputType )
		},
		visitTimeValidationHandle( curAnswer ) {
			let curInput = curAnswer.get( "visitTime" )

			if ( Number( curInput ) === 0 ) {
				this.set( "warning", {
					open: true,
					title: "设定为0",
					detail: "代表拜访时间不能为0%，请合理分配。"
				} )
			}

			window.console.log( curAnswer.get( "resource" ).get( "id" ) )
			let resourceAllVisitTime = 0

			this.get( "answers" ).forEach( answer => {

				if ( answer.get( "resource" ).get( "id" ) === curAnswer.get( "resource" ).get( "id" ) ) {
					let time = Number( answer.get( "visitTime" ) )

					if ( time === -1 ) {
						time = 0
					}
					resourceAllVisitTime += time
				}
			} )
			if ( resourceAllVisitTime > 100 ) {
				let name = curAnswer.resource.get( "name" )

				this.set( "warning", {
					open: true,
					title: "设定超额",
					detail: name + "的拜访时间已超过总时间限制，请合理分配。"
				} )
			}
		}
	}
} )
