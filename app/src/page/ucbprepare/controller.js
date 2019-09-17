import Controller from "@ember/controller"
import { inject as service } from "@ember/service"
import { computed } from "@ember/object"

export default Controller.extend( {
	gen: service( "service/gen-data" ),
	deploy( project ) {
		this.gen.genPeriodWithProject( project ).then( x => {
			this.transitionToRoute( "page.project.period", project.id, x.id )
		} )
	},
	curProject: computed( function() {
		return this.model.provious.get( "lastObject" )
	} ),
	actions: {
		toHistory( pid ) {
			this.transitionToRoute( "page.history" , pid )
		},
		startDeployConfirm() {

			this.set( "startDeployConfirm", {
				open: true,
				title: "重新部署",
				detail: "确定要重新开始测试吗？我们将删除您进行中的决策记录。"
			} )

		},
		startDeploy( proposal ) {
			this.gen.genProjectWithProposal( proposal ).then( x => {
				this.deploy( x )
			} )
		},
		continueDeploy( aProject ) {
			this.transitionToRoute( "page.project.period", aProject.id, aProject.periods.lastObject.get( "id" ) )
		},
		startAgainDeploy( proposal ) {
			// old project status : 1
			if ( this.curProject ) {
				this.curProject.destroyRecord()
				// this.set( "curProject.status", 1 )
				// this.curProject.save()
			}

			this.set( "startDeployConfirm", {
				open: false
			} )

			this.gen.genProjectWithProposal( proposal ).then( x => {
				this.deploy( x )
			} )
			// this.actions.startDeploy( proposal )
		}
	}
} )