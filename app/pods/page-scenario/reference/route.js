import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
	model() {
		let resourceConfig = this.modelFor('page-scenario');

		return hash({
			goodsConfigs: resourceConfig.goodsConfigs,
			destConfigs: resourceConfig.destConfigs
		});
	}
});
