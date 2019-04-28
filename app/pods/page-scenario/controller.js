import Controller from '@ember/controller';
import { isEmpty } from '@ember/utils';
// 因临时逻辑暂时注释
// import { A } from '@ember/array';
// import rsvp from 'rsvp';

export default Controller.extend({
	/**
	 * @param  {number} managerTotalTime=100	经理分配总时间，默认值100(百分比值)
	 * @param  {model} managerinput	经理的输入
	 * @param  {models} representativeinputs 代表们的输入
	 */
	verificationManagerInput(managerTotalTime = 100, managerinput, representativeinputs) {
		let warningText = `尚未完成对经理时间的分配，请继续分配`,
			warning = { open: true, title: warningText, detail: warningText },
			usedTime = 0;

		if (isEmpty(managerinput) || isEmpty(representativeinputs)) {
			return { state: false, warning };
		}
		usedTime = managerinput.get('firstObject').get('totalManagerUsedTime');
		representativeinputs.forEach(ele => {
			usedTime += Number(ele.get('assistAccessTime'));
			usedTime += Number(ele.get('abilityCoach'));
		});
		if (usedTime !== managerTotalTime) {
			return { state: false, warning };
		}
		return { state: true };
	},
	//	存在没有完成的输入
	exitNotEntered(notFinishBusinessInputs) {
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
	},
	// businessinput 都输入完成后，验证是否有代表没有分配
	verificationRepHasAllocation(businessinputs, representatives) {
		let businessinputRepresentatives = businessinputs.map(ele => ele.get('resourceConfig.representativeConfig.representative.id')),
			allocateRepresentatives = businessinputRepresentatives.uniq().filter(item => item),
			differentRepresentatives = null,
			representativeIds = representatives.map(ele => ele.get('id'));

		// 判断是不是有代表没有分配工作
		if (allocateRepresentatives.length < representatives.length) {
			differentRepresentatives = representativeIds.concat(allocateRepresentatives).filter(v => !representativeIds.includes(v) || !allocateRepresentatives.includes(v));
			let firstRepId = differentRepresentatives.get('firstObject');

			this.set('warning', {
				open: true,
				title: this.get('store').peekRecord('representative', firstRepId).get('name'),
				detail: `尚未对“${this.get('store').peekRecord('representative', firstRepId).get('name')}”分配工作，请为其分配。`
			});
			return;
			// 代表全部分配完毕
		} else if (allocateRepresentatives.length === representatives.length) {
			let managerTotalTime = this.get('model').managerTotalTime,
				// 获取 businessinput & representativeinputs
				managerinput = this.get('store').peekAll('managerinput').filter(ele => ele.get('isNew')),
				representativeinputs = this.get('store').peekAll('representativeinput').filter(ele => ele.get('isNew')),
				manangerInputState = this.verificationManagerInput(managerTotalTime, managerinput, representativeinputs);

			if (!manangerInputState.state) {
				// 经理管理时间输入完毕,弹窗，点击确定为提交 input 及跳转
				this.set('warning', manangerInputState.warning);
				return;
			}
			// 经理管理时间输入完毕,弹窗，点击确定为提交 input 及跳转

			this.set('warning', {
				open: true,
				title: `确认提交`,
				detail: `您将提交本季度决策并输出执行报告，提交后将不可更改决策。`
			});
		}
	},
	//	验证 businessinput
	verificationBusinessinputs(businessinputs, representatives) {
		let notFinishBusinessInputs = businessinputs.filter(ele => !ele.get('isFinish'));

		if (notFinishBusinessInputs.length !== 0) {
			this.exitNotEntered(notFinishBusinessInputs);
		} else {
			this.verificationRepHasAllocation(businessinputs, representatives);
		}
	},
	actions: {
		submit() {
			let store = this.get('store'),
				representatives = store.peekAll('representative'),
				// representativeIds = representatives.map(ele => ele.get('id')),
				// 验证businessinputs
				businessinputs = store.peekAll('businessinput').filter(ele => ele.get('isNew'));
			// notFinishBusinessInputs = businessinputs.filter(ele => !ele.get('isFinish')),
			// 获取 businessinput & representativeinputs
			// managerinput = store.peekAll('managerinput').filter(ele => ele.get('isNew')),
			// representativeinputs = store.peekAll('representativeinput').filter(ele => ele.get('isNew'));

			this.verificationBusinessinputs(businessinputs, representatives);
			// // 验证 businessinput 中存在的未输入
			// if (notFinishBusinessInputs.length > 0) {
			// 	// 找到未完成输入的第一个
			// 	let firstNotFinishBI = notFinishBusinessInputs.get('firstObject'),
			// 		hospitalName = firstNotFinishBI.get('destConfig.hospitalConfig.hospital.name'),
			// 		detail = '';

			// 	//	找到未完成输入中的是代表/资源
			// 	if (isEmpty(firstNotFinishBI.get('resourceConfigId'))) {
			// 		detail = `尚未对“${hospitalName}”进行代表分配，请为其分配代表。`;
			// 	} else {
			// 		detail = `尚未对“${hospitalName}”进行资源分配，请为其分配资源。`;
			// 	}
			// 	this.set('warning', {
			// 		open: true,
			// 		title: firstNotFinishBI.get('destConfig.hospitalConfig.hospital.name'),
			// 		detail
			// 	});
			// 	return;
			// 	// 验证是否有代表未被选择
			// } else if (notFinishBusinessInputs.length === 0) {
			// 	let businessinputRepresentatives = businessinputs.map(ele => ele.get('resourceConfig.representativeConfig.representative.id')),
			// 		allocateRepresentatives = businessinputRepresentatives.uniq().filter(item => item),
			// 		differentRepresentatives = null;

			// 	// 判断是不是有代表没有分配工作
			// 	if (allocateRepresentatives.length < representatives.length) {
			// 		differentRepresentatives = representativeIds.concat(allocateRepresentatives).filter(v => !representativeIds.includes(v) || !allocateRepresentatives.includes(v));
			// 		let firstRepId = differentRepresentatives.get('firstObject');

			// 		this.set('warning', {
			// 			open: true,
			// 			title: store.peekRecord('representative', firstRepId).get('name'),
			// 			detail: `尚未对“${store.peekRecord('representative', firstRepId).get('name')}”分配工作，请为其分配。`
			// 		});
			// 		return;
			// 		// 代表全部分配完毕
			// 	} else if (allocateRepresentatives.length === representatives.length) {
			// 		let managerTotalTime = this.get('model').managerTotalTime,
			// 			manangerInputState = this.verificationManagerInput(managerTotalTime, managerinput, representativeinputs);

			// 		if (!manangerInputState.state) {
			// 			// 经理管理时间输入完毕,弹窗，点击确定为提交 input 及跳转
			// 			this.set('warning', manangerInputState.warning);
			// 			return;
			// 		}
			// 		// 经理管理时间输入完毕,弹窗，点击确定为提交 input 及跳转

			// 		this.set('warning', {
			// 			open: true,
			// 			title: `确认提交`,
			// 			detail: `您将提交本季度决策并输出执行报告，提交后将不可更改决策。`
			// 		});
			// 		// if (manangerInputState.state) {
			// 		// 	// 经理管理时间输入完毕,弹窗，点击确定为提交 input 及跳转
			// 		// 	this.set('warning', {
			// 		// 		open: true,
			// 		// 		title: `确认提交`,
			// 		// 		detail: `您将提交本季度决策并输出执行报告，提交后将不可更改决策。`
			// 		// 	});
			// 		// }
			// 	}
			// 	//	如果没有则应该判断管理决策的输入情况
			// 	this.transitionToRoute('page-result');

			// }

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
