import DS from "ember-data"

export default DS.Model.extend( {
	category: DS.attr( "string" ),
	abilityLevel: DS.attr( "string" ),
	awardLevel: DS.attr( "string" ),
	abilityImg: DS.belongsTo( "model/image" ),
	awardImg: DS.belongsTo( "model/image" )
} )
