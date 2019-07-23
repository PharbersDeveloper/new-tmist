import DS from "ember-data"

export default DS.Model.extend( {
	hospital: DS.belongsTo( "model/hospital" ),
	product: DS.belongsTo( "model/product" ),
	salesQuota: DS.attr( "number" ),
	potential: DS.attr( "number" ),
	achievements: DS.attr( "number" )
} )