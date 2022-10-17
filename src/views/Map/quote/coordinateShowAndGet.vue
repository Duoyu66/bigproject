<template>
	<baiduMap ref="baiduMap" :value="value" :readonly="readonly" :formLabelWidth="formLabelWidth"></baiduMap>
</template>

<script>
	import baiduMap from '../../Map/Baidu/coordinateShowAndGet'
	export default {
		name: "coordinateShowAndGet",
		components: {
			baiduMap
		},
		props: {
			readonly: {
				type: Boolean,
				default: false
			},
			formLabelWidth: {
				type: String,
				default: '120px'
			},
			value: {
				type: Object,
				default: function() {
					return {};
				}
			}
		},
		computed: {

		},
		watch: {

		},
		data() {
			let that = this;
			return {

			};
		},
		created() {

		},
		methods: {
			GetMapRef() {
				return this.$refs['baiduMap']
			}
		}
	};
</script>
<style scoped lang="scss">

</style>
