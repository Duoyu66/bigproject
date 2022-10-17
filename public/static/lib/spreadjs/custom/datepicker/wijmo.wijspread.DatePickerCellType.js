(function (window, $) {
    "use strict";;

    const fitFormat = (formatStr) => {
        let dateFormat = formatStr.replace(/y/g, 'Y');
        dateFormat = dateFormat.replace(/d/g, 'D');
        dateFormat = dateFormat.replace(/h/g, 'H');

        dateFormat = dateFormat.replace(/上午\/下午/g, 'A');
        dateFormat = dateFormat.replace(/上午/g, 'A');
        dateFormat = dateFormat.replace(/下午/g, 'A');

        dateFormat = dateFormat.replace(/AM\/PM/g, 'A');
        dateFormat = dateFormat.replace(/AM/g, 'A');
        dateFormat = dateFormat.replace(/PM/g, 'A');
        dateFormat = dateFormat.replace(/\"/g, '');

        if (dateFormat.includes('A')) {
            dateFormat = dateFormat.replace(/H/g, 'h');
        }
        return dateFormat
    }
    var ns = GrapeCity.UI;
    function DatePickerCellType(option) {
        this.defaultOption = {
            type: 'YYYY-MM-DD',
            isRemoveHour: false,
            style: {
                width: 'auto'
            }
        }
        DatePickerCellType.dateID = 0;
        this.option = $.extend({}, JSON.parse(JSON.stringify(this.defaultOption)), option);
    }
    DatePickerCellType.prototype = new ns.ComboBoxCellType();
    DatePickerCellType.prototype._focusElemisBlur = true;
    DatePickerCellType.prototype.createEditorElement = function (context) {
        //Create input presenter.
        var self = this;
        let style = ''
        for (let key in this.option.style) {
            style = style + key + ':' + this.option.style[key] + ';'
        }
        self.treeID = "date" + DatePickerCellType.dateID++;
        let input = $('<input  id="' + self.treeID + '"/>');
        // if (context && context.sheet && context.sheet.getValue(context.row, context.col)) {
        //     input.val(context.sheet.getValue(context.row, context.col))
        // }
        return input[0]
    };
    DatePickerCellType.prototype.activateEditor = function (editorContext, cellStyle, cellRect, context) {
        //Initialize input editor.
        if (editorContext) {
            let $editor = $(editorContext);
            ns.CustomCellType.prototype.activateEditor.apply(this, arguments);
            $editor.css("position", "absolute");
            //$editor.attr("gcUIElement", "gcEditingInput");
            if (context.sheet.getValue(context.row, context.col)) {
                $editor.val(context.sheet.getValue(context.row, context.col))
            }
            this.createDatepiceker(editorContext, context);
        }
    }
    DatePickerCellType.prototype.listener = function (editorContext, isRemove) {
        if (!editorContext.datepicker) {
            return;
        }
        let datepicker = editorContext.datepicker;
        function children(el, nDeep) {
            if (!el) {
                return;
            }
            if (!nDeep) {
                nDeep = 0
            }

            if (nDeep >= 2) {
                return
            }
            let childrenArray = $(el).children();
            let length = childrenArray.length;

            for (let i = 0; i < length; i++) {
                let item = childrenArray[i];
                if (isRemove) {
                    $(item).unbind("mousedown");
                } else {
                    $(item).on("mousedown", function (e) {
                        datepicker.mousedown = true
                    });
                }
                children(item, nDeep + 1);
            }
        }
        let temp = $(datepicker.rContainer).parent().parent()[0];
        children(temp);
        children(datepicker.timeContainer);
    }
    DatePickerCellType.prototype.createDatepiceker = function (editorContext, context) {
        let self = this
        this.close = false
        let enableTime = false;
        let noCalendar = false;
        let enableSeconds = false;
        let time_24hr = true;
        let hasChineseTime = false;
        let type = this.option.type;
        let dateFormat = fitFormat(type);// fitFormat(type);
        let defaultDate = undefined;
        //let timeFormat = type;
        this.context = context
        if ($(editorContext).val()) {
            if (type.includes('H:i')) {
                //defaultDate = '2021-12-17 ' + $(editorContext).val();
                defaultDate = $(editorContext).val();
            } else {
                defaultDate = dayjs(new Date($(editorContext).val())).format(type);
            }
        }
        if (/[上午下午]/.test(type)) {
            hasChineseTime = true
        }
        if (/[Hhms]/.test(dateFormat)) {
            enableTime = true;
        }
        if (!/[YMD]/.test(dateFormat)) {
            noCalendar = true;
        }
        if (/s/.test(dateFormat)) {
            enableSeconds = true;
        }
        if (/A/.test(dateFormat)) {
            time_24hr = false;
        }
        this.dateFormat = dateFormat;
        let fp = flatpickr('#' + self.treeID, {
            "locale": "zh",
            allowInput: false,
            noCalendar,
            enableSeconds,
            enableTime,
            dateFormat,
            time_24hr,
            clickOpens: false,
            defaultDate: defaultDate,
            onClose(selectedDates, dateStr, instance) {
                let datepicker = this
                datepicker.close = true
                if (selectedDates && selectedDates.length > 0) {
                    context.sheet.setValue(context.row, context.col, instance.formatDate(selectedDates, dateStr));
                }
                $(editorContext).remove();
                setTimeout(() => {
                    self.listener(editorContext, true);
                    datepicker.destroy();
                }, 300);

            },
            parseDate: (datestr, format) => {
                if (type.includes('H:i')) {
                    return datestr
                }
                return dayjs(datestr).toDate();
            },
            formatDate: (date, format, locale) => {
                if (format.includes('H:i')) {
                    format = format.replace('H:i', 'HH:mm');
                }
                if (self.option.isRemoveHour) {
                    format = format.replace('HH:', '');
                }
                if (hasChineseTime) {
                    return dayjs(date).format(format).replace('AM', '上午').replace('PM', '下午')
                }
                //console.log('formatDate', date, format, dayjs(date).format(format));
                return dayjs(date).format(format);
            },
            onChange(selectedDates, dateStr, instance) {
                self.close = true;
                console.log('onChange', selectedDates, dateStr, instance);
                if (selectedDates && selectedDates.length > 0) {
                    context.sheet.setValue(context.row, context.col, instance.formatDate(selectedDates, dateStr));
                }
            }, onReady: function () {
                editorContext.datepicker = this
                self.listener(editorContext);
                if (self.option.isRemoveHour) {
                    //flatpickr-time-separator
                    $(this.timeContainer).find('.numInputWrapper')[0].remove()
                    $(this.timeContainer).find('.flatpickr-time-separator')[0].remove();
                    console.log();
                }
                this.open();

            }
        });
        editorContext.datepicker = fp;
        if (type.includes('H:i')) {
            if (this.option.isRemoveHour) {
                defaultDate = '2021-12-17 12:' + defaultDate;
            } else {
                defaultDate = '2021-12-17 ' + defaultDate;
            }
            //value = '2021-12-17 ' + value;
            fp.setDate(new Date(defaultDate), false)
        } else {
            fp.setDate(defaultDate, true, dateFormat)
        }
        //window.datepicker = fp;
    }
    DatePickerCellType.prototype.deactivateEditor = function (editorContext, context) {
        //Remove input editor when end editor status.
        let self = this;
        if (editorContext) {
            var element = editorContext;
            if (!editorContext.datepicker) {
                $(element).remove();
            }
            let datepicker = editorContext.datepicker
            setTimeout(() => {
                if (datepicker && datepicker.selectedDates.length > 0) {
                    let date = datepicker.formatDate(datepicker.selectedDates[0], self.dateFormat);
                    context.sheet.setValue(context.row, context.col, date);
                }
                if (!datepicker.mousedown) {
                    datepicker.destroy();
                    $(element).remove();
                    self.listener(editorContext, true);
                }
                datepicker.mousedown = false
            }, 300);
        }
        //ns.CustomCellType.prototype.deactivateEditor.apply(this, arguments)
    };
    DatePickerCellType.prototype.setEditorValue = function (editor, value, context) {
        //Sync value from Cell value to editor value.
        let type = this.option.type;
        let dateFormat = fitFormat(type);
        let self = this;
        if (value) {
            $(editor).val(value);
            let index = setInterval(function () {

                if (editor.datepicker) {
                    clearInterval(index);
                    if (type.includes('H:i')) {
                        if (self.option.isRemoveHour) {
                            value = '2021-12-17 12:' + value;
                        } else {
                            value = '2021-12-17 ' + value;
                        }

                        editor.datepicker.setDate(new Date(value), false, type)
                    } else {
                        editor.datepicker.setDate(value, false, dateFormat)
                    }
                    console.log('editor.datepicker', value, dateFormat, type.includes('H:i'));

                }
            })

        } else {
            $(editor).val();
        }

    };
    DatePickerCellType.prototype.getEditorValue = function (editor, context) {
        //Sync value from editor value to cell value.
        let date = '';

        if (editor.datepicker && editor.datepicker.selectedDates.length > 0) {
            console.log('getEditorValue', editor.datepicker.selectedDates);
            date = editor.datepicker.formatDate(editor.datepicker.selectedDates[0], this.dateFormat)
            return date
        }
        if (this.close) {
            return $(editor).val();
        }
        return '';
    };
    DatePickerCellType.prototype.updateEditor = function (editorContext, cellStyle, cellRect, context) {
        if (editorContext) {
            let $editor = $(editorContext);
            $editor.css("width", cellRect.width - 7);
            $editor.css("height", cellRect.height - 3);
        }
    };
    DatePickerCellType.prototype.getHitInfo = function (x, y, row, col, cellStyle, cellRect, sheetArea, context) {
        if (this._hasInPlaceEditor)
            return null;
        if ((sheetArea === keyword_null || sheetArea === keyword_undefined || sheetArea === 3 /* viewport */) && cellRect) {
            var x2 = cellRect.x + cellRect.width;
            var info = { x: x, y: y, row: context.row, col: context.col, cellStyle: cellStyle, cellRect: cellRect, sheetArea: sheetArea, sheet: undefined };
            if (x2 - DefaultDropDownButtonWidth <= x && x < x2) {
                info.isReservedLocation = true;
            }
            return info;
        }
        return keyword_null;
    };
    DatePickerCellType.prototype.processMouseDown = function (hitInfo) {
        var sheet = hitInfo.sheet, sheetArea = hitInfo.sheetArea;
        if (!hitInfo || !hitInfo.sheet || this._hasInPlaceEditor)
            return;
        if (hitInfo.isReservedLocation)
            sheet.startEdit();
        //this._expandItems(hitInfo)
    };
    DatePickerCellType.prototype.focus = function (editorContext,) {

    };
    // DatePickerCellType.prototype.paint = function () {

    // };
    // DatePickerCellType.prototype.processMouseEnter = function () {

    // };
    // DatePickerCellType.prototype.processMouseMove = function () {

    // };
    // DatePickerCellType.prototype.processMouseLeave = function () {

    // };
    // DatePickerCellType.prototype.processMouseUp = function () {

    // };
    // DatePickerCellType.prototype._formatEditorValue = function () {

    // };
    // DatePickerCellType.prototype.isEditingValueChange = function () {

    // };
    DatePickerCellType.prototype._getLocator = function () {
        var span = document.createElement("span");
        $(span).css(cssPositoin, cssAbsolute);
        $(span).css(cssVisibility, cssHidden);
        $(span).css(cssBackgroundColor, "#68E");
        $(span).css(cssMargin, zero);
        $(span).css(cssPadding, "2px");
        $(span).css(cssFont, "normal 12px Arial");
        $(span).css(cssColor, "white");
        $(span).css(cssBorderWidth, zero);
        $(span).attr(cssClass, "gc-input-locator");
        span.setAttribute(cssAttr, "gcEditingLocator");
        return span
    };
    $.wijmo.wijspread.DatePickerCellType = DatePickerCellType
})(this, jQuery)