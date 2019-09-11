import EmberObject from "@ember/object"
import GenerateChartConfigMixin from "new-tmist/mixins/generate-chart-config"
import { module, test } from "qunit"

module( "Unit | Mixin | generate-chart-config", function() {
	// Replace this with your real tests.
	test( "it works", function ( assert ) {
		let GenerateChartConfigObject = EmberObject.extend( GenerateChartConfigMixin ),
			subject = GenerateChartConfigObject.create()

		assert.ok( subject )
	} )
} )
