import Component from "@ember/component"
import { computed, set } from "@ember/object"
import { A } from "@ember/array"
import { inject as service } from "@ember/service"

export default Component.extend( {
	picOSS: service( "service/pic-oss" ),
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
		cur += this.transNumber( this.managerAnswer.get( "teamMeetingTime" ) )
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
	circleResourceTime: computed( function() {
		return this.getResourceTimeData()
	} ),
	// circleSize: A( [42, 56] ),
	// circleColor: A( ["#FFC400", "#73ABFF", "#FF8F73", "#79E2F2", "#998DD9", "#57D9A3"] ),
	noTimeCircle: A( ["#ebecf0"] ),
	timeCircleColor: A( ["#FFC400", "#73ABFF", "#FF8F73", "#79E2F2", "#998DD9", "#57D9A3"] ),
	transNumber( value ) {
		let number = Number( value )

		if ( number === -1 || isNaN( number ) ) {
			return 0
		} else {
			return number
		}
	},
	checkNumber( value ) {
		if ( isNaN( Number( value ) ) || String( value ).indexOf( "." ) !== -1 ) {
			this.set( "warning", {
				open: true,
				title: "非法值警告",
				detail: "请输入正整数。"
			} )
			return false
		}
		return true
	},
	getResourceTimeData() {
		let arr = []


		// if ( this.curResourceTime > 0 ) {
		// set( this, "circleColor", this.timeCircleColor )

		this.answers.filter( rs => rs.get( "category" ) === "Resource" ).forEach( r => {
			let obj = {}

			obj.name = r.get( "resource.name" )
			obj.value = this.transNumber( r.get( "abilityCoach" ) ) + this.transNumber( r.get( "assistAccessTime" ) )

			arr.push( obj )
		} )

		arr.sort( ( x,y ) => {
			return y.value - x.value
		} )
		// } else {
		// 	set( this, "circleColor", this.noTimeCircle )
		// 	arr.push( {name: "未分配", value: 100} )
		// }

		return A( arr )
	},
	actions: {
		validationInputMangerTime( obj, inputValue ) {
			let isNumber = this.checkNumber( obj.get( inputValue ) ),
				value = this.transNumber( obj.get( inputValue ) )

			if ( !isNumber ) {
				obj.set( inputValue, 0 )
			}

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

			set( this, "curResourceTime", resourceTime )
			set( this , "curManagerTime", cur )

			let timeArr = this.getResourceTimeData()

			timeArr.sort( ( x,y ) => {
				return y.value - x.value
			} )

			set( this , "circleResourceTime", timeArr )
			if ( cur > this.maxManagerTime ) {
				// this.curManagerTime += value
				// window.console.log( this.curManagerTime, value )
				window.console.log()
				set( this, "curResourceTime", resourceTime )
				set( this , "curManagerTime", cur )
				this.set( "warning", {
					open: true,
					title: "设定超额",
					detail: "经理时间设定已超过限制，请重新分配。"
				} )
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
