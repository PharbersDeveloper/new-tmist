import Controller from '@ember/controller';
import ENV from 'new-tmist/config/environment';

export default Controller.extend({
	actions: {
		toReport(assessmentReport) {
			this.transitionToRoute('page-report', assessmentReport);
		},
		toIndex() {
			window.location = ENV.redirectUri;
		}
	}
});
