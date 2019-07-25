import DS from "ember-data"

export default DS.Model.extend( {
	category: DS.attr( "string" ),
	abilityLevel: DS.attr( "string" ),
	awardLevel: DS.attr( "string" ),
	proposal: DS.belongsTo( "model/proposal" ),
	img: DS.belongsTo( "model/image" )
} )
