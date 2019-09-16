import Controller from "@ember/controller"
import { inject as service } from "@ember/service"
// import computed from "@ember/object"
import { computed } from "@ember/object"

export default Controller.extend( {
	gen: service( "service/gen-data" ),
	deploy( project ) {
		this.gen.genPeriodWithProject( project ).then( x => {
			this.transitionToRoute( "page.project.period", project.id, x.id )
		} )
	},
	roundOver: computed( function() {
		let old = window.document.referrer

		if ( old.indexOf( "round-over" ) !== -1 ) {
			return true
		} else {
			return false
		}
	} ),
	actions: {
		toReport() {
			this.transitionToRoute( "page.project.report" )
		},
		goRoundOver() {
			this.transitionToRoute( "page.project.round-over" )
		},
		toNext( project ) {
			// 创建新的周期并进入
			const currPeriod = project.periods.length,
				totalPhase = project.pharse

			if ( currPeriod < totalPhase ) {
				this.deploy( project )
			} else {
				window.console.info( "Fuck" )
			}

			// this.gen.genProjectWithProposal( project.proposal ).then( x => {
			// this.deploy( x )
			// })
		}
	}
} )
