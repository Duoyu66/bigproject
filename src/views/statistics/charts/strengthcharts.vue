<template>
	<!-- TODO: Monochrome color picker 서비스단으로 이동 -->
  <div style="width: 985px;height: 700px" :id="mychart">
  </div>
</template>

<script>
  import * as echarts from 'echarts';
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
    props: {
    	type: {
    		type: Number,
    		default: 0,
    	},
    },
		components: {

		},
		name: 'App',
    watch: {

      projectPrimaryId(newVal, oldVal){
      	this.fetchData()
      },

    },
		data() {
			return {
				theme: 'classic',
				darkMode: false,
				monochrome: undefined,
				layoutEditable: true,
				colNum: 12,
				datasets: [],
				rowHeight: 30,
        datestart: '2022-01-01',
        dateend: '2023-01-01',
        strength: [],
        mychart: 'mychart'+(((1+Math.random())*0x10000)|0).toString(16).substring(1)
			}
		},
		created() {
      // this.fetchData()
		},
    mounted(){
      // 在通过mounted调用即可
      this.fetchData()
    },
		computed: {
			...mapGetters({
				current_org: 'org/current_org',
        org_type: 'org/org_type',
        org_id: 'user/org_id',
        mixDeviceId: 'org/mixDeviceId',
        currentTab: 'org/currentTab',
        projectPrimaryId: 'projectInfo/primaryId',
        current_and_chrilren_org: 'org/current_and_chrilren_org',
        person_id: 'user/person_id',
			}),
		},
		methods: {
			async fetchData() {
        var option;
        switch (this.type) {
        	//总数
        	case 1:
        		await this.getData();
        		break;
        		//总盘
        	case 2:
        		await this.getDataProduct();
        		break;
            //总车
          case 3:
          	await this.getDataCar();
          	break;
        }

        this.initcharts()

				console.log(this.datasets)
			},
      initcharts() {
        let that=this
        console.log(that.mychart)
        this.$echarts.init(document.getElementById(that.mychart)).setOption({
          title: {
            text: '强度分布',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            show: false,
            orient: 'vertical',
            left: 'left'
          },
          series: [
            {
              name: '强度',
              type: 'pie',
              radius: '70%',
              data: this.strength,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        })
      },
      async getData() {
        let that=this
        let sData = ""
        console.log(that.org_type)
        switch (this.currentTab) {
        	case 'org':
        		sData = "[Q]1025{"+this.current_and_chrilren_org+"$`"+this.datestart+"$`"+this.dateend+"}|^SYS"
        		break;
        	case 'project':
        		sData = "[Q]1048{"+this.projectPrimaryId+"$`"+this.datestart+"$`"+this.dateend+"}|^SYS"
        		break;
        }

        let res = await QueryExec(sData)
        console.log(sData,res)
        this.strength = res.data
      },
      async getDataProduct() {
        let that=this
        let sData;

          sData = "[Q]1024{"+this.current_and_chrilren_org+"$`"+this.datestart+"$`"+this.dateend+"}|^SYS"

        let res = await QueryExec(sData)
        console.log(sData,res)
        this.strength = res.data
      },
      async getDataCar() {
        let that=this
        let sData;

          sData = "[Q]1026{"+this.current_and_chrilren_org+"$`"+this.datestart+"$`"+this.dateend+"}|^SYS"

        let res = await QueryExec(sData)
        console.log(sData,res)
        this.strength = res.data
      },
      async setDay(datestart,dateend) {
        this.datestart=datestart
        this.dateend=dateend
        await this.fetchData()
      },
			switchTheme(themeName) {
				this.theme = themeName;
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
