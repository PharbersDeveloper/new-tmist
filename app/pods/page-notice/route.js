import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';
import $ from 'jquery';

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
				let state = indexModel.detailPaper.get('state');

				if (state === 0 || state === 3) {
					//	如果为新的则需要获取destConfig/resourceConfig/
					return store.peekAll('paper');
				}
				return store.query('paperinput', {
					'scenario-id': scenario.get('id')
				});
			})
			.then(data => {
				return hash({
					scenario,
					destConfigs: store.query('destConfig',
						{ 'scenario-id': scenario.get('id') }),
					resourceConfigRepresentatives: store.query('resourceConfig',
						{ 'scenario-id': scenario.get('id'), 'resource-type': 1 }),
					resourceConfigManagers: store.query('resourceConfig',
						{ 'scenario-id': scenario.get('id'), 'resource-type': 0 }),
					detailProposal: indexModel.detailProposal,
					detailPaper: indexModel.detailPaper,
					paperinput: data === null ? null : data.get('lastObject')
				});
			});
	}
});
