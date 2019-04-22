import Controller from '@ember/controller';
import { isEmpty } from '@ember/utils';
// 因临时逻辑暂时注释
// import { A } from '@ember/array';
// import rsvp from 'rsvp';

export default Controller.extend({
	actions: {
		submit() {
			let store = this.get('store'),
				representatives = store.peekAll('representative'),
				representativeIds = representatives.map(ele => ele.get('id')),
				// 验证businessinputs
				businessinputs = store.peekAll('businessinput').filter(ele => ele.get('isNew')),
				notFinishBusinessInputs = businessinputs.filter(ele => !ele.get('isFinish'));

			// 验证 businessinput 中存在的未输入
			if (notFinishBusinessInputs.length > 0) {
				// 找到未完成输入的第一个
				let firstNotFinishBI = notFinishBusinessInputs.get('firstObject'),
					hospitalName = firstNotFinishBI.get('destConfig.hospitalConfig.hospital.name'),
					detail = '';

				//	找到未完成输入中的是代表/资源
				if (isEmpty(firstNotFinishBI.get('resourceConfigId'))) {
					detail = `尚未对“${hospitalName}”进行代表分配，请为其分配代表。`;
				} else {
					detail = `尚未对“${hospitalName}”进行资源分配，请为其分配资源。`;
				}
				this.set('warning', {
					open: true,
					title: firstNotFinishBI.get('destConfig.hospitalConfig.hospital.name'),
					detail
				});
				return;
				// 验证是否有代表未被选择
			} else if (notFinishBusinessInputs.length === 0) {
				let businessinputRepresentatives = businessinputs.map(ele => ele.get('resourceConfig.representativeConfig.representative.id')),
					allocateRepresentatives = businessinputRepresentatives.uniq().filter(item => item),
					differentRepresentatives = null;

				// 判断是不是有代表没有分配工作
				if (allocateRepresentatives.length < 5) {
					differentRepresentatives = representativeIds.concat(allocateRepresentatives).filter(v => !representativeIds.includes(v) || !allocateRepresentatives.includes(v));
					let firstRepId = differentRepresentatives.get('firstObject');

					this.set('warning', {
						open: true,
						title: store.peekRecord('representative', firstRepId).get('name'),
						detail: `尚未对“${store.peekRecord('representative', firstRepId).get('name')}”分配工作，请为其分配。`
					});
					return;
				}
				//	如果没有则应该判断管理决策的输入情况
				this.transitionToRoute('page-result');

			}

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
			// this.transitionToRoute('page-result');
		}
	}
});
