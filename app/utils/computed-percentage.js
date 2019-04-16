import { isEmpty } from '@ember/utils';

/**
 *
 * @param {*} numerator 分子
 * @param {*} denominator 分母
 * @param {*} tofixed 保留的小数点位数，默认为2
 * @return 计算后的数值
 */
export default function computedPercentage(numerator, denominator, tofixed = 2) {
	if (isEmpty(denominator) || isEmpty(numerator)) {
		return 100;
	}
	return (numerator * 100 / denominator).toFixed(tofixed);
}