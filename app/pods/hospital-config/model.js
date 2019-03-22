import DS from 'ember-data';

export default DS.Model.extend({
	doctorNumber: DS.attr('number'),
	bedNumber: DS.attr('number'),
	income: DS.attr('number'),
	hospital: DS.belongsTo(),
	policies: DS.hasMany('policy'),
	departments: DS.hasMany('department'),
	destConfig: DS.belongsTo()
});
