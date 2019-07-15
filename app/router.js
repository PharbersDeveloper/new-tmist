import EmberRouter from "@ember/routing/router"
import config from "./config/environment"
// import { inject as service } from "@ember/service"
import Route from "@ember/routing/route"

const Router = EmberRouter.extend( {
	location: config.locationType,
	rootURL: config.rootURL
} )

Route.reopen( {
	showNav: true,
	setupController() {
		this._super( ...arguments )
		this.controllerFor( "application" ).set( "showNavbar", this.get( "showNav" ) )
	}
} )

Router.map( function() {
	this.route( "test" )
} )

export default Router
