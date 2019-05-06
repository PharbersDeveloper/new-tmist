import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
	oauthService: service('oauth_service'),
	beforeModel(transition) {
		this.oauthService.oauthCallback(transition);
	}
});
