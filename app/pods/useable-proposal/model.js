import DS from 'ember-data';

export default DS.Model.extend({
	accountId: DS.attr('string'),
	proposal: DS.belongsTo('proposal')
});
