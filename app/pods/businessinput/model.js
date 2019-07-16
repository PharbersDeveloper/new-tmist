import DS from 'ember-data';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { A } from '@ember/array';

export default DS.Model.extend({
	destConfigId: DS.attr('string'),	// 待删除
	resourceConfigId: DS.attr('string'),	// 待删除（注意 isFinish！!）
	salesTarget: DS.attr('blank-nan'),	// 销售目标设定
	budget: DS.attr('blank-nan'),	// 预算费用
	meetingPlaces: DS.attr('blank-nan'),	// 会议名额
	visitTime: DS.attr('blank-nan'),
	// isFinish: computed('salesTarget', 'budget', 'meetingPlaces', 'visitTime', 'resourceConfigId', function () {
	// 	let { salesTarget, budget, meetingPlaces, visitTime, resourceConfigId } =
	// 		this.getProperties('salesTarget', 'budget', 'meetingPlaces', 'visitTime', 'resourceConfigId'),
	// 		tmpArray = A([salesTarget, budget, meetingPlaces, visitTime, resourceConfigId]);

	// 	return tmpArray.every(ele => {
	// 		return !isEmpty(ele);
	// 	});
	// }),
	isFinish: computed('salesTarget', 'budget', 'visitTime', 'resourceConfigId', function () {
		let { salesTarget, budget, visitTime, resourceConfigId } =
			this.getProperties('salesTarget', 'budget', 'visitTime', 'resourceConfigId'),
			tmpArray = A([salesTarget, budget, visitTime, resourceConfigId]);

		return tmpArray.every(ele => {
			return !isEmpty(ele);
		});
	}),
	destConfig: DS.belongsTo(),
	resourceConfig: DS.belongsTo(),
	goodsConfig: DS.belongsTo()
});
