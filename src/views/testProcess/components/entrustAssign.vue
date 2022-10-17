<template>
  <div id='printDivMain'>
    <el-button type='info' @click="testprint">打印</el-button>
    <el-button type='info' @click="testdisplay">展示</el-button>
    <el-button type='info' @click="testprint1">打印</el-button>
    <el-button type='info' v-print="'#mytable0'" >vue打印</el-button>
    <el-button type='info' @click="testprint2">画图</el-button>
    <div v-html="template" class="rich" id="printDiv"
    	style="margin-left: auto;margin-right: auto;text-align: center;width: 80%;">
    </div>
  </div>
</template>

<script>

import {
  	TestDataHandleForTest,
    Report,
    ParameterAll
  } from '@/utils/dataCache'
  import {
  	mapGetters
  } from 'vuex'
export default {
  name: 'entrustAssign',
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
  data(){
    return {
      form: {
        title: '',
      },
      selected:"",
      isMaskShow: false,
      title: '',
      dialogFormVisible: false,
      template: '',
      value: '',
      input1: '20',
      input2: '0',
      input3: '20',
      textarea2: '',
      innerVisible: false,

    }

  },
  mounted() {
    // In some cases, you need to use $nextTick

  },
  methods:{
    async testprint() {
      let that = this
      console.log(that.entrustInfo)
      const data = await TestDataHandleForTest(that.entrustInfo.object_id.toString(), that.entrustInfo.data_id.toString(), '0', that.current_org_id)
      console.log(data)

      let str = that.unzip(data.template_json)
      console.log(str)
      console.log(that.$refs.printDiv)
      that.template=str


      // var parser = new DOMParser();
      // var doc = parser.parseFromString(str, "text/xml");
      // var divid = document.getElementById("printDiv");
      // console.log(divid);
      // divid.appendChild(doc)

    },
    testdisplay() {
      var divid = document.getElementById("printDiv");

      console.log(divid)
      console.log(divid.getElementsByTagName("td"))
      let tdList = divid.getElementsByTagName("td")
      console.log(divid.getElementsByTagName("table"))
      let tableHtml=divid.getElementsByTagName("table")
      for(let i=0;i<tableHtml.length;i++)
      {
        tableHtml[i].style.borderCollapse = "collapse"
        tableHtml[i].style.fontSize="9pt"
        tableHtml[i].style.width = '605px';
        tableHtml[i].setAttribute('id','mytable'+i.toString());
      }
      tdList[0].innerText=''
      var divchild=document.createElement('canvas');
      divchild.setAttribute('id','myframe1');
      divchild.setAttribute('width',(Number(tdList[0].offsetWidth)).toString());
      divchild.setAttribute('height',(Number(tdList[0].offsetHeight)).toString());
      tdList[0].appendChild(divchild);

      // console.log(Array.from(tdList))
      for(let i=0;i<tdList.length;i++)
      {
        tdList[i].style.height = (Number(tdList[i].offsetHeight)*1.15).toString()+'px'
        if(tdList[i].style.alignItems==='center')
        {
          tdList[i].style.verticalAlign='middle'
        }
        else if(tdList[i].style.alignItems==='flex-end')
        {
          tdList[i].style.verticalAlign='bottom'
        }
      }
    },
    testprint1() {
      var print= document.getElementById("printDiv").getElementsByTagName("sheet")[0].innerHTML;

      var newWindow = window.open();
      newWindow.document.write(print);
      newWindow.print();
    },
    testprint2() {
      let handwriting = 'eJxFl1muJDsIRDdUHzZgBnn/ 3onnLf1dKVuKtMDBEFAeu0Vk5Hx29vH6uq/nmvlFbPr5vj2zn23r225T19bVdsz1vWFnfx7Y WY5ex7bO2T6fumTza/5tax2TEWtw/vYu99J077jhV3c/C4r3bMk2ziCWbVeJ2tBb2W 0mZefx4rMG0c1aF2c/C3Tgsr 1cie/y0mNO bl7zjbjeixfEW2y1mTt9Gd15bP2WrUFwpTvM0RDfL3P4hSiyyGQuHZ257FeoDTbfK38RcfZu2fdZ9mO Gdxyv/WWSfGJwyczNpi9 XJOQVU97SengJ2UC 8OTf7zPJVdiuyjPTUDz 7PXHiTk20V/klUZae4NVpIMavW5Xb4nBdFrg2Dl uGtadvMFxODB5OaAhwiLMyRVFgq/5MVwjzD2Tu2sEJfF2bEJfZ3azBThiR3VyCqbjI6Hvc0he5yV/m4SduElya4ok5kSEW2 Ioawt4tAB3ZuTaxb52GM/3hEcAV5r/IiT NdKfx7866qzos91CEJAXdc5eEEGnjWYR2VdbjrLtpGa4vWQcNIgRvGYNKSyP d3MMxTb58FgviMrwn8F6wJOGrJ 0N5kGCOa7jgWFPGL/byAKCctM6Cmoub74hAYSRzWtyefqQn62OqrBXrkGHSDkSHnIw/pntC0v5IX7sotc kWl4psBZETSZJmZhRBe0DBodt007iDnVKDJZLPKU2cm0ChlfyQ05RubxvQiuq34Hq3HIzsd0vqVDsocRQ26utLzmQz3CS7CxqDJIMBYhHMZc7l5JOuNOnCdP whW/f93H05WZrmh43GLsgvjJMU3ODqrh75KnBZcyoR6A6PYmECes24vDUY3EwocMKkDWppL7WZKj dUpmGiqhc8i4KJOYznqhhRAG4RINROmLChvnniDFQbeTS1MQVPKdCuDqA1FQ3AWUBIQBn2kTF/oqJIbvBoOYz2VR8rhEtARkchEGvCP1Nu0eF LNCOXRQqz5wFdB14JDXdpERzilABC52ROA2tBziVUN0BDIfSN1IohnVCyiRiZxTEp/G9TBIUqbJ7 mSpnqgZmoXtXIk/2CuAR5SNmgzL g5A/EaaOin00AMyQJhHmM8kClc5aajif4gYQQGLJeMgDcNYJm6ui810xDc/M5dnLR8odvAIi1QQ6BFqhi21gHWldn0lpen0LjrjONv6wqH/om5v62DKB2GkbrtjCYWopoKU6DVUV/obcURQEgY/UL3luRfzMJklOP7m0AOCgWnmKRCM8IVKjfLCCNoYJA8kPxUGLhCTK9N2SMWk7C9QxKG35QE3bxGs lHXTNdWRCjkmiJaJhuLkBhKKTg83T2EAyZ7DCS2t/zMDslO9rCUUeuZRLvhNQE9oWpgBpXRc0s6NISE/6hbPNHUDP p75OIoYf9MvPhbsCbqOyEpi9IVSicqgSmFHa6T60krW9pWQLdUOEQ8EAvesQCCSA 3zPQ47vKXnGMvJVZPncp3rW21OhNmwx HpDCjYEFT6DgpmRDlBF9LAzEPHZ1D5IO2UDWcW5xDlrYWqA0xaTxQSQxpboFKPnGYi5EtuipwY9L/KV7lbZg4bH2DhNKKAMkMjSRA/WP4AEgTzz4T mEa6qQxSKYpdqoX88A0jUNXfCLQRmylCYoZsWARQAp2TEYsXlDS5lAHuVcHpvJYryKjVW VZOZnMmKRrGdKX7QgdJK3TFojQbjW0k23cqTbEAXifj4gIBR3yDOgdggkf9WQSKKiqJc2DUUbVi9mDZnMgDSQ95RRApJoGzVMw5S/CtMU0YsN/JbJSc2Uq2GfoTtkU3OGlJUQwAoTeRg4q8FrJV24NabgwFGPZhubUHtJKC/hAgJDbKkQeMXFiJJGSSWgaFFwWTjAQ7i5ybEJaPATfFoIUal55hN0EK3U CF8GB5T8wf Etoz8ZwG0J/pcukzD7j/PYW0ulgm/bT/tpWOeYeB9buYK9AfeI6JmjO9atTWiAM5qTdN5IZuiVE0Ntj UKdaXmytiGmjgWJjkkrNzwp jS2I7zLPUuPTCTAApRC5nrkeqAC5 hsDczMIa0SQeSRNK965zPtz3m2iRAVI8v1AY22N30CtZryek SSjqQxWeSm3IRvaAAGb8WmcOKhA NHI XPJExI6eIK6Y4u4QrOh2USBQ0/0GuryCA/lCaJMtmF0GqCpYMA tt2JNyPcrRROpIihhgoF5PHYFLx1CFIqve8PDvzZCAySKxMdSR9Id03ETFQ0Yc06DLx4RwmE3aFBhHXhIj7UNkZJhAxSK5tR 4wAdPHKVzaon0mGsEnAQsYvplA651gGj37ulqXvq54qj6XmjowB0VDCTkXpmsmociYh8VmzZIeKs2jiR TS1UG39PSAK21S iWFkAmJG9rbiZH76MHc2va4iMBU/WGEmrbEiYqhs9kdqvPZCB8F8sMjS//zLY/kwzmc51WRFvClFCHCpJWzszDAXqKTI7KTyYEVjOTSWuiPexvG/MY7MNfdVA fBQQDr4vEQZGkurqQ0CgWwENczTS8aVw9dFKlKnMp5QRkhBxaWjmvvwP9rwdZg=='
      let signCell = new window.SignCellType({person_name:"",handwriting:handwriting},{isCompress:true})
      var c=document.getElementById("myframe1");
      var ctx=c.getContext("2d");
      signCell.drawSign(ctx,0,0,100,33);
      console.log(signCell)
    },
    unzip(b64Data) {
      if (!b64Data || typeof b64Data != 'string') {
      	return b64Data;
      }
      let strData = base64js.toByteArray(b64Data);
      // // Convert binary string to character-number array
      // let charData = strData.split('').map(function(x) {
      // 	return x.charCodeAt(0);
      // });
      // Turn number array into byte-array
      // let binData = new Uint8Array(strData);
      // // unzip
      let array = pako.ungzip(strData);
      // Convert gunzipped byteArray back to ascii string:
      //strData = String.fromCharCode.apply(null, new Uint16Array(array));
      let chunk = 8 * 1024;
      let i;
      array = new Uint16Array(array)
      strData = ''
      for (i = 0; i < array.length / chunk; i++) {
      	strData += String.fromCharCode.apply(null, array.slice(i * chunk, (i + 1) * chunk));
      }
      strData += String.fromCharCode.apply(null, array.slice(i * chunk));
      // 将乱码的中文进行转换
      // let jsonResult = decodeURIComponent(escape((strData)))
      let jsonResult = decodeURIComponent(strData)
      return jsonResult;
    }


  }
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

</style>
