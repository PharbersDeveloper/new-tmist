import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
	ajax: service(),
	cookies: service(),
	clientId: '5c90f3fc830346b827fb0905',
	clientSecret: '5c90db71eeefcc082c0823b2',
	redirectUri: 'http://192.168.100.165:8081/oauth-callback',
	beforeModel(transition) {
		let version = 'v0',
			resource = 'GenerateAccessToken',
			scope = 'App/System:[NTM]',
			url = '',
			cookies = this.get('cookies');

		const ajax = this.get('ajax'),
			{ queryParams } = transition;

		if (queryParams.code && queryParams.state) {
			url = `?response_type=authorization_code
					&client_id=${this.get('clientId')}
					&client_secret=${this.get('clientSecret')}
					&scope=${scope}
					&redirect_uri=${this.get('redirectUri')}
					&code=${queryParams.code}
					&state=${queryParams.state}`.
				replace(/\n/gm, '').
				replace(/ /gm, '').
				replace(/\t/gm, '');
			ajax.request([version, resource, url].join('/'))
				.then(response => {
					cookies.write('token', response.access_token);
					// cookies.write('account_id', response.account_id);
					cookies.write('account_id', '5c4552455ee2dd7c36a94a9e');
					cookies.write('access_token', response.access_token);
					cookies.write('refresh_token', response.refresh_token);
					cookies.write('expiry', response.expiry);
					cookies.write('token_type', response.token_type);
					this.transitionTo('application');
				});
		} else {
			this.transitionTo('application');
		}
	}
});
