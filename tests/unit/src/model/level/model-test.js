import { module, test } from "qunit"
import { setupTest } from "ember-qunit"

module( "Unit | Model | model/level", function( hooks ) {
	setupTest( hooks )

	// Replace this with your real tests.
	test( "it exists", function( assert ) {
		let store = this.owner.lookup( "service:store" ),
			model = store.createRecord( "model/level", {} )

		assert.ok( model )
	} )
} )
