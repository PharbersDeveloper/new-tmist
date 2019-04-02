import Route from '@ember/routing/route';
import { A } from '@ember/array';
import { hash } from 'rsvp';

export default Route.extend({
	isHaveBusinessInput(businessInputs, self, destConfigs, store) {
		if (businessInputs.get('length') > 0) {
			return self.normalFlow(store);
		}
		return self.generateBusinessInputs(destConfigs);
	},
	normalFlow(store) {
		return store.peekAll('businessinput');
	},
	generateBusinessInputs(destConfigs) {
		let promiseArray = A([]);

		promiseArray = destConfigs.map(ele => {
			return this.get('store').createRecord('businessinput', {
				destConfigId: ele.id,
				representativeId: '',
				salesTarget: '',
				budget: '',
				meetingPlaces: '',
				visitTime: ''
			});
		});
		return promiseArray;
	},
	model() {
		let store = this.get('store'),
			totalConfigs = this.modelFor('page-scenario'),
			destConfigs = totalConfigs.destConfigs,
			businessInputs = store.peekAll('businessinput'),
			tmp = this.isHaveBusinessInput(businessInputs, this, destConfigs, store);

		this.controllerFor('page-scenario.business').set('businessInputs', tmp);

		return hash({
			businessInputs: tmp,
			mConf: totalConfigs.resourceConfManager,
			goodsConfigs: totalConfigs.goodsConfigs,
			destConfigs,
			salesConfigs: totalConfigs.salesConfigs
		});

	}
});
