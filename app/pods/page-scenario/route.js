import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({

	model() {
		let scenario = this.modelFor('application'),
			scenarioId = scenario.id,
			rcsManager = null,
			rcsRepresentative = null;

		// phase = scenario.get('phase');
		// return this.get('store').query('resourceConfig',
		// 	{ scenarioId })
		// 	.then(data => {
		// 		console.log(data);
		// 		let managerConfig = null,
		// 			representativeConfig = null;

		// 		managerConfig = data.filter(ele => {
		// 			return ele.get('resourceType') === 0;
		// 		}).get('firstObject');
		// 		return hash({
		// 			managerConfig: managerConfig.get('managerConfig')
		// 		});
		// 	});
		return this.get('store').query('resourceConfig',
			{ scenarioId, resourceType: 0 })
			.then(data => {
				rcsManager = data;
				return this.get('store').query('resourceConfig',
					{ scenarioId, resourceType: 1 });
			})
			.then(data => {
				rcsRepresentative = data;
				return hash({
					rcsManager,
					rcsRepresentative
				});
			});
	}
});
