import Component from "@ember/component"
import { computed } from "@ember/object"
import { A } from "@ember/array"
import { isEmpty } from "@ember/utils"
import { alias } from "@ember/object/computed"

export default Component.extend( {
	// get validation
	positionalParams: ["resources", "managerAnswer", "answers"],
	numberVerify: /^-?[0-9]\d*$/,
	groupValue: 0,
	center: "center",
	ManagerUsedKpi: alias( "circlePoint.firstObject.value" ),
	ManagerUsedTime: alias( "circleTime.firstObject.value" ),
	validation: "maxMangerTime#100*maxMangerActionPoint#100",
	// validation: ["maxMangerTime#100", "maxMangerActionPoint#100"]

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
		reInputTime() {
			let answers = this.get( "answers" ),
				managerAnswer = this.get( "managerAnswer" )

			answers.forEach( ele => {
				ele.setProperties( {
					strategyAnalysisTime: 0,
					adminWorkTime: 0,
					clientManagementTime: 0,
					kpiAnalysisTime: 0,
					teamMeetingTime: 0,
					abilityCoach: 0,
					assistAccessTime: 0
				} )
			} )
			managerAnswer.setProperties( {
				strategAnalysisTime: 0,
				clientManagementTime: 0,
				adminWorkTime: 0,
				kpiAnalysisTime: 0,
				teamMeetingTime: 0
			} )
		},
		maxMangerTime: function() {
			let rules = this.validation.split( "*" ),
				rule = "",
				answers = this.get( "answers" )

			rules.forEach( e => {
				if ( e.startsWith( "maxMangerTime" ) ) {
					window.console.log( e )
					rule = e
				}
			} )
			let maxMangerTime = Number( rule.split( "#" )[1] )

			answers.forEach( e => {
				let abilityCoach = Number( e.abilityCoach ),
					assistAccessTime = Number( e.assistAccessTime )

				maxMangerTime = maxMangerTime - assistAccessTime - abilityCoach

				if ( isNaN( abilityCoach ) || isNaN( assistAccessTime ) ){
					this.set( "warning", {
						open: true,
						title: "非法值警告",
						detail: "请输入数字！"
					} )
				}
				if ( maxMangerTime < 0 ) {
					this.set( "warning", {
						open: true,
						title: "经理时间超额",
						detail: "经理时间设定已超过限制，请重新分配。"
					} )
				}
			} )

			// []指定周期
			let { strategAnalysisTime, clientManagementTime, adminWorkTime, kpiAnalysisTime, teamMeetingTime } = this.get( "managerAnswer" )

			strategAnalysisTime = Number( strategAnalysisTime )
			clientManagementTime = Number( clientManagementTime )
			adminWorkTime = Number( adminWorkTime )
			kpiAnalysisTime = Number( kpiAnalysisTime )
			teamMeetingTime = Number( teamMeetingTime )


			if ( isNaN( strategAnalysisTime ) ||
			isNaN( clientManagementTime ) ||
			isNaN( adminWorkTime ) ||
			isNaN( kpiAnalysisTime ) ||
			isNaN( teamMeetingTime ) ) {
				this.set( "warning", {
					open: true,
					title: "非法值警告",
					detail: "请输入数字！"
				} )
			} else {
				let all = strategAnalysisTime + clientManagementTime + adminWorkTime + kpiAnalysisTime + teamMeetingTime

				window.console.log( strategAnalysisTime )
				window.console.log( all, maxMangerTime )
				if ( all > maxMangerTime ) {
					this.set( "warning", {
						open: true,
						title: "经理时间超额",
						detail: "经理时间设定已超过限制，请重新分配。"
					} )
				}
			}
		}
	}
} )
