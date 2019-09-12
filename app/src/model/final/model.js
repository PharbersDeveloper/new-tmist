import DS from "ember-data"

export default DS.Model.extend( {
	sales: DS.attr( "number" ),
	quota: DS.attr( "number" ),
	budget: DS.attr( "number" ),
	quotaAchv: DS.attr( "number" ),
	salesForceProductivity: DS.attr( "number" ),
	roi: DS.attr( "number" ),
	newAccount: DS.attr( "number" ),
	generalPerformance: DS.attr( "number" ),
	resourceAssigns: DS.attr( "number" ),
	regionDivision : DS.attr( "number" ),
	targetAssigns : DS.attr( "number" ),
	manageTime: DS.attr( "number" ),
	manageTeam: DS.attr( "number" )
} )
