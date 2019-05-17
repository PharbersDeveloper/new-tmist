import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
	model() {
		let pageScenarioModel = this.modelFor('page-scenario'),
			scenario = pageScenarioModel.scenario,
			paper = pageScenarioModel.paper;

		return paper.get('assessmentReports')
			.then(data => {
				return data.sortBy('time').get('lastObject');
			}).then(data => {
				return hash({
					scenario,
					assessmentReport: data
				});
			});
	},
	afterModel() {
		let applicationController = this.controllerFor('application');

		applicationController.set('testProgress', 3);
	}
});
