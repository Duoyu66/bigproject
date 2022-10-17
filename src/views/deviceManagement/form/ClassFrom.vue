<template>
  <span class="purchasefrom">
      <el-form ref="form" :model="form">
      	<el-form-item label="设备名称" :label-width="formLabelWidth">
        	<el-autocomplete
            :maxlength='16'
        	  class="inline-input"
        	  v-model="form.device_name"
        	  :fetch-suggestions="querySearchName"
        	  placeholder="请输入设备名称"
        	  @select="handleSelect"
            style="width: 100%;"
        	></el-autocomplete>
      	</el-form-item>
        <el-form-item label="设备规格" :label-width="formLabelWidth">
        	<el-autocomplete
            :maxlength='16'
        	  class="inline-input"
        	  v-model="form.device_span"
        	  :fetch-suggestions="querySearch"
        	  placeholder="请输入设备规格"
        	  @select="handleSelect"
            style="width: 100%;"
        	></el-autocomplete>
        </el-form-item>
        <el-form-item label="测量范围" :label-width="formLabelWidth">
        	<el-input v-model="form.range" :maxlength='100' style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="精度" :label-width="formLabelWidth">
        	<el-input v-model="form.accuracy" :maxlength='10' style="width: 100%;"></el-input>
        </el-form-item>
      	<el-form-item label="设备描述" :label-width="formLabelWidth">
      	  <el-input class="area" :maxlength="128" v-model="form.describable" style="width: 100%;" type="textarea"></el-input>
      	</el-form-item>
      </el-form>
    </span>
</template>

<script>
  import { ExecSql } from '@/api/table'
  import { search_fob, insert_fob } from '@/global/base.helper'
  export default {
    name: 'TableEdit',
    data() {
      return {
        dialogFormVisible: false,
        form: {
          name: '',
          name1: '',
          norms:'',
          range:'',
          accuracy:'',
          describable:'',
          device_span:'',
          device_name:'',
          device_id:''
        },


        restaurants: [],
        restaurantsname: [],
        formLabelWidth: '70px',
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {
     	if (this.father) {
     		this.form = Object.assign({}, this.father)
     	}
    },
    methods: {
      showEdit(row) {
        console.log(1)
        this.form = Object.assign({}, row)
      },
      save() {
				let that = this
				that.$refs['form'].validate(async (valid) => {
					if (valid) {
						let sData = '[Q]90{'+that.form.device_name+'$`'+that.form.device_span+'$`'+that.form.range+'$`'+that.form.accuracy+'$`'+that.form.describable+'}|^2|^SYS'
            console.log(sData)
            const res = await ExecSql(sData)
						if (res > 0) {
							that.$baseMessage('添加成功', 'success')
              that.$emit('close')
						} else {
							that.$baseMessage('添加失败', 'error')
						}
					} else {
						return false
					}
				})
      },
      editsave() {
      	let that = this
      	that.$refs['form'].validate(async (valid) => {
      		if (valid) {
      			let sData = '[Q]377{'+that.form.device_name+'$`'+that.form.device_span+'$`'+that.form.range+'$`'+that.form.accuracy+'$`'+that.form.describable+'$`'+that.form.device_id+'}|^1|^SYS'
            console.log(sData)
            const res = await ExecSql(sData)
      			if (res > 0) {
      				that.$baseMessage('修改成功', 'success')
      			} else {
      				that.$baseMessage('修改失败', 'error')
      			}
      		} else {
      			return false
      		}
      	})
      },
      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      querySearchName(queryString, cb) {
        var restaurantsname = this.restaurantsname;
        var results = queryString ? restaurantsname.filter(this.createFilter(queryString)) : restaurantsname;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilterName(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      loadAll() {
        return [
          { "value": "GX-11"},
          { "value": "GX-12"},
        ];
      },
      loadname() {
        return [
          { "value": "电子天平"},
          { "value": "监视和测量设备"},
        ];
      },
      handleSelect(item) {
        console.log(item);
      }
    },
    mounted() {
      this.restaurants = this.loadAll();
      this.restaurantsname = this.loadname();
    }
  }
</script>
