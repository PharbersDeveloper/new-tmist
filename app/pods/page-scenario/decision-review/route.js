import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { A } from '@ember/array';

export default Route.extend({
	model() {
		const store = this.get('store'),
			pageScenarioModel = this.modelFor('page-scenario'),
			salesConfigs = pageScenarioModel.salesConfigs;

		let businessModel = this.modelFor('page-scenario.business'),
			managerinput = pageScenarioModel.managerInput,
			representativeinputs = pageScenarioModel.representativeInputs,
			businessinputs = businessModel.businessInputs;

		return hash({
			// managerinput: store.peekAll('managerinput').lastObject,
			// businessinputs: store.peekAll('businessinput'),
			// representativeinputs: store.peekAll('representativeinput'),
			managerinput,
			businessinputs,
			representativeinputs,
			salesConfigs,
			goodsConfigs: pageScenarioModel.goodsConfigs.filter(ele => ele.get('productConfig.productType') === 0)
		});

	},
	setupController(controller, model) {
		this._super(...arguments);
		controller.set('groupValue', 0);
		controller.set('tmpGc', model.goodsConfigs.get('firstObject'));
		controller.set('tmpSr', A([]));
	}
});
