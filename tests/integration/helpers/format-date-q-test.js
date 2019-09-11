import { module, test } from "qunit"
import { setupRenderingTest } from "ember-qunit"
import { render } from "@ember/test-helpers"
import hbs from "htmlbars-inline-precompile"

module( "Integration | Helper | format-date-q", function( hooks ) {
	setupRenderingTest( hooks )

	// Replace this with your real tests.
	test( "it renders", async function( assert ) {
		this.set( "inputValue", "1234" )

		await render( hbs`{{format-date-q inputValue}}` )

		assert.equal( this.element.textContent.trim(), "1234" )
	} )
} )
