<template>
	<div id="vue-admin-beautiful">
		<exportSpreadJs></exportSpreadJs>
	</div>
</template>

<script>
	import exportSpreadJs from '/src/components/export/exportSpreadJs'
	export default {
		name: 'AppSpreadJsExport',
		components: {
			exportSpreadJs,

		},
		mounted() {},
	}
</script>
