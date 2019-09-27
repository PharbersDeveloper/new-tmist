import Controller from "@ember/controller"
import { inject as service } from "@ember/service"
import { computed } from "@ember/object"

export default Controller.extend( {
	gen: service( "service/gen-data" ),
	runtimeConfig: service( "service/runtime-config" ),
	deploy( project ) {
		this.gen.genPeriodWithProject( project ).then( x => {
			window.location = "/project/" + project.id + "/period/" + x.id
			// this.transitionToRoute( "page.project.period", project.id, x.id )
		} )
	},
	curProject: computed( function() {
		return this.model.provious.get( "lastObject" )
	} ),
	actions: {
		toHistory( pid ) {
			this.transitionToRoute( "page.history" , pid )
		},
		startDeployConfirm() {

			this.set( "startDeployConfirm", {
				open: true,
				title: "重新部署",
				detail: "确定要重新开始测试吗？我们将删除您进行中的决策记录。"
			} )

		},
		startDeploy( proposal ) {
			// window.localStorage.setItem( "roundHistory", false )
			this.runtimeConfig.setRoundHistoryFalse()
			this.gen.genProjectWithProposal( proposal ).then( x => {
				this.deploy( x )
			} )
		},
		continueDeploy( aProject ) {
			// window.localStorage.setItem( "roundHistory", false )
			this.runtimeConfig.setRoundHistoryFalse()
			if ( this.model.periodsLength === aProject.get( "current" ) ) {
				this.transitionToRoute( "page.project.result" , aProject.get( "id" ) )
			} else {
				this.transitionToRoute( "page.project.period", aProject.id, aProject.periods.lastObject.get( "id" ) )

			}

		},
		startAgainDeploy( proposal ) {
			// window.localStorage.setItem( "roundHistory", false )
			this.runtimeConfig.setRoundHistoryFalse()
			// old project status : 1
			if ( this.curProject ) {
				this.curProject.destroyRecord()
				// this.set( "curProject.status", 1 )
				// this.curProject.save()
			}

			this.set( "startDeployConfirm", {
				open: false
			} )

			this.gen.genProjectWithProposal( proposal ).then( x => {
				this.deploy( x )
			} )
			// this.actions.startDeploy( proposal )
		}
	}
} )

// import Controller from "@ember/controller"
// import { inject as service } from "@ember/service"
// import { computed } from "@ember/object"

// export default Controller.extend( {
// 	gen: service( "service/gen-data" ),
// 	ajax: service(),
// 	cookies: service(),
// 	em: service( "emitter" ),
// 	client: computed( function () {
// 		return this.em.GetInstance()
// 	} ),
// 	targetProjectId: "",
// 	targetPeriodId: "",
// 	onMessage( msg ) {
// 		window.console.info( "Emitter Controller" )
// 		window.console.info( msg.channel + " => " + msg.asString() )
// 		let msgObj = msg.asObject()
// 		let jobId = JSON.parse( msgObj.msg )

// 		console.log(jobId)
// 		if ( msgObj.status === 1 ) {
// 			this.transitionToRoute( "page.project.period", this.targetProjectId, this.targetPeriodId )
// 		}
// 	},
// 	Subscribe() {
// 		window.console.info( "emitter" )
// 		// 获取Client Instance
// 		// let client = this.em.GetInstance()
// 		// API: 参照https://emitter.io/develop/javascript/
// 		// 订阅  参数：channel key，channel name，消息类型（message, error, disconnect），MessageHandel
// 		this.client.Subscribe( "XsKflXovpPuCKy4rGlioYVC7h6N1uutu", "tm/", "message", this.onMessage.bind( this ) )
// 	},
// 	callBackend() {
// 		let proposalId = this.model.proposal.get( "id" ),
// 			projectId = this.targetProjectId,
// 			periodId = this.targetPeriodId,
// 			type = this.model.proposal.get( "case" )

// 		this.get( "ajax" ).post( "/callR", {
// 			headers: {
// 				"dataType": "json",
// 				"Content-Type": "application/json",
// 				"Authorization": `Bearer ${this.cookies.read( "access_token" )}`
// 			},
// 			data: {
// 				callr: false,
// 				type: type,
// 				proposalId: proposalId,
// 				projectId: projectId,
// 				periodId: periodId
// 			}
// 		} ).then( res => {
// 			window.console.log( res )
// 			window.console.log( "callBackend Success!" )
// 		} )
// 	},
// 	deploy( project ) {
// 		this.gen.genPeriodWithProject( project ).then( x => {
// 			this.set( "targetProjectId", project.id )
// 			this.set( "targetPeriodId", x.id )
// 			this.callBackend()
// 		} )
// 	},

// 	actions: {
// 		toHistory( pid ) {
// 			this.transitionToRoute( "page.history" , pid )
// 		},
// 		startDeploy( proposal ) {
// 			this.gen.genProjectWithProposal( proposal ).then( x => {
// 				this.deploy( x )
// 			} )
// 		},
// 		continueDeploy( aProject ) {
// 			this.set( "targetProjectId", aProject.id )
// 			this.set( "targetPeriodId", aProject.periods.lastObject.get( "id" ) )
// 			this.callBackend()
// 		}
// 	}
// } )
