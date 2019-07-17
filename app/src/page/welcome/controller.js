import Controller from "@ember/controller"
import ENV from "new-tmist/config/environment"
import { inject as service } from "@ember/service"
import { A } from "@ember/array"
import { computed } from "@ember/object"

export default Controller.extend( {
	cookies: service(),
	testBtn: computed( function () {
		if ( ENV.environment === "development" ) {
			return true
		}
		return false
	} ),
	// notice: localStorage.getItem( "notice" ) !== "false",
	// notice: computed('cookies.notice', function () {
	// 	let localStorageNotice = localStorage.getItem('notice'),
	// 		notice = this.cookies.read('notice');

	// 	if (localStorageNotice === 'false' || !isEmpty(notice)) {
	// 		return false;
	// 	}
	// 	return true;
	// }),
	// neverShow: A( ["不在显示"] ),
	// reports: computed( "model.detailPaper", function () {
	// 	let paper = this.get( "model.detailPaper" ),
	// 		inputs = paper.get( "paperinputs" )

	// 	return inputs.sortBy( "time" ).reverse()
	// } ),
	actions: {
		checkReport( assessmentReport ) {
			this.transitionToRoute( "page-report", assessmentReport.id )
		},
		// changeDetail( useableProposal, paper ) {
		changeDetail( useableProposal ) {
			// this.set( "model.detailProposal", useableProposal )
			// this.set( "model.detailPaper", paper )
			// TODO: 添加右边展示逻辑
			this.transitionToRoute("page.project", useableProposal.get("proposal.id"))
		},
		startDeploy( proposalId ) {
			localStorage.setItem( "notice", false )
			this.transitionToRoute( "page-notice", proposalId )
		},
		reDeploy() {
			let proposalId = this.get( "model" ).detailProposal.get( "proposal.id" )

			this.set( "reDeploy", false )
			// reDeploy 为 1 的时候，代表用户选择`重新部署`
			localStorage.setItem( "reDeploy", 1 )
			this.transitionToRoute( "page-notice", proposalId )
		},
		closeNotice() {
			this.set( "notice", false )
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
