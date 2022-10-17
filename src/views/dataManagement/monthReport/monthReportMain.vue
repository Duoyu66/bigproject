<template>
	<div>
		<el-table :data="list" class="distribution_table" :header-cell-style="{ background: '#e8f0ff' }"
			highlight-current-row>
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column show-overflow-tooltip property="number" label="品种管理编号"></el-table-column>
			<el-table-column show-overflow-tooltip property="name" label="化学品名称"></el-table-column>
			<el-table-column show-overflow-tooltip property="type" label="化学品规格型号"></el-table-column>
			<el-table-column show-overflow-tooltip property="unit" label="计量单位"></el-table-column>
			<el-table-column show-overflow-tooltip property="boolean" label="是否分配"></el-table-column>
			<el-table-column show-overflow-tooltip label="操作">
				<el-button class="normal">分配</el-button>
				<el-button class="danger">取消</el-button>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
</script>

<style>
</style>
