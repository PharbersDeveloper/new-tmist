import DS from "ember-data"

export default DS.Model.extend( {
	validationType: DS.attr( "string" ),
	expression: DS.attr( "string" ),
	condition: DS.attr( "string" ),
	error: DS.attr( "string" ),
	leftValue: DS.attr( "string" ),
	rightValue: DS.attr( "string" )
} )
