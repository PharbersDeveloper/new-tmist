import Component from "@ember/component"

export default Component.extend( {
	groupValue: "index",
	salesGroupValue: 0,
	actions: {
		linkToRoute( routeCode ) {
			let proposalId = this.get( "proposalId" ),
				route = routeCode === "index" ? "" : routeCode

			this.set( "groupValue", routeCode )
			this.transitionToRoute( "/scenario/" + proposalId + "/reference/" + route )
		},
		changeSalesValue( value ) {
			this.set( "salesGroupValue", value )
		}
	}
} )
