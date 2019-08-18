import DS from "ember-data"

export default DS.Model.extend( {
	category: DS.attr( "string", { defaultValue: "Business" } ),
	// category: DS.attr( "enum", {
	// 	options: [
	// 		"Business",
	// 		"Management",
	// 		"Resource"
	// 	]} ),
	salesTarget: DS.attr( "number", { defaultValue: 0 } ),
	budget: DS.attr( "number", { defaultValue: 0 } ),
	meetingPlaces: DS.attr( "number", { defaultValue: 0 } ),
	visitTime: DS.attr( "number", { defaultValue: 0 } ),
	assistAccessTime: DS.attr( "number", { defaultValue: 0 } ),
	abilityCoach: DS.attr( "number", { defaultValue: 0 } ),
	productKnowledgeTraining: DS.attr( "number", { defaultValue: 0 } ),
	vocationalDevelopment: DS.attr( "number", { defaultValue: 0 } ),
	regionTraining: DS.attr( "number", { defaultValue: 0 } ),
	performanceTraining: DS.attr( "number", { defaultValue: 0 } ),
	salesAbilityTraining: DS.attr( "number", { defaultValue: 0 } ),
	strategAnalysisTime: DS.attr( "number", { defaultValue: 0 } ),
	adminWorkTime: DS.attr( "number", { defaultValue: 0 } ),
	clientManagementTime: DS.attr( "number", { defaultValue: 0 } ),
	kpiAnalysisTime: DS.attr( "number", { defaultValue: 0 } ),
	teamMeetingTime: DS.attr( "number", { defaultValue: 0 } ),
	resource: DS.belongsTo( "model/resource", { defaultValue: null } ),
	product: DS.belongsTo( "model/product", { defaultValue: null} ),
	target: DS.belongsTo( "model/hospital", { defaultValue: null } )
} )
