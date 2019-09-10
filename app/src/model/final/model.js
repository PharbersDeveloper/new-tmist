import DS from "ember-data"

export default DS.Model.extend( {
	sales: DS.attr( "number" ),
	quota: DS.attr( "number" ),
	budget: DS.attr( "number" ),
	quotaAchv: DS.attr( "number" ),
	salesForceProductivity: DS.attr( "number" ),
	roi: DS.attr( "number" ),
	newAccount: DS.attr( "number" )
} )
