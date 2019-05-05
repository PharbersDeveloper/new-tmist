import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
	cookies: service(),
	afterModel() {
		let applicationController = this.controllerFor('application');

		applicationController.set('testProgress', 1);
	},
	model({ proposalId }) {
		let store = this.get('store'),
			indexModel = this.modelFor('index'),
			detailPaper = indexModel.detailPaper,
			cookies = this.get('cookies'),
			scenario = null,
			scenarioId = null,
			paperinput = null;

		return store.query('scenario', {
			'proposal-id': proposalId,
			'account-id': cookies.read('account_id')
		})
			.then(data => {
				scenario = data.get('firstObject');
				scenarioId = scenario.get('id');
				let state = indexModel.detailPaper.get('state');

				if (state === 0 || state === 3) {
					//	如果为新的则需要获取destConfig/resourceConfig/
					return detailPaper.get('paperinput');
				}
				// TODO：不是新的state的解决办法。
				return store.query('paperinput', {
					'scenario-id': scenario.get('id')
				});
			})
			.then(data => {
				paperinput = data;
				return hash({
					scenario,
					destConfigs: store.query('destConfig',
						{ 'scenario-id': scenarioId }),
					goodsConfigs: store.query('goodsConfig',
						{ 'scenario-id': scenarioId }),
					resourceConfigRepresentatives: store.query('resourceConfig',
						{
							'scenario-id': scenarioId,
							'resource-type': 1
						}),
					resourceConfigManager: store.queryRecord('resourceConfig',
						{
							'scenario-id': scenarioId,
							'resource-type': 0
						}),
					detailProposal: indexModel.detailProposal,
					detailPaper: indexModel.detailPaper,
					paperinput
				});
			});
	},
	setupController(controller, model) {
		this._super(...arguments);
		let resourceConfigManager = model.resourceConfigManager;

		resourceConfigManager.get('managerConfig')
			.then(data => {
				controller.set('totalTime', data.get('managerTime'));
				controller.set('totalKpi', data.get('managerKpi'));
			});
	}
});
