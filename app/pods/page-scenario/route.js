import Route from '@ember/routing/route';

export default Route.extend({

	model() {
		let scenario = this.modelFor('application'),
			scenarioId = scenario.id;

		return this.get('store').query('resourceConfig',
			{ 'scenario-id': scenarioId })
			.then(data => {
				return data;
			});
	}
});
