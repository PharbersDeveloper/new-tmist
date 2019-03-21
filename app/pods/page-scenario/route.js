import Route from '@ember/routing/route';
import { hash } from 'rsvp';
export default Route.extend({
	model() {
		return hash({
			management: this.get('store').findRecord('managerConfig', '5c7e3e97eeefcc1c9ec104d6')
		});
	}
});
