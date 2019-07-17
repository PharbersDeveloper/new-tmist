import { module, test } from "qunit"
import { setupTest } from "ember-qunit"

module( "Unit | Route | page/welcome", function( hooks ) {
	setupTest( hooks )

	test( "it exists", function( assert ) {
		let route = this.owner.lookup( "route:page/welcome" )

		assert.ok( route )
	} )
} )
