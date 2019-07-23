import Component from '@ember/component';

export default Component.extend({
    actions: {
		toResult() {
			this.transitionToRoute('page-result');
		},
		toIndex() {
			window.location = ENV.redirectUri;
		}
	}
});
