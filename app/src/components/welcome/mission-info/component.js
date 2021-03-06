import Component from "@ember/component"
import { computed } from "@ember/object"
import { A } from "@ember/array"
// import { equal } from "@ember/object/computed"

export default Component.extend( {
	positionalParams: ["proposal"],
	classNames: ["mr-4 mb-4 p-4"],
	localClassNames: "mission-info",
	classNameBindings: ["isMultiplePhase:multiple-phase", "newMissionActive", "doneMissionActive"],
	localClassNameBindings: A( ["isMultiplePhase:multiple-phase"] ),
	bubble: false,
	isMultiplePhase: computed( "useableProposal.proposal.totalPhase", function () {
		let quantity = this.get( "useableProposal.proposal.totalPhase" )

		if ( quantity > 1 ) {
			return true
		}
		return false
	} ),
	// newMissionActive: equal( "useableProposalPaper.state", 0 ),
	// doneMissionActive: equal( "useableProposalPaper.state", 3 )

	// onClick() { },
	click( ) {
		// let action = this.get('onClick');
		// action(params);
		// return this.get('bubble');
		// this.onMessageInfoClick(this.get("useableProposal.proposal._id"))
		this.onClick( this.get( "proposal" ) )
	}
} )
