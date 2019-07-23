import EmberRouter from "@ember/routing/router"
import config from "./config/environment"
// import { inject as service } from "@ember/service"
// import Route from "@ember/routing/route"

const Router = EmberRouter.extend( {
    location: config.locationType,
    rootURL: config.rootURL
} )

Router.map( function() {
  this.route( "page", { path: "/" }, function() {
      this.route( "login" )
      this.route( "welcome" )
      this.route( "project", { path: "/project/:project_id" }, function() {
        this.route( "period", { path: "/period/:period_id" } )
        this.route('result');
      } )
  } )

  this.route( "service", function() {
      this.route( "oauth-callback" )
  } )

  this.route('project', function() {});
} )

export default Router
