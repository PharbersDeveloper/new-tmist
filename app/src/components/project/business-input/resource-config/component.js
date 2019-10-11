import Component from "@ember/component"
import { computed, set } from "@ember/object"
// import Service from "@ember/service"
import { inject as service } from "@ember/service"
import { A } from "@ember/array"


export default Component.extend( {
	picOSS: service( "service/pic-oss" ),
	runtimeConfig: service( "service/runtime-config" ),
	positionalParams: ["resource", "answers", "selectResource", "resourceHospital", "curResource", "project"],
	classNames: ["resource-config-wrapper"],
	showContent: computed( "curResource", function() {
		if ( !this.curResource ) {
			return true
		} else if ( this.curResource.get( "id" ) === this.resource.get( "id" ) ) {
			return false
		}
	} ),
	hospitalList: computed( "resourceHospital", function() {
		// let hospitals = []
		return this.answers.filter( a => a.get( "resource.id" ) === this.resource.id ).uniqBy( "target.id" )
	} ),
	hospitalNumber: computed( "hospitalList", function() {
		// let hospitals = []
		return this.hospitalList.length
	} ),
	inputVisitTime: false,
	leftTime: computed( "inputVisitTime", function() {
		let all = 0


		this.answers.filter( a => a.get( "resource.id" ) === this.resource.id ).forEach( a => {
			all += this.transNumber( a.get( "visitTime" ) )
		} )

		return all
	} ),
	transNumber( input ) {
		let number = Number( input )

		if ( isNaN( number ) ) {
			return 0
		} else {
			return number
		}
	},
	isNumber( input ) {
		return !isNaN( Number( input ) )
	},
	labelEmphasis: false,
	circleVisitTimeData: computed( "leftTime", function() {
		return A( [
			{value: this.leftTime, name: "已分配时间"},
			{value: 100 - this.leftTime, name: "未分配时间"}
		] )
	} ),
	circleVisitTimeColor: computed( function() {
		return A( ["#3881FF", " #DFE1E6"] )
	} ),
	circleVisitTimeSize: computed( function() {
		return ["6", "8"]
	} ),
	actions: {
		showContent( rs ) {
			// this.toggleProperty( "showContent" )
			// this.set( "curResource", rs )
			this.runtimeConfig.set( "popover",false )
			this.selectResource( rs )
		},
		inputVisitTime( curAns ) {
			let all = 0,
				name = this.resource.get( "name" )

			if ( this.isNumber( curAns.get( "visitTime" ) ) ) {

				if ( String( curAns.get( "visitTime" ) ).indexOf( "." ) !== -1 ) {
					curAns.set( "visitTime", 0 )
					this.set( "warning", {
						open: true,
						title: "非法输入",
						detail: "请输入正整数。"
					} )
				}

				this.answers.filter( a => a.get( "resource.id" ) === this.resource.id ).forEach( a => {
					all += this.transNumber( a.get( "visitTime" ) )
				} )


				if ( all > 100 ) {
					this.set( "warning", {
						open: true,
						title: "设定超额",
						detail: `${name}的拜访时间已超过总时间限制，请合理分配。`
					} )
					set( this, "leftTime", 100 )
				} else {
					set( this, "leftTime", all )
				}


			} else {
				curAns.set( "visitTime", 0 )
				this.set( "warning", {
					open: true,
					title: "非法输入",
					detail: "请输入正整数。"
				} )
			}


			this.toggleProperty( "inputVisitTime" )
			// this.resource.get("totalTiem")
			// set( this.resource, "totalTime", this.leftTime )
		}
	}
} )
