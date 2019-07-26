import Component from "@ember/component"
import { inject as service } from "@ember/service"
// import { computed } from "@ember/object"
// import { A } from "@ember/array"
// import { isEmpty } from "@ember/utils"
// import { alias } from "@ember/object/computed"

export default Component.extend( {
	// get validation
	// init() {
	// 	this._super( ...arguments )
	// 	window.console.log( document.getElementsByTagName( "input" ) )
	// 	window.console.log( document.getElementsByTagName( "input" ).length )

	// },
	positionalParams: ["resources", "managerAnswer", "answers", "period", "validation"],
	numberVerify: /^[0-9]\d*$/,
	exam: service( "service/exam-facade" ),
	groupValue: 0,
	// validation: ["maxMangerTime#100*maxMangerActionPoint#100", "timeInputType#Number*actionPointInputType#Number"]

	// circleTime: computed( "managerInput.totalManagerUsedTime",
	// 	"representativeInputs.@each.{assistAccessTime,abilityCoach}",
	// 	function () {
	// 		let { managerInput, managerTotalTime, representativeInputs } =
	// 			this.getProperties( "managerInput", "managerTotalTime",
	// 				"representativeInputs" ),
	// 			usedTime = 0,
	// 			restTime = 1

	// 		representativeInputs = isEmpty( representativeInputs ) ? [] : representativeInputs
	// 		if ( typeof managerTotalTime === "undefined" || typeof representativeInputs === "undefined" ) {
	// 			return A( [
	// 				{ name: "已分配", value: usedTime },
	// 				{ name: "未分配", value: restTime }
	// 			] )
	// 		}
	// 		// usedTime = Number(managerInput.get('strategyAnalysisTime')) +
	// 		//	Number(managerInput.get('adminWorkTime')) +	// 行政工作
	// 		//	Number(managerInput.get('clientManagementTime')) +	// 重点目标客户管理
	// 		//	Number(managerInput.get('kpiAnalysisTime')) +	// 代表及KPI分析
	// 		//	Number(managerInput.get('teamMeetingTime'));	// 团队例会
	// 		usedTime = isEmpty( managerInput ) ? 0 : managerInput.get( "totalManagerUsedTime" )

	// 		representativeInputs.forEach( ele => {
	// 			if ( isEmpty( ele ) ) {
	// 				usedTime += 0
	// 			} else {
	// 				usedTime += Number( ele.get( "assistAccessTime" ) )
	// 				usedTime += Number( ele.get( "abilityCoach" ) )
	// 			}
	// 		} )
	// 		if ( !this.get( "numberVerify" ).test( usedTime ) ) {
	// 			// eslint-disable-next-line ember/no-side-effects
	// 			this.set( "warning", {
	// 				open: true,
	// 				title: "非法值警告",
	// 				detail: "请输入数字！"
	// 			} )
	// 		}
	// 		restTime = managerTotalTime - usedTime
	// 		if ( restTime < 0 ) {
	// 			// eslint-disable-next-line ember/no-side-effects
	// 			this.set( "warning", {
	// 				open: true,
	// 				title: "经理时间超额",
	// 				detail: "经理时间设定已超过限制，请重新分配。"
	// 			} )
	// 		}
	// 		return A( [
	// 			{ name: "已分配", value: usedTime },
	// 			{ name: "未分配", value: restTime < 0 ? 0 : restTime }
	// 		] )
	// 	} ),
	// circlePoint: computed( "representativeInputs.@each.{totalPoint}", function () {
	// 	let { managerTotalKpi, representativeInputs } =
	// 		this.getProperties( "managerTotalKpi", "representativeInputs" ),
	// 		usedPoint = 0,
	// 		restPoint = 1

	// 	representativeInputs = isEmpty( representativeInputs ) ? [] : representativeInputs

	// 	if ( typeof managerTotalKpi === "undefined" ) {
	// 		return A( [
	// 			{ name: "已分配", value: usedPoint },
	// 			{ name: "未分配", value: restPoint }
	// 		] )
	// 	}

	// 	representativeInputs.forEach( ele => {
	// 		let totalPoint = isEmpty( ele ) ? 0 : ele.get( "totalPoint" )

	// 		usedPoint += Number( totalPoint )
	// 	} )

	// 	restPoint = managerTotalKpi - usedPoint
	// 	return A( [
	// 		{ name: "已分配", value: usedPoint },
	// 		{ name: "未分配", value: restPoint < 0 ? 0 : restPoint }
	// 	] )
	// } ),
	// radarData: computed( "tmpRepConf", function () {
	// 	let tmpRepConf = this.get( "tmpRepConf" ),
	// 		representativeId = "",
	// 		originalAbility = [],
	// 		averageAbility = this.get( "averageAbility" ) || [0, 0, 0, 0, 0],
	// 		representativeAbilities = this.get( "representativeAbilities" ),
	// 		reallyAbility = null

	// 	if ( isEmpty( tmpRepConf ) ) {
	// 		return [
	// 			{
	// 				value: [0, 0, 0, 0, 0],
	// 				name: "代表个人能力"
	// 			},
	// 			{
	// 				value: averageAbility,
	// 				name: "团队平均能力"
	// 			}
	// 		]
	// 	}
	// 	// value 按照此顺序
	// 	// { name: '工作积极性', max: 100 },
	// 	// { name: '产品知识', max: 100 },
	// 	// { name: '行为有效性', max: 100 },
	// 	// { name: '区域管理能力', max: 100 },
	// 	// { name: '销售知识', max: 100 }
	// 	representativeId = tmpRepConf.get( "representative.id" )
	// 	representativeAbilities.forEach( ele => {
	// 		if ( ele.get( "representative.id" ) === representativeId ) {
	// 			reallyAbility = ele
	// 		}
	// 	} )
	// 	originalAbility.push( reallyAbility.get( "jobEnthusiasm" ) )
	// 	originalAbility.push( reallyAbility.get( "productKnowledge" ) )
	// 	originalAbility.push( reallyAbility.get( "behaviorValidity" ) )
	// 	originalAbility.push( reallyAbility.get( "regionalManagementAbility" ) )
	// 	originalAbility.push( reallyAbility.get( "salesAbility" ) )
	// 	return [
	// 		{
	// 			value: originalAbility,
	// 			name: "代表个人能力"
	// 		},
	// 		{
	// 			value: averageAbility,
	// 			name: "团队平均能力"
	// 		}
	// 	]
	// } ),
	checkType( type, arr ) {
		let len = arr.length

		if ( type === "Number" ) {
			for ( let i = 0; i < len; i++ ) {
				if ( isNaN( Number( arr[i] ) ) ) {
					this.set( "warning", {
						open: true,
						title: "非法值警告",
						detail: "请输入数字！"
					} )
					return false
				}
			}
			return true
		}
	},
	checkMaxValue( max, arr ) {
		let len = arr.length

		for ( let i = 0; i < len; i++ ) {
			if ( arr[i] === -1 ) {
				arr[i] = 0
			}
			max -= arr[i]
			if ( max < 0 ) {
				this.set( "warning", {
					open: true,
					title: "经理时间超额",
					detail: "经理时间设定已超过限制，请重新分配。"
				} )
				return false
			}
		}
		return true
	},
	actions: {
		reInputTime() {
			this.exam.delegate.currentAnswers.forEach( e => {
				if ( e.category === "Management" ) {
					this.set( "managerAnswer.strategAnalysisTime", e.strategAnalysisTime )
					this.set( "managerAnswer.clientManagementTime", e.clientManagementTime )
					this.set( "managerAnswer.adminWorkTime", e.adminWorkTime )
					this.set( "managerAnswer.kpiAnalysisTime", e.kpiAnalysisTime )
					this.set( "managerAnswer.teamMeetingTime", e.teamMeetingTime )
				}
				if ( e.category === "Resource" ) {
					this.answers.filter( x => x.resource.get( "id" ) === e.resource.get( "id" ) ).forEach( answer => {
						answer.set( "abilityCoach", e.abilityCoach )
						answer.set( "assistAccessTime", e.assistAccessTime )
					} )
				}
			} )
		},
		validationMangerTime: function( curAnswer , curInput ) {
			window.console.log( this.validation )
			let maxValueRules = this.validation["maxValue"].split( "*" ),
				typeRules = this.validation["inputType"].split( "*" ),
				maxMangerTimeRule = "",
				managerTimeInputRule = "",
				managerInput = []

			maxValueRules.forEach( e => {
				if ( e.startsWith( "managementMaxTime" ) ) {
					maxMangerTimeRule = e
				}
			} )
			typeRules.forEach( e => {
				if ( e.startsWith( "managementTimeInputType" ) ) {
					managerTimeInputRule = e
				}
			} )
			// 1 第一周期
			let maxMangerTime = Number( maxMangerTimeRule.split( "#" )[1] ),
				managerTimeInputType = String( managerTimeInputRule.split( "#" )[1] ),
				{ strategAnalysisTime, clientManagementTime, adminWorkTime, kpiAnalysisTime, teamMeetingTime } = this.get( "managerAnswer" )

			this.get( "answers" ).forEach( e => {
				managerInput.push( e.abilityCoach )
				managerInput.push( e.assistAccessTime )
			} )
			managerInput.push( strategAnalysisTime )
			managerInput.push( clientManagementTime )
			managerInput.push( adminWorkTime )
			managerInput.push( kpiAnalysisTime )
			managerInput.push( teamMeetingTime )

			let typeValidation = this.checkType( managerTimeInputType, managerInput ),
				valueValidation = this.checkMaxValue( maxMangerTime, managerInput )

			if ( !typeValidation || !valueValidation ) {
				this.exam.delegate.currentAnswers.forEach( e => {
					if ( e.resource.get( "id" ) === curAnswer.resource.get( "id" ) ) {
						curAnswer.set( curInput , e.get( curInput ) )
					}
				} )
			}
		}
	}
} )
