import Service from "@ember/service"
import { inject as service } from "@ember/service"
import { isEmpty } from "@ember/utils"
import { A } from "@ember/array"
import ENV from "../../../config/environment"
import Ember from "ember"
const { keys } = Object

export default Service.extend( {
	cookies: service(),
	ajax: service(),
	router: service(),

	groupName: "",

	oauthOperation() {
		const ajax = this.get( "ajax" )

		let host = `${ ENV.OAuth.Host }`,
			version = `${ ENV.API.Version }`,
			resource = "ThirdParty",
			url = `?client_id=${ ENV.OAuth.ClientId }
                    &client_secret=${ ENV.OAuth.ClientSecret }
                    &scope=${ ENV.OAuth.Scope }
                    &status=${ ENV.OAuth.Status }
                    &redirect_uri=${ ENV.OAuth.RedirectUri }/service/oauth-callback`.
				replace( /\n/gm, "" ).
				replace( / /gm, "" ).
				replace( /\t/gm, "" )

		return ajax.request( [host, version, resource, url].join( "/" ), {
			dataType: "text"
		} ).then( response => {
			return response

		} ).catch( err => {
			Ember.Logger.error( err )
		} )
	},

	oauthCallback( queryParams ) {
		let version = `${ ENV.API.Version }`,
			host = `${ ENV.OAuth.Host }`,
			resource = "GenerateAccessToken",
			url = "",
			cookies = this.get( "cookies" )

		const ajax = this.get( "ajax" )
		// { queryParams } = transition

		if ( queryParams.code && queryParams.state ) {
			url = `?client_id=${ ENV.OAuth.ClientId }
					&client_secret=${ ENV.OAuth.ClientSecret }
					&scope=${ ENV.OAuth.Scope }
					&redirect_uri=${ ENV.OAuth.RedirectUri }/service/oauth-callback
					&code=${queryParams.code}
					&state=${queryParams.state}`.
				replace( /\n/gm, "" ).
				replace( / /gm, "" ).
				replace( /\t/gm, "" )

			ajax.request( [host, version, resource, url].join( "/" ) )
				.then( response => {
					this.removeAuth()
					let expiry = new Date( response.expiry ),
						options = {
							domain: ".pharbers.com",
							path: "/",
							expires: expiry
						}

					cookies.write( "token", response.access_token, options )
					cookies.write( "account_id", response.account_id, options )
					cookies.write( "access_token", response.access_token, options )
					cookies.write( "refresh_token", response.refresh_token, options )
					cookies.write( "token_type", response.token_type, options )
					cookies.write( "scope", response.scope, options )
					cookies.write( "expiry", response.expiry, options )

					// this.get( "router" ).transitionTo( "index" )
					Ember.Logger.info( "auth token successful" )
				} )
				.catch( () => {
					// this.get( "router" ).transitionTo( "index" )
					Ember.Logger.error( "auth token failed" )
				} )
		} else {
			// this.get( "router" ).transitionTo( "index" )
			Ember.Logger.error( "auth token failed" )
		}
	},

	judgeAuth( targetName ) {

		let tokenFlag = false,
			scopeFlag = false,
			token = this.get( "cookies" ).read( "access_token" ),
			scope = this.get( "cookies" ).read( "scope" )

		if ( !isEmpty( token ) ) {
			tokenFlag = true
		}

		if ( !isEmpty( scope ) ) {
			let scopeString = scope.split( "/" )[1],
				scopes = scopeString.split( "," )

			scopes.forEach( elem => {
				let appScope = elem.split( ":" )[0],
					scopeGroup = elem.split( ":" )[1]

				if ( appScope === "NTM" && scopeGroup !== "" && typeof scopeGroup !== "undefined" ) {
					scopeFlag = true
				}
			} )
			scope.split( "/" )[1].split( "," ).forEach( elem => {
				let appScope = elem.split( ":" )[0],
					scopeGroup = elem.split( ":" )[1]

				if ( appScope === "NTM" && scopeGroup !== "" && typeof scopeGroup !== "undefined" ) {
					this.set( "groupName", scopeGroup.split( "#" )[0] )
				}
			} )
		}

		if ( ( !tokenFlag || !scopeFlag ) && targetName !== ENV.OAuth.RedirectEndpoint ) {
			this.router.transitionTo( ENV.OAuth.AuthEndpoint )
		}
	},

	removeAuth() {
		this.set( "groupName", "" )
		let options = { domain: ".pharbers.com", path: "/" },
			cookies = this.get( "cookies" ).read(),
			totalCookies = A( [] )

		totalCookies = keys( cookies ).map( ele => ele )

		totalCookies.forEach( ele => {
			this.get( "cookies" ).clear( ele, options )
		} )
	}
} )