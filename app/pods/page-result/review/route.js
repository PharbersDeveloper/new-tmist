import Route from '@ember/routing/route';
import { A } from '@ember/array';
import RSVP from 'rsvp';

export default Route.extend({
	model() {
		let store = this.get('store'),
			paper = store.peekAll('paper').get('lastObject'),
			paperinputs = paper.get('paperinputs'),
			increasePaperinputs = A([]),
			lastPaperinput = {},
			managerinput = null,
			representativeinputs = A([]),
			businessinputs = A([]);

		return paperinputs.then(data => {
			increasePaperinputs = data.sortBy('phase');
			lastPaperinput = increasePaperinputs.get('lastObject');
			return lastPaperinput.get('managerinputs');
		}).then(data => {
			// 组合 managerinput 的数据
			managerinput = data.get('lastObject');
			return lastPaperinput.get('representativeinputs');
		}).then(data => {
			// 组合 representativeinputs 的数据
			representativeinputs = data;
			return lastPaperinput.get('businessinputs');
		}).then(data => {
			// 组合 businessinputs 的数据
			businessinputs = data;
			return RSVP.hash({
				managerinput,
				businessinputs,
				representativeinputs,
				goodsConfigs: store.query('goodsConfig',
					{ 'scenario-id': '5c7cdf18421aa98e2c382f61' })
			});
		});
	}
});
