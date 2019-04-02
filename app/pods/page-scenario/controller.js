import Controller from '@ember/controller';
// 因临时逻辑暂时注释
// import { A } from '@ember/array';
// import rsvp from 'rsvp';

export default Controller.extend({
	actions: {
		submit() {
			//	正常逻辑
			// let store = this.get('store'),
			// 	paper = store.peekAll('paper').get('firstObject'),
			// 	paperId = paper.id,
			// 	phase = paper.get('paperinputs').get('length') + 1,
			// 	promiseArray = A([
			// 		store.peekAll('businessinput').save(),
			// 		store.peekAll('managerinput').save(),
			// 		store.peekAll('representativeinput').save()
			// 	]);

			// rsvp.Promise.all(promiseArray)
			// 	.then(data => {
			// 		return store.createRecord('paperinput', {
			// 			paperId,
			// 			phase,
			// 			businessinputs: data[0],
			// 			managerinputs: data[1],
			// 			representativeinputs: data[2]

			// 		}).save();
			// 	}).then(data => {
			// 		let tmpPaperinput = paper.get('paperinputs');

			// 		tmpPaperinput.then(tmp => {
			// 			tmp.pushObject(data);
			// 			paper.save();
			// 		}).then(() => {
			// 			this.transitionToRoute('page-result');
			// 		});

			// 	});
			// 临时逻辑
			this.transitionToRoute('page-result');
		}
	}
});
