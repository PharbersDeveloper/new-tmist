import Route from '@ember/routing/route';

export default Route.extend({
	afterModel() {
		let applicationController = this.controllerFor('application');

		applicationController.set('testProgress', 1);
	}
});
