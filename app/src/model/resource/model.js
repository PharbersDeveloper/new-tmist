import DS from "ember-data"

export default DS.Model.extend( {
	name: DS.attr( "string" ),
	gender: DS.attr( "number" ),
	avatar: DS.belongsTo( "model/image" )
} )
