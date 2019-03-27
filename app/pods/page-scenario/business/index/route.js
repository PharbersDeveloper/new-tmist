import Route from '@ember/routing/route';

export default Route.extend({
	beforeModel(transition) {
		let resourceConfig = this.modelFor('page-scenario'),
			destConfigs = resourceConfig.destConfigs,
			firstDestConfig = destConfigs.get('firstObject'),
			proposalId = transition.params['page-scenario']['proposal_id'];

		this.transitionTo('/scenario/' + proposalId + '/business/hospital/' +
			firstDestConfig.id);
		// firstDestConfig.get('hospitalConfig').then(data => {
		// 	this.transitionTo('/scenario/' + proposalId + '/business/hospital/' +
		// 		data.id);
		// });

	}
});
