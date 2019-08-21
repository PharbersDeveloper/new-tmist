import Controller from "@ember/controller"
// import ENV from "new-tmist/config/environment"
// import { computed } from "@ember/object"
import { isEmpty } from "@ember/utils"
import { A } from "@ember/array"
import { computed, set } from "@ember/object"
import { inject as service } from "@ember/service"
import Ember from "ember"
// import { threadId } from "worker_threads"

export default Controller.extend( {
	cookies: service(),
	ajax: service(),
	toast: service(),
	exam: service( "service/exam-facade" ),
	runtimeConfig: service( "service/runtime-config" ),
	em: service( "emitter" ),
	client: computed( function () {
		return this.em.GetInstance()
	} ),
	currentTab: 3,
	// loadingForSubmit: false,
	loadingForSubmit: true,
	calcDone: false,
	allProductInfo: computed( function() {
		return this.getAllProductInfo()
	} ),
	getAllProductInfo() {
		let arr = []

		this.model.productQuotas.forEach( p => {
			let obj = {}

			obj.name = p.get( "product.name" )
			obj.allSales = p.lastQuota
			obj.productId = p.get( "product.id" )
			obj.curSales = 0
			obj.curBudget = 0

			this.model.answers.filter( x => x.get( "product.id" ) === obj.productId ).forEach( answer => {
				obj.curSales += this.transNumber( answer.get( "salesTarget" ) )
				obj.curBudget += this.transNumber( answer.get( "budget" ) )
			} )
			arr.push( obj )
		} )
		return A( arr )

	},
	onMessage( msg ) {
		window.console.info( "Emitter Controller" )
		window.console.info( msg.channel + " => " + msg.asString() )
		window.console.info( "firstCallEId" + " => " + this.firstCallEId )
		window.console.info( "secondCallEId" + " => " + this.secondCallEId )
		window.console.info( "calcJobId" + " => " + this.calcJobId )

		let msgObj = msg.asObject()

		if ( msgObj.status === "error" && this.calcJobId === msgObj.jobId ) {
			this.set( "loadingForSubmit", false )
			window.console.log( "计算出错啦 FXXXXXXXXXXXXXXXk" )
			return
		}

		let subMsg = JSON.parse( msgObj.msg )

		if ( subMsg.type.charAt( subMsg.type.length - 1 ) !== "r" && msgObj.status === "1" ) {
			this.runtimeConfig.set( "jobId", subMsg.job_id )

			if ( this.firstCallEId === msgObj.jobId ) {
				window.localStorage.setItem( "jobId", subMsg.job_id )
				// if ( this.calcDone === true && this.secondCallEId === msgObj.jobId) {

				// 	if ( this.model.period.phase + 1 === this.model.project.get( "proposal.totalPhase" ) ) {
				// 		this.model.project.set( "status", 1 ).save().then( () => {
				// 			this.set( "loadingForSubmit", false )
				// 			this.transitionToRoute( "page.project.result" )
				// 		} )
				// 	} else {
				// 		this.set( "loadingForSubmit", false )
				// 		this.transitionToRoute( "page.project.result" )
				// 	}
				// 	// document.getElementById( "submit-btn" ).click()
				// } else {
				this.set( "loadingForSubmit", false )
				// }

			} else if ( this.calcDone === true && this.secondCallEId === msgObj.jobId ) {
				window.localStorage.setItem( "jobId", subMsg.job_id )

				if ( this.model.period.phase + 1 === this.model.project.get( "proposal.totalPhase" ) ) {
					this.model.project.set( "status", 1 )
					this.model.project.set( "endTime", new Date().getTime() )
					this.model.project.set( "lastUpdate", new Date().getTime() )
					this.model.project.save().then( () => {
						this.set( "loadingForSubmit", false )
						this.transitionToRoute( "page.project.result" )
					} )
				} else {
					this.set( "loadingForSubmit", false )
					this.transitionToRoute( "page.project.result" )
				}

				// pressure test
				// this.set( "loadingForSubmit", false )
				// document.getElementById( "submit-btn" ).click()
			}

		} else if ( subMsg.type.charAt( subMsg.type.length - 1 ) === "r" && msgObj.status === "1" && this.calcJobId === msgObj.jobId ) {
			let proposalId = this.model.project.get( "proposal.id" ),
				projectId = this.model.project.get( "id" ),
				periodId = this.model.period.get( "id" ),
				type = this.model.project.get( "proposal.case" ),
				phase = this.model.period.get( "phase" )


			this.get( "ajax" ).post( "/callR", {
				headers: {
					"dataType": "json",
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.cookies.read( "access_token" )}`
				},
				data: {
					callr: false,
					type: type,
					phase: String( Number( phase ) + 1 ),
					proposalId: proposalId,
					projectId: projectId,
					periodId: periodId
				}
			} ).then( res => {
				window.console.log( res )
				window.console.log( "callBackend Success!" )
				this.set( "calcDone", true )
				this.set( "secondCallEId",res.id )
			} )
		}
	},
	Subscribe() {
		window.console.info( "emitter" )
		// 获取Client Instance
		// let client = this.em.GetInstance()
		// API: 参照https://emitter.io/develop/javascript/
		// 订阅  参数：channel key，channel name，消息类型（message, error, disconnect），MessageHandel
		this.client.Subscribe( "3-9kS0TxsJupymws2yKmXbI-x1OXu78p", "tm/", "message", this.onMessage.bind( this ) )
	},
	transNumber( input ) {
		let number = Number( input )

		if ( number === -1 || isNaN( number ) ) {
			return 0
		} else {
			return number
		}
	},

	ucbValidation() {
		let curerntBudget = 0,
			isOverSalesTarget = 0,
			overSalesTargetName = "",
			freeResource = [], // 没有分配的resource
			aResources = {}, // 被分配的resource
			hospitalWithoutResource = [],
			allBudget = this.model.project.proposal.get( "quota.totalBudget" )
		// currentMeetingPlaces = 0,
		// currentManagementTime = 0,
		// resourceWithLeftTime = [],
		// currentManagementPoint = 0,
		// hospitalWithoutMeetingPlaces = [],
		// hospitalWithoutBudgetOrSales = [],
		// allManagementPoint = this.model.project.proposal.get( "quota.managerKpi" )
		// allSalesTarget = this.model.project.proposal.get( "quota.totalQuotas" ),
		// allMeetingPlaces = this.model.project.proposal.get( "quota.meetingPlaces" ),
		// allManagementTime = this.model.project.proposal.get( "quota.mangementHours" )

		// 销售额指标超标或者未分配
		window.console.log( this.allProductInfo )
		this.allProductInfo.forEach( p => {
			if ( p.curSales > p.allSales ) {
				// 1 over
				// set( this, isOverSalesTarget, 1 )
				isOverSalesTarget = 1
				overSalesTargetName = p.name
			} else if ( p.curSales < p.allSales ) {
				// 2 is not enough
				// set( this, isOverSalesTarget, 2 )
				isOverSalesTarget = 2
				overSalesTargetName = p.name
			}
		} )

		//budget validation
		this.model.answers.filter( x => x.get( "category" ) === "Business" ).forEach( answer => {
			// 有医院未被分配会议名额
			// if ( answer.get( "meetingPlaces" ) === -1 ) {
			// 	hospitalWithoutMeetingPlaces.push( answer.get( "target.name" ) )
			// }
			// 有医院未分配销售额和预算
			// if ( answer.get( "budget" === -1 || answer.get( "salesTarget" ) === -1 ) ) {
			// 	hospitalWithoutBudgetOrSales.push( answer )
			// }
			// 有医院未被分配代表
			if ( !answer.get( "resource.id" ) ) {
				hospitalWithoutResource.push( answer.get( "target.name" ) )
			}
			// currentMeetingPlaces += this.transNumber( answer.get( "meetingPlaces" ) )
			curerntBudget += this.transNumber( answer.get( "budget" ) )
			if ( answer.resource.get( "id" ) ) {
				if ( answer.resource.get( "id" ) in aResources ) {
					// aResources[answer.resource.get( "id" )] += this.transNumber( answer.get( "visitTime" ) )
				} else {
					aResources[answer.resource.get( "id" )] = 0
					// aResources[answer.resource.get( "id" )] += this.transNumber( answer.get( "visitTime" ) )
				}

			}

		} )

		// 未被分配的代表
		this.model.resources.forEach( resource => {
			if ( !( resource.get( "id" ) in aResources ) ) {
				freeResource.push( resource )
			}
		} )

		if ( curerntBudget < allBudget ) {
			// 预算未达标
			this.set( "validationWarning", {
				open: true,
				title: "设定未达标",
				detail: "总预算尚未完成分配，请分配完毕。"
			} )
			return false
		} else if ( curerntBudget > allBudget ) {
			// 预算超标
			this.set( "validationWarning", {
				open: true,
				title: "设定超标",
				detail: "您的预算设定总值已超出总预算限制，请合理分配。"
			} )
			return false
		} else if ( isOverSalesTarget === 2 ) {
			// 销售额未达标
			this.set( "validationWarning", {
				open: true,
				title: "设定未达标",
				detail: `${overSalesTargetName}销售指标尚未完成分配，请完成指标分配。`
			} )

			return false
		} else if ( isOverSalesTarget === 1 ) {
			// 销售额超标
			this.set( "validationWarning", {
				open: true,
				title: "设定超标",
				detail: `${overSalesTargetName}的销售指标设定总值已超出业务总指标限制，请合理分配。`
			} )
			return false
		} else if ( freeResource.length ) {
			// 有代表未被分配
			let name = freeResource[0].name

			this.set( "validationWarning", {
				open: true,
				title: "有代表未被分配到医院",
				detail: `尚未对${name}分配工作，请为其分配。`
			} )
			return false
		} else if ( hospitalWithoutResource.length > 0 ) {
			// 有医院没有分配代表
			this.set( "validationWarning", {
				open: true,
				title: "有医院未分配代表",
				detail: `尚未对${hospitalWithoutResource[0]}进行代表分配，请为其分配代表`
			} )
		} else {
			return true
		}

		// else if ( hospitalWithoutMeetingPlaces.lenth > 0 ){
		// 	// 有医院 名额未被分配
		// 	this.set( "validationWarning", {
		// 		open: true,
		// 		title: "达标，但有医院名额有空状态，医院状态处于未分配。",
		// 		detail: `请为${hospitalWithoutMeetingPlaces[0]}设定会议名额，若不分配，请输入值“0”`
		// 	} )
		// } else if ( hospitalWithoutResource.length > 0 ) {
		// 	// 有医院没有分配代表
		// 	this.set( "validationWarning", {
		// 		open: true,
		// 		title: "有医院未分配代表",
		// 		detail: `尚未对${hospitalWithoutResource[0]}进行代表分配，请为其分配代表`
		// 	} )
		// } else if ( hospitalWithoutBudgetOrSales.length > 0 ) {
		// 	this.set( "validationWarning", {
		// 		open: true,
		// 		title: "有医院未分配资源",
		// 		detail: `尚未对${hospitalWithoutBudgetOrSales[0]}进行资源分配，请为其分配资源`
		// 	} )
		// }

	},

	tmValidation() {
		let curerntBudget = 0,
			isOverSalesTarget = 0,
			overSalesTargetName = "",
			currentMeetingPlaces = 0,
			currentManagementTime = 0,
			resourceWithLeftTime = [],
			freeResource = [], // 没有分配的resource
			aResources = {}, // 被分配的resource
			// currentManagementPoint = 0,
			// hospitalWithoutMeetingPlaces = [],
			// hospitalWithoutResource = [],
			// hospitalWithoutBudgetOrSales = [],
			// allManagementPoint = this.model.project.proposal.get( "quota.managerKpi" )
			allBudget = this.model.project.proposal.get( "quota.totalBudget" ),
			// allSalesTarget = this.model.project.proposal.get( "quota.totalQuotas" ),
			allMeetingPlaces = this.model.project.proposal.get( "quota.meetingPlaces" ),
			allManagementTime = this.model.project.proposal.get( "quota.mangementHours" )


		this.allProductInfo.forEach( p => {
			if ( p.curSales > p.allSales ) {
				// 1 over
				// set( this, isOverSalesTarget, 1 )
				isOverSalesTarget = 1
				overSalesTargetName = p.name
			} else if ( p.curSales < p.allSales ) {
				// 2 is not enough
				// set( this, isOverSalesTarget, 2 )
				isOverSalesTarget = 2
				overSalesTargetName = p.name
			}
		} )

		//budget validation
		this.model.answers.forEach( answer => {
			if ( answer.get( "category" ) === "Management" ) {

				currentManagementTime += this.transNumber( answer.get( "strategAnalysisTime" ) )
				currentManagementTime += this.transNumber( answer.get( "clientManagementTime" ) )
				currentManagementTime += this.transNumber( answer.get( "adminWorkTime" ) )
				currentManagementTime += this.transNumber( answer.get( "kpiAnalysisTime" ) )
				currentManagementTime += this.transNumber( answer.get( "teamMeetingTime" ) )

			} else if ( answer.get( "category" ) === "Resource" ) {


				currentManagementTime += this.transNumber( answer.get( "abilityCoach" ) )
				currentManagementTime += this.transNumber( answer.get( "assistAccessTime" ) )

			} else if ( answer.get( "category" ) === "Business" ) {
				// 有医院未被分配会议名额
				// if ( answer.get( "meetingPlaces" ) === -1 ) {
				// 	hospitalWithoutMeetingPlaces.push( answer.get( "target.name" ) )
				// }
				// 有医院未分配销售额和预算
				// if ( answer.get( "budget" === -1 || answer.get( "salesTarget" ) === -1 ) ) {
				// 	hospitalWithoutBudgetOrSales.push( answer )
				// }
				// 有医院未被分配代表
				// if ( !answer.get( "resource" ) ) {
				// 	hospitalWithoutResource.push( answer.get( "target.name" ) )
				// }
				currentMeetingPlaces += this.transNumber( answer.get( "meetingPlaces" ) )
				curerntBudget += this.transNumber( answer.get( "budget" ) )
				// currentSalesTarget += this.transNumber( answer.get( "salesTarget" ) )
				// 不同药品销售额可能分开？

				if ( answer.resource.get( "id" ) ) {
					window.console.log( this.transNumber( answer.get( "visitTime" ) ) )

					if ( answer.resource.get( "id" ) in aResources ) {
						aResources[answer.resource.get( "id" )] += this.transNumber( answer.get( "visitTime" ) )
					} else {
						aResources[answer.resource.get( "id" )] = 0
						aResources[answer.resource.get( "id" )] += this.transNumber( answer.get( "visitTime" ) )
					}

				}
			}
		} )
		this.model.resources.forEach( resource => {
			if ( !( resource.get( "id" ) in aResources ) ) {
				freeResource.push( resource )
			}

			// if ( resource.get( "totalTime" ) !== 0 ) {
			// 	resourceWithLeftTime.push( resource.get( "name" ) )
			// }
		} )

		for ( let key in aResources ) {
			if ( aResources[key] < 100 ) {
				this.model.resources.forEach( resource => {
					if ( resource.get( "id" ) === key ) {
						resourceWithLeftTime.push( resource )
					}
				} )
			}
		}

		if ( currentManagementTime < allManagementTime ) {
			// 经理时间未达标
			this.set( "validationWarning", {
				open: true,
				title: "未达标",
				detail: "请完成经理的管理时间分配。"
			} )
			return false
		} else if ( currentManagementTime > allManagementTime ) {
			// 经理时间超标
			this.set( "validationWarning", {
				open: true,
				title: "设定超额",
				detail: "经理时间设定已超过限制，请重新分配。"
			} )
			return false
		} else if ( curerntBudget < allBudget ) {
			// 预算未达标
			this.set( "validationWarning", {
				open: true,
				title: "设定未达标",
				detail: "总预算尚未完成分配，请分配完毕."
			} )
			return false
		} else if ( curerntBudget > allBudget ) {
			// 预算超标
			this.set( "validationWarning", {
				open: true,
				title: "设定超标",
				detail: "您的预算设定总值已超出总预算限制，请合理分配。"
			} )
			return false
		} else if ( isOverSalesTarget === 2 ) {
			// 销售额未达标
			this.set( "validationWarning", {
				open: true,
				title: "设定未达标",
				detail: `${overSalesTargetName}销售指标尚未完成分配，请完成指标分配。`
			} )
			return false
		} else if ( isOverSalesTarget === 1 ) {
			// 销售额超标
			this.set( "validationWarning", {
				open: true,
				title: "设定超标",
				detail: `${overSalesTargetName}的销售指标设定总值已超出业务总指标限制，请合理分配。`
			} )
			return false
		} else if ( currentMeetingPlaces < allMeetingPlaces ) {
			// 会议名额未达标
			this.set( "validationWarning", {
				open: true,
				title: "设定未达标",
				detail: "您还有会议名额剩余，请分配完毕。"
			} )
			return false
		} else if ( currentMeetingPlaces > allMeetingPlaces ) {
			// 会议名额超标
			this.set( "validationWarning", {
				open: true,
				title: "设定超标",
				detail: "您的会议名额设定已超过总名额限制，请合理分配"
			} )
			return false
		} else if ( freeResource.length ) {
			// 有代表未被分配
			let name = freeResource[0].name

			this.set( "validationWarning", {
				open: true,
				title: "有代表未被分配到医院",
				detail: `尚未对${name}分配工作，请为其分配。`
			} )
			return false
		} else if ( resourceWithLeftTime.length ) {
			// 代表时间有剩余
			window.console.log( aResources )
			window.console.log( resourceWithLeftTime )
			let name = resourceWithLeftTime[0].name

			this.set( "validationWarning", {
				open: true,
				title: "有剩余时间未分配",
				detail: `${name}还有剩余时间未被分配，请合理分配。`
			} )
			return false
		} else {
			return true
		}

		// else if ( hospitalWithoutMeetingPlaces.lenth > 0 ){
		// 	// 有医院 名额未被分配
		// 	this.set( "validationWarning", {
		// 		open: true,
		// 		title: "达标，但有医院名额有空状态，医院状态处于未分配。",
		// 		detail: `请为${hospitalWithoutMeetingPlaces[0]}设定会议名额，若不分配，请输入值“0”`
		// 	} )
		// } else if ( hospitalWithoutResource.length > 0 ) {
		// 	// 有医院没有分配代表
		// 	this.set( "validationWarning", {
		// 		open: true,
		// 		title: "有医院未分配代表",
		// 		detail: `尚未对${hospitalWithoutResource[0]}进行代表分配，请为其分配代表`
		// 	} )
		// } else if ( hospitalWithoutBudgetOrSales.length > 0 ) {
		// 	this.set( "validationWarning", {
		// 		open: true,
		// 		title: "有医院未分配资源",
		// 		detail: `尚未对${hospitalWithoutBudgetOrSales[0]}进行资源分配，请为其分配资源`
		// 	} )
		// }

	},
	callR() {
		let proposalId = this.model.project.get( "proposal.id" ),
			projectId = this.model.project.get( "id" ),
			periodId = this.model.period.get( "id" ),
			type = this.model.project.get( "proposal.case" ),
			phase = this.model.period.get( "phase" )

		this.get( "ajax" ).post( "/callR", {
			headers: {
				"dataType": "json",
				"Content-Type": "application/json",
				"Authorization": `Bearer ${this.cookies.read( "access_token" )}`
			},
			data: {
				callr: true,
				type: type + "r",
				phase: String( phase ),
				proposalId: proposalId,
				projectId: projectId,
				periodId: periodId
			}
		} ).then( res => {
			window.console.log( res )
			this.set( "calcJobId",res.id )
			window.console.log( "callR Success!" )
		} )
	},
	callE() {
		let proposalId = this.model.project.get( "proposal.id" ),
			projectId = this.model.project.get( "id" ),
			periodId = this.model.period.get( "id" ),
			type = this.model.project.get( "proposal.case" ),
			phase = this.model.period.get( "phase" )

		this.get( "ajax" ).post( "/callR", {
			headers: {
				"dataType": "json",
				"Content-Type": "application/json",
				"Authorization": `Bearer ${this.cookies.read( "access_token" )}`
			},
			data: {
				callr: false,
				type: type,
				phase: String( phase ),
				proposalId: proposalId,
				projectId: projectId,
				periodId: periodId
			}
		} ).then( res => {
			window.console.log( res )
			window.console.log( "callE Success!" )
			this.set( "firstCallEId",res.id )
		} )
	},
	validation( proposalCase ) {
		let	validationArr = this.getAllProductInfo()

		set( this, "allProductInfo", validationArr )
		if ( proposalCase === "ucb" ) {
			return this.ucbValidation()
		} else if ( proposalCase === "tm" ) {
			return this.tmValidation()
		}
	},
	actions: {
		publish() {
			this.client.Publish( "3-9kS0TxsJupymws2yKmXbI-x1OXu78p", "tm/", "Hello" )
		},
		toIndex() {
			this.transitionToRoute( "page.welcome" )
		},
		submit() {
			// 使用这部分代码
			let status = this.validation( this.model.project.proposal.get( "case" ) )

			if ( status ) {
				this.set( "calcDone", false )
				this.set( "loadingForSubmit", true )
				Ember.Logger.info( "save current input" )
				this.exam.saveCurrentInput( this.model.period, this.model.answers, () => {
					this.model.project.set( "lastUpdate", new Date().getTime() )
					this.model.project.save().then( () => {
						this.toast.success( "", "保存成功", {
							closeButton: false,
							positionClass: "toast-top-center",
							progressBar: false,
							timeOut: "2000"
						} )
						this.callR()
					} )
				} )
			}
			// 使用结束

			// let judgeAuth = this.judgeOauth(),
			// 	store = this.get( "store" ),
			// 	representatives = store.peekAll( "representative" ),
			// 	// 验证businessinputs
			// 	// 在page-scenario.business 获取之后进行的设置.

			// 	businessinputs = store.peekAll( "businessinput" )

			// if ( isEmpty( judgeAuth ) ) {
			// 	window.location = judgeAuth
			// 	return
			// }
			// this.verificationBusinessinputs( businessinputs, representatives )
		},
		confirmSubmit() {
			this.set( "warning", { open: false } )
			this.set( "loadingForSubmit", true )

			this.sendInput( 3 )
		},
		saveInputs() {
			Ember.Logger.info( "save current input" )
			this.exam.saveCurrentInput( this.model.period, this.model.answers, () => {
				this.model.project.set( "lastUpdate", new Date().getTime() )
				this.model.project.save().then( () => {
					this.toast.success( "", "保存成功", {
						closeButton: false,
						positionClass: "toast-top-center",
						progressBar: false,
						timeOut: "2000"
					} )
				} )
			} )
		},
		// testResult() {
		// 	this.toast.success( "", "保存成功", {
		// 		closeButton: false,
		// 		positionClass: "toast-top-center",
		// 		progressBar: false,
		// 		timeOut: "2000"
		// 	} )
		// 	// this.transitionToRoute('page-result');
		// },
		testReport() {
			this.transitionToRoute( "page.project.report" )
		},
		testResult() {
			this.transitionToRoute( "page.project.result" )
		}
	}
} )
