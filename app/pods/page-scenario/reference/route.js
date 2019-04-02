import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
	beforeModel(transition) {
		let proposalId = transition.params['page-scenario']['proposal_id'];

		this.controllerFor('page-scenario.reference').set('proposalId', proposalId);
	},
	model() {
		let totalConfig = this.modelFor('page-scenario');

		return hash({
			goodsConfigs: totalConfig.goodsConfigs,
			destConfigs: totalConfig.destConfigs,
			resourceConfRep: totalConfig.resourceConfRep
		});
	}
});
