import Component from "@ember/component"
import { computed, set } from "@ember/object"
import { A } from "@ember/array"
import { inject as service } from "@ember/service"
// import Ember from "ember"
import { htmlSafe } from "@ember/string"
import { alias } from "@ember/object/computed"

export default Component.extend( {

	positionalParams: ["project", "period", "proposal","hospitals", "products", "resources", "presets", "answers", "quota", "validation", "productQuotas", "reports", "budgetPreset"],
	exam: service( "service/exam-facade" ),
	runtimeConfig: service( "service/runtime-config" ),
	allVisitTime: 100,
	currentName: computed( "products", function () {
		const cur = this.get( "products" ).find( x => x.productType === 0 )

		return cur ? cur.name : ""
	} ),
	// currentBudget: 0,
	// currentSalesTarget: 0,
	// currentMeetingPlaces: 0,
	curRegion: 0,
	curCircle: 0,
	curStatus: 2,
	curStatusChanged: false,
	curBudgetPercent: 100,
	// TODO: 暂时留着，以后可能去掉
	curRegionArr: computed( function () {
		return ["全部", "会东市", "会西市", "会南市"]
	} ),
	allProductInfo: computed( "productQuotas", "updateAllProductInfo", function () {
		// allProductInfo include product-id, product-cur-budget, product-cur-sales, product-all-sales
		let arr = []

		this.get( "productQuotas" ).sort(
			( a,b )=> a.get( "product.name" ).localeCompare( b.get( "product.name" ), "zh" )
		).forEach( p => {
			let obj = {}

			obj.name = p.get( "product.name" )
			obj.allSales = p.lastQuota
			obj.productId = p.get( "product.id" )
			obj.curSales = 0
			obj.curBudget = 0

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
	updateAllProductInfo: false,
	allBudget: computed( function () {

		if ( this.period.phase === 0 ) {
			return this.quota.get( "totalBudget" )
		} else {
			return this.budgetPreset.get( "firstObject.initBudget" )
		}
	} ),
	allMeetingPlaces: computed( "quota", function () {
		return this.quota.get( "meetingPlaces" )
	} ),
	curMeetingPlaces: computed( "answers", function () {
		let cur = 0

		this.answers.forEach( answer => {
			cur += this.transNumber( answer.get( "meetingPlaces" ) )
		} )
		return cur
	} ),
	circleMeetingColor: A( ["#3172E0", "#DFE1E6"] ),
	circleMeetingSize: A( ["36", "44"] ),
	circleMeetingData: computed( "curMeetingPlaces", function () {
		return A( [{ value: this.curMeetingPlaces, name: "已分配" },
			{ value: this.allMeetingPlaces - this.curMeetingPlaces, name: "未分配" }] )
	} ),
	circleSize: A( ["42", "58"] ),
	circleColor: A( ["#FFC400", "#73ABFF", "#FF8F73", "#79E2F2", "#998DD9", "#57D9A3"] ),
	ucbCircleColor: A( ["#8777D9", "#FFC400", " #57D9A3", "#dfe1e6"] ),
	ucbHtmlSafeCircleColor: A( [htmlSafe( "background-color: #8777D9" ), htmlSafe( "background-color: #FFC400" ),
		htmlSafe( "background-color: #57D9A3" ), htmlSafe( "background-color: #dfe1e6" )] ),
	// circleProductColorForUCB: computed(function),
	circleProductColor: computed( function () {
		return this.getProductCircleColor()
	} ),
	circlebudgetColorOrigin: computed( function() {
		let originColor = this.getBudgetCircleColor(),
			htmlSafeColor = originColor.map( ele=> {
				return htmlSafe( "background-color: " + ele )
			} )

		return {
			originColor,
			htmlSafeColor
		}
	} ),
	circleBudgetColor: alias( "circlebudgetColorOrigin.originColor" ),
	circleBudgetColorSafe: alias( "circlebudgetColorOrigin.htmlSafeColor" ),
	circleProductData: computed( function () {
		return this.getProductBudgetData()
	} ),
	circleBudgetData: computed( function () {
		return this.getResourceBudgetData()
	} ),
	legendProductBudget: computed( function () {
		return this.circleProductData
	} ),
	legendResourceBudget: computed( function () {
		return this.circleBudgetData
	} ),
	labelEmphasis: false,
	curResource: computed( function () {
		return this.resources.get( "firstObject" )
	} ),
	curHospitalId: null,
	curAnswerToReset: null,
	resourceHospital: false,
	resourceHospitalNumebr: computed( "resourceHospital", function () {
		return this.getResourceHospital()
	} ),
	getResourceHospital() {
		let num = 0

		this.get( "answers" ).uniqBy( "target.id" ).forEach( answer => {
			if ( !answer.get( "resource.id" ) ) {
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
				detail: "请输入正整数。"
			} )
			return false
		} else if ( String( input ).indexOf( "." ) !== -1 ){

			this.set( "warning", {
				open: true,
				title: "非法值警告",
				detail: "请输入正整数。"
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

		this.resources.forEach( rs => {
			obj[rs.get( "id" )] = {}

			obj[rs.get( "id" )].name = rs.get( "name" )
			obj[rs.get( "id" )].value = 0
			obj[rs.get( "id" )].per = 0
			obj[rs.get( "id" )].per = obj[rs.get( "id" )].per.toFixed( 1 )
		} )

		this.answers.forEach( a => {
			let resource = a.get( "resource.id" )

			// if ( obj[resource] ) {
			// 	obj[resource].value += this.transNumber( a.get( "budget" ) )
			// 	obj[resource].per = ( obj[resource].value / this.allBudget * 100 ).toFixed( 1 )

			// } else

			if ( resource ) {
				obj[resource].value += this.transNumber( a.get( "budget" ) )
				obj[resource].per = ( obj[resource].value / this.allBudget * 100 ).toFixed( 1 )
			}
		} )
		for ( let key in obj ) {
			budgetArr.push( obj[key] )
			allResourceBudget += obj[key].value
		}

		let remain = this.allBudget - allResourceBudget

		budgetArr.push( { value: remain, name: "未分配", per: ( remain / this.allBudget * 100 ).toFixed( 1 ) } )

		return budgetArr
	},
	getProductBudgetData() {
		let arr = [], all = 0, allP = []

		this.get( "productQuotas" ).sort(
			( a,b )=> a.get( "product.name" ).localeCompare( b.get( "product.name" ), "zh" )
		).forEach( p => {
			let obj = {}

			obj.name = p.get( "product.name" )
			obj.allSales = p.lastQuota
			obj.productId = p.get( "product.id" )
			obj.curSales = 0
			obj.curBudget = 0

			this.get( "answers" ).forEach( answer => {
				if ( answer.get( "product.id" ) === obj.productId ) {
					obj.curSales += this.transNumber( answer.get( "salesTarget" ) )
					obj.curBudget += this.transNumber( answer.get( "budget" ) )
				}
			} )
			obj.curBudgetPercent = ( obj.curBudget / this.allBudget * 100 ).toFixed( 1 )
			this.curBudgetPercent -= obj.curBudgetPercent
			this.curBudgetPercent = this.curBudgetPercent.toFixed( 1 )
			allP.push( obj )

		} )


		allP.forEach( product => {
			let obj = {}

			obj.name = product.name
			obj.value = product.curBudget
			obj.curBudgetPercent = product.curBudgetPercent
			all += product.curBudget
			arr.push( obj )
		} )

		let remain = this.allBudget - all

		arr.push( { value: remain, name: "未分配", curBudgetPercent: ( remain / this.allBudget * 100 ).toFixed( 1 ) }
		)
		return A( arr )
	},
	updateResourceBudgetData() {
		let arrC = this.getResourceBudgetData(),
			arrL = this.getResourceBudgetData()

		arrC.forEach( x => {
			if ( x.value < 0 ) {
				x.value = 0
			}
		} )

		set( this, "circleBudgetData", arrC )
		set( this, "legendResourceBudget", arrL )

	},
	updateProductBudgetData() {
		let arrC = this.getProductBudgetData(),
			arrL = this.getProductBudgetData()

		arrC.forEach( x => {
			if ( x.value < 0 ) {
				x.value = 0
			}
		} )

		set( this, "circleProductData", arrC )
		set( this, "legendProductBudget", arrL )
	},
	chooseCheck: computed( function() {
		return [{ id: 1, value: "不再提示", label: "no-notice" }]
	} ),
	// popover: computed( "runtimeConfig.popover",function() {
	// 	return this.runtimeConfig.popover
	// } ),
	// didUpdate() {
	// 	this._super( ...arguments )
	// 	// this.set( "showPopover", false )
	// 	this.runtimeConfig.set( "popover",false )
	// 	window.console.log( "should be changed" )
	// },
	actions: {
		chooseItem() {
			this.runtimeConfig.setNoticeToggle()
			window.console.log( this.runtimeConfig.cancelRepresentNotice )
		},
		selectCurStatus( status ) {
			this.set( "curStatus", status )
			this.toggleProperty( "curStatusChanged" )
		},
		selectResource( rs ) {
			set( this, "curResource", rs )
			window.console.log( "当前代表", this.curResource.get( "name" ) )
		},
		selectHospital( hid ) {
			set( this, "curHospitalId", hid )
		},
		allocateRepresentatives( answer ) {
			// if this.curResource is null  : error 未选择代表
			window.console.log( "i am allocate represent" )
			// if ( this.runtimeConfig.cancelRepresentNotice ) {
			// 	window.console.log( answer.get( "target.name" ), answer.get( "resource.name" ), "当前代表", this.curResource.get( "name" ) )
			// 	this.set( "cancelWarning", {
			// 		open: true,
			// 		title: "代表取消选择医院",
			// 		detail: "确定要取消分配代表分配至该医院吗？我们将重置你在该医院下的资源配置。"
			// 	} )
			// } else {
			this.exam.resetBusinessResources( this.answers, answer.get( "target" ), this.curResource )
			this.toggleProperty( "resourceHospital" )
			window.console.log( answer.get( "target.name" ), answer.get( "resource.name" ) )
			// }
			window.console.log( this.resourceHospital )
		},
		cancelRepresentatives( answer ) {
			// if ( answer.get( "resource.id" ) !== this.curResource.get( "id" ) ) {
			if ( this.runtimeConfig.cancelRepresentNotice ) {
				window.console.log( answer.get( "target.name" ), answer.get( "resource.name" ), "当前代表", this.curResource.get( "name" ) )
				this.set( "cancelWarning", {
					open: true,
					title: "代表取消选择医院",
					detail: "确定要取消该医院的代表分配吗？我们将同时重置该医院的其他分配输入。"
				} )
				set( this, "curAnswerToReset", answer )

			} else {
				this.exam.cancelBusinessResource( this.answers, answer.get( "target" ) )
				this.updateResourceBudgetData()
				this.updateProductBudgetData()
				this.toggleProperty( "updateAllProductInfo" )
			}
			this.toggleProperty( "resourceHospital" )
		},
		resetBusiness() {
			// this.exam.cancelBusinessResource( this.answers, answer.get( "target" ) )
			this.set( "cancelWarning", {
				open: false
			} )
			this.exam.resetBusinessAnswer( this.answers, this.curAnswerToReset.get( "target.id" ) )
			this.updateResourceBudgetData()
			this.updateProductBudgetData()
			this.toggleProperty( "updateAllProductInfo" )
			this.toggleProperty( "resourceHospital" )
		},
		budgetValidationHandle( answer, input ) {
			let isNumer = this.checkNumber( answer.get( input ) )

			if ( !isNumer ) {
				answer.set( input, 0 )
			}

			let cur = 0,
				curProduct = answer.get( "product.id" ),
				curProductInfo = this.allProductInfo.filter( p => p.productId === curProduct )

			this.answers.forEach( a => {
				cur += this.transNumber( a.get( input ) )
			} )

			window.console.log( cur, this.allBudget )
			if ( cur <= this.allBudget ) {
				set( curProductInfo.firstObject, "curBudget", cur )
				set( curProductInfo.firstObject, "curBudgetPercent", ( cur / this.allBudget * 100 ).toFixed( 1 ) )
				this.updateResourceBudgetData()
				this.updateProductBudgetData()
			} else {
				// TODO: 所有的validation都要重做
				this.set( "warning", {
					open: true,
					title: "设定超额",
					detail: "你的预算指标设定已超额，请合理分配。"
				} )

				set( curProductInfo.firstObject, "curBudget", cur )
				set( curProductInfo.firstObject, "curBudgetPercent", ( cur / this.allBudget * 100 ).toFixed( 1 ) )
				this.updateResourceBudgetData()
				this.updateProductBudgetData()

			}
		},
		salesTargetValidationHandle( answer, input ) {

			let isNumer = this.checkNumber( answer.get( input ) )

			if ( !isNumer ) {
				answer.set( input, 0 )
			}

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
				// this.toggleProperty( "updateAllProductInfo" )
				set( curProductInfo.firstObject, "curSales", cur )
			} else {
				this.set( "warning", {
					open: true,
					title: "设定超额",
					detail: "你的指标设定已超额，请合理分配。"
				} )
			}
			// this.toggleProperty( "updateAllProductInfo" )
			set( curProductInfo.firstObject, "curSales", cur )
		},
		meetingPlacesValidationHandle( answer, input ) {

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
						detail: "你的会议名额设定已超过总名额限制，请合理分配。"
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
