<template>
	<div id="app">
		<!-- TODO: Monochrome color picker 서비스단으로 이동 -->
    <div class="definition purchase contract equipment_btn calc">
      <el-tabs type="border-card" class="box_center" style="" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="总数" name="first">
          <el-row>

            <el-col :span="24" style="text-align: right;">
              <el-button-group>
                <el-button :type="buttontype==1?'primary':'default'" @click="setDay(1)" >当日</el-button>
                <el-button :type="buttontype==2?'primary':'default'" @click="setWeek(1)">当周</el-button>
                <el-button :type="buttontype==3?'primary':'default'" @click="setMonth(1)">当月</el-button>
                <el-button :type="buttontype==4?'primary':'default'" @click="setSeason(1)">当季</el-button>
                <el-button :type="buttontype==5?'primary':'default'" @click="setYear(1)">当年</el-button>
              </el-button-group>
            </el-col>
            <el-col :span="8">
              <strengthtable1 style="height: calc(75vh); min-height: 300px" ref="strengthtable1" :type="11"></strengthtable1>
            </el-col>
            <el-col :span="16">
              <strengthcharts1 ref="strengthcharts1" :type="1"></strengthcharts1>
            </el-col>
          </el-row>



    	  </el-tab-pane>
    	  <el-tab-pane label="总盘数" name="second">
          <el-row>
            <el-col :span="24" style="text-align: right;">
              <el-button-group>
                <el-button :type="buttontype==1?'primary':'default'" @click="setDay(2)">当日</el-button>
                <el-button :type="buttontype==2?'primary':'default'" @click="setWeek(2)" >当周</el-button>
                <el-button :type="buttontype==3?'primary':'default'" @click="setMonth(2)" >当月</el-button>
                <el-button :type="buttontype==4?'primary':'default'" @click="setSeason(2)" >当季</el-button>
                <el-button :type="buttontype==5?'primary':'default'" @click="setYear(2)" >当年</el-button>
              </el-button-group>
            </el-col>
            <el-col :span="8">
              <strengthtable2 style="height: calc(75vh); min-height: 300px" ref="strengthtable2" :type="12"></strengthtable2>
            </el-col>
            <el-col :span="16">
              <strengthcharts2 ref="strengthcharts2" :type="2"></strengthcharts2>
            </el-col>
          </el-row>
    	  </el-tab-pane>
        <el-tab-pane label="总车数" name="third">
          <el-row>
            <el-col :span="24" style="text-align: right;">
              <el-button-group>
                <el-button :type="buttontype==1?'primary':'default'" @click="setDay(3)">当日</el-button>
                <el-button :type="buttontype==2?'primary':'default'" @click="setWeek(3)">当周</el-button>
                <el-button :type="buttontype==3?'primary':'default'" @click="setMonth(3)">当月</el-button>
                <el-button :type="buttontype==4?'primary':'default'" @click="setSeason(3)">当季</el-button>
                <el-button :type="buttontype==5?'primary':'default'" @click="setYear(3)">当年</el-button>
              </el-button-group>
            </el-col>
            <el-col :span="8">
              <strengthtable3 style="height: calc(75vh); min-height: 300px" ref="strengthtable3" :type="13"></strengthtable3>
            </el-col>
            <el-col :span="16">
              <strengthcharts3 ref="strengthcharts3" :type="3"></strengthcharts3>
            </el-col>
          </el-row>
        </el-tab-pane>
    	</el-tabs>
    </div>
	</div>
</template>

<script>
  import strengthcharts1 from '../charts/strengthcharts.vue'
  import strengthtable1 from '../table/strengthtable.vue'
  import strengthcharts2 from '../charts/strengthcharts.vue'
  import strengthtable2 from '../table/strengthtable.vue'
  import strengthcharts3 from '../charts/strengthcharts.vue'
  import strengthtable3 from '../table/strengthtable.vue'
	import {
		doEdit,
		ExecSql,
		QueryExec
	} from '@/api/table'
	import {
		mapActions,
		mapGetters
	} from 'vuex'

	export default {
		components: {
			strengthtable1,
      strengthcharts1,
      strengthcharts2,
      strengthtable2,
      strengthcharts3,
      strengthtable3
		},
		name: 'App',
		data() {
			return {
				theme: 'classic',
				darkMode: false,
        activeName: 'first',
				monochrome: undefined,
				layoutEditable: true,
				colNum: 12,
				datasets: [],
				rowHeight: 30,
        buttontype: 5
			}
		},
		created() {
			// this.fetchData();
		},
    mounted(){
      // 在通过mounted调用即可
      this.fetchData()
    },
		computed: {
			...mapGetters({
				current_org: 'org/current_org',
        org_type: 'org/org_type',
        mixDeviceId: 'org/mixDeviceId'
			}),
		},
		methods: {
			async fetchData() {
        console.log(this.$refs['strengthtable1'])
        this.$refs['strengthtable1'].fetchData()
        this.$refs['strengthtable2'].fetchData()
        this.$refs['strengthtable3'].fetchData()

				console.log(this.datasets)
			},
      handleClick() {
        this.$refs['strengthcharts1'].fetchData()
        this.$refs['strengthcharts2'].fetchData()
        this.$refs['strengthcharts3'].fetchData()
      },
			switchTheme(themeName) {
				this.theme = themeName;
			},
      setDay(sNum) {
        this.buttontype=1
        let date = new Date()
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let datestart = '2022-06-30'
        let dateend = '2022-07-01'
        console.log(datestart,dateend)

        this.$refs['strengthcharts'+sNum.toString()].setDay(datestart,dateend)
        this.$refs['strengthtable'+sNum.toString()].setDay(datestart,dateend)
      },
      setWeek(sNum) {
        this.buttontype=2
      },
      setMonth(sNum) {
        this.buttontype=3
        let date = new Date()
        var m = date.getMonth() + 1;
        var m1 = date.getMonth() + 2;
        m = m < 10 ? '0' + m : m;
        m1 = m1 < 10 ? '0' + m1 : m1;
        let datestart = date.getFullYear()+'-'+m+'-01'
        let dateend = date.getFullYear()+'-'+m1+'-01'
        console.log(datestart,dateend)
        this.$refs['strengthcharts'+sNum.toString()].setDay(datestart,dateend)
        this.$refs['strengthtable'+sNum.toString()].setDay(datestart,dateend)
      },
      setSeason(sNum) {
        this.buttontype=4
      },
      setYear(sNum) {
        this.buttontype=5
        let datestart = new Date().getFullYear()+'-01-01'
        let dateend = (Number(new Date().getFullYear())+1).toString()+'-01-01'
        console.log(datestart,dateend)
        this.$refs['strengthcharts'+sNum.toString()].setDay(datestart,dateend)
        this.$refs['strengthtable'+sNum.toString()].setDay(datestart,dateend)
      },
			setMonochromeColor(event) {
				this.monochrome = {
					enabled: true,
					color: event.target.value,
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.theme-swatches {
		display: flex;
		justify-content: space-between;
		align-content: center;
		padding: 0;
	}

	.theme-swatches-item {
		background: #fff;
		border: 1px solid #e5e5e5;
		border-radius: 5px;
		text-align: center;
		transition: transform .2s cubic-bezier(.4, 0, .2, 1);

		&:hover {
			box-shadow: 0 2px 16px rgb(0 0 0 / 15%);
			transform: scale(1.05);
		}

		.theme-swatches-label {
			position: relative;
			display: block;
			width: 100%;
			height: 100%;
			padding: 10px 15px;
			cursor: pointer;
		}

		.theme-swatches-checkbox {
			display: none;
		}

		.theme-swatches-name {
			display: block;
			color: #232323;
			font-size: 14px;
		}

		.hue {
			display: inline-block;
			width: 20px;
			height: 20px;
			border-radius: 50%;
			box-shadow: 0 0 0 2px #fff;
			vertical-align: middle;

			// TODO: 테마별 색상으로 바인딩하기
			&.primary {
				background: #5975fe;
			}

			&.secondary {
				background: #54d2d2;
			}

			&.third {
				background: #ffcb00;
			}

			&.fourth {
				background: #ff6150;
			}

			&.fifth {
				background: #1360bf;
			}

			&+.hue {
				margin-left: -6px;
			}
		}
	}

	.editBtn {
		padding: 7px;
		border: 1px solid #fff;
		border-radius: 5px;
		background: #fff;
		cursor: pointer;
	}
</style>
