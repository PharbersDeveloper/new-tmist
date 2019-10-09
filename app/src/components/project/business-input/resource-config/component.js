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

		if ( isNaN( number ) || number === -1 ) {
			return 0
		} else {
			return number
		}
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
		inputVisitTime() {
			let all = 0,
				name = this.resource.get( "name" )

			this.answers.filter( a => a.get( "resource.id" ) === this.resource.id ).forEach( a => {
				all += this.transNumber( a.get( "visitTime" ) )
			} )

			if ( all > 100 ) {
				this.set( "warning", {
					open: true,
					title: "设定超额",
					detail: `${name}的拜访时间已超过总时间限制，请合理分配。`
				} )
				set( this, "leftTime", 0 )
			} else {
				set( this, "leftTime", all )
			}
			this.toggleProperty( "inputVisitTime" )
			// this.resource.get("totalTiem")
			// set( this.resource, "totalTime", this.leftTime )
		}
	}
} )
