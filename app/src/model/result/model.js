import DS from "ember-data"

export default DS.Model.extend( {
	category: DS.attr( "string" ),
	abilityLevel: DS.belongsTo( "model/level" ),
	awardLevel: DS.belongsTo( "model/level" )
} )
