<template>
	<el-dialog width="70%" :title="title" :visible.sync="dialogFormVisible" v-loading="loading"
		:element-loading-text="loadingText" center top="5vh">
		<el-row>
			<el-col :span="16" style="height:calc(70vh)">
				<iframe src="/ReportSealApprove.html" frameborder="0" width="100%" height="100%" id="myframe" ref="myframe"
					@load="loaded"></iframe>
			</el-col>
			<el-col :span="8">
        <el-row>
          <el-col :span="24">
            <div style="max-height: calc(50vh); overflow-y: auto">
            	<sealApplyForm ref="sealApplyForm" :formData.sync="form" :type="3">
            	</sealApplyForm>
            </div>
          </el-col>
          <el-col :span="24">
            <div style="max-height: calc(50vh - 220px); overflow-y: auto">
            	<examineForm ref="examineForm" :formData.sync="examineForm" :type="2"></examineForm>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="buttondiv">
              <el-button type="primary" @click="save">
              	确 定
              </el-button>
              <el-button @click="close">
              	取 消
              </el-button>
            </div>
            
          </el-col>
        </el-row>

			</el-col>
		</el-row>
<!-- 		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save">
				确 定
			</el-button>
			<el-button @click="close">
				取 消
			</el-button>
		</div> -->
	</el-dialog>
</template>

<script>
	import sealApplyForm from '../form/sealApplyForm'
	import examineForm from '../form/examineForm'
  import testDataPrint from '../../testProcess/luckysheet/testDataPrint'
	import {
		docRegisterProcess,
		GetProcessData
	} from '../js/common'
	import {
		GetGroupData,
		GetGroupDataEx,
		GetGroupDataCustomEx
	} from '@/utils/htmlDataGroup'
  import {
  	mapGetters
  } from 'vuex'
	export default {
		name: 'sealApplyExamineDialog',
		components: {
			sealApplyForm,
			examineForm
		},
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
    	entrustInfo: {
    		type: Object,
    		default: function() {
    			return {}
    		}
    	},
      isUpData: {
      	type: Boolean,
      	default: false
      	//required: true,
      },
    },
		data() {
			return {
				loading: false,
				loadingText: '',
				title: '',
				dialogFormVisible: false,
				form: {},
				selectData: {
					source: []
				},
				examineForm: {

				},
        iframe: {
        	approval: {
        		id: ''
        	},
          review: {
          	id: ''
          }
        },
				process: {
					outgoingOrg: {
						label: '发文',
						isrequired: false,
					},
					sign: {
						isrequired: false,
						label: '签收'
					},
					register: {
						label: '登记'
					},
					examine: {
						label: '审核'
					},
					end: {
						label: '完成'
					}
				},
			}
		},
    computed: {
    	...mapGetters({
    		org_pid: 'user/org_pid',
    		org_id: 'user/org_id',
    		current_org_id: 'org/current_org',
    		current_and_chrilren_org: 'org/current_and_chrilren_org',
    		person_id: 'user/person_id',
    	}),
    },
		created() {},
		methods: {
			async showEdit(row) {
				this.examineForm = {}
				this.form = {}
				if (!row) {
					return
				} else {
					this.title = '审核用印申请'
					this.form = Object.assign(this.form, row)
          this.data = this.form
					this.examineForm = {
						apply_id: row.apply_id
					}
				}
				await this.GetGroup()
				this.dialogFormVisible = true
			},
			async GetGroup() {
        this.loaded()
			},
      changeTestIsShow() {
      	this.$set(this, 'testIsShow', !this.testIsShow)
      },
      loaded() {
      	let that = this
      	let index = setInterval(function() {
      		if (that.$refs.myframe) {
            console.log(that.$refs.myframe)
      			clearInterval(index)
      			// 只有在 iframe 加载时传递数据给子组件，$refs 才是非空的
      			that.$refs.myframe.contentWindow.postMessage({
      				org_pid: that.org_pid,
      				person_id: that.person_id,
      				pageType: that.pageType,
      				data: that.data,
      				object_id: that.object_id,
              current_org_id: that.current_org_id,
              object_name: that.object_name
      			}, '*');
      		}
      	})

      },
			close() {
				this.$refs['sealApplyForm'].close()
				this.$refs['examineForm'].close()
				this.$emit('update:isUpData', !this.isUpData);
				this.$emit('on-change', !this.isUpData);
				this.dialogFormVisible = false
				//this.$emit('fetch-data')
			},
			async QueryExec_fob_custom(list, form, sqlcode) {
				return await this.QueryExec_fob(sqlcode, list, form)
			},
			async save() {
				let that = this
				that.$refs['examineForm'].save(async function(form) {
					if (!form) {
						return
					}
					//this.loading = true
					that.loadingText = '提交表单中'
					let formdata = JSON.parse(JSON.stringify(form))
					let list = [{
							field: 'approver_id',
							type: 3,
							level: 1,
						},
						{
							field: 'approve',
							type: 3,
							level: 2,
						},
						{
							field: 'reason',
							type: 3,
							level: 3,
						},
						{
							field: 'apply_id',
							type: 3,
							level: 4,
						},
					]
					console.log(that)
					let formTemp = JSON.parse(JSON.stringify(that.form))
					let fob = ''
					let sqlcode = 362
					let msg = '提交'
					const {
						code,
						influence,
						data
					} = await that.QueryExec_fob_custom(list, formdata, sqlcode)
					if (!data || data.length == 0) {
						that.$baseMessage(msg + '失败', 'error')
						return
					}
					let json = JSON.parse(data[0].info)
					if (json.code > 0) {
						switch (json.code) {
							case 1:
								that.$baseMessage(json.msg, 'success')
								that.close()
								return true
								break
							case 2:
								that.$baseMessage(json.msg, 'error')
								break
							default:
								that.$baseMessage(json.msg, 'error')
								break
						}
						return false
					} else {
						that.$baseMessage(json.msg, 'error')
						return false
					}
				})

			},
		},
	}
</script>

<style>
  .buttondiv button {
    width: 150px;
    margin-left: calc(33% - 100px);
  }
</style>
