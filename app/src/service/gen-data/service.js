import Service from "@ember/service"
import { inject as service } from "@ember/service"

export default Service.extend({
	store: service(),
	cookies: service(),
	genProjectWithProposal(aProposal) {
		return this.store.createRecord("model.project", {
			accountId: this.cookies.read("account_id"),
			proposal: aProposal,
			current: 0,
			pharse: aProposal.get("totalPhase"),
			status: 0,
			lastUpdate: Date.now(),
			periods: []
		}).save()
	},
	genPeriodWithProject(aProject) {
		// const last = aProject.periods.lastObject ? aProject.periods.lastObject : null
		let result = this.store.createRecord("model.period", {
			name: "alfred test",
			answers: [],
			pharse: aProject.periods.length
		}).save()

		result.then(x => {
			aProject.periods.pushObject(x)
			aProject.save()
		})
		return result
	}
})
