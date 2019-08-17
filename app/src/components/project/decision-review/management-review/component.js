import Component from "@ember/component"
import { computed } from "@ember/object"

export default Component.extend( {
	positionalParams: ["proposol", "project", "hospitals", "resources", "products", "answers"],
	classNames: ["management-review-wrapper"],
	periodRange: computed("periodLength", function() {
		return Array(this.periodLength).fill().map((e,i)=>i)
	} ),
	periodLength: computed("project", function() {
		return this.project.periods.length
	} ),
	curPeriodIndex: computed("project", function() {
		return this.project.periods.length - 1
	} ),
	curPeriod: computed("curPeriodIndex", function() { 
		return this.project.periods.objectAt(this.curPeriodIndex)
	} ),
	curAnswers: computed("curPeriod", function() {
		// const condi01 = "(proposalId,:eq,`" + x.id + "`)"
		// const condi02 = "(phase,:eq,-1)"
		// const condi = "(:and," + condi01 + "," + condi02 + ")"
		// return this.store.query("model/answer", { filter: })
		if (this.curPeriodIndex === 0) {
			return this.answers
		} else {
			return []
		}
	} ),
	managerAnswers: computed("curAnswers", function() {
		return this.curAnswers.filter(x => x.category === "Management").firstObject
	} ),
	resourceAnswers: computed("curAnswers", function() {
		return this.curAnswers.filter(x => x.category === "Resource")
	} ),
	totalTime: computed("resourceAnswers", function() {
		let result = 0
		this.resourceAnswers.forEach(it => {
			result += it.abilityCoach + it.assistAccessTime
		});
		return result
	} )

} )
