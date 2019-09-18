import Service from "@ember/service"
import { computed } from "@ember/object"

export default Service.extend( {
	aid: "LTAIEoXgk4DOHDGi",
	asec: "x75sK6191dPGiu9wBMtKE6YcBBh8EI",
	ossClient: computed( function() {
		return new OSS( {
			region: "oss-cn-beijing",
			//云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
			accessKeyId: this.aid,
			accessKeySecret: this.asec,
			// stsToken: this.stsToken,
			bucket: "pharbers-sandbox"
		} )
	} )
} )
