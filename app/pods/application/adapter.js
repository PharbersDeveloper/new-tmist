import DS from 'ember-data';
import { computed } from '@ember/object';
import { camelize } from '@ember/string';
import { pluralize } from 'ember-inflector';
import { inject as service } from '@ember/service';

export default DS.JSONAPIAdapter.extend({
	namespace: 'v0',
	host: 'http://ntm.pharbers.com',
	// host: 'http://ntm.pharbers.com:8081',
	serviceHost: 'http://oauth.pharbers.com',
	// serviceHost: 'http://192.168.100.116:9097',
	cookies: service(),
	pathForType(type) {
		let newType = pluralize(camelize(type));

		return newType;
	},
	headers: computed(function () {
		let cookies = this.get('cookies');

		return {
			'dataType': 'json',
			'contentType': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${cookies.read('access_token')}`
		};
	})
});
