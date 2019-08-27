import Component from "@ember/component"
import groupBy from "ember-group-by"
import { computed } from "@ember/object"
import { A } from "@ember/array"
export default Component.extend( {
	classNames: "input-mapping",
	// localClassNameBindings: A( ["input-mapping"] ),
	positionalParams: ["project", "presets", "answers", "reports"],
	p: groupBy( "presets", "hospital.id" ),
	res: computed( "p", "answers", function() {
		if ( this.p && this.answers ) {
			return this.p.sortBy( "value" ).map( item => {
				const result = item.items.map( preset => {
					const tmp = this.answers.find( ans => {
							const ts = ans.belongsTo( "target" ).id() === preset.belongsTo( "hospital" ).id(),
								ps = ans.belongsTo( "product" ).id() === preset.belongsTo( "product" ).id(),
								bs = ans.get( "category" ) === "Business"

							return ts && ps && bs
						} ),

					 report = this.reports.filter( r => r.get( "hospital.id" ) === tmp.get( "target.id" ) && r.get( "product.id" ) === tmp.get( "product.id" ) ).get( "firstObject" )

					return { preset: preset, answer: tmp , report: report }
				} )

				return result ? { hospital: result.get( "firstObject.answer.target" ), quizs: result } : {}
			} )
		} else {
			return []
		}
	} )
} )
