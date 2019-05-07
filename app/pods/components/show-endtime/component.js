import Component from '@ember/component';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default Component.extend({
	tagName: 'span',
	localClassNames: 'end-time',
	endTime: computed('paper', function () {
		let paper = this.get('paper'),
			state = isEmpty(paper) ? 0 : paper.state,
			endTime = isEmpty(paper) ? 0 : paper.endTime;

		if (isEmpty(paper) || state === 0 || endTime === 0) {
			return '';
		} else if (state === 1 && endTime !== 0) {
			return `任务中断时间 ${this.formatDate(endTime)}`;
		}
		return `完成时间 ${this.formatDate(endTime)}`;
	}),
	addZero(number) {
		if (number < 10) {
			return `0${number}`;
		}
		return number;
	},
	formatDate(timastamp) {
		let date = new Date(timastamp),
			Y = date.getFullYear() + '-',
			M = this.addZero(date.getMonth() + 1) + '-',
			D = this.addZero(date.getDate()) + ' ',
			h = this.addZero(date.getHours()) + ':',
			m = this.addZero(date.getMinutes()) + ':',
			s = this.addZero(date.getSeconds());

		// 输出结果：yyyy-mm-dd hh:mm:ss
		return Y + M + D + h + m + s;
	}
}).reopenClass({
	positionalParams: ['paper']
});
