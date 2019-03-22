import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
	model() {
		let scenarioId = this.modelFor('application').id;
		// goodsConfigs = null,
		// destConfigs = null;

		// return this.get('store').query('goodsConfig', { scenarioId })
		// 	.then(gcs => {
		// 		goodsConfigs = gcs;
		// 		return this.get('store').query('destConfig', { scenarioId });
		// 	})
		// 	.then(dcs => {
		// 		destConfigs = dcs;
		// 		return hash({
		// 			goodsConfigs,
		// 			destConfigs
		// 		});
		// 	});

		return hash({
			goodsConfigs: this.get('store').query('goodsConfig', { scenarioId }),
			destConfigs: this.get('store').query('destConfig', { scenarioId })
		});
	}
});
