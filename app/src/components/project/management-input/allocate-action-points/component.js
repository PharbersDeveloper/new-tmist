import Component from "@ember/component"
import { computed } from "@ember/object"
import { isEmpty } from "@ember/utils"
import { inject as service } from "@ember/service"

export default Component.extend( {
	positionalParams: ["resources", "answers"],
	quizs: computed( "resources", "answers", function() {
		return this.resources.map( item => {
			const one = this.answers.find( x => x.get( "resource.id" ) === item.get( "id" ) )

			return { resource: item, answer: one }
		} )
	} ),
	exam: service( "service/exam-facade" ),
	validation: ["maxMangerTime#100*maxMangerActionPoint#5", "timeInputType#Number*actionPointInputType#Boolean"],
	isOverKpi: computed( "ManagerUsedKpi", "managerTotalKpi", function () {
		let { ManagerUsedKpi, managerTotalKpi } =
			this.getProperties( "ManagerUsedKpi", "managerTotalKpi" )

		if ( isEmpty( managerTotalKpi ) ) {
			return false
		}
		if ( ManagerUsedKpi >= managerTotalKpi ) {
			return true
		}
	} ),
	// checkType( type, arr ) {
	// 	let len = arr.length

	// 	if ( type === "Number" ) {
	// 		for ( let i = 0; i < len; i++ ) {
	// 			// let temp = Number( arr[i] )
	// 			if ( isNaN( Number( arr[i] ) ) ) {
	// 				window.console.log( arr[i] )
	// 				this.set( "warning", {
	// 					open: true,
	// 					title: "非法值警告",
	// 					detail: "请输入数字！"
	// 				} )
	// 			}
	// 		}
	// 	}
	// },
	checkMaxValue( max, arr ) {
		let len = arr.length

		for ( let i = 0; i < len; i++ ) {
			if ( arr[i] === -1 ) {
				arr[i] = 0
			}
			max -= arr[i]
			if ( max < 0 ) {
				window.console.log( "out of" )
				this.set( "warning", {
					open: true,
					title: "经理时间超额",
					detail: "经理时间设定已超过限制，请重新分配。"
				} )
				return false
			}
		}
		window.console.log( "ok" )
		return true
	},
	isOverMaxMangerActionPoint: function() {
		let maxValueRules = this.validation[0].split( "*" ),
			// typeRules = this.validation[1].split( "*" ),
			maxMangerActionPointRule = "",
			// managerTimeInputRule = "",
			managerInput = []

		maxValueRules.forEach( e => {
			if ( e.startsWith( "maxMangerActionPoint" ) ) {
				maxMangerActionPointRule = e
			}
		} )
		// typeRules.forEach( e => {
		// 	if ( e.startsWith( "actionPointInputType" ) ) {
		// 		managerTimeInputRule = e
		// 	}
		// } )
		// 1 第一周期
		let maxMangerActionPoint = Number( maxMangerActionPointRule.split( "#" )[1] )
		// managerTimeInputType = String( managerTimeInputRule.split( "#" )[1] )

		this.get( "answers" ).forEach( e => {
			// window.console.log( e.productKnowledgeTraining )
			managerInput.push( e.productKnowledgeTraining )
			managerInput.push( e.salesAbilityTraining )
			managerInput.push( e.regionTraining )
			managerInput.push( e.performanceTraining )
			managerInput.push( e.vocationalDevelopment )
		} )

		// this.checkType( managerTimeInputType, managerInput )
		return this.checkMaxValue( maxMangerActionPoint, managerInput )
	},

	actions: {
		changeState( ) {
			return this.isOverMaxMangerActionPoint()
			// state = Number( context.get( key ) )

			// if ( !isOverKpi || state !== 0 ) {
			// 	context.toggleProperty( key )
			// } else {
			// 	this.set( "warning", {
			// 		open: true,
			// 		title: "经理行动点数超额",
			// 		detail: "经理无剩余行动点数可供分配。"
			// 	} )
			// }
		},
		reInputPoint() {
			this.exam.delegate.currentAnswers.forEach( e => {
				if ( e.category === "Resource" ) {
					// window.console.log( this.answers )
					this.answers.filter( x => x.resource.get( "id" ) === e.resource.get( "id" ) ).forEach( answer => {
						answer.set( "productKnowledgeTraining", e.productKnowledgeTraining )
						answer.set( "salesAbilityTraining", e.salesAbilityTraining )
						answer.set( "regionTraining", e.regionTraining )
						answer.set( "performanceTraining", e.performanceTraining )
						answer.set( "vocationalDevelopment", e.vocationalDevelopment )
					} )
				}
			} )
		}
	}
} )
