import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { A } from '@ember/array';
import EmberObject from '@ember/object';

export default Route.extend({
	model() {
		let totalConfigs = this.modelFor('page-scenario'),
			destConfigs = totalConfigs.destConfigs,
			businessInputs = A([]);

		// businessInputs = destConfigs.map(ele => {
		// 	console.log(ele.id);
		// 	let hospConfId = null,
		// 		hospitalId = null,
		// 		businessInput = null;

		// 	businessInput = ele.get('hospitalConfig').then(data => {
		// 		hospConfId = data.id;
		// 		return data.get('hospital');
		// 	}).then(data => {
		// 		hospitalId = data.id;
		// 		return {
		// 			hospitalId,
		// 			representativeId: '',
		// 			salesTarget: 0,
		// 			budget: 0,
		// 			meetingPlaces: 0,
		// 			visitTime: 0
		// 		};
		// 	});
		// });

		return hash({
			mConf: totalConfigs.resourceConfManager,
			goodsConfigs: totalConfigs.goodsConfigs,
			destConfigs: totalConfigs.destConfigs
		});
	}
});
