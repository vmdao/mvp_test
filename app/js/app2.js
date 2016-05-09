(function($) {
    var textElement, textElementBase, tableDesign = $('#table-design'),
    elements = tableDesign.find('.element');

    function element(data){
        this.dom = $('\x3cdiv class\x3d"element" /\x3e');
        this.dom.data("valueElement", this);
        this.selected = !1;
        this.tranparence = !0;
        this.rotation = this.height = this.width = this.top = this.left = 0;
        this.index = 0;
    }

    textElement = textElementBase.prototype = new element({});
    textElement.move = function(data){
        console.log(data);
    }
        

    var a = new textElement();
    console.dir(a.move({a:1}))

})(jQuery);


