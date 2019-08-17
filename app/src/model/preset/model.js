import DS from "ember-data"

export default DS.Model.extend( {
	proposalId: DS.attr("string"),
	projectId: DS.attr("string"),
	preiodId: DS.attr("string"),
	hospital: DS.belongsTo( "model/hospital" ),
	product: DS.belongsTo( "model/product" ),
	resource: DS.belongsTo( "model/resource" ),
	category: DS.attr( "number" ),
	lastQuota: DS.attr( "number" ),
	lastSales: DS.attr( "number" ),
	lastShare: DS.attr( "number" ),
	lastAchievement: DS.attr( "number" ),
	potential: DS.attr( "number" ),
	currentTMA: DS.attr( "number" ),
	currentSalesSkills: DS.attr( "number" ),
	currentProductKnowledge: DS.attr( "number" ),
	currentBehaviorEfficiency: DS.attr( "number" ),
	currentBehaviorEfficiency: DS.attr( "number" ),
	currentTargetDoctorNum: DS.attr( "number" ),
	currentTargetDoctorCoverage: DS.attr( "number" ),
	currentClsADoctorVT: DS.attr( "number" ),
	currentClsBDoctorVT: DS.attr( "number" ),
	currentClsCDoctorVT: DS.attr( "number" ),
	phase: DS.attr("number"),
	lastBudget: DS.attr("number"),
	initBudget: DS.attr("number")
} )
