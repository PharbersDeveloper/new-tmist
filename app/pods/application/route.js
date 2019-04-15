import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import { A } from '@ember/array';
import { isEmpty } from '@ember/utils';

export default Route.extend({
	cookies: service(),
	clientId: '5c90f3fc830346b827fb0905',
	clientSecret: '5c90db71eeefcc082c0823b2',
	redirectUri: 'http://192.168.100.165:8081/oauth-callback',
	beforeModel({ targetName }) {
		let cookies = this.get('cookies'),
			store = this.get('store'),
			token = cookies.read('access_token');

		if (!token && targetName !== 'oauth-callback') {
			let host = 'http://192.168.100.116:31415',
				version = 'v0',
				resource = 'GenerateUserAgent',
				scope = 'NTM',
				url = '';

			url = `?response_type=code
                        &client_id=${this.get('clientId')}
                        &client_secret=${this.get('clientSecret')}
                        &scope=${scope}
						&redirect_uri=${this.get('redirectUri')}`.
				replace(/\n/gm, '').
				replace(/ /gm, '').
				replace(/\t/gm, '');
			window.location = [host, version, resource, url].join('/');
		}
		if (token && store.peekAll('scecario').get('length') === 0) {
			this.transitionTo('index');
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
				return store.query('paper', {
					'proposal-id': ele.get('proposal').get('id'),
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
	}
});
