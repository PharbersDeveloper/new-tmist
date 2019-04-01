import Route from '@ember/routing/route';

export default Route.extend({
	model() {
		let scenario = this.get('store').peekAll('scenario').sortBy('phase').get('lastObject');

		return this.get('store').query('paper',
			{'proposal-id': scenario.get('proposalId')}
		).then(data => {
			return data.get('lastObject').get('salesreports');
		});
	}
});
