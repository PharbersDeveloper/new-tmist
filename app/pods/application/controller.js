import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import RSVP from 'rsvp';
const { keys } = Object;

export default Controller.extend({
	cookies: service(),
	oauthService: service('oauth_service'),
	actions: {
		/**
		 * 退出账号
		 */
		logout() {
			let cookies = this.get('cookies').read(),
				totalCookies = A([]);

			totalCookies = keys(cookies).map(ele => ele);

			new RSVP.Promise((resolve) => {
				totalCookies.forEach(ele => {
					this.get('cookies').clear(ele, { domain: 'pharbers.com', path: '/' });
				});
				localStorage.clear();
				return resolve(true);
			}).then(() => {
				window.location.reload();
			});
		},
		endMission() {
			let url = this.get('oauthService').get('redirectUri');

			window.location = url;
		},
		saveInputs() {
			this.set('exitMission', false);
			this.transitionToRoute('index');
		}
	}
});
