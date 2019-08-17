import Component from "@ember/component"
import { computed } from "@ember/object"

export default Component.extend( {
	positionalParams: ["proposol", "project", "hospitals", "resources", "products", "answers"],
	classNames: ["business-review-wrapper"],
	curProd: null,
	curRes: null,
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
	filterAnswers: computed("curAnswers", "curProd", "curRes", function() {
		let result = this.curAnswers.filter(x => x.category === "Business")
		if (this.curProd) {
			result = result.filter(x => x.get("product.id") === this.curProd.get("id"))
		}

		if (this.curRes) {
			result = result.filter(x => x.resource.get("id") === this.curRes.get("id"))
		}
		return result
	} )
} )
