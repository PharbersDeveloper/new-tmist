import { isEmpty } from "@ember/utils"
//TODO 可以尝试直接从 node_modules/bp-components/addon/uitls/chartFormat.js 倒入这两个方法
/**
 * @author Frank Wang
 * @method
 * @name formatPhase
 * @description 对后端传入的phase进行格式化
 * @param OriginBasePhase{String} string/timestamp
 * @param step{string} 间隔时间（以 'M'/'Y'结尾）
 * @param phase{number} 要format的周期,number 类型（-1，1...这种）
 * @return {Array}
 * @example 创建例子。
 * @public
 */
export function formatPhaseToDate( OriginBasePhase, step, phase ) {
	if ( isEmpty( OriginBasePhase ) ) {
		return OriginBasePhase
	}
	let basePhase = new Date( OriginBasePhase ),
		year = basePhase.getFullYear(),
		month = basePhase.getMonth(),
		date = basePhase.getDate(),
		newYear = year,
		newMonth = month,
		newDate = date,
		unit = step.slice( -1 ),
		stepNum = parseInt( step, 10 )

	if ( ["y", "Y"].includes( unit ) ) {
		newYear = year + stepNum * phase
		basePhase.setFullYear( newYear )
	} else if ( ["m", "M"].includes( unit ) ) {
		newMonth = month + stepNum * phase
		basePhase.setMonth( newMonth )
	} else if ( ["w", "W"].includes( unit ) ) {
		newDate = date + stepNum * 7 * phase
		basePhase.setFullYear( newYear )
	} else if ( ["d", "D"].includes( unit ) ) {
		newDate = date + stepNum * phase
		basePhase.setDate( newDate )
	}

	return basePhase
}
/**
 * @author Frank Wang
 * @method
 * @name formatPhaseToString
 * @description 将phase转为string
 * @param date{Date}
 * @return {}
 * @example 创建例子。
 * @private
 */
export function formatPhaseToStringDefault( date ) {
	let	year = date.getFullYear(),
		month = date.getMonth(),
		season = ""

	switch ( true ) {
	case month < 3:
		season = "Q1"
		break
	case month < 6:
		season = "Q2"
		break
	case month < 9:
		season = "Q3"
		break
	default:
		season = "Q4"
		break
	}
	return `${year}${season}`
}