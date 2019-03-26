import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
	model(params) {
		let hCId = params['config_id'],
			scenarios = this.modelFor('page-scenario'),
			businessController = this.controllerFor('page-scenario.business'),
			currentController = this.controllerFor('page-scenario.business.hospital-config');

		currentController.set('parentController', businessController);
		return hash({
			managerConf: scenarios.resourceConfManager,
			repConf: scenarios.resourceConfRep,
			hospConfig: this.get('store').findRecord('hospitalConfig', hCId),
			prodConfig: this.get('store').query('productConfig',
				{ 'hospital-config-id': hCId })
		});
	}
});
