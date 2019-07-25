import DS from "ember-data"

export default DS.Model.extend( {
	accountId: DS.attr( "string" ),
	proposal: DS.belongsTo( "model/proposal" ),
	current: DS.attr( "number" ),
	pharse: DS.attr( "number" ),
	status: DS.attr( "number" ),
	startTime: DS.attr( "number", { defaultValue: new Date().getTime() } ),
	endTime: DS.attr( "number", { defaultValue: 0 } ),
	lastUpdate: DS.attr( "number" ),
	periods: DS.hasMany( "model/period" ),
	results: DS.hasMany( "model/result" )
} )
