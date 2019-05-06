import Route from '@ember/routing/route';
import { A } from '@ember/array';
import { hash } from 'rsvp';

export default Route.extend({
	isHaveBusinessInput(paper, destConfigs, goodsConfig) {
		let state = paper.get('state'),
			reDeploy = Number(localStorage.getItem('reDeploy')) === 1;


		if (state === 1 && !reDeploy) {
			// return paper.get('paperinputs');
			return this.get('store').peekAll('businessinput');

		}
		return this.generateBusinessInputs(destConfigs, goodsConfig);
	},
	// normalFlow(newBusinessInputs) {
	// 	return newBusinessInputs;
	// },
	generateBusinessInputs(destConfigs, goodsConfig) {
		let promiseArray = A([]);

		promiseArray = destConfigs.map(ele => {
			return this.get('store').createRecord('businessinput', {
				destConfig: ele,
				destConfigId: ele.id,
				representativeId: '',
				resourceConfigId: '',
				resourceConfig: null,
				salesTarget: '',
				budget: '',
				goodsConfig,
				meetingPlaces: '',
				visitTime: ''
			});
		});
		return promiseArray;
	},
	model() {
		const totalConfigs = this.modelFor('page-scenario'),
			paper = totalConfigs.paper,
			destConfigs = totalConfigs.destConfigs,
			goodsConfigs = totalConfigs.goodsConfigs,
			goodsConfig = goodsConfigs.filter(ele => ele.get('productConfig.productType') === 0).firstObject;

		let tmp = this.isHaveBusinessInput(paper, destConfigs, goodsConfig);

		// let businessInputs = totalConfigs.businessInputs;
		// if (!tmp.isFulfilled) {
		this.controllerFor('page-scenario.business').set('businessInputs', tmp);
		this.controllerFor('page-scenario').set('businessInputs', tmp);

		return hash({
			businessInputs: tmp,
			mConf: totalConfigs.resourceConfManager,
			goodsConfigs,
			destConfigs,
			salesConfigs: totalConfigs.salesConfigs
		});
		// }

		// return tmp.sortBy('time').lastObject.get('businessinputs')
		// 	.then(data => {
		// 		this.controllerFor('page-scenario.business').set('businessInputs', data);
		// 		this.controllerFor('page-scenario').set('businessInputs', data);

		// 		return hash({
		// 			businessInputs: data,
		// 			mConf: totalConfigs.resourceConfManager,
		// 			goodsConfigs,
		// 			destConfigs,
		// 			salesConfigs: totalConfigs.salesConfigs
		// 		});
		// 	});
	}
});
