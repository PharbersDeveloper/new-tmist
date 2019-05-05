import Route from '@ember/routing/route';
import { reject, hash } from 'rsvp';
import { A, isArray } from '@ember/array';

export default Route.extend({
	// createManagerInput() {
	// 	return this.get('store').createRecord('managerinput', {
	// 		strategyAnalysisTime: '',
	// 		adminWorkTime: '',
	// 		clientManagementTime: '',
	// 		kpiAnalysisTime: '',
	// 		teamMeetingTime: ''
	// 	});
	// },
	// createRepInputs(resourceConfigs) {
	// 	let promiseArray = A([]);

	// 	promiseArray = resourceConfigs.map(ele => {
	// 		return this.get('store').createRecord('representativeinput', {
	// 			resourceConfigId: ele.id,
	// 			resourceConfig: ele,
	// 			productKnowledgeTraining: 0,
	// 			salesAbilityTraining: 0,
	// 			regionTraining: 0,
	// 			performanceTraining: 0,
	// 			vocationalDevelopment: 0,
	// 			assistAccessTime: '',
	// 			teamMeeting: '',
	// 			abilityCoach: ''
	// 		});
	// 	});
	// 	return promiseArray;
	// },
	// // managerinput 已经存在
	// normalFlow(store) {
	// 	let managerinputs = store.peekAll('managerinput'),
	// 		representativeInputs = store.peekAll('representativeinput'),
	// 		newManagerinput = managerinputs.filter(ele => ele.get('isNew')),
	// 		newRepresentativeInputs = representativeInputs.filter(ele => ele.get('isNew'));

	// 	return {
	// 		managerInput: newManagerinput.get('firstObject'),
	// 		representativeInputs: newRepresentativeInputs
	// 	};
	// },
	// //	生成 managerinput
	// generateManagerInput(resourceConfigs) {

	// 	return {
	// 		managerInput: this.createManagerInput(),
	// 		representativeInputs: this.createRepInputs(resourceConfigs)
	// 	};
	// },
	// // 判断是否有 managerinput
	// hasManagerInput(paper, resourceConfigs) {

	// 	// 应该根据 paper 中的 state 属性
	// 	let state = paper.get('state');

	// 	if (state === 1) {
	// 		return paper.get('paperinputs');
	// 	}
	// 	return this.generateManagerInput(resourceConfigs);
	// 	// 应该根据 managerinput 中的isNew 属性
	// 	// let isNewManagerinputs = managerinputs.filter(ele => ele.get('isNew'));

	// 	// if (isNewManagerinputs.length > 0) {
	// 	// 	return this.normalFlow(store);
	// 	// }
	// 	// return this.generateManagerInput(resourceConfigs);
	// },

	model() {
		const resourceConfig = this.modelFor('page-scenario'),
			paper = resourceConfig.paper,
			mConf = resourceConfig.resourceConfManager,
			rConfs = resourceConfig.resourceConfRep,
			managerTotalTime = resourceConfig.managerTotalTime,
			managerTotalKpi = resourceConfig.managerTotalKpi;

		let currentController = this.controllerFor('page-scenario.management'),
			averageAbility = [0, 0, 0, 0, 0],
			// inputResource = this.hasManagerInput(paper, rConfs),
			// managerInput = isArray(inputResource) ? null : inputResource.managerInput,
			// representativeInputs = isArray(inputResource) ? null : inputResource.representativeInputs;
			managerInput = resourceConfig.managerInput,
			representativeInputs = resourceConfig.representativeInputs;

		/**
		 * 获取经理总时间/总预算/总名额
		 */
		// return mConf.get('managerConfig')
		// 	.then(mc => {
		// 		return {
		// 			time: mc.get('managerTime'),
		// 			kpi: mc.get('managerKpi')
		// 		};
		// 	}).then(data => {
		// currentController.set('managerTotalTime', managerTotalTime);
		// currentController.set('managerTotalKpi', managerTotalKpi);
		// return store.peekAll('managerinput')
		// })
		// 判断是否已经创建 inputs
		// .then(data => {
		// return this.hasManagerInput(store.peekAll('managerinput'), this, store, rConfs)
		// })
		// .then(data => {
		// 获取团队平均能力
		// managerInput = data.managerInput;
		// representativeInputs = data.representativeInputs;


		// return rsvp.Promise.all(rConfs.map(ele => {
		// 	return ele.get('representativeConfig');
		// }));
		// 获取团队平均能力
		return paper.get('personnelAssessments')
			// })
			.then(data => {
				let increasePersonnelAssessment = data.sortBy('time'),
					currentAbility = increasePersonnelAssessment.get('lastObject');

				return currentAbility.get('representativeAbilities');
			})
			.then(data => {
				currentController.set('representativeAbilities', data);

				// let averageAbility = [0, 0, 0, 0, 0],
				let averageJobEnthusiasm = 0,
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
				averageAbility = [averageJobEnthusiasm.toFixed(2),
					averageProductKnowledge.toFixed(2),
					averageBehaviorValidity.toFixed(2),
					averageRegionalManagementAbility.toFixed(2),
					averageSalesAbility.toFixed(2)];

				// 	if (!isArray(inputResource)) {
				// 		return reject();
				// 	}
				// 	return inputResource.sortBy('time').lastObject.get('managerinputs');
				// })
				// .then(data => {
				// 	managerInput = data.firstObject;
				// 	return inputResource.sortBy('time').lastObject.get('representativeinputs');
				// })
				// .then(data => {

				// 	representativeInputs = data;
				// 	return null;
				// })
				// .catch(() => { })
				// .then(() => {
				// let pageScenarioController = this.controllerFor('page-scenario');

				// pageScenarioController.setProperties({
				// 	managerInput,
				// 	representativeInputs
				// });
				currentController.setProperties({
					averageAbility,
					managerInput,
					representativeInputs,
					managerTotalTime,
					managerTotalKpi
				});

				return hash({
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
