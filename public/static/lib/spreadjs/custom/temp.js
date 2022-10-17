function ComboBoxCellType()
    {
        this._editorValueType = UI.EditorValueType.Text;
        this._items = null;
        this._hasInPlaceEditor = false
    }
    ComboBoxCellType.prototype = new TextCellType;
    ComboBoxCellType.prototype._basePaintValue = TextCellType.prototype.paintValue;
    ComboBoxCellType.prototype._baseFormat = TextCellType.prototype.format;
    ComboBoxCellType.prototype._baseParse = TextCellType.prototype.parse;
    ComboBoxCellType.prototype._baseDeactivateEditor = TextCellType.prototype.deactivateEditor;
    ComboBoxCellType.prototype.getHitInfo = function(x, y, row, col, cellStyle, cellRect, sheetArea)
    {
        if(this._hasInPlaceEditor)
            return null;
        if(cellRect)
        {
            var x2 = cellRect.x + cellRect.width;
            var info = {
                    x: x,
                    y: y,
                    row: row,
                    col: col,
                    cellStyle: cellStyle,
                    cellRect: cellRect,
                    sheetArea: sheetArea
                };
            if(x2 - DefaultDropDownButtonWidth <= x && x < x2)
                info.isReservedLocation = true;
            return info
        }
        return null
    };
    ComboBoxCellType.prototype.processMouseDown = function(hitInfo)
    {
        if(!hitInfo || !hitInfo.sheet || this._hasInPlaceEditor)
            return;
        if(hitInfo.isReservedLocation)
            this._expandItems(hitInfo)
    };
    ComboBoxCellType.prototype.isReservedKey = function(e)
    {
        if(this._hasInPlaceEditor)
        {
            var modifyKey = e.ctrlKey || e.shiftKey || e.altKey;
            if(!modifyKey && (e.which === UI.Key.enter || e.which === UI.Key.esc || e.which === UI.Key.tab || e.which === UI.Key.left || e.which === UI.Key.right))
                return false;
            return true
        }
        return false
    };
    ComboBoxCellType.prototype._expandItems = function(context, maxVisibleItem)
    {
        if(!context || !context.sheet)
            return;
        if(typeof maxVisibleItem === const_undefined)
            maxVisibleItem = DefaultMaxVisibleItemCount;
        var sheet = context.sheet;
        var row = context.row;
        var col = context.col;
        var cellRect = context.cellRect;
        var sheetArea = context.sheetArea;
        var cellStyle = context.cellStyle;
        var dummy = this.createEditorElement();
        var $dummy = $(dummy);
        var offset = sheet._eventHandler._getCanvasOffset();
        var originalTop = offset.top + sheet._bounds.y + cellRect.y + cellRect.height;
        var originalLeft = offset.left + sheet._bounds.x + cellRect.x - 1;
        $dummy.css(cssTop,originalTop);
        $dummy.css(cssLeft,originalLeft);
        $dummy.css(cssBoxSizing,"content-box");
        $dummy.css(cssWidth,cellRect.width - 2);
        $dummy.css(cssOutline,cssNone);
        if(cellStyle.backColor)
            $dummy.css(cssBackgroundColor,cellStyle.backColor);
        if(cellStyle.foreColor)
            $dummy.css(cssColor,cellStyle.foreColor);
        var font = cellStyle && cellStyle.font ? cellStyle.font : sheet._render._getDefaultFont();
        if(sheet._zoomFactor > 1)
            font = sheet._render._getZoomFont(font);
        $dummy.css(cssFont,font);
        var self = this;
        self._renderItems(dummy,self._items);
        if(dummy.length > maxVisibleItem)
            $dummy.prop("size",maxVisibleItem);
        else
            $dummy.prop("size",Math.max(2,dummy.length));
        self.setEditorValue(dummy,sheet.getValue(row,col,sheetArea));
        var closeCallback = function(cancel)
            {
                $dummy.unbind("blur");
                $dummy.unbind("click");
                $dummy.unbind("keydown");
                document.body.removeChild(dummy);
                self._hasInPlaceEditor = false;
                if(cancel)
                    sheet.repaint(cellRect);
                else
                {
                    var v = self.getEditorValue(dummy);
                    var cellEditInfo = {
                            row: row,
                            col: col,
                            newValue: v,
                            autoFormat: false
                        };
                    var undoAction = new UI.UndoRedo.CellEditUndoAction(sheet,cellEditInfo);
                    sheet._doCommand(undoAction)
                }
            };
        $dummy.bind("keydown",function(e)
        {
            if(e.ctrlKey || e.shiftKey || e.altKey)
                return;
            if(e.which === UI.Key.esc)
                closeCallback(true);
            else if(e.which === UI.Key.enter)
                closeCallback();
            else if(e.which === UI.Key.left)
            {
                e.preventDefault();
                closeCallback();
                UI.SpreadActions.navigationLeft.apply(sheet)
            }
            else if(e.which === UI.Key.right)
            {
                e.preventDefault();
                closeCallback();
                UI.SpreadActions.navigationRight.apply(sheet)
            }
        });
        $dummy.bind("click",function(e)
        {
            if(e.target.tagName === "SELECT" || e.target.tagName === "OPTION")
                closeCallback()
        });
        $dummy.bind("blur",function()
        {
            closeCallback()
        });
        document.body.insertBefore(dummy,null);
        $dummy.focus();
        self._hasInPlaceEditor = true;
        sheet.repaint(cellRect)
    };
    ComboBoxCellType.prototype.paintValue = function(ctx, value, x, y, w, h, style, options)
    {
        var btnWidth = DefaultDropDownButtonWidth;
        var txtWidth = Math.max(0,w - btnWidth - 1);
        this._basePaintValue(ctx,value,x,y,txtWidth,h,style,options);
        ctx.save();
        if(this._hasInPlaceEditor && options.sheet.getActiveRowIndex() === options.row && options.sheet.getActiveColumnIndex() === options.col)
        {
            ctx.beginPath();
            ctx.rect(x + w - btnWidth - 0.5,y + 1.5 + 0.05,btnWidth - 1,h - 3 + 0.05);
            ctx.fillStyle = "#DDEDFC";
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#7EB4EA";
            ctx.stroke();
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.moveTo(x + w - btnWidth + 5,y + 1 + (h - 2) / 2 - 1.5);
            ctx.lineTo(x + w - btnWidth + 8.5,y + 1 + (h - 2) / 2 + 2);
            ctx.lineTo(x + w - btnWidth + 12,y + 1 + (h - 2) / 2 - 1.5);
            ctx.stroke()
        }
        else
        {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.fillStyle = "#B2B2B2";
            ctx.moveTo(x + w - btnWidth + 5,y + 1 + (h - 2) / 2 - 2);
            ctx.lineTo(x + w - btnWidth + 8.5,y + 1 + (h - 2) / 2 + 2);
            ctx.lineTo(x + w - btnWidth + 12,y + 1 + (h - 2) / 2 - 2);
            ctx.fill()
        }
        ctx.restore()
    };
    ComboBoxCellType.prototype._getHAlignByValueType = function(hAlign, value, text)
    {
        var aValRef = {};
        try
        {
            var af = (new UI.GeneralFormatter).GetPreferredDisplayFormatter(text,aValRef)
        }
        catch(ex){}
        return UI._SheetRender.getHAlignByValueType(hAlign,aValRef.value !== null ? aValRef.value : text)
    };
    ComboBoxCellType.prototype.createEditorElement = function()
    {
        var editor = document.createElement("select");
        var $editor = $(editor);
        $editor.css(cssPositoin,cssAbsolute);
        $editor.css(cssMargin,zero);
        $editor.attr(cssAttr,"gcEditor");
        
        return editor
    };
    ComboBoxCellType.prototype.setEditorValue = function(editorContext, value)
    {
        
        if(!editorContext || !this._items)
            return;
        var element = editorContext;
        if(this._editorValueType === UI.EditorValueType.Text)
        {
            var text = value !== undefined && value !== null ? value.toString().toLowerCase() : null;
            var index = -1,
                count = this._items.length;
            for(var i = 0; i < count; i++)
            {
                var item = this._items[i];
                var txt = item && item.hasOwnProperty("text") ? item.text : item;
                txt = txt !== undefined && txt !== null ? txt.toString().toLowerCase() : null;
                if(txt === text)
                {
                    index = i;
                    break
                }
            }
            element.selectedIndex = index
        }
        else if(this._editorValueType === UI.EditorValueType.Index)
        {
            var index = parseInt(value,10);
            if(isNaN(index))
                element.selectedIndex = -1;
            else
                element.selectedIndex = index
        }
        else if(this._editorValueType === UI.EditorValueType.Value)
        {
            var index = -1,
                count = this._items.length;
            for(var i = 0; i < count; i++)
            {
                var item = this._items[i];
                if(item && item.hasOwnProperty("value") && item.value === value)
                {
                    index = i;
                    break
                }
            }
            element.selectedIndex = index
        }
    };
    ComboBoxCellType.prototype.getEditorValue = function(editorContext)
    {
        if(!editorContext || !this._items)
            return null;
        var sheet = editorContext.sheet;
        if(sheet && sheet.isEditing())
            sheet._eventHandler._setFocus();
        var selectedIndex = editorContext.selectedIndex;
        if(selectedIndex >= 0)
            if(this._editorValueType === UI.EditorValueType.Text)
            {
                var item = this._items[selectedIndex];
                return item && item.hasOwnProperty("text") ? item.text : item
            }
            else if(this._editorValueType === UI.EditorValueType.Index)
            {
                return selectedIndex;
            }
            else if(this._editorValueType === UI.EditorValueType.Value)
            {
                var item = this._items[selectedIndex];
                if(item && item.hasOwnProperty("value")){
                    return item.value
                }
                    
            }
        return null
    };
    ComboBoxCellType.prototype.activateEditor = function(editorContext, cellStyle, cellRect)
    {
        if(!editorContext || !editorContext.sheet)
            return;
        var editor = editorContext;
        var sheet = editorContext.sheet;
        var $editor = $(editor);
        var offset = sheet._eventHandler._getCanvasOffset();
        var originalTop = offset.top + sheet._bounds.y + cellRect.y - 1;
        var originalLeft = offset.left + sheet._bounds.x + cellRect.x - 1;
        $editor.css(cssTop,originalTop);
        $editor.css(cssLeft,originalLeft);
        $editor.css(cssBoxSizing,"content-box");
        $editor.css(cssBorder,"1px solid black");
        $editor.css(cssOutline,cssNone);
        this._renderItems(editor,this._items);
        $editor.bind("keydown",function(e)
        {
            if(e.keyCode === UI.Key.backspace && !e.ctrlKey && !e.shiftKey && !e.altKey)
                UI.cancelDefault(e);
            if(e.ctrlKey || e.shiftKey || e.altKey)
                return;
            if(sheet.isEditing() && sheet.editorStatus() === UI.EditorStatus.Enter)
                if(e.which === UI.Key.left)
                {
                    e.preventDefault();
                    sheet.endEdit();
                    UI.SpreadActions.navigationLeft.apply(sheet)
                }
                else if(e.which === UI.Key.right)
                {
                    e.preventDefault();
                    sheet.endEdit();
                    UI.SpreadActions.navigationRight.apply(sheet)
                }
        });
        document.body.insertBefore(editor,null);
        $editor.focus();
        this._hasInPlaceEditor = true
    };
    ComboBoxCellType.prototype.deactivateEditor = function(editorContext)
    {
        if(editorContext)
        {
            var editor = editorContext;
            $(editor).unbind("keydown")
        }
        this._hasInPlaceEditor = false;
        this._baseDeactivateEditor(editorContext);
        if(editorContext && editorContext.sheet)
            editorContext.sheet.repaint()
    };
    ComboBoxCellType.prototype.updateEditor = function(editorContext, cellStyle, cellRect)
    { 
        if(!editorContext || !editorContext.sheet)
            return;
        var editor = editorContext;
        var sheet = editorContext.sheet;
        var $editor = $(editor);
        if(cellStyle)
        {
            if(cellStyle.backColor)
                $editor.css(cssBackgroundColor,cellStyle.backColor);
            if(cellStyle.foreColor)
                $editor.css(cssColor,cellStyle.foreColor);
            var font = cellStyle.font ? cellStyle.font : sheet._render._getDefaultFont();
            if(sheet._zoomFactor > 1)
                font = sheet._render._getZoomFont(font);
            $editor.css(cssFont,font)
        }
        if(cellRect)
        {
            $editor.css(cssWidth,cellRect.width - 1);
            $editor.css(cssHeight,cellRect.height - 1)
        }
    };
    ComboBoxCellType.prototype._formatEditorValue = function(editorContext, cellStyle, value)
    {
        return value
    };
    ComboBoxCellType.prototype.format = function(value, format, conditionalForeColor)
    {
        if(this._editorValueType === UI.EditorValueType.Text);
        else if(this._editorValueType === UI.EditorValueType.Index)
        {
            var count = this._items ? this._items.length : 0;
            var index = parseInt(value);
            if(0 <= index && index < count)
            {
                var item = this._items[index];
                if(item !== undefined && item !== null)
                    value = item.hasOwnProperty("text") ? item.text : item
            }
        }
        else if(this._editorValueType === UI.EditorValueType.Value)
        {
            var count = this._items ? this._items.length : 0;
            for(var i = 0; i < count; i++)
            {
                var item = this._items[i];
                if(item && item.hasOwnProperty("value") && item.value === value)
                {
                    value = item.hasOwnProperty("text") ? item.text : item;
                    break
                }
            }
        }
        return this._baseFormat(value,format,conditionalForeColor)
    };
    ComboBoxCellType.prototype.parse = function(text, formatStr)
    {
        var text = this._baseParse(text,formatStr);
        if(this._editorValueType === UI.EditorValueType.Text)
            return text;
        else if(this._editorValueType === UI.EditorValueType.Index)
        {
            var count = this._items ? this._items.length : 0;
            for(var i = 0; i < count; i++)
            {
                var item = this._items[i];
                if(item && item.hasOwnProperty("text") && item.text === text || item === text)
                    return i
            }
        }
        else if(this._editorValueType === UI.EditorValueType.Value)
        {
            var count = this._items ? this._items.length : 0;
            for(var i = 0; i < count; i++)
            {
                var item = this._items[i];
                if(item && item.hasOwnProperty("text") && item.text === text || item === text)
                    return item.value
            }
        }
        return text
    };
    ComboBoxCellType.prototype.editorValueType = function(value)
    {
        if(arguments.length === 0)
            return this._editorValueType;
        this._editorValueType = value;
        return this
    };
    ComboBoxCellType.prototype.items = function(items)
    {
        if(arguments.length === 0)
            return this._items;
        this._items = items;
        return this
    };
    ComboBoxCellType.prototype._renderItems = function(element, items)
    {
        if(!items || !element)
            return;
        var count = items.length;
        for(var i = 0; i < count; i++)
        {
            var option = new window.Option;
            var item = items[i];
            if(item !== undefined && item !== null)
                if(item.hasOwnProperty("text"))
                    option.text = item.text;
                else
                    option.text = item;
            element.add(option)
        }
    };
    ComboBoxCellType.prototype._getAutoFitWidth = function(sheet, value, text, cellStyle, isFilterHeader)
    {
        var width = TextCellType.prototype._getAutoFitWidth.apply(this,arguments);
        return width + DefaultDropDownButtonWidth
    };
    ComboBoxCellType.prototype._getAutoFitHeight = function(sheet, value, text, cellStyle)
    {
        return TextCellType.prototype._getAutoFitHeight.apply(this,arguments)
    };
    ComboBoxCellType.prototype.toJSON = function()
    {
        return{
                type: UI.CellTypeKind.ComboBoxCellType,
                editorValueType: this.editorValueType(),
                items: this.items()
            }
    };
    ComboBoxCellType.prototype.fromJSON = function(settings)
    {
        console.log('fromJSON',settings)
        if(!settings)
            return;
        if(settings.editorValueType !== null && settings.editorValueType !== undefined)
            this.editorValueType(settings.editorValueType);
        if(settings.items !== null && settings.items !== undefined)
            this.items(settings.items)
    };