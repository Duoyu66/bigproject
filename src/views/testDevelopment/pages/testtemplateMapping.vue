<template>
	<div class="table-container definition purchase equipment">
		<el-row :gutter="20">
		  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
		    <el-divider content-position="left">小组件</el-divider>
		  </el-col>
		  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
		    <el-card shadow="hover">
		      <div slot="header">
		        <span>snow</span>
		      </div>
          <div id="myChart" :style="{width: '300px', height: '300px'}"></div>
		    </el-card>
		  </el-col>
		</el-row>
	</div>
</template>

<script>
	import {
		getList,
		doDelete
	} from '@/api/table'
	import {
		getReport
	} from '@/api/table'
	export default {
		name: 'ComprehensiveTable',
		components: {

		},

		filters: {
			statusFilter(status) {
				const statusMap = {
					published: 'success',
					draft: 'gray',
					deleted: 'danger',
				}
				return statusMap[status]
			},
		},
		data() {
			return {

			}
		},
		computed: {
			height() {
				return this.$baseExcelHeight()
			},
		},
		created() {

		},
		beforeDestroy() {},
		mounted: function() {
      this.drawLine();
		},
		methods: {
      drawLine(){

      }
		},
	}
</script>
