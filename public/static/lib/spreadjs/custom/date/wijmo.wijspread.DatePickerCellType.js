(function (window, $) {
    "use strict";;
    var ns = GrapeCity.UI;
    function DatePickerCellType() {
    }
    DatePickerCellType.prototype = new ns.ComboBoxCellType();

    DatePickerCellType.prototype.createEditorElement = function (context) {
        //Create input presenter.
        return document.createElement("input");
    };
    DatePickerCellType.prototype.activateEditor = function (editorContext, cellStyle, cellRect, context) {
        //Initialize input editor.
        console.log('activateEditor', editorContext)
        if (editorContext) {
            let $editor = $(editorContext);
            ns.CustomCellType.prototype.activateEditor.apply(this, arguments);
            WdatePicker({ el: $editor[0] });//,position:{left:cellRect.x,top:cellRect.y+30}
            $editor.css("position", "absolute");
            $editor.attr("gcUIElement", "gcEditingInput");
            $(".WdateDiv").attr("gcUIElement", "gcEditingInput");
        }
    }
    DatePickerCellType.prototype.deactivateEditor = function (editorContext, context) {
        //Remove input editor when end editor status.
        if (editorContext) {
            var element = editorContext;
            $dp.hide();
            delete $dp.dd;//删除$dp.dd，避免再次点击未执行activateEditor方法就打开时间选择器，未对其赋值及位置定位
        }
        ns.CustomCellType.prototype.deactivateEditor.apply(this, arguments)
    };
    DatePickerCellType.prototype.setEditorValue = function (editor, value, context) {
        //Sync value from Cell value to editor value.
        $(editor).val(value)
        WdatePicker({ startDate: value })
    };
    DatePickerCellType.prototype.getEditorValue = function (editor, context) {
        //Sync value from editor value to cell value.
        return $(editor).val();
    };
    DatePickerCellType.prototype.updateEditor = function (editorContext, cellStyle, cellRect, context) {
        if (editorContext) {
            let $editor = $(editorContext);
            $editor.css("width", cellRect.width - 1);
            $editor.css("height", cellRect.height - 3);
        }
    };
    $.wijmo.wijspread.DatePickerCellType = DatePickerCellType
})(this, jQuery)