import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
	model() {
		let totalConfig = this.modelFor('page-scenario.reference');

		return hash({
			goodsConfigs: totalConfig.goodsConfigs,
			destConfigs: totalConfig.destConfigs,
			resourceConfRep: totalConfig.resourceConfRep
		});
	}
});
