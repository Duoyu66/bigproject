<template>
	<div id="vue-admin-beautiful">
		<monthReportSheet></monthReportSheet>
	</div>
</template>

<script>
	import monthReportSheet from '/src/views/TestRoomManagement/TestReportStatistics/spreadjssheet/monthReportSheet.vue'
	export default {
		name: 'AppTestDataPrint',
		components: {
			monthReportSheet,

		},
		mounted() {},
	}
</script>
