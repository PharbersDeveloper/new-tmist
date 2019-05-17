import DS from 'ember-data';

export default DS.Model.extend({
	time: DS.attr('formatDate'),
	regionalDivisionResult: DS.belongsTo(),
	targetAssignsResult: DS.belongsTo(),
	resourceAssignsResult: DS.belongsTo(),
	manageTimeResult: DS.belongsTo(),
	manageTeamResult: DS.belongsTo(),
	generalPerformanceResult: DS.belongsTo()
});
