import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Route.extend({
	cookies: service(),
	afterModel(model) {
		let applicationController = this.controllerFor('application');

		applicationController.set('testProgress', 1);
		applicationController.set('scenario', model.scenario);

	},
	model({ proposalId }) {
		const store = this.get('store'),
			indexModel = this.modelFor('index'),
			detailPaper = indexModel.detailPaper,
			cookies = this.get('cookies');

		let scenario = null,
			scenarioId = null,
			paperinput = null;

		return store.query('scenario', {
			'proposal-id': proposalId,
			'account-id': cookies.read('account_id')
		})
			.then(data => {
				scenario = data.get('firstObject');
				scenarioId = scenario.get('id');
				let state = detailPaper.get('state'),
					reDeploy = Number(localStorage.getItem('reDeploy'));

				// 周期为新开始/重新部署
				if (state !== 1 || reDeploy === 1) {
					//	如果为新的则需要获取destConfig/resourceConfig/
					// return detailPaper.get('paperinput');
					return null;
				}
				return detailPaper.get('paperinputs');
			})
			.then(data => {
				if (isEmpty(data)) {
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
						paperinput: null
					});
				}

				paperinput = data.lastObject;
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
					paperinput,
					managerInput: paperinput.get('managerinputs').lastObject,
					representativeInputs: paperinput.get('representativeinputs'),
					businessInputs: paperinput.get('businessinputs')

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
