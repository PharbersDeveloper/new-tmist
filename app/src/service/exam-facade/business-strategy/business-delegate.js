import Object from "@ember/object"

export default Object.extend( {
	currentProposal: null,
	store: null,
	init( aProposal ) {
		this._super( ...arguments )
		this.set( "currentProposal", aProposal )
	},
	async getPresetsWithCurrentPeriod( aPeriod ) {
		if ( aPeriod.last.content === null ) {
			return this.currentProposal.then( x => {
				return x.presets
			} )
		} else {
			return aPeriod.last.then( x => {
				x.presets
			}
			)
		}
	},
	async getBusinessAnswerCount( aPeriod ) {
		return this.getPresetsWithCurrentPeriod( aPeriod ).then( x => {
			return x.length
		} )
	},
	async genBusinessOperatorAnswer( answers, aPeriod ) {
		let presets = await this.getPresetsWithCurrentPeriod( aPeriod ),
			count = presets.length
		const ids = presets.map( x => x.id )

		return Promise.all( ids.map( id =>
			this.store.findRecord( "model/preset", id ) ) )
			.then( presets=> {
				if ( answers.length !== count ) {
					return presets.map( preset => {
						return this.store.createRecord( "model/answer", {
							category: "Business",
							target: preset.hospital,
							product: preset.product
						} )
					} )
				} else {
					return this.optAnswersFromCurrentAnswer( answers )
				}
			} )
	},
	async optAnswersFromCurrentAnswer( answers ) {
		let ids = answers.map( answer => answer.id )

		return Promise.all( ids.map( id => {
			return this.store.findRecord( "model/answer", id )
		} ) ).then( vals => {
			return vals.map( item => {
				return this.store.createRecord( "model/answer", {
					category: item.category,
					target: item.target,
					product: item.product,
					salesTarget: item.salesTarget,
					budget: item.budget,
					meetingPlaces: item.meetingPlaces,
					resource: item.resource
				} )
			} )
		} )
	}
} )