import { helper } from "@ember/component/helper"

export function timeDifference( params/*, hash*/ ) {
	let timeMinusMs = new Date( params[1] ).getTime() - new Date( params[0] ).getTime(),
		secondTime = parseInt( timeMinusMs / 1000, 10 ),// 秒
		minuteTime = 0,// 分
		hourTime = 0,// 小时
		result = ""

	if ( secondTime < 0 ) {
		return "用时计算错误"
	}
	if ( secondTime > 60 ) {//如果秒数大于60，将秒数转换成整数
		//获取分钟，除以60取整数，得到整数分钟
		minuteTime = parseInt( secondTime / 60, 10 )
		//获取秒数，秒数取佘，得到整数秒数
		secondTime = parseInt( secondTime % 60, 10 )
		//如果分钟大于60，将分钟转换成小时
		if ( minuteTime > 60 ) {
			//获取小时，获取分钟除以60，得到整数小时
			hourTime = parseInt( minuteTime / 60, 10 )
			//获取小时后取佘的分，获取分钟除以60取佘的分
			minuteTime = parseInt( minuteTime % 60, 10 )
		}
	}
	result = String( parseInt( secondTime, 10 ) ) + "秒"

	if ( minuteTime > 0 ) {
		result = String( parseInt( minuteTime, 10 ) ) + "分" + result
	}
	if ( hourTime > 0 ) {
		result = String( parseInt( hourTime, 10 ) ) + "小时" + result
	}
	return result
}


export default helper( timeDifference )
