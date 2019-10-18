import Controller from "@ember/controller"
import { inject as service } from "@ember/service"
// import ENV from "new-tmist/config/environment"
// import { A } from "@ember/array"
// import { isEmpty } from "@ember/utils"
// import RSVP from "rsvp"
// import Ember from "ember"
// const { keys } = Object

export default Controller.extend( {
	cookies: service(),
	oauthService: service( "service/oauth" ),
	em: service( "emitter" ),
	showNavbar: true,
	init() {
		this._super( ...arguments )
		// 总控设置Config
		this.em.SetConfig( {
			"connect": { host: "tcp://123.56.179.133", port: "46532" },
			"qos": 1
		} )
		// 初始化MQTT Connect并设置全局Singleton MessageHandel Hook，
		// 不想要单例Message把MessageSingleton(false) or remove了
		this.em.Connect().MessageSingleton( true )
	},
	actions: {
		endMission() {
			this.transitionToRoute( "page.welcome" )
		}
	}
} )
