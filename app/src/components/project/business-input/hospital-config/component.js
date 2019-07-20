import Component from "@ember/component"

export default Component.extend( {
	positionalParams: ["hospital", "products", "resources"],
	actions: {
		changedRep( item ) {
			// debugger
			// let businessinput = this.get('businessinput');

			// this.set('tmpRc', item);
			// businessinput.setProperties({
			// 	resourceConfigId: item.id,
			// 	resourceConfig: item
			// });
			Ember.Logger.info( `change resources ${item.name}` )
		},
		reInput() {
			let businessinput = this.get( "businessinput" )

			this.set( "tmpRc", null )
			businessinput.setProperties( {
				resourceConfigId: "",
				resourceConfig: null,
				visitTime: "",
				meetingPlaces: 0,
				salesTarget: "",
				budget: ""
			} )
		}
	}
} )
