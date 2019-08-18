import { module, test } from "qunit"
import { setupTest } from "ember-qunit"

module( "Unit | Model | model/resource", function( hooks ) {
	setupTest( hooks )

	// Replace this with your real tests.
	test( "it exists", function( assert ) {
		let store = this.owner.lookup( "service:store" ),
			model = store.createRecord( "model/resource", {} )

		assert.ok( model )
	} )
} )
