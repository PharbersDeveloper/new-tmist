import DS from 'ember-data';

export default DS.Model.extend({
	productKnowledge: DS.attr('number'),	// 产品知识
	salesAbility: DS.attr('number'),	// 销售能力
	regionalManagementAbility: DS.attr('number'),	// 区域管理能力
	jobEnthusiasm: DS.attr('number'),	// 工作热情程度
	behaviorValidity: DS.attr('number'),	//行为有效性
	representative: DS.belongsTo()
});
