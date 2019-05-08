import Controller from '@ember/controller';
import ENV from 'new-tmist/config/environment';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { A } from '@ember/array';
import rsvp from 'rsvp';
import { inject as service } from '@ember/service';

export default Controller.extend({
	ajax: service(),
	cookies: service(),
	testBtn: computed(function () {
		if (ENV.environment === 'development') {
			return true;
		}
		return false;
	}),
	oauthService: service('oauth_service'),
	/**
	 * @param  {number} managerTotalTime=100	经理分配总时间，默认值100(百分比值)
	 * @param  {model} managerinput	经理的输入
	 * @param  {models} representativeinputs 代表们的输入
	 */
	verificationManagerInput(managerTotalTime = 100, managerinput, representativeinputs) {
		let warningText = `尚未完成对经理时间的分配，请继续分配`,
			warning = { open: true, title: `提交执行`, detail: warningText },
			usedTime = 0;

		if (isEmpty(managerinput) || isEmpty(representativeinputs)) {
			return { state: false, warning };
		}
		usedTime = managerinput.get('totalManagerUsedTime');
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
	/**
	 * @param  {Array} notFinishBusinessInputs
	 */
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
			title: hospitalName,
			detail
		});
		return;
	},
	// businessinput 都输入完成后，验证是否有代表没有分配
	/**
	 * @param  {model} businessinputs
	 * @param  {model} representatives
	 */
	verificationRepHasAllocation(businessinputs, representatives) {
		let businessinputRepresentatives = businessinputs.map(ele => ele.get('resourceConfig.representativeConfig.representative.id')),
			allocateRepresentatives = businessinputRepresentatives.uniq().filter(item => item),
			differentRepresentatives = null,
			representativeIds = representatives.map(ele => ele.get('id'));

		// 判断是不是有代表没有分配工作
		if (allocateRepresentatives.length < representatives.length) {
			differentRepresentatives = representativeIds.concat(allocateRepresentatives).filter(v => !representativeIds.includes(v) || !allocateRepresentatives.includes(v));
			let firstRepId = differentRepresentatives.get('firstObject'),
				representativeName = this.get('store').peekRecord('representative', firstRepId).get('name');

			this.set('warning', {
				open: true,
				title: representativeName,
				detail: `尚未对“${representativeName}”分配工作，请为其分配。`
			});
			return;
			// 代表全部分配完毕
		} else if (allocateRepresentatives.length === representatives.length) {
			let managerTotalTime = this.get('model').managerTotalTime,
				// 获取 businessinput & representativeinputs
				// 在page-scenario.management 获取之后进行的设置.
				managerinput = this.get('managerInput'),
				representativeinputs = this.get('representativeInputs'),
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
			this.set('confirmSubmit', true);
			return;
		}
	},
	//	验证 businessinput
	/**
	 * @param  {model} businessinputs
	 * @param  {model} representatives
	 */
	verificationBusinessinputs(businessinputs, representatives) {
		let notFinishBusinessInputs = businessinputs.filter(ele => !ele.get('isFinish'));

		if (notFinishBusinessInputs.length !== 0) {
			this.exitNotEntered(notFinishBusinessInputs);
		} else {
			this.verificationRepHasAllocation(businessinputs, representatives);
		}
	},
	// 发送input data
	sendInput(state) {
		const ajax = this.get('ajax'),
			applicationAdapter = this.get('store').adapterFor('application'),
			store = this.get('store'),
			model = this.get('model'),
			paper = model.paper,
			scenario = model.scenario;

		//	正常逻辑
		let version = `${applicationAdapter.get('namespace')}`,
			paperId = paper.id,
			paperinputs = paper.get('paperinputs').sortBy('time'),
			paperinput = paperinputs.lastObject,
			reDeploy = Number(localStorage.getItem('reDeploy')),
			phase = 1,
			promiseArray = A([]);

		promiseArray = A([
			store.peekAll('businessinput').save(),
			store.peekAll('managerinput').save(),
			store.peekAll('representativeinput').save()
		]);

		rsvp.Promise.all(promiseArray)
			.then(data => {
				if (paper.state === 1 && reDeploy === 1 || paper.state !== 1) {
					return store.createRecord('paperinput', {
						paperId,
						phase,
						scenario: scenario,
						time: new Date().getTime(),
						businessinputs: data[0],
						managerinputs: data[1],
						representativeinputs: data[2]
					}).save();
				}
				paperinput.setProperties({
					phase,
					time: new Date().getTime(),
					businessinputs: data[0],
					managerinputs: data[1],
					representativeinputs: data[2]
				});
				return paperinput.save();
			}).then(data => {
				paper.get('paperinputs').pushObject(data);
				// paper.set('state', state);
				paper.set('endTime', new Date().getTime());

				if (paper.state !== 1) {
					paper.set('startTime', localStorage.getItem('startTime'));
				}
				return paper.save();

			}).then(() => {
				let notice = localStorage.getItem('notice');

				localStorage.clear();
				localStorage.setItem('notice', notice);
				if (state === 1) {
					this.set('warning', {
						open: true,
						title: `保存成功`,
						detail: `保存成功。`
					});
					// window.location = this.get('oauthService').redirectUri;
					return;
				}
				return ajax.request(`${version}/CallRCalculate`, {
					method: 'POST',
					data: JSON.stringify({
						'proposal-id': this.get('model').proposal.id,
						'account-id': this.get('cookies').read('account_id')
					})
				}).then((response) => {
					if (response.status === 'Success') {
						paper.set('state', state);
						paper.save().then(() => {
							this.transitionToRoute('page-result');
						});
						return;
					}

					return response;
				}).catch(err => {
					window.console.log('error');
					window.console.log(err);
				});
			});
	},
	judgeOauth() {
		let oauthService = this.get('oauthService'),
			judgeAuth = oauthService.judgeAuth();

		return judgeAuth ? oauthService.redirectUri : null;
	},
	actions: {
		submit() {
			let judgeAuth = this.judgeOauth(),
				store = this.get('store'),
				representatives = store.peekAll('representative'),
				// 验证businessinputs
				// 在page-scenario.business 获取之后进行的设置.

				// businessinputs = this.get('businessInputs');
				businessinputs = store.peekAll('businessinput');

			if (isEmpty(judgeAuth)) {
				window.location = judgeAuth;
				return;
			}
			this.verificationBusinessinputs(businessinputs, representatives);
		},
		confirmSubmit() {
			this.sendInput(3);
		},
		saveInputs() {
			let judgeAuth = this.judgeOauth();

			if (isEmpty(judgeAuth)) {
				window.location = judgeAuth;
				return;
			}
			this.sendInput(1);
		},
		testResult() {
			this.transitionToRoute('page-result');
		}
	}
});
