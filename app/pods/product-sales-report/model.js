import DS from 'ember-data';

export default DS.Model.extend({
	sales: DS.attr('number'),	// 销售额
	salesQuota: DS.attr('number'),	// 销售指标
	share: DS.attr('number'),	// 份额
	quotaAchievement: DS.attr('number', { defaultValue: 0 }),	// 指标达成率
	salesGrowth: DS.attr('number', { defaultValue: 0 }),	// 销售增长率
	goodsConfig: DS.belongsTo()
});
