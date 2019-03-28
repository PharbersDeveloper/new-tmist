import Route from '@ember/routing/route';
import { A } from '@ember/array';
import rsvp from 'rsvp';

export default Route.extend({
	hasBusinessInput(businessInputs, self, destConfigs, store) {
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
				salesTarget: 0,
				budget: 0,
				meetingPlaces: 0,
				visitTime: 0
			});
		});
		return promiseArray;
	},
	model() {
		let totalConfigs = this.modelFor('page-scenario'),
			destConfigs = totalConfigs.destConfigs,
			store = this.get('store'),
			businessInputs = store.peekAll('businessinput'),
			tmp = this.hasBusinessInput(businessInputs, this, destConfigs, store);

		this.controllerFor('page-scenario.business').set('businessInputs', tmp);

		return rsvp.hash({
			businessInputs: tmp,
			mConf: totalConfigs.resourceConfManager,
			goodsConfigs: totalConfigs.goodsConfigs,
			destConfigs: totalConfigs.destConfigs
		});

	}
});
