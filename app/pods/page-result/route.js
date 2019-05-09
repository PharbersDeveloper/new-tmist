import Route from '@ember/routing/route';

export default Route.extend({
	model() {
		let noticeModel = this.modelFor('page-notice'),
			scenario = noticeModel.scenario;

		return scenario;
	},
	afterModel() {
		let applicationController = this.controllerFor('application');

		applicationController.set('testProgress', 3);
	}
});
