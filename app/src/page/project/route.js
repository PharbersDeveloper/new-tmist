import Route from "@ember/routing/route"

export default Route.extend( {
	// //TODO 保证进入此页面时都会是一个新的 jobid
	// beforeModel() {
	// 	this._super( ...arguments )
	// 	window.localStorage.removeItem( "jobId" )
	// },
	model( params ) {
		return this.store.findRecord( "model/project", params.project_id )
	}
} )
