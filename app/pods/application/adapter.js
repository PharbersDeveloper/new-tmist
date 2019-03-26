import DS from 'ember-data';
import { computed } from '@ember/object';
import { camelize } from '@ember/string';
import { pluralize } from 'ember-inflector';

export default DS.JSONAPIAdapter.extend({
	namespace: 'v0',
	pathForType(type) {
		let newType = pluralize(camelize(type));

		return newType;
	},
	headers: computed(function () {
		return {
			'dataType': 'json',
			'contentType': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': `bearer 46fa418a3ec8ec32cd8662a589f3b403`
		};
	})
});
