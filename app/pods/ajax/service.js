import AjaxService from 'ember-ajax/services/ajax';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
export default AjaxService.extend({
	cookies: service(),
	headers: computed(function () {
		let cookies = this.get('cookies');

		return {
			'Content-Type': 'application/json', // 默认值
			'Accept': 'application/json',
			'Authorization': `Bearer ${cookies.read('access_token')}`
		};
	})
});
