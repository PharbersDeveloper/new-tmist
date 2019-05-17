import DS from 'ember-data';

export default DS.Model.extend({
	code: DS.attr('number'),
	text: DS.attr('string'),
	title: DS.belongsTo(),
	level: DS.belongsTo()
});
