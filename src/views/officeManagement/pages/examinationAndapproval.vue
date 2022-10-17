<template>
	<div class="definition purchase equipment_btn calc">
		<postRegistration ref="postRegistration" nextStatus="审核" status="0">
		</postRegistration>
	</div>
</template>

<script>
	import postRegistration from '../pages/postRegistration'
	//postRegistrationHistoryTable
	export default {
		name: 'examinationAndapproval',
		components: {
			postRegistration
		},
		provide() {
			return {
				reload: this.reload,
			}
		},

		data() {
			return {
				activeName: 'finish',
				searchData: undefined,
				primary_key: -1,
				permission: {
					
	
					self: false,
				},
			}
		},
		computed: {

		},
		created() {
			this.init()
		},
		beforeDestroy() {},
		mounted: function() {},
		methods: {
			async init() {

			},
			clickTab(VueComponent, MouseEvent) {
				this.activeName = VueComponent.name
				this.$route.query.tabs = VueComponent.name
			},
			handleClick() {

			},
			reload() {},
			handlExport() {},
			search_main_fob(data) {
				//search
				this.$refs['postRegistrationTable'].search(data)
			},
		},
	}
</script>

<style>

</style>
