import Service from "@ember/service"

export default Service.extend( {
	projectType: 0, //0.未知 1.apm 2.tmist 3.ucb
	jobId: "",
	proposalId: "",
	projectId: "",
	cancelRepresentNotice: true,
	roundHistory: false,
	setRoundHistoryFalse() {
		this.set( "roundHistory", false )
	},
	setRoundHistoryTrue() {
		this.set( "roundHistory", true )
	},
	setNoticeToggle() {
		this.toggleProperty( "cancelRepresentNotice" )
	}
} )