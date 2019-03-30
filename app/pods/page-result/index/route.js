import Route from '@ember/routing/route';

export default Route.extend({
	model() {
		return this.get('store').query('salesreport',
			{"scenario-id": "5c7e3157eeefcc1c9ec104ae"}
		).then(data => data.get('firstObject'));
	}
});
