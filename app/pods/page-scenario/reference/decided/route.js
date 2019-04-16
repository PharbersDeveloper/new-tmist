import Route from '@ember/routing/route';
import { A } from '@ember/array';
import { reject } from 'rsvp';

export default Route.extend({
	model() {
		let store = this.get('store'),
			currentController = this.controllerFor('page-scenario.reference.decided'),
			paper = store.peekAll('paper').get('lastObject'),
			paperinputs = store.query('paperinput',
				{ 'paper-id': paper.id }),
			increasePaperinputs = A([]),
			phases = A([]),
			totalModel = A([]);

		return paperinputs.then(data => {
			increasePaperinputs = data.sortBy('phase');
			let hasOldDecided = increasePaperinputs.some(ele => {
				return ele.get('phase') > 0;
			});

			if (!hasOldDecided) {
				return reject();
			}
			phases = increasePaperinputs.map(ele => {
				return {
					phase: `第${ele.get('phase')}周期`,
					index: ele.get('phase') - 1
				};

			});
			currentController.set('phases', phases);
			currentController.set('tmpPhase', phases.get('lastObject'));

			return increasePaperinputs.map(ele => {
				return ele.get('managerinputs');
			});
		}).then(data => {
			// data为周期数量的数组，表示周期数量的 managerinput
			// 组合 managerinput 的数据
			data.forEach(ele => {
				totalModel.push({ managerinput: ele.get('lastObject') });
			});
			return increasePaperinputs.map(ele => {
				return ele.get('representativeinputs');
			});
		}).then(data => {
			// data为周期数量的数组，表示周期数量的 representativeinputs
			// 组合 representativeinputs 的数据
			data.forEach((ele, index) => {
				totalModel[index].representativeinputs = ele;
			});
			return increasePaperinputs.map(ele => {
				return ele.get('businessinputs');
			});
		}).then(data => {
			// data为周期数量的数组，表示周期数量的 businessinputs
			// 组合 businessinputs 的数据
			data.forEach((ele, index) => {
				totalModel[index].businessinputs = ele;
			});
		}).catch(() => {
		}).then(() => {
			return totalModel;
		});
	}
});
