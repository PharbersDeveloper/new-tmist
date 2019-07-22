import Object from "@ember/object"

export default Object.extend( {
	currentProposalRef: null,
	store: null,
	init( aProposalRef ) {
		this._super( ...arguments )
		this.set( "currentProposalRef", aProposalRef )
	},
	async getPresetsWithCurrentPeriod( aPeriod ) {
		const lp = aPeriod.belongsTo( "last" )

		if ( lp.id() === null ) {
			return this.currentProposalRef.load().then( x => x.hasMany( "presets" ) )
		} else {
			return lp.load().then( x => x.hasMany( "presets" ) )
		}
	},
	async getBusinessAnswerCount( aPeriod ) {
		return this.getPresetsWithCurrentPeriod( aPeriod ).length
	},
	async genBusinessOperatorAnswer( answers, aPeriod ) {
		let prs = await this.getPresetsWithCurrentPeriod( aPeriod )
		const ids = prs.ids()
		let count = ids.length
		const fid = ids.map( x => {
			return "`" + `${x}` + "`"
		} ).join( "," )

		return this.store.query( "model/preset", { filter: "(id,:in," + "[" + fid + "]" + ")"} )
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
		return answers.map( item => {
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
	}
} )
