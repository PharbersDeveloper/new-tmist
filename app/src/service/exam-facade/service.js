import Service from "@ember/service"
import { inject as service } from "@ember/service"

export default Service.extend( {
	bs: service( "service/exam-facade/business-strategy" ),
	currentProject: null,
	currentPeriod: null,
	startPeriodBusinessExam( aProject, aPeriod ) {
		this.currentPeriod = aProject
		this.currentPeriod = aPeriod
		this.bs.startPeriodBusinessExam( aProject, aPeriod )
	}
} )
