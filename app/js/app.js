(function($) {
    var tableDesign = $('#table-design');
    var elements = tableDesign.find('.element')
    //var rect = tableDesign.getBoundingClientRec()
    console.dir(tableDesign)
    elements.on("click", tableDesign, setOnClick)
    elements.on("mousedown", tableDesign, setOnMouseDown)
    //elements.on("mouseup", tableDesign, setOnMouseUp)

    $("#render").on("click", function(e){
        ajaxRennderPdf().done(function(data){
            console.log(data)
        })
    });
    var app = app || {};
    
    // view
    (function(app) {
        app.ElementConllectionView = Backbone.View.extend({
            elementCollection : {},
            initialize : function() {
                console.log("Todo list");
                //xem log
                this.documentCollection = new app.DocumentCollection()
                this.render();
            },
            render : function() {
                console.log("Show Todo list");
                this.elementCollection.fetch();
                return this;
            },
        })
    })(app);
    var storage = {
                "id": 5,
                "code": "Abc1234C",
                "index": 1,
                "pathThumb": "cdn/123.png",
                "pathScreen": "satatic.uplevo.com/pic/123.png",
                "elements": [{
                    "type": "UplevoImage",
                    "typeElement": "image",
                    "userEdited": true,
                    "elementIndex": 1,
                    "tranparency": 0.6,
                    "rotation": 90.0,
                    "width": 100.0,
                    "height": 100.0,
                    "top": 0.0,
                    "left": 20.0,
                    "mediaId": null,
                    "pathFile": "image.jpg",
                    "imageBox": {
                        "left": 0.0,
                        "top": 0.0,
                        "width": 0.0,
                        "height": 0.0
                    },
                    "imageFillter": {
                        "name": null
                    },
                    "background": false
                }, {
                    "type": "UplevoText",
                    "typeElement": "text",
                    "userEdited": true,
                    "elementIndex": 0,
                    "tranparency": 0.3,
                    "rotation": 30.6,
                    "width": 100.0,
                    "height": 100.0,
                    "top": 0.0,
                    "left": 0.0,
                    "html": "SaninoOK",
                    "style": {
                        "fontSize": 10.0,
                        "lineHeight": 1.41,
                        "fontFamily": "UV-Aircona.ttf",
                        "letterSpacing": 0.0,
                        "justification": "right",
                        "textTransform": "none",
                        "bool": false,
                        "italic": false,
                        "color": "#000"
                    }
                }],
                "createAt": null,
                "document": {
                    "id": 1,
                    "code": "Abc123",
                    "name": "Chrismast",
                    "createAt": 1461558259000,
                    "layout": {
                        "id": 1,
                        "code": "facebookcover",
                        "name": "Facebook Cover",
                        "width": 1000.0,
                        "height": 500.0,
                        "createAt": 1461558041000
                    },
                    "language": [{
                        "id": 1,
                        "code": "vi",
                        "name": "Vietnamese",
                        "createAt": 1461558024000
                    }],
                    "tag": [{
                        "id": 1,
                        "code": "spring",
                        "name": "Spring",
                        "createAt": 1461558143000,
                        "description": "Mua xuan, ve dat dang moi mo"
                    }]
                }
        }
    // Collection
    (function(app) {
        app.DocumentCollection = Backbone.Collection.extend({
          
            model : app.Document,
            localStorage: new Store("backbone-document")
        
        });
    })(app);

    (function(app) {
        app.Document = Backbone.Model.extend({
            defaults: {
                code: '',
                index: 0,
                pathThumb: '',
                pathScreen: '',
                elements: {}
            }
        });
    })(app);

    (function(app) {
        app.ElementCollection = Backbone.Collection.extend({
            url : 'http://api.uplevo.com:8080/documents/Abc123/contents',
            model : app.ElementModel,
            parse : function(response) {
                console.log("Get Collection" + response);
                return response;
            }
        });
    })(app);

    // Model Element Base
    (function(app) {
        app.ElementBaseModel = Backbone.Model.extend({
            defaults: {
                typeElement: 'text',
                elementIndex: 0,
                tranparency: 1,
                rotation: 0,
                width: 100,
                height: 100,
                top: 0,
                left: 0,
            }
        });
    })(app);

    // Model Element Text
    (function(app) {
        app.ElementTextModel = app.ElementBaseModel.extend({
            defaults: {
                html:'',
                style:{
                    fontSize: 10,
                    fontFamily: 'arial',
                    lineHeight: 1.4,
                    letterSpacing: 0,
                    justification: 'left',
                    textTransform: null,
                    bold: false,
                    italic: false,
                    color: '#000'
                }
            }
        });
    })(app);

    // Model Element Image
    (function(app) {
        app.ElementImageModel = app.ElementBaseModel.extend({
            defaults: {
                mediaId: '',
                pathFile: '',
                imageBox:{
                    left: 10,
                    top: 0,
                    width: 1.4,
                    height: 10,
                },
                imageFillter:{
                    name:null
                },
                background: false
            }
        });
    })(app);

    // run router
    (function(app) {
        app.TodoRouter = Backbone.Router.extend({
            routes : {
                ''          : 'todoLists',  
                'todo-lists'        : 'todoLists',  
                'todo-lists/:id'    : 'todoDetail'
            },
            todoLists : function() {
                alert('TODO一list');
                new app.ElementConllectionView();
            },
            todoDetail : function(id) {
                alert('Thong tin TODO của id = ' + id);
            },
        });
    })(app);

    // rentry point
    (function(app) {
        var todoRouter = new app.TodoRouter();  
        Backbone.history.start();               
    })(app);

})(jQuery);



function ajaxGetData(){
    return $.ajax({
        url: "http://api.uplevo.com:8080/documents/Abc123/contents",
        type: "GET"
    })
}
function ajaxRennderPdf(){
    var data = {
                "documentCode":"Abc123",
                "version":10,
                "mediaDpi": 96,
                "mediaQuality": "WEB",
                "type":"WEB",
                "format":"PNG"
            }
    return $.ajax({
        type: "POST",
        contentType:"application/json; charset=utf-8",
        url: "http://api.uplevo.com:8080/export",
        processData: false,
        //url: "/login",
        data: JSON.stringify(data)
    })
}

function setOnClick(e){
    console.dir(e)
}
function setOnMouseDown(e){
    var tableDesign = $('#table-design');
    var data = {'tableDesign': tableDesign, 'element': this}
    $(window).on("mousemove", data, setOnMouseMove);
    $(window).on("mouseup", data, setOnMouseUp);
}

function setOnMouseMove(e){
    var element = e.data.element;
    var str = $(element).css('transform');
    var trans = getValueTransform(str)
    var offSetTable = $(e.data.tableDesign).offset();
    var left = e.pageX - offSetTable.left;
    var top = e.pageY - offSetTable.top;
    console.log(offSetTable)
    var valueTransform = "translate3d(" + left +"px, " + top + "px, 0px)"
    $(element).css({"transform": valueTransform});
}
function setOnMouseUp(e){
    console.log("up")
    $(this).off("mousemove")
    $(this).off("mouseup")
}
function getValueTransform(tr){
    var values = tr.split('(')[1],
        values = values.split(')')[0],
        values = values.split(',');
    return values;
}

