import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
	model() {
		const resourceConfig = this.modelFor('page-scenario'),
			paper = resourceConfig.paper,
			mConf = resourceConfig.resourceConfManager,
			rConfs = resourceConfig.resourceConfRep,
			managerTotalTime = resourceConfig.managerTotalTime,
			managerTotalKpi = resourceConfig.managerTotalKpi;

		let currentController = this.controllerFor('page-scenario.management'),
			averageAbility = [0, 0, 0, 0, 0],
			managerInput = resourceConfig.managerInput,
			representativeInputs = resourceConfig.representativeInputs;

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
