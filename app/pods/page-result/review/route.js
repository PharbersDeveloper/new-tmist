import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
	model() {
		let store = this.get('store'),
			resourceConfig = this.modelFor('page-scenario'),
			// paper = resourceConfig.paper,
			scenario = resourceConfig.scenario;
		// paperinputs = paper.get('paperinputs'),
		// increasePaperinputs = A([]),
		// lastPaperinput = {},
		// managerinput = null,
		// representativeinputs = A([]),
		// businessinputs = A([]);

		// return paperinputs.then(data => {
		// 	increasePaperinputs = data.sortBy('time');
		// 	lastPaperinput = increasePaperinputs.get('lastObject');
		// 	return lastPaperinput.get('managerinputs');
		// }).then(data => {
		// 	// 组合 managerinput 的数据
		// 	managerinput = data.get('lastObject');
		// 	return lastPaperinput.get('representativeinputs');
		// }).then(data => {
		// 	// 组合 representativeinputs 的数据
		// 	representativeinputs = data;
		// 	return lastPaperinput.get('businessinputs');
		// }).then(data => {
		// 	// 组合 businessinputs 的数据
		// 	businessinputs = data;
		// 	return RSVP.hash({
		// 		managerinput,
		// 		businessinputs,
		// 		representativeinputs,
		// 		goodsConfigs: store.query('goodsConfig',
		// 			{ 'scenario-id': scenario.id })
		// 	});
		// });
		return RSVP.hash({
			managerinput: store.peekAll('managerinput').lastObject,
			businessinputs: store.peekAll('businessinput'),
			representativeinputs: store.peekAll('representativeinput'),
			goodsConfigs: store.query('goodsConfig',
				{ 'scenario-id': scenario.id })
		});
	}
});
