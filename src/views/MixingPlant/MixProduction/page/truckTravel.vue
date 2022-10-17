<template>
	<baiduMap ref="baiduMap" :value="value" :readonly="readonly" :formLabelWidth="formLabelWidth"></baiduMap>
</template>

<script>
	import baiduMap from '../../../Map/quote/truckTravel'
	export default {
		name: "truckTravel",
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
			},
			type: {
				type: Number,
				default: 0,
			},
			primary_key: {
				type: Number,
				default: 0,
			},
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
			},
			init() {
				switch (this.type) {
					case 10:
						this.carInit();
						break;
				}
			},
			async carInit() {
				let car_id = this.primary_key;
				let sqlcode = 1017;
				let list = [{
					field: 'car_id',
					type: 3,
					level: 1
				}];
				let {
					data
				} = await this.QueryExec_fob(sqlcode, list, {
					car_id: car_id
				});
				if (!data || data.length == 0) {
					return;
				}
				let item = data[0];
				if (!item) {
					return;
				}
				let truck_id = item.truck_id;
				let task_id = item.task_id;
				let endTime = item.end_time;
				let startTime = item.start_time;
				let form = {
					registration_number: truck_id,
					task_id: task_id,
					end_time: endTime,

				}
			}
		}
	};
</script>
<style scoped lang="scss">

</style>
