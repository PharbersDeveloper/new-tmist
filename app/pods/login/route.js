import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
	ajax: inject(),
	clientId: '5cbd9f94f4ce4352ecb082a0',
	clientSecret: '5c90db71eeefcc082c0823b2',
	redirectUri: 'http://192.168.100.165:8081/oauth-callback',
	model() {
		const ajax = this.get('ajax');

		let host = 'http://192.168.100.116:9097',
			version = 'v0',
			resource = 'Thirdparty',
			scope = 'App/System:[NTM]',
			url = '';

		url = `?client_id=${this.get('clientId')}
					&client_secret=${this.get('clientSecret')}
					&scope=${scope}
					&redirect_uri=${this.get('redirectUri')}
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
