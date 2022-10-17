<template>
	<!-- TODO: Monochrome color picker 서비스단으로 이동 -->
  <div style="width: 1472px;height: 700px" :id="mychart">
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
		components: {

		},
    props: {
    	type: {
    		type: Number,
    		default: 0,
    	},
    },
		name: 'App',
		data() {
			return {
				theme: 'classic',
				darkMode: false,
				monochrome: undefined,
				layoutEditable: true,
				colNum: 12,
				datasets: [],
        orgdata: [],
        strength1: [],
        strength2: [],
        strength3: [],
        strength4: [],
        strength5: [],
        strength6: [],
        strength7: [],
				rowHeight: 30,
        datestart: '2022-01-01',
        dateend: '2023-01-01',
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
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				mixDeviceId: 'org/mixDeviceId',
				currentTab: 'org/currentTab',
				projectPrimaryId: 'projectInfo/primaryId',
				current_and_chrilren_org: 'org/current_and_chrilren_org',
				person_id: 'user/person_id',
			}),
		},
		methods: {
			async fetchData() {
        let that = this 
        var option;
        that.orgdata=[]
        that.strength1=[]
        that.strength2=[]
        that.strength3=[]
        that.strength4=[]
        that.strength5=[]
        that.strength6=[]
        that.strength7=[]
        switch (this.type) {
        	//总数
        	case 1:
        		await this.getStrengthData();
        		break;
        		//总盘
        	case 2:
        		await this.getStrengthCountData();
        		break;
            //总车
          case 3:
          	await this.getStrengthCarData();
          	break;
        }

        this.initcharts()

				console.log(this.datasets)
			},
      findlist(datalist,item) {
        for(let i=0;i<datalist.length;i++)
        {
          if(datalist[i]===item)
          {
            return i;
          }
        }
        console.log(datalist,item)
        return -1;
      },
      async getStrengthData() {
        let that = this
        let sData = "[Q]1036{"+this.current_and_chrilren_org+"$`"+this.datestart+"$`"+this.dateend+"}|^SYS"
        let res = await QueryExec(sData)
        res.data.forEach((item,index)=>{
          that.orgdata.push(item.org_name)
          that.strength1.push(item.C10)
          that.strength2.push(item.C15)
          that.strength3.push(item.C20)
          that.strength4.push(item.C25)
          that.strength5.push(item.C30)
          that.strength6.push(item.C35)
          that.strength7.push(item.C40)
        })
        console.log(sData,res)
      },
      async getStrengthCountData() {
        let that = this
        let sData = "[Q]1042{"+this.current_and_chrilren_org+"$`"+this.datestart+"$`"+this.dateend+"}|^SYS"
        let res = await QueryExec(sData)
        let data=res.data

        for(let i=0;i<data.length;i++)
        {
          if(that.findlist(that.orgdata,data[i].org_name)<0)
          {
            // console.log(datalist,item)
            that.orgdata.push(data[i].org_name)
            that.strength1.push(0)
            that.strength2.push(0)
            that.strength3.push(0)
            that.strength4.push(0)
            that.strength5.push(0)
            that.strength6.push(0)
            that.strength7.push(0)
            for(let j=0;j<data.length;j++)
            {
              if(data[j].org_name===that.orgdata[that.orgdata.length-1])
              {
                if(data[j].strength==='C10')
                {
                  that.strength1[that.orgdata.length-1]=data[j].total
                }
                else if(data[j].strength==='C15') {
                  that.strength2[that.orgdata.length-1]=data[j].total
                }
                else if(data[j].strength==='C20') {
                  that.strength3[that.orgdata.length-1]=data[j].total
                }
                else if(data[j].strength==='C25') {
                  that.strength4[that.orgdata.length-1]=data[j].total
                }
                else if(data[j].strength==='C30') {
                  that.strength5[that.orgdata.length-1]=data[j].total
                }
                else if(data[j].strength==='C35') {
                  that.strength6[that.orgdata.length-1]=data[j].total
                }
                else if(data[j].strength==='C40') {
                  that.strength7[that.orgdata.length-1]=data[j].total
                }
              }
            }
          }

        }
        console.log(sData,res)
      },
      async getStrengthCarData() {
        let that = this
        let sData = "[Q]1043{"+this.current_and_chrilren_org+"$`"+this.datestart+"$`"+this.dateend+"}|^SYS"
        let res = await QueryExec(sData)
        let data=res.data

        for(let i=0;i<data.length;i++)
        {
          if(that.findlist(that.orgdata,data[i].org_name)<0)
          {
            // console.log(datalist,item)
            that.orgdata.push(data[i].org_name)
            that.strength1.push(0)
            that.strength2.push(0)
            that.strength3.push(0)
            that.strength4.push(0)
            that.strength5.push(0)
            that.strength6.push(0)
            that.strength7.push(0)
            for(let j=0;j<data.length;j++)
            {
              if(data[j].org_name===that.orgdata[that.orgdata.length-1])
              {
                if(data[j].strength==='C10')
                {
                  that.strength1[that.orgdata.length-1]=data[j].total
                }
                else if(data[j].strength==='C15') {
                  that.strength2[that.orgdata.length-1]=data[j].total
                }
                else if(data[j].strength==='C20') {
                  that.strength3[that.orgdata.length-1]=data[j].total
                }
                else if(data[j].strength==='C25') {
                  that.strength4[that.orgdata.length-1]=data[j].total
                }
                else if(data[j].strength==='C30') {
                  that.strength5[that.orgdata.length-1]=data[j].total
                }
                else if(data[j].strength==='C35') {
                  that.strength6[that.orgdata.length-1]=data[j].total
                }
                else if(data[j].strength==='C40') {
                  that.strength7[that.orgdata.length-1]=data[j].total
                }
              }
            }
          }

        }
        console.log(sData,res)
      },
      initcharts() {
        let that = this
        this.$echarts.init(document.getElementById(that.mychart)).setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {},
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: that.orgdata
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: 'C10',
              type: 'bar',
              stack: 'Ad',
              emphasis: {
                focus: 'series'
              },
              data: that.strength1
            },
            {
              name: 'C15',
              type: 'bar',
              stack: 'Ad',
              emphasis: {
                focus: 'series'
              },
              data: that.strength2
            },
            {
              name: 'C20',
              type: 'bar',
              stack: 'Ad',
              emphasis: {
                focus: 'series'
              },
              data: that.strength3
            },
            {
              name: 'C25',
              type: 'bar',
              stack: 'Ad',
              emphasis: {
                focus: 'series'
              },
              data: that.strength4
            },
            {
              name: 'C30',
              type: 'bar',
              stack: 'Ad',
              emphasis: {
                focus: 'series'
              },
              data: that.strength5
            },
            {
              name: 'C35',
              type: 'bar',
              stack: 'Ad',
              emphasis: {
                focus: 'series'
              },
              data: that.strength6
            },
            {
              name: 'C40',
              type: 'bar',
              stack: 'Ad',
              emphasis: {
                focus: 'series'
              },
              data: that.strength7
            },

          ]
        })
      },
			switchTheme(themeName) {
				this.theme = themeName;
			},
      async setDay(datestart,dateend) {
        this.datestart=datestart
        this.dateend=dateend
        await this.fetchData()
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
