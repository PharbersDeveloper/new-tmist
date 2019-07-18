import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr( "string" ),
	general: DS.attr( "string" ),
	avatar: DS.attr( "string" ),
	productCategory: DS.attr( "string" ),
	medicareCategory: DS.attr( "string" ),
	producer: DS.attr( "string" ),
});
