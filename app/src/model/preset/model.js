import DS from "ember-data"

export default DS.Model.extend( {
	hospital: DS.belongsTo( "model/hospital" ),
	product: DS.belongsTo( "model/product" ),
	resource: DS.belongsTo( "model/resource" ),
	salesQuota: DS.attr( "number" ),
	potential: DS.attr( "number" ),
	achievements: DS.attr( "number" ),
	category: DS.attr( "number" ),
	sales: DS.attr( "number" ),
	share: DS.attr( "number" ),
	territoryManagementAbility: DS.attr( "number" ),
	salesSkills: DS.attr( "number" ),
	productKnowledge: DS.attr( "number" ),
	behaviorEfficiency: DS.attr( "number" ),
	workMotivation: DS.attr( "number" ),
	targetDoctorNum: DS.attr( "number" ),
	targetDoctorCoverage: DS.attr( "number" ),
	highTarget: DS.attr( "number" ),
	middleTarget: DS.attr( "number" ),
	lowTarget: DS.attr( "number" )
} )
