import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
	ajax: service(),
	cookies: service(),
	clientId: '5cbd9f94f4ce4352ecb082a0',
	clientSecret: '5c90db71eeefcc082c0823b2',
	beforeModel(transition) {
		const ajax = this.get('ajax'),
			cookies = this.get('cookies'),
			{ queryParams } = transition,
			applicationAdapter = this.get('store').adapterFor('application');

		let version = `${applicationAdapter.get('namespace')}`,
			host = `${applicationAdapter.get('serviceHost')}`,
			resource = 'GenerateAccessToken',
			scope = `${applicationAdapter.get('scope')}`,
			url = '',
			redirectUri = `${applicationAdapter.get('host')}/oauth-callback`;

		if (queryParams.code && queryParams.state) {
			url = `?response_type=authorization_code
					&client_id=${this.get('clientId')}
					&client_secret=${this.get('clientSecret')}
					&scope=${scope}
					&redirect_uri=${redirectUri}
					&code=${queryParams.code}
					&state=${queryParams.state}
					&status=self`.
				replace(/\n/gm, '').
				replace(/ /gm, '').
				replace(/\t/gm, '');
			ajax.request([host, version, resource, url].join('/'))
				.then(response => {
					let expiry = response.expiry,
						parseExpiry = Date.parse(expiry),
						currentDate = Date.parse(new Date()),
						maxAge = Math.floor((parseExpiry - currentDate) / 1000),
						options = {
							maxAge: maxAge,
							domain: '.pharbers.com',
							path: '/'
						};

					// cookies.write('account_id', response.account_id);
					cookies.write('account_id', '5c4552455ee2dd7c36a94a9e', options);
					cookies.write('access_token', response.access_token, options);
					cookies.write('refresh_token', response.refresh_token, options);
					cookies.write('token_type', response.token_type, options);
					cookies.write('scope', response.scope, options);
					this.transitionTo('index');
				});
		} else {
			this.transitionTo('login');
		}
	}
});
