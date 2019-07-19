import Controller from "@ember/controller"
import { inject as service } from "@ember/service"

export default Controller.extend( {
	gen: service( "service/gen-data" ),
	lastSelectedCat: 0, // 0 for proposal, 1 for project
	currentProposal: null,
	currentProject: null,

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
			this.gen.genProjectWithProposal(aProposal).then( x => {
				// this.transitionToRoute( "page.project.period", x.get( "id" ), "alfred" )
				this.continueDeploy(x)
			})
		},
		continueDeploy( aProject ) {
			if (aProject.periods.length === 0) {
				this.gen.genPeriodWithProject(aProject).then( x => {
					this.transitionToRoute( "page.project.period", aProject.id, x.id)
				})
			} else {
				this.transitionToRoute( "page.project.period", aProject.id, aProject.periods.lastObject.get("id"))
			}

		},
		// reDeploy() {
		// 	let proposalId = this.get( "model" ).detailProposal.get( "proposal.id" )

		// 	this.set( "reDeploy", false )
		// 	// reDeploy 为 1 的时候，代表用户选择`重新部署`
		// 	localStorage.setItem( "reDeploy", 1 )
		// 	this.transitionToRoute( "page-notice", proposalId )
		// },
		// closeNotice() {
		// 	this.set( "notice", false )
		// },
		chooseItem( item ) {
			if ( item.length > 0 ) {
				localStorage.setItem( "notice", false )
			} else {
				localStorage.setItem( "notice", true )
			}
		}
	}
} )
