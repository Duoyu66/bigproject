<template>
	<!-- <div>111111111111</div> -->

	<div style="width: 100%;margin-top: 3px;">
		<iframe src="/luckysheet.html" frameborder="0" width="80%" height="100%" id="myframe" ref="myframe"
			@load="loaded"></iframe>
		<div v-show="testIsShow">
			test
		</div>
	</div>

	<!-- <div v-show="isMaskShow" style="position: absolute;z-index: 10000000000;left: 0px;top: 0px;bottom: 0px;right: 0px; background: rgba(255, 255, 255, 0.8); text-align: center;font-size: 40px;align-items:center;justify-content: center;display:flex;">Downloading</div>
    -->
	<!-- <div slot="footer" class="dialog-footer">

    </div> -->

</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: 'entrustAdd',
		model: {
			prop: 'isUpData',
			event: 'on-change'
		},
		props: {
			//.sync同步
			isUpData: {
				type: Boolean,
				default: false
				//required: true,
			},
			pageType: {
				type: Number,
				default: 0,
			},
			object_id: {
				type: String,
				default: '0',
			},
      object_name: {
      	type: String,
      	default: '',
      },
      id: {
      	type: String,
      	default: '',
      },
			entrustInfo: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		computed: {
			...mapGetters({
				org_pid: 'user/org_pid',
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				current_and_chrilren_org: 'org/current_and_chrilren_org',
				person_id: 'user/person_id',
        org_cache: 'org/org_cache',
			}),
		},
		data() {
			let that = this
			return {
				fp: '',
				formLabelWidth: '120px',
				rules: {},
				form: {
					date: ''
				},
				title: '',
				dialogFormVisible: false,
				testIsShow: false,
			}

		},

		created() {
			this.loaded()
		},
		methods: {
			changeTestIsShow() {
				this.$set(this, 'testIsShow', !this.testIsShow)
			},
			showEdit(row, person_info) {

				this.title = 'lucksheet测试'
				this.dialogFormVisible = true

			},
      // cancel() {
      //   this.$layer.close(this.layerid);
      // }
			loaded() {
				let that = this
				let index = setInterval(function() {
					if (that.$refs.myframe) {
						clearInterval(index)
            console.log(that.id)
						// 只有在 iframe 加载时传递数据给子组件，$refs 才是非空的
						that.$refs.myframe.contentWindow.postMessage({
							org_pid: that.org_pid,
							person_id: that.person_id,
							pageType: that.pageType,
							object_id: that.object_id,
							entrustInfo: that.entrustInfo,
              current_org_id: that.current_org_id,
              object_name: that.object_name,
              org_cache: that.org_cache
						}, '*');
					}
				})

			},
			close(status) {
				this.dialogFormVisible = false
			},
			save() {
				let that = this


			},
		},
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	h3 {
		margin: 40px 0 0;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	li {
		display: inline-block;
		margin: 0 10px;
	}

	a {
		color: #42b983;
	}

	.el-row {
		width: 100%;
	}

	.definition .el-table__row td {
		text-align: left;
	}

	.luckysheet-cols-menu {
		z-index: 10000004;
	}

	.luckysheet-input-box {
		z-index: 100000;
	}
</style>
