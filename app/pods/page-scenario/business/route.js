import Route from '@ember/routing/route';
// import { A } from '@ember/array';
import { hash } from 'rsvp';

export default Route.extend({
	// isHaveBusinessInput(paper, destConfigs, goodsConfig) {
	// 	let state = paper.get('state'),
	// 		reDeploy = Number(localStorage.getItem('reDeploy')) === 1;

	// 	if (state === 1 && !reDeploy) {
	// 		// return paper.get('paperinputs');
	// 		return this.get('store').peekAll('businessinput');

	// 	}
	// 	return this.generateBusinessInputs(destConfigs, goodsConfig);
	// },
	// // normalFlow(newBusinessInputs) {
	// // 	return newBusinessInputs;
	// // },
	// generateBusinessInputs(destConfigs, goodsConfig) {
	// 	let promiseArray = A([]);

	// 	promiseArray = destConfigs.map(ele => {
	// 		return this.get('store').createRecord('businessinput', {
	// 			destConfig: ele,
	// 			destConfigId: ele.id,
	// 			representativeId: '',
	// 			resourceConfigId: '',
	// 			resourceConfig: null,
	// 			salesTarget: '',
	// 			budget: '',
	// 			goodsConfig,
	// 			meetingPlaces: '',
	// 			visitTime: ''
	// 		});
	// 	});
	// 	return promiseArray;
	// },
	model() {
		const pageScenarioModel = this.modelFor('page-scenario'),
			// paper = pageScenarioModel.paper,
			businessInputs = pageScenarioModel.businessInputs,
			destConfigs = pageScenarioModel.destConfigs,
			goodsConfigs = pageScenarioModel.goodsConfigs,
			resourceConfRep = pageScenarioModel.resourceConfRep;

		// goodsConfig = goodsConfigs.filter(ele => ele.get('productConfig.productType') === 0).firstObject;

		// let businessInputs = this.isHaveBusinessInput(paper, destConfigs, goodsConfig);

		this.controllerFor('page-scenario.business').set('businessInputs', businessInputs);
		this.controllerFor('page-scenario').set('businessInputs', businessInputs);

		return hash({
			businessInputs: businessInputs,
			resourceConfManager: pageScenarioModel.resourceConfManager,
			goodsConfigs,
			destConfigs,
			resourceConfRep,
			salesConfigs: pageScenarioModel.salesConfigs
		});
	}
});
