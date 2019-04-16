import DS from 'ember-data';

export default DS.Model.extend({
	hospitalName: DS.attr('string'),
	productName: DS.attr('string'),
	potential: DS.attr('number'),	//	潜力
	quotaAchievement: DS.attr('number'),	//	指标达成率
	sales: DS.attr('number'),
	salesQuota: DS.attr('number'),	// 销售指标
	share: DS.attr('number'),	// 份额
	destConfig: DS.belongsTo('destConfig'),
	goodsConfig: DS.belongsTo('goodsConfig')
});
