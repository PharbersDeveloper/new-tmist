import DS from 'ember-data';

export default DS.Model.extend({
	paperId: DS.attr('string'),
	phase: DS.attr('number'),
	businessinputs: DS.hasMany('businessinput'),
	managerinputs: DS.hasMany('managerinput'),
	representativeinputs: DS.hasMany('representativeinput')

});
