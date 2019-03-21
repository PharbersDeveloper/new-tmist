import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
	model() {
		return hash({
			goodsConfig: this.get('store').findAll('goodsConfig')
			// productConfig: this.get('store').findAll('productConfig')
		});
	}
});
