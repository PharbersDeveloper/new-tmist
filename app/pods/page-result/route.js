import Route from '@ember/routing/route';

export default Route.extend({
	model() {
		let noticeModel = this.modelFor('page-notice'),
			scenario = noticeModel.scenario;

		return scenario;
	}
});
