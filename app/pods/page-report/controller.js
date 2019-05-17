import Controller from '@ember/controller';
import ENV from 'new-tmist/config/environment';
import { A } from '@ember/array';

export default Controller.extend({
	radarData: A([]),
	actions: {
		toResult() {
			this.transitionToRoute('page-result');
		},
		toIndex() {
			window.location = ENV.redirectUri;
		}
	}
});
