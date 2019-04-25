import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
	ajax: inject(),
	clientId: '5cbd9f94f4ce4352ecb082a0',
	clientSecret: '5c90db71eeefcc082c0823b2',
	model() {
		const ajax = this.get('ajax'),
			applicationAdapter = this.get('store').adapterFor('application');

		let version = `${applicationAdapter.get('namespace')}`,
			host = `${applicationAdapter.get('serviceHost')}`,
			resource = 'Thirdparty',
			scope = 'App/System:[NTM]',
			url = '',
			redirectUri = `${applicationAdapter.get('host')}/oauth-callback`;

		url = `?client_id=${this.get('clientId')}
					&client_secret=${this.get('clientSecret')}
					&scope=${scope}
					&redirect_uri=${redirectUri}
					&status=self`.
			replace(/\n/gm, '').
			replace(/ /gm, '').
			replace(/\t/gm, '');
		return ajax.request([host, version, resource, url].join('/'), {
			dataType: 'text'
		}).then(response => {
			return response;
		});
	}
});
