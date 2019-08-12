import Component from "@ember/component"
import { computed, set } from "@ember/object"

export default Component.extend( {
	positionalParams: ["resource", "answers", "selectResource", "resourceHospital", "curResource"],
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
	leftTime: computed( "resourceHospital", function() {
		let all = 0


		this.answers.filter( a => a.get( "resource.id" ) === this.resource.id ).forEach( a => {
			all += this.transNumber( a.get( "visitTime" ) )
		} )

		return 100 - all
	} ),
	transNumber( input ) {
		let number = Number( input )

		if ( isNaN( number ) || number === -1 ) {
			return 0
		} else {
			return number
		}
	},
	actions: {
		showContent( rs ) {
			// this.toggleProperty( "showContent" )
			// this.set( "curResource", rs )
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
				set( this, "leftTime", 100 - all )
			}
			// this.resource.get("totalTiem")
			// set( this.resource, "totalTime", this.leftTime )
		}
	}
} )
