import { module, test } from "qunit"
import { setupTest } from "ember-qunit"

module( "Unit | Route | page/index", function( hooks ) {
	setupTest( hooks )

	test( "it exists", function( assert ) {
		let route = this.owner.lookup( "route:page/index" )

		assert.ok( route )
	} )
} )
