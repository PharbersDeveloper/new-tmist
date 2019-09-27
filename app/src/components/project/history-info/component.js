import Component from "@ember/component"
import { inject as service } from "@ember/service"
// import { computed } from "@ember/object"

export default Component.extend( {
	positionalParams: ["provious", "periods", "proviousReport"],
	classNames: ["history-info-wrapper"],
	router: service(),
	exportService: service( "service/export-report" ),
	runtimeConfig: service( "service/runtime-config" ),
	actions: {
		exportReport( project ) {
			this.exportService.exportReport( project, project.get( "periods" ).length )
		},
		exportInput( project ) {
			this.exportService.exportInput( project, project.get( "periods" ).length )
		},
		performance() {

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
		}
	}
} )
