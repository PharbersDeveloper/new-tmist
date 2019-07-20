import DS from "ember-data"

export default DS.Model.extend( {
	category: DS.attr( "enum", {
		options: [
			"Business",
			"Management",
			"Resource"
		]} ),
	salesTarget: DS.attr( "number", { defaultValue: -1 } ),
	budget: DS.attr( "number", { defaultValue: -1 } ),
	meetingPlaces: DS.attr( "number", { defaultValue: -1 } ),
	visitTime: DS.attr( "number", { defaultValue: -1 } ),
	assistAccessTime: DS.attr( "number", { defaultValue: -1 } ),
	abilityCoach: DS.attr( "number", { defaultValue: -1 } ),
	productKnowledgeTraining: DS.attr( "number", { defaultValue: -1 } ),
	vocationalDevelopment: DS.attr( "number", { defaultValue: -1 } ),
	salesAbilityTraining: DS.attr( "number", { defaultValue: -1 } ),
	strategAnalysisTime: DS.attr( "number", { defaultValue: -1 } ),
	adminWorkTime: DS.attr( "number", { defaultValue: -1 } ),
	clientManagementTime: DS.attr( "number", { defaultValue: -1 } ),
	kpiAnalysisTime: DS.attr( "number", { defaultValue: -1 } ),
	teamMeetingTime: DS.attr( "number", { defaultValue: -1 } ),
	resource: DS.belongsTo( "model/resource", { defaultValue: null } ),
	product: DS.belongsTo( "model/product", { defaultValue: null} ),
	tartget: DS.belongsTo( "model/hospital", { defaultValue: null } )
} )
