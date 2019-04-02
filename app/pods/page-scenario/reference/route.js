import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
	beforeModel(transition) {
		let proposalId = transition.params['page-scenario']['proposal_id'],
			currentChindRouteName = transition.targetName.split('.').get('lastObject'),
			currentController = this.controllerFor('page-scenario.reference');

		currentController.set('proposalId', proposalId);
		currentController.set('groupValue', currentChindRouteName);
	},
	model() {
		let totalConfig = this.modelFor('page-scenario');

		return hash({
			goodsConfigs: totalConfig.goodsConfigs,
			destConfigs: totalConfig.destConfigs,
			salesConfigs: totalConfig.salesConfigs,
			resourceConfRep: totalConfig.resourceConfRep,
			resourceConfManager: totalConfig.resourceConfManager
		});
	}
});
