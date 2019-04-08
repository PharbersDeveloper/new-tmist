import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
	cookies: service(),
	model() {
		const store = this.get('store'),
			cookies = this.get('cookies');

		let scenarios = store.query('scenario',
				{
					'proposal-id': '5c7ce8b1421aa9907926eb71',
					'account-id': cookies.read('account_id')
				}),
			useableProposals = store.findAll('useableProposal');

		return scenarios.then(data => {
			return RSVP.hash({
				scenario: data.get('lastObject'),
				useableProposals
			});
		});
	}
});
