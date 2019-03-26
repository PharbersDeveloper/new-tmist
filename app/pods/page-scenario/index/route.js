import Route from '@ember/routing/route';

export default Route.extend({
	beforeModel(transition) {
		let proposalId = transition.params['page-scenario']['proposal_id'];

		this.transitionTo('/scenario/' + proposalId + '/business');
	}
});
