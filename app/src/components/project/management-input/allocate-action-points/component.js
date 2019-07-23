import Component from "@ember/component"
import { computed } from "@ember/object"

export default Component.extend( {
	positionalParams: ["resources", "answers"],
	quizs: computed("resources", "answers", function() {
		return this.resources.map( item => {
			const one = this.answers.find(x => x.get("resource.id") === item.get("id"))
			return { resource: item, answer: one }
		})
	} ),
	actions: {
		changeState( context, key ) {
			let isOverKpi = this.get( "isOverKpi" ),
				state = Number( context.get( key ) )

			if ( !isOverKpi || state !== 0 ) {
				context.toggleProperty( key )
			} else {
				this.set( "warning", {
					open: true,
					title: "经理行动点数超额",
					detail: "经理无剩余行动点数可供分配。"
				} )
			}
		},
		reInputTime() {
			let managerInput = this.get( "model.managerInput" ),
				representativeInputs = this.get( "model.representativeInputs" )

			managerInput.setProperties( {
				strategyAnalysisTime: "",
				adminWorkTime: "",
				clientManagementTime: "",
				kpiAnalysisTime: "",
				teamMeetingTime: ""
			} )
			representativeInputs.forEach( ele => {
				ele.setProperties( {
					abilityCoach: "",
					assistAccessTime: ""
				} )
			} )
		},
		reInputPoint() {
			let representativeInputs = this.get( "model.representativeInputs" )

			representativeInputs.forEach( ele => {
				ele.setProperties( {
					productKnowledgeTraining: 0,
					salesAbilityTraining: 0,
					regionTraining: 0,
					performanceTraining: 0,
					vocationalDevelopment: 0
				} )
			} )
		}
	}
} )
