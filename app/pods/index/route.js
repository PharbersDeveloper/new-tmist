import Route from '@ember/routing/route';
import rsvp from 'rsvp';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';

export default Route.extend({
	cookies: service(),
	model() {
		let store = this.get('store'),
			cookies = this.get('cookies'),
			useableProposals = A([]),
			accountId = cookies.read('account_id');

		return store.query('useableProposal', {
			'account-id': accountId
		}).then(data => {
			useableProposals = data;
			let promiseArray = A([]);

			promiseArray = useableProposals.map(ele => {
				return store.query('paper', {
					'proposal-id': ele.get('proposal').get('id'),
					'account-id': accountId
				});
			});
			return rsvp.Promise.all(promiseArray);

		}).then(data => {
			return rsvp.hash({
				papers: data,
				useableProposals,
				detailProposal: useableProposals.get('firstObject'),
				detailPaper: data[0].get('firstObject')
			});
		});
	},
	actions: {
		changeDetail(useableProposal, paper) {
			this.set('model.detailProposal', useableProposal);
			this.set('model.detailPaper', paper);

		}
	}
});
