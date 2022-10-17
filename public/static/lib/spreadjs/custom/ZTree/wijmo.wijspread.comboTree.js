(function (window, $) {
    "use strict";;
    var ComboTreeCellType = function (option) {
        this.defaultOption = {
            split: ';',
            checkbox: true,
            label: 'name',
            value: 'value',
            style: {
                width: 'auto'
            }

        }
        ComboTreeCellType.treeID = 0;
        this.option = $.extend({}, JSON.parse(JSON.stringify(this.defaultOption)), option);
    };
    ComboTreeCellType.prototype = new GrapeCity.UI.ComboBoxCellType();
    ComboTreeCellType.prototype.selected = function () {
        let self = this
        let split = self.option.split;
        let label = self.option.label;
        let value_name = self.option.value;
        let treeObj = $.fn.zTree.getZTreeObj(self.treeID)
        let selected = treeObj.getCheckedNodes(true);
        let length = selected.length
        let result = {
            name: '',
            value: ''
        }
        for (let i = 0; i < length; i++) {
            result.name += selected[i][label] + split;
            result.value += selected[i][value_name] + split
        }
        if (result.name.length > 0) {
            result.name = result.name.substring(0, result.name.length - 1);
        }
        if (result.value.length > 0) {
            result.value = result.value.substring(0, result.value.length - 1);
        }
        return result
    }
    ComboTreeCellType.prototype.createEditorElement = function (context) {
        var self = this,
            sheet = context.sheet;

        self.treeID = "tree" + ComboTreeCellType.treeID++;

        let style = ''
        for (let key in this.option.style) {
            style = style + key + ':' + this.option.style[key] + ';'
        }
        var zTree = $('<ul class="ztree" id="' + self.treeID + '"style="' + style + '"></ul>');

        function filter(node) { //过滤器直选中2级节点累加
            return (node.level == 2 && node.checked == true);
        }
        let check = {
            chkStyle: "radio",
            enable: true,
            radioType: "all"
        };
        if (self.option.checkbox) {
            check = {
                chkStyle: "checkbox",
                enable: true
            }
        }
        let setting = {
            treeId: self.treeID,
            check: check,
            callback: {
                onCheck: function (event, treeId, treeNode) {
                    let result = self.selected()
                    sheet.setValue(context.row, context.col, result.name);
                },
                onClick: function (data, treeId, treeNode) {
                    self.selectedNode = treeNode;
                    sheet.endEdit();
                }
            }
        };
        $.fn.zTree.init(zTree, setting, this.items());
        var editor = $(
            '<div gcUIElement="ComboTree" style="background-color:white;max-height:400px;border-style:solid;border-width:thin;border-color:black;overflow:auto"></div>'
        );
        editor.append(zTree);
        editor[0].comboBox = zTree[0];
        return editor[0];
    }
    ComboTreeCellType.prototype.onItemSelect = function (data, treeId, treeNode) { }
    ComboTreeCellType.prototype.getEditorValue = function (editorContext, context) {
        let result = this.selected()
        return result.name

        // return "";
        // if (this.option.checkbox) {
        //     let result = this.selected()
        //     return result.name
        // } else {
        // var zTree = editorContext;
        // if (this.selectedNode) {
        //     return this.selectedNode.name;
        // }
        // }

    }
    ComboTreeCellType.prototype.setEditorValue = function (editorContext, value, context) {
        var treeObj = $.fn.zTree.getZTreeObj(this.treeID);
        var nodes = treeObj.getNodes();
        let node = null;
        let length = null;
        if (value) {
            if (this.option.checkbox) {
                let array = value.split(this.option.split)
                length = array.length
                for (let i = 0; i < length; i++) {
                    node = this.findNode(nodes, array[i]);
                    if (node) {
                        treeObj.checkNode(node, true);
                        this.selectedNode = node;
                    }
                }
            } else {
                node = this.findNode(nodes, value);
                if (node) {
                    treeObj.selectNode(node);
                    treeObj.checkNode(node, true);
                    this.selectedNode = node;
                } else {
                    treeObj.selectNode(null);
                }
            }

        } else {
            treeObj.selectNode(null);
        }
    }

    ComboTreeCellType.prototype.findNode = function (nodes, name) {
        let self = this
        let split = self.option.split;
        let label = self.option.label;
        let value_name = self.option.value;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i][label] === name) {
                return nodes[i];
            }
            if (nodes[i].children && nodes[i].children.length > 0) {
                var node = this.findNode(nodes[i].children, name);
                if (node) {
                    return node;
                }
            }
        }
        return null;
    }

    ComboTreeCellType.prototype.focus = function (editorContext, context) { }
    ComboTreeCellType.prototype.selectAll = function (editorContext, context) { };
    ComboTreeCellType.prototype.style = function (editorContext, cellStyle, cellRect, context) {
        var editor = editorContext;
        var sheet = editorContext.sheet;
        if (!sheet) {
            sheet = context.sheet
        }
        var $editor = $(editor);
        var offset = sheet._eventHandler._getCanvasOffset();
        var originalTop = offset.top + sheet._bounds.y + cellRect.y - 1 + cellRect.height;
        var originalLeft = offset.left + sheet._bounds.x + cellRect.x - 1;
        let maxHeight = document.documentElement.clientHeight - originalTop - 10;

        $editor.css(cssTop, originalTop);
        $editor.css(cssLeft, originalLeft);
        $editor.css(cssBoxSizing, "content-box");
        $editor.css(cssBorder, "1px solid black");
        $editor.css(cssOutline, cssNone);
        $editor.css(cssPositoin, 'fixed');
        $editor.css(cssMaxHeight, maxHeight);
    }
    ComboTreeCellType.prototype.height = function (editorContext, cellStyle, cellRect, context) {
        var editor = editorContext;
        var sheet = editorContext.sheet;
        if (!sheet) {
            sheet = context.sheet
        }
        var $editor = $(editor);
        let oldheight = $editor.height();

        var offset = sheet._eventHandler._getCanvasOffset();
        let maxHeightExpect = document.documentElement.clientHeight;
        $editor.css(cssMaxHeight, maxHeightExpect);
        let height = $editor.height();
        let Top = parseFloat($editor.css(cssTop));
        let minHeightExpect = 50;
        let ratio = 2;
        if (oldheight < 0) {
            oldheight = 50;
        }
        //let maxPrc = 100 / ratio;
        //console.log(document.documentElement.clientHeight, Top, height)
        if (document.documentElement.clientHeight - Top - height < 0) {
            for (let i = 100 / ratio; i > 0; i--) {
                let temp = maxHeightExpect * ratio * i * 0.01;
                if (temp < minHeightExpect) {
                    //console.log('oldheight', oldheight)
                    $editor.css(cssMaxHeight, oldheight);
                    break
                }
                $editor.css(cssMaxHeight, temp);
                let newHeight = $editor.height();
                //计算位于元素上方时的位置
                var originalTop = offset.top + sheet._bounds.y + cellRect.y - 3 - newHeight;
                // console.log('originalTop', originalTop)
                // console.log('newHeight', newHeight)
                if (originalTop >= 0 && newHeight > oldheight) {
                    //console.log('cssMaxHeight', temp)
                    $editor.css(cssTop, originalTop);
                    break;
                }
            }
        } else {
            $editor.css(cssMaxHeight, oldheight);
        }
    }
    ComboTreeCellType.prototype.width = function (editorContext, cellStyle, cellRect, context) {
        //显示后才能获取到宽度
        //当宽度小于单元格宽度的时候和单元格宽度一致
        var $editor = $(editorContext);
        let width = $editor.width();
        if (width < cellRect.width) {
            width = cellRect.width
            $editor.css(cssWidth, width);
        }
        console.log('width', parseFloat($editor.css(cssLeft)))
        if (document.documentElement.clientWidth - parseFloat($editor.css(cssLeft)) - width < 0) {
            $editor.css(cssLeft, undefined);
            $editor.css(cssRight, 0);
        }
        $editor.focus();
    }
    ComboTreeCellType.prototype.activateEditor = function (editorContext, cellStyle, cellRect, context) {
        console.log(editorContext.sheet)
        if (!editorContext || !editorContext.sheet)
            return;
        var editor = editorContext;
        var sheet = editorContext.sheet;
        var $editor = $(editor);
        this.style(editorContext, cellStyle, cellRect, context)
        // var offset = sheet._eventHandler._getCanvasOffset();
        // var originalTop = offset.top + sheet._bounds.y + cellRect.y - 1 + cellRect.height;
        // var originalLeft = offset.left + sheet._bounds.x + cellRect.x - 1;

        // $editor.css(cssTop, originalTop);
        // $editor.css(cssLeft, originalLeft);
        // $editor.css(cssBoxSizing, "content-box");
        // $editor.css(cssBorder, "1px solid black");
        // $editor.css(cssOutline, cssNone);
        // $editor.css(cssPositoin, 'fixed');
        //$editor.css(cssWidth, width);
        //this._renderItems(editor, this._items);
        $editor.bind("keydown", function (e) {
            if (e.keyCode === UI.Key.backspace && !e.ctrlKey && !e.shiftKey && !e.altKey)
                UI.cancelDefault(e);
            if (e.ctrlKey || e.shiftKey || e.altKey)
                return;
            if (sheet.isEditing() && sheet.editorStatus() === UI.EditorStatus.Enter)
                if (e.which === UI.Key.left) {
                    e.preventDefault();
                    sheet.endEdit();
                    UI.SpreadActions.navigationLeft.apply(sheet)
                }
                else if (e.which === UI.Key.right) {
                    e.preventDefault();
                    sheet.endEdit();
                    UI.SpreadActions.navigationRight.apply(sheet)
                }
        });
        if (context && context.sheet && context.sheet.parent && context.sheet.parent._host) {
            $(context.sheet.parent._host).append($editor);
        } else {
            document.body.insertBefore(editor, null);
        }
        //显示后才能获取到宽度
        //当宽度小于单元格宽度的时候和单元格宽度一致
        // let width = $editor.width()
        // if (width < cellRect.width) {
        //     width = cellRect.width
        //     $editor.css(cssWidth, width);
        // }
        // $editor.focus();
        this.width(editorContext, cellStyle, cellRect, context);
        this.height(editorContext, cellStyle, cellRect, context);
        this._hasInPlaceEditor = true
    };
    ComboTreeCellType.prototype.deactivateEditor = function (editorContext, context) {

        if (editorContext) {
            var editor = editorContext;
            $(editor).unbind("keydown");
            $.fn.zTree.destroy(this.treeID);
            $(editor).remove()
        }
        this._hasInPlaceEditor = false;
        if (editorContext && editorContext.sheet)
            editorContext.sheet.repaint()
    };
    ComboTreeCellType.prototype.updateEditor = function (editorContext, cellStyle, cellRect, context) {
        var sheet = editorContext && context && context.sheet;
        if (!sheet) {
            return;
        }
        var comboBox = editorContext.comboBox;
        if (cellStyle && comboBox) {
            var render = sheet._render;
            // 将 Cell 样式设置给Combo
        }
        if (cellRect && comboBox) {
            var offset = $(editorContext.parentNode).position();

            this.updateBounds(editorContext, offset.left + cellRect.x - 1, offset.top + cellRect.y + cellRect
                .height - 1, cellRect.width + 1, cellRect.height + 1);
        }
    };
    ComboTreeCellType.prototype.updateBounds = function (editorContext, x, y, width, height) {
        $(editorContext).css("left", x);
        $(editorContext).css("top", y);
        $(editorContext).css("width", 140);
        $(editorContext).css("height", 200);
    }
    ComboTreeCellType.prototype.format = function (value, format, conditionalForeColor, context) {
        if (!value) {
            return "";
        }
        var self = this,
            editorValueType = self._editorValueType,
            items = self._items;
        if (items) {
            var count = items.length;
            if (editorValueType === 0 /* Text */) { } else if (editorValueType === 1 /* Index */) {
                var index = parseInt(value);
                if (0 <= index && index < count) {
                    var item = items[index];
                    if (item !== keyword_undefined && item !== keyword_null) {
                        value = (item.hasOwnProperty("text") ? item.text : item);
                    }
                }
            } else if (editorValueType === 2 /* Value */) {
                for (var i = 0; i < count; i++) {
                    var item = items[i];
                    if (item && item.hasOwnProperty("value") && item.value === value) {
                        value = item.text;
                        break;
                    }
                }
            }
        }
        return GrapeCity.UI.BaseCellType.prototype.format.call(this, value, format, conditionalForeColor);
    };
    ComboTreeCellType.prototype.parse = function (text, formatStr, context) {
        var self = this,
            editorValueType = self._editorValueType,
            items = self._items;
        var parseText = GrapeCity.UI.BaseCellType.prototype.parse.call(this, text, formatStr);
        if (items) {
            var count = items.length;
            if (editorValueType === 0 /* Text */) {
                return parseText;
            } else if (editorValueType === 1 /* Index */) {
                for (var i = 0; i < count; i++) {
                    var item = items[i];
                    if ((item && item.hasOwnProperty("text") && item.text === parseText) || (item ===
                        parseText)) {
                        return i;
                    }
                }
            } else if (editorValueType === 2 /* Value */) {
                for (var i = 0; i < count; i++) {
                    var item = items[i];
                    if ((item && item.hasOwnProperty("text") && item.text === parseText)) {
                        return item.value;
                    }
                }
            }
        }
        return parseText;
    };
    ComboTreeCellType.prototype.getHitInfo = function (x, y, row, col, cellStyle, cellRect, sheetArea, context) {
        if (this._hasInPlaceEditor)
            return null;
        if ((sheetArea === keyword_null || sheetArea === keyword_undefined || sheetArea ===
            3 /* viewport */) && cellRect) {
            var x2 = cellRect.x + cellRect.width;
            var info = {
                x: x,
                y: y,
                row: context.row,
                col: context.col,
                cellStyle: cellStyle,
                cellRect: cellRect,
                sheetArea: sheetArea,
                sheet: undefined
            };
            if (x2 - DefaultDropDownButtonWidth <= x && x < x2) {
                info.isReservedLocation = true;
            }
            return info;
        }
        return keyword_null;
    };
    ComboTreeCellType.prototype.processMouseDown = function (hitInfo) {
        var sheet = hitInfo.sheet,
            sheetArea = hitInfo.sheetArea;
        if (!hitInfo || !hitInfo.sheet || this._hasInPlaceEditor)
            return;
        if (hitInfo.isReservedLocation)
            sheet.startEdit();
        //this._expandItems(hitInfo)
    };
    ComboTreeCellType.prototype._expandItems = function (context, maxVisibleItem) {
        console.log(context, maxVisibleItem)
        if (!context || !context.sheet)
            return;
        if (typeof maxVisibleItem === const_undefined)
            maxVisibleItem = DefaultMaxVisibleItemCount;
        var sheet = context.sheet;
        var row = context.row;
        var col = context.col;
        var cellRect = context.cellRect;
        var sheetArea = context.sheetArea;
        var cellStyle = context.cellStyle;
        var dummy = this.createEditorElement(context);
        var $dummy = $(dummy);

        this.style(dummy, context.cellStyle, context.cellRect, context);
        // var offset = sheet._eventHandler._getCanvasOffset();
        // var originalTop = offset.top + sheet._bounds.y + cellRect.y + cellRect.height;
        // var originalLeft = offset.left + sheet._bounds.x + cellRect.x - 1;
        // $dummy.css(cssTop, originalTop);
        // $dummy.css(cssLeft, originalLeft);
        // $dummy.css(cssBoxSizing, "content-box");
        // $dummy.css(cssWidth, cellRect.width - 2);
        // $dummy.css(cssOutline, cssNone);
        var self = this;
        self.setEditorValue(dummy, sheet.getValue(row, col, sheetArea));
        var closeCallback = function (cancel) {
            console.log(cancel)
            $dummy.unbind("blur");
            $dummy.unbind("click");
            $dummy.unbind("keydown");
            self.deactivateEditor(dummy)
            //document.body.removeChild(dummy);
            //self._hasInPlaceEditor = false;
            if (cancel)
                sheet.repaint(cellRect);
            else {
                var v = self.getEditorValue(dummy);
                var cellEditInfo = {
                    row: row,
                    col: col,
                    newValue: v,
                    autoFormat: false
                };
                var undoAction = new UI.UndoRedo.CellEditUndoAction(sheet, cellEditInfo);
                sheet._doCommand(undoAction)
            }
        };
        $dummy.bind("keydown", function (e) {
            if (e.ctrlKey || e.shiftKey || e.altKey)
                return;
            if (e.which === UI.Key.esc)
                closeCallback(true);
            else if (e.which === UI.Key.enter)
                closeCallback();
            else if (e.which === UI.Key.left) {
                e.preventDefault();
                closeCallback();
                UI.SpreadActions.navigationLeft.apply(sheet)
            } else if (e.which === UI.Key.right) {
                e.preventDefault();
                closeCallback();
                UI.SpreadActions.navigationRight.apply(sheet)
            }
        });
        $dummy.bind("click", function (e) {
            console.log('click', e.target.tagName)
            if (e.target.tagName === "SELECT" || e.target.tagName === "OPTION")
                closeCallback()
        });
        $dummy.bind("blur", function (e) {
            console.log('blur', e.target)
            closeCallback()
        });
        $dummy.find('ul').bind("blur", function (e) {
            console.log('blur', e.target)
            closeCallback()
        });
        if (context && context.sheet && context.sheet.parent && context.sheet.parent._host) {
            $(context.sheet.parent._host).append($dummy);
        } else {
            document.body.insertBefore(editor, null);
        }
        this.width(dummy, context.cellStyle, context.cellRect, context);
        console.log(dummy)
        self._hasInPlaceEditor = true;
        sheet.repaint(cellRect)
    };
    //$.wijmo.wijspread.ComboTreeCellType = ComboTreeCellType;
    var spread = $.wijmo.wijspread,
        UI = GrapeCity.UI;
    spread.ComboTreeCellType = ComboTreeCellType;
})(this, jQuery)
