import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
	model() {
		let totalConfig = this.modelFor('page-scenario.reference');

		return hash({
			resourceConfManager: totalConfig.resourceConfManager,
			resourceConfReps: totalConfig.resourceConfRep
		});
	}
});
