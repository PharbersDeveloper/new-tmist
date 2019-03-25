import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({

	model() {
		let scenario = this.modelFor('application'),
			scenarioId = scenario.id;

		return this.get('store').query('resourceConfig',
			{ 'scenario-id': scenarioId })
			.then(data => {
				return hash({
					data,
					goodsConfigs: this.get('store').query('goodsConfig',
						{ 'scenario-id': scenarioId }),
					destConfigs: this.get('store').query('destConfig',
						{ 'scenario-id': scenarioId })
				});
			});
	}
});
