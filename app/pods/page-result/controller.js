import Controller from '@ember/controller';
import ENV from 'new-tmist/config/environment';

export default Controller.extend({
	actions: {
		toReport() {
			this.transitionToRoute('page-report');
		},
		toIndex() {
			window.location = ENV.redirectUri;
		}
	}
});
