import Controller from "@ember/controller"
// import ENV from "new-tmist/config/environment"
// import { computed } from "@ember/object"
// import { isEmpty } from "@ember/utils"
import groupBy from "ember-group-by"
import { A } from "@ember/array"
import EmberObject, { computed, set } from "@ember/object"
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
	taskModal: false,
	taskModalCircle: computed( function() {
		let arr = Array( this.model.project.pharse )

		for ( let i = 0; i < arr.length; i++ ) {
			arr[i] = "第" + ( i + 1 ) + "周期"
		}
		return A( arr )
	} ),
	taskModalCircleLength:computed( function() {
		return this.model.project.pharse - 1
	} ),
	toastOpt: EmberObject.create( {
		closeButton: false,
		positionClass: "toast-top-center",
		progressBar: false,
		timeOut: "2000",
		preventDuplicates: false
	} ),
	client: computed( function () {
		return this.em.GetInstance()
	} ),
	currentTab: computed( function() {
		if ( this.model.period.phase === 0 ) {
			return 3
		} else {
			return 0
		}
	} ),
	loadingForSubmit: false,
	calcDone: false,
	allProductInfo: computed( function() {
		return this.getAllProductInfo()
	} ),
	businessAnswer: computed( function () {
		return this.model.answers.filter( x => x.get( "category" ) === "Business" )
	} ),
	answerHospital: groupBy( "businessAnswer", "target.id" ),
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
		window.console.info( "calcJobId" + " => " + this.calcJobId )

		let msgObj = msg.asObject()

		if ( !msgObj.header ) {
			console.log( "msg format error" )
			return
		} else {
			console.log( msgObj )
			if ( msgObj.payload.jobId === this.calcJobId ) {
				if ( msgObj.payload.Status === "ERROR" ) {
					window.console.log( msgObj.payload.Error )
					this.set( "loadingForSubmit", false )
					this.toast.error( "", "计算失败，请重试", this.toastOpt )
				} else if ( msgObj.payload.Status === "FINISH" ) {
					if ( this.model.period.phase + 1 === this.model.project.get( "proposal.totalPhase" ) ) {
						set( this.model, "project", this.store.findRecord( "model/project", this.model.project.id, { reload: true } ) )
						this.model.project.then( res => {
							res.set( "status", 1 )
							res.set( "endTime", new Date().getTime() )
							res.set( "lastUpdate", new Date().getTime() )
							res.set( "current",  res.periods.length )
							res.save().then( () => {
								this.set( "loadingForSubmit", false )
								this.transitionToRoute( "page.project.result" )
							} )
						} )
					} else {
						// this.model.project.then(res => {
						// 	res.set( "current",  res.periods.length )
						// })
						set( this.model, "project", this.store.findRecord( "model/project", this.model.project.id, { reload: true } ) )
						this.model.project.then( res => {
							// res.set( "status", 1 )
							// res.set( "endTime", new Date().getTime() )
							// res.set( "lastUpdate", new Date().getTime() )
							res.set( "current",  res.periods.length )
							res.save().then( () => {
								this.set( "loadingForSubmit", false )
								this.transitionToRoute( "page.project.result" )
							} )
						} )


						// this.set( "loadingForSubmit", false )
						// this.transitionToRoute( "page.project.result" )
					}
				}
			}
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
			allBudget = this.model.project.proposal.get( "quota.totalBudget" ),
			nullName = "",
			haveNullInput = 0
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
			// 有预算或销售额为空
			// set 0
			if ( answer.get( "salesTarget" ) === "" || answer.get( "budget" ) === "" ) {
				haveNullInput = 1
				nullName = answer.get( "target.name" )
				// this.set( "answer.salesTarget", 0 )
				// this.set( "answer.budget", 0 )

			}
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
		} else if ( haveNullInput === 1 ) {
			// 有预算或销售额有空值
			this.set( "validationWarning", {
				open: true,
				title: "设定有空值",
				detail: `${nullName}销售指标尚未完成分配，请完成指标分配。`
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
				type: type,
				phase: String( phase ),
				proposalId: proposalId,
				projectId: projectId,
				periodId: periodId
			}
		} ).then( res => {
			window.console.log( res )
			if ( res.Status === "ERROR" ) {
				window.console.log( "callR Failed!" )
				window.console.log( res.Error )
				this.set( "loadingForSubmit", false )
				this.toast.error( "", "计算失败，请重试", this.toastOpt )
			} else {
				this.set( "calcJobId",res.jobId )
				window.console.log( "callR Success!" )
			}
		} ).catch( err => {
			window.console.log( "callR Failed!" )
			window.console.log( err )
			this.set( "loadingForSubmit", false )
			this.toast.error( "", "计算失败，请重试", this.toastOpt )
		} )
	},
	// callE() {
	// 	let proposalId = this.model.project.get( "proposal.id" ),
	// 		projectId = this.model.project.get( "id" ),
	// 		periodId = this.model.period.get( "id" ),
	// 		type = this.model.project.get( "proposal.case" ),
	// 		phase = this.model.period.get( "phase" )

	// 	this.get( "ajax" ).post( "/callE", {
	// 		headers: {
	// 			"dataType": "json",
	// 			"Content-Type": "application/json",
	// 			"Authorization": `Bearer ${this.cookies.read( "access_token" )}`
	// 		},
	// 		data: {
	// 			callr: false,
	// 			type: type,
	// 			phase: String( phase ),
	// 			proposalId: proposalId,
	// 			projectId: projectId,
	// 			periodId: periodId
	// 		}
	// 	} ).then( res => {
	// 		window.console.log( res )
	// 		window.console.log( "callE Success!" )
	// 		this.set( "firstCallEId",res.id )
	// 	} ).catch( err => {
	// 		window.console.log( "callE Failed!" )
	// 		window.console.log( err )
	// 		this.set( "loadingForSubmit", false )
	// 		this.toast.error( "", "加载出错，请刷新页面", this.toastOpt )
	// 	} )
	// },
	setZeroSave() {
		this.model.answers.filter( x => x.get( "category" ) === "Business" ).forEach( answer => {
			// 有预算或销售额为空
			// set 0
			if ( answer.get( "salesTarget" ) === "" ) {
				answer.set( "salesTarget", 0 )
			}
			if ( answer.get( "budget" ) === "" ) {
				answer.set( "budget", 0 )
			}

		} )
		if ( this.model.project.get( "proposal.case" ) === "tm" ) {
			this.model.answers.filter( x => x.get( "category" ) === "Management" ).forEach( answer => {
				if ( answer.get( "strategAnalysisTime" ) === "" ) {
					answer.set( "strategAnalysisTime", 0 )
				}
				if ( answer.get( "clientManagementTime" ) === "" ) {
					answer.set( "clientManagementTime", 0 )
				}
				if ( answer.get( "adminWorkTime" ) === "" ) {
					answer.set( "adminWorkTime", 0 )
				}
				if ( answer.get( "kpiAnalysisTime" ) === "" ) {
					answer.set( "kpiAnalysisTime", 0 )
				}
				if ( answer.get( "kpiAnalysisTime" ) === "" ) {
					answer.set( "kpiAnalysisTime", 0 )
				}
			} )

			this.model.answers.filter( x => x.get( "category" ) === "Resource" ).forEach( answer => {
				if ( answer.get( "abilityCoach" ) === "" ) {
					answer.set( "abilityCoach", 0 )
				}
				if ( answer.get( "assistAccessTime" ) === "" ) {
					answer.set( "assistAccessTime", 0 )
				}
			} )
		}
	},
	validation( proposalCase ) {

		// when input is null, set 0
		this.setZeroSave()

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
		submitModal() {
			let status = this.validation( this.model.project.proposal.get( "case" ) ),
				detail = "提交执行本周期决策后，决策将保存不可更改，确定要提交吗？",
				flag = 0

			this.answerHospital.forEach( obj => {

				obj.items.forEach( x => {
					let sales = this.transNumber( x.get( "salesTarget" ) ),
						budget = this.transNumber( x.get( "budget" ) )

					if ( sales !== 0 || budget !== 0 ) {
						flag = 1
					}
				} )
				if ( flag === 0 ) {
					detail = "当前存在部分医院尚未分配资源，提交后不可再更改本周期决策，确定要提交吗？"
				}
				flag = 0
			} )

			if ( status ) {
				this.set( "submitConfirm", {
					open: true,
					title: "提交执行",
					detail: detail
				} )
			}
		},
		submit() {
			// 使用这部分代码

			this.set( "submitConfirm", {
				open: false
			} )

			let status = this.validation( this.model.project.proposal.get( "case" ) )

			if ( status ) {
				this.set( "calcDone", false )
				this.set( "loadingForSubmit", true )
				Ember.Logger.info( "save current input" )
				this.exam.saveCurrentInput( this.model.period, this.model.answers, () => {
					this.model.project.set( "lastUpdate", new Date().getTime() )
					this.model.project.save().then( () => {
						this.toast.success( "", "保存成功", this.toastOpt )
						this.callR()
					} ).catch( err => {
						window.console.log( err )
						this.set( "loadingForSubmit", false )
						this.toast.error( "", "保存失败，请重试", this.toastOpt )
						return
					} )
				}, err => {
					console.log( "fxxked up" )
					console.log( err )
					this.set( "loadingForSubmit", false )
					this.toast.error( "", "保存失败，请重试", this.toastOpt )
					return
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

			// when input is null, set 0
			this.setZeroSave()

			this.exam.saveCurrentInput( this.model.period, this.model.answers, () => {
				this.model.project.set( "lastUpdate", new Date().getTime() )
				this.model.project.save().then( () => {
					this.toast.success( "", "保存成功", this.toastOpt )
				} ).catch( err => {
					window.console.log( err )
					this.set( "loadingForSubmit", false )
					this.toast.error( "", "保存失败，请重试", this.toastOpt )
					return
				} )
			}, err => {
				window.console.log( "fxxked up" )
				window.console.log( err )
				this.set( "loadingForSubmit", false )
				this.toast.error( "", "保存失败，请重试", this.toastOpt )
				return
			} )
		},
		saveInputsWhenQuitModal() {
			this.set( "saveInputsWhenQuit", {
				open: true,
				title: "退出任务",
				detail: "您当前的决策将被保存，等您继续部署。您确定要结束任务吗？"
			} )
		},
		saveInputsWhenQuit() {

			this.set( "saveInputsWhenQuit", {
				open: false
			} )

			Ember.Logger.info( "save current input" )
			this.exam.saveCurrentInput( this.model.period, this.model.answers, () => {
				this.model.project.set( "lastUpdate", new Date().getTime() )
				this.model.project.save().then( () => {
					this.toast.success( "", "保存成功", this.toastOpt )

					setTimeout(	function() {
						if ( localStorage.getItem( "isUcb" ) === "1" ) {
							window.location = "/ucbprepare"
						} else {
							window.location = "/"
						}
					}, 3000 )

				} ).catch( err => {
					window.console.log( err )
					this.set( "loadingForSubmit", false )
					this.toast.error( "", "保存失败，请重试", this.toastOpt )
					return
				} )
			}, err => {
				window.console.log( "fxxked up" )
				window.console.log( err )
				this.set( "loadingForSubmit", false )
				this.toast.error( "", "保存失败，请重试", this.toastOpt )
				return
			} )

		},
		// sleep (time) {
		//		return new Promise((resolve) => setTimeout(resolve, time))
		// },
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
