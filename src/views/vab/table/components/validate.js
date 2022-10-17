export function validateName_re(rule, value, callback) {
	const reg = /0\d{2,3}-\d{7,8}/;
	if (value == '' || value == undefined || value == null) {
		callback();
	} else {
		if ((!reg.test(value)) && value != '') {
			callback(new Error('请输入正确的固定电话）'));
		} else {
			callback();
		}
	}
}
