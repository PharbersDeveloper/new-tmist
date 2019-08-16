import Component from "@ember/component"
import { computed, set } from "@ember/object"

export default Component.extend( {
	positionalParams: ["project", "period", "resources", "answers", "quota", "managerAnswer"],
	groupValue: 0,
	currentResource: 0,
	quizs: computed( "resources", "answers", function () {
		window.console.log( this.answers )
		return this.resources.map( item => {
			const one = this.answers.find( x => x.get( "resource.id" ) === item.get( "id" ) )

			return { resource: item, answer: one }
		} )
	} ),
	maxManagerTime: computed( "quota", function () {
		return this.quota.get( "mangementHours" )
	} ),
	maxActionPoints: computed( "quota", function() {
		return this.quota.get( "managerKpi" )
	} ),
	curManagerTime: computed( "answers", "managerAnswer", function () {
		let cur = 0,
			resourceTime = 0

		cur += this.transNumber( this.managerAnswer.get( "strategAnalysisTime" ) )
		cur += this.transNumber( this.managerAnswer.get( "clientManagementTime" ) )
		cur += this.transNumber( this.managerAnswer.get( "adminWorkTime" ) )
		cur += this.transNumber( this.managerAnswer.get( "kpiAnalysisTime" ) )
		this.answers.forEach( answer => {
			resourceTime += this.transNumber( answer.get( "abilityCoach" ) )
			resourceTime += this.transNumber( answer.get( "assistAccessTime" ) )

			cur += this.transNumber( answer.get( "abilityCoach" ) )
			cur += this.transNumber( answer.get( "assistAccessTime" ) )
		} )
		set( this, "curResourceTime", resourceTime )
		return cur
	} ),
	curManagerActionPoints: computed( "answers", function () {
		let cur = 0

		this.answers.forEach( answer => {
			cur += this.transNumber( answer.get( "productKnowledgeTraining" ) )
			cur += this.transNumber( answer.get( "salesAbilityTraining" ) )
			cur += this.transNumber( answer.get( "regionTraining" ) )
			cur += this.transNumber( answer.get( "performanceTraining" ) )
			cur += this.transNumber( answer.get( "vocationalDevelopment" ) )
		} )
		return cur
	} ),
	curResourceTime: 0,
	transNumber( value ) {
		let number = Number( value )

		if ( number === -1 || isNaN( number ) ) {
			return 0
		} else {
			return number
		}
	},
	checkNumber( value ) {
		if ( isNaN( Number( value ) ) ) {
			this.set( "warning", {
				open: true,
				title: "非法值警告",
				detail: "请输入数字！"
			} )
			return false
		}
		return true
	},
	actions: {
		validationInputMangerTime( obj, inputValue ) {
			let isNumber = this.checkNumber( obj.get( inputValue ) ),
				value = this.transNumber( obj.get( inputValue ) )

			if ( isNumber ) {
				let cur = 0,
					resourceTime = 0

				cur += this.transNumber( this.managerAnswer.get( "strategAnalysisTime" ) )
				cur += this.transNumber( this.managerAnswer.get( "clientManagementTime" ) )
				cur += this.transNumber( this.managerAnswer.get( "adminWorkTime" ) )
				cur += this.transNumber( this.managerAnswer.get( "kpiAnalysisTime" ) )
				cur += this.transNumber( this.managerAnswer.get( "teamMeetingTime" ) )
				this.answers.forEach( answer => {
					resourceTime += this.transNumber( answer.get( "abilityCoach" ) )
					resourceTime += this.transNumber( answer.get( "assistAccessTime" ) )

					cur += this.transNumber( answer.get( "abilityCoach" ) )
					cur += this.transNumber( answer.get( "assistAccessTime" ) )
				} )
				if ( value <= this.maxManagerTime ) {

					set( this, "curResourceTime", resourceTime )
					set( this , "curManagerTime", cur )
					// this.curManagerTime += value
					window.console.log( this.curManagerTime, value )
				} else {
					window.console.log()
					this.set( "warning", {
						open: true,
						title: "设定超额",
						detail: "经理时间设定已超过限制，请重新分配。"
					} )
				}
			} else {
				obj.set( inputValue, 0 )
			}

		},
		validationManagerActionPoints() {
			let cur = 0

			this.answers.forEach( answer => {
				cur += this.transNumber( answer.get( "productKnowledgeTraining" ) )
				cur += this.transNumber( answer.get( "salesAbilityTraining" ) )
				cur += this.transNumber( answer.get( "regionTraining" ) )
				cur += this.transNumber( answer.get( "performanceTraining" ) )
				cur += this.transNumber( answer.get( "vocationalDevelopment" ) )
			} )
			if ( cur <= this.maxActionPoints ) {
				set( this , "curManagerActionPoints", cur )
				return true
			} else {
				this.set( "warning", {
					open: true,
					title: "设定超额",
					detail: "经理无剩余行动点数可供分配。"
				} )
				return false
			}
		}
	}
} )
