import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
	cookies: service(),
	model() {
		let cookies = this.get('cookies');

		cookies.write('token', '46fa418a3ec8ec32cd8662a589f3b403');
	}
});
