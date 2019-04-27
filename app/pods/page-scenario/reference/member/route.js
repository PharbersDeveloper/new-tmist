import Route from '@ember/routing/route';
import rsvp from 'rsvp';
import { A } from '@ember/array';

export default Route.extend({
	model() {
		const store = this.get('store'),
			totalConfig = this.modelFor('page-scenario.reference'),
			resourceConfReps = totalConfig.resourceConfRep,
			paper = totalConfig.paper;

		let managementController = this.controllerFor('page-scenario.management'),
			averageAbility = managementController.get('averageAbility') || A([]),
			lastPersonnelAssessment = A([]);

		/**
		 * 先从 管理决策 页面获取，如果没有，则计算
		 */
		if (averageAbility.length > 0) {
			return paper.get('personnelAssessments')
				.then(data => {
					let increasePersonnelAssessment = data.sortBy('time'),
						currentAbility = increasePersonnelAssessment.get('lastObject');

					return rsvp.hash({
						radarData: [{
							value: averageAbility,
							name: '团队平均能力'
						}],
						lastPersonnelAssessment: currentAbility,
						radarColor: ['#3172E0'],
						resourceConfManager: totalConfig.resourceConfManager,
						resourceConfReps
					});
				});
		}
		// promiseArray = resourceConfReps.map(ele => {
		// 	return ele.get('representativeConfig');
		// });
		return paper.get('personnelAssessments')
			.then(data => {
				let increasePersonnelAssessment = data.sortBy('time');

				lastPersonnelAssessment = increasePersonnelAssessment.get('lastObject');
				return lastPersonnelAssessment.get('representativeAbilities');
			})
			// return rsvp.Promise.all(promiseArray)
			.then(data => {
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
				averageAbility = [averageJobEnthusiasm.toFixed(2), averageProductKnowledge.toFixed(2),
				averageBehaviorValidity.toFixed(2), averageRegionalManagementAbility.toFixed(2),
				averageSalesAbility.toFixed(2)];
				return [
					{
						value: averageAbility,
						name: '团队平均能力'
					}
				];
			}).then(data => {
				return rsvp.hash({
					radarData: data,
					lastPersonnelAssessment,
					radarColor: ['#C1C7D0'],
					resourceConfManager: totalConfig.resourceConfManager,
					resourceConfReps
				});
			});
	}
});
