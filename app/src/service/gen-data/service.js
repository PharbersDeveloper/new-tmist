import Service from "@ember/service"
import { inject as service } from "@ember/service"
import { formatPhaseToDate, formatPhaseToStringDefault } from "new-tmist/utils/format-phase-date"

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
			lastUpdate: Date.now(),
			periods: []
		} ).save()
	},
	genPeriodWithProject( aProject ) {
		// const last = aProject.periods.lastObject ? aProject.periods.lastObject : null
		let base = aProject.proposal.get( "periodBase" ),
			step = aProject.proposal.get( "periodStep" ),

			periodName = formatPhaseToStringDefault( formatPhaseToDate( base, step, aProject.periods.length ) ),

			result = this.store.createRecord( "model.period", {
				name: periodName,
				answers: [],
				phase: aProject.periods.length
			} ).save()

		result.then( x => {
			aProject.get( "periods" ).pushObject( x )
			aProject.save()
		} )
		return result
	}
} )
