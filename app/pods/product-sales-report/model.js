import DS from 'ember-data';

export default DS.Model.extend({
	productName: DS.attr('string'),	// 删除
	sales: DS.attr('number'),	// 销售额
	salesQuota: DS.attr('number'),	// 销售指标
	share: DS.attr('number'),	// 份额
	quotaAchievement: DS.attr('number'),	// 指标达成率
	goodsConfig: DS.belongsTo()
});
