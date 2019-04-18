import Controller from '@ember/controller';

export default Controller.extend({

	actions: {
		logout() {

		},
		endMission() {
			this.transitionToRoute('index');
		},
		exitMission() {

		}
	}
});
