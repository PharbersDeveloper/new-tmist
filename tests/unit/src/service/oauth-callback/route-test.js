import { module, test } from "qunit"
import { setupTest } from "ember-qunit"

module( "Unit | Route | service/oauth-callback", function( hooks ) {
	setupTest( hooks )

	test( "it exists", function( assert ) {
		let route = this.owner.lookup( "route:service/oauth-callback" )

		assert.ok( route )
	} )
} )
