<template>
	<span class="purchasefrom">
    <el-form ref="groupform" :model="groupform" :rules="rules" :label-width="formLabelWidth" v-loading="formloading">
      <el-form-item label="数据项名称" prop="item_name" :label-width="formLabelWidth">
        <el-input v-model="groupform.item_name" style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="字典分组" prop="item_class" :label-width="formLabelWidth" >
        <el-select v-model="groupform.item_class" style="width: 100%" filterable placeholder="请选择字典分组" @change="maxid_change">
          <el-option
            v-for="item in item_options"
            :key="item.item_id"
            :label="item.item_name"
            :value="item.item_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字典id" prop="item_id" :label-width="formLabelWidth">
        <el-input v-model="groupform.item_id" style="width: 100%;" disabled></el-input>
      </el-form-item>
    </el-form>
    </span>
</template>
<script>
	import {
		doEdit,
    ExecSql,
    QueryExec
	} from '@/api/table'
  import {
  	mapActions,
  	mapGetters
  } from 'vuex'
  import {
  	ViewfileUrl,
  	UploadFileNameUrl
  } from '@/utils/servicefile'
  import {
  	TreeDataDeal,
    TreeDataDealEx
  } from '@/global/tree_deal'
	export default {
		name: 'TableEdit',
		props: { //props列表
			father: {
				type: Object,
				required: false
			}
		},
		data() {
			return {
				groupform: {
					item_name: '',
          item_id: '',
          item_class: '',
          item_desc: '',
				},
        formloading: true,
        item_options: [],
				formLabelWidth: '85px',
				title: '',
        rules: {
          item_class: [{ required: true, trigger: 'change', message: '请选择数据分组' }],
          item_id: [{  }],
          item_name: [{  }],
        }
			}
		},
		created() {
			if (this.father) {
				this.groupform = Object.assign({}, this.father)
			}
      this.fetchData()
		},
		methods: {
      display(row) {
        this.formloading = true
        this.groupform = row
        this.groupform.item_class = row.group_id
        setTimeout(() => {
          this.formloading = false
        }, 500)
      },
      async maxid_change(row) {
        this.formloading = true
        let sData;
        sData = '[Q]281{'+this.groupform.item_class+'}|^SYS'
        const res = await QueryExec(sData)

        if(res.data.length>0)
        {
          this.groupform.item_id=(Number(res.data[0].maxid)+1).toString()
        }
        // else if(this.groupform.item_class === '0')
        // {

        //   this.groupform.item_id = '1000'
        //   console.log(this.groupform.item_id)
        // }
        else{
          this.groupform.item_id=(Number(this.groupform.item_class)*1000).toString()
        }
        setTimeout(() => {
          this.formloading = false
        }, 500)
      },
      async fetchData() {
        this.formloading = true
        try {
          let sData;
          sData = '[Q]274{}|^SYS'
          const res = await QueryExec(sData)
          const data = res.data
          this.item_options=res.data
          this.item_options.push({"item_id":"0","item_name":"分组根节点"})
        } catch (e) {
          console.log(e)
        }
        setTimeout(() => {
          this.formloading = false
        }, 500)
      },
      save() {
        let that = this
        console.log(that.groupform)
        this.$refs['groupform'].validate(async (valid) => {
          if (valid) {
            let sData = '[Q]280{'+that.groupform.item_id+'$`'+that.groupform.item_class+'$`'+that.groupform.item_name+'}|^1|^SYS'
            console.log(sData)
            const res = await ExecSql(sData)
            if(res>0)
            {
              that.$baseMessage('字典添加成功', 'success')

              that.$refs['groupform'].resetFields()
              that.$emit('close_comp')
            }
            else
            {
              that.$baseMessage('字典添加失败', 'error')
            }
          } else {
            return false
          }
        })
      },
      editsave() {
        let that = this
        console.log(that.groupform)
        this.$refs['groupform'].validate(async (valid) => {
          if (valid) {
            let sData = '[Q]760{'+that.groupform.item_name+'$`'+that.groupform.item_id+'}|^1|^SYS'
            console.log(sData)
            const res = await ExecSql(sData)
            if(res>0)
            {
              that.$baseMessage('字典修改成功', 'success')

              that.$refs['groupform'].resetFields()
              that.$emit('close_comp')
            }
            else
            {
              that.$baseMessage('字典修改失败', 'error')
            }
          } else {
            return false
          }
        })
      }
		},
	}
</script>
