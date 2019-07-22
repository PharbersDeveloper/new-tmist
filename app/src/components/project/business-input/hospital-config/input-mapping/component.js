import Component from "@ember/component"
import groupBy from "ember-group-by"
import { computed } from "@ember/object"
import { inject as service } from "@ember/service"

export default Component.extend( {
	positionalParams: ["project", "exam"],
	store: service(),
	didInsertElement() {
		const proposal = this.project.belongsTo( "proposal" )

		proposal.load().then( p => {
			const pts = p.hasMany( "presets" ),
				ids = pts.ids(),
				fid = ids.map( x => {
					return "`" + `${x}` + "`"
				} ).join( "," )

			this.store.query( "model/preset", { filter: "(id,:in," + "[" + fid + "]" + ")"} ).then( presets => {
				this.set( "presets", presets )
			} )
		} )
	},
	presets: null,
	p: groupBy( "presets", "hospital.id" ),
	res: computed( "p", "exam.bs.operationAnswers", function() {
		if ( this.p && this.exam.bs.operationAnswers ) {
			return this.p.sortBy( "value" ).map( item => {
				const result = item.items.map( preset => {
					const tmp = this.exam.bs.operationAnswers.find( ans => {
						const ts = ans.belongsTo( "target" ).id() === preset.belongsTo( "hospital" ).id(),
							ps = ans.belongsTo( "product" ).id() === preset.belongsTo( "product" ).id()

						return ts && ps
					} )

					return { preset: preset, answer: tmp }
				} )

				
				return result ? { hospital: result.firstObject.answer.target, quizs: result } : {}
			} )
		} else {
			return []
		}
	} )
} )
