import Controller from "@ember/controller"
import { inject as service } from "@ember/service"

export default Controller.extend( {
	gen: service( "service/gen-data" ),
	deploy( project ) {
		this.gen.genPeriodWithProject( project ).then( x => {
			this.transitionToRoute( "page.project.period", project.id, x.id )
		} )
	},
	actions: {
		toHistory( pid ) {
			this.transitionToRoute( "page.history" , pid )
		},
		startDeploy( proposal ) {
			this.gen.genProjectWithProposal( proposal ).then( x => {
				this.deploy( x )
			} )
		},
		continueDeploy( aProject ) {
			this.transitionToRoute( "page.project.period", aProject.id, aProject.periods.lastObject.get( "id" ) )
		}
	}
} )
