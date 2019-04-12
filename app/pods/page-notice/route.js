import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
	cookies: service(),
	model({ proposalId }) {
		let indexModel = this.modelFor('index'),
			store = this.get('store'),
			cookies = this.get('cookies'),
			scenario = null;

		return store.query('scenario', {
			'proposal-id': proposalId,
			'account-id': cookies.read('account_id')
		})
			.then(data => {
				scenario = data.get('firstObject');
				return indexModel.detailPaper.get('paperinputs');
			})
			.then(data => {
				return hash({
					scenario,
					detailProposal: indexModel.detailProposal,
					detailPaper: indexModel.detailPaper,
					paperinputs: data
				});
			});
	}
});
