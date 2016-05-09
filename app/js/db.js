function startDBBone(a) {
    DBRouter = "undefined" != typeof a && "undefined" != typeof a.site && "static" == a.site ? new DB.StaticRouter(a) : new DB.Router(a), Backbone.history.start({
        pushState: !0
    })
}

function roundNumber(a, b) {
    return Math.round(a * Math.pow(10, b)) / Math.pow(10, b)
}

function objectIsset(a, b) {
    return b.split(".").reduce(function(a, b) {
        return "undefined" == typeof a || null === a ? a : a[b]
    }, a)
}

function loadFont(a, b) {
    function c() {
        clearTimeout(d), -1 === g ? ("function" == typeof b && b(!1, i), DB.loadedFont[a] = !1) : g ? ("function" == typeof b && b(!0, i), DB.loadedFont[a] = !0) : Date.now() - f > e ? ("function" == typeof b && b(!1, i), DB.loadedFont[a] = !1) : d = setTimeout(c, 100)
    }
    var d, e = 5e3,
        f = Date.now(),
        g = !1;
    DB.loadedFont[a] && (g = !0);
    for (var h, i = {
        bold: !0,
        italic: !0,
        both: !0
    }, j = DB.listFont.length - 1; j >= 0; j--) {
        var k = DB.listFont[j];
        if (a === k.family) {
            k.urlFontName && (h = k.urlFontName), i = k.config;
            break
        }
    }
    var l = $(".text-context").find("#choose-font a"),
        m = $(".text-context").find("#choose-font .caret"),
        n = $(".text-context").find(".loading_small");
    g ? ("function" == typeof b && b(!0, i), l.addClass("disabled"), m.addClass("hidden"), n.removeClass("hidden"), window.setTimeout(function() {
        l.removeClass("disabled"), m.removeClass("hidden"), n.addClass("hidden")
    }, 400)) : h && (WebFont.load({
        custom: {
            families: [a],
            urls: [h]
        },
        loading: function() {
            l.addClass("disabled"), m.addClass("hidden"), n.removeClass("hidden")
        },
        fontactive: function() {
            g = !0, l.removeClass("disabled"), m.removeClass("hidden"), n.addClass("hidden")
        },
        fontinactive: function() {
            g = -1, l.removeClass("disabled"), m.removeClass("hidden"), n.addClass("hidden"), console.log("load font failed: " + h)
        },
        timeout: 5e3
    }), c())
}

function filterImage(a, b, c, d) {
    function e(a) {
        return [Math.min(255, Math.round(255 * a[0])), Math.min(255, Math.round(255 * a[1]))]
    }

    function f(a) {
        function b(b) {
            return parseFloat((b * a / -100).toFixed(2))
        }

        function c(b) {
            return parseFloat((b * a / 100).toFixed(2))
        }
        if (a > 0) {
            var d = [0, .2, 0, -.1, 0].map(c),
                e = [0, .1, 0, -.1, 0].map(c),
                f = [.2, 0, .2].map(c);
            return {
                red: [
                    [0, 0],
                    [.3, .3 - d[1]],
                    [.7, .7 - d[3]],
                    [1, 1]
                ],
                green: [
                    [0, 0],
                    [.25, .25 - e[1]],
                    [.75, .75 - e[3]],
                    [1, 1]
                ],
                blue: [
                    [0, f[0]],
                    [0 + 2 / 3 * .5, f[0] + 2 / 3 * (.5 - f[0])],
                    [1 + 2 / 3 * -.5, 1 - f[2] + 2 / 3 * (.5 - (1 - f[2]))],
                    [1, 1 - f[2]]
                ]
            }
        }
        var d = [0, .2, .5, -.05].map(b),
            e = [0, -.15, 0, 0].map(b),
            f = [0, -.01, 0, .3].map(b);
        return {
            red: [
                [0, 0],
                [.3, .3 - d[1]],
                [.7, .7 - d[2]],
                [.95, .95 - d[3]]
            ],
            green: [
                [0, 0],
                [.25, .25 - e[1]],
                [.6, .6],
                [1, 1]
            ],
            blue: [
                [0, 0],
                [.3, .3 - f[1]],
                [.5, .5],
                [1, 1 - f[3]]
            ]
        }
    }

    function g(a) {
        return a -= 200 / 7, 0 > a && (a = 200 + a), a = h(360 * a / 200, 100, 50), {
            color: {
                r: a[0],
                g: a[1],
                b: a[2]
            },
            strength: 7
        }
    }

    function h(a, b, c) {
        if (a /= 360, b /= 100, c /= 100, 0 == b) c = b = a = c;
        else {
            var d = .5 > c ? c * (1 + b) : c + b - c * b,
                e = 2 * c - d;
            c = i(e, d, a + 1 / 3), b = i(e, d, a), a = i(e, d, a - 1 / 3)
        }
        return [Math.round(255 * c), Math.round(255 * b), Math.round(255 * a)]
    }

    function i(a, b, c) {
        return 0 > c && (c += 1), c > 1 && --c, 1 / 6 > c ? a + 6 * (b - a) * c : .5 > c ? b : 2 / 3 > c ? a + (b - a) * (2 / 3 - c) * 6 : a
    }
    var j = c.blur ? .5 * c.blur : 0,
        k = c.brightness ? .5 * c.brightness : 0,
        l = c.contrast ? .6 * c.contrast : 0,
        m = c.saturation ? c.saturation : 0;
    c.vignette ? .7 * c.vignette : 0;
    if ($("#" + b).length) n = document.getElementById(b);
    else {
        var n = document.createElement("canvas"),
            o = n.getContext("2d");
        n.setAttribute("data-caman-hidpi-disabled", !0), n.id = b, n.width = a.width, n.height = a.height, o.drawImage(a, 0, 0, n.width, n.height), $("#chaos-zone").append(n)
    }
    return DB.filterLocked ? void(DB.filterQueue[b] = {
        filter: c,
        img: a
    }) : void Caman(n, function() {
        if (this.revert(!1), k && 0 != k && this.brightness(k), l && 0 != l && this.contrast(l), m && 0 != m && (-100 == m ? this.greyscale() : this.saturation(m)), c.tint) {
            var a = g(c.tint + 100);
            this.colorize(a.color.r, a.color.g, a.color.b, 2.5 * a.strength)
        }
        if (j && 0 != j && (j > 0 ? this.stackBlur(j) : this.sharpen(-1 * j || 0)), c.xpro) {
            curvesFilter = f(c.xpro);
            var b = curvesFilter.red.map(e),
                h = curvesFilter.green.map(e),
                i = curvesFilter.blue.map(e);
            this.curves("r", b[0], b[1], b[2], b[3]), this.curves("g", h[0], h[1], h[2], h[3]), this.curves("b", i[0], i[1], i[2], i[3])
        }
        this.render(function() {
            d(n), setTimeout(function() {
                DB.filterLocked = !1, $(".page.selected .loading-elements").addClass("hidden")
            }, 400)
        })
    })
}

function rgb2hex(a) {
    function b(a) {
        var b = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
        return isNaN(a) ? "00" : b[(a - a % 16) / 16] + b[a % 16]
    }
    return a = a.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/), "#" + b(a[1]) + b(a[2]) + b(a[3])
}

function rgb2object(a) {
    return a = a.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/), {
        r: parseInt(a[1], 10),
        g: parseInt(a[2], 10),
        b: parseInt(a[3], 10)
    }
}

function element(a, b, c) {
    a && (this.elementIndex = a.elementIndex || -1, this.width = a.width || 0, this.height = a.height || 0, this.left = a.left || 0, this.top = a.top || 0, this.transparency = a.transparency || 0, this.rotation = a.rotation || 0, this.type = a.type || null, this.element = null, this.layoutId = a.mediaLayout || null), b && (this.pageWrap = b || null), c && (this.layoutId = c)
}

function imageElement(a, b, c) {
    element.call(this, a, b, c), this.backgroundColor = a.backgroundColor || null, this.isRecolorable = a.isRecolorable || !1, this.isBackground = a.isBackground || !1, this.isDark = a.isDark || !1, this.mediaId = a.mediaId || null, this.mediaVersion = a.mediaVersion || 0, this.flipOrientation = a.flipOrientation || 0, this.filter = a.filter || null, this.imageBox = a.imageBox || null, this.isCut = a.isCut || !1, this.onChange = !1
}

function gridElement(a, b, c) {
    element.call(this, a, b, c), this.items = a.items || null, this.contents = a.contents || null, this.spacing = a.spacing || 10, this.flipOrientation = a.flipOrientation || 0
}

function textElement(a, b, c) {
    element.call(this, a, b, c), this.style = a.style || "body", this.textTransform = a.textTransform || null, this.fontSize = a.fontSize || 16, this.fontFamily = a.fontFamily || "Open Sans", this.html = a.html || "body text", this.letterSpacing = a.letterSpacing || 0, this.lineHeight = a.lineHeight || 140, this.lineLengths = a.lineLengths || [], this.color = a.color || "#ffffff", this.bold = a.bold || null, this.italic = a.italic || null, this.justification = a.justification || "left"
}

function svgElement(a, b, c) {
    element.call(this, a, b, c), this.mediaId = a.mediaId || null, this.mediaVersion = a.mediaVersion || 0, this.fillColors = a.fillColors || null, this.scale = a.scale || null, this.contents = a.contents || [], c && _.each(this.contents, function(a, b) {
        a.mediaLayout = c
    })
}

var DB = DB || {
        BaseUrl: "https://api.designbold.com/",
        Version: "v2"
    };
"undefined" == typeof DB.BaseUrl && (DB.BaseUrl = "https://api.designbold.com/"), "undefined" == typeof DB.Version && (DB.Version = "v2"),
    function() {
        DB.extendEach = function() {
            var a = Array.prototype.slice.call(arguments),
                b = this;
            return _.each(a, function(a) {
                b = b.extend(a)
            }), b
        }, Backbone.Model.extendEach = DB.extendEach, Backbone.Collection.extendEach = DB.extendEach, Backbone.Router.extendEach = DB.extendEach, Backbone.View.extendEach = DB.extendEach
    }(), DB.AjaxManager = function() {
    var a = [];
    return {
        addReq: function(b) {
            a.push(b)
        },
        removeReq: function(b) {
            $.inArray(b, a) > -1 && a.splice($.inArray(b, a), 1)
        },
        run: function() {
            var b, c = this;
            a.length ? (b = a[0].complete, a[0].complete = function() {
                "function" == typeof b && b(), a.shift(), c.run.apply(c, [])
            }, $.ajax(a[0])) : c.tid = setTimeout(function() {
                c.run.apply(c, [])
            }, 1e3)
        },
        stop: function() {
            a = [], clearTimeout(this.tid)
        }
    }
}(), DB.refreshAccessToken = function(a) {
    return "undefined" == typeof DB.RefreshTokenUri ? (confirm("Your access token was expired. Wanna reload page to obstain a new one?") && window.location.reload(!0), !1) : ($("body").addClass("db-disabled"), void $.ajax({
        url: DB.RefreshTokenUri,
        type: "GET",
        dataType: "json",
        success: function(b) {
            "undefined" != typeof b.access_token ? (DB.Token = b.access_token, a.data = _.extend({}, a.data, {
                access_token: DB.Token
            }), DB.setupAccessToken(), $.ajax(a)) : (alert("Failed to auto retrieve new access token. Browser wil reload to obstain a new one."), window.location.reload(!0)), $("body").removeClass("db-disabled")
        },
        error: function(a) {
            console.log(a.responseText), confirm("Your access token was expired. Wanna reload page to obstain a new one?") && window.location.reload(!0)
        }
    }))
};
var originalSync = Backbone.sync;
DB.setupAccessToken = function() {
    Backbone.sync = function(a, b, c) {
        var d, e;
        return e = $.Deferred(), c && e.then(c.success, c.error), "patch" == a || "update" == a || "put" == a || "create" == a ? ("undefined" == typeof c.attrs && (c.attrs = {}), c.attrs = _.extend({}, c.attrs, {
            access_token: DB.Token
        }), "create" == a && (c.attrs = _.extend(c.attrs, b.attributes))) : ("undefined" == typeof c.data && (c.data = {}), c.data = _.extend({}, c.data, {
            access_token: DB.Token
        })), d = originalSync(a, b, _.omit(c, "success", "error")), $("body").hasClass("db-disabled") && "undefined" == typeof DB.RefreshTokenUri && b.url.indexOf(-1 == DB.RefreshTokenUri) && d.abort(), d.done(e.resolve), d.fail(function() {
            if (200 === d.status && "" === d.responseText) e.resolve.apply(d, arguments);
            else if ("undefined" != typeof navigator.onLine && navigator.onLine === !1 && $("body .panel-error").length <= 0) {
                if (DB.AjaxManager.stop(), $("body .panel-error").remove(), "undefined" != typeof _ && "function" == typeof _.template) {
                    var f = _.template($("#connection_lost_tmpl").html())({
                        reload: 0,
                        title: "No internet connection!",
                        message: "Oops! It looks like your device has lost the internet connection."
                    });
                    $("body .main, body .layer").addClass("page-blur"), $("body").prepend(f), $("body .panel-error a").off("click").on("click", function() {
                        $("body .panel-error").fadeOut(), $("body .main, body .layer").removeClass("page-blur")
                    })
                }
            } else 401 === d.status ? ("read" == a && (a = "get"), c = _.extend(c, {
                method: a,
                url: b.url
            }), DB.refreshAccessToken(c)) : 403 == d.status && DB.View.prototype.popupLoginModal(), e.reject.apply(d, arguments)
        }), e.promise()
    }, $.ajaxSetup({
        data: {
            access_token: DB.Token
        },
        beforeSend: function(a, b) {
            $("body").hasClass("db-disabled") && "undefined" == typeof DB.RefreshTokenUri && b.url.indexOf(-1 == DB.RefreshTokenUri) && a.abort()
        },
        error: function(a) {
            if (401 === a.status) DB.refreshAccessToken(this);
            else if ("undefined" != typeof navigator.onLine && navigator.onLine === !1 && $("body .panel-error").length <= 0) {
                if (DB.AjaxManager.stop(), $("body .panel-error").remove(), "undefined" != typeof _ && "function" == typeof _.template) {
                    var b = _.template($("#connection_lost_tmpl").html())({
                        reload: 0,
                        title: "No internet connection!",
                        message: "Oops! It looks like your device has lost the internet connection."
                    });
                    $("body .main, body .layer").addClass("page-blur"), $("body").prepend(b), $("body .panel-error a").off("click").on("click", function() {
                        $("body .panel-error").fadeOut(), $("body .main, body .layer").removeClass("page-blur")
                    })
                }
            } else DB.View.prototype.pushNotification({
                type: 406 == a.status ? "warning" : "error",
                message: a.responseJSON.msg
            })
        }
    })
}, DB.setupAccessToken(), DB.BaseApi = DB.BaseUrl + DB.Version + "/", DB.EventBus = _({}).extend(Backbone.Events), DB.User = Backbone.Model.extend({
    idAttribute: "_id",
    initialize: function() {
        this.url = DB.BaseApi + "user/me"
    },
    toSaveUserEmail: function() {
        this.url = DB.BaseApi + "user/email"
    },
    toSaveUserPassword: function() {
        this.url = DB.BaseApi + "user/password"
    },
    toSaveUserCredit: function() {
        this.url = DB.BaseApi + "user/credit"
    },
    toSaveUserFollow: function() {
        this.url = DB.BaseApi + "user/" + this.id + "/follow"
    },
    toSaveUserAvatar: function() {
        this.url = DB.BaseApi + "user/avatar"
    },
    toSaveUserCover: function() {
        this.url = DB.BaseApi + "user/cover"
    },
    toUploadDesignImage: function() {
        this.url = DB.BaseApi + "user/upload"
    },
    toOauthLogin: function() {
        this.url = DB.OauthClientUri + "login"
    },
    toOauthRegister: function() {
        this.url = DB.OauthClientUri + "register"
    },
    toOauthVerifyEmail: function() {
        this.url = DB.OauthClientUri + "verify-email"
    },
    toApplyContributor: function() {
        this.url = DB.BaseApi + "user/contributor/apply"
    },
    toSendContact: function() {
        this.url = DB.BaseApi + "user/contact/send"
    },
    toRechargeCredit: function() {
        this.url = DB.BaseApi + "user/recharge"
    },
    resetUrl: function() {
        this.url = DB.BaseApi + "user/me"
    },
    parse: function(a) {
        return a.response
    }
}), DB.User.prototype.onError = function(a, b, c) {
    console.warn("DB.User::onError when requesting: " + a.url);
    try {
        console.warn(b.responseText)
    } catch (d) {}
}, DB.Document = Backbone.Model.extend({
    idAttribute: "_id",
    initialize: function() {
        this.url = DB.BaseApi + "document/" + this.id
    },
    toAddDocument: function(a) {
        this.url = DB.BaseApi + "document/" + a
    },
    toCreateDocument: function() {
        this.url = DB.BaseApi + "document"
    },
    toSaveDocumentLike: function() {
        this.url = DB.BaseApi + "document/" + this.id + "/like"
    },
    toSaveDocumentComment: function() {
        this.url = DB.BaseApi + "document/" + this.id + "/comment"
    },
    toFetchDocumentVersion: function() {
        this.url = DB.BaseApi + "document/" + this.id + "/version"
    },
    toSaveDocument: function() {
        this.url = DB.BaseApi + "document/" + this.id + "/save"
    },
    toRenderDocument: function() {
        this.url = DB.BaseApi + "document/" + this.id + "/render"
    },
    toExportDocument: function() {
        var a = new Date;
        this.url = DB.BaseApi + "document/" + this.id + "/export?" + a.getTime()
    },
    toDownloadDocument: function() {
        this.url = DB.BaseApi + "document/" + this.id + "/download"
    },
    toUpdateDocumentActive: function() {
        this.url = DB.BaseApi + "document/" + this.id + "/active"
    },
    toSubmitDocument: function() {
        this.url = DB.BaseApi + "user/document/" + this.id + "/submit"
    },
    toShareDocument: function() {
        this.url = DB.BaseApi + "document/" + this.id + "/share"
    },
    toMoveDocument: function() {
        this.url = DB.BaseApi + "document/" + this.id + "/move"
    },
    toCheckoutDocument: function() {
        this.url = DB.BaseApi + "document/" + this.id + "/checkout"
    },
    toPayoutDocument: function() {
        this.url = DB.BaseApi + "document/" + this.id + "/payout"
    },
    resetUrl: function() {
        this.url = DB.BaseApi + "document/" + this.id
    },
    parse: function(a) {
        return "undefined" != typeof a.response ? a.response : a
    }
}), DB.Document.prototype.onError = function(a, b, c) {
    console.warn("DB.Document::onError when requesting: " + a.url);
    try {
        console.warn(b.responseText)
    } catch (d) {}
}, DB.Design = Backbone.Model.extend({
    idAttribute: "_id",
    initialize: function() {
        this.url = DB.BaseApi + "design/" + this.id
    },
    toFetchDesignVersion: function() {
        this.url = DB.BaseApi + "design/" + this.id + "/version"
    },
    toSaveDesign: function() {
        this.url = DB.BaseApi + "design/" + this.id + "/save"
    },
    toRenderDesign: function() {
        this.url = DB.BaseApi + "design/" + this.id + "/render"
    },
    toExportDesign: function(a) {
        this.url = DB.BaseApi + "design/" + this.id + "/export/" + a
    },
    resetUrl: function() {
        this.url = DB.BaseApi + "design/" + this.id
    },
    parse: function(a) {
        return "undefined" != typeof a.response ? a.response : a
    }
}), DB.Design.prototype.onError = function(a, b, c) {
    console.warn("DB.Design::onError when requesting: " + a.url);
    try {
        console.warn(b.responseText)
    } catch (d) {}
}, DB.DocumentType = Backbone.Model.extend(), DB.DocumentType.prototype.onError = function(a, b, c) {
    console.warn("DB.DocumentType::onError when requesting: " + a.url);
    try {
        console.warn(b.responseText)
    } catch (d) {}
}, DB.Media = Backbone.Model.extend({
    idAttribute: "_id",
    initialize: function() {
        this.url = DB.BaseApi + "media/" + this.id
    },
    toFetchLayoutVersion: function() {
        this.url = DB.BaseApi + "media/" + this.id + "/version"
    },
    toSaveLayout: function() {
        this.url = DB.BaseApi + "media/" + this.id + "/save"
    },
    toRenderLayout: function() {
        this.url = DB.BaseApi + "media/" + this.id + "/render"
    },
    toGenerateLayoutFiles: function() {
        this.url = DB.BaseApi + "media/" + this.id + "/generate"
    },
    toStartImportUpload: function() {
        this.url = DB.BaseApi + "media/file"
    },
    toFinishImportUpload: function() {
        this.url = DB.BaseApi + "media/" + this.id + "/file"
    },
    toDeleteUploadImage: function() {
        this.url = DB.BaseApi + "user/uploads/" + this.id
    },
    resetUrl: function() {
        this.url = DB.BaseApi + "media/" + this.id
    }
}), DB.Media.prototype.onError = function(a, b, c) {
    console.warn("DB.Media::onError when requesting: " + a.url);
    try {
        console.warn(b.responseText)
    } catch (d) {}
}, DB.Workspace = Backbone.Model.extend({
    idAttribute: "_id"
}), DB.Workspace.prototype.onError = function(a, b, c) {
    console.warn("DB.Workspace::onError when requesting: " + a.url);
    try {
        console.warn(b.responseText)
    } catch (d) {}
}, DB.UserLabel = Backbone.Model.extend({
    idAttribute: "_id",
    initialize: function() {
        this.url = DB.BaseApi + "user/label"
    },
    toUpdateLabel: function() {
        this.url = DB.BaseApi + "user/label/" + this.id
    },
    toDeleteLabel: function() {
        this.url = DB.BaseApi + "user/label/" + this.id
    },
    resetUrl: function() {
        this.url = DB.BaseApi + "user/label"
    }
}), DB.UserLabel.prototype.onError = function(a, b, c) {
    console.warn("DB.UserLabel::onError when requesting: " + a.url);
    try {
        console.warn(b.responseText)
    } catch (d) {}
}, DB.Faq = Backbone.Model.extend({
    idAttribute: "_id",
    initialize: function() {
        this.url = DB.BaseApi + "faq/" + this.id
    },
    toSubmitIssue: function() {
        this.url = DB.BaseApi + "faq/ticket"
    },
    resetUrl: function() {
        this.url = DB.BaseApi + "faq/" + this.id
    }
}), DB.Faq.prototype.onError = function(a, b, c) {
    console.warn("DB.Faq::onError when requesting: " + a.url);
    try {
        console.warn(b.responseText)
    } catch (d) {}
}, DB.UserInvoice = Backbone.Model.extend({
    idAttribute: "_id",
    initialize: function() {
        this.url = DB.BaseApi + "user/invoices/" + this.id
    },
    resetUrl: function() {
        this.url = DB.BaseApi + "user/invoices/" + this.id
    }
}), DB.UserInvoice.prototype.onError = function(a, b, c) {
    console.warn("DB.UserInvoice::onError when requesting: " + a.url);
    try {
        console.warn(b.responseText)
    } catch (d) {}
}, DB.Documents = Backbone.Collection.extend({
    model: DB.Document,
    initialize: function() {
        this.url = DB.BaseApi + "document"
    },
    parse: function(a) {
        return _.toArray(a.response)
    },
    toFetchUserDocument: function(a) {
        "undefined" == typeof a && (a = "me"), this.url = DB.BaseApi + "user/" + a + "/documents"
    },
    resetUrl: function() {
        this.url = DB.BaseApi + "document"
    }
}), DB.Documents.prototype.onError = function(a, b, c) {
    console.warn("DB.Documents::onError when requesting: " + a.url);
    try {
        console.warn(b.responseText)
    } catch (d) {}
}, DB.DocumentTypes = Backbone.Collection.extend({
    model: DB.DocumentType,
    initialize: function() {
        this.url = DB.BaseApi + "document/type"
    },
    parse: function(a) {
        return a.response
    }
}), DB.DocumentTypes.prototype.onError = function(a, b, c) {
    console.warn("DB.DocumentTypes::onError when requesting: " + a.url);
    try {
        console.warn(b.responseText)
    } catch (d) {}
}, DB.Medias = Backbone.Collection.extend({
    model: DB.Media,
    initialize: function() {
        this.url = DB.BaseApi + "media"
    },
    parse: function(a) {
        return a.response
    },
    toFetchLayouts: function() {
        this.url = DB.BaseApi + "media?type=D"
    },
    toFetchBackgrounds: function() {
        this.url = DB.BaseApi + "media?type=RV&bgr=1"
    },
    toFetchTexts: function() {
        this.url = DB.BaseApi + "media?type=V&q=text"
    },
    toFetchUploads: function() {
        this.url = DB.BaseApi + "media/uploads"
    },
    toFetchSearchs: function() {
        this.url = DB.BaseApi + "media?type=RV"
    },
    toFetchRecents: function() {
        this.url = DB.BaseApi + "media/recent"
    },
    resetUrl: function() {
        this.url = DB.BaseApi + "media"
    }
}), DB.Medias.prototype.onError = function(a, b, c) {
    console.warn("DB.Medias::onError when requesting: " + a.url);
    try {
        console.warn(b.responseText)
    } catch (d) {}
}, DB.Users = Backbone.Collection.extend({
    model: DB.User,
    initialize: function() {
        this.url = DB.BaseApi + "user"
    },
    toFetchUserFollowers: function(a) {
        this.url = DB.BaseApi + "user/" + a + "/followers"
    },
    toFetchUserFollowing: function(a) {
        this.url = DB.BaseApi + "user/" + a + "/following"
    },
    parse: function(a) {
        return a.response
    }
}), DB.Users.prototype.onError = function(a, b, c) {
    console.warn("DB.Users::onError when requesting: " + a.url);
    try {
        console.warn(b.responseText)
    } catch (d) {}
}, DB.Workspaces = Backbone.Collection.extend({
    model: DB.Workspace,
    initialize: function() {
        this.url = DB.BaseApi + "user/workspace"
    },
    resetUrl: function() {
        this.url = DB.BaseApi + "user/workspace"
    },
    parse: function(a) {
        return a.response
    }
}), DB.Workspaces.prototype.onError = function(a, b, c) {
    console.warn("DB.Workspaces::onError when requesting: " + a.url);
    try {
        console.warn(b.responseText)
    } catch (d) {}
}, DB.UserLabels = Backbone.Collection.extend({
    model: DB.UserLabel,
    initialize: function() {
        this.url = DB.BaseApi + "user/label"
    },
    toFetchUserLabels: function(a) {
        this.url = DB.BaseApi + "user/" + a + "/label"
    },
    resetUrl: function() {
        this.url = DB.BaseApi + "user/label"
    },
    parse: function(a) {
        return a.response
    }
}), DB.UserLabels.prototype.onError = function(a, b, c) {
    console.warn("DB.UserLabels::onError when requesting: " + a.url);
    try {
        console.warn(b.responseText)
    } catch (d) {}
}, DB.Faqs = Backbone.Collection.extend({
    model: DB.Faq,
    initialize: function() {
        this.url = DB.BaseApi + "faq"
    },
    parse: function(a) {
        return a.response
    }
}), DB.UserInvoices = Backbone.Collection.extend({
    model: DB.UserInvoice,
    initialize: function() {
        this.url = DB.BaseApi + "user/invoices"
    },
    resetUrl: function() {
        this.url = DB.BaseApi + "user/invoices"
    },
    parse: function(a) {
        return a.response
    }
}), DB.View = Backbone.View.extend({
    el: $("body"),
    maximumTitle: 60,
    initialize: function() {
        var a = this;
        a.startDBLoader()
    },
    events: {
        "click .navbar #navbar .navbar-nav .create-new": "toggleCreateDesignModal",
        "click .support_bottom, .box_help_three .close_mess": "toggleSupportBox",
        "click .box_help .close": "closeSupportBox",
        "click .box_help_one .send_mess": "toggleSupportSubmitIssue",
        "keyup .box_help .input_search_help": "triggerSearchFaq",
        "click .box_help .search-btn": "triggerSearchFaq",
        "click .box_help_two .send_mess": "triggerSubmitFaq",
        "click .topbar .userbar-login a, a.nav-login-signup": "popupLoginModal",
        "click #modal-login .login-social a": "triggerSocialLogin",
        "click #modal-login .modal-switch": "triggerSwitchModal",
        "click #modal-login .btn-login": "requestOauthApi",
        "click #modal-contributor #btn-submit": "triggerApplyContributor",
        "click .contact-box #contact-send": "triggerSendContact"
    },
    startDBLoader: function() {
        function a() {
            var a = $("#loading-animation"),
                b = $("#preloader");
            a.fadeOut(), b.delay(c).fadeOut(d)
        }
        var b = this,
            c = 550,
            d = 800;
        a(), $(window).scroll(function() {
            $(".db-navbar").offset().top > 50 ? $(".db-navbar").addClass("top-nav-collapse") : $(".db-navbar").removeClass("top-nav-collapse");
        }), $(".dropdown-toggle").dropdown(), $('[data-toggle="tooltip"]').tooltip(), $(".dropdown").on("show.bs.dropdown", function(a) {
            var b = $(this).find(".dropdown-menu"),
                c = parseInt(b.css("margin-top"));
            b.css({
                "margin-top": c + 10 + "px",
                opacity: 0
            }).animate({
                "margin-top": c + "px",
                opacity: 1
            }, 250, function() {
                $(this).css({
                    "margin-top": ""
                })
            })
        }), $(".dropdown").on("hide.bs.dropdown", function(a) {
            var b = $(this).find(".dropdown-menu"),
                c = parseInt(b.css("margin-top"));
            b.css({
                "margin-top": c + "px",
                opacity: 1,
                display: "block"
            }).animate({
                "margin-top": c + 10 + "px",
                opacity: 0
            }, 250, function() {
                $(this).css({
                    "margin-top": "",
                    display: ""
                })
            })
        }), $(".notice").length > 0 && 1 != b.getCookie("user-hide-notice") && setTimeout(function() {
            $(".notice").removeClass("hidden").addClass("notice-show").find(".btn-gotit").removeAttr("onclick").off("click").on("click", function() {
                b.setCookie("user-hide-notice", 1, 7), $(".notice").removeClass("notice-show"), setTimeout(function() {
                    $(".notice").remove()
                }, 1e3)
            }), $(".notice .btn-send-again").off("click").on("click", function(a) {
                $.ajax({
                    url: "https://accounts.designbold.com/oauth2/v1/api/resend-email",
                    type: "POST",
                    dataType: "json",
                    data: {
                        access_token: DB.Token
                    },
                    success: function(a) {
                        b.pushNotification({
                            type: "success",
                            message: a.msg
                        })
                    }
                })
            })
        }, 5e3), "undefined" != typeof DBRouter && DBRouter instanceof DB.Router && b.startDBClicker()
    },
    startDBClicker: function() {
        $('body a[href]:not([href="#"],[href="javascript:;"],[target="_blank"],[data-stay="true"])').off("click").on("click", function(a) {
            var b = $(a.currentTarget).attr("href");
            if ("undefined" == typeof b) return !0;
            var c = DB.View.prototype.parseURL(b),
                d = c.pathname + c.search;
            return "" != c.hostname && "" != d ? (DBRouter.navigate(d, {
                trigger: !0
            }), !1) : void 0
        })
    },
    delegateDBLoader: function() {
        $(".dropdown").off("show.bs.dropdown"), $(".dropdown").off("hide.bs.dropdown")
    },
    toggleLeftBar: function(a) {
        this.$(".left_fix").toggleClass("active")
    },
    toggleCreateDesignModal: function() {
        var a = this;
        $(".fix-favorite img[data-src]").each(function() {
            var a = this,
                b = $('<img class="animated fadeIn"/>').attr("src", $(a).data("src")).attr("width", $(a).attr("width")).attr("height", $(a).attr("height")).on("load", function() {
                    this.complete && "undefined" != typeof this.naturalWidth && 0 != this.naturalWidth ? $(a).replaceWith(b) : console.log($(a).data("src") + " loading failed.")
                })
        }), $("body").addClass("show-favorite"), $(".fix-favorite").niceScroll({
            cursorcolor: "#00F"
        }), $(".fix-favorite .close-favorite").off("click").on("click", function() {
            $("body").removeClass("show-favorite")
        }), $(".fix-favorite .list_choose li").off("click").on("click", function(b) {
            if ($(".fix-favorite .list_choose li").removeClass("active"), $(b.currentTarget).addClass("active"), "block_custome_dimension" == $(b.currentTarget).data("target")) {
                $(".fix-favorite .item_list_choose .block_custome_dimension").removeClass("hidden"), $(".fix-favorite .item_list_choose ul").addClass("docTypeBlur"), $(".fix-favorite .item_list_choose .block_custome_dimension .docTypeCustomizeButton").on("click", function(a) {
                    var b = $(a.currentTarget).parent().find('input[name="width"]').val(),
                        c = $(a.currentTarget).parent().find('input[name="height"]').val(),
                        d = $(a.currentTarget).parent().find('select[name="unit"]').val();
                    if ("mm" == d) {
                        if (10.583333333332 > b || b > 1322.9166666665 || 10.583333333332 > c || c > 1322.9166666665) return void alert("Width and height must has value between of 10.583333333332 and 1322.9166666665")
                    } else if ("inch" == d) {
                        if (.416666666663 > b || b > 52.08333333333 || .416666666663 > c || c > 52.08333333333) return void alert("Width and height must has value between of 0.416666666663 and 52.08333333333")
                    } else if (40 > b || b > 5e3 || 40 > c || c > 5e3) return void alert("Width and height must has value between of 40 and 5000");
                    $("#custom_dimension_form").submit()
                });
                var c = "px";
                $('.fix-favorite .item_list_choose .block_custome_dimension select[name="unit"]').focus(function(a) {
                    c = $(a.currentTarget).val()
                }), $('.fix-favorite .item_list_choose .block_custome_dimension select[name="unit"]').change(function(b) {
                    var d = $('.fix-favorite .item_list_choose .block_custome_dimension input[name="width"]').val(),
                        e = $('.fix-favorite .item_list_choose .block_custome_dimension input[name="height"]').val();
                    d = "NaN" !== parseFloat(d) ? parseFloat(d) : 0, e = "NaN" !== parseFloat(e) ? parseFloat(e) : 0;
                    var f = $(b.currentTarget).val();
                    d > 0 && $('.fix-favorite .item_list_choose .block_custome_dimension input[name="width"]').val(a.convertUnitValue(d, c, f)), e > 0 && $('.fix-favorite .item_list_choose .block_custome_dimension input[name="height"]').val(a.convertUnitValue(e, c, f)), c = f
                })
            } else $(".fix-favorite .content-choose").removeClass("active").addClass("hidden"), $('.fix-favorite .content-choose[data-category="' + $(b.currentTarget).data("category") + '"]').addClass("active").removeClass("hidden")
        })
    },
    loadTopbarSearchDocument: function() {
        var a = this,
            b = a.page,
            c = 20,
            d = (b - 1) * c;
        a.is_fetching = 1, a.collection.documents.fetch({
            data: {
                start: d,
                limit: c,
                q: a.$('.searchbar input[name="q"]').val(),
                dt: a.$(".searchbar #search_param").val()
            },
            success: function(b) {
                a.render()
            }
        })
    },
    topbarSearchScroll: function() {
        var a = this;
        !a.is_fetching && a.isElementInViewport(a.$(".loading-icon")) && a.loadTopbarSearchDocument()
    },
    convertUnitValue: function(a, b, c) {
        var d;
        return "inch" == b || "in" == b ? d = "px" == c ? 96 * a : "cm" == c ? a / 96 * 2.54 : "mm" == c ? a / 96 * 25.4 : a : "px" == b ? d = "in" == c || "inch" == c ? a / 96 : "cm" == c ? a / 96 / 96 * 2.54 : "mm" == c ? a / 96 / 96 * 25.4 : a : "cm" == b ? d = "in" == c || "inch" == c ? a / 2.54 * 96 : "px" == c ? 96 * a * 96 / 2.54 : "mm" == c ? 10 * a : a : "mm" == b && (d = "in" == c || "inch" == c ? a / 25.4 * 96 : "px" == c ? 96 * a * 96 / 25.4 : "cm" == c ? a / 10 : a), d
    },
    isElementInViewport: function(a) {
        "function" == typeof jQuery && a instanceof jQuery && (a = a[0]);
        var b = a.getBoundingClientRect();
        return 0 == b.top && 0 == b.left && 0 == b.bottom && 0 == b.right ? 0 : b.top >= 0 && b.left >= 0 && b.bottom <= (window.innerHeight || document.documentElement.clientHeight) && b.right <= (window.innerWidth || document.documentElement.clientWidth) ? 1 : 0
    },
    viewDocument: function(a) {
        a.preventDefault(), a.stopPropagation();
        var b = this,
            c = $(a.currentTarget).data("id"),
            d = b.collection.documents.findWhere({
                _id: c
            });
        if ("undefined" == typeof d) return !1;
        if (0 != d.get("viewed") && d.has("viewed")) {
            var e = _.template($("#view-document-tmpl").html())(d.toJSON());
            b.$("#modal-view-document").html(e), b.viewDocumentModal(a)
        } else d.resetUrl(), d.fetch({
            success: function(c, e) {
                d.set("viewed", 1);
                var f = _.template($("#view-document-tmpl").html())(c.toJSON());
                b.$("#modal-view-document").html(f), b.collection.documents.set(d, {
                    remove: !1
                }), b.viewDocumentModal(a)
            }
        });
        var f = location.protocol + "//" + location.host,
            g = $(a.currentTarget).attr("href"),
            h = g.replace(f, "");
        h != g && DBRouter.navigate(h)
    },
    viewDocumentModal: function(a) {
        var b = this,
            c = $(a.currentTarget).data("id"),
            d = b.collection.documents.findWhere({
                _id: c
            });
        b.$("#modal-view-document .view-prev, #modal-view-document .view-next, #modal-view-document .view-left .viewport-inner img").off("click").on("click", b.switchDocumentPageView), b.$("#modal-view-document .view-bar-control .ion-ios-heart").parent().off("click").on("click", b.triggerLikeDocument), b.$("#modal-view-document .ion-chatbubble-working").parent().off("click").on("click", function() {
            b.$("#modal-view-document .comment-field .cm-txt").focus()
        }), b.$("#modal-view-document .comment-field .cm-txt").off("keyup").on("keyup", b.triggerCommentDocument).autosize();
        var e = $(window).height() - 60;
        b.$("#modal-view-document .view-right").css("height", e + "px"), b.$("#modal-view-document .view-left").css("height", e + "px"), b.$("#modal-view-document .viewport").css("height", e + "px"), b.$("#modal-view-document .modal-view, #modal-view-document .view-left, #modal-view-document .view-right, #modal-view-document .viewport").css("min-height", 0), b.$("#modal-view-document .view-left .viewport-inner img").css("max-height", e + "px"), b.$('#modal-view-document .view-left .viewport-inner[data-page="1"] img').on("load", function(a) {
            b.$("#modal-view-document .view-left .viewport-inner i").addClass("hidden"), b.$("#modal-view-document .view-left .viewport-inner img").removeClass("hidden")
        }), b.$("#modal-view-document").modal("show"), b.$("#modal-view-document").on("hidden.bs.modal", function() {
            var b = "undefined" != typeof $(a.currentTarget).data("href") && "" !== $(a.currentTarget).data("href") ? $(a.currentTarget).data("href") : d.get("username");
            DBRouter.navigate(b)
        })
    },
    switchDocumentPageView: function(a) {
        a.preventDefault();
        var b = this,
            c = b.$("#modal-view-document .viewport").data("cur_page"),
            d = b.$("#modal-view-document .viewport").data("total_page");
        $(a.currentTarget).hasClass("view-prev") ? 1 == c ? c = d : c -= 1 : ($(a.currentTarget).hasClass("view-next") || $(a.currentTarget).parent().hasClass("viewport-inner")) && (c == d ? c = 1 : c += 1), b.$("#modal-view-document .viewport-inner").addClass("hidden"), b.$('#modal-view-document .viewport-inner[data-page="' + c + '"]').removeClass("hidden"), b.$("#modal-view-document .viewport").data("cur_page", c)
    },
    triggerLikeDocument: function(a) {
        if (a.preventDefault(), $(a.currentTarget).hasClass("disabled")) return !1;
        var b = this,
            c = $(a.currentTarget).data("id"),
            d = b.collection.documents.findWhere({
                _id: c
            });
        return "undefined" == typeof d ? !1 : ($(a.currentTarget).addClass("disabled"), d.toSaveDocumentLike(), void d.save({}, {
            success: function(c, d) {
                d.response.liked ? ($(a.currentTarget).addClass("liked"), $(a.currentTarget).closest(".grid-item").find(".social-bar .like_count").addClass("liked")) : ($(a.currentTarget).removeClass("liked"), $(a.currentTarget).closest(".grid-item").find(".social-bar .like_count").removeClass("liked")), $(a.currentTarget).parent().hasClass("view-bar-control") ? d.response.liked ? ($(a.currentTarget).html('<i class="ion-ios-heart"></i> Unlike'), b.$("#modal-view-document .view-right .social-bar .ion-ios-heart").parent().addClass("liked").html('<i class="ion-ios-heart"></i> ' + d.response.total_likes)) : ($(a.currentTarget).html('<i class="ion-ios-heart"></i> Like'), b.$("#modal-view-document .view-right .social-bar .ion-ios-heart").parent().removeClass("liked").html('<i class="ion-ios-heart"></i> ' + d.response.total_likes)) : $(a.currentTarget).closest(".grid-item").find(".social-bar .like_count").html('<i class="ion-ios-heart"></i> ' + d.response.total_likes), $(a.currentTarget).removeClass("disabled")
            },
            error: function(c, d) {
                b.pushNotification({
                    type: "error",
                    message: d.responseJSON.msg
                }), $(a.currentTarget).removeClass("disabled")
            }
        }))
    },
    getCaret: function(a) {
        if (a.selectionStart) return a.selectionStart;
        if (document.selection) {
            a.focus();
            var b = document.selection.createRange();
            if (null == b) return 0;
            var c = a.createTextRange(),
                d = c.duplicate();
            return c.moveToBookmark(b.getBookmark()), d.setEndPoint("EndToStart", c), d.text.length
        }
        return 0
    },
    triggerCommentDocument: function(a) {
        if ($(a.currentTarget).hasClass("disabled")) return !1;
        var b = this,
            c = $(a.currentTarget).data("id"),
            d = b.collection.documents.findWhere({
                _id: c
            }),
            e = $(a.currentTarget).val();
        if ("undefined" == typeof d) return !1;
        if (27 == a.keyCode) $(a.currentTarget).val("");
        else if (13 == a.keyCode) {
            if (a.shiftKey) {
                var f = b.getCaret(b);
                return b.value = e.substring(0, f - 1) + "\n" + e.substring(f, e.length), !0
            }
            return e = e.trim(), "" == e ? !1 : ($(a.currentTarget).blur(), $(a.currentTarget).addClass("disabled"), d.toSaveDocumentComment(), d.save({
                comment: e
            }, {
                patch: !0,
                success: function(c, d) {
                    var c = c.toJSON();
                    c.comment = e;
                    var f = _.template($("#document-comment-tmpl").html())(c),
                        g = $(a.currentTarget).data("loc");
                    $(f).insertBefore($(a.currentTarget).parent()), "undefined" != typeof g || ($(a.currentTarget).closest(".grid-item").find(".comments-num").html('<i class="ion-chatbubble-working"></i> ' + d.response.total_comments), b.$grid.masonry()), $(a.currentTarget).val("").removeClass("disabled").trigger("autosize.resize"), b.$grid.masonry()
                },
                error: function(c, d) {
                    b.pushNotification({
                        type: "error",
                        message: d.responseJSON.msg
                    }), $(a.currentTarget).removeClass("disabled")
                }
            }), !1)
        }
    },
    popupCenterWindow: function(a, b, c, d) {
        var e = void 0 != window.screenLeft ? window.screenLeft : screen.left,
            f = void 0 != window.screenTop ? window.screenTop : screen.top,
            g = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width,
            h = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height,
            i = g / 2 - c / 2 + e,
            j = h / 2 - d / 2 + f;
        if (-1 != navigator.userAgent.indexOf("Safari") && -1 == navigator.userAgent.indexOf("Chrome")) window.location.href = a;
        else {
            window.open(a, b, "scrollbars=yes, width=" + c + ", height=" + d + ", top=" + j + ", left=" + i, "_blank");
            window.focus
        }
    },
    setCookie: function(a, b, c) {
        "undefined" == typeof c && (c = 7300);
        var d = new Date;
        d.setTime(d.getTime() + 24 * c * 60 * 60 * 1e3);
        var e = "expires=" + d.toUTCString();
        document.cookie = a + "=" + b + "; " + e
    },
    getCookie: function(a) {
        var b = document.cookie.split(a + "=");
        return 2 == b.length ? b.pop().split(";").shift() : null
    },
    expireCookie: function(a) {
        document.cookie = encodeURIComponent(a) + "=deleted; expires=" + new Date(0).toUTCString() + "; path=/"
    },
    setStorageData: function(a, b) {
        return "undefined" != typeof Storage ? (localStorage[a] = b, !0) : !1
    },
    getStorageData: function(a) {
        return "undefined" != typeof Storage && "undefined" != typeof localStorage[a] ? localStorage[a] : null
    },
    removeStorageData: function(a) {
        return "undefined" != typeof Storage && localStorage.removeItem(a), !1
    },
    popupLoginModal: function(a) {
        window.clicked_element = null, "function" != typeof window.loginCallback && (window.loginCallback = function() {
            null != window.clicked_element ? window.location.href = $(window.clicked_element.currentTarget).attr("href") : window.location.reload(!0)
        }), "function" != typeof window.signUpComplete && (window.signUpComplete = function(a, b) {
            "undefined" != typeof b && b ? 5 == b ? $("#modal-login .error-noti").html("<p>You have cancelled the social signup.</p>") : $("#modal-login .error-noti").html("<p>Sorry, some unexpected errors occur while sign you up. Please try again later.</p>") : (window.loginCallback(), $("#modal-login .error-noti").empty())
        }), $("#modal-login").find(".panel-login, .panel-signup").addClass("hidden");
        var b = "login";
        "undefined" != typeof a && "undefined" != typeof a.currentTarget && (b = $(a.currentTarget).data("target")), "login" == b ? $("#modal-login .panel-login").removeClass("hidden") : $("#modal-login .panel-signup").removeClass("hidden"), $("#modal-login").modal("show")
    },
    popupLoginRegister: function(a) {
        var b = this,
            c = $(a.currentTarget).data("href"),
            d = $(a.currentTarget).data("title"),
            e = 440,
            f = 460;
        b.popupCenterWindow(c, d, e, f)
    },
    triggerSocialLogin: function(a) {
        var b = this;
        $("#modal-login .error-noti").empty(), b.popupLoginRegister(a)
    },
    triggerSwitchModal: function(a) {
        var b = $(a.currentTarget).data("target");
        $("#modal-login .error-noti").empty(), "login" == b ? ($("#modal-login .panel-login").removeClass("hidden"), $("#modal-login .panel-signup").addClass("hidden")) : ($("#modal-login .panel-login").addClass("hidden"), $("#modal-login .panel-signup").removeClass("hidden"))
    },
    requestOauthApi: function(a) {
        var b = this,
            c = $(a.currentTarget).data("target"),
            d = new DB.User;
        if ($("#modal-login .error-noti").empty(), "login" == c) {
            var e = $('#modal-login .panel-login input[name="email"]').val(),
                f = $('#modal-login .panel-login input[name="password"]').val();
            d.toOauthLogin()
        } else {
            var e = $('#modal-login .panel-signup input[name="email"]').val(),
                f = $('#modal-login .panel-signup input[name="password"]').val();
            d.toOauthRegister()
        }
        d.save({}, {
            emulateJSON: !0,
            data: {
                email: e,
                password: f
            },
            success: function(a, c) {
                $("#modal-login .error-noti").html('<p style="color:green;">' + c.msg + "</p>"), window.loginCallback(b, JSON.stringify(c.response.user))
            },
            error: function(a, b) {
                $("#modal-login .error-noti").html("<p>" + b.responseJSON.msg + "</p>")
            }
        }), d.resetUrl()
    },
    toggleSupportBox: function(a) {
        a.preventDefault();
        var b = this;
        "undefined" == typeof b.collection.faqs && (b.collection.faqs = new DB.Faqs), b.$(".support_bottom").addClass("disabled"), b.$(".box_help").addClass("hidden"), b.$(".box_help_one").removeClass("hidden"), 0 == b.$(".box_help_one .list_result_search_help li").length && b.collection.faqs.fetch({
            reset: !0,
            data: {
                pin: 1
            },
            success: function(a, c) {
                var d = _.template($("#bottom_faq_tmpl").html());
                b.$(".box_help_one .list_result_search_help .loading").addClass("hidden"), _.each(a.toJSON(), function(a) {
                    var c = d(a);
                    b.$(".box_help_one .list_result_search_help").append(c)
                }), _.bindAll(b, "bindViewFaqDetail"), b.bindViewFaqDetail()
            }
        })
    },
    closeSupportBox: function(a) {
        a.preventDefault();
        var b = this;
        b.$(".box_help").addClass("hidden"), b.$(".support_bottom").removeClass("disabled")
    },
    bindViewFaqDetail: function() {
        var a = this;
        a.$(".box_help_one .list_result_search_help a").on("click", function(b) {
            b.preventDefault(), b.stopPropagation(), a.$(".box_help_three .content_help").children().not(".close_mess, .input-group").remove();
            var c = $(b.currentTarget).data("id");
            isNaN(c) || (c = c.toString());
            var d = a.collection.faqs.findWhere({
                    _id: c
                }),
                e = _.template($("#bottom_faq_detail_tmpl").html())(d.toJSON());
            $(e).insertBefore(a.$(".box_help_three .content_help .close_mess")), a.$(".box_help").addClass("hidden"), a.$(".box_help_three").removeClass("hidden")
        })
    },
    toggleSupportSubmitIssue: function(a) {
        a.preventDefault();
        var b = this;
        $(a.currentTarget).hasClass("guest_user") ? b.popupLoginModal(a) : (b.$(".box_help").addClass("hidden"), b.$(".box_help_two").removeClass("hidden"), b.$(".box_help_two .close_mess").on("click", function(c) {
            c.preventDefault(), b.$(".box_help").addClass("hidden"), $(a.currentTarget).closest(".box_help").removeClass("hidden")
        }))
    },
    triggerSubmitFaq: function(a) {
        a.preventDefault();
        var b = this,
            c = new DB.Faq,
            d = b.$('.box_help_two input[name="subject"]').val(),
            e = b.$('.box_help_two textarea[name="description"]').val();
        return "" == d ? (alert("Please enter subject!"), !1) : "" == e ? (alert("Please describe your problem."), !1) : (b.$(".box_help_two .send_mess").addClass("disabled"), c.toSubmitIssue(), c.save({}, {
            data: {
                subject: d,
                description: e
            },
            emulateJSON: !0,
            success: function(a, c) {
                b.pushNotification({
                    type: "success",
                    message: c.msg
                }), b.$('.box_help_two input[name="subject"]').val(""), b.$('.box_help_two textarea[name="description"]').val(""), b.$(".box_help_two .send_mess").removeClass("disabled"), b.$(".box_help_two .close_mess").trigger("click")
            },
            error: function(a, c) {
                b.pushNotification({
                    type: "error",
                    message: c.responseJSON.msg
                }), b.$(".box_help_two .send_mess").removeClass("disabled")
            }
        }), c.resetUrl(), void 0)
    },
    triggerSearchFaq: function(a) {
        a.preventDefault();
        var b = this,
            c = $(a.currentTarget).parent().find(".input_search_help").val();
        return $(a.currentTarget).hasClass("search-btn") || 13 == a.keyCode ? void(c.length < 3 ? alert("Please type at least 3 characters to search.") : (b.$(".box_help .input_search_help").addClass("disabled").val(c), b.$(".box_help").addClass("hidden"), b.$(".box_help_one").removeClass("hidden"), b.$(".box_help_one .list_result_search_help").children().not(".loading").remove(), b.$(".box_help_one .list_result_search_help .loading").removeClass("hidden"), b.collection.faqs.fetch({
            reset: !0,
            data: {
                q: c,
                start: 0,
                limit: 20
            },
            success: function(a, c) {
                var d = _.template($("#bottom_faq_tmpl").html());
                b.$(".box_help_one .list_result_search_help .loading").addClass("hidden"), _.each(a.toJSON(), function(a) {
                    var c = d(a);
                    b.$(".box_help_one .list_result_search_help").append(c)
                }), _.bindAll(b, "bindViewFaqDetail"), b.bindViewFaqDetail(), b.$(".box_help .input_search_help").removeClass("disabled")
            }
        }))) : !1
    },
    triggerValidateEmail: function(a) {
        var b = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return b.test(a)
    },
    triggerValidateMobile: function(a) {
        var b = /^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$/i;
        return b.test(a)
    },
    pushNotification: function(a) {
        if ("undefined" == typeof a.message) return !1;
        if ($('body .notify-block .notify[data-message="' + a.message.replace(/[^\w\s]/gi, "") + '"]').length) return !1;
        "undefined" == typeof a.position && (a.position = "bl"), "undefined" == typeof a.type && (a.type = "info");
        var b = _.template($("#new_notification_tmpl").html()),
            c = b(a),
            d = $(c);
        "tr" == a.position ? $("body .notity-top-right").append(d) : "br" == a.position ? $("body .notity-bottom-right").append(d) : $("body .notity-bottom-left").append(d), ("undefined" == typeof a.pin || 1 != a.pin) && setTimeout(function() {
            d.fadeOut(1e3, function() {
                this.remove()
            })
        }, 5e3)
    },
    popupConfirm: function(a, b, c) {
        var d = _.template($("#new_confirmation_tmpl").html());
        if ("undefined" == typeof a) e = "Do you really want to continue;";
        else if ("object" == typeof a) var e = "undefined" != typeof a.message ? a.message : "Do you really want to continue;",
            f = "undefined" != typeof a.yes_title ? a.yes_title : "Yes",
            g = "undefined" != typeof a.cancel_title ? a.cancel_title : "Cancel";
        else var e = a;
        var h = d({
                message: e,
                yes_title: f || "Yes",
                cancel_title: g || "Cancel"
            }),
            i = $(h),
            j = i.find(".modal");
        $("body").addClass("modal-open").append(i), j.addClass("in").show().find(".btn-yes, .btn-cancel").click(function(a) {
            j.removeClass("in").hide(), $("body").removeClass("modal-open"), i.remove(), $(a.currentTarget).hasClass("btn-yes") && "function" == typeof b && b(), $(a.currentTarget).hasClass("btn-cancel") && "function" == typeof c && c()
        })
    },
    stripHtml: function(a) {
        var b = document.createElement("DIV");
        return b.innerHTML = a, b.textContent || b.innerText || ""
    },
    trimString: function(a, b) {
        if (a.length <= b) return a;
        var c = a.substr(0, b);
        return c.substr(0, Math.min(c.length, c.lastIndexOf(" ")))
    },
    fakeClick: function(a, b) {
        if (b.click) b.click();
        else if (document.createEvent && a.target !== b) {
            var c = document.createEvent("MouseEvents");
            c.initMouseEvent("click", !0, !0, window, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, null);
            b.dispatchEvent(c)
        }
    },
    parseURL: function(a) {
        var b, c, d, e = document.createElement("a"),
            f = {};
        for (e.href = a, b = e.search.replace(/^\?/, "").split("&"), d = 0; d < b.length; d++) c = b[d].split("="), f[c[0]] = c[1];
        return {
            protocol: e.protocol,
            host: e.host,
            hostname: e.hostname,
            port: e.port,
            pathname: e.pathname,
            search: e.search,
            searchObject: f,
            hash: e.hash
        }
    },
    triggerApplyContributor: function() {
        var a = this,
            b = a.$('#modal-contributor input[name="name"]').val(),
            c = a.$('#modal-contributor input[name="email"]').val(),
            d = a.$('#modal-contributor input[name="mobile"]').val(),
            e = [],
            f = a.$('#modal-contributor input[name="agree_term"]').is(":checked"),
            g = function(b, c) {
                a.$("#modal-contributor #contributor-message").html(_.template($("#new_modal_notice_tmpl").html())({
                    type: b,
                    message: c
                })).find(".ion-android-close").off("click").on("click", function() {
                    a.$("#modal-contributor #contributor-message").empty()
                })
            };
        if (a.$('#modal-contributor input[name="design_url[]"]').each(function() {
                e.push($(this).val())
            }), a.$("#modal-contributor #contributor-message").empty(), a.$("#modal-contributor .form-group").removeClass("has-error"), f)
            if ("" == b) a.$('#modal-contributor input[name="name"]').parents(".form-group").addClass("has-error"), g("error", "Please enter your name.");
            else if (a.triggerValidateEmail(c))
                if ("" == d) a.$('#modal-contributor input[name="mobile"]').parents(".form-group").addClass("has-error"), g("error", "Please enter a valid contact numbers.");
                else if (2 != e.length) a.$('#modal-contributor input[name="design_url[]"]').parents(".form-group").addClass("has-error"), g("error", "Please enter at least two url of your designs using DesignBold tools.");
                else {
                    var h = new DB.User({
                        name: b,
                        email: c,
                        mobile: d,
                        design_url: e,
                        agree_term: f
                    });
                    h.toApplyContributor(), h.save({}, {
                        success: function(b, c) {
                            a.$("#modal-contributor input").val(""), g("info", c.msg)
                        },
                        error: function(a, b) {
                            g("error", b.responseJSON.msg)
                        }
                    })
                } else a.$('#modal-contributor input[name="email"]').parents(".form-group").addClass("has-error"), g("error", "Please enter a valid email.");
        else g("error", "Please agree with our Terms & Conditions.")
    },
    triggerSendContact: function() {
        var a = this,
            b = a.$('.contact-box input[name="name"]').val(),
            c = a.$('.contact-box input[name="email"]').val(),
            d = a.$('.contact-box textarea[name="content"]').val(),
            e = function(b, c) {
                a.$(".contact-box #contact-message").html(_.template($("#new_modal_notice_tmpl").html())({
                    type: b,
                    message: c
                })).find(".ion-android-close").off("click").on("click", function() {
                    a.$(".contact-box #contact-message").empty()
                })
            };
        if (a.$(".contact-box #contact-message").empty(), a.$(".contact-box .form-group").removeClass("has-error"), "" == b) a.$('.contact-box input[name="name"]').parents(".form-group").addClass("has-error"), e("error", "Please enter your name.");
        else if (a.triggerValidateEmail(c))
            if ("" == d) a.$('.contact-box textarea[name="content"]').parents(".form-group").addClass("has-error"), e("error", "Please enter some information about your request.");
            else {
                var f = new DB.User({
                    name: b,
                    email: c,
                    content: d
                });
                f.toSendContact(), f.save({}, {
                    success: function(b, c) {
                        a.$(".contact-box input").val(""), a.$(".contact-box textarea").val(""), e("info", c.msg)
                    },
                    error: function(a, b) {
                        e("error", b.responseJSON.msg)
                    }
                })
            }
        else a.$('.contact-box input[name="email"]').parents(".form-group").addClass("has-error"), e("error", "Please enter a valid email.")
    }
}), DB.Router = Backbone.Router.extend({
    routes: {
        welcome: "redirector",
        login: "redirector",
        "login/designbold": "redirector",
        register: "redirector",
        logout: "redirector",
        account: "account",
        "account/verify/:token": "redirector",
        "account/reset/:token": "redirector",
        invoices: "invoices",
        "workspace(/:target)(/:label_id)": "workspace",
        "design/discover(/)": "redirector",
        "design/trial(/)": "redirector",
        "token/refresh": "redirector",
        support: "redirector",
        "tutorial(s)(/:uri)": "redirector",
        "blog(/:uri)": "redirector",
        "collection(/:slug)(/q/:keyword)": "collection",
        "stream(/q/:keyword)": "stream",
        "users(/:alphabet)(/q/:keyword)": "users",
        "design/view/:_id(/:token)": "design_view",
        ":username(/:tab)": "profile",
        "*a": "redirector"
    },
    initialize: function(a) {
        var b = this;
        if (b.topbar_view = new DB.TopbarView(a), "undefined" != typeof a && "undefined" != typeof a.header_all_doctype && "undefined" != typeof a.header_all_doctype_alb && "undefined" != typeof a.session_user) {
            var c = _.template($("#create-design-tmpl").html())({
                session_user: jQuery.parseJSON(a.session_user),
                header_all_doctype: jQuery.parseJSON(a.header_all_doctype),
                header_all_doctype_alb: jQuery.parseJSON(a.header_all_doctype_alb)
            });
            $("body").append(c)
        }
    },
    collection: function(a, b) {
        null == a && (a = "all"), null == b && (b = "");
        var c = this,
            d = function(a, b) {
                var d = _.template($("#collection-tmpl").html())(c.collection_data.data);
                $("#db_app_content").html(d);
                var e = new DB.Medias;
                e.toFetchLayouts(), "undefined" != typeof c.DBView && (c.DBView.undelegateEvents(), c.DBView.delegateDBLoader()), c.DBView = new DB.CollectionView({
                    collection: e,
                    doctype: a,
                    keyword: b
                }), c.DBView.startDBLoader(), c.DBView.loadLayouts()
            };
        c.topbar_view.toggleTopbarNav("collection"), "undefined" != typeof c.collection_data ? d(a, b) : $.ajax({
            url: window.location.href,
            dataType: "json",
            success: function(e) {
                c.collection_data = e, $("body").append(JSON.parse(c.collection_data.tmpl)), d(a, b)
            }
        })
    },
    stream: function(a) {
        null == a && (a = "");
        var b = this,
            c = function(a) {
                var c = _.template($("#stream-tmpl").html())(b.stream_data.data);
                $("#db_app_content").html(c);
                var d = new DB.Documents,
                    e = new DB.DocumentTypes;
                "undefined" != typeof b.DBView && (b.DBView.undelegateEvents(), b.DBView.delegateDBLoader()), b.DBView = new DB.StreamView({
                    collection: {
                        documents: d,
                        doctypes: e
                    },
                    keyword: a
                }), b.DBView.startDBLoader(), b.DBView.loadDocuments()
            };
        b.topbar_view.toggleTopbarNav("stream"), "undefined" != typeof b.stream_data ? c(a) : $.ajax({
            url: window.location.href,
            dataType: "json",
            success: function(d) {
                b.stream_data = d, $("body").append(JSON.parse(b.stream_data.tmpl)), c(a)
            }
        })
    },
    users: function(a, b) {
        null == a && (a = "all"), null == b && (b = "");
        var c = this,
            d = function(a, b) {
                $("body").append(JSON.parse(c.users_data.tmpl));
                var d = _.template($("#users-tmpl").html())(c.users_data.data);
                $("#db_app_content").html(d);
                var e = new DB.Users;
                "undefined" != typeof c.DBView && (c.DBView.undelegateEvents(), c.DBView.delegateDBLoader()), c.DBView = new DB.UsersView({
                    collection: e,
                    alphabet: a,
                    keyword: b
                }), c.DBView.startDBLoader(), c.DBView.loadUsers()
            };
        c.topbar_view.toggleTopbarNav("users"), "undefined" != typeof c.users_data ? d(a, b) : $.ajax({
            url: window.location.href,
            dataType: "json",
            success: function(e) {
                c.users_data = e, d(a, b)
            }
        })
    },
    design_view: function(a) {
        if (-1 != ["stream", "profile"].indexOf($(".navbar-nav.navbar-left li.current").data("tab"))) return !1;
        var b = this;
        "undefined" != typeof b.design_view_data ? b.profile(b.design_view_data.data.user.username, "profile", b.design_view_data) : $.ajax({
            url: window.location.href,
            dataType: "json",
            success: function(a) {
                b.design_view_data = a, $("body").append(JSON.parse(b.design_view_data.tmpl)), b.profile(b.design_view_data.data.user.username, "profile", b.design_view_data)
            }
        })
    },
    profile: function(a, b, c) {
        if (null == a) return alert("Sorry, you have gone to restricted area!"), window.location.href = "/", !1;
        null == b && (b = "design");
        var d = this,
            e = function(a, b, c) {
                d.profile_data_current = c, c.data.tab = b;
                var e = _.template($("#profile-tmpl").html())(c.data);
                $("#db_app_content").html(e);
                var f = "undefined" != typeof c.data.user.hash_id ? c.data.user.hash_id : "me",
                    g = new DB.User({
                        _id: f,
                        link: $(".show_cover .thumb").attr("href")
                    });
                if (g.set(c.data.user), "followers" == b) {
                    $(".bar-doctype-profile .list_info_user").data("target", "followers").find("li").removeClass("active"), $('.bar-doctype-profile .list_info_user li[data-target="followers"]').addClass("active");
                    var h = new DB.Users;
                    h.toFetchUserFollowers(f), "undefined" != typeof d.DBView && (d.DBView.undelegateEvents(), d.DBView.delegateDBLoader()), d.DBView = new DB.ProfileView({
                        collection: {
                            user: g,
                            followers: h
                        }
                    }), d.DBView.startDBLoader(), d.DBView.loadUserFollowers()
                } else if ("following" == b) {
                    $(".bar-doctype-profile .list_info_user").data("target", "following").find("li").removeClass("active"), $('.bar-doctype-profile .list_info_user li[data-target="following"]').addClass("active");
                    var h = new DB.Users;
                    h.toFetchUserFollowing(f), "undefined" != typeof d.DBView && (d.DBView.undelegateEvents(), d.DBView.delegateDBLoader()), d.DBView = new DB.ProfileView({
                        collection: {
                            user: g,
                            followers: h
                        }
                    }), d.DBView.startDBLoader(), d.DBView.loadUserFollowing()
                } else {
                    $(".bar-doctype-profile .list_info_user").data("target", "design").find("li").removeClass("active"), $('.bar-doctype-profile .list_info_user li[data-target="design"]').addClass("active");
                    var i = new DB.Documents;
                    if (i.toFetchUserDocument(f), "undefined" != typeof d.DBView && (d.DBView.undelegateEvents(), d.DBView.delegateDBLoader()), "undefined" != typeof c.data.document) {
                        var j = new DB.Document({
                            _id: c.data.document._id
                        });
                        j.set(c.data.document), d.DBView = new DB.ProfileView({
                            model: j,
                            collection: {
                                user: g,
                                documents: i
                            }
                        }), d.DBView.startDBLoader(), d.DBView.startViewDocument(), d.DBView.loadUserDocuments()
                    } else d.DBView = new DB.ProfileView({
                        collection: {
                            user: g,
                            documents: i
                        }
                    }), d.DBView.startDBLoader(), d.DBView.loadUserDocuments()
                }
            };
        d.topbar_view.toggleTopbarNav("profile"), "undefined" == typeof d.profile_data && (d.profile_data = []), "undefined" != typeof c && null != c ? e(a, b, c) : "undefined" != typeof d.profile_data[a] ? e(a, b, d.profile_data.username) : $.ajax({
            url: window.location.href,
            dataType: "json",
            success: function(c) {
                d.profile_data.username = c, $("body").append(JSON.parse(d.profile_data.username.tmpl)), e(a, b, d.profile_data.username)
            }
        })
    },
    workspace: function(a, b) {
        null == a && (a = "my-design"), null == b && (b = "");
        var c = this,
            d = function(a, b) {
                var d = _.template($("#workspace-tmpl").html())(c.workspace_data.data);
                $("#db_app_content").html(d);
                var e = c.workspace_data.data.user.hash_id,
                    f = new DB.User({
                        _id: e
                    }),
                    g = new DB.Documents;
                g.toFetchUserDocument(e);
                var h = new DB.UserLabels;
                "undefined" != typeof c.workspace_data.data.user_labels && h.set(c.workspace_data.data.user_labels), "undefined" != typeof c.DBView && (c.DBView.undelegateEvents(), c.DBView.delegateDBLoader()), c.DBView = new DB.WorkspaceView({
                    target: a,
                    label_id: b,
                    model: f,
                    collection: {
                        labels: h,
                        documents: g
                    }
                }), c.DBView.startDBLoader(), c.DBView.loadWorkspaceDocuments()
            };
        c.topbar_view.toggleTopbarNav("profile"), "undefined" != typeof c.workspace_data ? d(a, b) : $.ajax({
            url: window.location.href,
            dataType: "json",
            success: function(e) {
                c.workspace_data = e, $("body").append(JSON.parse(c.workspace_data.tmpl)), d(a, b)
            }
        })
    },
    account: function() {
        var a = this,
            b = function() {
                var b = _.template($("#account-tmpl").html())(a.account_data.data);
                $("#db_app_content").html(b);
                var c = new DB.User({
                    _id: a.account_data.data.user.hash_id
                });
                "undefined" != typeof a.DBView && (a.DBView.undelegateEvents(), a.DBView.delegateDBLoader()), a.DBView = new DB.AccountView({
                    model: c
                }), a.DBView.startDBLoader()
            };
        a.topbar_view.toggleTopbarNav("profile"), "undefined" != typeof a.account_data ? b() : $.ajax({
            url: window.location.href,
            dataType: "json",
            success: function(c) {
                a.account_data = c, $("body").append(JSON.parse(a.account_data.tmpl)), b()
            }
        })
    },
    invoices: function() {
        var a = this,
            b = function() {
                var b = _.template($("#invoices-tmpl").html())(a.invoices_data.data);
                $("#db_app_content").html(b);
                var c = new DB.User({
                    _id: a.invoices_data.data.user.hash_id
                });
                "undefined" != typeof a.DBView && (a.DBView.undelegateEvents(), a.DBView.delegateDBLoader());
                var d = new DB.UserInvoices;
                a.DBView = new DB.InvoicesView({
                    collection: {
                        user: c,
                        invoices: d
                    }
                }), a.DBView.startDBLoader(), a.DBView.loadUserInvoices()
            };
        a.topbar_view.toggleTopbarNav("profile"), "undefined" != typeof a.invoices_data ? b() : $.ajax({
            url: window.location.href,
            dataType: "json",
            success: function(c) {
                a.invoices_data = c, $("body").append(JSON.parse(a.invoices_data.tmpl)), b()
            }
        })
    },
    redirector: function() {
        window.location.reload()
    }
}), DB.StaticRouter = Backbone.Router.extend({
    routes: {
        contributor: "contributor",
        "contributor/apply": "contributor_apply"
    },
    initialize: function() {
        var a = this;
        a.dbView = new DB.View
    },
    contributor: function() {
        var a = this;
        $('a[data-action="apply"]').off("click").on("click", function() {
            $("#modal-login").length > 0 ? (a.navigate("contributor/apply", {
                trigger: !1
            }), a.dbView.popupLoginModal()) : $("#modal-contributor").modal("show")
        })
    },
    contributor_apply: function() {
        var a = this;
        a.contributor(), $("#modal-login").length > 0 ? a.dbView.popupLoginModal() : $("#modal-contributor").modal("show")
    }
});
var DBRouter = {};
var DB = DB || {};
DB.zoomRate = 1, DB.loadedFont = {
    Helvetica: !0,
    "Times New Roman": !0
}, DB.fontSize = [12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 48, 56, 64, 72, 80, 88, 96, 104, 120, 144],
    DB.zoomList = [12.5, 16.7, 25, 33.3, 50, 67, 100, 150, 200, 300, 400, 500], DB.filterPreset = JSON.parse('[{"name":"The Blues","blur":-14,"brightness":63,"contrast":-37,"tint":0,"saturation":-26,"vignette":0,"xpro":-23},{"name":"Edge","blur":-53,"brightness":10,"contrast":-24,"tint":49,"saturation":26,"vignette":0,"xpro":29},{"name":"Selfie","brightness":10,"contrast":-12,"tint":-50,"saturation":-12,"vignette":56,"xpro":50},{"name":"Festive","blur":-7,"brightness":10,"contrast":21,"saturation":24,"xpro":40},{"name":"Rosie","blur":-14,"brightness":0,"contrast":55,"tint":-73,"saturation":-28,"vignette":0,"xpro":27},{"name":"Drama","blur":0,"brightness":-10,"contrast":21,"tint":60,"saturation":-34,"vignette":50,"xpro":80},{"name":"Epic","blur":1,"brightness":6,"contrast":20,"saturation":-14,"vignette":39,"xpro":50},{"name":"Grayscale","brightness":15,"contrast":-20,"saturation":-100},{"name":"Nordic","blur":0,"brightness":15,"contrast":-16,"tint":0,"saturation":-50,"vignette":0,"xpro":0},{"name":"Summer","blur":0,"brightness":10,"contrast":14,"tint":-46,"saturation":18,"vignette":25,"xpro":30},{"name":"Street","blur":-7,"brightness":-7,"contrast":21,"tint":0,"saturation":-95,"vignette":50,"xpro":0},{"name":"Retro","blur":0,"brightness":0,"contrast":-14,"tint":14,"saturation":-18,"vignette":40,"xpro":69},{"name":"Whimsical","blur":-19,"brightness":43,"contrast":-15,"tint":-79,"saturation":-53,"vignette":21,"xpro":60},{"name":"Cali","blur":0,"brightness":22,"contrast":-46,"tint":0,"saturation":38,"vignette":0,"xpro":27}]'), DB.elementMedias = [], DB.filterLocked = !1, DB.presetPerPage = 5, DB.curPresetPage = 1, DB.filterQueue = {}, DB.defaultColorPalette = ["#124E79", "#BB1854", "#198819", "#137BFF", "#675661", "#E08F29"], DB.colorPalette = [], DB.actionArray = [], DB.currentHistory = 0, $.fn.forceLayout = function() {
    if (0 === this.length) return this;
    var a = this.get(0);
    return (a = window.getComputedStyle(a)) && a.getPropertyValue("left"), this
}, element.prototype.renderElement = function(a) {
    var b = $('<div class="element ' + this.type + '"></div>');
    a ? this.pageWrap.find(".elements").prepend(b) : this.pageWrap.find(".elements").append(b), b.css({
        width: this.width * DB.zoomRate,
        height: this.height * DB.zoomRate,
        transform: "translate3d(" + this.left * DB.zoomRate + "px, " + this.top * DB.zoomRate + "px, 0px) rotateZ(" + this.rotation + "deg)",
        opacity: (100 - this.transparency) / 100
    }).data({
        width: this.width,
        height: this.height,
        left: this.left,
        top: this.top,
        rotation: this.rotation,
        opacity: this.transparency
    }), this.element = b, this.setDataIndex()
}, element.prototype.selectElement = function() {
    this.element.addClass("selected"), this.pageWrap.addClass("selected"), $(".context-menu").remove();
    var a = _.template($("#main_context_menu_tmpl").html());
    $("#design-editor").append(a), $(".context-menu").addClass(this.type + "-context"), $("#selected-border").removeClass("hidden").css({
        width: this.width * DB.zoomRate,
        height: this.height * DB.zoomRate,
        transform: "translate3d(" + (this.left * DB.zoomRate + parseInt(this.pageWrap.css("left"), 10)) + "px, " + (this.top * DB.zoomRate + parseInt(this.pageWrap.css("top"), 10)) + "px, 0px) rotateZ(" + this.rotation + "deg)"
    }), $('[id$="-handle"]').removeClass("hidden"), $("#top-line-guide, #middle-line-guide, #bottom-line-guide, #left-line-guide, #center-line-guide, #right-line-guide").addClass("hidden").removeAttr("style"), this.checkOctant()
}, element.prototype.deselectElement = function() {
    this.element.removeClass("selected"), $(".context-menu").remove(), $("#selected-border").addClass("hidden").removeAttr("style"), $('[id$="-handle"]').addClass("hidden")
}, element.prototype.getIndex = function() {
    return this.element.index()
}, element.prototype.setDataIndex = function(a) {
    this.elementIndex = a || this.getIndex()
}, element.prototype.snapMoveAndResize = function(a) {
    function b(b, c) {
        return a || (a = 1), b = Math.round(b), c = Math.round(c), c >= b - a && b + a >= c ? !0 : !1
    }
    var c = 0,
        d = c + this.pageWrap.data("height") * DB.zoomRate / 2,
        e = c + this.pageWrap.data("height") * DB.zoomRate,
        f = 0,
        g = c + this.pageWrap.data("width") * DB.zoomRate / 2,
        h = c + this.pageWrap.data("width") * DB.zoomRate,
        i = this.top,
        j = i + this.height / 2,
        k = i + this.height,
        l = this.left,
        m = l + this.width / 2,
        n = l + this.width,
        o = this.left,
        p = this.top,
        q = 40,
        r = 0;
    $("#top-line-guide, #middle-line-guide, #bottom-line-guide, #left-line-guide, #center-line-guide, #right-line-guide").addClass("hidden").removeAttr("style"), b(i, c) && (p = c, $("#top-line-guide").removeClass("hidden").css({
        width: this.pageWrap.data("width") * DB.zoomRate,
        top: parseInt(this.pageWrap.css("top"), 10),
        left: parseInt(this.pageWrap.css("left"), 10)
    })), b(j, d) && (p = d - this.height / 2, $("#middle-line-guide").removeClass("hidden").css({
        width: this.pageWrap.data("width") * DB.zoomRate,
        top: parseInt(this.pageWrap.css("top"), 10) + this.pageWrap.data("height") * DB.zoomRate / 2,
        left: parseInt(this.pageWrap.css("left"), 10)
    })), b(k, e) && (p = e - this.height, $("#bottom-line-guide").removeClass("hidden").css({
        width: this.pageWrap.data("width") * DB.zoomRate,
        top: parseInt(this.pageWrap.css("top"), 10) + this.pageWrap.data("height") * DB.zoomRate,
        left: parseInt(this.pageWrap.css("left"), 10)
    })), b(l, f) && (o = f, $("#left-line-guide").removeClass("hidden").css({
        height: this.pageWrap.data("height") * DB.zoomRate,
        left: parseInt(this.pageWrap.css("left"), 10) + r,
        top: parseInt(this.pageWrap.css("top"), 10)
    })), b(m, g) && (o = g - this.width / 2, $("#center-line-guide").removeClass("hidden").css({
        height: this.pageWrap.data("height") * DB.zoomRate,
        left: parseInt(this.pageWrap.css("left"), 10) + r + this.pageWrap.data("width") * DB.zoomRate / 2,
        top: parseInt(this.pageWrap.css("top"), 10)
    })), b(n, h) && (o = h - this.width, $("#right-line-guide").removeClass("hidden").css({
        height: this.pageWrap.data("height") * DB.zoomRate,
        left: parseInt(this.pageWrap.css("left"), 10) + r + this.pageWrap.data("width") * DB.zoomRate,
        top: parseInt(this.pageWrap.css("top"), 10)
    }));
    for (var s = $('.element:not(".selected")', this.pageWrap), t = 0; t < s.length; t++) {
        var u = $(s[t]),
            v = u.data("top"),
            w = v + u.data("height") / 2,
            x = v + u.data("height"),
            y = u.data("left"),
            z = y + u.data("width") / 2,
            A = y + u.data("width");
        b(i, v) && (p = v, $("#top-line-guide").removeClass("hidden").css({
            width: (y > l ? A - l : n - y) * DB.zoomRate + q,
            top: parseInt(this.pageWrap.css("top"), 10) + v * DB.zoomRate,
            left: (y > l ? l : y) * DB.zoomRate + parseInt(this.pageWrap.css("left"), 10) - q / 2
        })), b(j, w) && (p = w - this.height / 2, $("#middle-line-guide").removeClass("hidden").css({
            width: (y > l ? A - l : n - y) * DB.zoomRate + q,
            top: parseInt(this.pageWrap.css("top"), 10) + w * DB.zoomRate,
            left: (y > l ? l : y) * DB.zoomRate + parseInt(this.pageWrap.css("left"), 10) - q / 2
        })), b(k, x) && (p = x - this.height, $("#bottom-line-guide").removeClass("hidden").css({
            width: (y > l ? A - l : n - y) * DB.zoomRate + q,
            top: parseInt(this.pageWrap.css("top"), 10) + x * DB.zoomRate,
            left: (y > l ? l : y) * DB.zoomRate + parseInt(this.pageWrap.css("left"), 10) - q / 2
        })), b(l, y) && (o = y, $("#left-line-guide").removeClass("hidden").css({
            height: (v > i ? x - i : k - v) * DB.zoomRate + q,
            left: parseInt(this.pageWrap.css("left"), 10) + r + y * DB.zoomRate,
            top: (v > i ? i : v) * DB.zoomRate + parseInt(this.pageWrap.css("top"), 10) - q / 2
        })), b(m, z) && (o = z - this.width / 2, $("#center-line-guide").removeClass("hidden").css({
            height: (v > i ? x - i : k - v) * DB.zoomRate + q,
            left: parseInt(this.pageWrap.css("left"), 10) + r + z * DB.zoomRate,
            top: (v > i ? i : v) * DB.zoomRate + parseInt(this.pageWrap.css("top"), 10) - q / 2
        })), b(n, A) && (o = A - this.width, $("#right-line-guide").removeClass("hidden").css({
            height: (v > i ? x - i : k - v) * DB.zoomRate + q,
            left: parseInt(this.pageWrap.css("left"), 10) + r + A * DB.zoomRate,
            top: (v > i ? i : v) * DB.zoomRate + parseInt(this.pageWrap.css("top"), 10) - q / 2
        })), b(i, x) && (p = x, $("#top-line-guide").removeClass("hidden").css({
            width: (y > l ? A - l : n - y) * DB.zoomRate + q,
            top: parseInt(this.pageWrap.css("top"), 10) + x * DB.zoomRate,
            left: (y > l ? l : y) * DB.zoomRate + parseInt(this.pageWrap.css("left"), 10) - q / 2
        })), b(k, v) && (p = v - this.height, $("#bottom-line-guide").removeClass("hidden").css({
            width: (y > l ? A - l : n - y) * DB.zoomRate + q,
            top: parseInt(this.pageWrap.css("top"), 10) + v * DB.zoomRate,
            left: (y > l ? l : y) * DB.zoomRate + parseInt(this.pageWrap.css("left"), 10) - q / 2
        })), b(l, A) && (o = A, $("#left-line-guide").removeClass("hidden").css({
            height: (v > i ? x - i : k - v) * DB.zoomRate + q,
            left: parseInt(this.pageWrap.css("left"), 10) + r + A * DB.zoomRate,
            top: (v > i ? i : v) * DB.zoomRate + parseInt(this.pageWrap.css("top"), 10) - q / 2
        })), b(n, y) && (o = y - this.width, $("#right-line-guide").removeClass("hidden").css({
            height: (v > i ? x - i : k - v) * DB.zoomRate + q,
            left: parseInt(this.pageWrap.css("left"), 10) + r + y * DB.zoomRate,
            top: (v > i ? i : v) * DB.zoomRate + parseInt(this.pageWrap.css("top"), 10) - q / 2
        }))
    }
    return [o, p]
}, element.prototype.moveElement = function(a, b) {
    this.left = Math.round(this.element.data("left") + a / DB.zoomRate), this.top = Math.round(this.element.data("top") + b / DB.zoomRate), $(".context-menu").remove();
    var c = this.snapMoveAndResize();
    this.element.css({
        transform: "translate3d(" + c[0] * DB.zoomRate + "px, " + c[1] * DB.zoomRate + "px, 0px) rotateZ(" + this.rotation + "deg)"
    }).data({
        left: this.left,
        top: this.top
    }), $("#selected-border").removeClass("hidden").css({
        width: this.width * DB.zoomRate,
        height: this.height * DB.zoomRate,
        transform: "translate3d(" + (c[0] * DB.zoomRate + parseInt(this.pageWrap.css("left"), 10)) + "px, " + (c[1] * DB.zoomRate + parseInt(this.pageWrap.css("top"), 10)) + "px, 0px) rotateZ(" + this.rotation + "deg)"
    }), $('[id$="-handle"]').addClass("hidden"), this.left = c[0], this.top = c[1], $(".element-bounding .element-left .bounding-values").html(this.left), $(".element-bounding .element-top .bounding-values").html(this.top)
}, element.prototype.resizeElement = function(a, b, c, d, e, f) {
    function g(a) {
        var b = a.get(0).getBoundingClientRect();
        return {
            x: b.left + b.width / 2,
            y: b.top + b.height / 2
        }
    }
    var h, i, j = this,
        k = Math.floor(180 * Math.atan2(e - c, d - b) / Math.PI + 90),
        l = Math.sqrt(Math.pow(d - b, 2) + Math.pow(e - c, 2)),
        m = j.width / j.height;
    m > 1 ? (i = 4, h = m * i) : (h = 4, i = h / m), 0 > k && (k += 360);
    var n = g(j.element),
        o = g($("#" + a + "-handle")),
        p = Math.floor(180 * Math.atan2(o.y - n.y, o.x - n.x) / Math.PI + 90),
        q = Math.cos(Math.PI / 180 * (k - p)) * l;
    f && (k = p, l = q), k = 0 > k - j.rotation ? k - j.rotation + 360 : k - j.rotation;
    var r, s = 0,
        t = !1,
        u = 0,
        v = 0;
    switch (a) {
        case "tl":
            t = !0, r = "br", s = k - 270, u = l * Math.sin(Math.PI / 180 * s), v = l * Math.cos(Math.PI / 180 * s);
            break;
        case "t":
            r = "b", v = q;
            break;
        case "tr":
            t = !0, r = "bl", s = k, u = l * Math.sin(Math.PI / 180 * s), v = l * Math.cos(Math.PI / 180 * s);
            break;
        case "r":
            u = q, r = "l";
            break;
        case "br":
            t = !0, r = "tl", s = k - 90, u = l * Math.sin(Math.PI / 180 * s), v = l * Math.cos(Math.PI / 180 * s);
            break;
        case "b":
            v = q, r = "t";
            break;
        case "bl":
            t = !0, r = "tr", s = k - 180, u = l * Math.sin(Math.PI / 180 * s), v = l * Math.cos(Math.PI / 180 * s);
            break;
        case "l":
            u = q, r = "r"
    }
    var w = $("#" + r + "-handle").get(0).getBoundingClientRect();
    f && t && (0 === u ? u = v * m : v = u / m);
    var x = 0 === u ? j.width : t ? Math.max(j.width * DB.zoomRate + u, h * DB.zoomRate) / DB.zoomRate : Math.max(j.width * DB.zoomRate + u, 4 * DB.zoomRate) / DB.zoomRate,
        y = 0 === v ? j.height : t ? Math.max(j.height * DB.zoomRate + v, i * DB.zoomRate) / DB.zoomRate : Math.max(j.height * DB.zoomRate + v, 4 * DB.zoomRate) / DB.zoomRate;
    j.width = x, j.height = y, j.element.css({
        width: j.width * DB.zoomRate,
        height: j.height * DB.zoomRate
    }), $("#selected-border").css({
        width: j.width * DB.zoomRate,
        height: j.height * DB.zoomRate
    });
    var z = $("#" + r + "-handle").get(0).getBoundingClientRect(),
        A = w.left - z.left,
        B = w.top - z.top,
        C = (j.left * DB.zoomRate + A) / DB.zoomRate,
        D = (j.top * DB.zoomRate + B) / DB.zoomRate;
    j.left = C, j.top = D;
    var E = [j.left, j.top];
    j.element.css({
        transform: "translate3d(" + E[0] * DB.zoomRate + "px, " + E[1] * DB.zoomRate + "px, 0px) rotateZ(" + j.rotation + "deg)"
    }).data({
        width: j.width,
        height: j.height,
        left: j.left,
        top: j.top
    }), $("#selected-border").css({
        transform: "translate3d(" + (E[0] * DB.zoomRate + parseInt(j.pageWrap.css("left"), 10)) + "px, " + (E[1] * DB.zoomRate + parseInt(j.pageWrap.css("top"), 10)) + "px, 0px) rotateZ(" + j.rotation + "deg)"
    }), j.left = E[0], j.top = E[1]
}, element.prototype.checkOctant = function() {
    var a = this.element.data("rotation"),
        b = Math.round(a / 45);
    b >= 8 && (b = 0);
    for (var c = 0; 8 > c; c++) $("#selected-border").removeClass("octant-" + c), $("#crop-editor .crop-zone").removeClass("octant-" + c);
    $("#selected-border").addClass("octant-" + b), $("#crop-editor .crop-zone").addClass("octant-" + b)
}, element.prototype.rotateElement = function(a, b, c, d) {
    function e(a) {
        return a * Math.PI / 180
    }

    function f(a) {
        return 180 * a / Math.PI
    }

    function g(a, b, c, d) {
        return Math.atan2(b - d, a - c)
    }

    function h(a) {
        for (var b = 0 > a ? 360 - Math.abs(a) : a, c = [0, 45, 90, 135, 180, 225, 270, 315], d = 2, e = 0; e < c.length; e++)
            if (c[e] - d <= b && b <= c[e] + d) return c[e];
        return a
    }

    function i(a) {
        return a %= 360, 0 > a && (a += 360), a
    }
    this.element.css({
        transform: "translate3d(" + this.left * DB.zoomRate + "px, " + this.top * DB.zoomRate + "px, 0px) rotateZ(0deg)"
    }), $(".context-menu").remove();
    var j = this.element.offset().left + this.width * DB.zoomRate / 2,
        k = this.element.offset().top + this.height * DB.zoomRate / 2;
    this.element.css({
        transform: "translate3d(" + this.left * DB.zoomRate + "px, " + this.top * DB.zoomRate + "px, 0px) rotateZ(" + this.rotation + "deg)"
    });
    var l = g(c, d, j, k) + e(this.element.data("rotation")) - g(a, b, j, k),
        m = Math.round(f(l));
    m = i(m), this.rotation = h(m), this.element.css({
        transform: "translate3d(" + this.left * DB.zoomRate + "px, " + this.top * DB.zoomRate + "px, 0px) rotateZ(" + this.rotation + "deg)"
    }).data({
        rotation: m
    }), $("#selected-border").css({
        transform: "translate3d(" + (this.left * DB.zoomRate + parseInt(this.pageWrap.css("left"), 10)) + "px, " + (this.top * DB.zoomRate + parseInt(this.pageWrap.css("top"), 10)) + "px, 0px) rotateZ(" + this.rotation + "deg)"
    }), this.checkOctant()
}, element.prototype.updatePosAndDeg = function(a) {
    a.width && (this.width += a.width), a.height && (this.height += a.height), a.left && (this.left += a.left), a.top && (this.top += a.top), a.angle && (this.rotation += a.angle), this.element.css({
        width: this.width * DB.zoomRate,
        height: this.height * DB.zoomRate,
        transform: "translate3d(" + this.left * DB.zoomRate + "px, " + this.top * DB.zoomRate + "px, 0px) rotateZ(" + this.rotation + ")"
    }).data({
        width: this.width,
        height: this.height,
        left: this.left,
        top: this.top,
        rotation: this.rotation
    })
}, element.prototype.changeZoom = function() {
    $(".page .page-toolbar").removeClass("page-toolbar-horizontal"), $(".page").height() < $(".page").find(".page-toolbar").height() && $(".page .page-toolbar").addClass("page-toolbar-horizontal"), this.element.css({
        width: this.width * DB.zoomRate,
        height: this.height * DB.zoomRate,
        transform: "translate3d(" + this.left * DB.zoomRate + "px, " + this.top * DB.zoomRate + "px, 0px) rotateZ(" + this.rotation + "deg)"
    })
}, element.prototype.changeOpacity = function(a) {
    a = parseInt(a, 10), this.transparency = 100 - a, this.element.css({
        opacity: (100 - this.transparency) / 100
    }).data({
        opacity: this.transparency
    })
}, element.prototype.deleteElement = function() {
    this.element.remove()
}, element.prototype.extractData = function() {
    return {
        elementIndex: this.elementIndex,
        width: this.width,
        height: this.height,
        left: this.left,
        top: this.top,
        transparency: this.transparency,
        rotation: this.rotation,
        type: this.type,
        mediaLayout: this.layoutId
    }
}, imageElement.prototype = new element, imageElement.prototype.renderElement = function(a, b) {
    function c(b) {
        var c = $('<div class="image-wrapper"></div>'),
            e = "";
        if (1 === d.flipOrientation ? (e = " rotateY(180deg)", d.element.data({
                rotateY: 180
            })) : 2 === d.flipOrientation ? (e = " rotateX(180deg)", d.element.data({
                rotateX: 180
            })) : 3 === d.flipOrientation && (e = " rotateX(180deg) rotateY(180deg)", d.element.data({
                rotateX: 180
            }), d.element.data({
                rotateY: 180
            })), c.css({
                transform: "translate3d(0px, 0px, 0px)" + e
            }), b && objectIsset(b, "screen.url")) {
            var f = new Image;
            f.crossOrigin = "Anonymous", f.onload = function() {
                if (d.imageBox && $(f).css({
                        width: d.imageBox.width * DB.zoomRate,
                        height: d.imageBox.height * DB.zoomRate,
                        transform: "translate3d(" + d.imageBox.left * DB.zoomRate + "px, " + d.imageBox.top * DB.zoomRate + "px, 0px)"
                    }), c.append(f), d.filter) {
                    var a = d.pageWrap.index(),
                        b = d.elementIndex,
                        e = "filter_" + a + "_" + b;
                    filterImage(f, e, d.filter, function(a) {
                        var b = new Image;
                        b.onload = function() {
                            $(f).remove(), d.imageBox && $(b).css({
                                width: d.imageBox.width * DB.zoomRate,
                                height: d.imageBox.height * DB.zoomRate,
                                transform: "translate3d(" + d.imageBox.left * DB.zoomRate + "px, " + d.imageBox.top * DB.zoomRate + "px, 0px)"
                            }), c.append(b)
                        }, b.src = a.toDataURL()
                    })
                }
            }, f.src = b.screen.url
        }
        d.isRecolorable && d.element.addClass("is-pattern").css({
            "background-color": d.backgroundColor
        }).data({
            color: d.backgroundColor
        }), a && "function" == typeof a && a(), d.element.addClass("has-media").data({
            id: d.mediaId,
            ver: d.mediaVersion
        }).append(c)
    }
    var d = this;
    if (element.prototype.renderElement.call(d, b), d.mediaId) {
        var e, f = DB.elementMedias[this.mediaId];
        objectIsset(f, "bundle.files") ? (e = f.bundle.files, c(e)) : $.ajax({
            url: DB.BaseApi + "media/batch?refs=" + d.mediaId + ":" + d.mediaVersion,
            dataType: "json"
        }).done(function(a) {
            objectIsset(a, "response.0.bundle.files") && (e = a.response[0].bundle.files, DB.elementMedias[d.mediaId] = a.response[0], c(e))
        }).fail(function(a, b) {
            console.log(b), console.log(DB.BaseApi + "media/batch?refs=" + d.mediaId + ":" + d.mediaVersion)
        })
    }
    d.isBackground && d.element.addClass("background"), !d.backgroundColor || !d.isRecolorable && d.mediaId || (d.isRecolorable && d.mediaId && d.element.addClass("is-pattern"), d.element.css({
        "background-color": d.backgroundColor
    }).data({
        color: d.backgroundColor
    }), a && "function" == typeof a && a())
}, imageElement.prototype.selectElement = function() {
    element.prototype.selectElement.call(this, arguments), $(".image-context #choose-font").addClass("hidden"), $(".image-context #choose-font-size").addClass("hidden"), $(".image-context .btn-text").addClass("hidden"), $(".image-context .text-divider").addClass("hidden"), $(".image-context .more-btn .btn-fwd").addClass("hidden"), $(".image-context .more-btn .btn-back").addClass("hidden"), this.mediaId || $(".image-context .btn-crop").addClass("hidden"), this.mediaId || $(".image-context .btn-find-my-id").addClass("hidden"), $("#l-handle, #t-handle, #r-handle, #b-handle").addClass("hidden"), $(".image-context .btn-select-color").remove();
    var a = this.element.get(0).style.backgroundColor;
    a && "" !== a && $('<button type="button" class="btn btn-default btn-select-color" title="Color select"><span style="background-color: ' + a + '"></span></button>').insertBefore(".image-context .btn-delete-elem")
}, imageElement.prototype.onUpdate = function() {
    var a = this;
    a.isBackground && (clearTimeout(a.onChange), a.element.css({
        "z-index": 9999
    }), a.onChange = setTimeout(function() {
        a.element.css({
            "z-index": ""
        })
    }, 600))
}, imageElement.prototype.changeColor = function(a) {
    this.backgroundColor = "#" + a, this.element.css({
        "background-color": this.backgroundColor
    }).data({
        color: this.backgroundColor
    }), this.element.hasClass("is-pattern") || this.element.empty(), this.onUpdate()
}, imageElement.prototype.moveElement = function(a, b) {
    element.prototype.moveElement.call(this, a, b), this.onUpdate()
}, imageElement.prototype.resizeElement = function(a, b, c, d, e) {
    var f = this;
    if ("t" !== a && "l" !== a && "r" !== a && "b" !== a) {
        var g = f.width;
        element.prototype.resizeElement.call(this, a, b, c, d, e, !0);
        var h = this.width / g;
        f.imageBox && (f.imageBox.left *= h, f.imageBox.top *= h, f.imageBox.width *= h, f.imageBox.height *= h, f.element.find("img").css({
            width: f.imageBox.width * DB.zoomRate,
            height: f.imageBox.height * DB.zoomRate,
            transform: "translate3d(" + f.imageBox.left * DB.zoomRate + "px, " + f.imageBox.top * DB.zoomRate + "px, 0px)"
        })), this.onUpdate()
    }
}, imageElement.prototype.flipImage = function(a) {
    var b = this.element.find(".image-wrapper"),
        c = this.element.data("rotateX") || 0,
        d = this.element.data("rotateY") || 0;
    "horizontal" === a ? (c += 180, this.element.data({
        rotateX: c
    })) : "vertical" === a && (d += 180, this.element.data({
        rotateY: d
    })), b.css({
        transform: "translate3d(0px, 0px, 0px) rotateX(" + c + "deg) rotateY(" + d + "deg)"
    });
    var e = 0 !== d % 360 ? 1 : 0,
        f = 0 !== c % 360 ? 2 : 0;
    this.flipOrientation = f + e
}, imageElement.prototype.changeZoom = function() {
    element.prototype.changeZoom.call(this, arguments), this.imageBox && this.element.find(".image-wrapper img").css({
        width: this.imageBox.width * DB.zoomRate,
        height: this.imageBox.height * DB.zoomRate,
        transform: "translate3d(" + this.imageBox.left * DB.zoomRate + "px, " + this.imageBox.top * DB.zoomRate + "px, 0px)"
    })
}, imageElement.prototype.startCrop = function() {
    var a = this;
    a.beforeCrop = {
        imageBox: a.imageBox,
        width: a.width,
        height: a.height,
        left: a.left,
        top: a.top
    }, a.imageBox || (a.imageBox = {
        width: a.width,
        height: a.height,
        left: -a.width / 4,
        top: -a.height / 4
    }, a.width /= 2, a.height /= 2, a.left -= a.imageBox.left, a.top -= a.imageBox.top);
    var b = "";
    1 === a.flipOrientation ? b = " rotateY(180deg)" : 2 === a.flipOrientation ? b = " rotateX(180deg)" : 3 === a.flipOrientation && (b = " rotateX(180deg) rotateY(180deg)");
    var c = " rotateZ(" + a.rotation + "deg)",
        d = parseInt($(".page.selected").css("left"), 10),
        e = parseInt($(".page.selected").css("top"), 10),
        f = a.element.find("img").clone(!0).off().css({
            width: a.imageBox.width * DB.zoomRate,
            height: a.imageBox.height * DB.zoomRate,
            transform: "translate3d(" + a.imageBox.left * DB.zoomRate + "px, " + a.imageBox.top * DB.zoomRate + "px, 0px)" + b
        });
    a.cropInfo = {
        offsetLeft: d,
        offsetTop: e
    }, $("#design-wrap .scroll-editer").getNiceScroll()[0].locked = !0, $('<div class="crop-zone"></div>').css({
        width: a.width * DB.zoomRate,
        height: a.height * DB.zoomRate,
        transform: "translate3d(" + (d + a.left * DB.zoomRate) + "px, " + (e + a.top * DB.zoomRate) + "px, 0px)" + c
    }).appendTo("#crop-editor"), $('<div class="inner-image"></div>').css({
        width: a.width * DB.zoomRate,
        height: a.height * DB.zoomRate
    }).append(f).appendTo(".crop-zone"), $('<a href="javascript:;" id="frame-handle-tl"><span></span></a><a href="javascript:;" id="frame-handle-tr"><span></span></a><a href="javascript:;" id="frame-handle-br"><span></span></a><a href="javascript:;" id="frame-handle-bl"><span></span></a>').appendTo(".crop-zone"), $("#selected-border").removeAttr("class").addClass("crop-resize").css({
        width: a.imageBox.width * DB.zoomRate,
        height: a.imageBox.height * DB.zoomRate,
        transform: "translate3d(" + (d + a.left * DB.zoomRate + a.imageBox.left * DB.zoomRate) + "px, " + (e + a.top * DB.zoomRate + a.imageBox.top * DB.zoomRate) + "px, 0px)" + c
    }).append('<img src="' + f.get(0).src + '" class="uncroped">'), $(".crop-resize img").css({
        opacity: .5,
        width: a.imageBox.width * DB.zoomRate,
        height: a.imageBox.height * DB.zoomRate,
        transform: "translate3d(0px, 0px, 0px)" + b
    }), $(".context-menu").remove(), $('[id$="-handle"]').addClass("hidden"), $("#tl-handle, #tr-handle, #br-handle, #bl-handle").removeClass("hidden"), $("#crop-editor").removeClass("hidden"), this.element.addClass("hidden"), _.bindAll(a, "acceptCrop", "cancelCrop"), $(".btn-accept-crop").unbind("click").bind("click", a.acceptCrop), $(".btn-cancel-crop").unbind("click").bind("click", a.cancelCrop), this.checkOctant()
}, imageElement.prototype.moveCrop = function(a, b) {
    var c = this,
        d = c.imageBox.left + a / DB.zoomRate,
        e = c.imageBox.top + b / DB.zoomRate,
        f = " rotateZ(" + c.rotation + "deg)",
        g = "";
    1 === c.flipOrientation ? g = " rotateY(180deg)" : 2 === c.flipOrientation ? g = " rotateX(180deg)" : 3 === c.flipOrientation && (g = " rotateX(180deg) rotateY(180deg)"), d > 0 && (d = 0), e > 0 && (e = 0), d + c.imageBox.width < c.width && (d = c.width - c.imageBox.width), e + c.imageBox.height < c.height && (e = c.height - c.imageBox.height), c.imageBox.left = d, c.imageBox.top = e, $("#selected-border").css({
        transform: "translate3d(" + (c.cropInfo.offsetLeft + c.left * DB.zoomRate + c.imageBox.left * DB.zoomRate) + "px, " + (c.cropInfo.offsetTop + c.top * DB.zoomRate + c.imageBox.top * DB.zoomRate) + "px, 0px)" + f
    }), $(".crop-zone img").css({
        transform: "translate3d(" + c.imageBox.left * DB.zoomRate + "px, " + c.imageBox.top * DB.zoomRate + "px, 0px)" + g
    })
}, imageElement.prototype.resizeCrop = function(a, b, c) {
    if ("l" !== a && "t" !== a && "r" !== a && "b" !== a) {
        var d = this.imageBox.left,
            e = this.imageBox.top,
            f = this.imageBox.width,
            g = this.imageBox.height,
            h = " rotateZ(" + this.rotation + "deg)",
            i = "";
        if (1 === this.flipOrientation ? i = " rotateY(180deg)" : 2 === this.flipOrientation ? i = " rotateX(180deg)" : 3 === this.flipOrientation && (i = " rotateX(180deg) rotateY(180deg)"), "tl" === a) {
            if (0 === d && b > 0 || 0 === e && c > 0) return;
            f -= b / DB.zoomRate, g -= c / DB.zoomRate, d += b / DB.zoomRate, e += c / DB.zoomRate, b > c ? (f = Math.round(this.imageBox.width * g / this.imageBox.height), d = this.imageBox.left - (f - this.imageBox.width)) : c > b && (g = Math.round(this.imageBox.height * f / this.imageBox.width), e = this.imageBox.top - (g - this.imageBox.height))
        } else if ("tr" === a) {
            if (f === Math.abs(d) + this.width && 0 > b || 0 === e && c > 0) return;
            f += b / DB.zoomRate, g = Math.round(this.imageBox.height * f / this.imageBox.width), e = this.imageBox.top - (g - this.imageBox.height)
        } else if ("bl" === a) {
            if (0 === d && b > 0 || g === Math.abs(e) + this.height && 0 > c) return;
            g += c / DB.zoomRate, f = Math.round(this.imageBox.width * g / this.imageBox.height), d = this.imageBox.left - (f - this.imageBox.width)
        } else if ("br" === a) {
            if (f === Math.abs(d) + this.width && 0 > b || g === Math.abs(e) + this.height && 0 > c) return;
            f += b / DB.zoomRate, g += c / DB.zoomRate, b > c ? f = Math.round(this.imageBox.width * g / this.imageBox.height) : c > b && (g = Math.round(this.imageBox.height * f / this.imageBox.width))
        }
        f < this.width && (f = this.width), g < this.height && (g = this.height), d > 0 && (f += d, g = Math.round(this.imageBox.height * f / this.imageBox.width), d = 0), e > 0 && (g += e, f = Math.round(this.imageBox.width * g / this.imageBox.height), e = 0), d + f < this.width && (d = this.width - f), e + g < this.height && (e = this.height - g), this.imageBox.left = d, this.imageBox.top = e, this.imageBox.width = f, this.imageBox.height = g, $("#selected-border").css({
            width: this.imageBox.width * DB.zoomRate,
            height: this.imageBox.height * DB.zoomRate,
            transform: "translate3d(" + (this.cropInfo.offsetLeft + this.left * DB.zoomRate + this.imageBox.left * DB.zoomRate) + "px, " + (this.cropInfo.offsetTop + this.top * DB.zoomRate + this.imageBox.top * DB.zoomRate) + "px, 0px)" + h
        }), $(".uncroped").css({
            width: this.imageBox.width * DB.zoomRate,
            height: this.imageBox.height * DB.zoomRate
        }), $(".crop-zone img").css({
            width: this.imageBox.width * DB.zoomRate,
            height: this.imageBox.height * DB.zoomRate,
            transform: "translate3d(" + this.imageBox.left * DB.zoomRate + "px, " + this.imageBox.top * DB.zoomRate + "px, 0px)" + i
        })
    }
}, imageElement.prototype.resizeFrameCrop = function(a, b, c) {
    var d = this.left,
        e = this.top,
        f = this.width,
        g = this.height,
        h = this.imageBox.left,
        i = this.imageBox.top,
        j = " rotateZ(" + this.rotation + "deg)",
        k = "";
    f - b / DB.zoomRate < 40 || g - c / DB.zoomRate < 40 || (1 === this.flipOrientation ? k = " rotateY(180deg)" : 2 === this.flipOrientation ? k = " rotateX(180deg)" : 3 === this.flipOrientation && (k = " rotateX(180deg) rotateY(180deg)"), "tl" === a ? (f -= b / DB.zoomRate, g -= c / DB.zoomRate, d += b / DB.zoomRate, e += c / DB.zoomRate, h -= b / DB.zoomRate, i -= c / DB.zoomRate) : "tr" === a ? (f += b / DB.zoomRate, g -= c / DB.zoomRate, e += c / DB.zoomRate, i -= c / DB.zoomRate) : "bl" === a ? (f -= b / DB.zoomRate, g += c / DB.zoomRate, d += b / DB.zoomRate, h -= b / DB.zoomRate) : "br" === a && (f += b / DB.zoomRate, g += c / DB.zoomRate), h > 0 && (d += h, f -= h, h = 0), i > 0 && (e += i, g -= i, i = 0), Math.abs(h) + f > this.imageBox.width && (f = this.imageBox.width + h), Math.abs(i) + g > this.imageBox.height && (g = this.imageBox.height + i), this.width = f, this.height = g, this.left = d, this.top = e, this.imageBox.left = h, this.imageBox.top = i, $(".crop-zone").css({
        width: this.width * DB.zoomRate,
        height: this.height * DB.zoomRate,
        transform: "translate3d(" + (this.cropInfo.offsetLeft + this.left * DB.zoomRate) + "px, " + (this.cropInfo.offsetTop + this.top * DB.zoomRate) + "px, 0px)" + j
    }), $(".crop-zone .inner-image").css({
        width: this.width * DB.zoomRate,
        height: this.height * DB.zoomRate
    }), $(".crop-zone img").css({
        width: this.imageBox.width * DB.zoomRate,
        height: this.imageBox.height * DB.zoomRate,
        transform: "translate3d(" + this.imageBox.left * DB.zoomRate + "px, " + this.imageBox.top * DB.zoomRate + "px, 0px)" + k
    }))
}, imageElement.prototype.acceptCrop = function() {
    var a = $(".crop-zone img").get(0);
    this.element.find(".image-wrapper").empty().append(a), $("#crop-editor").addClass("hidden"), $("#selected-border").removeClass("crop-resize").find(".uncroped").remove(), $("#design-wrap .scroll-editer").getNiceScroll()[0].locked = !1, $(".crop-zone").remove(), this.element.removeClass("hidden"), this.element.css({
        width: this.width * DB.zoomRate,
        height: this.height * DB.zoomRate,
        transform: "translate3d(" + this.left * DB.zoomRate + "px, " + this.top * DB.zoomRate + "px, 0px)"
    }).find("img").css({
        width: this.imageBox.width * DB.zoomRate,
        height: this.imageBox.height * DB.zoomRate,
        transform: "translate3d(" + this.imageBox.left * DB.zoomRate + "px, " + this.imageBox.top * DB.zoomRate + "px, 0px)"
    }), this.deselectElement(), DB.designChange = !0
}, imageElement.prototype.cancelCrop = function() {
    var a = this;
    a.imageBox = a.beforeCrop.imageBox, a.width = a.beforeCrop.width, a.height = a.beforeCrop.height, a.left = a.beforeCrop.left, a.top = a.beforeCrop.top, $("#crop-editor").addClass("hidden"), $("#selected-border").removeClass("crop-resize").find(".uncroped").remove(), $(".scroll-editer").getNiceScroll()[0].locked = !1, $(".crop-zone").remove(), this.element.removeClass("hidden"), a.deselectElement()
}, imageElement.prototype.getId = function() {
    return this.mediaId
}, imageElement.prototype.changeFilter = function(a, b) {
    var c, d = this;
    d.filter || (d.filter = {}, c = d.element.find(".image-wrapper img")[0]), "object" != typeof a || b ? d.filter[a] = b : d.filter = a;
    var e = d.pageWrap.index(),
        f = d.elementIndex,
        g = "filter_" + e + "_" + f;
    filterImage(c, g, d.filter, function(a) {
        d.element.find(".image-wrapper img").attr({
            src: a.toDataURL()
        })
    })
}, imageElement.prototype.extractData = function() {
    var a = element.prototype.extractData.call(this, arguments);
    return a.backgroundColor = this.backgroundColor, a.isRecolorable = this.isRecolorable, a.isBackground = this.isBackground, a.isDark = this.isDark, a.mediaId = this.mediaId, a.mediaVersion = this.mediaVersion, a.flipOrientation = this.flipOrientation, a.filter = this.filter, a.imageBox = this.imageBox, a.isCut = this.isCut, a
}, gridElement.prototype = new element, gridElement.prototype.renderElement = function(a) {
    element.prototype.renderElement.call(this);
    var b = this.parseGrid([{
            type: "rows",
            children: this.items
        }]),
        c = $('<div class="inner-grid">').append(b);
    this.element.append(c), this.renderChildGrid(a)
}, gridElement.prototype.selectElement = function() {
    element.prototype.selectElement.call(this, arguments);
    var a = _.template($("#main_context_menu_tmpl").html());
    $("#design-editor").append(a), $(".context-menu:last").addClass("sub-" + this.type + "-context"), $("#selected-border").removeClass("hidden").css({
        width: this.width * DB.zoomRate,
        height: this.height * DB.zoomRate,
        transform: "translate3d(" + (this.left * DB.zoomRate + parseInt(this.pageWrap.css("left"), 10)) + "px, " + (this.top * DB.zoomRate + parseInt(this.pageWrap.css("top"), 10)) + "px, 0px) rotateZ(" + this.rotation + "deg)"
    }), $(".grid-context #choose-font").addClass("hidden"), $(".grid-context #choose-font-size").addClass("hidden"), $(".grid-context .btn-filter-menu").addClass("hidden"), $(".grid-context .btn-crop").addClass("hidden"), $(".grid-context .btn-find-my-id").addClass("hidden"), $(".grid-context .btn-select-color").addClass("hidden"), $(".grid-context .btn-text").addClass("hidden"), $(".grid-context .text-divider").addClass("hidden"), $(".grid-context .more-btn .btn-fwd").addClass("hidden"), $(".grid-context .more-btn .btn-back").addClass("hidden"), $(".grid-context .btn-sub-grid").addClass("hidden"), $(".sub-grid-context #choose-font").addClass("hidden"), $(".sub-grid-context #choose-font-size").addClass("hidden"), $(".sub-grid-context .btn-copy").addClass("hidden"), $(".sub-grid-context button.btn-fwd").addClass("hidden"), $(".sub-grid-context button.btn-back").addClass("hidden"), $(".sub-grid-context .btn-text").addClass("hidden"), $(".sub-grid-context .text-divider").addClass("hidden"), $(".sub-grid-context .btn-link").addClass("hidden"), $(".sub-grid-context .btn-transparency").addClass("hidden"), $(".sub-grid-context .btn-crop").addClass("hidden"), $("#tl-handle, #tr-handle, #bl-handle, #br-handle").addClass("hidden"), $("#l-handle, #t-handle, #r-handle, #b-handle").addClass("hidden"), $(".sub-grid-context .btn-select-color").remove();
    var b = this.element.get(0).style.backgroundColor;
    if (b && "" !== b) $('<button type="button" class="btn btn-default btn-select-color" title="Color select"><span style="background-color: ' + b + '"></span></button>').insertBefore(".sub-grid-context .btn-delete-elem");
    else {
        var c = this.element.find(".item-content.selected img").attr("src");
        $('<button type="button" class="btn btn-default btn-select-color"><span style="background-image: url(' + c + '); background-size: cover;"></span></button>').insertBefore(".sub-grid-context .btn-delete-elem")
    }
}, gridElement.prototype.parseGrid = function(a) {
    var b = this,
        c = a.type || "rows";
    a = a.children || a;
    for (var d = $(), e = 0, f = 0; f < a.length; f++) {
        var g = a[f],
            h = $('<div class="' + g.type + '"></div>');
        if ("item" == g.type && $('<div class="item-content"></div>').appendTo(h), "rows" == c) {
            var i = 1 / (a.length - f) * (100 - e),
                j = e;
            i = g.height || i, h.css("top", j + "%").css("height", i + "%").attr("data-top", j / 100).attr("data-height", i / 100)
        } else {
            var i = 1 / (a.length - f) * (100 - e),
                j = e;
            i = g.width || i, h.css("left", j + "%").css("width", i + "%").attr("data-left", j / 100).attr("data-width", i / 100)
        }
        e += i, void 0 !== g.children && h.append(b.parseGrid(g)), d = d.add(h)
    }
    return d
}, gridElement.prototype.renderChildGrid = function(a) {
    var b = this,
        c = Math.round(Math.round(b.spacing / 2) * DB.zoomRate);
    _.each(b.contents, function(a, d) {
        function e(c) {
            var e = "";
            if (1 === b.flipOrientation ? (e = " rotateY(180deg)", g.data({
                    rotateY: 180
                })) : 2 === b.flipOrientation ? (e = " rotateX(180deg)", g.data({
                    rotateX: 180
                })) : 3 === b.flipOrientation && (e = " rotateX(180deg) rotateY(180deg)", g.data({
                    rotateX: 180
                }), g.data({
                    rotateY: 180
                })), g.css({
                    transform: "translate3d(0px, 0px, 0px)" + e
                }), c && objectIsset(c, "screen.url")) {
                var f = new Image;
                f.crossOrigin = "Anonymous", f.style.height = n + "px", f.style.width = m + "px", f.onload = function() {
                    if (g.append(f), $(f).data({
                            width: Math.round(b.contents[d].imageBox.width),
                            height: Math.round(b.contents[d].imageBox.height),
                            top: Math.round(b.contents[d].imageBox.top),
                            left: Math.round(b.contents[d].imageBox.left)
                        }), j) {
                        var c = b.pageWrap.index(),
                            e = b.elementIndex,
                            h = "filter_" + c + "_" + e + "_" + a.index;
                        filterImage(f, h, j, function(a) {
                            var c = new Image;
                            c.style.height = n + "px", c.style.width = m + "px", c.onload = function() {
                                $(f).remove(), g.append(c)
                            }, c.src = a.toDataURL(), c.style.transform = "translate3d(" + k + "px," + l + "px, 0px)", $(c).data({
                                width: Math.round(b.contents[d].imageBox.width),
                                height: Math.round(b.contents[d].imageBox.height),
                                top: Math.round(b.contents[d].imageBox.top),
                                left: Math.round(b.contents[d].imageBox.left)
                            })
                        })
                    }
                }, f.src = c.screen.url, f.style.transform = "translate3d(" + k + "px," + l + "px, 0px)"
            }
        }
        var f = b.element.find(".item-content")[a.index],
            g = $(f),
            h = b.contents[d].mediaId,
            i = b.contents[d].mediaVersion,
            j = b.contents[d].filter,
            k = Math.round(b.contents[d].imageBox.left) * DB.zoomRate,
            l = Math.round(b.contents[d].imageBox.top) * DB.zoomRate,
            m = Math.round(b.contents[d].imageBox.width) * DB.zoomRate,
            n = Math.round(b.contents[d].imageBox.height) * DB.zoomRate;
        if (g.css({
                top: c + "px",
                left: c + "px",
                right: c + "px",
                bottom: c + "px"
            }), h) {
            var o, p = DB.elementMedias[h];
            objectIsset(p, "bundle.files") ? (o = p.bundle.files, e(o)) : $.ajax({
                url: DB.BaseApi + "media/batch?refs=" + h + ":" + i,
                dataType: "json"
            }).done(function(a) {
                objectIsset(a, "response.0.bundle.files") && (o = a.response[0].bundle.files, DB.elementMedias[h] = a.response[0], e(o))
            }).fail(function(a, b) {
                console.log(b), console.log(DB.BaseApi + "media/batch?refs=" + h + ":" + i)
            })
        } else b.contents[d].backgroundColor && (m = 0 == m ? "100%" : m + "px", n = 0 == n ? "100%" : n + "px", g.css({
            "background-color": b.contents[d].backgroundColor,
            width: m,
            height: n,
            transform: "translate3d(" + k + "px," + l + "px, 0px)"
        }))
    })
}, gridElement.prototype.resizeElement = function(a, b, c) {
    "t" !== a && "l" !== a && "r" !== a && "b" !== a && element.prototype.resizeElement.call(this, a, b, c)
}, gridElement.prototype.changeZoom = function() {
    element.prototype.changeZoom.call(this, arguments), _.each(this.element.find("img"), function(a) {
        " rotateX(" + $(a).parent().data("rotateX") + "deg) rotateY(" + $(a).parent().data("rotateY") + "deg)";
        $(a).css({
            width: $(a).data("width") * DB.zoomRate,
            height: $(a).data("height") * DB.zoomRate,
            transform: "translate3d(" + $(a).data("left") * DB.zoomRate + "px, " + $(a).data("top") * DB.zoomRate + "px, 0px)"
        })
    })
}, gridElement.prototype.getChildIndex = function() {
    for (var a = this.element.find(".item-content"), b = a.length - 1; b >= 0; b--)
        for (var c = a[b], d = c.classList.length - 1; d >= 0; d--)
            if ("selected" == c.classList[d]) return b
}, gridElement.prototype.changeFilter = function(a, b) {
    var c, d = this,
        e = d.getChildIndex();
    d.contents[e].filter || (d.contents[e].filter = {}, c = d.element.find(".item-content.selected img")[0]), "object" != typeof a || b ? d.contents[e].filter[a] = b : d.contents[e].filter = a;
    var f = d.pageWrap.index(),
        g = d.elementIndex,
        h = "filter_" + f + "_" + g + "_" + e;
    filterImage(c, h, d.contents[e].filter, function(a) {
        d.element.find(".item-content.selected img").attr({
            src: a.toDataURL()
        })
    })
}, gridElement.prototype.flipImage = function(a) {
    var b = this.getChildIndex(),
        c = $(this.element.find(".item-content")[b]),
        d = c.data("rotateX") || 0,
        e = c.data("rotateY") || 0;
    "horizontal" === a ? (d += 180, c.data({
        rotateX: d
    })) : "vertical" === a && (e += 180, c.data({
        rotateY: e
    })), c.css({
        transform: "translate3d(0px, 0px, 0px) rotateX(" + d + "deg) rotateY(" + e + "deg)"
    });
    for (var f = 0 !== e % 360 ? 1 : 0, g = 0 !== d % 360 ? 2 : 0, h = this.contents.length - 1; h >= 0; h--) this.contents[h].index === b && (this.contents[h].flipOrientation = g + f)
}, gridElement.prototype.extractData = function() {
    var a = element.prototype.extractData.call(this, arguments);
    return a.items = this.items, a.contents = this.contents, a.spacing = this.spacing, a.flipOrientation = this.flipOrientation, a
}, textElement.prototype = new element, textElement.prototype.renderElement = function(a) {
    var b = this;
    element.prototype.renderElement.call(b);
    var c = $('<div class="inner-text"></div>');
    c.html(b.html).css({
        width: b.width,
        "line-height": parseInt(b.lineHeight, 10) / 100,
        transform: "translateY(" + b.translateLineHeight() + "em) scale(" + DB.zoomRate + ")",
        "transform-origin": "top left 0px"
    }), b.bold && b.element.addClass("bold"), b.italic && b.element.addClass("italic"), loadFont(b.fontFamily, function(d, e) {
        b.element.append(c).css({
            "font-size": 230 * parseFloat(b.fontSize ? b.fontSize : b.defaultFont[b.style].fontSize) / 24 + "%",
            "letter-spacing": (b.letterSpacing ? parseInt(b.letterSpacing, 10) / 1e3 : 0) + "em",
            "font-family": b.fontFamily ? b.fontFamily : b.defaultFont[b.style].fontFamily,
            "text-align": b.justification ? b.justification : "",
            color: b.color ? b.color : b.defaultFontColor,
            "text-transform": b.textTransform ? b.textTransform : ""
        }).data({
            size: b.fontSize,
            family: b.fontFamily,
            color: b.color ? b.color : b.defaultFontColor,
            uppercase: b.textTransform ? !0 : !1,
            lineHeight: b.lineHeight,
            letterSpacing: b.letterSpacing
        }), e && (e.bold && b.element.data("bold", !0), e.italic && b.element.data("italic", !0), e.both && b.element.data("both", !0)), b.width || b.getInnerWidth(), b.lineLengths || (b.lineLengths = b.breakWord()), a || b.setCenterPage()
    })
}, textElement.prototype.selectElement = function() {
    var a = this;
    element.prototype.selectElement.call(a, arguments), $(".text-context .btn-filter-menu").addClass("hidden"), $(".text-context .btn-crop").addClass("hidden"), $(".text-context button.btn-fwd").addClass("hidden"), $(".text-context button.btn-back").addClass("hidden"), $(".text-context .more-btn .btn-sub-grid").addClass("hidden"), $(".text-context .btn-list").addClass("hidden"), a.mediaId || $(".text-context .btn-crop").addClass("hidden"), a.mediaId || $(".text-context .btn-find-my-id").addClass("hidden"), $("#tl-handle, #tr-handle, #br-handle, #bl-handle, #t-handle, #b-handle").addClass("hidden"), a.element.addClass("focusing").css({
        transform: "translate3d(" + (a.left * DB.zoomRate + parseInt(a.pageWrap.css("left"), 10)) + "px, " + (a.top * DB.zoomRate + parseInt(a.pageWrap.css("top"), 10)) + "px, 0px) rotateZ(" + a.rotation + "deg)"
    }).data({
        "page-wrap": a.pageWrap.index()
    }).prependTo("#design-editor").find(".inner-text").attr("contenteditable", !0), $("#choose-font .btn-value").text(a.element.data("family")), $("#choose-font-size .btn-value").text(roundNumber(a.element.data("size"), 1));
    var b = a.element.data("bold"),
        c = a.element.data("italic"),
        d = a.element.data("both");
    b || $(".more-btn .btn-bold").addClass("disabled"), c || $(".more-btn .btn-italic").addClass("disabled"), !d && a.element.hasClass("bold") ? $(".more-btn .btn-italic").addClass("disabled") : !d && a.element.hasClass("italic") && $(".more-btn .btn-bold").addClass("disabled"), window.setTimeout(function() {
        var b, c, d = a.element.find(".inner-text").get(0);
        window.getSelection && document.createRange ? (c = document.createRange(), c.selectNodeContents(d), c.collapse(!0), b = window.getSelection(), b.removeAllRanges(), b.addRange(c)) : document.body.createTextRange && (c = document.body.createTextRange(), c.moveToElementText(d), c.collapse(!0), c.select())
    }, 100), _.bindAll(a, "inputText", "pasteText"), a.element.find(".inner-text").unbind("input").bind("input", a.inputText).off("paste").on("paste", a.pasteText), a.loadFontFamily(), a.loadFontSize(), $(".text-context .btn-select-color").remove();
    var e = this.element.data("color");
    $('<button type="button" class="btn btn-default btn-select-color" title="Color select"><span style="background-color: ' + e + '"></span></button>').insertBefore(".text-context .btn-delete-elem")
}, textElement.prototype.deselectElement = function() {
    element.prototype.deselectElement.call(this, arguments), 0 === this.elementIndex ? this.pageWrap.find(".elements").prepend(this.element) : this.pageWrap.find(".element:nth-child(" + this.elementIndex + ")").after(this.element), this.element.removeClass("focusing").css({
        transform: "translate3d(" + this.left * DB.zoomRate + "px, " + this.top * DB.zoomRate + "px, 0px) rotateZ(" + this.rotation + "deg)"
    }).find(".inner-text").attr("contenteditable", !1).unbind("input").off("paste"), this.newInput && (this.newInput = !1, DB.designChange = !0)
}, textElement.prototype.loadFontFamily = function() {
    function a() {
        $("#list-fonts").scrollTop($(".select-font.selected").offset().top - 350)
    }
    for (var b = 0; b < DB.listFont.length; b++) {
        var c = DB.listFont[b],
            d = c.family === this.fontFamily ? " selected" : "";
        $('<li class="select-font' + d + '"><a role="menuitem" href="javascript:;" data-name="' + c.family + '"><img src="' + c.normalDisplay + '" /><i class="fa fa-check"></i></a></li>').appendTo("#list-fonts")
    }
    $("#choose-font").unbind("click", a), $("#choose-font").bind("click", a)
}, textElement.prototype.loadFontSize = function() {
    for (var a = DB.fontSize, b = 0; b < a.length; b++) {
        var c = a[b];
        $('<li class="select-font-size"><a href="javascript:;" data-value="' + c + '">' + c + "</a></li>").appendTo("#list-font-size")
    }
}, textElement.prototype.getInnerWidth = function() {
    this.element.css({
        width: "",
        height: ""
    }).find(".inner-text").css({
        width: ""
    }), this.width = this.element.find(".inner-text").outerWidth() + 10, this.element.css({
        width: this.width * DB.zoomRate
    }).data({
        width: this.width
    }).find(".inner-text").css({
        width: this.width
    }), this.getInnerHeight()
}, textElement.prototype.getInnerHeight = function() {
    this.height = this.element.find(".inner-text").height(), this.element.css({
        height: this.height * DB.zoomRate
    }).data({
        height: this.height
    }), $("#selected-border").css({
        height: this.height * DB.zoomRate
    })
}, textElement.prototype.setCenterPage = function() {
    0 === this.left && 0 === this.top && (this.left = this.pageWrap.width() / (2 * DB.zoomRate) - this.width / 2, this.top = this.pageWrap.height() / (2 * DB.zoomRate) - this.height / 2), this.element.css({
        transform: "translate3d(" + this.left * DB.zoomRate + "px, " + this.top * DB.zoomRate + "px, 0px) rotateZ(" + this.rotation + "deg)"
    }).data({
        left: this.left,
        top: this.top
    })
}, textElement.prototype.inputText = function(a, b) {
    var c = this.element.find(".inner-text"),
        d = this.breakWord();
    this.html = c.html(), this.lineLengths = d, this.getInnerHeight(), b || (this.newInput = !0)
}, textElement.prototype.pasteText = function(a) {
    if (a.preventDefault(), document.queryCommandSupported("ms-pasteContentOnly")) document.execCommand("ms-pasteContentOnly");
    else if (document.queryCommandSupported("insertHTML") && a.originalEvent.clipboardData) {
        var b = a.originalEvent.clipboardData.getData("text/plain");
        b = _.escape(b).replace(/\r?\n/g, "<br>").replace(/ {2}/g, " &nbsp;"), document.execCommand("insertHTML", !1, b)
    }
    this.inputText()
}, textElement.prototype.changeLineHeight = function(a) {
    this.lineHeight = a, this.element.data({
        lineHeight: this.lineHeight
    }).find(".inner-text").css({
        "line-height": a / 100,
        transform: "translateY(" + this.translateLineHeight() + "em) scale(" + DB.zoomRate + ")"
    }), this.getInnerHeight()
}, textElement.prototype.changeLetterSpacing = function(a) {
    this.letterSpacing = a, this.element.css({
        "letter-spacing": this.letterSpacing / 1e3 + "em"
    }).data({
        letterSpacing: this.letterSpacing
    }), this.getInnerHeight()
}, textElement.prototype.changeAlign = function(a) {
    this.element.css({
        "text-align": a
    }), this.justification = a
}, textElement.prototype.uppercaseText = function(a) {
    a && this.element.data({
        uppercase: a ? !0 : !1
    }), this.element.css({
        "text-transform": this.element.data("uppercase") ? "" : "uppercase"
    }).data({
        uppercase: this.element.data("uppercase") ? !1 : !0
    }), this.textTransform = this.element.data("uppercase") ? "uppercase" : null, this.getInnerHeight()
}, textElement.prototype.changeStyle = function(a, b) {
    b && ("bold" === a && this.element.data({
        bold: b
    }), "italic" === a && this.element.data({
        italic: b
    }));
    var c = this.element.data("bold"),
        d = this.element.data("italic"),
        e = this.element.data("both");
    !c && "bold" === a || !d && "italic" === a || !e && this.element.hasClass("bold") && "italic" === a || !e && this.element.hasClass("italic") && "bold" === a || (this.element.hasClass(a) ? this.element.removeClass(a) : this.element.addClass(a), this[a] = !this[a], this.getInnerHeight())
}, textElement.prototype.changeFontFamily = function(a, b) {
    var c = this;
    loadFont(a, function(d, e) {
        d ? (c.element.css({
            "font-family": a
        }).data({
            family: a
        }), $("#choose-font .btn-value").html(a), $(".text-context").find(".btn-italic").removeClass("disabled"), $(".text-context").find(".btn-bold").removeClass("disabled"), c.element.hasClass("bold") && !e.bold && c.element.removeClass("bold"), !c.element.hasClass("italic") || e.italic && e.both || c.element.removeClass("italic"), e.bold ? c.element.data("bold", e.bold) : $(".text-context").find(".btn-bold").addClass("disabled"), e.italic ? c.element.data("italic", e.italic) : $(".text-context").find(".btn-italic").addClass("disabled"), e.both ? c.element.data("both", e.both) : c.element.hasClass("bold") ? $(".text-context").find(".btn-italic").addClass("disabled") : c.element.hasClass("italic") && $(".text-context").find(".btn-bold").addClass("disabled"), c.getInnerHeight(), c.fontFamily = a, "function" == typeof b && b(!0)) : "function" == typeof b && b(!1)
    })
}, textElement.prototype.changeFontSize = function(a) {
    a = roundNumber(a, 1), this.element.css({
        "font-size": 230 * a / 24 + "%"
    }).data({
        size: a
    }), this.fontSize = a, $("#choose-font-size .btn-value").html(a), $("#choose-font-size .font-size-input").html(a), this.getInnerHeight()
}, textElement.prototype.changeColor = function(a) {
    this.color = "#" + a, this.element.css({
        color: this.color
    }).data({
        color: this.color
    })
}, textElement.prototype.translateLineHeight = function() {
    var a = 0,
        b = 0;
    return 140 !== this.lineHeight && (a = .2, b = (this.lineHeight - 100) / 200), (a - b) * DB.zoomRate
}, textElement.prototype.breakWord = function() {
    function a() {
        if (this.nodeType === Node.ELEMENT_NODE) {
            var b = this.nodeName.toLowerCase();
            if ("br" === b) {
                var c = this.previousSibling;
                if (!c || "br" === c.nodeName.toLowerCase()) {
                    var d = document.createElement("span");
                    d.classList.add("new-line-char"), d.style.width = 1, d.style.height = 1, this.parentNode.insertBefore(d, this)
                }
            }
            if ("br" === b || "script" === b || "style" === b) return;
            var e = $(this).contents();
            if ("span" === b) {
                if (this.classList.contains("fauxCaret")) return;
                if (this.classList.contains("char")) {
                    if (1 === e.length && e[0].nodeType === Node.TEXT_NODE && 1 === e[0].data.length) return;
                    e.replaceAll(this)
                }
            }
            e.each(a)
        } else if (this.nodeType === Node.TEXT_NODE) {
            var f = this.data.split("").map(function(a) {
                var b = document.createElement("span");
                return b.classList.add("char"), b.appendChild(document.createTextNode(a)), b
            });
            $(this).replaceWith(f)
        }
    }

    function b(a) {
        return a.filter(function() {
            return this.classList.contains("new-line-char") || 0 !== this.offsetHeight || 0 !== this.offsetWidth
        })
    }

    function c(a, b) {
        var c = a.offsetTop - b.offsetTop;
        return c >= 0 || c >= b.offsetHeight - a.offsetHeight
    }
    $("#chaos-zone").empty();
    var d = this.element.get(0).style;
    if ("" !== d.fontFamily && "" !== d.width) {
        var e = this.element.clone().off(),
            f = e.children(".inner-text");
        e.removeClass("selected").addClass("clone").appendTo("#chaos-zone"), f.each(a);
        for (var g = e.find(".char, .new-line-char"), h = b(g), i = 1, j = [], k = 0; i < h.length; i++)
            if (!c(h[i - 1], h[i])) {
                h[i - 1].classList.contains("new-line-char") && k++;
                var l = g.index(h[i]);
                j.push(l - k), h[i - 1].classList.contains("new-line-char") && 0 !== l - k && j.push(0), k = l
            }
        return j.push(g.length - k), j
    }
}, textElement.prototype.changeZoom = function() {
    element.prototype.changeZoom.call(this, arguments), this.element.find(".inner-text").css({
        transform: "translateY(" + this.translateLineHeight() + "em) scale(" + DB.zoomRate + ")"
    })
}, textElement.prototype.moveElement = function(a, b) {
    if (this.newInput && (this.newInput = !1), this.element.hasClass("focusing")) {
        $(".context-menu").remove(), this.left = Math.round(this.element.data("left") + a / DB.zoomRate), this.top = Math.round(this.element.data("top") + b / DB.zoomRate);
        var c = this.snapMoveAndResize();
        this.element.css({
            transform: "translate3d(" + (c[0] * DB.zoomRate + parseInt(this.pageWrap.css("left"), 10)) + "px, " + (c[1] * DB.zoomRate + parseInt(this.pageWrap.css("top"), 10)) + "px, 0px) rotateZ(" + this.rotation + "deg)"
        }).data({
            left: this.left,
            top: this.top
        }), $("#selected-border").css({
            transform: "translate3d(" + (c[0] * DB.zoomRate + parseInt(this.pageWrap.css("left"), 10)) + "px, " + (c[1] * DB.zoomRate + parseInt(this.pageWrap.css("top"), 10)) + "px, 0px) rotateZ(" + this.rotation + "deg)"
        }), this.left = c[0], this.top = c[1], $(".element-bounding .element-left .bounding-values").html(this.left), $(".element-bounding .element-top .bounding-values").html(this.top)
    } else element.prototype.moveElement.call(this, a, b)
}, textElement.prototype.rotateElement = function(a, b, c, d) {
    function e(a) {
        return a * Math.PI / 180
    }

    function f(a) {
        return 180 * a / Math.PI
    }

    function g(a, b, c, d) {
        return Math.atan2(b - d, a - c)
    }

    function h(a) {
        for (var b = 0 > a ? 360 - Math.abs(a) : a, c = [0, 45, 90, 135, 180, 225, 270, 315], d = 2, e = 0; e < c.length; e++)
            if (c[e] - d <= b && b <= c[e] + d) return c[e];
        return a
    }
    this.newInput && (this.newInput = !1), $(".context-menu").remove(), this.element.css({
        transform: "translate3d(" + (this.left * DB.zoomRate + parseInt(this.pageWrap.css("left"), 10)) + "px, " + (this.top * DB.zoomRate + parseInt(this.pageWrap.css("top"), 10)) + "px, 0px) rotateZ(0deg)"
    });
    var i = this.element.offset().left + this.width * DB.zoomRate / 2,
        j = this.element.offset().top + this.height * DB.zoomRate / 2;
    this.element.css({
        transform: "translate3d(" + (this.left * DB.zoomRate + parseInt(this.pageWrap.css("left"), 10)) + "px, " + (this.top * DB.zoomRate + parseInt(this.pageWrap.css("top"), 10)) + "px, 0px) rotateZ(" + this.rotation + "deg)"
    });
    var k = g(c, d, i, j) + e(this.element.data("rotation")) - g(a, b, i, j),
        l = Math.round(f(k));
    this.rotation = h(l), this.element.css({
        transform: "translate3d(" + (this.left * DB.zoomRate + parseInt(this.pageWrap.css("left"), 10)) + "px, " + (this.top * DB.zoomRate + parseInt(this.pageWrap.css("top"), 10)) + "px, 0px) rotateZ(" + this.rotation + "deg)"
    }).data({
        rotation: l
    }), $("#selected-border").css({
        transform: "translate3d(" + (this.left * DB.zoomRate + parseInt(this.pageWrap.css("left"), 10)) + "px, " + (this.top * DB.zoomRate + parseInt(this.pageWrap.css("top"), 10)) + "px, 0px) rotateZ(" + this.rotation + "deg)"
    })
}, textElement.prototype.resizeElement = function(a, b, c, d, e) {
    if ("tl" !== a && "tr" !== a && "br" !== a && "bl" !== a && "t" !== a && "b" !== a) {
        var f = this;
        this.newInput && (this.newInput = !1), element.prototype.resizeElement.call(f, a, b, c, d, e), f.element.css({
            width: f.width * DB.zoomRate,
            transform: "translate3d(" + (f.left * DB.zoomRate + parseInt(f.pageWrap.css("left"), 10)) + "px, " + (f.top * DB.zoomRate + parseInt(f.pageWrap.css("top"), 10)) + "px, 0px) rotateZ(" + f.rotation + "deg)"
        }).data({
            width: f.width,
            left: f.left
        }).find(".inner-text").css({
            width: f.width
        }), f.getInnerHeight();
        var g = f.breakWord();
        f.lineLengths = g, $(".element-bounding .element-left .bounding-values").html(f.left), $(".element-bounding .element-top .bounding-values").html(f.top), $(".element-bounding .element-width .bounding-values").html(f.width), $(".element-bounding .element-height .bounding-values").html(f.height)
    }
}, textElement.prototype.updatePosAndDeg = function(a) {
    element.prototype.updatePosAndDeg.call(this, a), this.element.find(".inner-text").css({
        width: this.width
    })
}, textElement.prototype.extractData = function() {
    var a = element.prototype.extractData.call(this, arguments);
    return a.style = this.style, a.textTransform = this.textTransform, a.fontSize = this.fontSize, a.fontFamily = this.fontFamily, a.html = this.html, a.letterSpacing = this.letterSpacing, a.lineHeight = this.lineHeight, a.lineLengths = this.lineLengths, a.color = this.color, a.bold = this.bold, a.italic = this.italic, a.justification = this.justification, a
};
var patId = 0;
svgElement.prototype = new element, svgElement.prototype.renderElement = function(a) {
    function b(b) {
        objectIsset(b, "screen.url") && c.parseSVG(b.screen.url, a)
    }
    var c = this;
    element.prototype.renderElement.call(c);
    var d, e = DB.elementMedias[c.mediaId];
    objectIsset(e, "bundle.files") ? (d = e.bundle.files, b(d)) : $.ajax({
        url: DB.BaseApi + "media/batch?refs=" + c.mediaId + ":" + c.mediaVersion,
        dataType: "json"
    }).done(function(a) {
        objectIsset(a, "response.0.bundle.files") && (d = a.response[0].bundle.files, DB.elementMedias[c.mediaId] = a.response[0], b(d))
    }).fail(function(a, b) {
        console.log(b), console.log(DB.BaseApi + "media/batch?refs=" + c.mediaId + ":" + c.mediaVersion)
    })
}, svgElement.prototype.selectElement = function() {
    var a = this;
    if (element.prototype.selectElement.call(a, arguments), $(".svg-context #choose-font").addClass("hidden"), $(".svg-context #choose-font-size").addClass("hidden"), $(".svg-context .btn-filter-menu").addClass("hidden"), $(".svg-context .btn-crop").addClass("hidden"), $(".svg-context .btn-text").addClass("hidden"), $(".svg-context .text-divider").addClass("hidden"), $(".svg-context .btn-index").addClass("hidden"), $(".svg-context .btn-sub-grid").addClass("hidden"), 0 < a.element.find(".photoPlaceholder").length) {
        var b = _.template($("#main_context_menu_tmpl").html());
        $("#design-editor").append(b), $(".context-menu:last").addClass("sub-" + a.type + "-context"), $(".sub-svg-context .btn-group.dropdown").addClass("hidden"), $(".sub-svg-context .btn-filter-menu").addClass("hidden"), $(".sub-svg-context .btn-copy").addClass("hidden"), $(".sub-svg-context .btn-fwd").addClass("hidden"), $(".sub-svg-context .btn-back").addClass("hidden"), $(".sub-svg-context .btn-text").addClass("hidden")
    } else 0 < a.element.find(".textPlaceholder").length;
    $("#l-handle, #r-handle, #t-handle, #b-handle").addClass("hidden"), a.element.find("#n, #e, #s, #w, #ne, #se, #sw, #nw").length && $("#l-handle, #r-handle, #t-handle, #b-handle").removeClass("hidden"), a.element.find(".horizontalOnly").length && $("#t-handle, #b-handle").addClass("hidden"), a.element.find(".verticalOnly").length && $("#l-handle, #r-handle").addClass("hidden");
    var c = [],
        d = /color\-/g;
    a.element.find(".color").each(function() {
        _.each(this.classList, function(a) {
            d.test(a) && c.push(a)
        })
    }), c = _.uniq(c), $(".svg-context .btn-select-color").remove();
    for (var e = c.length - 1; e >= 0; e--) {
        var f = c[e],
            g = a.element.find("." + f + ":not(.btn):not(.addColorPalette)").attr("fill");
        $('<button type="button" class="btn btn-default btn-select-color ' + f + '" title="Color select"><span style="background-color: ' + g + '"></span></button>').insertBefore(".svg-context .btn-delete-elem")
    }
},svgElement.prototype.patternId = function() {
    return patId = patId == Math.pow(2, 53) ? 0 : patId + 1, "DB" + patId + "_"
}, svgElement.prototype.parseFrame = function() {
    function a(a, b) {
        var c = [];
        return b.forEach(function(b) {
            b = a.getElementsByTagNameNS("http://www.w3.org/2000/svg", b);
            for (var d = 0; d < b.length; d++) c.push(b[d])
        }), 0 === c.length ? null : c[0]
    }

    function b(a, b) {
        var c = document.createElementNS("http://www.w3.org/2000/svg", a.nodeName);
        return b.forEach(function(b) {
            a.hasAttribute(b) && c.setAttribute(b, a.getAttribute(b))
        }), c
    }

    function c(a, b) {
        b.forEach(function(b, c) {
            var e = {
                left: 0,
                top: 0,
                width: 1438,
                height: 560
            };
            e = d.calculateFramePlaceholder(e, b), $("image.placeholder", a).eq(c).attr("x", e.left).attr("y", e.top).attr("width", e.width).attr("height", e.height)
        })
    }
    var d = this,
        e = d.element.find("svg"),
        f = /^[op](_|$)/i,
        g = d.element.data("vb-left"),
        h = d.element.data("vb-top"),
        i = 0;
    e.find("g").filter(function() {
        return f.test(this.id)
    }).each(function(c, e) {
        var f = document.createElementNS("http://www.w3.org/2000/svg", "g");
        f.setAttribute("class", "designbold"), e.parentNode.insertBefore(f, e), e.parentNode.removeChild(e);
        var j = a(e, ["circle", "ellipse", "path", "polygon", "rect"]);
        if (null !== j) {
            var k = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
            f.appendChild(k), k.id = d.patternId(), k.setAttribute("transform", "translate(" + -g + ", " + -h + ")"), j.setAttribute("class", "photoPlaceholder"), k.appendChild(j);
            var l = document.createElementNS("http://www.w3.org/2000/svg", "image");
            l.setAttribute("class", "placeholder"), l.setAttribute("clip-path", "url(#" + k.id + ")"), l.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "//cdn.designbold.com/dbcream/www/1.0/images/placeholder.jpg"), l.setAttribute("transform", "translate(" + g + ", " + h + ")"), l.setAttribute("data-placeholder-index", i.toString()), i++, f.appendChild(l), j = b(j, "cx cy r rx ry d pathLength points x y width height transform".split(" ")), j.setAttribute("class", "outline"), j.setAttribute("fill", "none"), f.appendChild(j)
        }
    });
    var j = $(e.get(0).cloneNode(!0)),
        k = d.getClippathBoxes(j, ".photoPlaceholder");
    c(e, k), d.loadFrameImage(), d.element.find("svg").appendTo(d.element)
}, svgElement.prototype.getClippathBoxes = function(a, b) {
    var c = this,
        d = [];
    if (0 === a.find(b).length) return d;
    var e = (a.parent(), a.prev(), $("<div></div>"));
    e.appendTo($("#chaos-zone")), e.css({
        width: c.element.data("vb-width"),
        height: c.element.data("vb-height")
    }), a.appendTo(e), a.attr("stroke", "transparent").attr("stroke-width", 0).forceLayout(), c.element.find("svg").attr("stroke", "transparent").attr("stroke-width", 0).removeAttr("style");
    var f = a.get(0).getBoundingClientRect();
    return $(b, a).each(function(a, b) {
        var c = $(b).clone();
        c.attr("fill", "transparent").appendTo($(b).parents("g, svg").first()).forceLayout();
        var e = c.get(0).getBoundingClientRect(),
            g = {
                left: e.left,
                top: e.top,
                width: e.width,
                height: e.height
            };
        c.remove(), g.left -= f.left, g.top -= f.top, d.push(g)
    }), e.remove(), d
},svgElement.prototype.loadFrameImage = function() {
    function a(a, c) {
        var d = b.contents[c],
            e = b.element.find('.placeholder[data-placeholder-index="' + d.index + '"]');
        e[0].onload = function() {
            e.attr({
                x: d.imageBox.left,
                y: d.imageBox.top,
                width: d.imageBox.width,
                height: d.imageBox.height
            }), e[0].onload = !1
        }, e.attr("xlink:href", a.screen.url)
    }
    var b = this;
    _.each(b.element.find(".photoPlaceholder"), function(c, d) {
        var e = $(c).parents(".designbold").find(".placeholder").data("placeholder-index"),
            f = !0;
        if (_.each(b.contents, function(b, c) {
                if (b.index == e) {
                    var g, h = b.mediaId,
                        i = b.mediaVersion,
                        j = DB.elementMedias[h],
                        k = d;
                    objectIsset(j, "bundle.files") ? (g = j.bundle.files, a(g, k)) : $.ajax({
                        url: DB.BaseApi + "media/batch?refs=" + h + ":" + i,
                        dataType: "json"
                    }).done(function(b) {
                        objectIsset(b, "response.0.bundle.files") && (g = b.response[0].bundle.files, DB.elementMedias[h] = b.response[0], a(g, k))
                    }).fail(function(a, b) {
                        console.log(b), console.log(DB.BaseApi + "media/batch?refs=" + h + ":" + i)
                    }), f = !1
                }
            }), f) {
            var g = b.element.find("svg"),
                h = $(g.get(0).cloneNode(!0)),
                i = b.getClippathBoxes(h, ".photoPlaceholder"),
                j = {
                    left: 0,
                    top: 0,
                    width: 1438,
                    height: 560
                };
            j = b.calculateFramePlaceholder(j, i[d]), $("image.placeholder", g).eq(d).attr("x", j.left).attr("y", j.top).attr("width", j.width).attr("height", j.height), $("image.placeholder", g).eq(d).get(0).setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "//cdn.designbold.com/dbcream/www/1.0/images/placeholder.jpg")
        }
    })
}, svgElement.prototype.calculateFramePlaceholder = function(a, b) {
    function c(a) {
        return a.width / a.height
    }

    function d(a, b) {
        return a.left = b.left - (a.width - b.width) / 2, a.top = b.top - (a.height - b.height) / 2, a
    }
    var e = c(a);
    return c(a) > c(b) ? (a.height = b.height, a.width = b.height * e) : (a.width = b.width, a.height = b.width / e), a = d(a, b)
}, svgElement.prototype.preChangeFrameContent = function(a, b) {
    var c = this;
    if (!(0 < c.element.find(".prePlaceholder").length)) {
        var d = a.screen.url,
            e = a.screen.width,
            f = a.screen.height,
            g = c.element.find("svg"),
            h = c.element.find(".placeholder").eq(b).clone(!0);
        h.data({
            element: c.element.index(),
            page: c.pageWrap.index()
        }).appendTo("#chaos-zone");
        var i = $(g.get(0).cloneNode(!0)),
            j = c.getClippathBoxes(i, ".photoPlaceholder"),
            k = {
                left: 0,
                top: 0,
                width: e,
                height: f
            };
        k = c.calculateFramePlaceholder(k, j[b]), c.element.find(".placeholder").eq(b).attr({
            "xlink:href": d,
            "class": "prePlaceholder",
            x: k.left,
            y: k.top,
            width: k.width,
            height: k.height
        }), c.element.find("svg").appendTo(c.element)
    }
}, svgElement.prototype.appendChangeFrameContent = function(a) {
    var b = this,
        c = b.element.find(".prePlaceholder").attr("data-placeholder-index"),
        d = b.element.find(".prePlaceholder").attr("x"),
        e = b.element.find(".prePlaceholder").attr("y"),
        f = b.element.find(".prePlaceholder").attr("width"),
        g = b.element.find(".prePlaceholder").attr("height");
    b.element.removeClass("hover-frame").find(".prePlaceholder").attr({
        "class": "placeholder"
    }), $("#chaos-zone").find(".placeholder").filter(function() {
        return $(this).data("element") === b.element.index() && $(this).data("page") === b.pageWrap.index()
    }).remove();
    var h = {
        type: "image",
        mediaVersion: a.version,
        mediaId: a._id,
        index: parseInt(c),
        imageBox: {
            left: parseFloat(d),
            top: parseFloat(e),
            width: parseFloat(f),
            height: parseFloat(g)
        },
        flipOrientation: 0
    };
    if ("undefined" !== b.contents && "undefined" !== b.contents.length && 0 >= b.contents.length) b.contents = [h];
    else {
        for (var i = !1, j = 0; j < b.contents.length; j++)
            if (parseInt(b.contents[j].index) === parseInt(c)) {
                b.contents[j] = h, i = !0;
                break
            }
        i || b.contents.push(h)
    }
    console.log(b.contents)
}, svgElement.prototype.cancelChangeFrameContent = function() {
    var a = this,
        b = $("#chaos-zone").find(".placeholder").filter(function() {
            return $(this).data("element") === a.element.index() && $(this).data("page") === a.pageWrap.index()
        });
    b.insertBefore(a.element.find(".prePlaceholder")), a.element.removeClass("hover-frame").find(".prePlaceholder").remove()
}, svgElement.prototype.removeFrameContent = function() {
    var a = this,
        b = a.element.find(".placeholder.selected"),
        c = b.data("placeholder-index"),
        d = a.element.find("svg"),
        e = $(d.get(0).cloneNode(!0)),
        f = a.getClippathBoxes(e, ".photoPlaceholder"),
        g = {
            left: 0,
            top: 0,
            width: 1438,
            height: 560
        };
    g = a.calculateFramePlaceholder(g, f[c]), b.attr("x", g.left).attr("y", g.top).attr("width", g.width).attr("height", g.height), b.get(0).setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "//cdn.designbold.com/dbcream/www/1.0/images/placeholder.jpg")
}, svgElement.prototype.parseSVG = function(a, b) {
    function d() {
        var a = n.element.find("svg");
        a.removeAttr("width"), a.removeAttr("height"), a.removeAttr("id"), _.each($("g", a), function(a) {
            a.id = a.id.toLowerCase()
        }), $("style", a).remove(), e(a), f(a)
    }

    function e(a) {
        var b = c = 0,
            d = /^[neswc]_repeat/i,
            e = /^([ns][ew]?|e|w|c)(_\d+)(_|$)/i;
        _.each($("g", a), function(a) {
            if (d.test(a.id)) a.id = a.id.substr(0, 1), a.classList.add("repeat");
            else {
                var f = a.id.match(e);
                f && f[1] && (a.id = f[1])
            } - 1 < ["w", "e"].indexOf(a.id) && b++, -1 < ["n", "s"].indexOf(a.id) && c++
        });
        var f = b > 0 && 0 === c,
            g = 0 < c && 0 === b,
            h = a.get(0);
        f && (h.classList.add("horizontalOnly"), _.each($("g#w, g#c, g#e", a), function(a) {
            a.id = "n" + a.id, "nc" == a.id && (a.id = "n")
        })), g && (h.classList.add("verticalOnly"), _.each($("g#n, g#c, g#s", a), function(a) {
            a.id += "w", "cw" == a.id && (a.id = "w")
        }))
    }

    function f(a) {
        var b = /^change(\d+|$)/i,
            c = a.find("g").filter(function() {
                return b.test(this.id)
            });
        _.each(c, function(a) {
            var b = parseFloat(a.id.substr(6));
            isNaN(b) && (b = 1), a.removeAttribute("id");
            var c = /(\b|^)fill\s*:\s*([^;]+);\s*/i,
                d = null;
            _.each($("[style*=fill], [fill]", a), function(a) {
                var e = a.getAttribute("style"),
                    f = e && e.match(c);
                d = f ? e.match(c)[2] : a.getAttribute("fill"), f && (e = e.replace(c, ""), a.setAttribute("style", e), a.setAttribute("fill", d)), a.classList.add("color"), a.classList.add("color-" + b), a.setAttribute("data-color", d)
            })
        })
    }

    function g() {
        if ("undefined" == typeof n.fillColors || null == n.fillColors) {
            var a = [],
                c = /color\-/g;
            n.element.find(".color").each(function() {
                _.each(this.classList, function(b) {
                    c.test(b) && a.push(b)
                })
            }), a = _.uniq(a), n.fillColors = [];
            for (var d = a.length - 1; d >= 0; d--) {
                var e = a[d],
                    f = $("." + e, n.element).attr("fill"),
                    g = parseInt(e.replace(/color\-/g, ""), 10) - 1;
                n.fillColors.unshift({
                    index: g,
                    color: f
                }), b && "function" == typeof b && b()
            }
        }
        var h = n.element.find("svg");
        _.each(n.fillColors, function(a) {
            var b = a.index + 1,
                c = a.color;
            _.each($(".color-" + b, h), function(a) {
                a.setAttribute("fill", c)
            })
        })
    }

    function h() {
        if (a) {
            var b = n.element.find("svg")[0].getAttribute("viewBox").split(" ");
            n.element.data({
                "vb-left": parseFloat(b[0]),
                "vb-top": parseFloat(b[1]),
                "vb-width": parseFloat(b[2]),
                "vb-height": parseFloat(b[3])
            })
        }
        var c = {
            left: n.element.data("vb-left"),
            top: n.element.data("vb-top"),
            width: n.element.data("vb-width"),
            height: n.element.data("vb-height")
        };
        return c
    }

    function i(a, b, c, d, e, f) {
        if (0 !== a.length) {
            var g = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
            b.appendChild(g), g.id = n.patternId() + patId, g.setAttribute("width", e), g.setAttribute("height", f), g.setAttribute("patternUnits", "userSpaceOnUse"), g.setAttribute("patternTransform", "translate(" + c.toString() + ", " + d.toString() + ")");
            var h = a.get(0).cloneNode(!0);
            h.removeAttribute("id"), h.setAttribute("transform", "translate(" + (-c).toString() + ", " + (-d).toString() + ")"), $("g.db-text, .textPlaceholder, .photoPlaceholder", h).remove(), g.appendChild(h), a.children(":not(.db-text)").remove();
            var i = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            i.setAttribute("class", "repeat"), i.setAttribute("fill", "url(#" + g.id + ")"), i.setAttribute("x", c), i.setAttribute("y", d), i.setAttribute("width", g.getAttribute("width")), i.setAttribute("height", g.getAttribute("height")), a.prepend(i)
        }
    }

    function j() {
        var a = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                repeat: !1,
                verticalOnly: !0,
                horizontalOnly: !0
            },
            b = n.element.find("svg"),
            c = h();
        if (_.each($("g", b), function(b) {
                -1 != ["n", "e", "w", "s"].indexOf(b.id.toLowerCase()) && (a.repeat |= b.classList.contains("repeat")), -1 != ["ne", "e", "se"].indexOf(b.id.toLowerCase()) ? (a.right = Math.max(a.right, c.width - b.getBBox().x), a.right == c.width && (a.right = 0)) : -1 != ["n", "c", "s"].indexOf(b.id) && (a.left = Math.max(a.left, b.getBBox().x)), -1 != ["sw", "s", "se"].indexOf(b.id.toLowerCase()) ? (a.bottom = Math.max(a.bottom, c.height - b.getBBox().y), a.bottom == c.height && (a.bottom = 0)) : -1 != ["w", "c", "e"].indexOf(b.id) && (a.top = Math.max(a.top, b.getBBox().y))
            }), a.verticalOnly = !b.get(0).classList.contains("verticalOnly"), a.horizontalOnly = !b.get(0).classList.contains("horizontalOnly"), a.repeat && !$("defs", b).length) {
            var d = document.createElementNS("http://www.w3.org/2000/svg", "defs");
            b.prepend(d);
            var e = a.left + a.right,
                f = a.top + a.bottom,
                g = b.get(0).classList.contains("horizontalOnly"),
                j = b.get(0).classList.contains("verticalOnly");
            i($("g#n", b), d, a.left, 0, c.width - e, g ? c.height : a.top), i($("g#s", b), d, a.left, c.height - a.bottom, c.width - e, g ? c.height : a.bottom), i($("g#c", b), d, a.left, a.top, c.width - e, c.height - f), i($("g#w", b), d, 0, a.top, j ? c.width : a.left, c.height - f), i($("g#e", b), d, c.width - a.right, a.top, j ? c.width : a.right, c.width - f)
        }
        return a
    }

    function k() {
        var a = h(),
            b = a.height * n.width / n.height,
            c = a.left + " " + a.top + " " + b + " " + a.height;
        n.element.find("svg")[0].setAttribute("viewBox", c);
        var d = m.left + m.right,
            e = a.width - d,
            f = b - d,
            g = f / e,
            i = -m.left * (g - 1);
        _.each($("g#n, g#c, g#s", n.element.find("svg")), function(a) {
            var b = void 0 === $(a).data("scaleY") ? 1 : $(a).data("scaleY"),
                c = $(a).data("offsetY") || 0;
            "c" == a.id && (c = -m.top * (b - 1)), m.repeat ? $(".repeat", a).attr("width", f) : $(a).attr("transform", "translate(" + i.toString() + ", " + c.toString() + ") scale(" + g.toString() + ", " + b.toString() + ")"), $(a).data("deltaX", f - e).data("scaleX", g)
        });
        var j = f - e - 1;
        _.each($("g#ne, g#e, g#se", n.element.find("svg")), function(a) {
            var b = $(a).data("offsetY") || 0,
                c = void 0 === $(a).data("scaleY") ? 1 : $(a).data("scaleY");
            "e" == a.id && (b = -m.top * (c - 1)), "e" == a.id && m.repeat ? $(a).attr("transform", "translate(" + j.toString() + ")").data("offsetX", j) : $(a).attr("transform", "translate(" + j.toString() + ", " + b.toString() + ") scale(1, " + c.toString() + ")").data("offsetX", j)
        }), _.each($("g#nw, g#w, g#sw", n.element.find("svg")), function(a) {
            var b = $(a).data("offsetY") || 0,
                c = void 0 === $(a).data("scaleY") ? 1 : $(a).data("scaleY");
            "w" == a.id && (b = -m.top * (c - 1)), "w" == a.id && m.repeat ? $(a).attr("transform", "translate(1, 0)").data("offsetX", 1) : $(a).attr("transform", "translate(1," + b.toString() + ") scale(1," + c.toString() + ")").data("offsetX", 1)
        })
    }

    function l() {
        var a = h(),
            b = a.width * n.height / n.width,
            c = a.left + " " + a.top + " " + a.width + " " + b;
        n.element.find("svg")[0].setAttribute("viewBox", c);
        var d = m.top + m.bottom,
            e = a.height - d,
            f = b - d,
            g = f / e,
            i = -m.top * (g - 1);
        _.each($("g#w, g#c, g#e", n.element.find("svg")), function(a) {
            var b = void 0 === $(a).data("scaleX") ? 1 : $(a).data("scaleX"),
                c = $(a).data("offsetX") || 0;
            "c" == a.id && (c = -m.left * (b - 1)), m.repeat ? $(".repeat", a).attr("height", f) : $(a).attr("transform", "translate(" + c.toString() + ", " + i.toString() + ") scale(" + b.toString() + ", " + g.toString() + ")"), $(a).data("deltaY", f - e).data("scaleY", g)
        });
        var j = f - e - 1;
        _.each($("g#sw, g#s, g#se", n.element.find("svg")), function(a) {
            var b = $(a).data("offsetX") || 0,
                c = void 0 === $(a).data("scaleX") ? 1 : $(a).data("scaleX");
            "s" == a.id && (b = -m.left * (c - 1)), "s" == a.id && m.repeat ? $(a).attr("transform", "translate(0, " + j.toString() + ")").data("offsetY", j) : $(a).attr("transform", "translate(" + b.toString() + ", " + j.toString() + ") scale(" + c.toString() + ", 1)").data("offsetY", j)
        }), _.each($("g#nw, g#n, g#ne", n.element.find("svg")), function(a) {
            var b = $(a).data("offsetX") || 0,
                c = void 0 === $(a).data("scaleX") ? 1 : $(a).data("scaleX");
            "n" == a.id && (b = -m.left * (c - 1)), "n" == a.id && m.repeat ? $(a).attr("transform", "translate(0, 1)").data("offsetY", 1) : $(a).attr("transform", "translate(" + b.toString() + ", 1) scale(" + c.toString() + ", 1)").data("offsetY", 1)
        })
    }
    var m, n = this;
    a ? $.ajax({
        url: a,
        type: "GET"
    }).done(function(a) {
        for (var b = a.childNodes.length - 1; b >= 0; b--)
            if (1 == a.childNodes[b].nodeType) {
                var c = a.childNodes[b].outerHTML;
                c = c.replace(/<\?xml.+\?>/g, ""), c = c.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, ""), c = c.trim(), n.element.html(c), d(), m = j(), n.element.find("svg").get(0).classList.contains("verticalOnly") ? l() : k(), g(), n.parseFrame()
            }
    }).fail(function(b, c) {
        console.log(c), console.log(a)
    }) : (m = j(), n.element.find("svg").get(0).classList.contains("verticalOnly") ? l() : k())
}, svgElement.prototype.resizeElement = function(a, b, c, d, e) {
    if (("t" !== a && "b" !== a || !this.element.find(".horizontalOnly").length) && ("l" !== a && "r" !== a || !this.element.find(".verticalOnly").length)) {
        var f = !1;
        ("tl" === a || "tr" === a || "br" === a || "bl" === a) && (f = !0), element.prototype.resizeElement.call(this, a, b, c, d, e, f), this.parseSVG()
    }
}, svgElement.prototype.startCropFrame = function(a) {
    var b = this;
    b.beforeCrop = {
        imageBox: b.contents[a].imageBox
    };
    var c = parseInt($(".page.selected").css("left"), 10),
        d = parseInt($(".page.selected").css("top"), 10),
        e = b.width / b.element.data("vb-width");
    b.cropInfo = {
        offsetLeft: c,
        offsetTop: d,
        scaleRatio: e,
        frameIndex: a
    };
    var f = new Image;
    f.onload = function() {
        b.cropInfo.naturalWidth = f.naturalWidth, b.cropInfo.naturalHeight = f.naturalHeight
    }, f.src = b.element.find(".placeholder").eq(a).attr("xlink:href");
    var g = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
        h = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("xmlns", "http://www.w3.org/2000/svg"), g.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink"), g.setAttribute("version", "1.1"), g.setAttribute("viewBox", b.element.find("svg").get(0).getAttribute("viewBox")), g.style.transform = "translate3d(0px, 0px, 0px)", g.style.width = b.width * DB.zoomRate + "px", g.style.height = b.height * DB.zoomRate + "px", g.appendChild(h), b.element.find(".placeholder.selected").clone(!0).off().appendTo(h), $("image", g).get(0).setAttribute("crossorigin", "anonymous"), $("#design-wrap .scroll-editer").getNiceScroll()[0].locked = !0, $('<div class="crop-zone"></div>').css({
        width: b.width * DB.zoomRate,
        height: b.height * DB.zoomRate,
        transform: "translate3d(" + (c + b.left * DB.zoomRate) + "px, " + (d + b.top * DB.zoomRate) + "px, 0px)"
    }).appendTo("#crop-editor"), $('<div class="inner-image"></div>').css({
        width: b.width * DB.zoomRate,
        height: b.height * DB.zoomRate
    }).append(g).appendTo(".crop-zone"), $("#selected-border").removeAttr("class").addClass("crop-resize").css({
        width: b.contents[a].imageBox.width * e * DB.zoomRate,
        height: b.contents[a].imageBox.height * e * DB.zoomRate,
        transform: "translate3d(" + (c + b.left * DB.zoomRate + b.contents[a].imageBox.left * e * DB.zoomRate) + "px, " + (d + b.top * DB.zoomRate + b.contents[a].imageBox.top * e * DB.zoomRate) + "px, 0px)"
    }).append('<img src="' + f.src + '" class="uncroped">'), $(".crop-resize img").css({
        opacity: .5,
        width: b.contents[a].imageBox.width * e * DB.zoomRate,
        height: b.contents[a].imageBox.height * e * DB.zoomRate,
        transform: "translate3d(0px, 0px, 0px)"
    }), $(".context-menu").remove(), $('[id$="-handle"]').addClass("hidden"), $("#tl-handle, #tr-handle, #br-handle, #bl-handle").removeClass("hidden"), $("#crop-editor").removeClass("hidden"), b.element.find(".placeholder.selected").get(0).classList.add("hidden"), b.element.find("g:not(.designbold)").each(function() {
        this.classList.add("hidden")
    }), _.bindAll(b, "acceptCrop", "cancelCrop"), $(".btn-accept-crop").unbind("click").bind("click", b.acceptCrop), $(".btn-cancel-crop").unbind("click").bind("click", b.cancelCrop)
}, svgElement.prototype.moveCrop = function(a, b) {
    var c = this,
        d = c.contents[c.cropInfo.frameIndex].imageBox.left + a / DB.zoomRate / c.cropInfo.scaleRatio,
        e = c.contents[c.cropInfo.frameIndex].imageBox.top + b / DB.zoomRate / c.cropInfo.scaleRatio,
        f = $(".crop-zone").find(".placeholder.selected"),
        g = c.element.find("svg"),
        h = $(g.get(0).cloneNode(!0)),
        i = c.getClippathBoxes(h, ".photoPlaceholder"),
        j = i[c.cropInfo.frameIndex].left,
        k = i[c.cropInfo.frameIndex].top,
        l = i[c.cropInfo.frameIndex].width,
        m = i[c.cropInfo.frameIndex].height;
    d > j && (d = j), e > k && (e = k), d + c.contents[c.cropInfo.frameIndex].imageBox.width < l + j && (d = l - c.contents[c.cropInfo.frameIndex].imageBox.width + j), e + c.contents[c.cropInfo.frameIndex].imageBox.height < m + k && (e = m - c.contents[c.cropInfo.frameIndex].imageBox.height + k), c.contents[c.cropInfo.frameIndex].imageBox.left = d, c.contents[c.cropInfo.frameIndex].imageBox.top = e, $("#selected-border").css({
        transform: "translate3d(" + (c.cropInfo.offsetLeft + c.left * DB.zoomRate + c.contents[c.cropInfo.frameIndex].imageBox.left * c.cropInfo.scaleRatio * DB.zoomRate) + "px, " + (c.cropInfo.offsetTop + c.top * DB.zoomRate + c.contents[c.cropInfo.frameIndex].imageBox.top * c.cropInfo.scaleRatio * DB.zoomRate) + "px, 0px)"
    }), f.get(0).setAttribute("x", c.contents[c.cropInfo.frameIndex].imageBox.left), f.get(0).setAttribute("y", c.contents[c.cropInfo.frameIndex].imageBox.top), c.element.find("svg").appendTo(c.element)
}, svgElement.prototype.resizeCrop = function(a, b, c) {
    var d = this;
    if ("l" !== a && "t" !== a && "r" !== a && "b" !== a) {
        var e = d.contents[d.cropInfo.frameIndex].imageBox.left,
            f = d.contents[d.cropInfo.frameIndex].imageBox.top,
            g = d.contents[d.cropInfo.frameIndex].imageBox.width,
            h = d.contents[d.cropInfo.frameIndex].imageBox.height;
        if ("tl" === a) {
            if (0 === e && b > 0 || 0 === f && c > 0) return;
            g -= b / DB.zoomRate / d.cropInfo.scaleRatio, h -= c / DB.zoomRate / d.cropInfo.scaleRatio, e += b / DB.zoomRate / d.cropInfo.scaleRatio, f += c / DB.zoomRate / d.cropInfo.scaleRatio, b > c ? (g = Math.round(d.contents[d.cropInfo.frameIndex].imageBox.width * h / d.contents[d.cropInfo.frameIndex].imageBox.height), e = d.contents[d.cropInfo.frameIndex].imageBox.left - (g - d.contents[d.cropInfo.frameIndex].imageBox.width)) : c > b && (h = Math.round(d.contents[d.cropInfo.frameIndex].imageBox.height * g / d.contents[d.cropInfo.frameIndex].imageBox.width), f = d.contents[d.cropInfo.frameIndex].imageBox.top - (h - d.contents[d.cropInfo.frameIndex].imageBox.height))
        } else if ("tr" === a) {
            if (g === Math.abs(e) + d.width && 0 > b || 0 === f && c > 0) return;
            g += b / DB.zoomRate / d.cropInfo.scaleRatio, h = Math.round(d.contents[d.cropInfo.frameIndex].imageBox.height * g / d.contents[d.cropInfo.frameIndex].imageBox.width), f = d.contents[d.cropInfo.frameIndex].imageBox.top - (h - d.contents[d.cropInfo.frameIndex].imageBox.height)
        } else if ("bl" === a) {
            if (0 === e && b > 0 || h === Math.abs(f) + d.height && 0 > c) return;
            h += c / DB.zoomRate / d.cropInfo.scaleRatio, g = Math.round(d.contents[d.cropInfo.frameIndex].imageBox.width * h / d.contents[d.cropInfo.frameIndex].imageBox.height), e = d.contents[d.cropInfo.frameIndex].imageBox.left - (g - d.contents[d.cropInfo.frameIndex].imageBox.width)
        } else if ("br" === a) {
            if (g === Math.abs(e) + d.width && 0 > b || h === Math.abs(f) + d.height && 0 > c) return;
            g += b / DB.zoomRate / d.cropInfo.scaleRatio, h += c / DB.zoomRate / d.cropInfo.scaleRatio, b > c ? g = Math.round(d.contents[d.cropInfo.frameIndex].imageBox.width * h / d.contents[d.cropInfo.frameIndex].imageBox.height) : c > b && (h = Math.round(d.contents[d.cropInfo.frameIndex].imageBox.height * g / d.contents[d.cropInfo.frameIndex].imageBox.width))
        }
        var i = $(".crop-zone").find(".placeholder.selected"),
            j = d.element.find("svg"),
            k = $(j.get(0).cloneNode(!0)),
            l = d.getClippathBoxes(k, ".photoPlaceholder"),
            m = l[d.cropInfo.frameIndex].left,
            n = l[d.cropInfo.frameIndex].top,
            o = l[d.cropInfo.frameIndex].width,
            p = l[d.cropInfo.frameIndex].height;
        o > g && (g = o), p > h && (h = p), e > m && (g += e - m, h = Math.round(d.cropInfo.naturalHeight * g / d.cropInfo.naturalWidth), e = m), f > n && (h += f - n, g = Math.round(d.cropInfo.naturalWidth * h / d.cropInfo.naturalHeight), f = n), o + m > e + g && (e = o + m - g), p + n > f + h && (f = p + n - h), d.contents[d.cropInfo.frameIndex].imageBox.left = e, d.contents[d.cropInfo.frameIndex].imageBox.top = f, d.contents[d.cropInfo.frameIndex].imageBox.width = g, d.contents[d.cropInfo.frameIndex].imageBox.height = h, $("#selected-border").css({
            width: d.contents[d.cropInfo.frameIndex].imageBox.width * d.cropInfo.scaleRatio * DB.zoomRate,
            height: d.contents[d.cropInfo.frameIndex].imageBox.height * d.cropInfo.scaleRatio * DB.zoomRate,
            transform: "translate3d(" + (d.cropInfo.offsetLeft + d.left * DB.zoomRate + d.contents[d.cropInfo.frameIndex].imageBox.left * d.cropInfo.scaleRatio * DB.zoomRate) + "px, " + (d.cropInfo.offsetTop + d.top * DB.zoomRate + d.contents[d.cropInfo.frameIndex].imageBox.top * d.cropInfo.scaleRatio * DB.zoomRate) + "px, 0px)"
        }), $(".uncroped").css({
            width: d.contents[d.cropInfo.frameIndex].imageBox.width * d.cropInfo.scaleRatio * DB.zoomRate,
            height: d.contents[d.cropInfo.frameIndex].imageBox.height * d.cropInfo.scaleRatio * DB.zoomRate
        }), i.get(0).setAttribute("x", d.contents[d.cropInfo.frameIndex].imageBox.left), i.get(0).setAttribute("y", d.contents[d.cropInfo.frameIndex].imageBox.top), i.get(0).setAttribute("width", d.contents[d.cropInfo.frameIndex].imageBox.width), i.get(0).setAttribute("height", d.contents[d.cropInfo.frameIndex].imageBox.height), d.element.find("svg").appendTo(d.element)
    }
}, svgElement.prototype.acceptCrop = function() {
    $(".crop-zone img").get(0);
    $("#crop-editor").addClass("hidden"), $("#selected-border").removeClass("crop-resize").find(".uncroped").remove(), $("#design-wrap .scroll-editer").getNiceScroll()[0].locked = !1, $(".crop-zone").remove(), this.element.find(".hidden").each(function() {
        this.classList.remove("hidden")
    }), this.element.find(".placeholder.selected").get(0).setAttribute("x", this.contents[this.cropInfo.frameIndex].imageBox.left), this.element.find(".placeholder.selected").get(0).setAttribute("y", this.contents[this.cropInfo.frameIndex].imageBox.top), this.element.find(".placeholder.selected").get(0).setAttribute("width", this.contents[this.cropInfo.frameIndex].imageBox.width), this.element.find(".placeholder.selected").get(0).setAttribute("height", this.contents[this.cropInfo.frameIndex].imageBox.height), this.deselectElement(), DB.designChange = !0
}, svgElement.prototype.cancelCrop = function() {
    var a = this;
    a.contents[a.cropInfo.frameIndex].imageBox = a.beforeCrop.imageBox, $("#crop-editor").addClass("hidden"), $("#selected-border").removeClass("crop-resize").find(".uncroped").remove(), $("#design-wrap .scroll-editer").getNiceScroll()[0].locked = !1, $(".crop-zone").remove(), this.element.find(".hidden").each(function() {
        this.classList.remove("hidden")
    }), a.deselectElement()
}, svgElement.prototype.changeColor = function(a, b) {
    for (var c = 0; c < this.fillColors.length; c++)
        if (this.fillColors[c].index === a) {
            this.fillColors[c].color = "#" + b;
            break
        }
    this.element.find(".color-" + (a + 1)).attr({
        fill: "#" + b
    }).data({
        color: "#" + b
    })
}, svgElement.prototype.getId = function() {
    return this.mediaId
}, svgElement.prototype.getFrameId = function(a) {
    return this.contents[a].mediaId
}, svgElement.prototype.updatePosAndDeg = function(a) {
    element.prototype.updatePosAndDeg.call(this, a), this.parseSVG()
}, svgElement.prototype.extractData = function() {
    var a = element.prototype.extractData.call(this, arguments);
    return a.mediaId = this.mediaId, a.mediaVersion = this.mediaVersion, a.fillColors = this.fillColors, a.scale = this.scale, a.contents = this.contents, a
}, DB.DesignCore = Backbone.View.extend({
    events: {
        mousedown: "globalMousedown",
        mouseup: "globalMouseup",
        mousemove: "globalMousemove"
    },
    extractPageDataToModel: function() {
        var a = this;
        if (DB.designChange) {
            var b = a.collection.document.get("pageObject"),
                c = [];
            _.each(b, function(a, b) {
                _.each(a.elements, function(d, e) {
                    c[b] || (c[b] = {
                        width: a.width,
                        height: a.height,
                        elements: [],
                        layout: a.layout
                    }), c[b].elements[e] = d.extractData()
                })
            }), a.collection.document.set({
                palette: JSON.stringify(DB.colorPalette),
                pages: JSON.stringify(c)
            }), $(".top-bar .global-control .btn_save").removeClass("disabled"), "function" == typeof a.toggleEditedState ? a.toggleEditedState() : DB.designChange && "function" == typeof a.saveDesign && ($(".top-bar .global-control .btn_save").hasClass("disabled") || (window.clearTimeout(a.autoSave), a.autoSave = window.setTimeout(function() {
                a.saveDesign()
            }, 3e3)))
        }
    },
    saveAction: function(a, b, c, d) {
        var e = this;
        if (a && "undefined" != typeof b) {
            var f = {
                    name: a,
                    pageIndex: b
                },
                g = e.collection.document.get("pageObject"),
                h = e.collection.document.get("pages");
            if (console.log(DB.actionArray, a), "string" == typeof h && (h = JSON.parse(h)), "new-page" === a && (f.data = JSON.parse(JSON.stringify(g[b])), DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()), "move-page-fwd" === a && (DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()), "move-page-back" === a && (DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()), "page-change" === a && (f.oldData = objectIsset(h, b.toString()) ? JSON.parse(JSON.stringify(h[b])) : [], f.newData = JSON.parse(JSON.stringify(g[b])), DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()), "delete-page" === a && (f.data = objectIsset(h, b.toString()) ? JSON.parse(JSON.stringify(h[b])) : [], DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()), "new-element" === a && "undefined" !== c && (f.elementIndex = c, f.data = objectIsset(g, b + ".elements." + c) ? JSON.parse(JSON.stringify(g[b].elements[c])) : null, DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()), "change-background" === a && "undefined" !== c && (f.elementIndex = c, f.oldBackground = h[b].elements[c], f.newBackground = g[b].elements[c], DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()), "move-element-fwd" === a && "undefined" !== c && (f.oldIndex = c - 1, DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()), "move-element-back" === a && "undefined" !== c && (f.oldIndex = c + 1, DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()), "delete-element" === a && "undefined" !== c && (f.elementIndex = c, f.data = JSON.parse(JSON.stringify(h[b].elements[c])), DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()), "move-element" === a && "undefined" !== c) {
                f.elementIndex = c;
                var i = g[b].elements[c].left - h[b].elements[c].left,
                    j = g[b].elements[c].top - h[b].elements[c].top;
                f.data = {
                    x: i,
                    y: j
                }, DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()
            }
            if ("resize-element" === a && "undefined" !== c) {
                f.elementIndex = c;
                var i = g[b].elements[c].left - h[b].elements[c].left,
                    j = g[b].elements[c].top - h[b].elements[c].top,
                    k = g[b].elements[c].width - h[b].elements[c].width,
                    l = g[b].elements[c].height - h[b].elements[c].height;
                f.data = {
                    x: i,
                    y: j,
                    w: k,
                    h: l
                }, DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()
            }
            if ("rotate-element" === a && "undefined" !== c) {
                f.elementIndex = c;
                var m = g[b].elements[c].rotation - h[b].elements[c].rotation;
                f.data = {
                    rotation: m
                }, DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()
            }
            if ("frame-change" === a && "undefined" !== c) {
                f.elementIndex = c;
                var n = h[b].elements[c].contents,
                    o = g[b].elements[c].contents;
                f.data = {
                    oldFrame: n,
                    newFrame: o
                }, DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()
            }
            if ("input-text" === a && "undefined" !== c) {
                f.elementIndex = c;
                var k = g[b].elements[c].width - h[b].elements[c].width,
                    l = g[b].elements[c].height - h[b].elements[c].height;
                f.data = {
                    w: k,
                    h: l,
                    oldHTML: h[b].elements[c].html,
                    newHTML: g[b].elements[c].html
                }, DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()
            }
            if ("crop-image" === a && "undefined" !== c && (f.elementIndex = c, f.data = {
                    oldImageBox: h[b].elements[c].imageBox,
                    newImageBox: g[b].elements[c].imageBox
                }, DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()), "change-color" === a && "undefined" !== c) {
                f.elementIndex = c;
                var p, q;
                if ("text" === g[b].elements[c].type) p = objectIsset(h, b + ".elements." + c) ? h[b].elements[c].color : "#000000", q = g[b].elements[c].color;
                else if ("svg" === g[b].elements[c].type) {
                    var r = objectIsset(h, b + ".elements." + c) ? h[b].elements[c].fillColors : [],
                        s = g[b].elements[c].fillColors,
                        t = parseInt(e.svgColorClass.replace(/color\-/g, ""), 10) - 1;
                    if (d);
                    else {
                        for (var u = r.length - 1; u >= 0; u--)
                            if (r[u].index === t) {
                                p = r[u].color;
                                break
                            }
                        for (var v = s.length - 1; v >= 0; v--)
                            if (s[v].index === t) {
                                q = s[v].color;
                                break
                            }
                        f.pathIndex = t
                    }
                } else if ("grid" === g[b].elements[c].type && d) {
                    for (var r = h[b].elements[c].contents, s = g[b].elements[c].contents, u = r.length - 1; u >= 0; u--)
                        if (r[u] === d) {
                            p = r[u].backgroundColor;
                            break
                        }
                    for (var v = s.length - 1; v >= 0; v--)
                        if (s[v] === d) {
                            q = r[v].backgroundColor;
                            break
                        }
                    f.childIndex = d
                } else p = objectIsset(h, b + ".elements." + c) ? h[b].elements[c].backgroundColor : "#ffffff", q = g[b].elements[c].backgroundColor;
                f.data = {
                    oldColor: p.substring(1, 7),
                    newColor: q.substring(1, 7)
                }, DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()
            }
            "change-font-family" === a && "undefined" !== c && (f.elementIndex = c, f.data = {
                oldFamily: h[b].elements[c].fontFamily,
                newFamily: g[b].elements[c].fontFamily
            }, DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()), "change-font-size" === a && "undefined" !== c && (f.elementIndex = c, f.data = {
                oldSize: h[b].elements[c].fontSize,
                newSize: g[b].elements[c].fontSize
            }, DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()), "change-align" === a && "undefined" !== c && (f.elementIndex = c, f.data = {
                oldAlign: h[b].elements[c].textAlign,
                newAlign: g[b].elements[c].textAlign
            }, DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()), "change-uppercase" === a && "undefined" !== c && (f.elementIndex = c, f.data = {
                old: h[b].elements[c].textTransform,
                "new": g[b].elements[c].textTransform
            }, DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()), "change-bold" === a && "undefined" !== c && (f.elementIndex = c, f.data = {
                old: h[b].elements[c].bold,
                "new": g[b].elements[c].bold
            }, DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()), "change-italic" === a && "undefined" !== c && (f.elementIndex = c, f.data = {
                old: h[b].elements[c].italic,
                "new": g[b].elements[c].italic
            }, DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()), "change-line-height" === a && "undefined" !== c && (f.elementIndex = c, f.data = {
                oldLineHeight: h[b].elements[c].lineHeight,
                newLineHeight: g[b].elements[c].lineHeight
            }, DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()), "change-letter-spacing" === a && "undefined" !== c && (f.elementIndex = c, f.data = {
                oldLetterSpacing: h[b].elements[c].letterSpacing,
                newLetterSpacing: g[b].elements[c].letterSpacing
            }, DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()), "change-opacity" === a && "undefined" !== c && (f.elementIndex = c, f.data = {
                oldTransparency: h[b].elements[c].transparency,
                newTransparency: g[b].elements[c].transparency
            }, DB.actionArray.splice(DB.currentHistory, DB.actionArray.length - DB.currentHistory, f), e.extractPageDataToModel()), DB.currentHistory += 1, $("#design-wrap .content_option .btn_undo").removeClass("disabled"), $("#design-wrap .content_option .btn_redo").addClass("disabled"), console.log(DB.actionArray, DB.currentHistory)
        }
    },
    undoAction: function(a) {
        a.preventDefault();
        var b = this;
        if (0 != DB.currentHistory) {
            DB.currentHistory -= 1;
            var c = b.collection.document.get("pageObject"),
                d = DB.actionArray[DB.currentHistory];
            if (b.clearSelectElement(), console.log(d, DB.currentHistory), 0 === DB.currentHistory && $("#design-wrap .content_option .btn_undo").addClass("disabled"), $("#design-wrap .content_option .btn_redo").removeClass("disabled"), "new-page" === d.name) {
                var e = b.collection.document.get("pageObject");
                e.splice(d.pageIndex, 1), b.collection.document.set("pageObject", e), $(".page:nth(" + d.pageIndex + ")").remove(), b.calculatePosEachPage(), b.numberedPage()
            }
            if ("move-page-fwd" === d.name && ($(".page").removeClass("selected"), $($(".page").get(d.pageIndex - 1)).addClass("selected"), b.movePageDown(a)), "move-page-back" === d.name && ($(".page").removeClass("selected"), $($(".page").get(d.pageIndex + 1)).addClass("selected"), b.movePageUp(a)), "page-change" === d.name && ($(".page").removeClass("selected"), $($(".page").get(d.pageIndex)).addClass("selected"), b.renderPage(d.oldData)), "delete-page" === d.name && (b.addNewPage(!0), $(".page:nth(" + d.pageIndex + ")").before($(".page:last")), b.calculatePosEachPage(), b.numberedPage(), c.pop(), c.splice(d.pageIndex, 0, _.extend({}, d.data)), c[d.pageIndex].elements = [], b.renderPage(d.data)), "new-element" === d.name && (b.clearSelectElement(), c[d.pageIndex].elements[d.elementIndex].deleteElement(), c[d.pageIndex].elements.splice(d.elementIndex, 1), _.each(c[d.pageIndex].elements, function(a) {
                    a.setDataIndex()
                })), "change-background" === d.name) {
                b.clearSelectElement(), c[d.pageIndex].elements[d.elementIndex].deleteElement();
                var f = $(".page:nth(" + d.pageIndex + ")"),
                    g = new imageElement(d.oldBackground, f);
                c[d.pageIndex].elements[d.elementIndex] = g, g.renderElement(null, !0)
            }
            if ("move-element-fwd" === d.name && (c[d.pageIndex].elements[d.elementIndex].selectElement(), b.calculatePosContext(), b.moveElementBack(a)), "move-element-back" === d.name && (c[d.pageIndex].elements[d.elementIndex].selectElement(), b.calculatePosContext(), b.moveElementFwd(a)), "delete-element" === d.name) {
                var g, f = $(".page:nth(" + d.pageIndex + ")");
                "svg" === d.data.type ? g = new svgElement(d.data, f) : "text" === d.data.type ? g = new textElement(d.data, f) : "grid" === d.data.type ? g = new gridElement(d.data, f) : "image" === d.data.type && (g = new imageElement(d.data, f)), g.renderElement(), f.find(".elements .element:nth(" + d.elementIndex + ")").before(g.element), c[d.pageIndex].elements.splice(d.elementIndex, 0, g)
            }
            if ("move-element" === d.name) {
                var h = -d.data.x * DB.zoomRate,
                    i = -d.data.y * DB.zoomRate;
                c[d.pageIndex].elements[d.elementIndex].moveElement(h, i), c[d.pageIndex].elements[d.elementIndex].selectElement(), b.calculatePosContext()
            }
            if ("resize-element" === d.name) {
                var j = {
                    left: -d.data.x,
                    top: -d.data.y,
                    width: -d.data.w,
                    height: -d.data.h
                };
                c[d.pageIndex].elements[d.elementIndex].updatePosAndDeg(j), c[d.pageIndex].elements[d.elementIndex].selectElement(), b.calculatePosContext()
            }
            if ("rotate-element" === d.name) {
                var j = {
                    angle: -d.data.rotation
                };
                c[d.pageIndex].elements[d.elementIndex].updatePosAndDeg(j), c[d.pageIndex].elements[d.elementIndex].selectElement(), b.calculatePosContext()
            }
            "frame-change" === d.name && (c[d.pageIndex].elements[d.elementIndex].contents = d.data.oldFrame, c[d.pageIndex].elements[d.elementIndex].loadFrameImage()), "input-text" === d.name && (c[d.pageIndex].elements[d.elementIndex].element.find(".inner-text").html(d.data.oldHTML), c[d.pageIndex].elements[d.elementIndex].inputText(null, !0)), "change-color" === d.name && ("svg" === c[d.pageIndex].elements[d.elementIndex].type ? c[d.pageIndex].elements[d.elementIndex].changeColor(d.pathIndex, d.data.oldColor) : "grid" === c[d.pageIndex].elements[d.elementIndex].type || c[d.pageIndex].elements[d.elementIndex].changeColor(d.data.oldColor)), "change-font-family" === d.name && c[d.pageIndex].elements[d.elementIndex].changeFontFamily(d.data.oldFamily), "change-font-size" === d.name && c[d.pageIndex].elements[d.elementIndex].changeFontSize(d.data.oldSize), "change-align" === d.name && c[d.pageIndex].elements[d.elementIndex].changeAlign(d.data.oldAlign), "change-uppercase" === d.name && c[d.pageIndex].elements[d.elementIndex].uppercaseText(d.data.old), "change-bold" === d.name && c[d.pageIndex].elements[d.elementIndex].changeStyle("bold", d.data.old), "change-italic" === d.name && c[d.pageIndex].elements[d.elementIndex].changeStyle("italic", d.data.old), "change-line-height" === d.name && c[d.pageIndex].elements[d.elementIndex].changeLineHeight(d.data.oldLineHeight), "change-letter-spacing" === d.name && c[d.pageIndex].elements[d.elementIndex].changeLetterSpacing(d.data.oldLetterSpacing), "change-opacity" === d.name && c[d.pageIndex].elements[d.elementIndex].changeOpacity(oldTransparency)
        }
    },
    redoAction: function(a) {
        a.preventDefault();
        var b = this;
        if (!(DB.currentHistory >= DB.actionArray.length)) {
            var c = b.collection.document.get("pageObject"),
                d = DB.actionArray[DB.currentHistory];
            if (b.clearSelectElement(), console.log(d, DB.currentHistory), $("#design-wrap .content_option .btn_undo").removeClass("disabled"), console.log(DB.currentHistory, DB.actionArray.length), DB.currentHistory + 1 === DB.actionArray.length && $("#design-wrap .content_option .btn_redo").addClass("disabled"), "new-page" === d.name && (b.addNewPage(!0), $(".page:nth(" + d.pageIndex + ")").before($(".page:last")), b.calculatePosEachPage(), b.numberedPage(), c.pop(), c.splice(d.pageIndex, 0, _.extend({}, d.data)), c[d.pageIndex].elements = [], b.renderPage(d.data)), "move-page-fwd" === d.name && ($(".page").removeClass("selected"), $($(".page").get(d.pageIndex)).addClass("selected"), b.movePageUp(a)), "move-page-back" === d.name && ($(".page").removeClass("selected"), $($(".page").get(d.pageIndex)).addClass("selected"), b.movePageDown(a)), "page-change" === d.name && ($(".page").removeClass("selected"), $($(".page").get(d.pageIndex)).addClass("selected"), b.renderPage(d.newData)), "delete-page" === d.name) {
                var e = b.collection.document.get("pageObject");
                e.splice(d.pageIndex, 1), b.collection.document.set("pageObject", e), $(".page:nth(" + d.pageIndex + ")").remove(), b.calculatePosEachPage(), b.numberedPage()
            }
            if ("new-element" === d.name) {
                var f, g = $(".page:nth(" + d.pageIndex + ")");
                "svg" === d.data.type ? f = new svgElement(d.data, g) : "text" === d.data.type ? f = new textElement(d.data, g) : "grid" === d.data.type ? f = new gridElement(d.data, g) : "image" === d.data.type && (f = new imageElement(d.data, g)), f.renderElement(), g.find(".elements .element:nth(" + d.elementIndex + ")").before(f.element), c[d.pageIndex].elements.splice(d.elementIndex, 0, f)
            }
            if ("change-background" === d.name) {
                b.clearSelectElement(), c[d.pageIndex].elements[d.elementIndex].deleteElement();
                var g = $(".page:nth(" + d.pageIndex + ")"),
                    f = new imageElement(d.newBackground, g);
                c[d.pageIndex].elements[d.elementIndex] = f, f.renderElement(null, !0)
            }
            if ("move-element-fwd" === d.name && (c[d.pageIndex].elements[d.elementIndex].selectElement(), b.calculatePosContext(), b.moveElementFwd(a)), "move-element-back" === d.name && (c[d.pageIndex].elements[d.elementIndex].selectElement(), b.calculatePosContext(), b.moveElementBack(a)), "delete-element" === d.name && (b.clearSelectElement(), c[d.pageIndex].elements[d.elementIndex].deleteElement(), c[d.pageIndex].elements.splice(d.elementIndex, 1), _.each(c[d.pageIndex].elements, function(a) {
                    a.setDataIndex()
                })), "move-element" === d.name) {
                var h = d.data.x * DB.zoomRate,
                    i = d.data.y * DB.zoomRate;
                c[d.pageIndex].elements[d.elementIndex].moveElement(h, i), c[d.pageIndex].elements[d.elementIndex].selectElement(), b.calculatePosContext()
            }
            if ("resize-element" === d.name) {
                var j = {
                    left: d.data.x,
                    top: d.data.y,
                    width: d.data.w,
                    height: d.data.h
                };
                c[d.pageIndex].elements[d.elementIndex].updatePosAndDeg(j), c[d.pageIndex].elements[d.elementIndex].selectElement(), b.calculatePosContext()
            }
            if ("rotate-element" === d.name) {
                var j = {
                    angle: d.data.rotation
                };
                c[d.pageIndex].elements[d.elementIndex].updatePosAndDeg(j), c[d.pageIndex].elements[d.elementIndex].selectElement(), b.calculatePosContext()
            }
            "frame-change" === d.name && (c[d.pageIndex].elements[d.elementIndex].contents = d.data.newFrame, c[d.pageIndex].elements[d.elementIndex].loadFrameImage()), "input-text" === d.name && (c[d.pageIndex].elements[d.elementIndex].element.find(".inner-text").html(d.data.newHTML), c[d.pageIndex].elements[d.elementIndex].inputText(null, !0)), "change-color" === d.name && ("svg" === c[d.pageIndex].elements[d.elementIndex].type ? c[d.pageIndex].elements[d.elementIndex].changeColor(d.pathIndex, d.data.newColor) : "grid" === c[d.pageIndex].elements[d.elementIndex].type || c[d.pageIndex].elements[d.elementIndex].changeColor(d.data.newColor)), "change-font-family" === d.name && c[d.pageIndex].elements[d.elementIndex].changeFontFamily(d.data.newFamily), "change-font-size" === d.name && c[d.pageIndex].elements[d.elementIndex].changeFontSize(d.data.newSize), "change-align" === d.name && c[d.pageIndex].elements[d.elementIndex].changeAlign(d.data.newAlign), "change-uppercase" === d.name && c[d.pageIndex].elements[d.elementIndex].uppercaseText(d.data["new"]), "change-bold" === d.name && c[d.pageIndex].elements[d.elementIndex].changeStyle("bold", d.data["new"]), "change-italic" === d.name && c[d.pageIndex].elements[d.elementIndex].changeStyle("italic", d.data["new"]), "change-line-height" === d.name && c[d.pageIndex].elements[d.elementIndex].changeLineHeight(d.data.newLineHeight), "change-letter-spacing" === d.name && c[d.pageIndex].elements[d.elementIndex].changeLetterSpacing(d.data.newLetterSpacing), "change-opacity" === d.name && c[d.pageIndex].elements[d.elementIndex].changeOpacity(newTransparency), DB.currentHistory += 1
        }
    },
    convertUnit: function(a, b, c) {
        var d, e, f = 96,
            g = f / 2.54,
            h = g / 10;
        switch (c) {
            case "inch":
            case "in":
                d = a * f, e = b * f;
                break;
            case "cm":
                d = a * g, e = b * g;
                break;
            case "mm":
                d = a * h, e = b * h;
                break;
            default:
                d = a, e = b
        }
        return [d, e]
    },
    calculateZoomRate: function(a, b) {
        var c, c, d = this,
            e = window,
            f = document,
            g = f.documentElement,
            h = f.getElementsByTagName("body")[0],
            i = e.innerWidth || g.clientWidth || h.clientWidth,
            j = e.innerHeight || g.clientHeight || h.clientHeight,
            k = 200,
            l = 410,
            m = 60;
        if (b >= a) {
            var n = j - k;
            c = b > n ? (n / b).toFixed(4) : 1
        } else {
            var o = i - l - m - k;
            c = a > o ? (o / a).toFixed(4) : 1
        }
        DB.zoomRate = c, $(".zoom_percent").text((100 * c).toFixed(2) + "%"), $("#design-wrap").find(".page").length < 1 && d.addNewPage()
    },
    calculatePosEachPage: function() {
        var a, b, c = window,
            d = document,
            e = d.documentElement,
            f = d.getElementsByTagName("body")[0],
            g = (c.innerWidth || e.clientWidth || f.clientWidth, c.innerHeight || e.clientHeight || f.clientHeight, document.getElementById("design-wrap").getBoundingClientRect()),
            h = $("#addNewPage"),
            i = $("#design-wrap .page"),
            j = 120,
            k = 50,
            l = $(".page").length;
        _.each(i, function(c, d) {
            a = $(c).width(), b = $(c).height();
            var e = (g.width - a) / 2,
                f = j + d * (b + k);
            a > g.width - 200 ? ($("#design-editor").css({
                width: a + 200
            }), e = 100) : $("#design-editor").css({
                width: ""
            }), $("#design-wrap .scroll-editer").scrollLeft((a - g.width) / 2), $(c).css({
                top: f + "px",
                left: e + "px"
            }).data({
                top: f,
                left: e
            }), $(c).find(".btn-move-up").removeClass("disabled"), $(c).find(".btn-move-down").removeClass("disabled"), $(c).find(".btn-delete-page").removeClass("disabled"), 0 === d && $(c).find(".btn-move-up").addClass("disabled"), i.length - 1 === d && $(c).find(".btn-move-down").addClass("disabled")
        }), 1 === $(".page").length && i.find(".btn-delete-page").addClass("disabled");
        parseInt($("#design-wrap .page:first").css("left"), 10);
        h.removeClass("hidden");
        h.width();
        h.css({
            top: j + l * (b + k) + "px"
        }), $("#design-editor").css({
            height: j + l * (b + k) + $("#addNewPage").outerHeight()
        })
    },
    numberedPage: function() {
        var a = 0;
        _.each($("#design-wrap .page"), function(b) {
            a++, $(b).find(".page-toolbar .number span").text(a)
        })
    },
    addNewPage: function(a) {
        var b = this;
        if (!$("#selected-border").hasClass("crop-resize")) {
            b.clearSelectElement();
            var c = $("#design-wrap .page").length,
                d = b.collection.document.toJSON().dimensions,
                e = d.width,
                f = d.height,
                g = d.unit,
                h = $("#design-wrap .page:last").find(".element.background").length > 0 ? $("#design-wrap .page:last").find(".element.background").clone(!0).off() : null,
                i = b.convertUnit(e, f, g);
            e = i[0] * DB.zoomRate, f = i[1] * DB.zoomRate;
            var j = _.template($("#new_page_tmpl").html())({
                pageNumb: c + 1,
                pageWidth: e,
                pageHeight: f
            });
            $("#addNewPage").before(j), $("#design-wrap .page").removeClass("selected").data({
                width: i[0],
                height: i[1]
            }), c >= 0 && ($("#design-wrap .page:last").addClass("selected").css({
                width: e + "px",
                height: f + "px"
            }), $(".page.selected .elements").css({
                width: e + "px",
                height: f + "px"
            }));
            var k = {
                    width: d.width,
                    height: d.height,
                    elements: []
                },
                l = b.collection.document.get("pageObject");
            if (l || (l = []), l[c] = k, h && l) {
                var m = {
                    elementIndex: 0,
                    left: 0,
                    top: 0,
                    width: i[0],
                    height: i[1],
                    rotation: 0,
                    transparency: 0,
                    type: "image",
                    isBackground: !0,
                    backgroundColor: "#ffffff"
                };
                h.css("background-color") && "transparent" !== h.css("background-color") && (m.backgroundColor = rgb2hex(h.css("background-color"))), h.find(".image-wrapper")[0] && (m.mediaId = h.data("id"), m.mediaVersion = h.data("ver"), m.left = h.data("left"), m.top = h.data("top;"), m.width = h.data("width"), m.height = h.data("height"), h.hasClass("is-pattern") || delete m.backgroundColor);
                var n = new imageElement(m, $(".page.selected"));
                n.renderElement(function() {
                    b.updateDesignPalette()
                }), l[c].elements.push(n)
            }
            b.collection.document.set("pageObject", l), b.calculatePosEachPage(), a || b.saveAction("new-page", c)
        }
    },
    shortcutEvent: function(a) {
        var b = this,
            c = window.navigator.userAgent.match(/Macintosh/) ? !0 : !1,
            d = c ? a.originalEvent.metaKey : a.originalEvent.ctrlKey,
            e = a.originalEvent.shiftKey,
            f = !1;
        if ($("input").each(function() {
                $(this).is(":focus") && (f = !0)
            }), d && e && 90 === a.originalEvent.which) b.keyHold || b.redoAction(a), b.keyHold = !0;
        else if (d && 90 === a.originalEvent.which) b.keyHold || b.undoAction(a), b.keyHold = !0;
        else if (46 !== a.originalEvent.which && 8 !== a.originalEvent.which || !$(".element.selected").length || $("#color-picker-sub-context-menu .color-code:focus").length || $(".element.selected").hasClass("text"))
            if (27 === a.originalEvent.which && $(".element.selected").length) b.clearSelectElement();
            else if (d && 191 === a.originalEvent.which) $('#type-sidebar li[data-type="searches"]').trigger("click");
            else if (d && e && 212 === a.originalEvent.which && $(".element.selected").length) b.keyHold || b.moveElementFwd(a), b.keyHold = !0;
            else if (d && e && 219 === a.originalEvent.which && $(".element.selected").length) b.keyHold || b.moveElementBack(a), b.keyHold = !0;
            else if (d && 187 === a.originalEvent.which) b.keyHold || b.changeZoom(a, "in"), b.keyHold = !0;
            else if (d && 189 === a.originalEvent.which) b.keyHold || b.changeZoom(a, "out"), b.keyHold = !0;
            else if (d && 66 === a.originalEvent.which && $(".element.selected").hasClass("text")) b.keyHold || b.changeFontStyle(a, "bold"), b.keyHold = !0;
            else if (d && 73 === a.originalEvent.which && $(".element.selected").hasClass("text")) b.keyHold || b.changeFontStyle(a, "italic"), b.keyHold = !0;
            else if (d && e && 76 === a.originalEvent.which && $(".element.selected").hasClass("text")) b.keyHold || b.changeTextAlign(a, "left"), b.keyHold = !0;
            else if (d && e && 67 === a.originalEvent.which && $(".element.selected").hasClass("text")) b.keyHold || b.changeTextAlign(a, "center"), b.keyHold = !0;
            else if (d && e && 82 === a.originalEvent.which && $(".element.selected").hasClass("text")) b.keyHold || b.changeTextAlign(a, "right"), b.keyHold = !0;
            else if (84 === a.originalEvent.which && $(".page.selected").length && !$(".element.selected").length) {
                var g = {
                    type: "text",
                    text: "Add body text",
                    style: "body"
                };
                b.keyHold || f || b.renderMedia(g), b.keyHold = !0
            } else if (37 !== a.originalEvent.which || !$(".element.selected").length || $(".element.selected").hasClass("text") || f)
                if (38 !== a.originalEvent.which || !$(".element.selected").length || $(".element.selected").hasClass("text") || f)
                    if (39 !== a.originalEvent.which || !$(".element.selected").length || $(".element.selected").hasClass("text") || f)
                        if (40 !== a.originalEvent.which || !$(".element.selected").length || $(".element.selected").hasClass("text") || f) "function" == typeof b.detectQuickCommandKey && b.detectQuickCommandKey(a);
                        else {
                            a.preventDefault(), a.stopPropagation();
                            var h = e ? 10 : 1,
                                i = $(".element.selected").hasClass("focusing") ? b.textEditIndex : $(".element.selected").index(),
                                j = $(".element.selected").hasClass("focusing") ? $(".element.selected").data("page-wrap") : $(".element.selected").parents(".page").index(),
                                k = b.collection.document.get("pageObject");
                            objectIsset(k, j + ".elements." + i) && (k[j].elements[i].moveElement(0, h * DB.zoomRate), k[j].elements[i].selectElement(), b.calculatePosContext(), $(".element-bounding").removeClass("hidden"), $(".element-bounding .element-left .bounding-values").html(Math.round(k[j].elements[i].left)), $(".element-bounding .element-top .bounding-values").html(Math.round(k[j].elements[i].top)), $(".element-bounding .element-width .bounding-values").html(Math.round(k[j].elements[i].width)), $(".element-bounding .element-height .bounding-values").html(Math.round(k[j].elements[i].height)), setTimeout(function() {
                                $(".element-bounding").addClass("hidden")
                            }, 2e3), DB.designChange = !0)
                        }
                    else {
                        a.preventDefault(), a.stopPropagation();
                        var l = e ? 10 : 1,
                            i = $(".element.selected").hasClass("focusing") ? b.textEditIndex : $(".element.selected").index(),
                            j = $(".element.selected").hasClass("focusing") ? $(".element.selected").data("page-wrap") : $(".element.selected").parents(".page").index(),
                            k = b.collection.document.get("pageObject");
                        objectIsset(k, j + ".elements." + i) && (k[j].elements[i].moveElement(l * DB.zoomRate, 0), k[j].elements[i].selectElement(), b.calculatePosContext(), $(".element-bounding").removeClass("hidden"), $(".element-bounding .element-left .bounding-values").html(Math.round(k[j].elements[i].left)), $(".element-bounding .element-top .bounding-values").html(Math.round(k[j].elements[i].top)), $(".element-bounding .element-width .bounding-values").html(Math.round(k[j].elements[i].width)), $(".element-bounding .element-height .bounding-values").html(Math.round(k[j].elements[i].height)), setTimeout(function() {
                            $(".element-bounding").addClass("hidden")
                        }, 2e3), DB.designChange = !0)
                    } else {
                    a.preventDefault(), a.stopPropagation();
                    var h = e ? -10 : -1,
                        i = $(".element.selected").hasClass("focusing") ? b.textEditIndex : $(".element.selected").index(),
                        j = $(".element.selected").hasClass("focusing") ? $(".element.selected").data("page-wrap") : $(".element.selected").parents(".page").index(),
                        k = b.collection.document.get("pageObject");
                    objectIsset(k, j + ".elements." + i) && (k[j].elements[i].moveElement(0, h * DB.zoomRate), k[j].elements[i].selectElement(), b.calculatePosContext(), $(".element-bounding").removeClass("hidden"), $(".element-bounding .element-left .bounding-values").html(Math.round(k[j].elements[i].left)), $(".element-bounding .element-top .bounding-values").html(Math.round(k[j].elements[i].top)), $(".element-bounding .element-width .bounding-values").html(Math.round(k[j].elements[i].width)), $(".element-bounding .element-height .bounding-values").html(Math.round(k[j].elements[i].height)), setTimeout(function() {
                        $(".element-bounding").addClass("hidden")
                    }, 2e3), DB.designChange = !0)
                } else {
                a.preventDefault(), a.stopPropagation();
                var l = e ? -10 : -1,
                    i = $(".element.selected").hasClass("focusing") ? b.textEditIndex : $(".element.selected").index(),
                    j = $(".element.selected").hasClass("focusing") ? $(".element.selected").data("page-wrap") : $(".element.selected").parents(".page").index(),
                    k = b.collection.document.get("pageObject");
                objectIsset(k, j + ".elements." + i) && (k[j].elements[i].moveElement(l * DB.zoomRate, 0), k[j].elements[i].selectElement(), b.calculatePosContext(), $(".element-bounding").removeClass("hidden"), $(".element-bounding .element-left .bounding-values").html(Math.round(k[j].elements[i].left)), $(".element-bounding .element-top .bounding-values").html(Math.round(k[j].elements[i].top)), $(".element-bounding .element-width .bounding-values").html(Math.round(k[j].elements[i].width)), $(".element-bounding .element-height .bounding-values").html(Math.round(k[j].elements[i].height)), setTimeout(function() {
                    $(".element-bounding").addClass("hidden")
                }, 2e3), DB.designChange = !0)
            } else b.deleteElement(a)
    },
    endShortcut: function(a) {
        if (this.keyHold = !1, (37 === a.originalEvent.which || 38 === a.originalEvent.which || 39 === a.originalEvent.which || 40 === a.originalEvent.which) && $(".element.selected").length && !$(".element.selected").hasClass("text")) {
            a.preventDefault();
            var b = $(".element.selected").hasClass("focusing") ? this.textEditIndex : $(".element.selected").index(),
                c = $(".element.selected").hasClass("focusing") ? $(".element.selected").data("page-wrap") : $(".element.selected").parents(".page").index();
            this.saveAction("move-element", c, b)
        }
    },
    clearSelectElement: function() {
        var a = this;
        $(".colorOption").removeClass("selected"), $(".element.selected").each(function() {
            var b = $(this).hasClass("focusing") ? a.textEditIndex : $(this).index(),
                c = $(this).hasClass("focusing") ? $(this).data("page-wrap") : $(this).parents(".page").index(),
                d = a.collection.document.get("pageObject");
            if (objectIsset(d, c + ".elements." + b)) {
                if ("text" === d[c].elements[b].type && d[c].elements[b].newInput) {
                    var e = d[c].elements[b].html;
                    a.saveAction("input-text", c, b), "function" == typeof a.triggerUpdateTitle && a.triggerUpdateTitle(e)
                }
                d[c].elements[b].deselectElement(), a.svgFrameIndex = !1, a.gridChildIndex = !1
            }
        }), a.loadColorPalette()
    },
    globalMousedown: function(a) {
        if (1 === a.which) {
            var b = this,
                c = document.all ? window.event.clientX : a.pageX,
                d = document.all ? window.event.clientY : a.pageY,
                e = document.elementFromPoint(c, d),
                f = $(e).attr("id");
            if (b.mousedownTime = Date.now(), b.autoSave && window.clearTimeout(b.autoSave), e = $(e), !e.parents(".element.focusing").length && !e.hasClass("slider-input") && (f && "search_demo" === f && ($("#panel-left").removeClass().addClass("animated slideInLeft stage1"), $(".data-panel").removeClass("active"), $('.data-panel[data-type="searches"]').addClass("active")), "input" != e.prop("tagName").toLowerCase() && "select" != e.prop("tagName").toLowerCase())) {
                if (DB.isLoadingLayout) return void b.pushNotification({
                    type: "info",
                    message: "Hold a sec, we’re loading your new layout :)",
                    position: "br"
                });
                if ($("input").blur(), a.preventDefault(), b.startX = c, b.startY = d, 0 < e.parents(".page").length && ($(".page").removeClass("selected"), e.parents(".page").addClass("selected")), e.parents(".content_option").length) b.actionMenuClick = !0, e.parents(".btn_undo").length || e.hasClass("btn_undo") ? b.undoAction(a) : (e.parents(".btn_redo").length || e.hasClass("btn_redo")) && b.redoAction(a);
                else if (f && "addNewPage" === f || e.parents("#addNewPage").length) b.addNewPage();
                else if (f && f.indexOf("handle") > 0) b.mousedownHandle = e;
                else if (f && "move-element" === f) b.mousedownToMove = e;
                else if (e.parents(".pannel-content").length) e.parents("a").data("query") || 0 < e.parents(".grid-item-group").length || 0 < e.parents(".layout-tab").length || (e.parents('.grid-item:not(".grid-item-group")').data("id") ? b.mousedownMedia = e : e.hasClass("btn-add-text") ? b.mousedownMedia = e : e.parent().hasClass("colorOption") || e.hasClass("colorOption") ? b.changeBgColor = e.text() : e.parent().hasClass("design-palette-picker") || e.hasClass("design-palette-picker") ? b.changeBgColor = "design-palette-picker" : console.log("media id not found"));
                else if (e.parents(".context-menu").length) b.mousedownContext = e, b.mousedownContext.parents("#color-spectrum-wrapper").length ? b.changeSpectrumColor(a) : (b.mousedownContext.parents("#color-lightness").length || "color-lightness" === f) && b.changeLightnessColor(a);
                else if (e.parents(".page-toolbar").length) b.clearSelectElement(), b.mousedownPageToolbar = e;
                else if (e.parents(".tool_zoom").length) b.mousedownZoom = e;
                else if (e.parents("#crop-toolbar").length) b.clearSelectElement(), b.mousedownCropToolbar = e;
                else if ($("#selected-border").hasClass("crop-resize")) b.mousedownToMove = $(".uncroped");
                else {
                    b.clearSelectElement();
                    for (var g, h, i = $("#design-wrap").find(".element:visible").filter(function() {
                        var a = this.getBoundingClientRect();
                        return a.left < c && c < a.right && a.top < d && d < a.bottom
                    }), j = 0; j < i.length; j++) {
                        var k = i[j];
                        $(k).hasClass("element-hover") && (g = $(k))
                    }
                    if (!g && h && (b.mousedownToMove = h), g && g.hasClass("grid")) {
                        $(".item-content").removeClass("selected");
                        for (var l = g.find(".item-content:visible").filter(function() {
                            return $(this).offset().left < c && c < $(this).offset().left + $(this).outerWidth() && $(this).offset().top < d && d < $(this).offset().top + $(this).outerHeight()
                        }), j = 0; j < l.length; j++) {
                            var k = l[j];
                            if ($(k).parent(".item-content").length) {
                                $(k).parent(".item-content").addClass("selected");
                                break
                            }
                            if ($(k).hasClass("item-content")) {
                                $(k).addClass("selected");
                                break
                            }
                        }
                        $(".item-content", g).each(function(a) {
                            return $(this).hasClass("selected") ? void(b.gridChildIndex = a) : void 0
                        })
                    }
                    if (g && g.hasClass("svg") && 0 < g.find(".placeholder").length) {
                        $(".placeholder").removeClass("selected");
                        var m = g.find(".placeholder").filter(function() {
                            return this.getBoundingClientRect().left < c && c < this.getBoundingClientRect().right && this.getBoundingClientRect().top < d && d < this.getBoundingClientRect().bottom;
                        });
                        0 < m.length && (m.get(0).classList.add("selected"), b.svgFrameIndex = m.get(0).getAttribute("data-placeholder-index"))
                    }
                    b.firstItemAtPoint = g
                }
            }
        }
    },
    globalMousemove: function(a) {
        for (var b, c = this, d = document.all ? window.event.clientX : a.pageX, e = document.all ? window.event.clientY : a.pageY, f = $("#design-wrap").find(".element:visible").filter(function() {
            var a = this.getBoundingClientRect();
            return a.left < d && d < a.right && a.top < e && e < a.bottom
        }), g = 0; g < f.length; g++) {
            var h = f[g];
            $(h).hasClass("element") && (b = $(h))
        }
        if ($("#design-wrap .page").removeClass("page-hover"), $(".element").removeClass("element-hover"), b && (b.addClass("element-hover"), b.parents(".page").addClass("page-hover")), !(100 > Date.now() - c.mousedownTime))
            if (c.mousedownMedia) c.dragMedia(d, e), c.startX = d, c.startY = e;
            else if (c.mousedownToMove) {
                var i = d - c.startX,
                    j = e - c.startY,
                    k = $(".element.selected").hasClass("focusing") ? c.textEditIndex : "move-element" === c.mousedownToMove.get(0).id || c.mousedownToMove.hasClass("uncroped") ? $(".element.selected").index() : c.mousedownToMove.index(),
                    l = $(".element.selected").hasClass("focusing") ? $(".element.selected").data("page-wrap") : "move-element" === c.mousedownToMove.get(0).id || c.mousedownToMove.hasClass("uncroped") ? $(".page.selected").index() : c.mousedownToMove.parents(".page").index(),
                    m = c.collection.document.get("pageObject");
                if ("text" === m[l].elements[k].type && m[l].elements[k].newInput) {
                    var n = m[l].elements[k].html;
                    c.saveAction("input-text", l, k), "function" == typeof c.triggerUpdateTitle && c.triggerUpdateTitle(n)
                }
                if (objectIsset(m, l + ".elements." + k)) {
                    if ($("#selected-border").hasClass("crop-resize")) m[l].elements[k].moveCrop(i, j);
                    else if (m[l].elements[k].moveElement(i, j), $(".element-bounding").removeClass("hidden"), $(".element-bounding .element-left .bounding-values").html(Math.round(m[l].elements[k].left)), $(".element-bounding .element-top .bounding-values").html(Math.round(m[l].elements[k].top)), $(".element-bounding .element-width .bounding-values").html(Math.round(m[l].elements[k].width)), $(".element-bounding .element-height .bounding-values").html(Math.round(m[l].elements[k].height)), c.calculatePosContext(), "image" === m[l].elements[k].type) {
                        var f = $("#design-wrap").find(".element.svg .designbold .placeholder, .element.svg .designbold .prePlaceholder").filter(function() {
                                var a = $(this).parent().find(".outline").get(0).getBoundingClientRect();
                                return a.left < d && d < a.right && a.top < e && e < a.bottom
                            }),
                            m = c.collection.document.get("pageObject"),
                            o = f.get(0),
                            p = $(o).data("placeholder-index"),
                            q = $(o).parents(".element.svg").addClass("hover-frame").index(),
                            r = $(o).parents(".page").index(),
                            s = $("#design-wrap .element.svg .designbold .prePlaceholder").data("placeholder-index"),
                            t = $(".element.selected").find("img").attr("src"),
                            u = $(".element.selected").find("img").get(0).naturalWidth,
                            v = $(".element.selected").find("img").get(0).naturalHeight,
                            w = {
                                screen: {
                                    url: t,
                                    width: u,
                                    height: v
                                }
                            };
                        if (p !== s && objectIsset(m, r + ".elements." + q) && m[r].elements[q].cancelChangeFrameContent(), $("#chaos-zone .placeholder").each(function() {
                                var a = $(this).data("element"),
                                    b = $(this).data("page");
                                (0 >= f.length || a !== q) && objectIsset(m, b + ".elements." + a) && m[b].elements[a].cancelChangeFrameContent()
                            }), 0 < f.length) objectIsset(m, r + ".elements." + q) && ($(".element.selected").addClass("in-frame").css({
                            opacity: .2
                        }), m[r].elements[q].preChangeFrameContent(w, p));
                        else {
                            var x = (100 - parseInt($(".element.selected").data("opacity"))) / 100;
                            $(".element.selected").removeClass("in-frame").css({
                                opacity: x
                            })
                        }
                    }
                    DB.designChange = !0
                }
                c.startX = d, c.startY = e
            } else if (c.mousedownContext || c.mousemoveContext) {
                c.mousedownContext && (c.mousemoveContext = c.mousedownContext, c.mousedownContext = !1);
                var y = c.mousemoveContext.attr("id");
                c.mousemoveContext.parents("#color-spectrum-wrapper").length ? c.changeSpectrumColor(a) : (c.mousemoveContext.parents("#color-lightness").length || "color-lightness" === y) && c.changeLightnessColor(a)
            } else if (c.mousedownHandle) {
                var z = c.mousedownHandle.attr("id"),
                    A = z.replace("-handle", ""),
                    B = $(".element.selected"),
                    k = B.hasClass("focusing") ? c.textEditIndex : B.index(),
                    l = B.hasClass("focusing") ? B.data("page-wrap") : B.parents(".page").index(),
                    m = c.collection.document.get("pageObject");
                if ("text" === m[l].elements[k].type && m[l].elements[k].newInput) {
                    var n = m[l].elements[k].html;
                    c.saveAction("input-text", l, k), "function" == typeof c.triggerUpdateTitle && c.triggerUpdateTitle(n)
                }
                if (-1 !== A.indexOf("frame-")) {
                    A = A.replace("frame-", "");
                    var i = d - $("#frame-handle-" + A).offset().left - 20,
                        j = e - $("#frame-handle-" + A).offset().top - 20;
                    objectIsset(m, l + ".elements." + k) && m[l].elements[k].resizeFrameCrop(A, i, j)
                } else if ("rotate" !== A) {
                    var i = d - c.startX,
                        j = e - c.startY; - 1 !== ["tl", "tr", "br", "bl"].indexOf(A) && (i = d - $("#" + A + "-handle").offset().left, j = e - $("#" + A + "-handle").offset().top, c.startX = $("#" + A + "-handle").offset().left, c.startY = $("#" + A + "-handle").offset().top), objectIsset(m, l + ".elements." + k) && ($("#selected-border").hasClass("crop-resize") ? m[l].elements[k].resizeCrop(A, i, j) : (m[l].elements[k].resizeElement(A, c.startX, c.startY, d, e), $(".element-bounding").removeClass("hidden"), $(".element-bounding .element-left .bounding-values").html(Math.round(m[l].elements[k].left)), $(".element-bounding .element-top .bounding-values").html(Math.round(m[l].elements[k].top)), $(".element-bounding .element-width .bounding-values").html(Math.round(m[l].elements[k].width)), $(".element-bounding .element-height .bounding-values").html(Math.round(m[l].elements[k].height)), c.calculatePosContext())), DB.designChange = !0, c.startX = d, c.startY = e
                } else "rotate" === A && (objectIsset(m, l + ".elements." + k) && m[l].elements[k].rotateElement(c.startX, c.startY, d, e), DB.designChange = !0, c.calculatePosContext(), c.startX = d, c.startY = e)
            } else c.firstItemAtPoint && (c.mousedownToMove = c.firstItemAtPoint.addClass("selected"), c.firstItemAtPoint = !1)
    },
    globalMouseup: function(a) {
        var b = this,
            c = document.all ? window.event.clientX : a.pageX,
            d = document.all ? window.event.clientY : a.pageY,
            e = !1,
            f = !1;
        if (400 > Date.now() - b.mousedownTime && b.justClick && b.firstItemAtPoint[0] === b.justClick[0] ? (b.justClick = !1, f = !0) : 400 > Date.now() - b.mousedownTime && (b.justClick = b.firstItemAtPoint, e = !0, window.setTimeout(function() {
                b.justClick = !1
            }, 200)), b.mousedownContext) {
            var g = b.mousedownContext.attr("id");
            (b.mousedownContext.parents("#color-spectrum-wrapper").length || b.mousedownContext.parents("#color-lightness").length || "color-lightness" === g) && (b.mousemoveContext = b.mousedownContext)
        }
        if (b.mousemoveContext) {
            var h = b.mousemoveContext.attr("id");
            if (b.mousemoveContext.parents("#color-spectrum-wrapper").length || b.mousemoveContext.parents("#color-lightness").length || "color-lightness" === h || $(".context-menu").remove(), b.mousemoveContext.parents("#color-spectrum-wrapper").length || b.mousemoveContext.parents("#color-lightness").length || "color-lightness" === h) {
                var i = $(".element.selected").hasClass("focusing") ? b.textEditIndex : $(".element.selected").index(),
                    j = $(".element.selected").hasClass("focusing") ? $(".element.selected").data("page-wrap") : $(".page.selected").index();
                b.saveAction("change-color", j, i)
            }
        }
        if (b.mousedownToMove && !$("#selected-border").hasClass("crop-resize")) {
            var i = $(".element.selected").hasClass("focusing") ? b.textEditIndex : "move-element" === b.mousedownToMove.get(0).id ? $(".element.selected").index() : b.mousedownToMove.index(),
                j = $(".element.selected").hasClass("focusing") ? $(".element.selected").data("page-wrap") : "move-element" === b.mousedownToMove.get(0).id ? $(".page.selected").index() : b.mousedownToMove.parents(".page").index(),
                k = b.collection.document.get("pageObject");
            if ($(".element.selected").hasClass("in-frame")) {
                var l = $(".prePlaceholder").parents(".element").index(),
                    m = $(".prePlaceholder").parents(".page").index();
                if (objectIsset(k, j + ".elements." + i) && objectIsset(k, l + ".elements." + m)) {
                    var n = k[j].elements[i],
                        o = n.mediaId,
                        p = n.mediaVersion,
                        q = {
                            _id: o,
                            version: p
                        };
                    k[j].elements[i].deselectElement(), k[j].elements[i].deleteElement(), k[m].elements[l].appendChangeFrameContent(q)
                }
            } else objectIsset(k, j + ".elements." + i) && (k[j].elements[i].selectElement(), b.calculatePosContext(), b.mousedownToMove.hasClass("text") && (b.textEditIndex = i), b.saveAction("move-element", j, i))
        }
        if (b.mousedownHandle && !$("#selected-border").hasClass("crop-resize")) {
            var i = $(".element.selected").hasClass("focusing") ? b.textEditIndex : $(".element.selected").index(),
                j = $(".element.selected").hasClass("focusing") ? $(".element.selected").data("page-wrap") : $(".element.selected").parents(".page").index(),
                k = b.collection.document.get("pageObject");
            if (objectIsset(k, j + ".elements." + i)) {
                k[j].elements[i].selectElement(), b.calculatePosContext();
                var r = b.mousedownHandle.attr("id"),
                    s = r.replace("-handle", "");
                "rotate" === s ? b.saveAction("rotate-element", j, i) : b.saveAction("resize-element", j, i)
            }
        }
        if (b.mousedownMedia) {
            var t = b.mousedownMedia.data("id"),
                u = $(".data-panel.active").data("type"),
                q = t && b.collection[u].findWhere({
                    _id: t
                }) ? b.collection[u].findWhere({
                    _id: t
                }).toJSON() : null;
            if (!q && 0 < b.mousedownMedia.parents(".grid-large").length) {
                var v = b.mousedownMedia.parents(".grid-large").data("id"),
                    w = v && b.collection[u].findWhere({
                        _id: v
                    }) ? b.collection[u].findWhere({
                        _id: v
                    }).toJSON() : null;
                if (w)
                    for (var x = w._files.length - 1; x >= 0; x--)
                        if (w._files[x]._id === t) {
                            var y = w._files[x];
                            q = {
                                _id: y._id,
                                files: {
                                    original: y.original,
                                    thumbnail: y.thumbnail,
                                    screen: y.screen
                                },
                                original: null
                            }
                        }
            }
            if ("group-layout" === b.mousedownMedia.data("type")) {
                var v = b.mousedownMedia.data("parent-id"),
                    w = v && b.collection[u].findWhere({
                        _id: v
                    }) ? b.collection[u].findWhere({
                        _id: v
                    }).toJSON() : null;
                if (w)
                    for (var x = w._files.length - 1; x >= 0; x--)
                        if (w._files[x]._id === t) {
                            var y = w._files[x];
                            q = {
                                _id: y._id,
                                files: {
                                    original: y.original,
                                    thumbnail: y.thumbnail,
                                    screen: y.screen
                                },
                                original: null
                            }
                        }
            }
            if (q || "searches" !== u || "recent" !== $(".pannel-search .search-flash").data("target") || (q = t && b.collection.recents.findWhere({
                    _id: t
                }) ? b.collection.recents.findWhere({
                    _id: t
                }).toJSON() : null), !q && "layouts" === u && $('[data-stage="stage-design"]').hasClass("active-layout")) {
                var z = t && b.collection.designs.findWhere({
                        _id: t
                    }) ? b.collection.designs.findWhere({
                        _id: t
                    }).toJSON() : null,
                    A = "string" == typeof z.pages ? JSON.parse(z.pages) : "object" == typeof z.pages ? z.pages : null,
                    B = parseInt(b.mousedownMedia.data("page"), 10) - 1 || 0;
                q = A[B] ? JSON.parse(JSON.stringify(A[B])) : null, q.dimensions = z.dimensions || null, u = "design"
            }
            if (b.mousedownMedia.hasClass("over-frame")) {
                var C = $(".element.svg.hover-frame").index(),
                    D = $(".element.svg.hover-frame").parents(".page").index(),
                    k = b.collection.document.get("pageObject");
                objectIsset(k, D + ".elements." + C) && (b.mousedownMedia.hasClass("in-frame") ? (k[D].elements[C].appendChangeFrameContent(q), DB.designChange = !0, b.saveAction("frame-change", D, C)) : k[D].elements[C].cancelChangeFrameContent())
            }
            if (b.mousedownMedia.hasClass("clone-media") && b.mousedownMedia.hasClass("in-drop-zone") && !b.mousedownMedia.hasClass("in-frame")) {
                if ($(".page.highlight").length > 0)
                    if ($(".page").removeClass("selected"), $(".page.highlight").addClass("selected").removeClass("highlight"), b.mousedownMedia.hasClass("btn-add-text")) {
                        var E = {
                            type: "text",
                            text: b.mousedownMedia.text(),
                            style: b.mousedownMedia.hasClass("f40") ? "title" : b.mousedownMedia.hasClass("f27") ? "subtitle" : "body",
                            left: c,
                            top: d
                        };
                        b.renderMedia(E)
                    } else {
                        var E = {
                            type: "normal",
                            mediaType: u,
                            mediaInfo: q,
                            left: c,
                            top: d
                        };
                        b.renderMedia(E), "search" === b.mousedownMedia.data("type") && (b.recent_media || (b.recent_media = {}), b.recent_media[t] = Math.ceil(Date.now() / 1e3), "function" == typeof b.updateRecentMedia && b.updateRecentMedia())
                    }
            } else if (!b.mousedownMedia.hasClass("dragging"))
                if (b.mousedownMedia.hasClass("btn-add-text")) {
                    var E = {
                        type: "text",
                        text: b.mousedownMedia.text(),
                        style: b.mousedownMedia.hasClass("f40") ? "title" : b.mousedownMedia.hasClass("f27") ? "subtitle" : "body"
                    };
                    b.renderMedia(E)
                } else {
                    var E = {
                        type: "normal",
                        mediaType: u,
                        mediaInfo: q
                    };
                    b.renderMedia(E), "search" === b.mousedownMedia.data("type") && (b.recent_media || (b.recent_media = {}), b.recent_media[t] = Math.ceil(Date.now() / 1e3), "function" == typeof b.updateRecentMedia && b.updateRecentMedia())
                }
            $(".page").removeClass("highlight"), $(".clone-media").remove()
        } else if (b.changeBgColor) {
            b.clearSelectElement(), "design-palette-picker" === b.changeBgColor && (b.loadColorContext(a), b.changeBgColor = "#ffffff", $('<li class="colorOption selected" style="background-color: #ffffff"><a href="javascript:;">#ffffff</a></div>').insertBefore(".design-palette .design-palette-picker"));
            var F = $(".page.selected"),
                G = $(".page.selected .element.background"),
                j = F.index(),
                H = b.collection.document.get("pageObject");
            if (G.length) {
                var I = G.index(),
                    J = b.changeBgColor.substring(1, 7);
                G.addClass("selected"), objectIsset(H, j + ".elements." + I) && H[j].elements[I].changeColor(J), b.updateDesignPalette()
            } else {
                var K = F.width(),
                    L = F.height(),
                    M = {
                        elementIndex: 0,
                        left: 0,
                        top: 0,
                        width: Math.round(K / DB.zoomRate),
                        height: Math.round(L / DB.zoomRate),
                        rotation: 0,
                        transparency: 0,
                        type: "image",
                        isBackground: !0,
                        backgroundColor: b.changeBgColor
                    };
                if (objectIsset(H, j + ".elements")) {
                    var N = new imageElement(M, F);
                    N.renderElement(null, !0), N.element.addClass("selected"), H[j].elements.unshift(N);
                    for (var x = 0; x < H[j].elements.length; x++) H[j].elements[x].setDataIndex()
                }
            }
            $(".page.selected .element.background").css({
                "z-index": 9999
            }), b.updateDesignPalette(), setTimeout(function() {
                $(".page.selected .element.background").css({
                    "z-index": ""
                })
            }, 1e3)
        } else if (b.firstItemAtPoint) {
            var i = b.firstItemAtPoint.index(),
                j = b.firstItemAtPoint.parents(".page").index(),
                k = b.collection.document.get("pageObject");
            f && b.firstItemAtPoint.hasClass("svg") && b.svgFrameIndex ? objectIsset(k, j + ".elements." + i) && (k[j].elements[i].selectElement(), k[j].elements[i].startCropFrame(b.svgFrameIndex)) : f && (b.firstItemAtPoint.hasClass("image") || b.firstItemAtPoint.hasClass("grid")) ? objectIsset(k, j + ".elements." + i) && (k[j].elements[i].selectElement(), k[j].elements[i].startCrop()) : (b.clearSelectElement(), $(".page").removeClass("selected"), b.firstItemAtPoint.parents(".page").addClass("selected"), b.firstItemAtPoint.hasClass("text") && (b.textEditIndex = i), objectIsset(k, j + ".elements." + i) && k[j].elements[i].selectElement(), b.calculatePosContext())
        } else if (b.mousedownPageToolbar) console.log(b.mousedownPageToolbar), b.mousedownPageToolbar.parent().hasClass("btn-move-up") || b.mousedownPageToolbar.hasClass("btn-move-up") ? b.movePageUp(a) : b.mousedownPageToolbar.parent().hasClass("btn-move-down") || b.mousedownPageToolbar.hasClass("btn-move-down") ? b.movePageDown(a) : b.mousedownPageToolbar.parent().hasClass("btn-copy-page") || b.mousedownPageToolbar.hasClass("btn-copy-page") ? b.copyPage(a) : (b.mousedownPageToolbar.parent().hasClass("btn-delete-page") || b.mousedownPageToolbar.hasClass("btn-delete-page")) && b.deletePage(a);
        else if (b.mousedownZoom) b.mousedownZoom.hasClass("btn_zoomin") ? b.changeZoom(a, "in") : b.mousedownZoom.hasClass("btn_zoomout") && b.changeZoom(a, "out");
        else if (b.mousedownContext)
            if ($(".more-btn .dropdown-menu").addClass("hidden"), $(".more-btn .default-menu").removeClass("hidden"), b.mousedownContext.parents("#filter-sub-context-menu").length) {
                var O = $(".element.selected"),
                    i = O.index(),
                    j = O.parents(".page.selected").index(),
                    k = b.collection.document.get("pageObject");
                if (!DB.filterLocked && objectIsset(k, j + ".elements." + i)) {
                    var P = k[j].elements[i];
                    if ("image" === P.type || "grid" === P.type)
                        for (var Q = b.mousedownContext.parents(".item-filter").data("filter"), x = DB.filterPreset.length - 1; x >= 0; x--) {
                            var R = DB.filterPreset[x];
                            if (R.name === Q) {
                                var S = _.extend({}, R);
                                $(".page.selected .loading-elements").removeClass("hidden"), P.changeFilter(S), _.each(S, function(a, b) {
                                    $("#" + b + "-slider .slider-input").val(a), $("#" + b + "-slider .display-value").text(a)
                                });
                                break
                            }
                        }
                }
            } else if (b.mousedownContext.parents("#choose-font-size").length) b.mousedownContext.parents(".select-font-size").length ? b.changeFontSize(a) : b.mousedownContext.parents("#choose-font-size").hasClass("open") ? ($("#choose-font-size .font-size-input").addClass("hidden"), $("#choose-font-size .btn-value").removeClass("hidden")) : ($("#choose-font-size .font-size-input").val($("#choose-font-size .btn-value").text()), $("#choose-font-size .font-size-input").removeClass("hidden").focus(), $("#choose-font-size .btn-value").addClass("hidden"), _.bindAll(b, "changeFontSize"), $("#choose-font-size .font-size-input").bind("keypress", b.changeFontSize));
            else if (b.mousedownContext.parents(".select-font").length > 0) b.changeFontFamily(a);
            else if (b.mousedownContext.hasClass("btn-find-my-id") || b.mousedownContext.parents(".btn-find-my-id").length) b.findCurrentId(a);
            else if (b.mousedownContext.hasClass("btn-filter-menu")) b.loadFilterContext(a);
            else if (b.mousedownContext.hasClass("btn-crop")) b.cropElement(a);
            else if (b.mousedownContext.hasClass("btn-copy") || b.mousedownContext.parents(".btn-copy").length) b.copyElement(a);
            else if (b.mousedownContext.hasClass("btn-fwd") || b.mousedownContext.parents(".btn-fwd").length) b.moveElementFwd(a);
            else if (b.mousedownContext.hasClass("btn-back") || b.mousedownContext.parents(".btn-back").length) b.moveElementBack(a);
            else if (b.mousedownContext.hasClass("colorPalette")) {
                var T = rgb2hex(b.mousedownContext.get(0).style.backgroundColor).substring(1, 7),
                    i = $(".element.selected").hasClass("focusing") ? b.textEditIndex : $(".element.selected").index(),
                    j = $(".element.selected").hasClass("focusing") ? $(".element.selected").data("page-wrap") : $(".element.selected").parents(".page").index();
                b.updateElementColor(T), b.saveAction("change-color", j, i)
            } else if (b.mousedownContext.hasClass("btn-select-color") || b.mousedownContext.parents(".btn-select-color").length) {
                var U = $(".element.selected");
                if (U.hasClass("svg")) {
                    var V = /color\-/g,
                        W = b.mousedownContext.parents(".btn-select-color").length ? b.mousedownContext.parents(".btn-select-color") : b.mousedownContext;
                    _.each(W.get(0).classList, function(a) {
                        V.test(a) && (b.svgColorClass = a)
                    })
                }
                b.loadColorContext(a, !0)
            } else b.mousedownContext.hasClass("btn-delete-elem") || b.mousedownContext.parents(".btn-delete-elem").length ? b.deleteElement(a) : b.mousedownContext.hasClass("btn-bold") ? b.changeFontStyle(a, "bold") : b.mousedownContext.hasClass("btn-italic") ? b.changeFontStyle(a, "italic") : b.mousedownContext.hasClass("btn-uppercase") ? b.toggleTextUppercase(a) : b.mousedownContext.hasClass("btn-list") || (b.mousedownContext.hasClass("btn-left") ? b.changeTextAlign(a, "left") : b.mousedownContext.hasClass("btn-center") ? b.changeTextAlign(a, "center") : b.mousedownContext.hasClass("btn-right") ? b.changeTextAlign(a, "right") : b.mousedownContext.hasClass("btn-spacing") ? b.changeMoreDropdown(a, "spacing-menu") : b.mousedownContext.hasClass("btn-link") ? b.changeMoreDropdown(a, "link-menu") : b.mousedownContext.hasClass("btn-transparency") ? b.changeMoreDropdown(a, "transparency-menu") : b.mousedownContext.hasClass("btn-flip-h") ? b.flipImage(a, "horizontal") : b.mousedownContext.hasClass("btn-flip-v") && b.flipImage(a, "vertical"));
        else b.mousedownCropToolbar && (b.mousedownCropToolbar.hasClass("btn-accept-crop") || b.mousedownCropToolbar.parent().hasClass("btn-accept-crop") || b.mousedownCropToolbar.hasClass("btn-cancel-crop") || b.mousedownCropToolbar.parent().hasClass("btn-cancel-crop"));
        b.actionMenuClick || b.extractPageDataToModel(), $(".element-bounding").addClass("hidden"), $("#top-line-guide").addClass("hidden").removeAttr("style"), $("#middle-line-guide").addClass("hidden").removeAttr("style"), $("#bottom-line-guide").addClass("hidden").removeAttr("style"), $("#left-line-guide").addClass("hidden").removeAttr("style"), $("#center-line-guide").addClass("hidden").removeAttr("style"), $("#right-line-guide").addClass("hidden").removeAttr("style"), b.mousedownHandle = b.mousedownToMove = b.mousedownMedia = b.mousedownContext = b.mousemoveContext = b.mousedownPageToolbar = b.mousedownZoom = b.mousedownCropToolbar = b.firstItemAtPoint = b.changeBgColor = b.actionMenuClick = b.mousedownTime = !1
    },
    loadColorPalette: function() {
        $(".design-palette .colorOption").remove();
        for (var a = 0; a < DB.colorPalette.length; a++) $('<li class="colorOption" style="background-color:' + DB.colorPalette[a] + '"><a href="javascript:;">' + DB.colorPalette[a] + "</a></li>").insertBefore(".design-palette .design-palette-picker");
        $(".user-palette .user-palette-picker").addClass("hidden"), $(".user-palette .colorOption").remove(), DB.userPalettes && 0 !== DB.userPalettes.length || (DB.userPalettes = DB.defaultColorPalette);
        for (var b = 0; b < DB.userPalettes.length; b++) $('<li class="colorOption" style="background-color:' + DB.userPalettes[b] + '"><a href="javascript:;">' + DB.userPalettes[b] + "</a></li>").insertBefore(".user-palette .user-palette-picker")
    },
    renderOldDesign: function() {
        function a() {
            var a = b.collection.document.get("dimensions"),
                c = a.width,
                d = a.height,
                e = a.unit,
                f = b.convertUnit(c, d, e);
            c = f[0], d = f[1], b.calculateZoomRate(c, d)
        }
        var b = this;
        _.bindAll(b, "shortcutEvent", "endShortcut"), $(document).bind("keydown", b.shortcutEvent), $(document).bind("keyup", b.endShortcut), $(".scroll-editer").on("scroll", function() {
            var a = $(".scroll-editer").scrollTop();
            $(".inner .page").each(function() {
                var b = $(this).data("top"),
                    c = parseFloat($(this).css("height"));
                a > b && ($(".page").removeClass("selected"), $(this).addClass("selected")), a > b + c / 2 && ($(".page").removeClass("selected"), $(this).next(".page").addClass("selected"))
            })
        });
        var c = b.collection.document.get("pages");
        c ? (a(), _.each(c, function(a, c) {
            $("#design-wrap .page").removeClass("selected"), $("#design-wrap .page")[c] || b.addNewPage(!0), $("#design-wrap .page").get(c).classList.add("selected"), $(".page.selected").find(".elements").empty(), b.renderPage(a)
        })) : a(), DB.designChange = !1, b.actionChange = !1, DB.currentHistory = 0, $(".top-bar .global-control .btn_save").addClass("disabled"), $("#design-wrap .content_option .btn_undo").addClass("disabled"), $("#design-wrap .content_option .btn_redo").addClass("disabled"), b.updateDesignPalette(), b.loadColorPalette(), $("#design-wrap .inner").removeClass("animated").removeClass("zoomIn")
    },
    renderPage: function(a, b) {
        var c = this;
        $("#design-wrap .page").length;
        $("#design-wrap .page.selected").length < 1 && ($("#design-wrap .page").length < 1 && c.addNewPage(), $("#design-wrap .page:last").addClass("selected")), $(".page.selected .elements").empty(), _.each(a.elements, function(a) {
            c.renderElement(a, b)
        });
        var d = c.collection.document.get("pageObject"),
            e = $("#design-wrap .page.selected").index();
        a.layout && (d[e].layout = a.layout), $("#design-wrap .scroll-editer").animate({
            scrollTop: parseInt($(".page.selected").css("top")) - 60
        }), $(".element").removeClass("selected")
    },
    renderElement: function(a, b) {
        var c, d = $(".page.selected");
        if (c = "svg" === a.type ? new svgElement(a, d, b) : "text" === a.type ? new textElement(a, d, b) : "grid" === a.type ? new gridElement(a, d, b) : "image" === a.type ? new imageElement(a, d, b) : null) {
            c.renderElement();
            var e = this.collection.document.get("pageObject") ? this.collection.document.get("pageObject") : JSON.parse(JSON.stringify(this.collection.document.get("pages"))),
                f = d.index(),
                g = c.elementIndex;
            e[f].elements[g] = c, this.collection.document.set("pageObject", e)
        }
    },
    changeZoom: function(a, b) {
        a.preventDefault();
        var c = this,
            d = 100 * DB.zoomRate,
            e = $(".element.selected").hasClass("focusing") ? c.textEditIndex : $(".element.selected").index(),
            f = $(".element.selected").hasClass("focusing") ? $(".element.selected").data("page-wrap") : $(".element.selected").parents(".page").index(),
            g = c.collection.document.get("pageObject");
        $("#selected-border").hasClass("crop-resize") && objectIsset(g, f + ".elements." + e) && g[f].elements[e].cancelCrop(), c.clearSelectElement();
        for (var h = DB.zoomList, i = 0; i < h.length; i++) {
            var j = h[i],
                k = 0 === i ? h[i] : h[i - 1],
                l = h.length - 1 === i ? h[i] : h[i + 1];
            if ("in" === b) {
                if (j == d) {
                    d = l;
                    break
                }
                if (d > k && j > d) {
                    d = j;
                    break
                }
            } else if ("out" === b) {
                if (j == d) {
                    d = k;
                    break
                }
                if (d > j && l > d) {
                    d = j;
                    break
                }
            }
        }
        DB.zoomRate = d / 100, $(".page").each(function() {
            var a = $(this).data("width"),
                b = $(this).data("height");
            $(this).css({
                width: a * DB.zoomRate,
                height: b * DB.zoomRate
            }).find(".elements").css({
                width: a * DB.zoomRate,
                height: b * DB.zoomRate
            })
        }), c.calculatePosEachPage(), $(".element").each(function() {
            var a = $(this).index(),
                b = $(this).parents(".page").index(),
                d = c.collection.document.get("pageObject");
            objectIsset(d, b + ".elements." + a) && d[b].elements[a].changeZoom()
        }), $(".zoom_percent").html(d + "%")
    },
    movePageUp: function(a) {
        a.preventDefault();
        var b = this;
        if (!$("#selected-border").hasClass("crop-resize")) {
            var c = b.mousedownPageToolbar ? b.mousedownPageToolbar.parents(".page") : $(".page.selected"),
                d = c.prev(".page"),
                e = c.index(),
                f = d.length > 0 ? d.index() : null,
                g = b.collection.document.get("pageObject");
            if (c.after(d), "undefined" != typeof f) {
                var h = g[e];
                g[e] = g[f], g[f] = h, b.collection.document.set("pageObject", g), b.calculatePosEachPage(), b.numberedPage(), b.mousedownPageToolbar && (DB.designChange = !0, b.saveAction("move-page-fwd", e))
            }
        }
    },
    movePageDown: function(a) {
        a.preventDefault();
        var b = this;
        if (!$("#selected-border").hasClass("crop-resize")) {
            var c = b.mousedownPageToolbar ? b.mousedownPageToolbar.parents(".page") : $(".page.selected"),
                d = c.next(".page"),
                e = c.index(),
                f = d.length > 0 ? d.index() : null,
                g = b.collection.document.get("pageObject");
            if (c.before(d), "undefined" != typeof f) {
                var h = g[e];
                g[e] = g[f], g[f] = h, b.collection.document.set("pageObject", g), b.calculatePosEachPage(), b.numberedPage(), b.mousedownPageToolbar && (DB.designChange = !0, b.saveAction("move-page-back", e))
            }
        }
    },
    copyPage: function(a) {
        if (a.preventDefault(), !$("#selected-border").hasClass("crop-resize")) {
            var b = this,
                c = $(b.mousedownPageToolbar).parents(".page").clone(!0).off().removeClass("selected");
            $(b.mousedownPageToolbar).parents(".page").after(c);
            var d = $(b.mousedownPageToolbar).parents(".page"),
                e = d.index(),
                f = b.collection.document.get("pageObject"),
                g = _.extend({}, f[e]);
            f.splice(e, 0, g), f[e + 1].elements = [], c.find(".element").each(function() {
                var a, b = $(this).index(),
                    d = _.extend({}, f[e].elements[b]);
                "svg" === d.type ? a = new svgElement(d, c) : "text" === d.type ? a = new textElement(d, c) : "grid" === d.type ? a = new gridElement(d, c) : "image" === d.type && (a = new imageElement(d, c)), f[e + 1].elements[b] = a, f[e + 1].elements[b].element = $(this)
            }), b.collection.document.set("pageObject", f), b.calculatePosEachPage(), b.numberedPage(), DB.designChange = !0, b.saveAction("new-page", e + 1)
        }
    },
    deletePage: function(a) {
        if (a.preventDefault(), !($("#selected-border").hasClass("crop-resize") || $("#design-wrap .page").length <= 1)) {
            var b = this,
                c = $(b.mousedownPageToolbar).parents(".page"),
                d = c.index(),
                e = b.collection.document.get("pageObject");
            e.splice(d, 1), b.collection.document.set("pageObject", e), $(b.mousedownPageToolbar).parents(".page").remove(), b.calculatePosEachPage(), b.numberedPage(), DB.designChange = !0, b.saveAction("delete-page", d)
        }
    },
    copyElement: function(a) {
        a.preventDefault();
        var b = this,
            c = $(".element.selected"),
            d = c.hasClass("focusing") ? b.textEditIndex : c.index(),
            e = c.hasClass("focusing") ? c.data("page-wrap") : c.parents(".page").index(),
            f = b.collection.document.get("pageObject");
        if (objectIsset(f, e + ".elements." + d)) {
            var g = c.clone(!0).off(),
                h = d + 1;
            b.clearSelectElement();
            var i, j = JSON.parse(JSON.stringify(f[e].elements[d])),
                k = $(".page.selected");
            c.after(g), j.mediaLayout = null, _.each(j.contents, function(a, b) {
                a.mediaLayout = null
            }), "svg" === j.type ? i = new svgElement(j, k) : "text" === j.type ? i = new textElement(j, k) : "grid" === j.type ? i = new gridElement(j, k) : "image" === j.type && (i = new imageElement(j, k)), f[e].elements.splice(d, 0, i), f[e].elements[d].element = c, _.each(f[e].elements, function(a) {
                a.setDataIndex()
            }), f[e].elements[h].element = g, f[e].elements[h].elementIndex = h, f[e].elements[h].moveElement(20, 20), f[e].elements[h].selectElement(), b.textEditIndex = h, b.calculatePosContext(), b.collection.document.set("pageObject", f), DB.designChange = !0, b.saveAction("new-element", e, h)
        }
    },
    moveElementFwd: function(a) {
        a.preventDefault();
        var b = this,
            c = $(".element.selected"),
            d = c.hasClass("focusing") ? b.textEditIndex : c.index(),
            e = d + 1,
            f = c.hasClass("focusing") ? c.data("page-wrap") : c.parents(".page").index(),
            g = b.collection.document.get("pageObject");
        if (objectIsset(g, f + ".elements." + d) && e < g[f].elements.length) {
            $(".btn-fwd").removeClass("disabled"), $(".btn-back").removeClass("disabled"), e === g[f].elements.length - 1 && $(".btn-fwd").addClass("disabled"), c.hasClass("focusing") ? b.textEditIndex += 1 : c.before(c.next(".element")), g[f].elements[d].elementIndex = e, g[f].elements[e].elementIndex = d;
            var h = g[f].elements[d];
            g[f].elements[d] = g[f].elements[e], g[f].elements[e] = h, b.collection.document.set("pageObject", g), DB.designChange = !0, b.saveAction("move-element-fwd", f, d)
        }
    },
    moveElementBack: function(a) {
        a.preventDefault();
        var b = this,
            c = $(".element.selected"),
            d = c.hasClass("focusing") ? b.textEditIndex : c.index(),
            e = d - 1,
            f = c.hasClass("focusing") ? c.data("page-wrap") : c.parents(".page").index(),
            g = b.collection.document.get("pageObject");
        if (objectIsset(g, f + ".elements." + d) && e >= 0) {
            $(".btn-fwd").removeClass("disabled"), $(".btn-back").removeClass("disabled"), 0 === e && $(".btn-back").addClass("disabled"), c.hasClass("focusing") ? b.textEditIndex -= 1 : c.after(c.prev(".element")), g[f].elements[d].elementIndex = e, g[f].elements[e].elementIndex = d;
            var h = g[f].elements[d];
            g[f].elements[d] = g[f].elements[e], g[f].elements[e] = h, b.collection.document.set("pageObject", g), DB.designChange = !0, b.saveAction("move-element-back", f, d)
        }
    },
    deleteElement: function(a) {
        a.preventDefault();
        var b = this,
            c = $(".element.selected").hasClass("focusing") ? b.textEditIndex : $(".element.selected").index(),
            d = $(".element.selected").hasClass("focusing") ? $(".element.selected").data("page-wrap") : $(".element.selected").parents(".page").index(),
            e = b.collection.document.get("pageObject");
        objectIsset(e, d + ".elements." + c) && ($(".element.selected").hasClass("svg") && "undefined" != typeof b.mousedownContext && b.mousedownContext && 0 < b.mousedownContext.parents(".sub-svg-context").length ? (e[d].elements[c].removeFrameContent(), DB.designChange = !0, b.collection.document.set("pageObject", e), b.saveAction("frame-change", d, c)) : (b.clearSelectElement(), e[d].elements[c].deleteElement(), e[d].elements.splice(c, 1), _.each(e[d].elements, function(a) {
            a.setDataIndex()
        }), b.collection.document.set("pageObject", e), DB.designChange = !0, b.saveAction("delete-element", d, c)))
    },
    changeFontSize: function(a) {
        var b = this,
            c = 1 !== a.which ? $("#choose-font-size .font-size-input").val() : $(b.mousedownContext).data("value");
        if (1 === a.which || 13 === a.which) {
            var d = b.textEditIndex,
                e = $(".page.selected").index(),
                f = b.collection.document.get("pageObject");
            objectIsset(f, e + ".elements." + d) && f[e].elements[d].changeFontSize(c), $("#choose-font-size .font-size-input").addClass("hidden"), $("#choose-font-size .btn-value").removeClass("hidden"), $("#choose-font-size").removeClass("open").attr("aria-expanded", !1), DB.designChange = !0, b.saveAction("change-font-size", e, d)
        }
    },
    changeFontFamily: function(a) {
        a.preventDefault();
        var b = this,
            c = $(b.mousedownContext).parent().hasClass("select-font") ? $(b.mousedownContext).data("name") : $(b.mousedownContext).parent().data("name"),
            d = $(b.mousedownContext).parents(".select-font"),
            e = b.textEditIndex,
            f = $(".page.selected").index(),
            g = b.collection.document.get("pageObject");
        objectIsset(g, f + ".elements." + e) && g[f].elements[e].changeFontFamily(c, function(a) {
            a && ($(".select-font").removeClass("selected"), d.addClass("selected"), DB.designChange = !0, b.saveAction("change-font-family", f, e))
        })
    },
    changeFontStyle: function(a, b) {
        a.preventDefault();
        var c = this.textEditIndex,
            d = $(".page.selected").index(),
            e = this.collection.document.get("pageObject");
        objectIsset(e, d + ".elements." + c) && e[d].elements[c].changeStyle(b), DB.designChange = !0, this.saveAction("change-" + b, d, c)
    },
    toggleTextUppercase: function(a) {
        a.preventDefault();
        var b = this.textEditIndex,
            c = $(".page.selected").index(),
            d = this.collection.document.get("pageObject");
        objectIsset(d, c + ".elements." + b) && d[c].elements[b].uppercaseText(), DB.designChange = !0, this.saveAction("change-uppercase", c, b)
    },
    changeTextAlign: function(a, b) {
        a.preventDefault();
        var c = this.textEditIndex,
            d = $(".page.selected").index(),
            e = this.collection.document.get("pageObject");
        objectIsset(e, d + ".elements." + c) && e[d].elements[c].changeAlign(b), DB.designChange = !0, this.saveAction("change-align", d, c)
    },
    flipImage: function(a, b) {
        a.preventDefault();
        var c = $(".element.selected").index(),
            d = $(".element.selected").parents(".page").index(),
            e = this.collection.document.get("pageObject");
        objectIsset(e, d + ".elements." + c) && e[d].elements[c].flipImage(b), DB.designChange = !0
    },
    dragMedia: function(a, b) {
        var c = this;
        if (!c.mousedownMedia.hasClass("dragging")) {
            var d = c.mousedownMedia.offset().left,
                e = c.mousedownMedia.offset().top,
                f = c.mousedownMedia.width(),
                g = c.mousedownMedia.height(),
                h = c.mousedownMedia.clone(!0).off().addClass("clone-media").addClass("dragging").removeClass("animated").css({
                    left: d,
                    top: e,
                    width: f,
                    height: g
                });
            "searches" == c.mousedownMedia.parents(".data-panel").data("type") && h.data("type", "search"), "uploads" == c.mousedownMedia.parents(".data-panel").data("type") && h.data("type", "upload"),
            0 < c.mousedownMedia.parents(".grid-large").length && (h.data("type", "group-layout"), h.data("parent-id", c.mousedownMedia.parents(".grid-large").data("id"))), $("#panel-left").before(h), c.mousedownMedia = h
        }
        for (var i = $(".page").length - 1; i >= 0; i--) {
            var j = $(".page")[i],
                k = j.getBoundingClientRect();
            if ($("#design-wrap .page").removeClass("highlight"), c.mousedownMedia.removeClass("in-drop-zone"), k.left <= a && a <= k.right) {
                if (k.top <= b && b <= k.bottom) {
                    c.mousedownMedia.css({
                        opacity: "0.34"
                    }).addClass("in-drop-zone"), $(j).addClass("highlight");
                    break
                }
                c.mousedownMedia.css({
                    opacity: ""
                })
            } else c.mousedownMedia.css({
                opacity: ""
            })
        }
        var l = a - c.startX,
            m = b - c.startY,
            d = parseInt(c.mousedownMedia.css("left"), 10),
            e = parseInt(c.mousedownMedia.css("top"), 10);
        if (c.mousedownMedia.css({
                left: d + l + "px",
                top: e + m + "px"
            }), c.mousedownMedia) {
            var n = c.mousedownMedia.data("id"),
                o = $(".data-panel.active").data("type"),
                p = n && c.collection[o].findWhere({
                    _id: n
                }) ? c.collection[o].findWhere({
                    _id: n
                }).toJSON() : null;
            if ("searches" === o || "uploads" === o) {
                if (objectIsset(p, "files.screen.url") && "svg" === p.files.screen.url.substr(p.files.screen.url.length - 3)) return;
                var q = $("#design-wrap").find(".element.svg .designbold .placeholder, .element.svg .designbold .prePlaceholder").filter(function() {
                        var c = $(this).parent().find(".outline").get(0).getBoundingClientRect();
                        return c.left < a && a < c.right && c.top < b && b < c.bottom
                    }),
                    r = c.collection.document.get("pageObject");
                0 >= q.length && c.mousedownMedia.removeClass("in-frame");
                var s = q.get(0),
                    t = $(s).data("placeholder-index"),
                    u = $(s).parents(".element.svg").addClass("hover-frame").index(),
                    v = $(s).parents(".page.highlight").index(),
                    w = $("#design-wrap .element.svg .designbold .prePlaceholder").data("placeholder-index");
                t !== w && objectIsset(r, v + ".elements." + u) && r[v].elements[u].cancelChangeFrameContent(), $("#chaos-zone .placeholder").each(function() {
                    var a = $(this).data("element"),
                        b = $(this).data("page");
                    (0 >= q.length || a !== u && b !== v) && objectIsset(r, b + ".elements." + a) && r[b].elements[a].cancelChangeFrameContent()
                }), objectIsset(r, v + ".elements." + u) && (c.mousedownMedia.addClass("over-frame").addClass("in-frame"), r[v].elements[u].preChangeFrameContent(p.files, t))
            }
        }
        c.startX = a, c.startY = b
    },
    renderMedia: function(a) {
        function b(a) {
            if (a.length > 0) {
                for (var b = DB.BaseApi + "media/batch?refs=", c = !1, d = a.length - 1; d >= 0; d--) {
                    var e = a[d];
                    i.collection.elements.findWhere({
                        _id: e._id
                    }) || e._id && e.version && (b += e._id + ":" + e.version + ",", c || (c = !0))
                }
                c && (b = b.substring(0, b.length - 1), $.ajax({
                    url: b,
                    dataType: "json"
                }).done(function(a) {
                    i.collection.elements.add(a.response)
                }).fail(function(a, c) {
                    console.log(c), console.log(b)
                }))
            }
        }

        function c(a) {
            var b = [];
            return _.each(a, function(a) {
                _.each(a.elements, function(a) {
                    a.mediaId && b.push({
                        _id: a.mediaId,
                        version: a.mediaVersion
                    }), a.contents && _.each(a.contents, function(a) {
                        b.push({
                            _id: a.mediaId,
                            version: a.mediaVersion
                        })
                    })
                })
            }), b
        }

        function d(a) {
            var b = [];
            return _.each(a, function(a) {
                _.each(a.elements, function(a) {
                    a.fontFamily && b.push(a.fontFamily)
                })
            }), b
        }

        function e(e, f) {
            var g = e.content.pages;
            if ($(".page.selected").hasClass("is-loading")) i.pushNotification({
                type: "info",
                message: "Hold a sec, we’re loading your new layout :)",
                position: "br"
            });
            else if (e.font = _.uniq(d(g)), e.media = e.media ? _.uniq(e.media.concat(c(g))) : c(g), "undefined" != typeof e.media && (b(e.media), _.each(e.font, function(a) {
                    loadFont(a)
                })), g.length <= 0 || !g) console.log("no page found");
            else if (1 === g.length) {
                $(".page.selected .elements").empty(), DB.isLoadingLayout = !0;
                var h = $(".page.selected").index(),
                    j = i.collection.document.get("pageObject");
                j[h].elements = [], j[h].layout = f, $(".page.selected").addClass("is-loading"), 0 >= $(".loading-elements .loading-backdrop").length && $(".page.selected .loading-elements").css({
                    "background-image": "url(" + a.mediaInfo.files.thumbnail.url + ")",
                    "background-size": "cover"
                }).removeClass("hidden").append('<div class="loading-backdrop"></div>'), i.renderPage(g[0], f), DB.colorPalette = e.content.palette || [], window.setTimeout(function() {
                    $(".page.selected").removeClass("is-loading"), $(".page.selected .loading-elements").css({
                        "background-image": "",
                        "background-size": ""
                    }).addClass("hidden").find(".loading-backdrop").remove(), DB.isLoadingLayout = !1
                }, 1500), DB.designChange = !0, i.saveAction("page-change", h), i.updateDesignPalette()
            }
        }

        function f(a, b) {
            if (0 >= $(".loading-backdrop").length) {
                $(".page.selected .elements").empty();
                var c, d = $(".page.selected").index(),
                    e = i.collection.document.get("pageObject");
                e[d].elements = [], a.layout && (c = a.layout), $(".page.selected .loading-elements").css({
                    "background-image": "url(" + b + ")",
                    "background-size": "cover"
                }).removeClass("hidden").append('<div class="loading-backdrop"></div>'), i.renderPage(a, c), window.setTimeout(function() {
                    $(".page.selected .loading-elements").css({
                        "background-image": "",
                        "background-size": ""
                    }).addClass("hidden").find(".loading-backdrop").remove()
                }, 1500), DB.designChange = !0, i.saveAction("page-change", d), i.updateDesignPalette()
            } else i.pushNotification({
                type: "info",
                message: "Hold a sec, we’re loading your new layout :)",
                position: "br"
            })
        }
        var g = a.top || 0,
            h = a.left || 0,
            i = this;
        if (!a) return void console.log("files not found");
        i.clearSelectElement();
        var j = $(".page.selected");
        j.length || (j = $(".page:last").addClass("selected")), $(".element").removeClass("selected");
        var k = j.offset().top,
            l = j.offset().left,
            m = j.width() / DB.zoomRate,
            n = j.height() / DB.zoomRate;
        if ("text" === a.type) {
            var o = a.text,
                p = 20,
                q = "body";
            "title" === a.style ? (p = 40, q = "title") : "subtitle" === a.style ? (p = 27, q = "subtitle") : (p = 20, q = "body");
            var r = h ? h - l : 0,
                s = g ? g - k : 0,
                t = {
                    elementIndex: -1,
                    left: r,
                    top: s,
                    width: 0,
                    height: 0,
                    rotation: 0,
                    transparency: 0,
                    type: "text",
                    fontFamily: "Open Sans",
                    fontSize: p,
                    italic: !1,
                    bold: !1,
                    color: "#000000",
                    style: q,
                    lineHeight: 140,
                    letterSpacing: 0,
                    justification: "center",
                    html: o,
                    lineLengths: []
                },
                u = new textElement(t, j);
            h || g ? u.renderElement(!0) : u.renderElement();
            var v = $(".page.selected").index(),
                w = i.collection.document.get("pageObject");
            objectIsset(w, v + ".elements") || (w[v].elements = []), w[v].elements.push(u), i.collection.document.set("pageObject", w), DB.designChange = !0, i.saveAction("new-element", v, u.elementIndex), i.updateDesignPalette()
        } else {
            if (!objectIsset(a, "mediaInfo") && "design" !== a.mediaType) return void console.log("media info not found");
            var x = objectIsset(a, "mediaInfo.files.screen.width") ? a.mediaInfo.files.screen.width : 0,
                y = objectIsset(a, "mediaInfo.files.screen.height") ? a.mediaInfo.files.screen.height : 0;
            if ("design" === a.mediaType) {
                var z, A, B, C, D = $(".page.selected").data("width"),
                    E = $(".page.selected").data("height"),
                    F = D / E,
                    G = i.convertUnit(a.mediaInfo.dimensions.width, a.mediaInfo.dimensions.height, a.mediaInfo.dimensions.unit),
                    H = G[0],
                    I = G[1],
                    J = H / I;
                F > J ? (A = E, z = E * J, C = 0, B = (D - z) / 2) : (z = D, A = D / J, C = (E - A) / 2, B = 0);
                var K = z / H;
                _.each(a.mediaInfo.elements, function(a, b) {
                    a.width *= K, a.height *= K, a.left = a.left * K + B, a.top = a.top * K + C, "text" === a.type && (a.fontSize = parseFloat(a.fontSize) * K), "grid" === a.type && a.contents.forEach(function(a) {
                        a.imageBox.left = parseFloat(a.imageBox.left) * K, a.imageBox.top = parseFloat(a.imageBox.top) * K, a.imageBox.width = parseFloat(a.imageBox.width) * K, a.imageBox.height = parseFloat(a.imageBox.height) * K
                    })
                }), f(a.mediaInfo, i.mousedownMedia.attr("src"))
            } else if (objectIsset(a.mediaInfo, "files.original") && "layouts" === a.mediaType) {
                var L = JSON.parse(JSON.stringify(a.mediaInfo)),
                    M = i.mousedownMedia.data("id");
                L.original ? e(L.original, M) : ($(".page.selected .loading-elements").css({
                    "background-image": "url(" + a.mediaInfo.files.thumbnail.url + ")",
                    "background-size": "cover"
                }).removeClass("hidden").append('<div class="loading-backdrop"></div>'), i.loadLayoutsOrigin({
                    _id: M,
                    original_url: L.files.original.url
                }, i.collection.layouts, function(a) {
                    e(a, M)
                }))
            } else {
                var N, O, P, Q, R, S = !1; - 1 !== ["searches", "uploads"].indexOf(a.mediaType) && (N = "svg" === a.mediaInfo.files.screen.url.substr(a.mediaInfo.files.screen.url.length - 3) ? "svg" : "image"), "backgrounds" === a.mediaType && (N = "image", S = !0, console.log(a.mediaInfo)), "texts" === a.mediaType && (N = "svg"), m / 4 >= x && n / 4 >= y ? (Q = x, R = y) : x > m / 4 && y > n / 4 ? y > x ? (R = n / 4, Q = R * x / y) : (Q = m / 4, R = Q * y / x) : x > m / 4 ? (Q = m / 4, R = Q * y / x) : y > n / 4 && (R = n / 4, Q = R * x / y), "image" === N && (Q *= 3, R *= 3), O = a.left ? a.left - l : (m - Q) / 2, P = a.top ? a.top - k : (n - R) / 2, S && (n > m ? y > x ? (Q = m, R = Q * y / x, O = 0, P = (n - R) / 2) : (R = n, Q = R * x / y, O = (m - Q) / 2, P = 0) : y > x ? (Q = m, R = Q * y / x, O = 0, P = (n - R) / 2) : (R = n, Q = R * x / y, O = (m - Q) / 2, P = 0));
                var T = {
                    elementIndex: -1,
                    left: O,
                    top: P,
                    width: Q,
                    height: R,
                    mediaId: a.mediaInfo._id,
                    mediaVersion: a.mediaInfo.version,
                    type: N
                };
                S && (T.isBackground = S, a.mediaInfo.background_color ? (T.backgroundColor = "#" + a.mediaInfo.background_color, T.isRecolorable = !0) : (T.backgroundColor = null, T.isRecolorable = !1));
                var v = $(".page.selected").index(),
                    w = i.collection.document.get("pageObject"),
                    U = !!objectIsset(w[v], "elements.0.isBackground") && !!w[v].elements[0].isBackground,
                    V = "svg" === N ? new svgElement(T, j) : new imageElement(T, j);
                V.renderElement(function() {
                    i.updateDesignPalette()
                }, S), objectIsset(w, v + ".elements") || (w[v].elements = []), S && objectIsset(w[v].elements, "0.isBackground") && w[v].elements[0].isBackground ? (w[v].elements[0].deleteElement(), w[v].elements[0] = V) : S ? w[v].elements.unshift(V) : w[v].elements.push(V), i.collection.document.set("pageObject", w), DB.designChange = !0, S && U ? i.saveAction("change-background", v, 0) : i.saveAction("new-element", v, V.elementIndex), i.updateDesignPalette()
            }
        }
        $("#design-wrap .scroll-editer").animate({
            scrollTop: parseInt($(".page.selected").css("top")) - 60
        })
    },
    loadFilterContext: function(a) {
        function b(a) {
            var b = $(a.currentTarget).val(),
                c = $(a.currentTarget).parent(),
                d = h.collection.document.get("pageObject"),
                e = $(".page.selected").index(),
                f = $(".element.selected").index(),
                g = d[e].elements[f];
            "grid" === g.type ? g.getChildIndex() : -1;
            c.find(".display-value").html(b);
            var i = c.attr("id").replace("-slider", "");
            g.changeFilter(i, b)
        }

        function c() {
            var a = $(".item-filter").outerWidth() * DB.presetPerPage,
                b = Math.ceil($(".item-filter").length / DB.presetPerPage);
            $(".presentation-inner").css({
                "margin-left": -a * (DB.curPresetPage - 1)
            }), $(".presentation-next").removeClass("disabled"), $(".presentation-prev").removeClass("disabled"), DB.curPresetPage == b && $(".presentation-next").addClass("disabled"), 1 == DB.curPresetPage && $(".presentation-prev").addClass("disabled")
        }

        function d(a) {
            a.preventDefault();
            var b = Math.ceil($(".item-filter").length / DB.presetPerPage);
            DB.curPresetPage + 1 > b || (DB.curPresetPage += 1, c())
        }

        function e(a) {
            a.preventDefault(), DB.curPresetPage - 1 < 1 || (DB.curPresetPage -= 1, c())
        }

        function f(a) {
            a && a.preventDefault(), $(".btn-show-more").addClass("hidden"), $(".btn-show-less").removeClass("hidden"), $("#saturation-slider").removeClass("hidden"), $("#tint-slider").removeClass("hidden"), $("#blur-slider").removeClass("hidden"), $("#xpro-slider").removeClass("hidden"), $("#vignette-slider").removeClass("hidden");
            var b = $(".btn-filter-menu:visible").parents(".context-menu").offset().left - 370,
                c = $(".btn-filter-menu:visible").parents(".context-menu").offset().top + $(".btn-filter-menu:visible").parents(".context-menu").height() - p.outerHeight();
            0 > c && (c = $(".btn-filter-menu:visible").parents(".context-menu").offset().top), p.css({
                transform: "translate3d(" + b + "px, " + c + "px, 0px)"
            })
        }

        function g(a) {
            a && a.preventDefault(), $(".btn-show-more").removeClass("hidden"), $(".btn-show-less").addClass("hidden"), $("#saturation-slider").addClass("hidden"), $("#tint-slider").addClass("hidden"), $("#blur-slider").addClass("hidden"), $("#xprocess-slider").addClass("hidden"), $("#vignette-slider").addClass("hidden");
            var b = $(".btn-filter-menu:visible").parents(".context-menu").offset().left - 370,
                c = $(".btn-filter-menu:visible").parents(".context-menu").offset().top + $(".btn-filter-menu:visible").parents(".context-menu").height() - p.outerHeight();
            0 > c && (c = $(".btn-filter-menu:visible").parents(".context-menu").offset().top), p.css({
                transform: "translate3d(" + b + "px, " + c + "px, 0px)"
            })
        }
        var h = this;
        if (a.preventDefault(), !$("#filter-sub-context-menu").length) {
            DB.curPresetPage = 1, $("#color-picker-sub-context-menu").remove();
            var i = _.template($("#filter_sub_context_menu_tmpl").html());
            $(".main").append(i), $('[id$="slider"] .slider-input').bind("input", b);
            var j, k = h.collection.document.get("pageObject"),
                l = $(".page.selected").index(),
                m = $(".element.selected").index(),
                n = k[l].elements[m],
                o = "grid" === n.type ? n.getChildIndex() : -1,
                p = $("#filter-sub-context-menu");
            o > -1 ? _.each(n.contents, function(a) {
                a.index === o && void 0 !== a.filter && (j = DB.elementMedias[a.mediaId].bundle.files.thumbnail.url, _.each(a.filter, function(a, b) {
                    $("#" + b + "-slider .slider-input").val(a), $("#" + b + "-slider .display-value").text(a)
                }))
            }) : (j = DB.elementMedias[n.mediaId].bundle.files.thumbnail.url, void 0 !== n.filter && _.each(n.filter, function(a, b) {
                $("#" + b + "-slider .slider-input").val(a), $("#" + b + "-slider .display-value").text(a)
            })), g();
            var q = $(".btn-filter-menu:visible").parents(".context-menu").offset().left - 370,
                r = $(".btn-filter-menu:visible").parents(".context-menu").offset().top + $(".btn-filter-menu:visible").parents(".context-menu").height() - p.outerHeight();
            0 > r && (r = $(".btn-filter-menu:visible").parents(".context-menu").offset().top), p.css({
                transform: "translate3d(" + q + "px, " + r + "px, 0px)"
            }), $('<div class="item-filter" data-filter="Normal"><div><img src="' + j + '"/></div><p>Normal</p></div>').appendTo(".presentation-inner"), _.each(DB.filterPreset, function(a) {
                a = _.extend({}, a), $('<div class="item-filter" data-filter="' + a.name + '"><div><img src="' + j + '"/></div><p>' + a.name + "</p></div>").appendTo(".presentation-inner");
                var b = new Image;
                b.crossOrigin = "Anonymous", b.onload = function() {
                    filterImage(b, "preset_" + a.name, a, function(c) {
                        var d = new Image;
                        d.onload = function() {
                            $(b).remove(), $("preset_" + a.name).remove(), $('.item-filter[data-filter="' + a.name + '"]').find("img").remove(), $('.item-filter[data-filter="' + a.name + '"]').find("div").append(d)
                        }, d.src = c.toDataURL()
                    })
                }, b.src = j
            }), $(".presentation-next").bind("click", d), $(".presentation-prev").bind("click", e).addClass("disabled"), $(".btn-show-more").bind("click", f), $(".btn-show-less").bind("click", g)
        }
    },
    loadColorContext: function(a, b) {
        function c(a) {
            if (13 === a.which) {
                var b = /^(?:[0-9a-f]{3}){1,2}$/i,
                    c = $(this).val();
                b.test(c) && g.updateElementColor(c)
            }
        }

        function d(a) {
            var b, c = rgb2object(a),
                d = c.r / 255,
                e = c.g / 255,
                f = c.b / 255,
                g = Math.max(d, e, f),
                h = Math.min(d, e, f),
                i = (g + h) / 2;
            if (g === h) b = h = 0;
            else {
                var j = g - h,
                    h = i > .5 ? j / (2 - g - h) : j / (g + h);
                switch (g) {
                    case d:
                        b = (e - f) / j + (f > e ? 6 : 0);
                        break;
                    case e:
                        b = (f - d) / j + 2;
                        break;
                    case f:
                        b = (d - e) / j + 4
                }
                b /= 6
            }
            return b = [360 * b, 100 * h, 100 * i], c.hue = b[0], c.saturation = b[1], c.lightness = b[2], c
        }

        function e(a, b, c) {
            var d = a / 360,
                e = b / 100,
                g = c / 100;
            if (0 === e) g = e = d;
            else {
                var h = .5 > g ? g * (1 + e) : g + e - g * e,
                    i = 2 * g - h;
                g = f(i, h, d + 1 / 3), e = f(i, h, d), d = f(i, h, d - 1 / 3)
            }
            return [Math.round(255 * g), Math.round(255 * e), Math.round(255 * d)]
        }

        function f(a, b, c) {
            var d;
            return 0 > c && (c += 1), c > 1 && --c, d = 1 / 6 > c ? a + 6 * (b - a) * c : .5 > c ? b : 2 / 3 > c ? a + (b - a) * (2 / 3 - c) * 6 : a
        }
        a.preventDefault();
        var g = this,
            h = document.all ? window.event.clientX : a.pageX,
            i = document.all ? window.event.clientY : a.pageY;
        $(".scroll-editer").scrollTop();
        $("#color-picker-sub-context-menu").remove(), $("#filter-sub-context-menu").remove();
        var j = _.template($("#color_picker_sub_context_menu_tmpl").html());
        $(".main").append(j);
        var k = $("#color-picker-sub-context-menu"),
            l = $('<div class="marker" style="left: 100px; top: 100px"></div>'),
            m = $('<div id="color-spectrum-wrapper"></div>');
        m.append(l), k.find("#color-lightness").before(m);
        var n = h,
            o = i;
        b && (n = $(".btn-select-color:visible").parents(".context-menu").offset().left - 370, o = $(".btn-select-color:visible").parents(".context-menu").offset().top + $(".btn-select-color:visible").parents(".context-menu").height() - k.outerHeight(), 0 > o && (o = $(".btn-select-color:visible").parents(".context-menu").offset().top)), k.css({
            transform: "translate3d(" + n + "px, " + o + "px, 0px)"
        });
        var p;
        $(".element.selected").hasClass("text") && $(".element.selected").get(0).style.color ? p = $(".element.selected").get(0).style.color : $(".element.selected").hasClass("svg") ? p = $(".btn-select-color." + g.svgColorClass).find("span").css("background-color") : $(".element.selected").hasClass("image") && $(".element.selected").get(0).style.backgroundColor && (p = $(".element.selected").get(0).style.backgroundColor);
        var q = "ffffff";
        (p || "undefined" != typeof p) && (q = rgb2hex(p).substring(1, 7));
        var r = document.createElement("canvas");
        r.id = "color-spectrum", r.width = 200, r.height = 200;
        var s = r.getContext("2d"),
            t = new Image;
        t.crossOrigin = "Anonymous", t.onload = function() {
            if (s.drawImage(t, 0, 0), m.children().first().before(r), $("#color-lightness").css({
                    "background-color": "#ffffff"
                }), $("#color-picker-sub-context-menu .color-info .color-code").val(q), p || "undefined" != typeof p) {
                var a = d(p),
                    b = Math.round(Math.min(90, a.saturation) * Math.cos(a.hue * Math.PI / 180) + 100),
                    c = Math.round(Math.min(90, a.saturation) * Math.sin(a.hue * Math.PI / 180) + 100);
                l.css({
                    left: b,
                    top: c
                });
                var f = Math.round(Math.min(190, Math.max(10, 200 * (1 - a.lightness / (100 - a.saturation / 100 * 50))))),
                    g = e(a.hue, a.saturation, 100 - a.lightness / 100 * 50);
                $("#color-lightness").css({
                    "background-color": "rgb(" + g[0] + ", " + g[1] + ", " + g[2] + ")"
                }), $("#color-lightness .marker").css({
                    left: f
                })
            }
        }, t.src = "https://cdn.designbold.com/www/v1/images/color_picker_spectrum.png", $("#color-picker-sub-context-menu .color-info .color-code").unbind("keypress").bind("keypress", c), $(".layout-palette .col-sm-3").remove(), g.loadColorPalette();
        for (var u = 0; u < DB.userPalettes.length; u++) {
            var v = DB.userPalettes[u];
            $('<div class="col-sm-3"><span class="colorPalette" style="background-color: ' + v + '" title="' + v + '"></span></div>').appendTo(".user-palette .palette-content")
        }
        for (var w = 0; w < DB.colorPalette.length; w++) {
            var v = DB.colorPalette[w],
                x = v.toLowerCase() === "#" + q.toLowerCase() ? '<em><i class="fa fa-check"></i></em>' : "";
            $('<div class="col-sm-3"><span class="colorPalette" style="background-color: ' + v + '" title="' + v + '">' + x + "</span></div>").appendTo(".layout-palette .palette-content")
        }
        $(".palette-content").niceScroll({
            cursorcolor: "#000"
        })
    },
    changeSpectrumColor: function(a) {
        a.preventDefault();
        var b = this,
            c = document.all ? window.event.clientX : a.pageX,
            d = document.all ? window.event.clientY : a.pageY,
            e = $("#color-spectrum-wrapper .marker"),
            f = e.outerWidth(),
            g = e.outerHeight(),
            h = document.getElementById("color-spectrum"),
            i = h.getContext("2d"),
            j = $(h).offset(),
            k = $("#color-picker-sub-context-menu").offset(),
            l = $(h).width(),
            m = $(h).height(),
            n = j.left - k.left,
            o = j.top - k.top,
            p = Math.floor(c - j.left - n + f / 2),
            q = Math.floor(d - j.top - o + g / 2),
            r = [(l - f) / 2 + 10, (m - g) / 2 + 10],
            s = (l - f) / 2,
            t = Math.sqrt(Math.pow(p - r[0], 2) + Math.pow(q - r[1], 2));
        if (t > s) {
            var u = Math.atan2(q - r[1], p - r[0]);
            p = Math.cos(u) * s + r[0], q = Math.sin(u) * s + r[1]
        }
        var v = i.getImageData(p - n + f / 2, q - o + g / 2, 1, 1),
            w = v.data,
            x = w[2] + 256 * w[1] + 65536 * w[0],
            y = ("0000" + x.toString(16)).substr(-6);
        $("#color-spectrum-wrapper .marker").css({
            left: p + "px",
            top: q + "px"
        }), $("#color-picker-sub-context-menu #color-lightness").css({
            "background-color": "#" + y
        }), b.sourceColor = y;
        var z = b.calculateHexColor();
        $("#color-picker-sub-context-menu .color-code").val(z), b.updateElementColor(z)
    },
    changeLightnessColor: function(a) {
        a.preventDefault();
        var b = this,
            c = document.all ? window.event.clientX : a.pageX,
            d = $("#color-lightness").width(),
            e = $("#color-lightness .marker").css("left") ? $("#color-lightness .marker").css("left") : "10";
        e = e.replace("px", ""), e = parseInt(e, 10);
        var f = $("#color-lightness .marker").outerWidth(),
            g = $("#color-lightness .marker").offset().left,
            h = c - g,
            i = h + e - f / 2;
        10 > i ? i = 10 : i > d - f / 2 && (i = d - f / 2), $("#color-lightness .marker").css({
            left: i + "px"
        }), b.luminosity = -((i - f / 2) / (d - f));
        var j = b.calculateHexColor();
        $("#color-picker-sub-context-menu .color-code").val(j), b.updateElementColor(j)
    },
    calculateHexColor: function() {
        var a = this,
            b = a.sourceColor,
            c = a.luminosity;
        if (isNaN(c)) {
            var d = $("#color-lightness").width(),
                e = parseFloat($("#color-lightness .marker").css("left")),
                f = $("#color-lightness .marker").outerWidth();
            c = a.luminosity = -((e - f / 2) / (d - f))
        }
        if (isNaN(b)) {
            var e = parseFloat($("#color-spectrum-wrapper .marker").css("left")),
                g = parseFloat($("#color-spectrum-wrapper .marker").css("top")),
                f = $("#color-spectrum-wrapper .marker").outerWidth(),
                h = $("#color-spectrum-wrapper .marker").outerHeight(),
                i = document.getElementById("color-spectrum"),
                j = i.getContext("2d"),
                k = j.getImageData(e + f / 2, g + h / 2, 1, 1),
                l = k.data,
                m = l[2] + 256 * l[1] + 65536 * l[0];
            b = a.sourceColor = ("0000" + m.toString(16)).substr(-6)
        }
        b = String(b).replace(/[^0-9a-f]/gi, "");
        var n, o, p = "";
        for (o = 0; 3 > o; o++) n = parseInt(b.substr(2 * o, 2), 16), n = Math.round(Math.min(Math.max(0, n + n * c), 255)).toString(16), p += ("00" + n).substr(n.length);
        return p
    },
    updateElementColor: function(a) {
        var b = this,
            c = $(".element.selected").hasClass("focusing") ? b.textEditIndex : $(".element.selected").index(),
            d = $(".element.selected").hasClass("focusing") ? $(".element.selected").data("page-wrap") : $(".element.selected").parents(".page").index(),
            e = b.collection.document.get("pageObject"),
            f = e[d].elements[c];
        if ("svg" === f.type) {
            var g = parseInt(b.svgColorClass.replace(/color\-/g, ""), 10) - 1;
            f.changeColor(g, a), $(".btn-select-color." + b.svgColorClass + ">span").css({
                "background-color": "#" + a
            })
        } else f.changeColor(a), $(".btn-select-color>span").css({
            "background-color": "#" + a
        });
        $(".colorOption.selected").css({
            "background-color": "#" + a
        }).find("a").text("#" + a), b.updateDesignPalette(), DB.designChange = !0
    },
    calculatePosContext: function() {
        var a = $('[class*="-context"]').get(0),
            b = $('[class*="-context"][class*="sub-"]').get(0);
        if (a) {
            var c = $(".scroll-editer").scrollTop(),
                d = $(".scroll-editer").scrollLeft(),
                e = 51,
                f = 60,
                g = 370,
                h = 40,
                i = $(".scroll-editer").height(),
                j = $(".scroll-editer").width(),
                k = $(".element.selected"),
                l = k.get(0).getBoundingClientRect(),
                m = $("#rotate-handle").get(0).getBoundingClientRect(),
                n = Math.min(l.top, m.top),
                o = Math.max(l.bottom, m.bottom),
                p = (l.left - g > 35 ? l.left - g : 35) + d,
                q = n - e - h;
            if (f > q && i > o ? q = o - 40 : f > q && (q = f), p + $(a).width() > j && (p = j - $(a).width() - 35), $(a).css({
                    transform: "translate3d(" + Math.round(p) + "px, " + Math.round(q + c) + "px, 0px)"
                }), b && !k.hasClass("text") && !k.hasClass("image")) {
                if (k.hasClass("grid")) {
                    var r = k.find(".item-content.selected"),
                        s = r.get(0).getBoundingClientRect(),
                        t = (s.left - g > 35 ? s.left - g : 35) + d,
                        u = o;
                    o > c + i ? u = c + i : q === o && (u = o)
                } else if (k.hasClass("svg")) {
                    var t = (l.left - g > 35 ? l.left - g : 35) + d,
                        u = o - 40;
                    o > c + i ? u = c + i : q === o - 40 && (u = o)
                }
                t + $(b).width() > j && (t = j - $(b).width() - 35), $(b).css({
                    transform: "translate3d(" + Math.round(t) + "px, " + Math.round(u + c) + "px, 0px)"
                })
            }
        }
    },
    updateDesignPalette: function() {
        var a = this,
            b = a.collection.document.get("pageObject"),
            c = [];
        _.each(b, function(a, b) {
            _.each(a.elements, function(a, b) {
                "svg" === a.type && (a.fillColors && _.each(a.fillColors, function(a) {
                    a.color && c.push(a.color.toLowerCase())
                }), a.contents && _.each(a.contents, function(a) {
                    a.color && c.push(a.color.toLowerCase())
                })), "grid" === a.type && _.each(a.contents, function(a) {
                    a.backgroundColor && c.push(a.backgroundColor.toLowerCase())
                }), "text" === a.type && a.color && c.push(a.color.toLowerCase()), "image" === a.type && a.backgroundColor && c.push(a.backgroundColor.toLowerCase())
            })
        }), c = _.uniq(c), DB.colorPalette = c
    },
    updateUserPalette: function(a) {
        "object" != typeof DB.userPalettes && (DB.userPalettes = []), DB.userPalettes.push(a), 20 < DB.userPalettes.length && (DB.userPalettes = _.rest(DB.userPalettes, DB.userPalettes.length - 20))
    },
    cropElement: function(a) {
        a.preventDefault();
        var b = this,
            c = $(".element.selected"),
            d = c.index(),
            e = c.parents(".page").index(),
            f = b.collection.document.get("pageObject");
        c.hasClass("svg") && b.svgFrameIndex ? objectIsset(f, e + ".elements." + d) && f[e].elements[d].startCropFrame(b.svgFrameIndex) : objectIsset(f, e + ".elements." + d) && f[e].elements[d].startCrop()
    },
    changeMoreDropdown: function(a, b) {
        function c(a) {
            var b = $(a.currentTarget).val(),
                c = $(a.currentTarget).parent(),
                d = $(".element.selected"),
                e = f.collection.document.get("pageObject"),
                g = d.hasClass("focusing") ? d.data("page-wrap") : d.parents(".page").index(),
                h = d.hasClass("focusing") ? f.textEditIndex : d.index();
            objectIsset(e, g + ".elements." + h) && (e[g].elements[h].changeOpacity(b), c.find(".display-value").html(b), DB.designChange = !0, f.saveAction("change-opacity", g, h))
        }

        function d(a) {
            var b = $(a.currentTarget).val(),
                c = $(a.currentTarget).parent(),
                d = $(".element.selected"),
                e = f.collection.document.get("pageObject"),
                g = $(".page.selected").index(),
                h = f.textEditIndex;
            d.hasClass("focusing") && objectIsset(e, g + ".elements." + h) && (e[g].elements[h].changeLetterSpacing(b), c.find(".display-value").html(b), DB.designChange = !0, f.saveAction("change-letter-spacing", g, h))
        }

        function e(a) {
            var b = 100 * $(a.currentTarget).val(),
                c = $(a.currentTarget).parent(),
                d = $(".element.selected"),
                e = f.collection.document.get("pageObject"),
                g = $(".page.selected").index(),
                h = f.textEditIndex;
            d.hasClass("focusing") && objectIsset(e, g + ".elements." + h) && (e[g].elements[h].changeLineHeight(b), c.find(".display-value").html(b), DB.designChange = !0, f.saveAction("change-line-height", g, h))
        }
        a.preventDefault(), a.stopPropagation();
        var f = this,
            g = $(a.originalEvent.target);
        g.parents(".more-btn").find(".dropdown-menu").addClass("hidden"), g.parents(".more-btn").find("." + b).removeClass("hidden"), setTimeout(function() {
            g.parents(".more-btn").addClass("open").find(".dropdown-toggle").attr("aria-expanded", "true")
        }, 200), $(".more-btn .transparent-slider .transparency-input").bind("input", c), $(".more-btn .letter-spacing-slider .letter-spacing-input").bind("input", d), $(".more-btn .line-height-slider .line-height-input").bind("input", e);
        var h = $(".element.selected"),
            i = 100 - parseInt(h.data("opacity"), 10);
        if ($(".more-btn .transparent-slider .display-value").text(i), $(".more-btn .transparent-slider .transparency-input").val(i), h.hasClass("focusing")) {
            var j = h.data("letterSpacing"),
                k = h.data("lineHeight");
            $(".more-btn .letter-spacing-slider .display-value").text(j), $(".more-btn .letter-spacing-slider .letter-spacing-input").val(j), $(".more-btn .line-height-slider .display-value").text(k), $(".more-btn .line-height-slider .line-height-input").val(k)
        }
    },
    findCurrentId: function(a) {
        a.preventDefault();
        var b, c = this,
            d = $(".element.selected"),
            e = d.parents(".page").index(),
            f = d.index(),
            g = c.collection.document.get("pageObject");
        objectIsset(g, e + ".elements." + f) && "function" == typeof g[e].elements[f].getId && (b = g[e].elements[f].getId()), !b && d.hasClass("grid"), 0 < c.mousedownContext.parents(".sub-svg-context").length && d.hasClass("svg") && c.svgFrameIndex && (b = g[e].elements[f].getFrameId(c.svgFrameIndex)), b && ($(a.currentTarget).data("query", b), c.triggerSearchMedia(a))
    },
    isBlankDesign: function() {
        var a = this.collection.document.get("pageObject");
        return a[0].elements.length > 1 ? !1 : !a[0].elements[0].mediaId && a[0].elements[0].isBackground && "#ffffff" === a[0].elements[0].backgroundColor ? !0 : void 0
    }
});
var DB = DB || {};
DB.DesignView = Backbone.View.extendEach(DB.View.prototype, DB.DesignCore.prototype, {
    el: $("body"),
    initialize: function(a) {
        var b = this;
        b.template = _.template($("#design_media_tmpl").html()), b.template_design = _.template($("#user_design_tmpl").html()), b.layout_page = b.design_page = b.text_page = b.background_page = b.upload_page = 1, b.is_fetching = 0, DB.designChange = !1, b.recentChange = !1, b.recent_media = a.recent_media || {}, DB.userPalettes = a.palettes || [], b.$('[data-toggle="tooltip"]').tooltip(), DB.AjaxManager.run(), b.switchLayoutMode(), b.$(".scroll-editer, .scroll-wrap").niceScroll({
            cursorcolor: "#00F"
        }), _.bindAll(b, "render", "afterRender", "changeStage", "designMediaScroll", "startRenderDesign", "requestExportDesign", "finishRenderDesign", "triggerStopCloseWindow", "triggerUploadImage", "startUploadUserImage", "saveDesign", "prepareShareDesign", "requestGenerateDesign", "popupShareSocial"), b.render = _.wrap(b.render, function(a) {
            return a(arguments[1], arguments[2]), b.afterRender(), b
        }), b.$(".scroll-wrap").unbind("DOMMouseScroll mousewheel"), b.$(".scroll-wrap").bind("DOMMouseScroll mousewheel", b.designMediaScroll), b.$('.pannel-upload .box-col-inner input[type="file"]').on("change", function(a) {
            a.preventDefault(), a.stopPropagation(), this.files && this.files[0] && b.startUploadUserImage(this.files[0])
        }), b.bindLabelEvent();
        var c = b.getCookie("#db#auto_save#" + b.collection.document.id);
        null !== c && (c = "true" === c, b.$('#design-wrap .content_option .auto-save input[type="checkbox"]').prop("checked", c));
        var d = JSON.parse(b.getStorageData("#db#recentUsed"));
        return _.size(d) > 0 && !_.isEqual(d, b.recent_media) && (_.each(d, function(a, c) {
            (!_.has(b.recent_media, c) || b.recent_media[c] < a) && (b.recent_media[c] = a)
        }), b.updateRecentMedia()), window.onbeforeunload = b.triggerStopCloseWindow, setInterval(function() {
            b.collection.document.toFetchDocumentVersion(), b.collection.document.fetch({
                remove: !1,
                wait: !0,
                data: {
                    version: b.collection.document.get("version")
                },
                error: function(a, c) {
                    if (205 == c.status) {
                        var d = _.template($("#connection_lost_tmpl").html())({
                            title: "Oops! We’re sorry, but seems like something went wrong.",
                            message: "Your request cannot be completed now due to the lost of internet connection or your design is outdated."
                        });
                        $("body .main, body .layer").addClass("page-blur"), $("body").prepend(d)
                    } else b.pushNotification({
                        type: "error",
                        message: c.responseJSON.msg
                    })
                }
            }), b.collection.document.resetUrl()
        }, 12e4), setTimeout(function() {
            b.renderOldDesign()
        }, 1e3), setInterval(b.designMediaScroll, 2e3), b
    },
    render: function(a, b) {
        function c(b) {
            return b.panel = a, "design" == a ? (b.document_id = d.collection.document.get("_id"), b.thumb_h = b.thumb_h * h / b.thumb_w, b.thumb_w = h) : (b.thumb_h = b.files.thumbnail.height * h / b.files.thumbnail.width, b.thumb_w = h), b
        }
        var d = this;
        if ("layout" == a) var e = d.$(".pannel-layout .tab-layout .grid-container"),
            f = d.template;
        else if ("design" == a) var e = d.$(".pannel-layout .tab-design .grid-container"),
            f = d.template_design;
        else if ("upload" == a) var e = d.$(".pannel-upload .box-col-inner .box-col-item.active .grid-container"),
            f = d.template,
            g = d.$(".pannel-upload .box-col-inner").data("query");
        else var e = d.$(".pannel-" + a + " .grid-container"),
                f = d.template;
        var h = e.find(".grid-item")[0].offsetWidth - ("search" == a ? 10 : 0);
        return _.size(b) > 0 ? (1 == e.find(".grid-item").length && "" == e.find(".grid-item").html() ? (e.empty(), _.each(b, function(a) {
            a = c(a);
            var b = f(a);
            e.append(b)
        }), "upload" == a ? (d.$grid = d.$grid || {}, d.$grid[g] = e.masonry({
            itemSelector: ".grid-item",
            transitionDuration: 0
        })) : "layout" != a && "design" != a && (d.$grid = d.$grid || {}, d.$grid[a] = e.masonry({
            itemSelector: ".grid-item",
            transitionDuration: 0
        })), e.closest(".scroll-wrap").niceScroll({
            cursorcolor: "#353744"
        })) : _.each(b, function(b) {
            b = c(b);
            var h = f(b),
                i = $(h);
            "upload" == a ? d.$grid[g].append(i).masonry("appended", i).masonry() : "layout" != a && "design" != a ? d.$grid[a].append(i).masonry("appended", i).masonry() : e.append(i)
        }), e.find(".grid-item img[data-src]").each(function() {
            var a = this,
                b = $('<img class="animated fadeIn"/>').attr("src", $(a).data("src")).data("id", $(a).parents(".grid-item").data("id")).attr("width", $(a).attr("width")).attr("height", $(a).attr("height")).on("load", function() {
                    this.complete && "undefined" != typeof this.naturalWidth && 0 != this.naturalWidth ? ($(a).parents(".grid-item").children(".blur-item").remove(), $(a).replaceWith(b)) : console.log($(a).data("src") + " loading failed.")
                })
        }), setTimeout(function() {
            e.children(".grid-item.grid-item-effect").removeClass("grid-item-effect")
        }, 50)) : ("upload" == a ? e.parents(".folder-expand").find(".b-loading .loading-icon").remove() : e.parents(".scroll-wrap").find(".b-loading .loading-icon").remove(), "upload" != a && 1 == e.find(".grid-item").length && "" == e.find(".grid-item").html() && ("layout" == a ? e.html(_.template($("#no_media_tmpl").html())({
            message: "Sorry, we haven’t got any layout for this dimension yet."
        })) : e.html(_.template($("#no_media_tmpl").html())()))), d.is_fetching = 0, d
    },
    afterRender: function() {
        var a = this,
            b = a.$("#panel-left ul li.active-tab").data("type");
        if ("layout" == b) {
            var c = a.$(".pannel-layout .layout-tab span.active-layout").data("stage"),
                d = "stage-layout" == c ? a.$(".pannel-layout .tab-layout") : a.$(".pannel-layout .tab-design");
            d.find(".grid-container .grid-item.grid-item-group").off("click").on("click", function(b) {
                var e = $(b.currentTarget).data("id"),
                    f = d.find('.grid-container .grid-large[data-id="' + e + '"]');
                if (f.hasClass("hidden") ? (d.find(".grid-container .grid-large").addClass("hidden"), f && (f.removeClass("hidden").find(".xclose").off("click").on("click", function() {
                        f.addClass("hidden")
                    }), d.find(".scroll-wrap").animate({
                        scrollTop: $(b.currentTarget)[0].offsetTop + $(b.currentTarget)[0].offsetHeight - 50
                    }, 1e3), setTimeout(function() {
                        f.find(".grid-item.grid-item-effect").removeClass("grid-item-effect")
                    }, 50))) : d.find(".grid-container .grid-large").addClass("hidden"), "stage-layout" == c) {
                    var g = a.collection.layouts.findWhere({
                        _id: e
                    });
                    if (!g) return !1;
                    _.each(g.get("_files"), function(b) {
                        a.loadLayoutsOrigin({
                            _id: b._id,
                            original_url: b.original.url
                        }, a.collection.layouts)
                    })
                }
            })
        } else "upload" == b && a.bindUserImagesEvent()
    },
    events: function() {
        return _.extend({}, DB.View.prototype.events, DB.DesignCore.prototype.events, {
            "click #panel-left .menu li": "changeStage",
            "click .top-bar .create-new": "toggleCreateDesignModal",
            "click .pannel-layout .layout-tab span": "switchLayoutTab",
            "click .goto-collections .totop": "triggerScrollTopPanel",
            "mousedown .main_edit": "docMousedown",
            "mousemove .main_edit": "docMousemove",
            "mouseup .main_edit": "docMouseup",
            "click .top-bar .doctype-name p": "toggleChangeDesignTitle",
            "keyup .top-bar .doctype-name .change-name input": "saveDesignTitle",
            "click .top-bar .doctype-name .change-name button": "saveDesignTitle",
            'click #design-wrap .content_option .auto-save input[type="checkbox"]': "toggleAutoSave",
            "click .top-bar .global-control .btn_save": "saveDesign",
            "keyup .txt-search": "triggerSearchMedia",
            "click .txt-search": "triggerSearchMedia",
            "click .pannel-content .box-search-col li": "triggerFilterSearch",
            "click .pannel-search .search-flash li a": "triggerSearchMedia",
            'click .pannel-upload .box-col-inner .folder[data-action="new-label"]': "triggerCreateUserLabel",
            "click .top-bar .global-control .btn_download": "toggleDownloadBox",
            "click #modal-download .btn-download-desktop, #modal-download .btn-dropbox": "prepareRenderDesign",
            "click .top-bar .global-control .btn_share": "toggleShareBox",
            "click #modal-share .btn-share-facebook, #modal-share .btn-share-twitter": "popupShareSocial",
            "click .top-bar .global-control .btn_publish": "triggerPublicDesign",
            "click .top-bar .global-control .btn_resize": "toggleResizeBox",
            "click .help_design_bottom": "toggleHelpDesignBox",
            "click .box_help .close, .box_help_two .close_mess": "closeHelpDesignBox",
            "click .box_help_two .send_mess": "triggerSubmitHelpDesign",
            "click #panel-left .btn-modal-guide": "toggleDesignTip"
        })
    },
    detectQuickCommandKey: function(a) {
        var b = this,
            c = window.navigator.userAgent.match(/Macintosh/) ? !0 : !1,
            d = c ? a.originalEvent.metaKey : a.originalEvent.ctrlKey;
        a.originalEvent.shiftKey;
        d && 77 == a.originalEvent.which ? (a.preventDefault(), a.stopPropagation(), b.toggleCreateNewBox(a)) : 27 == a.originalEvent.which && b.$(".create_new_layout_v2").removeClass("in")
    },
    toggleCreateNewBox: function(a) {
        a.preventDefault(), a.stopPropagation();
        var b = this;
        b.$(".create_new_layout_v2").addClass("in"), b.$(".create_new_layout_v2 .close_new_layoutv2").click(function() {
            b.$(".create_new_layout_v2").removeClass("in")
        })
    },
    triggerStopCloseWindow: function() {
        return DB.designChange ? "Your changes will be lost." : void 0
    },
    switchLayoutMode: function() {
        var a = this,
            b = a.$(".pannel-layout .tab-layout").data("column"),
            c = a.collection.document.get("dimensions"),
            d = c.width,
            e = c.height,
            f = d / e;
        2 == b ? $(".pannel-layout .tab-layout .grid-container").removeClass("grid-one").addClass("grid-two") : 1 == b ? $(".pannel-layout .tab-layout .grid-container").removeClass("grid-two").addClass("grid-one") : 1 > f ? $(".pannel-layout .tab-layout .grid-container").removeClass("grid-one").addClass("grid-two") : $(".pannel-layout .tab-layout .grid-container").removeClass("grid-two").addClass("grid-one")
    },
    switchLayoutTab: function(a) {
        var b = this,
            c = $(a.currentTarget).data("stage");
        b.$(".pannel-layout .layout-tab span").removeClass("active-layout"), $(a.currentTarget).addClass("active-layout"), b.$(".pannel-layout #layout-content").removeClass().addClass(c)
    },
    changeStage: function(a) {
        a.preventDefault();
        var b = this,
            c = $(a.currentTarget).data("type"),
            d = $(a.currentTarget).data("stage");
        b.$("#panel-left .menu li").removeClass("active-tab"), $(a.currentTarget).addClass("active-tab"), $(".pannel-content .data-panel").removeClass("active"), "search" === c ? $(".pannel-content .pannel-search").addClass("active") : "layout" === c ? $(".pannel-content .pannel-layout").addClass("active") : "background" === c ? $(".pannel-content .pannel-background").addClass("active") : "text" === c ? $(".pannel-content .pannel-text").addClass("active") : "upload" === c && ($(".pannel-content .pannel-upload").addClass("active"), b.$(".pannel-upload .box-col-inner").hasClass("loading-label") && b.loadUserLabels()), b.$("#panel-left").removeClass().addClass("animated slideInLeft stage" + d), 1 == d && (b.$(".txt-search").focus(), b.$(".pannel-search .b-loading .loading-icon").addClass("hidden")), b.$(".pannel-" + c + ' a[data-toggle="tooltip"]').tooltip(), b.designMediaScroll()
    },
    designMediaScroll: function() {
        var a = this,
            b = a.$("#panel-left .menu li.active-tab"),
            c = b.data("type"),
            d = a.$(".pannel-" + c),
            e = d.find(".b-loading .loading-icon");
        if ("layout" == c) {
            var f = a.$(".pannel-layout #layout-content .layout-tab span.active-layout").data("stage");
            "stage-layout" == f ? e = d.find(".tab-layout .b-loading .loading-icon") : "stage-design" == f && (e = d.find(".tab-design .b-loading .loading-icon"))
        } else "upload" == c && (e = d.find(".box-col-inner .box-col-item.active .b-loading .loading-icon"));
        if (!a.is_fetching && e.length && a.isElementInViewport(e))
            if ("layout" == c) "stage-layout" == f ? a.loadLayouts() : "stage-design" == f && a.loadUserDesign();
            else if ("background" == c) a.loadBackgrounds();
            else if ("text" == c) a.loadTexts();
            else if ("search" == c) {
                var g = a.$(".pannel-search .search-flash").data("target");
                console.log(g), "recent" == g ? a.loadRecentMedia() : a.loadSearches()
            } else "upload" == c && a.loadUserUploads()
    },
    loadLayouts: function() {
        var a = this,
            b = a.layout_page,
            c = 10,
            d = (b - 1) * c;
        a.is_fetching = 1, a.$(".pannel-layout .tab-layout .b-loading .loading-icon").removeClass("hidden"), a.collection.layouts.fetch({
            remove: !1,
            data: {
                start: d,
                limit: c,
                listed: 1,
                doctype: a.collection.document.get("doctype")
            },
            success: function(b, c) {
                a.layout_page++, a.render("layout", c.response), _.each(c.response, function(b) {
                    a.loadLayoutsOrigin({
                        _id: b._id,
                        original_url: b.files.original.url
                    }, a.collection.layouts)
                })
            }
        })
    },
    loadLayoutsOrigin: function(a, b, c) {
        var d = this;
        DB.AjaxManager.addReq({
            url: a.original_url,
            dataType: "json",
            success: function(e) {
                var f = b.findWhere({
                    _id: a._id
                });
                if (f) f.set("original", e.original), b.set([f], {
                    remove: !1
                });
                else {
                    f = new DB.Media({
                        _id: a._id,
                        original: e.original,
                        price: e.price
                    });
                    var g = d.$('.grid-item[data-id="' + a._id + '"]').closest(".grid-large");
                    if (g.length) {
                        var h = d.collection.layouts.findWhere({
                            _id: g.data("id")
                        });
                        h && null != h.attributes._files && h.attributes._files.length && _.each(h.attributes._files, function(b) {
                            return b._id == a._id ? void f.set({
                                files: {
                                    original: b.original,
                                    screen: b.screen,
                                    thumbnail: b.thumbnail
                                }
                            }) : void 0
                        })
                    }
                    b.set([f], {
                        remove: !1
                    })
                }
                "function" == typeof c && c(e.original)
            }
        })
    },
    loadBackgrounds: function() {
        var a = this,
            b = a.background_page,
            c = 18,
            d = (b - 1) * c;
        a.is_fetching = 1, a.$(".pannel-background .b-loading .loading-icon").removeClass("hidden"), a.collection.backgrounds.fetch({
            remove: !1,
            data: {
                start: d,
                limit: c
            },
            success: function(b, c) {
                a.background_page++, a.render("background", c.response)
            }
        })
    },
    loadTexts: function() {
        var a = this,
            b = a.text_page,
            c = 18,
            d = (b - 1) * c;
        a.is_fetching = 1, a.$(".pannel-text .b-loading .loading-icon").removeClass("hidden"), a.collection.texts.fetch({
            remove: !1,
            data: {
                start: d,
                limit: c
            },
            success: function(b, c) {
                a.text_page++, a.render("text", c.response)
            }
        })
    },
    loadUserDesign: function() {
        var a = this,
            b = a.design_page,
            c = 10,
            d = (b - 1) * c;
        a.is_fetching = 1, a.$(".pannel-layout .tab-design .b-loading .loading-icon").removeClass("hidden"), a.collection.designs.fetch({
            remove: !1,
            data: {
                start: d,
                limit: c,
                loc: "editor"
            },
            success: function(b, c) {
                a.design_page++, a.is_fetching = 0, a.render("design", c.response)
            }
        })
    },
    triggerScrollTopPanel: function() {
        var a = this,
            b = a.$("#panel-left .menu li.active-tab");
        type = b.data("type"), currentList = a.$(".pannel-" + type), currentList.find(".scroll-wrap").animate({
            scrollTop: 0
        }, 500)
    },
    triggerFilterSearch: function(a) {
        var b = this,
            c = $(a.currentTarget).data("type");
        b.$(".pannel-content .box-search-col").data("type", c), b.$(".pannel-content .box-search-col span").html($(a.currentTarget).find("p").text() + '<i class="fa fa-caret-down"></i>'), b.triggerSearchMedia()
    },
    triggerSearchMedia: function(a) {
        var b = this;
        if (b.$('#panel-left .menu li[data-type="search"]').trigger("click"), "undefined" != typeof a)
            if ($(a.currentTarget).hasClass("txt-search")) {
                if (13 != a.keyCode) return !0;
                if ($(a.currentTarget).val().length < 3) return !0
            } else b.$(".pannel-content .box-search-col").data("type", "RV"), b.$(".pannel-content .box-search-col span").text("All"), b.$(".txt-search").val($(a.currentTarget).data("query"));
        else if ("" == b.$(".txt-search").val()) return !0;
        return b.$(".pannel-content .box-search-col").hasClass("disabled") ? !0 : (b.$(".pannel-content .box-search-col").addClass("disabled"), b.search_page = 1, "undefined" != typeof b.$grid && "undefined" != typeof b.$grid.search && b.$grid.search.masonry().masonry("destroy"), b.$(".pannel-search .grid-container").html('<div class="grid-item" style="background: none;"></div>'), b.$(".pannel-search .loading").html('<div class="inner-circles-loader loading-icon"></div>'), void("undefined" != typeof a && $(a.currentTarget).hasClass("recent") ? (b.$(".pannel-search .search-flash").data("target", "recent").data("query", ""), b.loadRecentMedia()) : (b.$(".pannel-search .search-flash").data("target", "search").data("query", b.$(".txt-search").val()), b.loadSearches())))
    },
    loadSearches: function() {
        var a = this,
            b = a.search_page,
            c = 18,
            d = (b - 1) * c,
            e = a.$(".txt-search").val(),
            f = a.$(".pannel-content .box-search-col").data("type");
        return e.length < 3 ? !0 : (a.$(".pannel-search .search-caption").html("Search by: <span>" + e + "</span>"), a.is_fetching = 1, a.$(".pannel-search .b-loading .loading-icon").removeClass("hidden"), void a.collection.searches.fetch({
            remove: !1,
            data: {
                start: d,
                limit: c,
                q: e,
                type: f
            },
            success: function(b, c) {
                a.search_page++, a.render("search", c.response), 2 == a.search_page && a.$(".pannel-search .scroll-wrap").animate({
                    scrollTop: a.$(".search-caption")[0].offsetTop
                }, 1e3), a.$(".pannel-content .box-search-col").removeClass("disabled")
            },
            error: function() {
                a.$(".pannel-content .box-search-col").removeClass("disabled")
            }
        }))
    },
    updateRecentMedia: function() {
        var a = this;
        "undefined" == typeof a.recent_media && (a.recent_media = {}), a.recentChange = !0;
        var b = _.pairs(a.recent_media);
        b.sort(function(a, b) {
            return b - a
        }), a.recent_media = _.object(b), a.setStorageData("#db#recentUsed", JSON.stringify(a.recent_media)), _.each(a.recent_media, function(b, c) {
            a.collection.recents.set({
                _id: c,
                time: b
            }, {
                remove: !1
            })
        });
        var c = a.collection.recents.toJSON();
        c = _.sortBy(c, "time"), c = c.reverse(), a.collection.recents.reset(c), _.each(a.collection.recents.toJSON(), function(c) {
            if (!_.has(c, "files"))
                if (b = a.collection.searches.findWhere({
                        _id: c._id
                    })) c.files = b.attributes.files, a.collection.recents.set(c, {
                    remove: !1
                });
                else if (b = a.collection.elements.findWhere({
                        _id: c._id
                    })) c.files = b.attributes.bundle.files, a.collection.recents.set(c, {
                    remove: !1
                });
                else {
                    var d = DB.BaseApi + "media/batch?refs=" + c._id + ":1";
                    $.ajax({
                        url: d,
                        type: "GET",
                        dataType: "json",
                        success: function(b) {
                            c.type = b.response[0].type, _.extend(c, b.response[0].bundle), a.collection.recents.set(c, {
                                remove: !1
                            })
                        }
                    })
                }
        })
    },
    loadRecentMedia: function() {
        var a = this;
        a.$(".pannel-search .search-caption").text("Recently used images"), a.is_fetching = 1, a.$(".pannel-search .b-loading .loading-icon").removeClass("hidden"), _.isEmpty(a.collection.recents.toJSON()) ? a.collection.recents.fetch({
            data: {
                refs: JSON.stringify(a.recent_media)
            },
            success: function(b, c) {
                a.is_fetching = 0, a.$(".pannel-search .b-loading .loading-icon").addClass("hidden"), a.render("search", c.response), a.$(".pannel-search .scroll-wrap").animate({
                    scrollTop: a.$(".search-caption")[0].offsetTop
                }, 1e3)
            }
        }) : (a.render("search", a.collection.recents.toJSON()), a.$(".pannel-search .scroll-wrap").animate({
            scrollTop: a.$(".search-caption")[0].offsetTop
        }, 1e3), a.$(".pannel-search .b-loading .loading-icon").addClass("hidden")), a.$(".pannel-content .box-search-col").removeClass("disabled")
    },
    triggerDropUpload: function(a) {
        var b = this;
        b.$(".pannel-upload .box-col-inner .box-col-item .btn-upload").hasClass("disabled") || a.originalEvent.dataTransfer && a.originalEvent.dataTransfer.files.length && (a.preventDefault(), a.stopPropagation(), _.each(a.originalEvent.dataTransfer.files, function(a) {
            b.startUploadUserImage(a)
        }))
    },
    triggerUploadImage: function(a) {
        var b = this;
        $(a.currentTarget).hasClass("disabled") || b.$('.pannel-upload .box-col-inner input[type="file"]').trigger("click")
    },
    startUploadUserImage: function(a) {
        var b = this;
        if (a) {
            if (a.size > 5242880) return void b.pushNotification({
                type: "error",
                message: "You can only upload images with 5MB maximum size"
            });
            b.$(".pannel-upload .scroll-wrap").animate({
                scrollTop: b.$(".pannel-upload .box-col-inner .box-col-item.active .folder")[0].offsetTop
            }, 1e3);
            var c = new FileReader,
                d = b.$(".pannel-upload .box-col-inner").data("query");
            c.onload = function(c) {
                b.$(".pannel-upload .zone").addClass("hidden"), b.$(".pannel-upload .btn-upload").addClass("disabled");
                var e = new DB.Media;
                e.toStartImportUpload(), e.save({}, {
                    data: {
                        file: a.name,
                        size: a.size,
                        target: b.$(".pannel-upload .box-col-inner").data("target"),
                        query: b.$(".pannel-upload .box-col-inner").data("query")
                    },
                    wait: !0,
                    emulateJSON: !0,
                    success: function(f, g) {
                        e.set(g.response), b.collection.uploads.add(g.response);
                        var h = b.$(".pannel-upload .box-col-inner .box-col-item.active .grid-container");
                        h.find(".grid-item").length || h.html('<div class="grid-item" style="background: none;"></div>');
                        var i = h.find(".grid-item").width(),
                            j = _.template($("#design_upload_tmpl").html())({
                                _id: g.response._id,
                                url: c.target.result,
                                width: i
                            }),
                            k = $(j);
                        b.$grid = b.$grid || {}, 1 == h.find(".grid-item").length && "" == h.find(".grid-item").html() && h.empty(), "undefined" == typeof b.$grid[d] ? (h.prepend(k), b.$grid[d] = h.masonry({
                            itemSelector: ".grid-item",
                            transitionDuration: 0
                        })) : (k.find("img").on("load", function() {
                            b.$grid[d].masonry("prepended", k)
                        }), b.$grid[d].prepend(k));
                        var l = new DB.User;
                        l.toUploadDesignImage(), l.save({}, {
                            data: {
                                file: g.response.import_bucket_id,
                                file_data: c.target.result
                            },
                            wait: !0,
                            emulateJSON: !0,
                            xhr: function() {
                                var a = $.ajaxSettings.xhr();
                                return a.upload && a.upload.addEventListener("progress", function(a) {
                                    if (a.lengthComputable) {
                                        var b = Math.ceil(100 * a.loaded / a.total);
                                        k.find(".uploading span").css("width", b + "%")
                                    }
                                }, !1), a
                            },
                            success: function() {
                                e.toFinishImportUpload(), e.save({}, {
                                    wait: !0,
                                    success: function(c, e) {
                                        b.collection.uploads.set(e.response, {
                                            remove: !1
                                        });
                                        var f = e.response;
                                        f.panel = "upload", f.thumb_h = f.files.thumbnail.height * i / f.files.thumbnail.width, f.thumb_w = i;
                                        var g = b.template(f);
                                        h.find('.grid-item[data-id="' + e.response._id + '"]').replaceWith(g), h.find(".grid-item img[data-src]").each(function() {
                                            var a = this,
                                                b = $("<img />").attr("src", $(a).data("src")).attr("data-id", e.response._id).attr("data-version", e.response.version).on("load", function() {
                                                    this.complete && "undefined" != typeof this.naturalWidth && 0 != this.naturalWidth ? ($(a).parents(".grid-item").children(".blur-item").remove(), $(a).replaceWith(b)) : console.log($(a).data("src") + " loading failed.")
                                                })
                                        }), setTimeout(function() {
                                            h.find(".grid-item.grid-item-effect").removeClass("grid-item-effect")
                                        }, 50), b.$grid[d].masonry().masonry("reloadItems").masonry("layout"), b.finishUploadImage(), b.pushNotification({
                                            type: "success",
                                            message: 'Upload photo "' + a.name + '" success!'
                                        })
                                    },
                                    error: function(a, c) {
                                        b.finishUploadImage(), b.pushNotification({
                                            type: "error",
                                            message: c.msg
                                        })
                                    }
                                })
                            },
                            error: function(a, c) {
                                b.finishUploadImage(), b.pushNotification({
                                    type: "error",
                                    message: c.msg
                                })
                            }
                        })
                    },
                    error: function(a, c) {
                        b.finishUploadImage(), b.pushNotification({
                            type: "error",
                            message: c.msg
                        })
                    }
                })
            }, c.readAsDataURL(a)
        } else b.finishUploadImage()
    },
    finishUploadImage: function() {
        var a = this;
        a.$('.pannel-upload .box-col-inner input[type="file"]').val(""), a.$(".pannel-upload .btn-upload").removeClass("disabled"), a.bindUserImagesEvent()
    },
    loadUserLabels: function() {
        var a = this;
        a.collection.labels.fetch({
            remove: !1,
            data: {
                target: "upload"
            },
            success: function(b, c) {
                a.collection.labels.set(c.response), _.each(c.response, function(b) {
                    var c = _.template($("#design_upload_label_tmpl").html())(b);
                    $(c).insertBefore(a.$('.pannel-upload .box-col-inner .folder[data-action="new-label"]').parent()), a.$(".pannel-upload .box-col-inner").removeClass("loading-label"), a.bindLabelEvent()
                })
            }
        })
    },
    loadUserUploads: function() {
        var a = this,
            b = a.$(".pannel-upload .box-col-inner .box-col-item.active .folder").data("cur-page"),
            c = 18,
            d = (b - 1) * c,
            e = a.$(".pannel-upload .box-col-inner").data("target"),
            f = a.$(".pannel-upload .box-col-inner").data("query");
        a.is_fetching = 1, a.$(".pannel-upload .b-loading .loading-icon").removeClass("hidden"), a.collection.uploads.fetch({
            remove: !1,
            data: {
                start: d,
                limit: c,
                target: e,
                query: f
            },
            success: function(c, d) {
                a.$(".pannel-upload .box-col-inner .box-col-item.active .folder").data("cur-page", b + 1), a.render("upload", d.response)
            }
        })
    },
    triggerCreateUserLabel: function(a) {
        if (a.preventDefault(), $(a.currentTarget).hasClass("disabled")) return !1;
        $(a.currentTarget).addClass("disabled");
        var b = this,
            c = _.template($("#design_upload_new_label_tmpl").html())(),
            d = function(c) {
                if ($(c.currentTarget).hasClass("disabled")) return !1;
                $(c.currentTarget).addClass("disabled").attr("disabled", !0);
                var d = $(c.currentTarget).val();
                if ("" == d) $(c.currentTarget).closest(".box-col-item").remove(), $(a.currentTarget).removeClass("disabled"), $(c.currentTarget).removeClass("disabled").removeAttr("disabled");
                else {
                    var e = new DB.UserLabel;
                    e.save({
                        title: d
                    }, {
                        success: function(d, e) {
                            var f = _.template($("#design_upload_label_tmpl").html())(e.response);
                            $(c.currentTarget).closest(".box-col-item").replaceWith(f), $(a.currentTarget).removeClass("disabled"), b.bindLabelEvent()
                        },
                        error: function(d, e) {
                            $(a.currentTarget).removeClass("disabled"), $(c.currentTarget).removeClass("disabled").removeAttr("disabled").focus(), b.pushNotification({
                                type: "error",
                                message: e.responseJSON.msg
                            })
                        }
                    })
                }
            };
        $(c).insertBefore($(a.currentTarget).parent()), b.$('.pannel-upload .box-col-inner .box-col-item.new_label_item input[name="label_name"]').focus().on("focusout", function(a) {
            d(a)
        }).on("keyup", function(b) {
            27 == b.keyCode ? ($(b.currentTarget).closest(".box-col-item").remove(), $(a.currentTarget).removeClass("disabled")) : 13 == b.keyCode && d(b)
        })
    },
    reArrangeUserLabel: function() {
        var a = this,
            b = a.$(".pannel-upload .box-col-inner .box-col-item");
        b.each(function(a) {
            this.className = this.className.replace(/box-col-item-(\d+)/g, "");
            var b = a % 3,
                c = "";
            1 == b ? c = "box-col-item2" : 2 == b && (c = "box-col-item3"), $(this).addClass(c)
        })
    },
    bindLabelEvent: function() {
        var a = this;
        a.reArrangeUserLabel(), a.$(".pannel-upload .box-col-item:not(.folder[data-action])").off("dragover dragenter dragend").on("dragover", function(a) {
            a.preventDefault(), a.stopPropagation(), $(a.currentTarget).hasClass("active") || $(a.currentTarget).find(".folder").trigger("click"), $(a.currentTarget).find(".zone").removeClass("hidden")
        }).on("dragenter", function(a) {
            a.preventDefault(), a.stopPropagation(), $(a.currentTarget).find(".zone").removeClass("hidden")
        }), a.$(".pannel-upload .box-col-item .folder").off("dragleave dragend").on("dragleave", function(a) {
            a.preventDefault(), a.stopPropagation(), $(a.currentTarget).siblings(".folder-expand").find(".zone").addClass("hidden")
        }).on("dragend", function(a) {
            a.preventDefault(), a.stopPropagation(), $(a.currentTarget).siblings(".folder-expand").find(".zone").addClass("hidden")
        }), a.$(".pannel-upload .box-col-item .zone").off("drop dragleave dragend").on("drop", function(b) {
            a.triggerDropUpload(b)
        }).on("dragleave", function(a) {
            a.preventDefault(), a.stopPropagation(), $(a.currentTarget).addClass("hidden")
        }).on("dragend", function(a) {
            a.preventDefault(), a.stopPropagation(), $(a.currentTarget).addClass("hidden")
        }), a.$(".pannel-upload .box-col-inner .box-col-item .btn-upload").off("click").on("click", a.triggerUploadImage), a.$(".pannel-upload .box-col-inner .box-col-item .folder:not([data-action])").off("click").on("click", function(b) {
            if (b.preventDefault(), $(b.target).hasClass("ion-edit")) {
                if ($(b.currentTarget).hasClass("editing")) return !1;
                $(b.currentTarget).addClass("editing");
                var c = function(c) {
                    if ($(c.currentTarget).hasClass("disabled")) return !1;
                    $(c.currentTarget).addClass("disabled").attr("disabled", !0);
                    var d = $(c.currentTarget).data("label"),
                        e = $(c.currentTarget).val(),
                        f = a.collection.labels.findWhere({
                            _id: d
                        }),
                        e = $(c.currentTarget).val();
                    return "" != e && f && e != f.get("title") ? (f.toUpdateLabel(), void f.save({
                        title: e
                    }, {
                        wait: !0,
                        patch: !0,
                        success: function(d, e) {
                            f.set(e.response), a.collection.labels.set(f, {
                                remove: !1
                            });
                            var g = _.template($("#design_upload_label_tmpl").html())(e.response);
                            $(c.currentTarget).closest(".box-col-item").replaceWith(g), $(b.currentTarget).removeClass("disabled"), a.bindLabelEvent()
                        },
                        error: function(d, e) {
                            $(b.currentTarget).removeClass("disabled"), $(c.currentTarget).removeClass("disabled").removeAttr("disabled").focus(), a.pushNotification({
                                type: "error",
                                message: e.responseJSON.msg
                            })
                        }
                    })) : ($(c.currentTarget).closest(".folder-name-change").addClass("hidden").siblings(".folder-name").removeClass("hidden"), $(b.currentTarget).removeClass("disabled"), $(c.currentTarget).removeClass("disabled").removeAttr("disabled"), !1)
                };
                $(b.currentTarget).find(".folder-name").addClass("hidden").siblings(".folder-name-change").removeClass("hidden").find("input").focus().select().off("focusout").on("focusout", function(a) {
                    c(a)
                }).off("keyup").on("keyup", function(a) {
                    27 == a.keyCode ? ($(a.currentTarget).closest(".folder-name-change").addClass("hidden").siblings(".folder-name").removeClass("hidden"), $(b.currentTarget).removeClass("disabled"), $(a.currentTarget).removeClass("disabled").removeAttr("disabled")) : 13 == a.keyCode && c(a)
                })
            } else if ($(b.target).hasClass("ion-ios-close-empty")) {
                if ($(b.currentTarget).hasClass("disabled")) return !1;
                $(b.currentTarget).addClass("disabled");
                var d = $(b.currentTarget).data("label"),
                    e = a.collection.labels.findWhere({
                        _id: d
                    });
                if (!e) return $(b.currentTarget).removeClass("disabled"), !1;
                a.popupConfirm("Your Folder ‘" + e.get("title") + "’ will be deleted together with all its contents.<br/> Are you sure?", function() {
                    e.toDeleteLabel(), e.destroy({
                        wait: !0,
                        emulateJSON: !0,
                        success: function(c, d) {
                            a.collection.labels.remove(e, {
                                silent: !0
                            }), delete e, $(b.currentTarget).closest(".box-col-item").remove(), a.reArrangeUserLabel(), a.pushNotification({
                                type: "success",
                                message: d.msg
                            })
                        },
                        error: function(c, d, e) {
                            $(b.currentTarget).removeClass("disabled"), a.pushNotification({
                                type: 406 == e.xhr.status ? "warning" : "error",
                                message: d.responseJSON.msg
                            })
                        }
                    })
                }, function() {
                    $(b.currentTarget).removeClass("disabled")
                })
            } else if (a.$(".pannel-upload .box-col-inner .box-col-item .folder-expand").slideUp(), a.$(".pannel-upload .box-col-inner .box-col-item").removeClass("active"), $(b.currentTarget).hasClass("opened")) a.$(".pannel-upload .box-col-inner .box-col-item .folder").removeClass("opened");
            else {
                a.$(".pannel-upload .box-col-inner .box-col-item .folder").removeClass("opened"), $(b.currentTarget).addClass("opened"), $(b.currentTarget).parent().addClass("active").find(".folder-expand").slideDown();
                var f = $(b.currentTarget).data("holder"),
                    d = $(b.currentTarget).data("label"),
                    g = ($(b.currentTarget).data("title"), a.$(".pannel-upload .box-col-inner"));
                if (f && "uploads" == f) {
                    if ("holder" == g.data("target") && "uploads" == g.data("query")) return !1;
                    g.data("target", "holder").data("query", "uploads")
                } else {
                    if ("label" == g.data("target") && g.data("query") == d) return !1;
                    g.data("target", "label").data("query", d)
                }
                a.designMediaScroll()
            }
        })
    },
    bindUserImagesEvent: function() {
        var a = this,
            b = a.$(".pannel-upload .box-col-inner").data("query");
        a.$(".pannel-upload .box-col-inner .box-col-item .grid-container .grid-item .ion-ios-close-empty").off("click").on("click", function(c) {
            if ($(c.currentTarget).hasClass("disabled")) return !1;
            $(c.currentTarget).addClass("disabled");
            var d = $(c.currentTarget).closest(".grid-item").data("id"),
                e = a.collection.uploads.findWhere({
                    _id: d
                });
            return e ? void a.popupConfirm("Are you sure to delete this image?", function() {
                e.toDeleteUploadImage(), e.destroy({
                    wait: !0,
                    emulateJSON: !0,
                    success: function(d, f) {
                        a.collection.uploads.remove(e, {
                            silent: !0
                        }), delete e;
                        var g = $(c.currentTarget).closest(".grid-item");
                        "undefined" != typeof a.$grid && "undefined" != typeof a.$grid[b] ? a.$grid[b].masonry("remove", g).masonry("layout") : g.remove(), a.pushNotification({
                            type: "success",
                            message: f.msg
                        })
                    },
                    error: function(b, d, e) {
                        $(c.currentTarget).removeClass("disabled"), a.pushNotification({
                            type: 406 == e.xhr.status ? "warning" : "error",
                            message: d.responseJSON.msg
                        })
                    }
                })
            }, function() {
                $(c.currentTarget).removeClass("disabled")
            }) : ($(c.currentTarget).removeClass("disabled"), !1)
        })
    },
    toggleChangeDesignTitle: function() {
        var a = this;
        a.$(".top-bar .doctype-name p").addClass("hidden"), a.$(".top-bar .doctype-name .change-name").removeClass("hidden").find("input").focus().select()
    },
    saveDesignTitle: function(a) {
        var b = this;
        if (b.$(".top-bar .doctype-name .change-name .fa-save").hasClass("disabled")) return !1;
        if (27 == a.keyCode) b.$(".top-bar .doctype-name .change-name").addClass("hidden"), b.$(".top-bar .doctype-name p").removeClass("hidden");
        else if (13 == a.keyCode || "BUTTON" == $(a.currentTarget)[0].tagName) {
            b.$(".top-bar .doctype-name .change-name button").addClass("disabled");
            var c = b.collection.document.get("title"),
                d = b.collection.document.get("version"),
                e = b.$(".top-bar .doctype-name .change-name input").val();
            e.length < 3 || e.length > b.maximumTitle ? (b.$(".top-bar .doctype-name .change-name button").removeClass("disabled"), b.$(".top-bar .doctype-name .change-name input").tooltip({
                title: "Your new title can only have from 3 to " + b.maximumTitle + " characters",
                trigger: "manual",
                placement: "bottom"
            }).tooltip("show"), setTimeout(function() {
                b.$(".top-bar .doctype-name .change-name input").attr("title", "").tooltip("destroy")
            }, 3e3)) : e == c ? (b.$(".top-bar .doctype-name .change-name button").removeClass("disabled"), b.$(".top-bar .doctype-name .change-name").addClass("hidden"), b.$(".top-bar .doctype-name p").removeClass("hidden")) : (b.collection.document.set("title", e), b.collection.document.toSaveDocument(), b.collection.document.save({
                title: e,
                version: d
            }, {
                patch: !0,
                success: function(a) {
                    b.collection.document.set(a.response), b.pushNotification({
                        color: "clgreen",
                        message: "Saved design title!"
                    }), b.$(".top-bar .doctype-name .change-name .fa-save").removeClass("disabled"), b.$(".top-bar .doctype-name .change-name").addClass("hidden").find("input").attr("placeholder", e), b.$(".top-bar .doctype-name p").text(e).removeClass("hidden"), b.$('#modal-download input[name="file_name"]').attr("placeholder", e).val(e)
                },
                error: function(a, c) {
                    b.$(".top-bar .doctype-name .change-name .fa-save").removeClass("disabled"), b.pushNotification({
                        color: "clred",
                        message: "An error occurs! Please try again later."
                    })
                }
            }), b.collection.document.resetUrl())
        }
    },
    triggerUpdateTitle: function(a) {
        var b = this,
            c = b.$(".top-bar .doctype-name .change-name input").data("edited");
        c || (a = b.stripHtml(a), a = b.trimString(a, b.maximumTitle), a.length >= 3 && a.length <= b.maximumTitle && (b.$(".top-bar .doctype-name .change-name input").data("edited", 1).val(a).attr("placeholder", a), b.$('.top-bar .doctype-name p[data-toggle="tooltip"]').text(a)))
    },
    toggleEditedState: function() {
        return !1
    },
    toggleAutoSave: function(a) {
        var b = this;
        b.setCookie("#db#auto_save#" + b.collection.document.id, $(a.currentTarget).is(":checked"), 365)
    },
    saveDesign: function(a, b) {
        a && a.preventDefault();
        var c = this;
        if (!c.$(".top-bar .global-control .btn_save").hasClass("disabled") || DB.designChange) {
            c.extractPageDataToModel(), DB.designChange = !1, clearTimeout(c.autoSave);
            var d = c.collection.document.get("title"),
                e = c.collection.document.get("version"),
                f = c.collection.document.get("pages"),
                g = c.$(".top-bar .doctype-name .change-name input").val();
            (g.length < 3 || g.length > c.maximumTitle) && (c.$(".top-bar .doctype-name .change-name button").removeClass("disabled"), c.$(".doctype-name .change-name input").tooltip({
                title: "Your new title can only have from 3 to " + c.maximumTitle + " characters",
                trigger: "manual",
                placement: "bottom"
            }).tooltip("show"), setTimeout(function() {
                c.$(".doctype-name .change-name input").attr("title", "").tooltip("destroy")
            }, 3e3)), "" != g && g != d ? c.collection.document.set("title", g) : g = d, c.collection.document.toSaveDocument(), c.$(".top-bar .global-control .btn_save").addClass("loading").removeClass("disabled"), c.collection.document.save({
                title: g,
                version: e,
                pages: f
            }, {
                patch: !0,
                success: function(a, d) {
                    c.collection.document.set(d.response), c.$(".top-bar .global-control .btn_save").removeClass("loading").addClass("disabled"), c.pushNotification({
                        type: "success",
                        message: "All change saved!"
                    }), c.$(".top-bar .doctype-name .change-name input").attr("placeholder", g), c.$('.top-bar .box_name_document span[data-toggle="tooltip"]').text("- " + g), c.$(".top-bar .doctype-name .change-name input").is(":focus") || (c.$(".top-bar .box_input_document").addClass("hidden"), c.$(".top-bar .box_name_document").removeClass("hidden")), c.$("#modal-download .download_file_name").attr("placeholder", g).val(g).parent().find("span i").text(g), "function" == typeof b && b()
                },
                error: function(a, b) {
                    if (205 == b.status) {
                        var d = _.template($("#connection_lost_tmpl").html())({
                            title: "Oops! We’re sorry, but seems like something went wrong.",
                            message: "Your request cannot be completed now due to the lost of internet connection or your design is outdated."
                        });
                        $("body .main, body .layer").addClass("page-blur"), $("body").prepend(d)
                    } else DB.designChange = !0, c.$(".top-bar .global-control .btn_save").removeClass("loading disabled"), c.pushNotification({
                        type: "error",
                        link: "undefined" != typeof b.responseJSON.link ? b.responseJSON.link : "javascript:;",
                        pin: 1,
                        message: b.responseJSON.msg
                    })
                }
            }), c.collection.document.resetUrl(), c.recentChange && !_.isUndefined(c.collection.user) && (c.collection.user.resetUrl(), c.collection.user.save({
                recent_medias: JSON.stringify(c.recent_media),
                palettes: JSON.stringify(DB.userPalettes)
            }, {
                wait: !0,
                patch: !0,
                success: function(a, b) {
                    c.recentChange = !1
                },
                error: function(a, b) {
                    console.log(b.responseJSON.msg)
                }
            }))
        }
    },
    toggleDownloadBox: function(a) {
        var b = this;
        b.$("#modal-download").modal("show"), b.$('#modal-download input[name="set_page"]').off("change").on("change", function(a) {
            "picked" == $(a.currentTarget).val() ? b.$('#modal-download input[name="picked_page"]').removeClass("hidden") : b.$('#modal-download input[name="picked_page"]').addClass("hidden")
        }), b.$('#modal-download select[name="file_type"]').off("change").on("change", function(a) {
            "jpg" == $(a.currentTarget).val() ? b.$('#modal-download select[name="file_quality"]').removeClass("disabled").removeAttr("disabled") : b.$('#modal-download select[name="file_quality"]').addClass("disabled").attr("disabled", !0)
        })
    },
    prepareRenderDesign: function(a) {
        a.preventDefault();
        var b = this;
        DB.designChange ? b.saveDesign(a, function() {
            b.requestCheckoutDesign(a)
        }) : b.requestCheckoutDesign(a)
    },
    requestCheckoutDesign: function(a) {
        var b = this;
        b.collection.document.toCheckoutDocument(), b.collection.document.fetch({
            success: function(c, d) {
                if (0 == d.response.total) b.startRenderDesign(a);
                else {
                    var e = _.template($("#modal_checkout_tmpl").html())(d.response);
                    b.$el.append(e), b.$("#modal-checkout .purcha-scroll > .puchar-item").on("click", function(a) {
                        $(a.currentTarget).hasClass("open-child") && 0 == $(a.target).closest(".puchar-child").length ? $(a.currentTarget).removeClass("open-child").find(".puchar-child").hide() : $(a.currentTarget).addClass("open-child").find(".puchar-child").show()
                    }), b.$("#modal-download").modal("hide"), b.$("#modal-checkout").on("hide.bs.modal", function() {
                        b.$("#modal-checkout").remove()
                    }).on("shown.bs.modal", function() {
                        b.$("#modal-checkout .purcha-scroll").niceScroll({
                            cursorcolor: "#00F",
                            autohidemode: "leave"
                        })
                    }).modal({
                        backdrop: "static",
                        keyboard: !1
                    }).modal("show"), b.$("#modal-checkout .btn-order").off("click").on("click", function(c) {
                        c.preventDefault(), b.collection.document.toPayoutDocument(), b.collection.document.save({}, {
                            patch: !0,
                            success: function(c, d) {
                                b.$("#modal-checkout").modal("hide"), b.startRenderDesign(a)
                            }
                        })
                    }), b.$("#modal-checkout .btn-purchase-more").off("click").on("click", function(a) {
                        a.preventDefault(), b.$("#modal-checkout").modal("hide"), window.open($(a.currentTarget).attr("href"), "_blank")
                    })
                }
            }
        }), b.collection.document.resetUrl()
    },
    startRenderDesign: function(a, b) {
        a.preventDefault();
        var c = this;
        if ("function" == typeof c.isBlankDesign && c.isBlankDesign()) return $(a.currentTarget).attr("title", "You cannot download a blank design").tooltip({
            trigger: "manual",
            placement: "top"
        }).tooltip("show"), setTimeout(function() {
            $(a.currentTarget).attr("title", "").tooltip("destroy")
        }, 3e3), !1;
        if ("undefined" != typeof b && "share" == b) var d = "all",
            e = "png",
            f = "high";
        else {
            var e = c.$('#modal-download select[name="file_type"]').val(),
                f = c.$('#modal-download select[name="file_quality"]').val(),
                d = c.$('#modal-download input[name="set_page"]:checked').val(),
                g = c.$('#modal-download input[name="picked_page"]').val();
            if (picked = g.trim().split(","), "picked" == d && (picked.length < 1 || "" === g.trim())) return $(a.currentTarget).attr("title", "Please enter page numbers you want to download.").tooltip({
                trigger: "manual",
                placement: "top"
            }).tooltip("show"), setTimeout(function() {
                $(a.currentTarget).attr("title", "").tooltip("destroy")
            }, 3e3), !1;
            if (picked.length >= 1)
                for (var h = 0; h < picked.length; h++)
                    if (isNaN(picked[h])) return $(a.currentTarget).attr("title", "Please enter page index by numeric").tooltip({
                        trigger: "manual",
                        placement: "top"
                    }).tooltip("show"), setTimeout(function() {
                        $(a.currentTarget).attr("title", "").tooltip("destroy")
                    }, 3e3), !1
        }
        c.$(".top-bar .global-control .btn_publish").addClass("disabled"), $(a.currentTarget).addClass("disabled");
        var i = {
            name: c.$('#modal-download input[name="file_name"]').val(),
            type: e,
            quality: f,
            pages: d
        };
        "picked" == d && (i.picked = JSON.stringify(picked)), c.$("#modal-download").modal("hide"), $("body").addClass("show-box-download").prepend('<div class="overlay"></div>'), c.$("#modal-rendering").removeClass("hidden"), c.$("#modal-rendering p").text("Creating your design..."), c.$("#modal-rendering .meter").addClass("hidden"), c.$("#modal-rendering .meter span").attr("style", "width: 0%"), c.$("#modal-rendering .meter .text_load_save").text("0%"), c.collection.document.toRenderDocument(), c.collection.document.fetch({
            data: i,
            success: function(b, d) {
                "undefined" != typeof d.response && "done" == d.response.progress ? $(a.currentTarget).is(".btn-download-desktop, .btn-dropbox") ? (c.$("#modal-rendering p").text(d.msg), c.returnDownloadFile(a)) : c.requestGenerateDesign(a) : c.exportInterval = setInterval(function() {
                    c.requestExportDesign(a)
                }, 2e3)
            },
            error: function(b, d) {
                c.$("#modal-rendering p").text(d.responseJSON.msg), c.finishRenderDesign(a)
            }
        }), c.collection.document.resetUrl()
    },
    requestExportDesign: function(a) {
        var b = this;
        b.collection.document.toExportDocument(), b.collection.document.fetch({
            success: function(c, d) {
                b.$("#modal-rendering .meter").removeClass("hidden"), "done" != d.response.progress ? (b.$("#modal-rendering p").text(d.msg), d.response.progress > 0 && (b.$("#modal-rendering .meter span").attr("style", "width: " + d.response.progress + "%"), b.$("#modal-rendering .meter .text_load_save").text(d.response.progress + "%"))) : (window.clearInterval(b.exportInterval), b.$("#modal-rendering .meter span").attr("style", "width: 100%"), b.$("#modal-rendering .meter .text_load_save").text("100%"), $(a.currentTarget).is(".btn-download-desktop, .btn-dropbox") ? (b.$("#modal-rendering p").text(d.msg), b.returnDownloadFile(a)) : b.requestGenerateDesign(a))
            },
            error: function(c, d) {
                window.clearInterval(b.downloadTimer), window.clearInterval(b.exportInterval), b.$("#modal-rendering p").text(d.responseJSON.msg), b.finishRenderDesign(a)
            }
        }), b.collection.document.resetUrl()
    },
    returnDownloadFile: function(a) {
        var b = this;
        b.collection.document.toDownloadDocument();
        var c = b.collection.document.url;
        b.collection.document.resetUrl();
        var d = (new Date).getTime();
        if (c += "?dl_token=" + d + "&access_token=" + DB.Token, $(a.currentTarget).hasClass("btn-download-desktop")) {
            b.downloadAttempts = 30;
            var e = document.getElementById("downloadFrame");
            e.src = "", e.src = c, b.downloadTimer = window.setInterval(function() {
                var c = b.getCookie("downloadToken");
                (c == d || 0 == b.downloadAttempts) && (window.clearInterval(b.downloadTimer), b.expireCookie("downloadToken"), b.finishRenderDesign(a)), b.downloadAttempts--
            }, 1e3)
        } else if ($(a.currentTarget).hasClass("btn-dropbox")) {
            var f = $(a.currentTarget).closest("#modal-download").find('input[name="file_name"]').val();
            f = b.trimString(f, 100), c += "&target=dropbox", b.$("#modal-rendering .btn_ok").html('<i class="fa fa-refresh fa-spin"></i> &nbsp;&nbsp; Connecting Dropbox...').removeClass("hidden").off("click");
            var g = new XMLHttpRequest;
            g.open("GET", c, !0), g.onreadystatechange = function() {
                if (g.readyState === XMLHttpRequest.DONE && 200 === g.status) {
                    var d = this.getResponseHeader("content-type");
                    f += "application/zip" == d ? ".zip" : ".png", b.popupSaveDropbox(a, c, f)
                }
            }, g.send()
        }
    },
    popupSaveDropbox: function(a, b, c) {
        var d = this;
        d.$("#modal-rendering .btn_ok").text("Save to dropbox!").off("click").on("click", function(e) {
            Dropbox.save(b, c, {
                success: function() {
                    d.expireCookie("downloadToken"), d.$("#modal-rendering p").text("Successfully saved your files to Dropbox!"), d.finishRenderDesign(a)
                },
                cancel: function() {
                    d.expireCookie("downloadToken"), d.$("#modal-rendering p").text("Cancelled saving to your Dropbox!"), d.finishRenderDesign(a)
                },
                error: function(b) {
                    d.expireCookie("downloadToken"), d.$("#modal-rendering p").text(b), d.finishRenderDesign(a)
                }
            })
        })
    },
    finishRenderDesign: function(a) {
        var b = this;
        $(a.currentTarget).removeClass("disabled"), b.$("#modal-rendering .meter").addClass("hidden"), b.$("#modal-rendering .btn_ok").text("OK").removeClass("hidden").off("click").on("click", function(a) {
            $("body").children(".overlay").remove(), $(a.currentTarget).addClass("hidden").text("OK"), b.$("#modal-rendering").addClass("hidden"), b.$("#modal-rendering p").text(""), b.$("#modal-rendering .meter").removeClass("hidden"), b.$("#modal-rendering .meter span").attr("style", "width: 0%"), b.$("#modal-rendering .meter text_load_save").text("0%"), b.$(".top-bar .global-control .btn_publish").removeClass("disabled"), b.$("#modal-download .btn-download-desktop").removeClass("disabled")
        }), setTimeout(function() {
            b.$("#modal-rendering .btn_ok").trigger("click")
        }, 3e3)
    },
    toggleShareBox: function(a) {
        var b = this;
        b.prepareShareDesign(a)
    },
    prepareShareDesign: function(a) {
        var b = this;
        DB.designChange ? b.saveDesign(a, function() {
            b.startRenderDesign(a, "share")
        }) : b.startRenderDesign(a, "share")
    },
    requestGenerateDesign: function(a) {
        var b = this;
        b.collection.document.toDownloadDocument(), b.collection.document.fetch({
            remove: !1,
            wait: !0,
            data: {
                mode: "share",
                target: $(a.currentTarget).hasClass("btn_preview") ? "designit" : "social"
            },
            success: function(c, d) {
                if ($(a.currentTarget).hasClass("btn_publish")) b.$("#modal-rendering p").text("Publishing your design..."), b.requestPublicDesign(a);
                else if ($(a.currentTarget).hasClass("btn_preview")) b.$("#modal-rendering p").text("Previewing your design..."), b.requestPreviewDesign(a, d.response.images_set);
                else if ($(a.currentTarget).hasClass("btn_share")) {
                    b.finishRenderDesign(a), b.$("#modal-rendering .btn_ok").trigger("click");
                    var e = new Clipboard("#modal-share .coppy");
                    e.off("success").on("success", function(a) {
                        a.clearSelection(), $(a.trigger).addClass("copied").attr("title", "Copied").tooltip("fixTitle").tooltip("show").find("em").text("Copied"), setTimeout(function() {
                            $(a.trigger).removeClass("copied").attr("title", "Copy link").tooltip("fixTitle").find("em").text("Copy")
                        }, 3e3)
                    }), b.$('#modal-share input[name="share-link"]').focus().off("click").on("click", function(a) {
                        $(a.currentTarget).select()
                    }), b.collection.document.toShareDocument(), b.collection.document.fetch({
                        remove: !1,
                        success: function(a, c) {
                            b.$('#modal-share input[name="share-link"]').val(c.response.url).attr("placeholder", c.response.url), b.$("#modal-share .btn-share-facebook, #modal-share .btn-share-twitter").data("href", c.response.url), b.$("#modal-share").modal("show")
                        }
                    }), b.collection.document.resetUrl()
                }
            },
            error: function(c, d) {
                b.pushNotification({
                    type: "error",
                    message: d.responseJSON.msg
                }), b.finishRenderDesign(a)
            }
        }), b.collection.document.resetUrl()
    },
    popupShareSocial: function(a) {
        a.preventDefault();
        var b = this;
        if ($(a.currentTarget).hasClass("btn-share-twitter")) {
            var c = "http://twitter.com/share?url=" + encodeURIComponent($(a.currentTarget).data("href")) + "&text=" + encodeURIComponent(b.collection.document.get("title")) + "&count=none/";
            b.popupCenterWindow(c, $(a.currentTarget).data("title"), 400, 300)
        } else if ($(a.currentTarget).hasClass("btn-share-facebook")) {
            var c = "http://www.facebook.com/dialog/share?app_id=1648622808683706&display=popup&href=" + encodeURIComponent($(a.currentTarget).data("href")) + "&caption=" + encodeURIComponent(b.collection.document.get("title")) + "&redirect_uri=" + encodeURIComponent(DB.BaseUrl + "close.html");
            b.popupCenterWindow(c, $(a.currentTarget).data("title"), 400, 300)
        }
    },
    triggerPublicDesign: function(a) {
        var b = this;
        if ($(a.currentTarget).hasClass("loading")) return a.preventDefault(), a.stopPropagation(), !1;
        if ("function" == typeof b.isBlankDesign && b.isBlankDesign()) {
            a.preventDefault(), a.stopPropagation();
            var c = $(a.currentTarget).attr("data-original-title");
            return $(a.currentTarget).attr("title", "You can only publish an edited design.").tooltip("fixTitle").tooltip("show"), setTimeout(function() {
                $(a.currentTarget).attr("title", c).tooltip("fixTitle").tooltip("show")
            }, 3e3), !1
        }
        $(a.currentTarget).hasClass("unlock") ? DB.designChange ? b.saveDesign(a, function() {
            b.startRenderDesign(a)
        }) : b.startRenderDesign(a) : DB.designChange ? b.saveDesign(a, function() {
            b.requestPublicDesign(a)
        }) : b.requestPublicDesign(a)
    },
    requestPublicDesign: function(a) {
        var b, c = this;
        $(a.currentTarget).addClass("loading"), b = $(a.currentTarget).hasClass("unlock") ? 1 : 0, c.collection.document.toUpdateDocumentActive(), c.collection.document.save({
            active: b
        }, {
            wait: !0,
            patch: !0,
            success: function(d, e) {
                $(a.currentTarget).removeClass("loading"), 1 == b ? (c.$("#modal-rendering p").text("Your design is now published!"), c.finishRenderDesign(a), $(a.currentTarget).removeClass("unlock").addClass("lock").attr("title", "Un publish").tooltip("fixTitle").tooltip("show"), $(a.currentTarget).find("i:not(.fa)").attr("class", "ion-android-lock"), c.pushNotification({
                    type: "success",
                    message: "Published design!"
                })) : ($(a.currentTarget).removeClass("lock").addClass("unlock").attr("title", "Publish").tooltip("fixTitle").tooltip("show"), $(a.currentTarget).find("i:not(.fa)").attr("class", "ion-android-unlock"), c.pushNotification({
                    type: "success",
                    message: "Unpublished design!"
                }))
            },
            error: function(b, d) {
                c.finishRenderDesign(a), c.$("#modal-rendering .btn_ok").trigger("click");
                var e = $(a.currentTarget).attr("data-original-title");
                $(a.currentTarget).removeClass("loading").attr("title", d.responseJSON.msg).tooltip("fixTitle").tooltip("show"), setTimeout(function() {
                    $(a.currentTarget).attr("title", e).tooltip("fixTitle").tooltip("show")
                }, 3e3)
            }
        })
    },
    submitDesign: function(a) {
        var b = this;
        if ($(a.currentTarget).hasClass("loading")) return a.preventDefault(), a.stopPropagation(), !1;
        if ("function" == typeof b.isBlankDesign && b.isBlankDesign()) {
            a.preventDefault(), a.stopPropagation();
            var c = $(a.currentTarget).attr("data-original-title");
            return $(a.currentTarget).attr("title", "You can only submit an edited design.").tooltip("fixTitle").tooltip("show"), setTimeout(function() {
                $(a.currentTarget).attr("title", c).tooltip("fixTitle").tooltip("show")
            }, 3e3), !1
        }
        $(a.currentTarget).addClass("loading"), b.collection.document.toSubmitDocument(), b.collection.document.save({}, {
            wait: !0,
            patch: !0,
            success: function(c, d) {
                $(a.currentTarget).removeClass("loading"), b.pushNotification({
                    color: "clblue",
                    message: "Submitted your design. System will go back to Discover after 3 seconds..."
                }), setTimeout(function() {
                    window.location.href = $(a.currentTarget).data("backurl")
                }, 3e3)
            },
            error: function(b, c) {
                var d = $(a.currentTarget).attr("data-original-title");
                $(a.currentTarget).removeClass("loading").attr("title", c.responseJSON.msg).tooltip("fixTitle").tooltip("show"), setTimeout(function() {
                    $(a.currentTarget).attr("title", d).tooltip("fixTitle").tooltip("show")
                }, 3e3)
            }
        })
    },
    toggleResizeBox: function(a) {
        var b = this;
        b.$("#modal-resize").modal("show")
    },
    toggleHelpDesignBox: function(a) {
        a.preventDefault();
        var b = this;
        b.$(".box_help").addClass("hidden"), b.$(".box_help_two").removeClass("hidden").find("textarea").focus().autosize({
            callback: function() {
                b.$(".box_help_two").offset().top < 65 && b.$(".box_help_two textarea").css("max-height", b.$(".box_help_two textarea").height())
            }
        }), b.$(".help_design_bottom").addClass("disabled")
    },
    closeHelpDesignBox: function(a) {
        a.preventDefault();
        var b = this;
        b.$(".box_help").addClass("hidden"), b.$(".help_design_bottom").removeClass("disabled"), b.$(".box_help_two input, .box_help_two textarea").val("")
    },
    triggerSubmitHelpDesign: function(a) {
        a.preventDefault();
        var b = this,
            c = new DB.Faq,
            d = b.$('.box_help_two textarea[name="description"]').val();
        return "" == d ? (alert("Please describe your desire."), !1) : (b.$(".box_help_two .send_mess").addClass("disabled"), c.toSubmitIssue(), c.save({}, {
            data: {
                subject: subject,
                description: d
            },
            success: function(a, c) {
                alert(c.msg), b.$('.box_help_two input[name="subject"]').val(""), b.$('.box_help_two textarea[name="description"]').val(""), b.$(".box_help_two .send_mess").removeClass("disabled")
            },
            error: function(a, c) {
                alert(c.responseJSON.msg), b.$(".box_help_two .send_mess").removeClass("disabled")
            }
        }), c.resetUrl(), void 0)
    },
    toggleDesignTip: function() {
        var a = this;
        a.$("#modal-tip").modal("show");
        var b = a.$("#modal-tip .share-content img[data-src]");
        a.$("#modal-tip").on("shown.bs.modal", function() {
            0 == b.length ? (a.$("#modal-tip .loading-tip").addClass("hidden"), a.$("#modal-tip .share-content").removeClass("hidden")) : b.each(function(b) {
                var c = $(this);
                c.attr("src", c.data("src")).removeAttr("data-src").on("load", function() {
                    a.$("#modal-tip .loading-tip").addClass("hidden"), a.$("#modal-tip .share-content").removeClass("hidden")
                })
            })
        })
    }
});
var DB = DB || {};
DB.DesignRouter = Backbone.Router.extend({
    routes: {
        download: "download"
    },
    initialize: function(a) {
        var b = this;
        return "undefined" == typeof a.doc_id ? void console.warn("Missing document ID") : (b.doc_id = a.doc_id, b.doc_type = a.doc_type || "", b.document = new DB.Document({
            _id: b.doc_id,
            doctype: b.doc_type
        }), "null" !== a.doc_data && b.document.set(jQuery.parseJSON(a.doc_data)), b.layouts = new DB.Medias, b.layouts.toFetchLayouts(), b.backgrounds = new DB.Medias, b.backgrounds.toFetchBackgrounds(), b.texts = new DB.Medias, b.texts.toFetchTexts(), b.elements = new DB.Medias, b.searches = new DB.Medias, b.uploads = new DB.Medias, b.uploads.toFetchUploads(), b.recents = new DB.Medias, b.recents.toFetchRecents(), b.user_id = a.user_id, b.user = new DB.User({
            _id: b.user_id
        }), b.labels = new DB.UserLabels, b.labels.toFetchUserLabels(b.user_id), b.designs = new DB.Documents, b.designs.toFetchUserDocument(b.user_id), _.isUndefined(a.palettes) ? b.palettes = {} : b.palettes = JSON.parse(a.palettes), _.isUndefined(a.recent_media) ? b.recent_media = {} : b.recent_media = JSON.parse(a.recent_media), b.designView = new DB.DesignView({
            collection: {
                document: b.document,
                layouts: b.layouts,
                texts: b.texts,
                backgrounds: b.backgrounds,
                elements: b.elements,
                searches: b.searches,
                uploads: b.uploads,
                palettes: b.palettes,
                recents: b.recents,
                user: b.user,
                labels: b.labels,
                designs: b.designs
            },
            recent_media: b.recent_media
        }), b.designView.loadLayouts(), void 0)
    },
    download: function() {
        $('#design-wrap .content_option .btn_toggle_right_box[data-target="download"]').trigger("click")
    }
}), DB.listFont = [{
    family: "Abril Fatface",
    language: ["en", "es-ES"],
    normalDisplay: "https://cdn.designbold.com/fonts/images/fonts/abril-fatface.png",
    doubleDisplay: "https://cdn.designbold.com/fonts/images/fonts/abril-fatface2x.png",
    urlFontName: "https://cdn.designbold.com/fonts/webfonts/abrilfatface.css",
    fontsName: "AbrilFatface-Regular",
    config: {
        italic: !1,
        bold: !1,
        both: !1
    },
    truetypeFont: {
        normafontName: "https://cdn.designbold.com/fonts/truetypefonts/abrilfatface-regular.ttf"
    },
    details: {
        normafontName: {
            truetypeFont: "https://cdn.designbold.com/fonts/truetypefonts/abrilfatface-regular.ttf",
            fontName: "AbrilFatface-Regular",
            webFont: "https://cdn.designbold.com/fonts/webfonts/abrilfatface-regular.woff"
        }
    }
}, 
}];