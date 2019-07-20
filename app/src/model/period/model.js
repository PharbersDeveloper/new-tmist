import DS from "ember-data"

export default DS.Model.extend( {
	name: DS.attr( "string" ),
	answers: DS.hasMany( "model/answer" ),
	last: DS.belongsTo( "model/period", { defaultValue: null } ),
	reports: DS.hasMany( "model/report" )
} )
