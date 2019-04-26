import Route from '@ember/routing/route';
import rsvp from 'rsvp';
import { A } from '@ember/array';

export default Route.extend({
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
	// managerinput 已经存在
	normalFlow(store) {
		let managerinputs = store.peekAll('managerinput'),
			representativeInputs = store.peekAll('representativeinput'),
			newManagerinput = managerinputs.filter(ele => ele.get('isNew')),
			newRepresentativeInputs = representativeInputs.filter(ele => ele.get('isNew'));

		return {
			managerInput: newManagerinput.get('firstObject'),
			representativeInputs: newRepresentativeInputs
		};
	},
	//	生成 managerinput
	generateManagerInput(self, resourceConfigs) {

		return {
			managerInput: self.createManagerInput(),
			representativeInputs: self.createRepInputs(resourceConfigs)
		};
	},
	// 判断是否有 managerinput
	hasManagerInput(managerinputs, self, store, resourceConfigs) {
		// 应该根据 managerinput 中的isNew 属性
		let isNewManagerinputs = managerinputs.filter(ele => ele.get('isNew'));

		if (isNewManagerinputs.length > 0) {
			return self.normalFlow(store);
		}
		return self.generateManagerInput(self, resourceConfigs);
	},

	model() {
		const store = this.get('store'),
			resourceConfig = this.modelFor('page-scenario'),
			scenarioId = resourceConfig.scenarioId,
			mConf = resourceConfig.resourceConfManager,
			rConfs = resourceConfig.resourceConfRep;

		let representativeInputs = A([]),
			managerInput = null,
			currentController = this.controllerFor('page-scenario.management');

		/**
		 * 获取经理总时间/总预算/总名额
		 */
		return mConf.get('managerConfig')
			.then(mc => {
				return {
					time: mc.get('managerTime'),
					kpi: mc.get('managerKpi')
				};
			}).then(data => {
				currentController.set('managerTotalTime', data.time);
				currentController.set('managerTotalKpi', data.kpi);
				return store.peekAll('managerinput');
			})
			// 判断是否已经创建 inputs
			.then(data => {
				return this.hasManagerInput(data, this, store, rConfs);
			}).then(data => {
				// 获取团队平均能力
				managerInput = data.managerInput;
				representativeInputs = data.representativeInputs;

				currentController.setProperties({
					managerInput,
					representativeInputs
				});
				return rsvp.Promise.all(rConfs.map(ele => {
					return ele.get('representativeConfig');
				}));
				// return store.queryRecord('personnelAssessment', {
				// 	'scenario-id': scenarioId
				// });
			})
			// .then(data => {
			// 	console.log(data);

			// 	return data.get('representativeAbility');
			// })
			.then(data => {
				let averageAbility = [0, 0, 0, 0, 0],
					averageJobEnthusiasm = 0,
					averageProductKnowledge = 0,
					averageBehaviorValidity = 0,
					averageRegionalManagementAbility = 0,
					averageSalesAbility = 0;

				data.forEach(ele => {
					averageJobEnthusiasm += ele.get('jobEnthusiasm') / 5;
					averageProductKnowledge += ele.get('productKnowledge') / 5;
					averageBehaviorValidity += ele.get('behaviorValidity') / 5;
					averageRegionalManagementAbility += ele.get('regionalManagementAbility') / 5;
					averageSalesAbility += ele.get('salesAbility') / 5;

				});
				averageAbility = [averageJobEnthusiasm, averageProductKnowledge,
					averageBehaviorValidity, averageRegionalManagementAbility,
					averageSalesAbility];
				currentController.set('averageAbility', averageAbility);

				return rsvp.hash({
					representativeInputs,
					managerInput,
					mConf,
					rConfs
				});
			});

	},
	setupController(controller, model) {
		this._super(...arguments);
		let rConfs = model.rConfs;

		controller.set('tmpRepConf', rConfs.get('firstObject').get('representativeConfig'));
	}
});
