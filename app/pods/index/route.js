import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Route.extend({
	cookies: service(),
	// beforeModel() {
	// 	const cookies = this.get('cookies');

	// 	let token = cookies.read('access_token');

	// 	if (!token) {
	// 		this.transitionTo('login');
	// 	}
	// },
	activate() {
		this._super(...arguments);
		let applicationController = this.controllerFor('application');

		applicationController.set('testProgress', 0);
	},
	model() {
		let applicationModel = this.modelFor('application'),
			store = this.get('store'),
			cookies = this.get('cookies'),
			useableProposals = A([]),
			accountId = cookies.read('account_id'),
			papers = A([]);

		if (!isEmpty(applicationModel)) {
			return RSVP.hash({
				papers: applicationModel.papers,
				useableProposals: applicationModel.useableProposals,
				detailProposal: applicationModel.detailProposal,
				detailPaper: applicationModel.detailPaper,
				scenario: applicationModel.scenario
			});
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
				results: A([]),
				papers,
				useableProposals,
				detailProposal: useableProposals.get('firstObject'),
				detailPaper: papers[0].get('firstObject')
			});
		});
	}
});
