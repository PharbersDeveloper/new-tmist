import { helper } from '@ember/component/helper';
import { isEmpty } from '@ember/utils';
export function typeNumber(params/*, hash*/) {
	if (isEmpty(params)) {
		return '';
	}
	return typeof params[0] === 'number';
}

export default helper(typeNumber);
