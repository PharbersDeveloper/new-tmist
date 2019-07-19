import Service from "@ember/service"
import { inject as service } from "@ember/service"

export default Service.extend( {
	store: service(),
	cookies: service(),
	genProjectWithProposal( aProposal ) {
		return this.store.createRecord( "model.project", {
			accountId: this.cookies.read( "account_id" ),
			proposal: aProposal,
			current: 0,
			pharse: aProposal.get( "totalPhase" ),
			status: 0,
			lastUpdate: Date.now()
		} ).save()
	},
	genPeriodWithProject( aProject ) {
		return this.store.createRecord( "model.period", {
			answers: []
		} ).save()
	}
} )
