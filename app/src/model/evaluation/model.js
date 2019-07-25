import DS from "ember-data"

export default DS.Model.extend( {
	category: DS.attr( "string" ),
	level: DS.attr( "string" ),
	levelDescription: DS.attr( "string" ),
	actionDescription: DS.attr( "string" )
} )
