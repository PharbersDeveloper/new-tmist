import Object from "@ember/object"

export default Object.extend( {
	currentAnswers: null,
	store: null,
	currentProposalRef: null,
	init( aProposalRef ) {
		this._super( ...arguments )
		this.set( "currentProposalRef", aProposalRef )
	},
	async getPresetsRefWithCurrentPeriod( aPeriod ) {
		const lp = aPeriod.belongsTo( "last" )

		if ( lp.id() === null ) {
			return this.currentProposalRef.load().then( x => x.hasMany( "presets" ) )
		} else {
			return lp.load().then( x => x.hasMany( "presets" ) )
		}
	},
	async getBusinessAnswerCount( aPeriod ) {
		return this.getPresetsRefWithCurrentPeriod( aPeriod ).length
	},
	async getCurrentPresetsWithPeriod( aPeriod ) {
		let prs = await this.getPresetsRefWithCurrentPeriod( aPeriod )
		const ids = prs.ids()
		const fid = ids.map( x => {
			return "`" + `${x}` + "`"
		} ).join( "," )

		return this.store.query( "model/preset", { filter: "(id,:in," + "[" + fid + "]" + ")"} )

	},
	async answersForPresets ( period, presets ) {
		const fid = period.hasMany( "answers" ).ids().map( x => {
			return "`" + `${x}` + "`"
		} ).join( "," )

		return this.store.query( "model/answer", { filter : "(id,:in," + "[" + fid + "]" + ")" } )
			.then( answers => {
				this.set( "currentAnswers", answers )
				const count = presets.length
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