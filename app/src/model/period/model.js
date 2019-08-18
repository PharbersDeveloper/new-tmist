import DS from "ember-data"

export default DS.Model.extend( {
	name: DS.attr( "string" ),
	phase: DS.attr( "number" ),
	answers: DS.hasMany( "model/answer" ),
	last: DS.belongsTo( "model/period", { defaultValue: null } ),
	reports: DS.hasMany( "model/report" ),
	presets: DS.hasMany( "model/preset" )
} )
