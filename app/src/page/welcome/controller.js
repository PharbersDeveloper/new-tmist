import Controller from "@ember/controller"
import { inject as service } from "@ember/service"

export default Controller.extend( {
	gen: service( "service/gen-data" ),
	lastSelectedCat: 0, // 0 for proposal, 1 for project
	currentProposal: null,
	currentProject: null,
	currentTab: 2,

	deploy( aProject ) {
		if ( aProject.periods.length === 0 ) {
			this.gen.genPeriodWithProject( aProject ).then( x => {
				this.transitionToRoute( "page.project.period", aProject.id, x.id )
			} )
		} else {
			this.transitionToRoute( "page.project.period", aProject.id, aProject.periods.lastObject.get( "id" ) )
		}
	},

	actions: {
		checkReport( assessmentReport ) {
			this.transitionToRoute( "page-report", assessmentReport.id )
		},
		enterNewProjectWithProposal( proposal ) {
			this.set( "currentProject", null )
			this.set( "currentProposal", proposal )
			this.set( "lastSelectedCat", 0 )
		},
		enterNewProjectWithProject( project ) {
			this.set( "currentProject", project )
			this.set( "currentProposal", null )
			this.set( "lastSelectedCat", 1 )
		},
		startNewDeploy( aProposal ) {
			this.gen.genProjectWithProposal( aProposal ).then( x => {
				this.deploy( x )
			} )
		},
		continueDeploy( aProject ) {
			this.deploy( aProject )
		},
		chooseItem( item ) {
			if ( item.length > 0 ) {
				localStorage.setItem( "notice", false )
			} else {
				localStorage.setItem( "notice", true )
			}
		}
	}
} )
