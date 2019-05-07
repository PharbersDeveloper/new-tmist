import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import { A } from '@ember/array';
import { isEmpty } from '@ember/utils';

export default Route.extend({
	cookies: service(),
	ajax: service(),
	'oauth_service': service(),
	clientId: '5cbd9f94f4ce4352ecb082a0',
	clientSecret: '5c90db71eeefcc082c0823b2',
	beforeModel({ targetName }) {
		if (targetName === 'oauth-callback') {
			return;
		}
		// 初始化 notice 页面的 notcie
		if (isEmpty(localStorage.getItem('notice'))) {
			localStorage.setItem('notice', true);
		}
		if (this.oauth_service.judgeAuth()) {
			this.transitionTo('index');

		} else {
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
			window.console.log(error);
			window.console.log(transition);
			this.transitionTo('index');
		}
	}
});
