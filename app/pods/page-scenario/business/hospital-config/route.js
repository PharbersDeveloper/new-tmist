import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
	model(params) {
		console.log(params);
		let hCId = params['config_id'];

		return hash({
			hospConfig: this.get('store').findRecord('hospitalConfig', hCId),
			prodConfig: this.get('store').query('productConfig',
				{ 'hospital-config-id': hCId })
		});
	}
});
