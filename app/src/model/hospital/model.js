import DS from "ember-data"

export default DS.Model.extend( {
	name: DS.attr( "string" ),
	describe: DS.attr( "string" ),
	regtime: DS.attr( "string" ),
	position: DS.attr( "string" ),
	code: DS.attr( "string" ),
	avatar: DS.belongsTo( "model/image" ),
	category: DS.attr( "string" ),
	level: DS.attr( "string" ),
	docterNumber: DS.attr( "number" ),
	bedNumber: DS.attr( "number" ),
	income: DS.attr( "number" ),
	spaceBelongs: DS.attr( "string" ),
	abilityToPay: DS.attr( "string" ),
	policies: DS.hasMany( "model/policy" ),
	splitRequirement: DS.belongsTo("model/split-requirement")
} )
