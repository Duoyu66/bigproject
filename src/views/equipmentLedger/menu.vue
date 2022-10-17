<template>
	<div class="test-container">
		<span class="menuIcons" @click="linkPage">
		</span>
	</div>
</template>
<script>

	import {
		sql_helper
	} from '@/global/sql_helper'

	export default {
		name: 'Test',
		data() {
			return {
				show: true
			}
		},
		created() {},
		mounted() {},
		methods: {
			linkPage() {
				this.$router.push('/chemicalManagement/chemicalPreserve')
			},
		},
	}
</script>
<style lang="scss" scoped>
	.menuIcons {
		width: 960px;
		height: 140px;
		display: block;
		background: url(./../../assets/images/menu2.png)no-repeat;
		position: relative;
		top: 100px;
	}
</style>
