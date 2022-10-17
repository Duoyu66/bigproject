class Customformula {
	outOfRange = '-'
	empty = '/'
	phi = 'Φ'
	x = '×'
	pai = Math.PI
	constructor(luckysheet) {
		if (!luckysheet) {
			luckysheet = window.luckysheet
		}
		this.luckysheet = luckysheet
		this.initLucksheetInsideVariable()
		this.calculation = new Calculation(luckysheet, this.outOfRange, this.empty)
	}
	initLucksheetInsideVariable() {
		try {
			this.luckysheetApi = new luckysheetApi(this.luckysheet)
			this.format = new format(this.luckysheet)
		} catch (e) {
			console.log(e)
		}
		return 0
	}

	//必要参数个数错误检测
	argumentsCoutCheck(formulaThis, formulaArguments) {
		let tips = undefined
		let _this = this
		if (formulaArguments.length < formulaThis.m[0] || formulaArguments.length > formulaThis.m[1]) {
			tips = _this.luckysheetApi.formula.error.na;
		}
		if (tips) {
			return tips
		}
		//参数类型错误检测
		for (let i = 0; i < formulaArguments.length; i++) {
			let p = _this.luckysheetApi.formula.errorParamCheck(formulaThis.p, formulaArguments[i], i);
			if (!p[0]) {
				tips = _this.luckysheetApi.formula.error.v;
			}
		}
		return tips
	}

	/*
	复制json
	fromJson 要负责的json
	toJson 要返回的json
	IsDeepCopy 是否需要深度拷贝
	*/
	CopyJson(fromJson, toJson, IsDeepCopy) {
		if (!toJson) {
			toJson = {}
		}
		if (!fromJson) {
			fromJson = {}
		}
		if (IsDeepCopy) {
			fromJson = JSON.parse(JSON.stringify(fromJson))
		}
		for (let key in fromJson) {
			toJson[key] = fromJson[key]
		}
		return toJson
	}
	formulaTipsConvert(tips) {
		let map = {
			type: 't',
			desc: 'd',
			abstract: 'a',
			range: 'm',
			param: 'p'
		}
		let result = {}
		for (let key in tips) {
			let sKey = ''
			let value = tips[key]
			if (map[key]) {
				sKey = map[key]
			} else {
				sKey = key
			}
			result[sKey] = value
		}
		return result
	}
	//获取自定义公式
	GetCustomformula() {
		let Result = {}
		try {
			this.CopyJson(this.AverageExD2_fob(), Result)
			this.CopyJson(this.AverageExP2_fob(), Result)

			this.CopyJson(this.AverageExDL2_fob(), Result)
			this.CopyJson(this.AverageExDW2_fob(), Result)
			this.CopyJson(this.AverageExA3_fob(), Result)
			this.CopyJson(this.AverageExM3_fob(), Result)
			this.CopyJson(this.AverageExD3_fob(), Result)
			this.CopyJson(this.AverageExD3_1_fob(), Result)
			this.CopyJson(this.AverageExD3_2_fob(), Result)
			this.CopyJson(this.AverageExT3_fob(), Result)
			this.CopyJson(this.AverageExDT3_fob(), Result)
			this.CopyJson(this.AverageExMMD3_fob(), Result)
			this.CopyJson(this.AverageExMMD3_1_fob(), Result)
			this.CopyJson(this.AverageExPM3_fob(), Result)
			this.CopyJson(this.AverageExP6_fob(), Result)
			this.CopyJson(this.AverageExT6_fob(), Result)
			this.CopyJson(this.AverageExMaxMin6_fob(), Result)
			this.CopyJson(this.AverageTime_fob(), Result)
			this.CopyJson(this.RoundEx_fob(), Result)
			this.CopyJson(this.RoundEx1_fob(), Result)
			this.CopyJson(this.RoundEx2_fob(), Result)

			this.CopyJson(this.Plugin_fob(), Result)
			this.CopyJson(this.MinuteDiff_fob(), Result)
			this.CopyJson(this.SecondDiff_fob(), Result)
			this.CopyJson(this.ScopeCompare_fob(), Result)
			this.CopyJson(this.ModulusAverage_fob(), Result)
			this.CopyJson(this.GetSampleArea_fob(), Result)
			this.CopyJson(this.ComputeTestDate_fob(), Result)
			this.CopyJson(this.ComputeArea_fob(), Result)
			this.CopyJson(this.CvEx_fob(), Result)
			this.CopyJson(this.DistEx_fob(), Result)
			this.CopyJson(this.AverageEx_fob(), Result)
			this.CopyJson(this.AverageExU_fob(), Result)
			this.CopyJson(this.AverageExMaxMin_fob(), Result)
			this.CopyJson(this.AddEx_fob(), Result)
			this.CopyJson(this.SubEx_fob(), Result)
			this.CopyJson(this.FindEx_fob(), Result)
			this.CopyJson(this.MaxEx_fob(), Result)
			this.CopyJson(this.MinEx_fob(), Result)
			this.CopyJson(this.CF_fob(), Result)
			this.CopyJson(this.ComputeLost_fob(), Result)
			this.CopyJson(this.MedianEx_fob(), Result)
			this.CopyJson(this.DistEx1_fob(), Result)
			this.CopyJson(this.GetSampleWidth_fob(), Result)
			this.CopyJson(this.GetSampleHeight_fob(), Result)
		} catch (e) {
			console.log(e)
		}

		return Result
	}
	//1 当两个数值的差制值超过阀值时 
	AverageExD2_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '当两个数值的差制值超过阀值时。',
			'abstract': '当两个数值的差制值超过阀值时。',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '当两个数值的差制值超过阀值时。',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2, ...',
				'detail': '[可选] - 当两个数值的差制值超过阀值时。',
				'example': 'B2:B100',
				'require': 'o',
				'repeat': 'y',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"AverageExD2": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 2
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {

						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						//小于最低所需数量直接返回
						if (length < minCount) {
							return _this.empty
						}
						let temp;
						if (length < minCount + 1) {
							temp = dataArr
						} else {
							temp = dataArr.slice(0, dataArr.length - 1)
						}
						tips = undefined
						let {
							isSuccess,
							sum,
							count,
							message
						} = _this.calculation.count(luckysheet_calcADPMM, temp)
						if (!isSuccess) {
							return message
						}
						//获取超差值，为值的最后一个
						let outOfToleranceValue = parseFloat(dataArr[length - 1])
						let diff = 0
						if (length == minCount + 1) {
							tips = _this.calculation.outOfTolerance(temp,
								outOfToleranceValue,
								fixedNum)
							if (tips) {
								return tips
							}
						}
						if (count == 0) {
							return _this.luckysheetApi.formula.error.d;
						}
						return luckysheet_calcADPMM(sum, "/", count); // sum / count;
					} catch (e) {
						var err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						//return _this.empty
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	//2 两值之差与均值之比大于阀值
	AverageExP2_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '两值之差与均值之比大于阀值。',
			'abstract': '两值之差与均值之比大于阀值。',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '两值之差与均值之比大于阀值。',
				'example': 'A2',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2',
				'detail': '两值之差与均值之比大于阀值。',
				'example': 'B2',
				'require': 'm',
				'repeat': 'y',
				'type': 'rangeall'
			}, {
				'name': '值3, ...',
				'detail': '阀值。',
				'example': 'B2',
				'require': '0',
				'repeat': 'y',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"AverageExP2": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 2
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						//小于最低所需数量直接返回
						if (length < minCount) {
							return _this.empty
						}
						let temp;
						if (length < minCount + 1) {
							temp = dataArr
						} else {
							temp = dataArr.slice(0, dataArr.length - 1)
						}
						tips = undefined
						let {
							isSuccess,
							sum,
							count,
							message
						} = _this.calculation.count(luckysheet_calcADPMM, temp)
						if (!isSuccess) {
							return _this.empty
							//return message
						}

						let avg = luckysheet_calcADPMM(sum, "/", count); // sum / count;
						if (length == minCount + 1) {
							//获取超差值，为值的最后一个
							let outOfToleranceValue = parseFloat(dataArr[length - 1])
							let diff = 0
							tips = _this.calculation.outOfToleranceRatioWithAvg(temp, outOfToleranceValue,
								avg, fixedNum)
							if (tips) {
								return tips
							}
						}
						if (count == 0) {
							return _this.luckysheetApi.formula.error.d;
						}
						return avg;
					} catch (e) {
						var err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						//return _this.empty
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	//3 当两个数值均值大于某阀值时,两值之差大于某值超差,均值大于e时判断差值
	AverageExDL2_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '当两个数值均值大于某阀值时,两值之差大于某值超差。',
			'abstract': '当两个数值均值大于某阀值时,两值之差大于某值超差。',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '当两个数值均值大于某阀值时,两值之差大于某值超差。',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2, ...',
				'detail': '当两个数值均值大于某阀值时,两值之差大于某值超差。',
				'example': 'B2:B100',
				'require': 'o',
				'repeat': 'y',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"AverageExDL2": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 2
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						//小于最低所需数量直接返回
						if (length < minCount) {
							return _this.empty
						}
						let temp
						if (length < minCount + 3) {
							temp = dataArr
						} else {
							temp = dataArr.slice(0, dataArr.length - 3)
						}
						tips = undefined
						let {
							isSuccess,
							sum,
							count,
							message
						} = _this.calculation.count(luckysheet_calcADPMM, temp)
						if (!isSuccess) {
							return _this.empty
							//return message
						}
						//获取超差值，为值的最后一个

						let diff = 0
						let avg = luckysheet_calcADPMM(sum, "/", count); // sum / count;
						if (length == minCount) {
							let outOfToleranceValue = dataArr[length - 1]
							if (avg > Number(outOfToleranceValue)) {
								outOfToleranceValue = dataArr[length - 3]
								tips = _this.calculation.outOfTolerance(temp,
									outOfToleranceValue,
									fixedNum)
							} else {
								outOfToleranceValue = dataArr[length - 2]
								tips = _this.calculation.outOfTolerance(temp,
									outOfToleranceValue,
									undefined)
							}

							if (tips) {
								return tips
							}
						}
						if (count == 0) {
							return _this.luckysheetApi.formula.error.d;
						}
						return avg;
					} catch (e) {
						var err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						//return _this.empty
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	//4 差值和最小值之比及差值大于阀值超差
	AverageExDW2_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '差值和最小值之比及差值大于阀值超差。',
			'abstract': '差值和最小值之比及差值大于阀值超差。',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '差值和最小值之比及差值大于阀值超差。',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2, ...',
				'detail': '差值和最小值之比及差值大于阀值超差。',
				'example': 'B2:B100',
				'require': 'o',
				'repeat': 'y',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"AverageExDW2": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 2
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						//小于最低所需数量直接返回
						if (length < minCount) {
							return _this.empty
						}
						tips = undefined
						let {
							isSuccess,
							sum,
							count,
							message
						} = _this.calculation.count(luckysheet_calcADPMM, dataArr)
						if (!isSuccess) {
							return _this.empty
							//return message
						}
						let diff = 0
						let avg = luckysheet_calcADPMM(sum, "/", count); // sum / count;
						//固定超差
						if (dataArr[0] < 100 && dataArr[1] > 100) {
							tips = _this.calculation.outOfTolerance(dataArr, 10, fixedNum)
						} else if (dataArr[0] > 100 && dataArr[1] > 100) {
							tips = _this.calculation.outOfToleranceRatioWithMin(dataArr, 0.05, fixedNum)
						}
						if (tips) {
							return tips
						}
						if (count == 0) {
							return _this.empty
							//return _this.luckysheetApi.formula.error.d;
						}
						return avg;
					} catch (e) {
						var err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						//return _this.empty
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	//剔除掉与均值有一定偏差的值之后求平均
	AverageExA3_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '剔除掉与均值有一定偏差的值之后求平均。',
			'abstract': '剔除掉与均值有一定偏差的值之后求平均。',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '剔除掉与均值有一定偏差的值之后求平均。',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2, ...',
				'detail': '剔除掉与均值有一定偏差的值之后求平均。',
				'example': 'B2:B100',
				'require': 'o',
				'repeat': 'y',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"AverageExA3": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 3
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array', 'float')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						//小于最低所需数量直接返回
						if (length < minCount) {
							return _this.empty
						}
						tips = undefined
						let {
							isSuccess,
							sum,
							count,
							message
						} = _this.calculation.count(luckysheet_calcADPMM, dataArr)
						if (!isSuccess) {
							return message
						}
						let avg = luckysheet_calcADPMM(sum, "/", count); // sum / count;
						res = _this.calculation.count(luckysheet_calcADPMM, dataArr, avg)
						if (!res.isSuccess) {
							return res.message
						}
						if (count == 0) {
							return _this.luckysheetApi.formula.error.d;
						}
						return avg;
					} catch (e) {
						var err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	//1. 如果两个值与中值之比大于阀值,取第三个值做为结果, 如果一个值与中值之比大于阀值,取其他二值均值作为结果
	//2. 如果一个值与中值之比大于阀值,取中值作为结果  否则取三个的平均值      
	AverageExM3_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '1. 如果两个值与中值之比大于阀值,取第三个值做为结果, 如果一个值与中值之比大于阀值,取其他二值均值作为结果。2.如果一个值与中值之比大于阀值,取中值作为结果  否则取三个的平均值。',
			'abstract': '1. 如果两个值与中值之比大于阀值,取第三个值做为结果, 如果一个值与中值之比大于阀值,取其他二值均值作为结果。2.如果一个值与中值之比大于阀值,取中值作为结果  否则取三个的平均值',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '1. 如果两个值与中值之比大于阀值,取第三个值做为结果, 如果一个值与中值之比大于阀值,取其他二值均值作为结果。2.如果一个值与中值之比大于阀值,取中值作为结果  否则取三个的平均值。',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2, ...',
				'detail': '1. 如果两个值与中值之比大于阀值,取第三个值做为结果, 如果一个值与中值之比大于阀值,取其他二值均值作为结果。2.如果一个值与中值之比大于阀值,取中值作为结果  否则取三个的平均值。',
				'example': 'B2:B100',
				'require': 'o',
				'repeat': 'y',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"AverageExM3": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 3
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						//小于最低所需数量直接返回
						if (length < minCount) {
							return _this.empty
						}
						tips = undefined
						let temp
						if (length < minCount + 2) {
							temp = dataArr
						} else {
							temp = dataArr.slice(0, dataArr.length - 3)
						}
						let {
							isSuccess,
							sum,
							count,
							message
						} = _this.calculation.count(luckysheet_calcADPMM, temp)
						if (!isSuccess) {
							return message
						}
						let avg = 0
						let P5_vob = 0
						let P4_vob = 0
						let d = 0
						if (dataArr.length == 5) {
							P5_vob = dataArr[4];
							P4_vob = dataArr[3];
							d = parseFloat(P4_vob);
						} else if (dataArr.length == 4) {
							P4_vob = dataArr[3];
							d = parseFloat(P4_vob);
						}
						if (dataArr.length >= 4) {
							let a = dataArr[0]
							let b = _this.calculation.GetMiddle(dataArr)
							let c = dataArr[3]
							if (b != 0) {
								if ((Math.abs(a - b) / b > d) && Math.abs(c - b) / b > d) {
									if (P5_vob == 1) {
										avg = b;
									} else {
										return this.outOfRange;
									}
								} else if (Math.abs(a - b) / b > d) {
									if (P5_vob == 1) {
										avg = (b + c) / 2;
									} else {
										avg = b;
									}
								} else if (Math.abs(c - b) / b > d) {
									if (P5_vob == 1) {
										avg = (a + b) / 2;
									} else {
										avg = b;
									}
								} else {
									avg = (a + b + c) / 3;
								}
							} else {
								return (a + b) / 2;
							}
						} else {
							avg = luckysheet_calcADPMM(sum, "/", count); // sum / count;
						}
						if (count == 0) {
							return _this.luckysheetApi.formula.error.d;
						}
						return avg;
					} catch (e) {
						console.log(e)
						var err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return _this.empty
						//return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	//如果两个值与中值之差大于阀值,重做试验. 有一个值与中值之差大于阀值,取中值做为结果. 否则取三个值的均值做结果.
	AverageExD3_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '如果两个值与中值之差大于阀值,重做试验. 有一个值与中值之差大于阀值,取中值做为结果. 否则取三个值的均值做结果.',
			'abstract': '如果两个值与中值之差大于阀值,重做试验. 有一个值与中值之差大于阀值,取中值做为结果. 否则取三个值的均值做结果.',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '如果两个值与中值之差大于阀值,重做试验. 有一个值与中值之差大于阀值,取中值做为结果. 否则取三个值的均值做结果.',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2, ...',
				'detail': '1如果两个值与中值之差大于阀值,重做试验. 有一个值与中值之差大于阀值,取中值做为结果. 否则取三个值的均值做结果.',
				'example': 'B2:B100',
				'require': 'o',
				'repeat': 'y',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"AverageExD3": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 3
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						//小于最低所需数量直接返回
						if (length < minCount) {
							return _this.empty
						}
						tips = undefined
						let temp
						if (length < minCount + 1) {
							temp = dataArr
						} else {
							temp = dataArr.slice(0, dataArr.length - 1)
						}
						let {
							isSuccess,
							sum,
							count,
							message
						} = _this.calculation.count(luckysheet_calcADPMM, temp)
						if (!isSuccess) {
							return message
						}
						let Middle = _this.calculation.GetMiddle(dataArr)
						if (count < minCount) {
							return _this.empty
						}
						let a = dataArr[0]
						let b = dataArr[1]
						let c = dataArr[2]
						let avg = 0;
						if (length == minCount + 1) {
							//获取超差值，为值的最后一个
							let outOfToleranceValue = dataArr[length - 1]
							if (Math.abs(a - b) > outOfToleranceValue && Math.abs(c - b) >
								outOfToleranceValue) {
								return _this.outOfRange
							} else if (Math.abs(a - b) > outOfToleranceValue || Math.abs(c - b) >
								outOfToleranceValue) {
								avg = b;
							} else {
								avg = luckysheet_calcADPMM(sum, "/", count); // sum / count;
							}
						} else {
							avg = luckysheet_calcADPMM(sum, "/", count); // sum / count;
						}

						// res = tips = _this.calculation.outOfToleranceMiddleNum(dataArr.slice(0, dataArr
						// 	.length - 1), fixedNum)
						// if (res.isSuccess) {
						// 	let outOfToleranceMiddleNum = res.outOfToleranceMiddleNum
						// 	if (outOfToleranceMiddleNum > 2) {
						// 		return _this.outOfRange
						// 	} else if (outOfToleranceMiddleNum == 1) {
						// 		avg = res.Middle
						// 	} else {
						// 		avg = luckysheet_calcADPMM(sum, "/", count); // sum / count;
						// 	}
						// } else {
						// 	return res.message
						// }

						if (count == 0) {
							return _this.luckysheetApi.formula.error.d;
						}
						return avg;
					} catch (e) {
						console.log(e)
						var err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	//如果两值之差大于两值均值的百分比, 需要做第三次试验
	AverageExD3_1_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '如果两值之差大于两值均值的百分比, 需要做第三次试验',
			'abstract': '如果两值之差大于两值均值的百分比, 需要做第三次试验',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '如果两值之差大于两值均值的百分比, 需要做第三次试验',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2, ...',
				'detail': '如果两值之差大于两值均值的百分比, 需要做第三次试验',
				'example': 'B2:B100',
				'require': 'o',
				'repeat': 'y',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"AverageExD3_1": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 2
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array', 'float')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						//小于最低所需数量直接返回
						if (length < minCount + 1) {
							return _this.empty
						}
						tips = undefined
						let temp
						if (length < minCount + 2) {
							temp = dataArr
						} else {
							temp = dataArr.slice(0, dataArr.length - 1)
						}
						let {
							isSuccess,
							sum,
							count,
							message
						} = _this.calculation.count(luckysheet_calcADPMM, temp)
						if (!isSuccess) {
							return message
						}
						let Middle = _this.calculation.GetMiddle(dataArr)
						if (count < minCount) {
							return _this.empty
						}
						let avg = luckysheet_calcADPMM(sum, "/", count); // sum / count;
						let a = Number(dataArr[0])
						let b = Number(dataArr[1])
						temp = Math.abs(a - b);
						let ratio = dataArr[length - 1]
						if (temp < avg * ratio / 100) {
							return (a + b) / 2
						} else if (length == minCount + 2) {
							return avg
						} else {
							return _this.outOfRange
						}
						if (count == 0) {
							return _this.luckysheetApi.formula.error.d;
						}
						return avg;
					} catch (e) {
						console.log(e)
						var err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	AverageExD3_2_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '如果两值之差大于定值, 需要做第三次试验',
			'abstract': '如果两值之差大于定值, 需要做第三次试验',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '如果两值之差大于定值, 需要做第三次试验',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2, ...',
				'detail': '如果两值之差大于定值, 需要做第三次试验',
				'example': 'B2:B100',
				'require': 'o',
				'repeat': 'y',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"AverageExD3_2": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 2
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						//小于最低所需数量直接返回
						if (length < minCount + 1) {
							return _this.empty
						}
						tips = undefined
						let temp
						if (length < minCount + 2) {
							temp = dataArr
						} else {
							temp = dataArr.slice(0, dataArr.length - 1)
						}
						let {
							isSuccess,
							sum,
							count,
							message
						} = _this.calculation.count(luckysheet_calcADPMM, temp)
						if (!isSuccess) {
							return message
						}
						if (count < minCount) {
							return _this.empty
						}
						let avg = luckysheet_calcADPMM(sum, "/", count); // sum / count;
						let a = Number(dataArr[0])
						let b = Number(dataArr[1])
						temp = Math.abs(a - b);
						let outOfToleranceValue = dataArr[length - 1]
						if (temp < outOfToleranceValue) {
							return (a + b) / 2
						} else if (length == minCount + 2) {
							let c = Number(dataArr[2])
							if (Math.abs(a - c) < outOfToleranceValue) {
								return (a + c) / 2
							} else if (Math.abs(b - c) < outOfToleranceValue) {
								return (b + c) / 2
							}
							return _this.outOfRange
						} else {
							return _this.outOfRange
						}
						if (count == 0) {
							return _this.luckysheetApi.formula.error.d;
						}
						return avg;
					} catch (e) {
						console.log(e)
						var err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return _this.empty
						//return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	AverageExT3_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '取偏差最小的两个值的均值',
			'abstract': '取偏差最小的两个值的均值',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2, ...',
				'detail': '',
				'example': 'B2:B100',
				'require': 'o',
				'repeat': 'y',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"AverageExT3": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 3
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array', 'float')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						//小于最低所需数量直接返回
						if (length < minCount) {
							return _this.empty
						}
						tips = undefined
						let avg = 0
						let diff_mix = Number.MAX_VALUE
						for (let i = 0; i < length; i++) {
							for (let j = 0; j < length; j++) {
								if (i == j) {
									continue
								}
								let one = Number(dataArr[i])
								let two = Number(dataArr[j])
								let diff = Math.abs(one - two)
								if (diff < diff_mix) {
									diff_mix = diff
									avg = (one + two) / 2
								}
							}
						}
						if (length == 0) {
							return _this.luckysheetApi.formula.error.d;
						}
						return avg;
					} catch (e) {
						console.log(e)
						var err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	// AverageExDT3_fob() {
	// 	let _this = this
	// 	let sTemp = this.formulaTipsConvert({
	// 		'type': 1,
	// 		'desc': ' 如果任意两个值之差超过阀,重做试验.  ',
	// 		'abstract': ' 如果任意两个值之差超过阀,重做试验.  ',
	// 		'range': [1, 255],
	// 		'param': [{
	// 			'name': '值1',
	// 			'detail': '',
	// 			'example': 'A2:A100',
	// 			'require': 'm',
	// 			'repeat': 'n',
	// 			'type': 'rangeall'
	// 		}, {
	// 			'name': '值2, ...',
	// 			'detail': '',
	// 			'example': 'B2:B100',
	// 			'require': 'o',
	// 			'repeat': 'y',
	// 			'type': 'rangeall'
	// 		}]
	// 	})
	// 	let formula = {
	// 		"AverageExDT3": {
	// 			tips: sTemp,
	// 			formula: function(selectInfo, callee) {
	// 				let fixedNum = undefined
	// 				let minCount = 2
	// 				let tips = undefined
	// 				//传递参数检测
	// 				tips = _this.argumentsCoutCheck(this, arguments)
	// 				if (tips) {
	// 					return tips
	// 				}
	// 				try {
	// 					//获取单元格中的数据
	// 					let res = _this.calculation.GetData(this, arguments, 'text', true, 'array')
	// 					if (!res.isSuccess) {
	// 						return res.message
	// 					}
	// 					let dataArr = res.data;
	// 					let length = dataArr.length
	// 					//小于最低所需数量直接返回
	// 					if (length < minCount) {
	// 						return _this.empty
	// 					}
	// 					let temp;
	// 					if (length < minCount + 1) {
	// 						temp = dataArr
	// 					} else {
	// 						temp = dataArr.slice(0, dataArr.length - 1)
	// 					}
	// 					tips = undefined
	// 					let {
	// 						isSuccess,
	// 						sum,
	// 						count,
	// 						message
	// 					} = _this.calculation.count(luckysheet_calcADPMM, temp)
	// 					if (!isSuccess) {
	// 						return message
	// 					}
	// 					//获取超差值，为值的最后一个
	// 					let outOfToleranceValue = dataArr[length - 1]
	// 					let diff = 0
	// 					if (length == minCount + 1) {
	// 						tips = _this.calculation.outOfTolerance(dataArr.slice(0, dataArr.length - 1),
	// 							outOfToleranceValue,
	// 							fixedNum)
	// 						if (tips) {
	// 							return tips
	// 						}
	// 					}
	// 					if (count == 0) {
	// 						return _this.luckysheetApi.formula.error.d;
	// 					}
	// 					return luckysheet_calcADPMM(sum, "/", count); // sum / count;
	// 				} catch (e) {
	// 					console.log(e)
	// 					var err = e;
	// 					err = _this.luckysheetApi.formula.errorInfo(err);
	// 					return [_this.luckysheetApi.formula.error.v, err];
	// 				}
	// 			},
	// 		}
	// 	}
	// 	return formula
	// }
	AverageExDT3_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': ' 如果任意两个值之差超过阀,重做试验.  ',
			'abstract': ' 如果任意两个值之差超过阀,重做试验.  ',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2, ...',
				'detail': '',
				'example': 'B2:B100',
				'require': 'o',
				'repeat': 'y',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"AverageExDT3": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 2
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						//小于最低所需数量直接返回
						if (length < minCount) {
							return _this.empty
						}
						let temp;
						if (length < minCount + 1) {
							temp = dataArr
						} else {
							temp = dataArr.slice(0, dataArr.length - 1)
						}
						tips = undefined
						let {
							isSuccess,
							sum,
							count,
							message
						} = _this.calculation.count(luckysheet_calcADPMM, temp)
						if (!isSuccess) {
							return message
						}
						//获取超差值，为值的最后一个
						let outOfToleranceValue = dataArr[length - 1]
						let diff = 0
						let avg = luckysheet_calcADPMM(sum, "/", count); // sum / count;
						if (length == minCount + 1) {
							tips = _this.calculation.outOfTolerance(dataArr.slice(0, dataArr
									.length -
									1),
								outOfToleranceValue,
								fixedNum)
							if (tips) {
								return tips
							}
						}
						if (count == 0) {
							return _this.luckysheetApi.formula.error.d;
						}
						return avg
					} catch (e) {
						console.log(e)
						var err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	AverageExMMD3_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '如果最大最小之差大于阀值,重做试验. 否则取三个值的均值做结果 ',
			'abstract': ' 如果最大最小之差大于阀值,重做试验. 否则取三个值的均值做结果 ',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2, ...',
				'detail': '',
				'example': 'B2:B100',
				'require': 'o',
				'repeat': 'y',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"AverageExMMD3": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = undefined
					let minCount = 3
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						//小于最低所需数量直接返回
						if (length < minCount) {
							return _this.empty
						}
						let temp;
						if (length < minCount + 1) {
							temp = dataArr
						} else {
							temp = dataArr.slice(0, dataArr.length - 1)
						}
						tips = undefined
						let {
							isSuccess,
							sum,
							count,
							message
						} = _this.calculation.count(luckysheet_calcADPMM, temp)
						if (!isSuccess) {
							return message
						}
						//获取超差值，为值的最后一个
						let outOfToleranceValue = dataArr[length - 1]
						let diff = 0
						let avg = luckysheet_calcADPMM(sum, "/", count); // sum / count;
						if (length == minCount + 1) {
							res = _this.calculation.outOfToleranceRatioMaxMin(dataArr.slice(0, dataArr
									.length - 1),
								outOfToleranceValue,
								fixedNum, avg)
							if (!res.isSuccess) {
								return res.message
							}
						}
						if (count == 0) {
							return _this.luckysheetApi.formula.error.d;
						}
						return avg
					} catch (e) {
						console.log(e)
						var err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	AverageExMMD3_1_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': ' 如果任意两个值之差超过阀,重做试验.  ',
			'abstract': ' 如果任意两个值之差超过阀,重做试验.  ',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2, ...',
				'detail': '',
				'example': 'B2:B100',
				'require': 'o',
				'repeat': 'y',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"AverageExMMD3_1": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = undefined
					let minCount = 3
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						//小于最低所需数量直接返回
						if (length < minCount) {
							return _this.empty
						}
						let temp;
						if (length < minCount + 1) {
							temp = dataArr
						} else {
							temp = dataArr.slice(0, dataArr.length - 1)
						}
						tips = undefined
						let {
							isSuccess,
							sum,
							count,
							message
						} = _this.calculation.count(luckysheet_calcADPMM, temp)
						if (!isSuccess) {
							return message
						}

						let diff = 0
						let avg = luckysheet_calcADPMM(sum, "/", count); // sum / count;
						if (length == minCount + 1) {
							//获取超差值，为值的最后一个
							let outOfToleranceValue = dataArr[length - 1]
							let min = _this.calculation.GetMin(temp)
							let middle = _this.calculation.GetMiddle(temp)
							let max = _this.calculation.GetMax(temp)
							diff = Math.abs(max - middle)
							diff = Number(diff.toFixed(5))
							if (diff > outOfToleranceValue && diff > outOfToleranceValue) {
								avg = middle;
							} else if (diff > outOfToleranceValue) {
								avg = (middle + min) / 2;
							} else if (Number(Math.abs(middle - max).toFixed(5)) > outOfToleranceValue) {
								avg = (middle + max) / 2;
							}
						}
						if (count == 0) {
							return _this.luckysheetApi.formula.error.d;
						}
						return avg
					} catch (e) {
						console.log(e)
						var err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	AverageExPM3_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '如果最大值或最小值与中值之差大于中间值的一定比例 取中值.若都超过,重做试验. ',
			'abstract': '如果最大值或最小值与中值之差大于中间值的一定比例 取中值.若都超过,重做试验. ',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2, ...',
				'detail': '',
				'example': 'B2:B100',
				'require': 'o',
				'repeat': 'y',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"AverageExPM3": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 3
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						//小于最低所需数量直接返回
						if (length < minCount) {
							return _this.empty
						}
						let temp;
						if (length < minCount + 1) {
							temp = dataArr
						} else {
							temp = dataArr.slice(0, dataArr.length - 1)
						}
						tips = undefined
						let {
							isSuccess,
							sum,
							count,
							message
						} = _this.calculation.count(luckysheet_calcADPMM, temp)
						if (!isSuccess) {
							return message
						}

						let diff = 0
						let avg = luckysheet_calcADPMM(sum, "/", count); // sum / count;
						if (length == minCount + 1) {
							//获取超差值，为值的最后一个
							let outOfToleranceValue = dataArr[length - 1]
							res = _this.calculation.outOfToleranceMaxMinToMiddle(temp, outOfToleranceValue,
								fixedNum)
							if (res.data == 2) {
								return _this.outOfRange
							} else if (res.data == 1) {
								return _this.calculation.GetMiddle(temp)
							}
							return avg
						}
						if (count == 0) {
							return _this.luckysheetApi.formula.error.d;
						}
						return avg
					} catch (e) {
						console.log(e)
						var err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	AverageExP6_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '最大值与均值之差超过均值一定比例, 剔除再求平均, 若再有此情况,重做实验   ',
			'abstract': '最大值与均值之差超过均值一定比例, 剔除再求平均, 若再有此情况,重做实验   ',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2, ...',
				'detail': '',
				'example': 'B2:B100',
				'require': 'o',
				'repeat': 'y',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"AverageExP6": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 6
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array')

						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						//小于最低所需数量直接返回
						if (length < minCount + 1) {
							return _this.empty
						}
						let temp;
						if (length < minCount + 1) {
							temp = dataArr
						} else {
							temp = dataArr.slice(0, dataArr.length - 1)
						}
						tips = undefined

						function GetAvg(list, outOfToleranceValue, maxDeep, deep) {

							if (!deep) {
								deep = 0
							}
							if (deep >= maxDeep) {
								return {
									isSuccess: false,
									data: -1,
									message: _this.outOfRange
								}
							}
							let {
								isSuccess,
								sum,
								count,
								message
							} = _this.calculation.count(luckysheet_calcADPMM, list)
							let avg = luckysheet_calcADPMM(sum, "/", count); // sum / count;
							if (!isSuccess) {
								return {
									isSuccess: false,
									data: -1,
									message: message
								}
							}

							let maxDiff = -Number.MAX_VALUE
							let index = 0
							for (let i = 0; i < list.length; i++) {
								let diff = Math.abs(list[i] - avg)
								if (diff > maxDiff) {
									index = i
									maxDiff = diff
								}
							}
							if (maxDiff / avg > outOfToleranceValue) {
								let temp2 = JSON.parse(JSON.stringify(list))
								temp2.splice(index, 1)
								let avgRes = GetAvg(temp2, outOfToleranceValue, maxDeep, deep + 1)
								return avgRes
							}
							return {
								isSuccess: true,
								data: avg,
								message: message
							}
						}
						//获取超差值，为值的最后一个
						let outOfToleranceValue = Number(dataArr[length - 1])
						res = GetAvg(temp, outOfToleranceValue, 2)
						if (res.isSuccess) {
							return res.data
						} else {
							return res.message
						}
						if (count == 0) {
							return _this.luckysheetApi.formula.error.d;
						}

					} catch (e) {
						console.log(e)
						var err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	AverageExT6_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '剔除超出均值一定比例的, 然后求均值,如果剩余参与计算不足三个 ,重做试验',
			'abstract': '剔除超出均值一定比例的, 然后求均值,如果剩余参与计算不足三个 ,重做试验',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2, ...',
				'detail': '',
				'example': 'B2:B100',
				'require': 'o',
				'repeat': 'y',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"AverageExT6": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 6
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array')

						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						//小于最低所需数量直接返回
						if (length < minCount + 1) {
							return _this.empty
						}
						let temp;
						if (length < minCount + 1) {
							temp = dataArr
						} else {
							temp = dataArr.slice(0, dataArr.length - 1)
						}
						tips = undefined

						function GetAvg(list, outOfToleranceValue, maxDeep, deep) {
							if (!deep) {
								deep = 0
							}
							if (deep >= maxDeep || list.length < 3) {
								return {
									isSuccess: false,
									data: -1,
									message: _this.outOfRange
								}
							}
							let {
								isSuccess,
								sum,
								count,
								message
							} = _this.calculation.count(luckysheet_calcADPMM, list)
							let avg = luckysheet_calcADPMM(sum, "/", count); // sum / count;
							if (!isSuccess) {
								return {
									isSuccess: false,
									data: -1,
									message: message
								}
							}

							let temp2 = JSON.parse(JSON.stringify(list))
							for (let i = 0; i < list.length; i++) {
								let diff = Math.abs(list[i] - avg) / avg
								if (diff > outOfToleranceValue) {
									temp2[i] = undefined
								}
							}
							temp2 = temp2.filter((e) => {
								if (e) {
									return e
								}
							})
							if (temp2.length != list.length) {
								let avgRes = GetAvg(temp2, outOfToleranceValue, maxDeep, deep + 1)
								return avgRes
							}
							return {
								isSuccess: true,
								data: avg,
								message: message
							}
						}
						//获取超差值，为值的最后一个
						let outOfToleranceValue = Number(dataArr[length - 1])
						res = GetAvg(temp, outOfToleranceValue, 2)
						if (res.isSuccess) {
							return res.data
						} else {
							return res.message
						}
						if (count == 0) {
							return _this.luckysheetApi.formula.error.d;
						}

					} catch (e) {
						console.log(e)
						var err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	AverageExMaxMin6_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '当6个试件的最大值或者最小值与平均值的差超过了20%,以中间4个试件的平均值作为该组时间的抗压强度值',
			'abstract': '当6个试件的最大值或者最小值与平均值的差超过了20%,以中间4个试件的平均值作为该组时间的抗压强度值',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2, ...',
				'detail': '',
				'example': 'B2:B100',
				'require': 'o',
				'repeat': 'y',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"AverageExMM6": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 6
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array')

						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						//小于最低所需数量直接返回
						if (length < minCount) {
							return _this.empty
						}
						let temp;
						if (length < minCount + 1) {
							temp = dataArr
						} else {
							temp = dataArr.slice(0, dataArr.length - 1)
						}
						tips = undefined
						let {
							isSuccess,
							sum,
							count,
							message
						} = _this.calculation.count(luckysheet_calcADPMM, temp)
						if (!isSuccess) {
							return message
						}
						let avg = luckysheet_calcADPMM(sum, "/", count); // sum / count;
						if (length >= minCount + 1) {
							//获取超差值，为值的最后一个
							let outOfToleranceValue = parseFloat(dataArr[length - 1])
							temp = _this.calculation.BubbleSort(temp);
							if ((Math.abs(temp[0] - avg) / avg > outOfToleranceValue) || Math.abs(temp[5] -
									avg) / avg > outOfToleranceValue) {
								avg = (temp[1] + temp[2] + temp[3] + temp[4]) / 4;
							}
						}

						if (count == 0) {
							return _this.luckysheetApi.formula.error.d;
						}
						return avg
					} catch (e) {
						console.log(e)
						var err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	AverageTime_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '平均时间',
			'abstract': '平均时间',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2, ...',
				'detail': '',
				'example': 'B2:B100',
				'require': 'o',
				'repeat': 'y',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"AverageTime": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 2
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array', 'time')

						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						//小于最低所需数量直接返回
						if (length < minCount) {
							return _this.empty
						}
						let nMsec = 0,
							P1_vob, P2_vob, P3_vob;
						P1_vob = dataArr[0];
						P2_vob = dataArr[1];

						let myDate1 = new Date('2000-01-01 00:' + P1_vob);
						let myDate2 = new Date('2000-01-01 00:' + P2_vob);
						if (length >= minCount + 1) {
							P3_vob = dataArr[2];
							nMsec = parseFloat(P3_vob);
							if (nMsec != 0) {

								if (Math.abs((myDate1.getTime() - myDate2.getTime()) / 1000) > nMsec) {
									return _this.outOfRange;
								}
							}
						}
						let tTime_vob = Math.abs(myDate1.getMinutes() * 60 + myDate1.getSeconds() + myDate2
							.getMinutes() * 60 + myDate2.getSeconds()) / 2;
						let m = Math.floor(tTime_vob / 60);
						if (m < 10) {
							m = '0' + m;
						}
						let s = Math.floor(tTime_vob % 60);
						if (s < 10) {
							s = '0' + s;
						}
						let temp_vob = m + ":" + s;
						if (length == 0) {
							return _this.luckysheetApi.formula.error.d;
						}
						return temp_vob
					} catch (e) {
						console.log(e)
						var err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	RoundEx_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '修约',
			'abstract': '修约',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2, ...',
				'detail': '',
				'example': 'B2:B100',
				'require': 'o',
				'repeat': 'y',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"RoundEx": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 3
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array', 'float')

						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						//小于最低所需数量直接返回
						if (length < minCount) {
							return _this.empty
						}
						let Value = dataArr[0];
						let dUnit_vob = dataArr[1];
						let dScale = dataArr[2];
						if (!Value) { //判断是不是空字符串
							return _this.empty;
						}
						let sValue_vob = "";
						if (isNaN(Value) || isNaN(dUnit_vob) || isNaN(dScale)) {
							if (Value == _this.outOfRange || Value == _this.empty) {
								return Value;
							} else {
								return "";
							}
						} else {
							Value = parseFloat(Value);
							dUnit_vob = parseFloat(dUnit_vob);
							dScale = parseFloat(dScale);
							let dValue_vob = _this.calculation.RoundToEx(Value, dUnit_vob, dScale);
							let nScale_vob = Math.trunc(dScale);
							if (dScale >= 0) {
								sValue_vob = String(dValue_vob.toFixed(nScale_vob)); //使用toFix之前原数加一,使用之后减一
							} else {
								sValue_vob = String(dValue_vob);
							}
						}
						return sValue_vob;
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}

	RoundEx1_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '压力≤200MPa,修约至1MPa；200～1000MPa,修约至5MPa',
			'abstract': '压力≤200MPa,修约至1MPa；200～1000MPa,修约至5MPa',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"RoundEx1": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 3
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array', 'float')

						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length

						if (length != 1) {
							return "";
						}
						if (!dataArr[0]) {
							return "";
						} else if (!isNaN(parseFloat(dataArr[0]))) {
							let Value = parseFloat(dataArr[0]);
							if (Value <= 200) {
								return _this.calculation.RoundToEx(Value, 1, 0);
							} else if ((Value > 200) && (Value <= 1000)) {
								return _this.calculation.RoundToEx(Value, 0.5, 0);
							} else {
								return _this.calculation.RoundToEx(Value, 1, -1);
							}
						} else {
							return "";
						}
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	RoundEx2_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '断后伸长率： ≤10%修约至0.5% ＞10%，修约至1%',
			'abstract': '断后伸长率： ≤10%修约至0.5% ＞10%，修约至1%',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"RoundEx2": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 3
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array', 'float')

						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						if (length != 1) {
							return "";
						}
						if (!dataArr[0]) {
							return "";
						} else if (!isNaN(parseFloat(dataArr[0]))) {
							let Value = parseFloat(dataArr[0]);
							if (Value <= 10) {
								return _this.calculation.RoundToEx(Value, 0.5, 1);
							} else {
								return _this.calculation.RoundToEx(Value, 1, 0);
							}
						} else {
							return "";
						}
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	Plugin_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': 'eval(值1(值2,值3....值n))',
			'abstract': 'eval(值1(值2,值3....值n))',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"Plugin": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 1
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array',
							'string')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						let result = ''

						if (length == 0) {
							result = ''
						} else if (length == 1) {
							result = eval(dataArr[0] + "()");
						} else {
							result = dataArr[0] + "("
							for (let i = 1; i < length; i++) {
								result = result + dataArr[i] + ','
							}
							if (result.length > 0) {
								result = result.substring(0, result.length - 1) + ")"
								result = eval(result);
							}

						}
						return result
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	MinuteDiff_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '计算差多少分',
			'abstract': '计算差多少分',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"MinuteDiff": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 2
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array',
							'time')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						if (length < minCount) {
							return _this.empty
						}
						let t1 = new Date('2000-01-01 00:' + dataArr[0]);
						let t2 = new Date('2000-01-01 00:' + dataArr[1]);
						let tTime_vob;
						if (t1 < t2) {
							tTime_vob = (t1.getTime() / 1000 + 86400) * 1000 - t2.getTime();
						} else {
							tTime_vob = (t1.getTime() - t2.getTime()) / 1000;
						}
						return tTime_vob
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	SecondDiff_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '计算差多少秒',
			'abstract': '计算差多少秒',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"SecondDiff": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 2
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array',
							'time')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						if (length < minCount) {
							return _this.empty
						}
						let P1_vob = dataArr[0];
						let P2_vob = dataArr[1];
						let tTime_vob = 0;
						let nPos, sHour, sMin, sSec;
						let Result_vob = 0;
						nPos = P1_vob.indexOf(":");
						if (nPos >= 0) {
							sHour = P1_vob.substring(0, nPos);
							P1_vob = P1_vob.substring(nPos + 1);
							nPos = P1_vob.indexOf(":");
							sMin = P1_vob.substring(0, nPos);
							sSec = P1_vob.substring(nPos + 1, 5);
							P1_vob = parseInt(sHour) * 3600 + parseInt(sMin) * 60 + parseInt(sSec);
						}
						nPos = P2_vob.indexOf(":");
						if (nPos >= 0) {
							sHour = P2_vob.substring(0, nPos);
							P2_vob = P2_vob.substring(nPos + 1);
							nPos = P2_vob.indexOf(":");
							sMin = P2_vob.substring(0, nPos);
							sSec = P2_vob.substring(nPos + 1, 5);
							P2_vob = parseInt(sHour) * 3600 + parseInt(sMin) * 60 + parseInt(sSec);
						}
						return Math.abs(P2_vob - P1_vob);
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	ScopeCompare_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '',
			'abstract': '',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"ScopeCompare": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 2
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array',
							'string')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						if (length < minCount) {
							return false
						}
						let P1_vob = dataArr[0];
						let P2_vob = dataArr[1];
						if ((P1_vob == "/") || (P2_vob == "0")) {
							if (P1_vob == "0") {
								return true;
							} else {
								return false;
							}
						} else {
							if ((P2_vob != "") && (P2_vob != "-")) {
								let sExp = P2_vob.replace("～", "<=" + P1_vob + "<=");
								if (Boolean(eval(sExp)) == true) {
									return true;
								} else {
									return false;
								}
							}
						}
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	ModulusAverage_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '弹性模量均值',
			'abstract': '弹性模量均值',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"ModulusAverage": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 9
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array',
							'string')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						if (length < minCount) {
							return _this.empty
						}
						let z, a, b, c, d, e, f, g, h, i, j, k, n, P1_vob, P2_vob, P3_vob, P4_vob, P5_vob,
							P6_vob, P7_vob, P8_vob, P9_vob;
						n = 3;
						P1_vob = dataArr[0];
						P2_vob = dataArr[1];
						P3_vob = dataArr[2];
						P4_vob = dataArr[3];
						P5_vob = dataArr[4];
						P6_vob = dataArr[5];
						P7_vob = dataArr[6];
						P8_vob = dataArr[7];
						P9_vob = dataArr[8];

						a = parseFloat(P1_vob);
						b = parseFloat(P2_vob);
						c = parseFloat(P3_vob);
						d = parseFloat(P4_vob);
						e = parseFloat(P5_vob);
						f = parseFloat(P6_vob);
						g = parseFloat(P7_vob);
						h = parseFloat(P8_vob);
						i = parseFloat(P9_vob);

						if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || isNaN(e) || isNaN(f) || isNaN(
								g) || isNaN(h) || isNaN(i)) {
							return _this.empty
						}

						if (Math.abs(a - d) / d > 0.2) {
							g = 0;
							n--;
						} else if (Math.abs(b - e) / e > 0.2) {
							h = 0;
							n--;
						} else if (Math.abs(c - f) / f > 0.2) {
							i = 0;
							n--;
						}
						if (n >= 2) {
							return (g + h + i) / n;
						} else {
							return _this.outOfRange
						}
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	GetSampleArea_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '试样截面积',
			'abstract': '试样截面积',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"GetSampleArea": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 1
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array',
							'string')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						if (length < minCount) {
							return _this.empty
						}
						let sSize_vob = "",
							dL1_vob = 0,
							dL2_vob = 0,
							dArea_vob = 0;
						let slTemp_vob = new Array();
						if (length != minCount) {
							return _this.empty;
						}
						sSize_vob = dataArr[0];
						slTemp_vob = sSize_vob.split(_this.x);
						if (slTemp_vob.length <= 2) {
							slTemp_vob = sSize_vob.split('x');
						}
						if (slTemp_vob.length >= 2) {
							if (slTemp_vob[0].substr(0, 1) == _this.phi) {
								if (!isNaN(parseFloat(slTemp_vob[1]))) {
									dL1_vob = parseFloat(slTemp_vob[1]);
									dArea_vob = _this.pai * dL1_vob * dL1_vob / 4;
								}
							} else if ((!isNaN(parseFloat(slTemp_vob[0]))) && (parseFloat(slTemp_vob[1]))) {
								dL1_vob = parseFloat(slTemp_vob[0]);
								dL2_vob = parseFloat(slTemp_vob[1]);
								dArea_vob = Math.round(dL1_vob * dL2_vob);
							}
							if (dArea_vob != 0) {
								return dArea_vob;
							}
						} else {
							return _this.empty;
						}
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	ComputeTestDate_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '计算试验日期',
			'abstract': '计算试验日期',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"ComputeTestDate": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 2
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					//44197
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array',
							'default')
						if (!res.isSuccess) {
							return res.message
						}

						let dataArr = res.data;
						let length = dataArr.length
						if (length < minCount) {
							return _this.empty
						}
						let sProductDate_vob = "",
							sTestDate_vob = "",
							P1_vob, nAge_vob = 0;
						sProductDate_vob = dataArr[0];
						P1_vob = dataArr[1];
						if (!isNaN(parseInt(P1_vob))) {
							nAge_vob = parseInt(P1_vob);
						}
						var dDate = new Date(_this.format.formatValue('yyyy-MM-dd', sProductDate_vob));
						dDate.setDate(dDate.getDate() + nAge_vob);
						var m = dDate.getMonth() + 1;
						if (dDate.getMonth() + 1 < 10) {
							m = '0' + Number(dDate.getMonth() + 1);
						}
						var d = dDate.getDate();
						if (dDate.getDate() < 10) {
							d = '0' + Number(dDate.getDate());
						}
						return dDate.getFullYear() + "-" + m + "-" + d;
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	ComputeArea_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '试样截面积',
			'abstract': '试样截面积',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"ComputeArea": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 1
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					//44197
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array',
							'float')
						if (!res.isSuccess) {
							return res.message
						}

						let dataArr = res.data;
						let length = dataArr.length
						if (length < minCount) {
							return _this.empty
						}
						let dDia_vob = parseFloat(dataArr[0]);
						if (dDia_vob == 50) {
							return 1964;
						} else if (dDia_vob > 32) {
							return _this.calculation.RoundToEx(_this.pai * dDia_vob * dDia_vob / 4, 1, 0);
						} else if (dDia_vob > 10) {
							return _this.calculation.RoundToEx(_this.pai * dDia_vob * dDia_vob / 4, 1, 1);
						} else {
							return _this.calculation.RoundToEx(_this.pai * dDia_vob * dDia_vob / 4, 1, 2);
						}
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	CvEx_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': 'CvEx',
			'abstract': 'CvEx',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"CvEx": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 2
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					//44197
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array',
							'float')
						if (!res.isSuccess) {
							return res.message
						}

						let dataArr = res.data;
						let length = dataArr.length
						if (length < minCount) {
							return _this.empty
						}
						let dSum_vob = 0;
						let dAvg_vob = 0;
						let dValue_vob = new Array();
						for (let i = 0; i < length; i++) {
							let P1_vob = dataArr[i];
							let dTemp_vob = parseFloat(P1_vob)
							if (!isNaN(dTemp_vob)) {
								dValue_vob.push(P1_vob);
								dSum_vob = dSum_vob + dTemp_vob;
							}
						}
						if (length > 0) {
							dAvg_vob = dSum_vob / length;
						}
						dSum_vob = 0;
						for (let i = 0; i < dValue_vob.length; i++) {
							dSum_vob = dSum_vob + (dValue_vob[i] - dAvg_vob) * (dValue_vob[i] - dAvg_vob);
						}
						dSum_vob = Math.sqrt(dSum_vob / (dValue_vob.length));
						return dSum_vob / dAvg_vob * 100;
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	DistEx_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': 'DistEx',
			'abstract': 'DistEx',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"DistEx": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 2
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					//44197
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array',
							'float')
						if (!res.isSuccess) {
							return res.message
						}

						let dataArr = res.data;
						let length = dataArr.length
						if (length < minCount) {
							return _this.empty
						}
						let dSum_vob = 0;
						let dAvg_vob = 0;
						let dValue_vob = new Array();
						for (let i = 0; i < length; i++) {
							let P1_vob = dataArr[i];
							let dTemp_vob = parseFloat(P1_vob)
							if (_this.luckysheetApi.isRealNum(dTemp_vob)) {
								dValue_vob.push(P1_vob);
								dSum_vob = dSum_vob + dTemp_vob;
							}
						}
						if (dValue_vob.length > 0) {
							dAvg_vob = dSum_vob / dValue_vob.length;
						}
						dSum_vob = 0;
						for (let i = 0; i < dValue_vob.length; i++) {
							dSum_vob = dSum_vob + (dValue_vob[i] - dAvg_vob) * (dValue_vob[i] - dAvg_vob);
						}
						dSum_vob = Math.sqrt(dSum_vob / dValue_vob.length);
						return dSum_vob;
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	AverageEx_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '计算平均值',
			'abstract': '计算平均值',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"AverageEx": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 1
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					//44197
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array',
							'float')
						if (!res.isSuccess) {
							return res.message
						}

						let dataArr = res.data;
						let length = dataArr.length
						if (length < minCount) {
							return _this.empty
						}

						let {
							isSuccess,
							sum,
							count,
							message
						} = _this.calculation.count(luckysheet_calcADPMM, dataArr)
						if (!isSuccess) {
							return message
						}
						if (count == 0) {
							return _this.empty;
						}
						return luckysheet_calcADPMM(sum, "/", count); // sum / count;
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	AverageExU_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '计算平均值',
			'abstract': '计算平均值',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"AverageExU": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 16
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					//44197
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array',
							'float')
						if (!res.isSuccess) {
							return res.message
						}

						let dataArr = res.data;
						let length = dataArr.length
						if (length < minCount) {
							return _this.empty
						}

						let dSum_vob = 0;
						dataArr = _this.calculation.BubbleSort(dataArr);
						for (let I = 3; I <= 12; I++) {
							dSum_vob = dSum_vob + dataArr[I];
						}
						let dAvg_vob = dSum_vob / 10;
						return dAvg_vob;
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	AverageExMaxMin_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '去掉最大最小求平均',
			'abstract': '去掉最大最小求平均',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"AverageExMaxMin": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 6
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					//44197
					try {

						// if (arguments && arguments[0] && arguments[0].data && arguments[0].data.length <
						// 	minCount) {
						// 	return _this.empty
						// }
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array',
							'float')
						if (!res.isSuccess) {
							return res.message
						}

						let dataArr = res.data;
						let length = dataArr.length
						if (length < minCount + 1) {
							return _this.empty
						}
						let tempArr = []
						if (length == minCount + 1) {
							tempArr = dataArr.slice(0, dataArr.length - 1)
						} else {
							tempArr = dataArr
						}
						tempArr = JSON.parse(JSON.stringify(tempArr))
						tempArr = _this.calculation.BubbleSort(tempArr);
						let {
							isSuccess,
							sum,
							count,
							message
						} = _this.calculation.count(luckysheet_calcADPMM, tempArr)
						if (!isSuccess) {
							return message
						}
						if (count == 0) {
							return _this.empty;
						}
						let avg = luckysheet_calcADPMM(sum, "/", count); // sum / count;
						if (length == minCount + 1) {
							let outOfToleranceValue = parseFloat(dataArr[length - 1])
							if ((Math.abs(tempArr[0] - avg) / avg > outOfToleranceValue) || Math.abs(
									tempArr[
										tempArr.length - 1] - avg) / avg >
								outOfToleranceValue) {
								sum = 0
								count = 0
								for (let i = 1; i < tempArr.length - 2; i++) {
									sum = luckysheet_calcADPMM(sum, "+", tempArr[i]);
									count++;
								}
								avg = luckysheet_calcADPMM(sum, "/", count); // sum / count;
							}
						}
						return avg
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	MaxDiameter_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': 'MaxDiameter',
			'abstract': 'MaxDiameter',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"MaxDiameter": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 6
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					//44197
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array',
							'float')
						if (!res.isSuccess) {
							return res.message
						}

						let dataArr = res.data;
						let length = dataArr.length
						if (length < minCount + 1) {
							return _this.empty
						}
						let tempArr = []
						if (length == minCount + 1) {
							tempArr = dataArr.slice(0, dataArr.length - 1)
						} else {
							tempArr = dataArr
						}
						tempArr = JSON.parse(JSON.stringify(tempArr))
						tempArr = _this.calculation.BubbleSort(tempArr);
						let {
							isSuccess,
							sum,
							count,
							message
						} = _this.calculation.count(luckysheet_calcADPMM, tempArr)
						if (!isSuccess) {
							return message
						}
						if (count == 0) {
							return _this.empty;
						}
						let avg = luckysheet_calcADPMM(sum, "/", count); // sum / count;
						if (length == minCount + 1) {
							let outOfToleranceValue = parseFloat(dataArr[length - 1])
							if ((Math.abs(tempArr[0] - avg) / avg > outOfToleranceValue) || Math.abs(
									tempArr[
										tempArr.length - 1] - avg) / avg >
								outOfToleranceValue) {
								sum = 0
								count = 0
								for (let i = 1; i < tempArr.length - 2; i++) {
									sum = luckysheet_calcADPMM(sum, "+", tempArr[i]);
									count++;
								}
								avg = luckysheet_calcADPMM(sum, "/", count); // sum / count;
							}
						}
						return avg
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	AddEx_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '将输入的可用值相加',
			'abstract': '将输入的可用值相加',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"AddEx": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 1
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					//44197
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array',
							'float')
						if (!res.isSuccess) {
							return res.message
						}

						let dataArr = res.data;
						let length = dataArr.length
						if (length < minCount) {
							return _this.empty
						}
						let {
							isSuccess,
							sum,
							count,
							message
						} = _this.calculation.count(luckysheet_calcADPMM, dataArr)
						if (!isSuccess) {
							return message
						}
						if (count == 0) {
							return _this.empty;
						}
						//let avg = luckysheet_calcADPMM(sum, "/", count); // sum / count;

						return sum
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	SubEx_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '将输入的可用值相减',
			'abstract': '将输入的可用值相减',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"SubEx": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 1
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					//44197
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array',
							'float')
						if (!res.isSuccess) {
							return res.message
						}

						let dataArr = res.data;
						let length = dataArr.length
						if (length < minCount) {
							return _this.empty
						}
						let {
							isSuccess,
							reduce,
							count,
							message
						} = _this.calculation.reduce(luckysheet_calcADPMM, dataArr)
						if (!isSuccess) {
							return message
						}
						if (count == 0) {
							return _this.empty;
						}
						//let avg = luckysheet_calcADPMM(sum, "/", count); // sum / count;

						return reduce
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	FindEx_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '从值2中查找值1所在的位置',
			'abstract': '从值2中查找值1所在的位置',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"FindEx": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 2
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					//44197
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						if (length < minCount) {
							return ''
						}
						return dataArr[1].indexOf(dataArr[0]);
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return ''
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	MaxEx_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '获取最大值',
			'abstract': '获取最大值',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"MaxEx": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 1
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					//44197
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array', 'float')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						if (length < minCount) {
							return _this.empty
						}
						let max = _this.calculation.GetMax(dataArr)
						return max
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	MinEx_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '获取最小值',
			'abstract': '获取最小值',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"MinEx": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 1
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					//44197
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array', 'float')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						if (length < minCount) {
							return _this.empty
						}
						let min = _this.calculation.GetMin(dataArr)
						if (min < 0) {
							min = 0
						}
						return min
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	CF_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': '获取最小值',
			'abstract': '获取最小值',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"CF": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 1
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					//44197
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						if (length < minCount) {
							return '0'
						}
						if (_this.luckysheetApi.isRealNum(dataArr[0])) {
							return dataArr[0]
						}
						return '0'
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return '0'
						// return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	ComputeLost_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': 'ComputeLost',
			'abstract': 'ComputeLost',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"ComputeLost": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 1
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					//44197
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array', 'float')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						if (length < minCount) {
							return _this.empty;
						}
						let {
							isSuccess,
							reduce,
							count,
							message
						} = _this.calculation.reduce(luckysheet_calcADPMM, dataArr)
						if (!isSuccess) {
							return message
						}
						if (reduce == 0) {
							return _this.empty;
						}
						return reduce
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	MedianEx_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': 'MedianEx',
			'abstract': 'MedianEx',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"MedianEx": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 1
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					//44197
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array', 'float')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						if (length < minCount) {
							return _this.empty;
						}
						let middle = _this.calculation.GetMiddle(dataArr)
						return middle;
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	DistEx1_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': 'DistEx1',
			'abstract': 'DistEx1',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"DistEx1": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 2
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					//44197
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						if (length < minCount) {
							return _this.empty;
						}
						let dSum_vob = 0;
						let dAvg_vob = 0;
						let dValue_vob = new Array();
						for (let i = 0; i < length; i++) {
							let P1_vob = dataArr[i];
							if (_this.luckysheetApi.isRealNum(P1_vob)) {
								P1_vob = parseFloat(P1_vob)
								dValue_vob.push(P1_vob);
								dSum_vob = dSum_vob + P1_vob;
							}
						}
						if (dataArr.length > 0) {
							dAvg_vob = dSum_vob / dataArr.length;
						}
						dSum_vob = 0;
						for (let i = 0; i < dValue_vob.length; i++) {
							dSum_vob = dSum_vob + (dValue_vob[i] - dAvg_vob) * (dValue_vob[i] - dAvg_vob);
						}
						dSum_vob = Math.sqrt(dSum_vob / dValue_vob.length);
						return dSum_vob;
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	GetSampleHeight_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': 'GetSampleHeight',
			'abstract': 'GetSampleHeight',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"GetSampleHeight": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 1
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					//44197
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length
						if (length < minCount) {
							return '';
						}
						let sSize_vob = "",
							dL1_vob = 0,
							dL2_vob = 0,
							dArea_vob = 0;
						let slTemp_vob = new Array();
						sSize_vob = dataArr[0];
						slTemp_vob = sSize_vob.split(_this.x);
						if (slTemp_vob.length <= 2) {
							slTemp_vob = sSize_vob.split('x');
						}
						if (slTemp_vob.length >= 2) {
							if (slTemp_vob[0].substr(0, 1) == _this.phi) {
								if (!isNaN(parseFloat(slTemp_vob[2]))) {
									dL1_vob = parseFloat(slTemp_vob[2]);
									return dL1_vob
								}
							} else if ((!isNaN(parseFloat(slTemp_vob[2]))) && (parseFloat(slTemp_vob[2]))) {
								dL1_vob = parseFloat(slTemp_vob[2]);
								return dL1_vob
							}
						} else {
							return '';
						}
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return '';
						//return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
	GetSampleWidth_fob() {
		let _this = this
		let sTemp = this.formulaTipsConvert({
			'type': 1,
			'desc': 'GetSampleWidth',
			'abstract': 'GetSampleWidth',
			'range': [1, 255],
			'param': [{
				'name': '值1',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}, {
				'name': '值2',
				'detail': '',
				'example': 'A2:A100',
				'require': 'm',
				'repeat': 'n',
				'type': 'rangeall'
			}]
		})
		let formula = {
			"GetSampleWidth": {
				tips: sTemp,
				formula: function(selectInfo, callee) {
					let fixedNum = 5
					let minCount = 1
					let tips = undefined
					//传递参数检测
					tips = _this.argumentsCoutCheck(this, arguments)
					if (tips) {
						return tips
					}
					//44197
					try {
						//获取单元格中的数据
						let res = _this.calculation.GetData(this, arguments, 'text', true, 'array')
						if (!res.isSuccess) {
							return res.message
						}
						let dataArr = res.data;
						let length = dataArr.length

						if (length < minCount) {
							return '';
						}
						let sSize_vob = "",
							dL1_vob = 0,
							dL2_vob = 0,
							dArea_vob = 0;
						let slTemp_vob = new Array();
						sSize_vob = dataArr[0];
						slTemp_vob = sSize_vob.split(_this.x);
						if (slTemp_vob.length <= 2) {
							slTemp_vob = sSize_vob.split('x');
						}
						if (slTemp_vob.length >= 2) {
							if (slTemp_vob[0].substr(0, 1) == _this.phi) {
								if (!isNaN(parseFloat(slTemp_vob[1]))) {
									dL1_vob = parseFloat(slTemp_vob[1]);
									return dL1_vob
								}
							} else if ((!isNaN(parseFloat(slTemp_vob[1]))) && (parseFloat(slTemp_vob[1]))) {
								dL1_vob = parseFloat(slTemp_vob[1]);
								return dL1_vob
							}
						} else {
							return '';
						}
					} catch (e) {
						console.log(e)
						let err = e;
						err = _this.luckysheetApi.formula.errorInfo(err);
						return '';
						//return [_this.luckysheetApi.formula.error.v, err];
					}
				},
			}
		}
		return formula
	}
}

class Calculation {
	outOfRange = '-'
	empty = '/'
	outOfRange = '-'
	empty = '/'
	phi = 'Φ'
	x = '×'
	tipsType = 1
	constructor(luckysheet, outOfRange, empty) {
		if (!luckysheet) {
			luckysheet = window.luckysheet
		}
		this.luckysheet = luckysheet
		if (outOfRange) {
			this.outOfRange = outOfRange
		}
		if (empty) {
			this.empty = empty
		}
		this.initLucksheetInsideVariable()
	}
	initLucksheetInsideVariable() {
		try {
			if (!this.luckysheet) {
				return undefined
			}
			this.luckysheetApi = new luckysheetApi(this.luckysheet)
			this.format = new format(this.luckysheet)
			return 1
		} catch (e) {
			console.log(e)
		}
		return 0
	}
	//检测数据类型是否错误
	IsError(type, value) {
		let _this = this
		let tips = undefined
		switch (type) {
			case 'number':
			default:
				if (_this.luckysheetApi.valueIsError(value)) {
					tips = undefined;
				} else if (!_this.luckysheetApi.isRealNum(value)) {
					tips = _this.luckysheetApi.formula.error.v;
					tips = _this.empty
				}
				break
		}
		return tips
	}
	tipsShow(type, message) {
		if (!type) {
			type = this.tipsType
		}
		switch (message) {
			case this.outOfRange:
				message = '有-的数据栏位,数据偏差大,请重做试验'
				break
			case this.empty:
				message = '有-的数据栏位,数据偏差大,请重做试验'
				break
		}
		switch (type) {

		}
	}
	/*
	{isSuccess:true/false,message:string,data:object}
	*/
	GetData(formulaThis, formulaArguments, nullCellType, isNeglectNullCell, type, calltype, Option) {
		let _this = this
		let isSuccess = true
		let message = ''
		let dataArr = []
		let tempArr = []
		try {
			for (let i = 0; i < formulaArguments.length; i++) {
				let data = formulaArguments[i];

				if (_this.luckysheetApi.getObjType(data) == "array") {
					if (_this.luckysheetApi.getObjType(data[0]) == "array") {
						if (!_this.luckysheetApi.func_methods.isDyadicArr(data)) {
							isSuccess = false
							message = _this.empty
							//message = _this.luckysheetApi.formula.error.v
							break
						}

						dataArr = dataArr.concat(_this.luckysheetApi.func_methods.getDataArr(data, true));
					} else {
						dataArr = dataArr.concat(data);
					}
				} else if (_this.luckysheetApi.getObjType(data) == "object" && data.startCell != null) {
					dataArr = dataArr.concat(_this.luckysheetApi.func_methods.getCellDataArr(data, nullCellType,
						false));
				} else {
					dataArr.push(data);
				}
			}
			if (!calltype) {
				calltype = 'default'
			}

			switch (calltype) {
				case 'number':
					tempArr = []
					dataArr.forEach((e) => {
						if (e && !_this.IsError('number', e)) {
							tempArr.push(Number(e))
						}
					})
					break
				case 'float':
					tempArr = []
					dataArr.forEach((e) => {
						if (e && !_this.IsError('number', e)) {
							tempArr.push(parseFloat(e))
						}
					})
					break
				case 'string':
					tempArr = []
					dataArr.forEach((e) => {
						if (e) {
							tempArr.push(e.toString())
						}
					})
					break
				case 'time':
					break
				case 'date':
					if (!Option) {
						Option = {};
					}
					if (!Option.format) {
						Option.format = 'yyyy-MM-dd';
					}
					tempArr = []
					dataArr.forEach((e) => {
						if (e) {
							tempArr.push(_this.format.formatValue(Option.format, e))
						}
					})
					break
				case 'datetime':
					if (!Option) {
						Option = {};
					}
					if (!Option.format) {
						Option.format = 'yyyy-MM-dd HH:ss:mm';
					}
					tempArr = []
					dataArr.forEach((e) => {
						if (e) {
							tempArr.push(_this.format.formatValue(Option.format, e))
						}
					})
					break
				case 'default':

				default:
					tempArr = dataArr
					break
			}
			dataArr = tempArr

			let result = {
				isSuccess: isSuccess,
				message: message,
				data: []
			}
			switch (type) {
				case 'array':
				default:
					result.data = dataArr
					break
			}
			return result
		} catch (e) {
			console.log(e)
		}

	}
	calcADPMM(luckysheet_calcADPMM, dataArr, outOfToleranceValue, outOfToleranceType, Option) {
		let defaultOption = {
			IsErrorType: 0,
			calculation: '+'
		}
		if (!Option) {
			Option = {}
		}
		Option = Object.assign(defaultOption, Option)
		let tips = undefined
		let length = dataArr.length
		let result = 0
		let count = 0
		let isSuccess = true

		for (let i = 0; i < length; i++) {
			tips = undefined
			let num = dataArr[i]
			tips = this.IsError('number', num)
			if (tips) {
				let isBreak = true
				switch (Option.IsErrorType) {
					case 0:
					default:
						tips = this.empty
						isSuccess = false
						isBreak = true
						break
				}
				if (isBreak) {
					break
				}
			}
			if (outOfToleranceValue && num > outOfToleranceValue) {
				switch (outOfToleranceType) {
					default:
						continue
				}
			}
			result = luckysheet_calcADPMM(result, Option.calculation, num); // parseFloat(dataArr[i]);
			count++;
		}
		let oResult = {
			isSuccess: isSuccess,
			result: result,
			count: count,
			message: tips
		}
		return oResult
	}
	reduce(luckysheet_calcADPMM, dataArr, outOfToleranceValue, outOfToleranceType) {
		let res = this.calcADPMM(luckysheet_calcADPMM, dataArr, outOfToleranceValue, outOfToleranceType, {
			IsErrorType: 0,
			calculation: '-'
		});
		let result = {
			isSuccess: res.isSuccess,
			reduce: res.result,
			count: res.count,
			message: res.tips
		}
		return result
	}
	count(luckysheet_calcADPMM, dataArr, outOfToleranceValue, outOfToleranceType) {
		let res = this.calcADPMM(luckysheet_calcADPMM, dataArr, outOfToleranceValue, outOfToleranceType, {
			IsErrorType: 0,
			calculation: '+'
		});
		// for (let i = 0; i < length; i++) {
		// 	tips = undefined
		// 	let num = dataArr[i]
		// 	tips = this.IsError('number', num)
		// 	if (tips) {
		// 		tips = this.empty
		// 		isSuccess = false
		// 		break
		// 	}
		// 	if (outOfToleranceValue && num > outOfToleranceValue) {
		// 		switch (outOfToleranceType) {
		// 			default:
		// 				continue
		// 		}
		// 	}
		// 	sum = luckysheet_calcADPMM(sum, "+", num); // parseFloat(dataArr[i]);
		// 	count++;
		// }

		// let result = {
		// 	isSuccess: isSuccess,
		// 	sum: sum,
		// 	count: count,
		// 	message: tips
		// }
		let result = {
			isSuccess: res.isSuccess,
			sum: res.result,
			count: res.count,
			message: res.tips
		}
		return result
	}
	GetMiddle(dataArr) {
		dataArr = JSON.parse(JSON.stringify(dataArr))
		dataArr = this.BubbleSort(dataArr)
		dataArr.sort()
		if (dataArr.length % 2 == 0) {
			return Number(dataArr[dataArr.length / 2 - 1] + dataArr[dataArr.length / 2]) / 2;
		} else {
			return Number(dataArr[Math.floor(dataArr.length / 2)]);
		}
	}
	GetMin(dataArr) {
		let min = Number.MAX_VALUE
		let length = dataArr.length
		for (let i = 0; i < length; i++) {
			let item = Number(dataArr[i])
			if (item < min) {
				min = item
			}
		}
		return min
	}
	GetMax(dataArr) {
		let max = -Number.MAX_VALUE
		let length = dataArr.length
		for (let i = 0; i < length; i++) {
			let item = Number(dataArr[i])
			if (item > max) {
				max = item
			}
		}
		return max
	}
	outOfToleranceMaxMinToMiddle(dataArr, outOfToleranceValue, fixedNum) {
		let min = this.GetMin(dataArr)
		let max = this.GetMax(dataArr)
		let middle = this.GetMiddle(dataArr)
		let fixedNumTypeOf = typeof fixedNum
		let num = 0;
		let diff = 0
		diff = Math.abs(min - middle)
		if (fixedNumTypeOf != 'undefined') {
			diff = Number(diff.toFixed(fixedNum))
		}
		if (diff > outOfToleranceValue) {
			num++
		}
		diff = Math.abs(max - middle)
		if (fixedNumTypeOf != 'undefined') {
			diff = Number(diff.toFixed(fixedNum))
		}
		if (diff > outOfToleranceValue) {
			num++
		}
		return {
			isSuccess: true,
			data: num,
			message: ''
		}
	}
	//最大值和最小值差大于阈值
	outOfToleranceMaxMin(dataArr, outOfToleranceValue, fixedNum) {
		let length = dataArr.length
		let diff = undefined
		let fixedNumTypeOf = typeof fixedNum
		let tips = this.IsError('number', outOfToleranceValue)
		let isSuccess = true
		if (tips) {
			return {
				isSuccess: isSuccess,
				data: [],
				message: tips
			}
		}
		let min = this.GetMin(dataArr)
		let max = this.GetMax(dataArr)
		diff = Math.abs(max - min)
		if (fixedNumTypeOf != 'undefined') {
			diff = Number(diff.toFixed(fixedNum))
		}
		if (diff > outOfToleranceValue) {
			isSuccess = false
			tips = this.outOfRange
		}
		return {
			isSuccess: isSuccess,
			data: [],
			message: tips
		}
	}
	//最大值和最小值差大于阈值
	outOfToleranceRatioMaxMin(dataArr, outOfToleranceValue, fixedNum, avg) {
		let length = dataArr.length
		let diff = undefined
		let fixedNumTypeOf = typeof fixedNum
		let tips = this.IsError('number', outOfToleranceValue)
		let isSuccess = true
		if (tips) {
			return {
				isSuccess: isSuccess,
				data: [],
				message: tips
			}
		}
		let min = this.GetMin(dataArr)
		let max = this.GetMax(dataArr)
		diff = Math.abs(max - min)
		if (fixedNumTypeOf != 'undefined') {
			diff = Number(diff.toFixed(fixedNum))
		}
		if (diff > outOfToleranceValue * avg) {
			isSuccess = false
			tips = this.outOfRange
		}
		return {
			isSuccess: isSuccess,
			data: [],
			message: tips
		}
	}
	//两值之差与中值差大于阀值的数量
	outOfToleranceMiddleNum(dataArr, fixedNum) {
		let length = dataArr.length
		let diff = undefined
		let fixedNumTypeOf = typeof fixedNum
		let outOfToleranceNum = 0
		let tips = this.IsError('number', outOfToleranceValue)
		let isSuccess = true
		if (tips) {
			return {
				isSuccess: isSuccess,
				data: outOfToleranceNum,
				message: tips
			}
		}
		let Middle = this.GetMiddle(dataArr)
		for (let i = 0; i < length; i++) {
			let one = Number(dataArr[i])
			diff = Math.abs(one - Middle)
			if (fixedNumTypeOf != 'undefined') {
				diff = Number(diff.toFixed(fixedNum))
			}
			if (diff > outOfToleranceValue) {
				outOfToleranceNum++
			}
		}
		return {
			isSuccess: isSuccess,
			data: outOfToleranceNum,
			Middle: Middle,
			message: ''
		}
	}
	//两值之差与最小值之比大于阀值
	outOfToleranceRatioWithMin(dataArr, outOfToleranceValue, fixedNum) {
		try {
			let length = dataArr.length
			let diff = undefined
			let fixedNumTypeOf = typeof fixedNum
			let tips = this.IsError('number', outOfToleranceValue)
			if (tips) {
				return tips
			}
			let min = this.GetMin(dataArr)
			for (let i = 0; i < length; i++) {
				for (let j = 0; j < length; j++) {
					let one = Number(dataArr[i])
					let two = Number(dataArr[j])
					diff = Math.abs(one - two) / min
					if (fixedNumTypeOf != 'undefined') {
						diff = Number(diff.toFixed(fixedNum))
					}
					if (diff > outOfToleranceValue) {
						this.tipsShow(undefined, this.outOfRange)
						return this.outOfRange
					}
				}
			}
			return false
		} catch (e) {
			console.log(e)
		}
	}
	//两值之差与均值之比大于阀值
	outOfToleranceRatioWithAvg(dataArr, outOfToleranceValue, avg, fixedNum) {
		try {
			let length = dataArr.length
			let diff = undefined
			let fixedNumTypeOf = typeof fixedNum
			let tips = this.IsError('number', outOfToleranceValue)
			if (tips) {
				return tips
			}
			avg = Number(avg)
			for (let i = 0; i < length; i++) {
				for (let j = 0; j < length; j++) {
					let one = Number(dataArr[i])
					let two = Number(dataArr[j])
					diff = Math.abs(one - two) / avg
					if (fixedNumTypeOf != 'undefined') {
						diff = Number(diff.toFixed(fixedNum))
					}
					if (diff > outOfToleranceValue) {
						this.tipsShow(undefined, this.outOfRange)
						return this.outOfRange
					}
				}
			}
			return false
		} catch (e) {
			console.log(e)
		}
	}
	//当两个数值的差制值超过阀值时
	outOfTolerance(dataArr, outOfToleranceValue, fixedNum) {
		try {
			let length = dataArr.length
			let diff = undefined
			let fixedNumTypeOf = typeof fixedNum
			let tips = this.IsError('number', outOfToleranceValue)
			if (tips) {
				return tips
			}
			for (let i = 0; i < length; i++) {
				for (let j = 0; j < length; j++) {
					let one = Number(dataArr[i])
					let two = Number(dataArr[j])
					diff = Math.abs(one - two)
					if (fixedNumTypeOf != 'undefined') {
						diff = Number(diff.toFixed(fixedNum))
					}
					if (diff > outOfToleranceValue) {
						this.tipsShow(undefined, this.outOfRange)
						return this.outOfRange
					}
				}
			}
			return false
		} catch (e) {
			console.log(e)
		}

	}
	RoundToEx(aValue_vob, dUnit_vob, nScale_vob) {
		let sValue_vob;
		let dValue_vob;
		let dResult_vob;
		let nPointPos;
		let n;
		if (dUnit_vob < 1 && nScale_vob >= 0) {
			nScale_vob = nScale_vob - 1;
		}
		if (nScale_vob >= 0) {
			n = (Math.round(nScale_vob) + 10);
			aValue_vob = aValue_vob.toFixed(n);
		}
		dValue_vob = aValue_vob / dUnit_vob;
		dValue_vob = Math.abs(dValue_vob) * Math.pow(10, nScale_vob);
		sValue_vob = dValue_vob.toString();
		//for (var i = 0; i < n; i++) {
		//	sValue_vob += "0";
		//}

		nPointPos = sValue_vob.indexOf(".");
		dResult_vob = dValue_vob;
		if (nPointPos >= 0) {

			if (sValue_vob[nPointPos + 1] > "5") {
				dResult_vob = parseInt(dValue_vob) + 1;
			} else if (sValue_vob[nPointPos + 1] == "5") {
				if ((nPointPos + 2) > sValue_vob.length - 1) {
					n = sValue_vob.charCodeAt(nPointPos - 1) - 48;
					if (n % 2 == 0) {
						dResult_vob = parseInt(dValue_vob);
					} else {
						dResult_vob = parseInt(dValue_vob) + 1;
					}
				} else {
					dResult_vob = parseInt(dValue_vob) + 1;
				}
			} else {
				dResult_vob = parseInt(dValue_vob);
			}
		}
		var sign_vob = aValue_vob < 0 ? -1 : 1;
		var Result_vob = dResult_vob * sign_vob / Math.pow(10, nScale_vob);
		Result_vob = Result_vob * dUnit_vob;
		return Result_vob;
	}
	BubbleSort(dValue_vob) {
		var temp_vob = 0;
		for (var i = 0; i < dValue_vob.length - 1; i++) {
			dValue_vob[i] = parseFloat(dValue_vob[i])
		}
		for (var i = 0; i < dValue_vob.length - 1; i++) {
			for (var j = 0; j < dValue_vob.length - 1; j++) {
				if (dValue_vob[j] > dValue_vob[j + 1]) {
					temp_vob = dValue_vob[j];
					dValue_vob[j] = dValue_vob[j + 1];
					dValue_vob[j + 1] = temp_vob;
				}
			}
		}
		return dValue_vob;
	}
}
class format {
	constructor(luckysheet, option) {
		if (!luckysheet) {
			luckysheet = window.luckysheet
		}
		this.luckysheet = luckysheet
		this.initLucksheetInsideVariable()
	}
	initLucksheetInsideVariable() {
		try {
			if (!this.luckysheet) {
				return undefined
			}
			this.luckysheetApi = new luckysheetApi(this.luckysheet)
			return 1
		} catch (e) {
			console.log(e)
		}
		return 0
	}
	formatValue(fmt, v) {
		return this.luckysheetApi.update(fmt, v);
	}
}
class luckysheetApi {
	constructor(luckysheet) {
		if (!luckysheet) {
			luckysheet = window.luckysheet
		}
		this.luckysheet = luckysheet
		this.initLucksheetInsideVariable()
	}
	initLucksheetInsideVariable() {
		try {
			if (!this.luckysheet) {
				return undefined
			}
			let luckysheet = this.luckysheet
			let formula = luckysheet.getInsideVariable('formula')
			let func_methods = luckysheet.getInsideVariable('func_methods')
			let {
				isRealNum,
				isRealNull,
				valueIsError,
				error
			} = luckysheet.getInsideVariable('validate')
			let {
				getObjType,
				ABCatNum,
				chatatABC,
				numFormat
			} = luckysheet.getInsideVariable('util')
			let {
				update,
				datenum_local
			} = luckysheet.getInsideVariable('format')
			this.formula = formula
			this.func_methods = func_methods
			this.isRealNum = isRealNum
			this.isRealNull = isRealNull
			this.valueIsError = valueIsError
			this.error = error
			this.getObjType = getObjType
			this.ABCatNum = ABCatNum
			this.chatatABC = chatatABC
			this.numFormat = numFormat
			this.update = update
			this.datenum_local = datenum_local
			return 1
		} catch (e) {
			console.log(e)
		}
		return 0
	}
}
// export default {
// 	Customformula,
// 	luckysheetApi,
// 	Calculation
// }
