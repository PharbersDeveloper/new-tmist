import Service from '@ember/service';
import { A } from '@ember/array';

export default Service.extend({
    validataions: A([]),
    proposal: null,
    answers: A([]),
    oldValue: null,
    createValidatePattern(proposal, validataions) {
        this.validataions = validataions
        this.proposal = proposal
        // this.answers = answers
    },
    setValidateAnswers(answers) {
        answers.then(x => {
            this.set("answers", x)
        })
    },
    actions: {
        runValidate(answer, prop) {
            let check = true
            let msg = ""
            this.validataions.forEach(ele => {
                console.log(ele.condition)
                const tmp = ele.condition.split(",")
                const left = tmp[0]
                const opt = tmp[1]
                const right = tmp[2]

                debugger
                if (answer.get(left) === right && ele.get("leftValue") === prop) {
                    check &= answer.get(ele.get("leftValue")) > 0
                    if (!check) {
                        msg = ele.get("error")
                    }
                }

            });

            return { check: check, error: msg }
        },
        setOldValue(v) {
            this.set("oldValue", v)
        }
    }
});
