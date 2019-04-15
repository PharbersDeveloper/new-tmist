import Controller from '@ember/controller';

export default Controller.extend({
	actions: {
		changeDetail(useableProposal, paper) {
			this.set('model.detailProposal', useableProposal);
			this.set('model.detailPaper', paper);
		},
		start(id) {
			this.transitionToRoute('page-notice', id);
		}
	}
});
