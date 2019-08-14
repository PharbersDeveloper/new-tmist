import DS from "ember-data"

export default DS.Model.extend( {
	inputType: DS.attr( "string" ),
	maxValue: DS.attr( "string" ),
	mustInput: DS.attr( "string" ),
	mustFullyAllocate: DS.attr( "string" ),
	noZero: DS.attr( "string" ),
	special: DS.attr( "string" )
} )
