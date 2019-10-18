import Component from "@ember/component"
import { inject as service } from "@ember/service"
// import { computed } from "@ember/object"

export default Component.extend( {
	positionalParams: ["provious", "periods", "proviousReport"],
	classNames: ["history-info-wrapper"],
	router: service(),
	exportService: service( "service/export-report" ),
	runtimeConfig: service( "service/runtime-config" ),
	tmCurProject: null,
	actions: {
		exportReport( project ) {
			this.exportService.exportReport( project, project.get( "periods" ).length )
		},
		exportInput( project ) {
			this.exportService.exportInput( project, project.get( "periods" ).length )
		},
		performance( curProject ) {
			this.set( "tmCurProject", curProject )

			this.set( "performance", {
				open: true
			} )
		},
		// review( pid ) {
		// 	this.transitionToRoute( "page.project.review", pid )
		// },
		toReport( project ) {
			// window.localStorage.setItem( "roundHistory", true )
			this.runtimeConfig.setRoundHistoryTrue()
			this.get( "router" ).transitionTo( "page.project.result", project.get( "id" ) , { queryParams: { state: "history" }} )
			// window.location = "/project/" + project.id + "/result"
		},
		review( pid ) {
			this.get( "router" ).transitionTo( "page.project.review", pid )
		}
	}
} )
