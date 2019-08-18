import Component from "@ember/component"
import { computed, set } from "@ember/object"
import { A } from "@ember/array"
import { inject as service } from "@ember/service"
// import Ember from "ember"

export default Component.extend( {

	positionalParams: ["project", "period", "hospitals", "products", "resources", "presets", "answers", "quota", "validation", "productQuotas"],
	exam: service( "service/exam-facade" ),
	allVisitTime: 100,
	currentName: computed( "products", function() {
		const cur = this.get( "products" ).find( x => x.productType === 0 )

		return cur ? cur.name : ""
	} ),
	// currentBudget: 0,
	// currentSalesTarget: 0,
	// currentMeetingPlaces: 0,
	curCircle: 0,
	curBudgetPercent: 100,
	// TODO: 暂时留着，以后可能去掉
	allProductInfo: computed( "productQuotas",function() {
		// allProductInfo include product-id, product-cur-budget, product-cur-sales, product-all-sales
		let arr = []

		this.get( "productQuotas" ).forEach( p => {
			let obj = {}

			obj.name = p.get( "product.name" )
			obj.allSales = p.lastQuota
			obj.productId = p.get( "product.id" )
			obj.curSales = 0
			obj.curBudget = 0

			// this.get( "presets" ).forEach( preset => {
			// 	if ( preset.get( "product.id" ) === product.id ) {
			// 		obj.allSales += this.transNumber( preset.salesQuota )
			// 	}
			// } )
			this.get( "answers" ).forEach( answer => {
				if ( answer.get( "product.id" ) === obj.productId ) {
					obj.curSales += this.transNumber( answer.get( "salesTarget" ) )
					obj.curBudget += this.transNumber( answer.get( "budget" ) )
				}
			} )
			obj.curBudgetPercent = ( obj.curBudget / this.allBudget * 100 ).toFixed( 1 )
			this.curBudgetPercent -= obj.curBudgetPercent
			this.curBudgetPercent = this.curBudgetPercent.toFixed( 1 )
			arr.push( obj )

		} )
		return A( arr )
	} ),
	allBudget: computed( "quota", function() {
		return this.quota.get( "totalBudget" )
	} ),
	allMeetingPlaces: computed( "quota", function() {
		return this.quota.get( "meetingPlaces" )
	} ),
	curMeetingPlaces: computed( "answers", function() {
		let cur = 0

		this.answers.forEach( answer => {
			cur += this.transNumber( answer.get( "meetingPlaces" ) )
		} )
		return cur
	} ),
	circleMeetingColor: A( ["#3172E0", "#DFE1E6"] ),
	circleMeetingSize: A( ["70%", "85%"] ),
	circleMeetingData: computed( "curMeetingPlaces", function() {
		return A( [{ value: this.curMeetingPlaces, name: "已分配" },
			{ value: this.allMeetingPlaces - this.curMeetingPlaces, name: "未分配" }] )
	} ),
	circleSize: A( ["70%", "95%"] ),
	circleColor: A( ["#FFC400", "#73ABFF", "#FF8F73", "#79E2F2", "#998DD9", "#57D9A3"] ),
	circleProductColor: computed( function() {
		return this.getProductCircleColor()
	} ),
	circleBudgetColor: computed( function() {
		return this.getBudgetCircleColor()
	} ),
	circleProductData: computed( function() {
		return this.getProductBudgetData()
	} ),
	circleBudgetData: computed( function() {
		return this.getResourceBudgetData()
	} ),
	labelEmphasis: false,
	curResource: computed( function() {
		return this.resources.get( "firstObject" )
	} ),
	curHospitalId: null,
	curAnswerToReset: null,
	resourceHospital: false,
	resourceHospitalNumebr: computed( "resourceHospital", function() {
		return this.getResourceHospital()
	} ),
	getResourceHospital() {
		let num = 0

		this.get( "answers" ).forEach( answer => {
			if ( answer.get( "resource" ) ) {
				num += 1
			}
		} )

		return num
	},
	transNumber( input ) {
		let number = Number( input )

		if ( number === -1 || isNaN( number ) ) {
			return 0
		} else {
			return number
		}

	},
	checkNumber( input ) {

		if ( isNaN( input ) ) {
			this.set( "warning", {
				open: true,
				title: "非法值警告",
				detail: "请输入数字。"
			} )
			return false
		}
		return true
	},
	getProductCircleColor() {
		let num = this.circleProductData.length,
			arr = []

		for ( let i = 0; i < num; i++ ) {
			if ( i === num - 1 ) {
				arr.push( "#dfe1e6" )
			}

			if ( i > this.circleColor.length - 1 ) {
				i = 0
			}
			arr.push( this.circleColor[i] )
		}
		return A( arr )
	},
	getBudgetCircleColor() {
		let num = this.circleBudgetData.length,
			arr = []

		for ( let i = 0; i < num; i++ ) {

			if ( i === num - 1 ) {
				arr.push( "#dfe1e6" )
			} else {
				if ( i > this.circleColor.length - 1 ) {
					i = 0
				}
				arr.push( this.circleColor[i] )
			}

		}
		return A( arr )
	},
	getResourceBudgetData() {
		let obj = {}, budgetArr = [], allResourceBudget = 0

		this.answers.forEach( a => {
			let resource = a.get( "resource.id" )

			if ( obj[resource] ) {
				obj[resource].value += this.transNumber( a.get( "budget" ) )
				obj[resource].per = ( obj[resource].value / this.allBudget * 100 ).toFixed( 1 )

			} else if ( a.get( "resource.name" ) ) {
				obj[resource] = {
					name: a.get( "resource.name" ),
					value: this.transNumber( a.get( "budget" ) )
				}
				obj[resource].per = ( obj[resource].value / this.allBudget * 100 ).toFixed( 1 )
			}
		} )
		for ( let key in obj ) {
			budgetArr.push( obj[key] )
			allResourceBudget += obj[key].value
		}

		let remain = this.allBudget - allResourceBudget

		budgetArr.push( {value: remain, name: "未分配", per: ( remain / this.allBudget * 100 ).toFixed( 1 ) } )

		return budgetArr
	},
	getProductBudgetData() {
		let arr = [], all = 0

		this.allProductInfo.forEach( product => {
			let obj = {}

			obj.name = product.name
			obj.value = product.curBudget
			obj.curBudgetPercent = product.curBudgetPercent
			all += product.curBudget
			arr.push( obj )
		} )

		let remain = this.allBudget - all

		arr.push( {value: remain, name: "未分配", curBudgetPercent: ( remain / this.allBudget * 100 ).toFixed( 1 )}
		)
		return A( arr )
	},
	// inputMaxValue( all, value, type ) {
	// 	let sum = 0,
	// 		showTitle = ""

	// 	if ( value === "budget" ) {
	// 		showTitle = "预算"
	// 	} else if ( value === "salesTarget" ) {
	// 		showTitle = "销售额"
	// 	} else if ( value === "meetingPlaces" ) {
	// 		showTitle = "会议名额"
	// 	}

	// 	this.get( "answers" ).forEach( answer => {
	// 		let curValue = answer.get( value )

	// 		if ( type === "Number" ) {
	// 			let checkValue = this.inputTypeNumber( curValue )

	// 			if ( checkValue ) {
	// 				sum += checkValue
	// 				if ( all < sum ) {
	// 					this.set( "warning", {
	// 						open: true,
	// 						title: `总${showTitle}超额`,
	// 						detail: `总${showTitle}设定已超过限制，请重新分配。`
	// 					} )
	// 				}
	// 			}
	// 		}
	// 	} )

	// 	if ( value === "budget" ) {
	// 		this.set( "currentBudget", sum )
	// 	} else if ( value === "salesTarget" ) {
	// 		this.set( "currentSalesTarget", sum )
	// 	} else if ( value === "meetingPlaces" ) {
	// 		this.set( "currentMeetingPlaces", sum )
	// 	}
	// },
	// getInputType( str ) {
	// 	let typeRules = this.validation["inputType"].split( "*" ),
	// 		businessInputTypeRule = ""

	// 	typeRules.forEach( e => {
	// 		if ( e.startsWith( str ) ) {
	// 			businessInputTypeRule = e
	// 		}
	// 	} )
	// 	return String( businessInputTypeRule.split( "#" )[1] )
	// },
	// getInputMaxValue( str ) {
	// 	let maxValueRules = this.validation["maxValue"].split( "*" ),
	// 		businessInputMaxValueRule = ""

	// 	maxValueRules.forEach( e => {
	// 		if ( e.startsWith( str ) ) {
	// 			businessInputMaxValueRule = e
	// 		}
	// 	} )
	// 	// 传入i  取第[i]周期
	// 	return Number( businessInputMaxValueRule.split( "#" )[1] )
	// },
	actions: {
		getColor( index ) {
			return this.circleProductColor.objectAt( index )
		},
		selectResource( rs ) {
			set( this,"curResource", rs )
			window.console.log( "当前代表" , this.curResource.get( "name" ) )
		},
		selectHospital( hid ) {
			set( this,"curHospitalId", hid )
		},
 		allocateRepresentatives( answer ) {
			// if this.curResource is null  : error 未选择代表

			if ( answer.get( "resource.id" ) && answer.get( "resource.id" ) !== this.curResource.get( "id" ) ) {
				window.console.log( answer.get( "target.name" ), answer.get( "resource.name" ), "当前代表", this.curResource.get( "name" ) )
				this.set( "cancelWarning", {
					open: true,
					title: "代表取消选择医院",
					detail: "确定要取消分配代表分配至该医院吗？我们将重置您在该医院下的资源配置。"
				} )
			} else {
				this.exam.resetBusinessResources( this.answers, answer.get( "target" ), this.curResource )
				this.toggleProperty( "resourceHospital" )
				window.console.log( answer.get( "target.name" ), answer.get( "resource.name" ) )
			}

		},
		cancelRepresentatives( answer ) {
			if ( answer.get( "resource.id" ) !== this.curResource.get( "id" ) ) {
				window.console.log( answer.get( "target.name" ), answer.get( "resource.name" ), "当前代表", this.curResource.get( "name" ) )
				this.set( "cancelWarning", {
					open: true,
					title: "代表取消选择医院",
					detail: "确定要取消该医院的代表分配吗？我们将同时重置该医院的其他分配输入。"
				} )
				set( this, "curAnswerToReset", answer )
			} else {
				this.exam.cancelBusinessResource( this.answers, answer.get( "target" ) )
			}
			this.toggleProperty( "resourceHospital" )
		},
		resetBusiness() {
			// this.exam.cancelBusinessResource( this.answers, answer.get( "target" ) )
			this.set( "cancelWarning", {
				open: false
			} )
			this.exam.resetBusinessAnswer( this.answers, this.curAnswerToReset.get( "target.id" ) )
			this.toggleProperty( "resourceHospital" )
		},
		calculateVisitTime( visitTime ) {
			this.set( this.allVisitTime, this.allVisitTime - visitTime )
		},
		budgetValidationHandle( answer, input ) {
			// let allBudget = this.getInputMaxValue( "businessMaxBudget" ),
			// 	inputType = this.getInputType( "businessBudgetInputType" )

			// this.inputMaxValue( allBudget, "budget", inputType )
			let isNumer = this.checkNumber( answer.get( input ) )

			if ( isNumer ) {
				let cur = 0,
					curProduct = answer.get( "product.id" ),
					curProductInfo = {}

				this.answers.forEach( a => {
					if ( a.get( "product.id" ) === curProduct ) {
						cur += this.transNumber( a.get( input ) )
					}
				} )

				curProductInfo = this.allProductInfo.filter( p => p.productId === curProduct )

				if ( cur <= this.allBudget ) {
					set( curProductInfo.firstObject, "curBudget", cur )
					set( curProductInfo.firstObject, "curBudgetPercent", ( cur / this.allBudget * 100 ).toFixed( 1 ) )


					// let arr = [], all = 0

					// this.allProductInfo.forEach( product => {
					// 	let obj = {}
					// 	obj.name = product.name
					// 	obj.value = product.curBudget
					// 	all += product.curBudget
					// 	arr.push( obj )
					// } )
					// set( this, "curBudgetPercent", ( ( this.allBudget - all ) / this.allBudget * 100 ).toFixed( 1 ) )
					// let leftBudget = {value: this.allBudget - all, name: "未分配"}
					// arr.push( leftBudget )
					let productDataArr = this.getProductBudgetData(),
						budgetArr = this.getResourceBudgetData(),
						budgetColor = this.getBudgetCircleColor()

					set( this, "circleProductData", productDataArr )
					set( this, "circleBudgetData", budgetArr )
					set( this, "circleBudgetColor", budgetColor )


				} else {
					// TODO: 所有的validation都要重做
					this.set( "warning", {
						open: true,
						title: "设定超额",
						detail: "您的预算指标设定已超额，请合理分配。"
					} )
				}

			} else {
				answer.set( input, 0 )
			}
		},
		salesTargetValidationHandle( answer, input ) {

			// let allSalesTarget = 100000, inputType = "Number"
			// let allSalesTarget = this.getInputMaxValue( "businessMaxSalesTarget" ),
			// 	inputType = this.getInputType( "businessSalesTargetInputType" )

			// this.inputMaxValue( allSalesTarget, "salesTarget", inputType )
			let isNumer = this.checkNumber( answer.get( input ) )

			if ( isNumer ) {
				let cur = 0,
					curProduct = answer.get( "product.id" ),
					curProductInfo = {}

				this.answers.forEach( a => {
					if ( a.get( "product.id" ) === curProduct ) {
						cur += this.transNumber( a.get( "salesTarget" ) )
					}
				} )

				curProductInfo = this.allProductInfo.filter( p => p.productId === curProduct )
				window.console.log( cur, curProductInfo )
				if ( cur <= curProductInfo.firstObject.allSales ) {

					set( curProductInfo.firstObject, "curSales", cur )
				} else {
					this.set( "warning", {
						open: true,
						title: "设定超额",
						detail: "您的指标设定已超额，请合理分配。"
					} )
				}

			} else {
				answer.set( input, 0 )
			}
		},
		meetingPlacesValidationHandle( answer, input ) {
			// 1 第一周期
			// let allMeetingPlaces = this.getInputMaxValue( "businessMaxMeetingPlaces" ),
			// 	inputType = this.getInputType( "businessMeetingPlacesInputType" )

			// this.inputMaxValue( allMeetingPlaces, "meetingPlaces", inputType )
			let isNumber = this.checkNumber( answer.get( input ) )

			if ( isNumber ) {
				let cur = 0

				this.answers.forEach( a => {
					cur += this.transNumber( a.get( "meetingPlaces" ) )
				} )

				if ( cur <= this.allMeetingPlaces ) {
					set( this, "curMeetingPlaces", cur )
				} else {
					this.set( "warning", {
						open: true,
						title: "设定超额",
						detail: "您的会议名额设定已超过总名额限制，请合理分配。"
					} )
				}
			} else {
				answer.set( input, 0 )
			}
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
