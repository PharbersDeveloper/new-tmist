import DS from 'ember-data';

export default DS.Model.extend({
	targetNumber: DS.attr('number'),	// 目标数量
	targetCoverage: DS.attr('number'),	// 目标覆盖率
	highLevelFrequency: DS.attr('number'),	// A类医生拜访频次
	middleLevelFrequency: DS.attr('number'),	// B类医生拜访频次
	lowLevelFrequency: DS.attr('number'),	// C类医生拜访频次
	time: DS.attr('date'),
	representative: DS.belongsTo('representative')

});
