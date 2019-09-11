import Object from "@ember/object"
import { A } from "@ember/array"

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
	async getCurrentPresetsWithPeriod( aPeriod, aProposal, phase ) {
		const condi01 = "(proposalId,:eq,`" + aProposal.value().get( "id" ) + "`)",
			condi02 = "(category,:eq,`8`)",
			condi03 = "(category,:eq,`4`)",
			condior = "(:or," + condi02 + "," + condi03 + ")",
			fc = "(:and," + condi01 + "," + condior + ")"

		return this.store.query( "model/preset", { filter: fc } )

	},
	async answersForPresets ( period, presets, resources ) {
		const fid = period.hasMany( "answers" ).ids().map( x => {
			return "`" + `${x}` + "`"
		} ).join( "," )

		return this.store.query( "model/answer", { filter : "(id,:in," + "[" + fid + "]" + ")" } )
			.then( answers => {
				this.set( "currentAnswers", answers )
				if ( answers.length === 0 ) {
					/**
				 	 * business input
					 */
					let result = A( [] )
					const bsi = presets.map( preset => {
							return this.store.createRecord( "model/answer", {
								category:  "Business",
								target: preset.hospital,
								product: preset.product
							} )
						} ),

					 rsi = resources.map( resource => {
							return this.store.createRecord( "model/answer", {
								category: "Resource",
								resource: resource
							} )
						} ),

					 msi = this.store.createRecord( "model/answer", {
							category: "Management"
					 } )

					result.addObjects( bsi )
					result.addObjects( rsi )
					result.addObject( msi )
					return result
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
				resource: item.resource,
				// add row
				visitTime: item.visitTime,
				productKnowledgeTraining: item.productKnowledgeTraining,
				vocationalDevelopment: item.vocationalDevelopment,
				regionTraining: item.regionTraining,
				performanceTraining: item.performanceTraining,
				salesAbilityTraining: item.salesAbilityTraining,
				assistAccessTime: item.assistAccessTime,
				abilityCoach: item.abilityCoach,
				strategAnalysisTime: item.strategAnalysisTime,
				adminWorkTime: item.adminWorkTime,
				clientManagementTime: item.clientManagementTime,
				kpiAnalysisTime: item.kpiAnalysisTime,
				teamMeetingTime: item.teamMeetingTime
			} )
		} )
	}
} )
