import { helper } from "@ember/component/helper"

export function formatDateStandard( params/*, hash*/ ) {
	let date = new Date( params[0] ),
		Y = date.getFullYear() + "-",
		M = ( date.getMonth() + 1 < 10 ? `0${date.getMonth()}` : date.getMonth() + 1 ) + "-",
		D = ( date.getDate() < 10 ? `0${date.getDate()}` : date.getDate() ) + " ",
		h = ( date.getHours() < 10 ? `0${date.getHours()}` : date.getHours() ) + ":",
		m = ( date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes() ) + ":",
		s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()

	// 输出结果：yyyy-mm-dd hh:mm:ss
	return Y + M + D + h + m + s
}

export default helper( formatDateStandard )
