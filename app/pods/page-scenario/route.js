import Route from '@ember/routing/route';
import RSVP, { hash } from 'rsvp';
import { A } from '@ember/array';
import $ from 'jquery';
import { inject as service } from '@ember/service';

export default Route.extend({
	cookies: service(),
	beforeModel({ params }) {
		let proposalId = params['page-scenario']['proposal_id'],
			cookies = this.get('cookies'),
			that = this;

		$.ajax({
			method: 'POST',
			url: `/v0/GeneratePaper?proposal-id=${proposalId}
				&account-id=${cookies.read('account_id')}`,
			headers: {
				'Content-Type': 'application/json', // 默认值
				'Accept': 'application/json',
				'Authorization': `Bearer ${cookies.read('access_token')}`
			},
			data: {},
			success: function (res) {
				that.get('store').pushPayload(res);
			},
			error: function () {
			}
		});
	},
	model(params) {
		const store = this.get('store'),
			cookies = this.get('cookies'),
			noticeModel = this.modelFor('page-notice'),
			scenario = noticeModel.scenario,
			scenarioId = scenario.get('id'),
			proposalId = params['proposal_id'],
			paper = noticeModel.detailPaper;

		let proposal = noticeModel.detailProposal,
			resourceConfRep = null,
			resourceConfManager = null,
			managerTotalTime = 0,
			managerTotalKpi = 0;

		// return store.query('scenario', {
		// 	'proposal-id': proposalId,
		// 	'account-id': cookies.read('account_id')
		// })
		// 	.then(data => {
		// 		scenarios = data;
		// 		scenario = scenarios.get('lastObject');
		// 		scenarioId = scenario.id;
		return store.findRecord('proposal', proposalId)
			// })
			.then(data => {
				proposal = data;
				// 获取 resourceConfig -> 代表
				return store.query('resourceConfig',
					{
						'scenario-id': scenarioId,
						'resource-type': 1
					});
			})
			.then(data => {
				resourceConfRep = data;
				// 获取 resourceConfig -> 经理
				return store.queryRecord('resourceConfig',
					{
						'scenario-id': scenarioId,
						'resource-type': 0
					});
			})
			.then(data => {
				resourceConfManager = data;
				let promiseArray = A([
					data.get('managerConfig').get('managerTime'),
					data.get('managerConfig').get('managerKpi')
				]);

				return RSVP.Promise.all(promiseArray);
			})
			.then(data => {
				managerTotalTime = data[0];
				managerTotalKpi = data[1];
				return store.query('destConfig',
					{ 'scenario-id': scenarioId });
			}).then(data => {

				return hash({
					proposal,
					paper,
					scenario,
					paperState: paper.get('state'),
					resourceConfRep,
					resourceConfManager,
					managerTotalTime,
					managerTotalKpi,
					goodsConfigs: store.query('goodsConfig',
						{ 'scenario-id': scenarioId }),
					destConfigs: data.sortBy('hospitalConfig.potential').reverse(),
					resourceConfig: store.query('resourceConfig',
						{ 'scenario-id': scenarioId }),
					salesConfigs: store.query('salesConfig',
						{
							'scenario-id': scenarioId,
							'proposal-id': proposalId,
							'account-id': cookies.read('account_id')
						})
				});
			});
	},
	afterModel() {
		let applicationController = this.controllerFor('application');

		applicationController.set('testProgress', 2);
	}
});
