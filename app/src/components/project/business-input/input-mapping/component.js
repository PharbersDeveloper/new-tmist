import Component from "@ember/component"
import groupBy from "ember-group-by"
import { computed } from "@ember/object"

export default Component.extend( {
	positionalParams: ["project", "presets", "answers"],
	p: groupBy( "presets", "hospital.id" ),
	res: computed( "p", "answers", function() {
		if ( this.p && this.answers) {
			return this.p.sortBy( "value" ).map( item => {
				const result = item.items.map( preset => {
					const tmp = this.answers.find( ans => {
						const ts = ans.belongsTo( "target" ).id() === preset.belongsTo( "hospital" ).id(),
							ps = ans.belongsTo( "product" ).id() === preset.belongsTo( "product" ).id(),
							bs = ans.get( "category" ).isBusiness

						return ts && ps && bs
					} )

					return { preset: preset, answer: tmp }
				} )
		
				return result ? { hospital: result.get( "firstObject.answer.target" ), quizs: result } : {}
			} )
		} else {
			return []
		}
	} )
} )
