import Controller from '@ember/controller';
import { htmlSafe } from '@ember/template';
import { A } from '@ember/array';

export default Controller.extend({
	notice: localStorage.getItem('notice') !== 'false',
	step: 1,
	detail: htmlSafe(`<p class='m-0 model-desc'>平台介绍</p><p class='m-0 model-desc'>在平台中，您将作为区域销售经理</p>`),
	neverShow: A(['不在显示']),
	actions: {
		changeDetail(useableProposal, paper) {
			this.set('model.detailProposal', useableProposal);
			this.set('model.detailPaper', paper);
		},
		startDeploy(proposalId) {
			this.transitionToRoute('page-notice', proposalId);
		},
		reDeploy() {
			let proposalId = this.get('model').detailProposal.get('proposal.id');

			this.set('reDeploy', false);
			// reDeploy 为 1 的时候，代表用户选择`重新部署`
			localStorage.setItem('reDeploy', 1);
			this.transitionToRoute('page-notice', proposalId);
		},
		prevStep() {
			let step = this.get('step') - 1;

			this.set('step', step);
			if (step === 2) {
				this.set('detail',
					htmlSafe(`<p class='m-0 model-desc'>关卡流程介绍</p>
				<p class='m-0 model-desc'>每个关卡都代表一个虚拟销售区域，有多周目、单周目，您需要，关卡完成后您将
				得到一份测评报告</p>`));
			} else {
				this.set('detail',
					htmlSafe(`<p class='m-0 model-desc'>平台介绍</p><p class='m-0 model-desc'>在平台中，您将作为区域销售经理</p>`));
			}
		},
		submit() {
			let step = this.get('step');

			if (step === 1) {
				this.set('detail',
					htmlSafe(`<p class='m-0 model-desc'>关卡流程介绍</p>
				<p class='m-0 model-desc'>每个关卡都代表一个虚拟销售区域，有多周目、单周目，您需要，关卡完成后您将
				得到一份测评报告</p>`));
			} else {
				this.set('detail',
					htmlSafe(`<p class='m-0 model-desc'>新的挑战即将开始，您准备好了吗？</p>`));
			}
			this.set('step', ++step);
		},
		closeNotice() {
			this.set('notice', false);
		},
		chooseItem(item) {
			if (item.length > 0) {
				localStorage.setItem('notice', false);
			} else {
				localStorage.setItem('notice', true);
			}
		}
	}
});
