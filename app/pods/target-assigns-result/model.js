import DS from 'ember-data';

export default DS.Model.extend({
	levelConfig: DS.belongsTo(),
	assessmentReportDescribes: DS.hasMany()
});
