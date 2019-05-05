import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { A } from '@ember/array';

export default Route.extend({
	model() {
		let businessModel = this.modelFor('page-scenario.business'),
			totalModel = this.modelFor('page-scenario'),
			managerinput = totalModel.managerInput,
			representativeinputs = totalModel.representativeInputs,
			businessinputs = businessModel.businessInputs;

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
