import Component from "@ember/component"
import { computed } from "@ember/object"
import { A } from "@ember/array"
import { isEmpty } from "@ember/utils"
import { alias } from "@ember/object/computed"

export default Component.extend( {
	positionalParams: ["resources", "managerAnswer", "answers"],
	numberVerify: /^-?[0-9]\d*$/,
	groupValue: 0,
	center: "center",
	ManagerUsedKpi: alias( "circlePoint.firstObject.value" ),
	ManagerUsedTime: alias( "circleTime.firstObject.value" ),

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

	circleTime: computed( "managerInput.totalManagerUsedTime",
		"representativeInputs.@each.{assistAccessTime,abilityCoach}",
		function () {
			let { managerInput, managerTotalTime, representativeInputs } =
				this.getProperties( "managerInput", "managerTotalTime",
					"representativeInputs" ),
				usedTime = 0,
				restTime = 1

			representativeInputs = isEmpty( representativeInputs ) ? [] : representativeInputs
			if ( typeof managerTotalTime === "undefined" || typeof representativeInputs === "undefined" ) {
				return A( [
					{ name: "已分配", value: usedTime },
					{ name: "未分配", value: restTime }
				] )
			}
			// usedTime = Number(managerInput.get('strategyAnalysisTime')) +
			//	Number(managerInput.get('adminWorkTime')) +	// 行政工作
			//	Number(managerInput.get('clientManagementTime')) +	// 重点目标客户管理
			//	Number(managerInput.get('kpiAnalysisTime')) +	// 代表及KPI分析
			//	Number(managerInput.get('teamMeetingTime'));	// 团队例会
			usedTime = isEmpty( managerInput ) ? 0 : managerInput.get( "totalManagerUsedTime" )

			representativeInputs.forEach( ele => {
				if ( isEmpty( ele ) ) {
					usedTime += 0
				} else {
					usedTime += Number( ele.get( "assistAccessTime" ) )
					usedTime += Number( ele.get( "abilityCoach" ) )
				}
			} )
			if ( !this.get( "numberVerify" ).test( usedTime ) ) {
				// eslint-disable-next-line ember/no-side-effects
				this.set( "warning", {
					open: true,
					title: "非法值警告",
					detail: "请输入数字！"
				} )
			}
			restTime = managerTotalTime - usedTime
			if ( restTime < 0 ) {
				// eslint-disable-next-line ember/no-side-effects
				this.set( "warning", {
					open: true,
					title: "经理时间超额",
					detail: "经理时间设定已超过限制，请重新分配。"
				} )
			}
			return A( [
				{ name: "已分配", value: usedTime },
				{ name: "未分配", value: restTime < 0 ? 0 : restTime }
			] )
		} ),
	circlePoint: computed( "representativeInputs.@each.{totalPoint}", function () {
		let { managerTotalKpi, representativeInputs } =
			this.getProperties( "managerTotalKpi", "representativeInputs" ),
			usedPoint = 0,
			restPoint = 1

		representativeInputs = isEmpty( representativeInputs ) ? [] : representativeInputs

		if ( typeof managerTotalKpi === "undefined" ) {
			return A( [
				{ name: "已分配", value: usedPoint },
				{ name: "未分配", value: restPoint }
			] )
		}

		representativeInputs.forEach( ele => {
			let totalPoint = isEmpty( ele ) ? 0 : ele.get( "totalPoint" )

			usedPoint += Number( totalPoint )
		} )

		restPoint = managerTotalKpi - usedPoint
		return A( [
			{ name: "已分配", value: usedPoint },
			{ name: "未分配", value: restPoint < 0 ? 0 : restPoint }
		] )
	} ),
	radarData: computed( "tmpRepConf", function () {
		let tmpRepConf = this.get( "tmpRepConf" ),
			representativeId = "",
			originalAbility = [],
			averageAbility = this.get( "averageAbility" ) || [0, 0, 0, 0, 0],
			representativeAbilities = this.get( "representativeAbilities" ),
			reallyAbility = null

		if ( isEmpty( tmpRepConf ) ) {
			return [
				{
					value: [0, 0, 0, 0, 0],
					name: "代表个人能力"
				},
				{
					value: averageAbility,
					name: "团队平均能力"
				}
			]
		}
		// value 按照此顺序
		// { name: '工作积极性', max: 100 },
		// { name: '产品知识', max: 100 },
		// { name: '行为有效性', max: 100 },
		// { name: '区域管理能力', max: 100 },
		// { name: '销售知识', max: 100 }
		representativeId = tmpRepConf.get( "representative.id" )
		representativeAbilities.forEach( ele => {
			if ( ele.get( "representative.id" ) === representativeId ) {
				reallyAbility = ele
			}
		} )
		originalAbility.push( reallyAbility.get( "jobEnthusiasm" ) )
		originalAbility.push( reallyAbility.get( "productKnowledge" ) )
		originalAbility.push( reallyAbility.get( "behaviorValidity" ) )
		originalAbility.push( reallyAbility.get( "regionalManagementAbility" ) )
		originalAbility.push( reallyAbility.get( "salesAbility" ) )
		return [
			{
				value: originalAbility,
				name: "代表个人能力"
			},
			{
				value: averageAbility,
				name: "团队平均能力"
			}
		]
	} ),
	actions: {
		changeState( context, key ) {
			let isOverKpi = this.get( "isOverKpi" ),
				state = Number( context.get( key ) )

			if ( !isOverKpi || state !== 0 ) {
				context.toggleProperty( key )
			} else {
				this.set( "warning", {
					open: true,
					title: "经理行动点数超额",
					detail: "经理无剩余行动点数可供分配。"
				} )
			}
		},
		reInputTime() {
			let managerInput = this.get( "model.managerInput" ),
				representativeInputs = this.get( "model.representativeInputs" )

			managerInput.setProperties( {
				strategyAnalysisTime: "",
				adminWorkTime: "",
				clientManagementTime: "",
				kpiAnalysisTime: "",
				teamMeetingTime: ""
			} )
			representativeInputs.forEach( ele => {
				ele.setProperties( {
					abilityCoach: "",
					assistAccessTime: ""
				} )
			} )
		},
		reInputPoint() {
			let representativeInputs = this.get( "model.representativeInputs" )

			representativeInputs.forEach( ele => {
				ele.setProperties( {
					productKnowledgeTraining: 0,
					salesAbilityTraining: 0,
					regionTraining: 0,
					performanceTraining: 0,
					vocationalDevelopment: 0
				} )
			} )
		}
	}
} )
