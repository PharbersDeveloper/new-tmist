import Route from '@ember/routing/route';
import rsvp from 'rsvp';
import { A } from '@ember/array';

export default Route.extend({
	createManagerInput() {
		return this.get('store').createRecord('managerinput', {
			strategyAnalysisTime: 0,
			adminWorkTime: 0,
			clientManagementTime: 0,
			kpiAnalysisTime: 0,
			teamMeetingTime: 0
		});
	},
	createRepInputs(resourceConfigs) {
		let promiseArray = A([]);

		promiseArray = resourceConfigs.map(ele => {
			return this.get('store').createRecord('representativeinput', {
				resourceConfigId: ele.id,
				productKnowledgeTraining: 0,
				salesAbilityTraining: 0,
				regionTraining: 0,
				performanceTraining: 0,
				vocationalDevelopment: 0,
				assistAccessTime: 0,
				teamMeeting: 0,
				abilityCoach: 0
			});
		});
		return promiseArray;
	},
	// managerinput 已经存在
	normalFlow(store) {

		return {
			managerInput: store.peekAll('managerinput').get('firstObject'),
			representativeInputs: store.peekAll('representativeinput')
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
	hasManagerInput(array, self, store, resourceConfigs) {
		if (array.get('length') > 0) {
			return self.normalFlow(store);
		}
		return self.generateManagerInput(self, resourceConfigs);
	},

	model() {
		let resourceConfig = this.modelFor('page-scenario'),
			store = this.get('store'),
			mConf = resourceConfig.resourceConfManager,
			rConfs = resourceConfig.resourceConfRep,
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
				// currentController.set('managerInput', data.managerInput);
				// currentController.set('representativeInputs', data.representativeInputs);
				currentController.setProperties({
					managerInput: data.managerInput,
					representativeInputs: data.representativeInputs
				});
				return rsvp.hash({
					representativeInputs: data.representativeInputs,
					managerInput: data.managerInput,
					mConf,
					rConfs
				});

			});

	}
});
