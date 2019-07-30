import DS from "ember-data"

export default DS.Model.extend( {
	name: DS.attr( "string" ),
	describe: DS.attr( "string" ),
	totalPhase: DS.attr( "number" ),
	inputIds: DS.attr( ),
	salesReportIds: DS.attr( ),
	personnelAssessmentIds: DS.attr( ),
	quota: DS.belongsTo( "model/requirement" ),
	products: DS.hasMany( "model/product" ),
	targets: DS.hasMany( "model/hospital" ),
	resources: DS.hasMany( "model/resource" ),
	presets: DS.hasMany( "model/preset" ),
	evaluations: DS.hasMany( "model/evaluation" ),
	validation: DS.belongsTo( "model/validation" )
} )
