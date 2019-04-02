import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import $ from 'jquery';

export default Route.extend({
	beforeModel({ params }) {
		let proposalId = params['page-scenario']['proposal_id'],
			that = this;

		$.ajax({
			method: 'POST',
			url: `/v0/GeneratePaper?proposal-id=${proposalId}`,
			headers: {
				'Content-Type': 'application/json', // 默认值
				'Accept': 'application/json',
				'Authorization': `Bearer BONBBC4BPHE6LWW9ULVIBA`
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
		let store = this.get('store'),
			scenario = this.modelFor('application'),
			scenarioId = scenario.id,
			proposal = null,
			scenarios = null,
			proposalId = params['proposal_id'],
			resourceConfRep = null,
			resourceConfManager = null;

		return store.findRecord('proposal', proposalId)
			.then(data => {
				proposal = data;

				return store.query('scenario',
					{ 'proposal-id': proposalId });
			})
			// 获取 resourceConfig -> 代表
			.then(data => {
				scenarios = data;
				return store.query('resourceConfig',
					{ 'scenario-id': scenarioId, 'resource-type': 1 });
			})
			// 获取 resourceConfig -> 经理
			.then(data => {
				resourceConfRep = data;
				return store.query('resourceConfig',
					{ 'scenario-id': scenarioId, 'resource-type': 0 });
			})
			.then(data => {
				resourceConfManager = data.get('firstObject');
				return hash({
					proposal,
					scenarios,
					resourceConfRep,
					resourceConfManager,
					goodsConfigs: store.query('goodsConfig',
						{ 'scenario-id': scenarioId }),
					destConfigs: store.query('destConfig',
						{ 'scenario-id': scenarioId }),
					resourceConfig: store.query('resourceConfig',
						{ 'scenario-id': scenarioId }),
					salesConfigs: store.query('salesConfig',
						{ 'scenario-id': scenarioId })
				});
			});
	}
});
