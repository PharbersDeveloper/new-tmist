import DS from "ember-data"

export default DS.Model.extend( {
	rank: DS.attr( "string" ),
	rankImg: DS.belongsTo( "model/image" ),
	awardImg: DS.belongsTo( "model/image" )
} )
