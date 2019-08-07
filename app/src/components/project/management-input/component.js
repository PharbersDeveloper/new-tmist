import Component from "@ember/component"
import { computed } from "@ember/object"

export default Component.extend( {
	positionalParams: ["project", "period", "resources", "answers"],
	groupValue: 0,
	currentResource: 0,
	quizs: computed( "resources", "answers", function () {
		return this.resources.map( item => {
			const one = this.answers.find( x => x.get( "resource.id" ) === item.get( "id" ) )

			return { resource: item, answer: one }
		} )
	} )
} )
