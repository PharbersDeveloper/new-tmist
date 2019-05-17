import Route from '@ember/routing/route';
import { A } from '@ember/array';
import RSVP, { all } from 'rsvp';

export default Route.extend({
	afterModel(model, { sequence }) {
		let applicationController = this.controllerFor('application'),
			currentController = this.controllerFor('page-report');

		currentController.set('fromResutl', sequence > 2);
		applicationController.set('testProgress', 1);
	},
	setupController(controller, model) {
		this._super(controller, model);

		let promiseArray = [
				model.get('regionalDivisionResult'),
				model.get('manageTeamResult'),
				model.get('manageTimeResult'),
				model.get('resourceAssignsResult'),
				model.get('targetAssignsResult')
			],
			that = this;

		RSVP.Promise.all(promiseArray).then(data => {
			return all(data.map(ele => ele.get('levelConfig')));
		}).then(data => {
			return all(data.map(ele => ele.get('level')));
		}).then(data => {
			let radarData = data.map(ele => ele.level),
				numberRadarData = that.wordToNumber(radarData);

			controller.set('radarData', A([
				{
					value: numberRadarData,
					name: '能力得分'
				}]));
			controller.set('radarItems', A(['区域划分能力', '领导力', '自我时间管理能力', '资源优化能力', '指标分配能力']));

		});
	},
	wordToNumber(wordArray) {
		return wordArray.map(ele => {
			if (ele === 'S') {
				return 5;
			}
			if (ele === 'A') {
				return 4;
			}
			if (ele === 'B') {
				return 3;
			}
			if (ele === 'C') {
				return 4;
			}
			if (ele === 'D') {
				return 1;
			}
		});
	}
});
