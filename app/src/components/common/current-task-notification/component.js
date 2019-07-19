import Component from "@ember/component"

export default Component.extend( {
	actions: {
		entryMission( proposalId ) {
			let now = new Date().getTime()

			if ( this.get( "model" ).detailPaper.state !== 1 ) {
				localStorage.setItem( "paperStartTime", now )
			}
			this.transitionToRoute( "page-scenario", proposalId )
		}
	}
} )
