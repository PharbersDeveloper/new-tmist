import Component from "@ember/component"
import { computed } from "@ember/object"
import { A } from "@ember/array"

export default Component.extend( {
	positionalParams: ["proposol", "project", "hospitals", "resources", "products", "answers", "quota"],
	classNames: ["management-review-wrapper"],
	maxManagerTime: computed( "quota", function () {
		return Number( this.quota.get( "mangementHours" ) )
	} ),
	periodRange: computed( "periodLength", function() {
		return Array( this.periodLength ).fill().map( ( e,i )=>i )
	} ),
	periodLength: computed( "project", function() {
		return this.project.periods.length
	} ),
	curPeriodIndex: computed( "project", function() {
		return this.project.periods.length - 1
	} ),
	curPeriod: computed( "curPeriodIndex", function() {
		return this.project.periods.objectAt( this.curPeriodIndex )
	} ),
	curAnswers: computed( "curPeriod", function() {
		// const condi01 = "(proposalId,:eq,`" + x.id + "`)"
		// const condi02 = "(phase,:eq,-1)"
		// const condi = "(:and," + condi01 + "," + condi02 + ")"
		// return this.store.query("model/answer", { filter: })
		if ( this.curPeriodIndex === 0 ) {
			return this.answers
		} else {
			return []
		}
	} ),
	managerAnswers: computed( "curAnswers", function() {
		return this.curAnswers.filter( x => x.category === "Management" ).firstObject
	} ),
	resourceAnswers: computed( "curAnswers", function() {
		return this.curAnswers.filter( x => x.category === "Resource" )
	} ),
	transNumber( value ) {
		let num = Number( value )

		if ( !isNaN( num ) ) {
			return num
		}
		return 0
	},
	totalTime: computed( "resourceAnswers", function() {
		let result = 0

		this.resourceAnswers.forEach( it => {
			result += this.transNumber( it.abilityCoach ) + this.transNumber( it.assistAccessTime )
		} )
		return result
	} ),
	allTime: computed( "resourceAnswers", "managerAnswers",function() {
		let result = 0

		this.resourceAnswers.forEach( it => {
			result += this.transNumber( it.abilityCoach ) + this.transNumber( it.assistAccessTime )
		} )

		result += this.transNumber( this.managerAnswers.get( "strategAnalysisTime" ) )
		result += this.transNumber( this.managerAnswers.get( "clientManagementTime" ) )
		result += this.transNumber( this.managerAnswers.get( "kpiAnalysisTime" ) )
		result += this.transNumber( this.managerAnswers.get( "adminWorkTime" ) )
		result += this.transNumber( this.managerAnswers.get( "teamMeetingTime" ) )

		return result
	} ),
	circleData: computed( "maxManagerTime", "allTime", function() {
		let arr = [],
			value = this.maxManagerTime - this.allTime

		arr.push( {name: "业务策略分析", value: this.managerAnswers.strategAnalysisTime} )
		arr.push( {name: "重点目标客户管理", value: this.managerAnswers.clientManagementTime} )
		arr.push( {name: "代表及KPI分析", value: this.managerAnswers.kpiAnalysisTime} )
		arr.push( {name: "行政工作", value: this.managerAnswers.adminWorkTime} )
		arr.push( {name: "团队例会", value: this.managerAnswers.teamMeetingTime} )
		arr.push( {name: "代表能力辅导与协访", value: this.totalTime} )

		if ( value >= 0 ) {
			arr.push( {name: "未分配", value: value} )
		}


		return A( arr )
	} ),
	legendData: computed( "circleData", "maxManagerTime", "allTime", function () {
		let arr = this.circleData,
			value = this.maxManagerTime - this.allTime

		if ( arr.length === 7 ) {
			return arr
		} else {

			window.console.log( this.maxManagerTime, this.allTime, value )
			arr.push( {name: "未分配", value: value} )
			return arr
		}

	} ),
	circleSize: A( ["70%", "95%"] ),
	circleColor: A( ["#008DA6", "#00A3BF", "#00B8D9", "#79E2F2", "#B3F5FF", "#FFC400", "#DFE1E6"] ),
	circleDataZero: A( [{name: "未分配", value: "0"}] ),
	circleColorZero: A( ["#DFE1E6"] )

} )
