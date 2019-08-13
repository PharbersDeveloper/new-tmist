import Component from "@ember/component"
import { computed, set } from "@ember/object"
import { A } from "@ember/array"
import { inject as service } from "@ember/service"
// import Ember from "ember"

export default Component.extend( {

	positionalParams: ["project", "period", "hospitals", "products", "resources", "presets", "answers", "quota", "validation"],
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
	allProductInfo: computed( "products", "presets", "answers",function() {
		// allProductInfo include product-id, product-cur-budget, product-cur-sales, product-all-sales
		let arr = []

		this.get( "products" ).forEach( product => {
			if ( product.productType === 0 ) {
				let obj = {}

				obj.name = product.name
				obj.productId = product.id
				obj.allSales = 0
				obj.curSales = 0
				obj.curBudget = 0

				this.get( "presets" ).forEach( preset => {
					if ( preset.get( "product.id" ) === product.id ) {
						obj.allSales += this.transNumber( preset.salesQuota )
					}
				} )
				this.get( "answers" ).forEach( answer => {
					if ( answer.get( "product.id" ) === product.id ) {
						obj.curSales += this.transNumber( answer.get( "salesTarget" ) )
						obj.curBudget += this.transNumber( answer.get( "budget" ) )
					}
				} )
				obj.curBudgetPercent = ( obj.curBudget / this.allBudget * 100 ).toFixed( 1 )
				this.curBudgetPercent -= obj.curBudgetPercent
				this.curBudgetPercent = this.curBudgetPercent.toFixed( 1 )
				arr.push( obj )
			}
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
	circleProductColor: A( ["#8777D9", "#FFC400", "#DFE1E6"] ),
	circleProductData: computed( function() {
		let arr = [], all = 0

		this.allProductInfo.forEach( product => {
			let obj = {}

			obj.name = product.name
			obj.value = product.curBudget
			all += product.curBudget
			arr.push( obj )
		} )
		let leftBudget = {value: this.allBudget - all, name: "未分配"}

		arr.push( leftBudget )
		return A( arr )
	} ),
	circleBudgetData: computed( function() {
		let obj = {}, arr = [], all = 0

		this.answers.forEach( answer => {
			let resource = answer.get( "resource.id" )

			if ( obj[resource] ) {
				obj[resource].value += this.transNumber( answer.get( "visitedTime" ) )

			} else if ( answer.get( "resource.name" ) ) {
				obj[resource] = {
					name: answer.get( "resource.name" ),
					value: this.transNumber( answer.get( "visitedTime" ) )
				}
			}
		} )
		for ( let key in obj ) {
			arr.push( obj[key] )
			all += obj[key].value
		}

		arr.push( {value: this.allBudget - all, name: "未分配"} )

		window.console.log( arr )

		return A( arr )

	} ),
	labelEmphasis: false,
	curResource: computed( function() {
		return this.resources.get( "firstObject" )
	} ),
	curAnswerToReset: null,
	resourceHospital: false,
	needScrollRepresentative: computed( function() {
		if ( this.circleBudgetData.length > 5 ) {
			return true
		} else {
			return false
		}
	} ),
	needScrollProduct: computed( function() {
		if ( this.circleProductData.length > 4 ) {
			return true
		} else {
			return false
		}
	} ),
	getResourceHospital() {
		let obj = {}

		this.get( "resources" ).forEach( resource => {
			obj[resource.id] = []
		} )
		// this.get( "answers" ).forEach( answer => {
		// 	if ( answer.get( "resource" ) ) {
		// 		window.console.log( answer.get( "resource" ) )
		// 		obj[answer.get( "resource.id" )].push( answer.get( "target" ) )
		// 	}
		// } )
		window.console.log( "!!!!!!!!" )
		window.console.log( obj )
		set( this, "resourceHospital", obj )
		// return obj
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
		selectResource( rs ) {
			set( this,"curResource", rs )
			window.console.log( "当前代表" , this.curResource.get( "name" ) )
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
					detail: "确定要取消分配代表分配至该医院吗？我们将重置您在该医院下的资源配置。"
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
				window.console.log( cur, curProductInfo )
				if ( cur <= this.allBudget ) {
					set( curProductInfo.firstObject, "curBudget", cur )
					set( curProductInfo.firstObject, "curBudgetPercent", ( cur / this.allBudget * 100 ).toFixed( 1 ) )


					let arr = [], all = 0

					this.allProductInfo.forEach( product => {
						let obj = {}


						obj.name = product.name
						obj.value = product.curBudget
						all += product.curBudget
						arr.push( obj )
					} )

					set( this, "curBudgetPercent", ( ( this.allBudget - all ) / this.allBudget * 100 ).toFixed( 1 ) )
					let leftBudget = {value: this.allBudget - all, name: "未分配"}

					arr.push( leftBudget )
					set( this, "circleData", arr )


					let budgetArr = this.getResourceBudgetData()

					set( this, "circleBudgetData", budgetArr )


				} else {
					this.set( "warning", {
						open: true,
						title: "设定超额",
						detail: "您的预算指标设定已超额，请合理分配。"
					} )
				}

			} else {
				answer.set( input, -1 )
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
						detail: "您的销售额指标设定已超额，请合理分配。"
					} )
				}

			} else {
				answer.set( input, -1 )
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
				answer.set( input, -1 )
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
