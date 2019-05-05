import Route from '@ember/routing/route';
import RSVP, { hash, reject } from 'rsvp';
import { A } from '@ember/array';
import $ from 'jquery';
import { inject as service } from '@ember/service';
import { isArray } from '@ember/array';

export default Route.extend({
	cookies: service(),
	createManagerInput() {
		return this.get('store').createRecord('managerinput', {
			strategyAnalysisTime: '',
			adminWorkTime: '',
			clientManagementTime: '',
			kpiAnalysisTime: '',
			teamMeetingTime: ''
		});
	},
	createRepInputs(resourceConfigs) {
		let promiseArray = A([]);

		promiseArray = resourceConfigs.map(ele => {
			return this.get('store').createRecord('representativeinput', {
				resourceConfigId: ele.id,
				resourceConfig: ele,
				productKnowledgeTraining: 0,
				salesAbilityTraining: 0,
				regionTraining: 0,
				performanceTraining: 0,
				vocationalDevelopment: 0,
				assistAccessTime: '',
				teamMeeting: '',
				abilityCoach: ''
			});
		});
		return promiseArray;
	},
	//	生成 managerinput
	generateManagerInput(resourceConfigs) {
		return {
			managerInput: this.createManagerInput(),
			representativeInputs: this.createRepInputs(resourceConfigs)
		};
	},
	// 判断是否有 managerinput
	hasManagerInput(paper, resourceConfigs) {
		// 应该根据 paper 中的 state 属性
		let state = paper.get('state');

		if (state === 1) {
			return paper.get('paperinputs');
		}
		return this.generateManagerInput(resourceConfigs);
	},
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
			destConfigs = null,
			resourceConfRep = null,
			resourceConfManager = null,
			managerTotalTime = 0,
			managerTotalKpi = 0,
			inputResource = null,
			managerInput = null,
			representativeInputs = null;


		return store.findRecord('proposal', proposalId)
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
				destConfigs = data.sortBy('hospitalConfig.potential').reverse();
				inputResource = this.hasManagerInput(paper, resourceConfRep);

				if (!isArray(inputResource)) {
					return reject();
				}
				return inputResource.sortBy('time').lastObject.get('managerinputs');

				// return hash({
				// 	proposal,
				// 	paper,
				// 	scenario,
				// 	paperState: paper.get('state'),
				// 	resourceConfRep,
				// 	resourceConfManager,
				// 	managerTotalTime,
				// 	managerTotalKpi,
				// 	goodsConfigs: store.query('goodsConfig',
				// 		{ 'scenario-id': scenarioId }),
				// 	destConfigs,
				// 	resourceConfig: store.query('resourceConfig',
				// 		{ 'scenario-id': scenarioId }),
				// 	salesConfigs: store.query('salesConfig',
				// 		{
				// 			'scenario-id': scenarioId,
				// 			'proposal-id': proposalId,
				// 			'account-id': cookies.read('account_id')
				// 		})
				// });
			}).then(data => {
				managerInput = data.firstObject;
				return inputResource.sortBy('time').lastObject.get('representativeinputs');
			})
			.then(data => {
				representativeInputs = data;
				return null;
			})
			.catch(() => { })
			.then(() => {
				return hash({
					proposal,
					managerInput,
					representativeInputs,
					paper,
					scenario,
					paperState: paper.get('state'),
					resourceConfRep,
					resourceConfManager,
					managerTotalTime,
					managerTotalKpi,
					goodsConfigs: store.query('goodsConfig',
						{ 'scenario-id': scenarioId }),
					destConfigs,
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
	},
	setupController(controller, model) {
		this._super(...arguments);

		controller.set('managerInput', model.managerInput);
		controller.set('representativeInputs', model.representativeInputs);

	}
});
