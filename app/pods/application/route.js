import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import { A } from '@ember/array';
import { isEmpty } from '@ember/utils';

export default Route.extend({
	cookies: service(),
	ajax: service(),
	clientId: '5cbd9f94f4ce4352ecb082a0',
	clientSecret: '5c90db71eeefcc082c0823b2',
	beforeModel({ targetName }) {
		const cookies = this.get('cookies');

		let token = cookies.read('access_token');

		// 初始化 notice 页面的 notcie
		if (isEmpty(localStorage.getItem('notice'))) {
			localStorage.setItem('notice', true);
		}
		if (!token && targetName !== 'oauth-callback') {
			this.transitionTo('login');
		}
	},
	model() {
		let store = this.get('store'),
			cookies = this.get('cookies'),
			useableProposals = A([]),
			accountId = cookies.read('account_id'),
			papers = A([]);

		if (isEmpty(accountId)) {
			return;
		}
		return store.query('useableProposal', {
			'account-id': accountId
		}).then(data => {
			useableProposals = data;
			let promiseArray = A([]);

			promiseArray = useableProposals.map(ele => {
				return ele.get('proposal');
			});
			return RSVP.Promise.all(promiseArray);
		}).then(data => {
			let useableProposalIds = data,
				promiseArray = A([]);

			promiseArray = useableProposalIds.map(ele => {
				return store.query('paper', {
					'proposal-id': ele.id,
					'account-id': accountId
				});
			});
			return RSVP.Promise.all(promiseArray);

		}).then(data => {
			papers = data;
			return RSVP.hash({
				papers,
				useableProposals,
				detailProposal: useableProposals.get('firstObject'),
				detailPaper: papers[0].get('firstObject')
			});
		});
	},
	actions: {
		error(error, transition) {
			console.log(error);
			console.log(transition);
			this.transitionTo('application');
		}
	}
});
