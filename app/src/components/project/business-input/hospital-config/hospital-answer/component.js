import Component from '@ember/component';
import { computed } from "@ember/object"

export default Component.extend( {
	positionalParams: ["hospital", "exam"],
	currentAnswer: computed( "hospital", "exam.bs.operationAnswers", function() { 
        const answers = this.exam.bs.operationAnswers
        if (answers) {
            const tmp = answers.find( item => {
                return item.get( "target.id" ) === this.get( "hospital.id" ) 
            })
            console.log(`current answer ${tmp}`)
            return tmp
        } else {
            return null
        }
	} )
} )
