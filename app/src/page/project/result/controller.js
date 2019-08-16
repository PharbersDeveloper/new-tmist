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
		toReport() {
			this.transitionToRoute( "page.project.report" )
		},
		toCongratulation() {
			this.transitionToRoute( "page.project.round-over" )
		},
		toNext( proposal ) {
			// 创建新的周期并进入
			this.gen.genProjectWithProposal( proposal ).then( x => {
				this.deploy( x )
			} )
		}
	}
} )

