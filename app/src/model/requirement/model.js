import DS from "ember-data"

export default DS.Model.extend( {
	totalQuotas: DS.attr( "number" ),
	meetingPlaces: DS.attr( "number" ),
	visitingHours: DS.attr( "number" ),
	teamExperience: DS.attr( "string" ),
	teamDescription: DS.attr( "string" ),
	managerKpi: DS.attr( "number" ),
	mangementHours: DS.attr( "number" ),
	totalBudget: DS.attr( "number" )
} )
