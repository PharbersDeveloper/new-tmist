import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { A } from '@ember/array';

export default Route.extend({
	model() {
		let store = this.get('store'),
			totalModel = this.modelFor('page-scenario'),
			managerinput = store.peekAll('managerinput').filter(ele => ele.get('isNew')).get('lastObject'),
			representativeinputs = store.peekAll('representativeinput').filter(ele => ele.get('isNew')),
			businessinputs = store.peekAll('businessinput').filter(ele => ele.get('isNew'));

		return hash({
			managerinput,
			businessinputs,
			representativeinputs,
			goodsConfigs: totalModel.goodsConfigs.filter(ele => ele.get('productConfig.productType') === 0)
		});

	},
	setupController(controller, model) {
		this._super(...arguments);
		controller.set('groupValue', 0);
		controller.set('tmpGc', model.goodsConfigs.get('firstObject'));
		controller.set('tmpSr', A([]));
	}
});
