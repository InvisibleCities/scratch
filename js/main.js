/* jshint undef: true, unused: true, white: false */
/* global brightcove, $, console */
//I put my global variables in an object.
//You can change the object name by doing find replace on "mpax" to nameYouLike
var mpax = {};
(function(e) {
    e.scroll_int = "";
    e.resize_int = "";
    e.BCParams = {
        vidplayerID: "2659807247001",
        vidPlayerKey: "AQ~~,AAABHwsiyPk~,XuUJxHo3rJ0_jUdx8GH0BdnkvB8syiAb",
        audioplayerID: "1684416322001",
        audioPlayerKey: "AQ~~,AAABHwsiyPk~,XuUJxHo3rJ00DT7TdluT-Ql7vGbfAS6_",
        width: "1200",
        height: "720",
        webServiceUrl: "//www.seic.com/brightcoveWS/BrightcoveService.svc",
        sadminUrl: "https://sadmin.brightcove.com/js/BrightcoveExperiences_all.js",
        adminUrl: "http://admin.brightcove.com/js/BrightcoveExperiences_all.js",
        is_https: !1
    };
    e.verbiage = {
        playlistEmpty: "The playlist you requested is empty.",
        playlistError: "There was an error retrieving your playlist."
    };
    e.BCParams.playerID = e.BCParams.vidplayerID;
    e.BCParams.playerKey = e.BCParams.vidPlayerKey;
    e.BCEmbeded = [];
    e.BCPlaylistPlayers = [];
    e.BCL = {};
    e.BCL.playerData = mpax.BCParams;
    e.img_defaults = {
        missing: "img/img-missing.gif",
        empty: "img/empty.gif"
    }
})(mpax);
(function() {
    "use strict";

    function e(e) {
        var t = document.createElement("a");
        t.href = e;
        return {
            source: e,
            protocol: t.protocol.replace(":", ""),
            host: t.hostname,
            port: t.port,
            query: t.search,
            params: function() {
                var e = {},
                    n = t.search.replace(/^\?/, "").split("&"),
                    r = n.length,
                    i = 0,
                    s;
                for (; i < r; i++) {
                    if (!n[i]) continue;
                    s = n[i].split("=");
                    e[s[0]] = s[1]
                }
                return e
            }(),
            file: (t.pathname.match(/\/([^\/?#]+)$/i) || [, ""])[1],
            hash: t.hash.replace("#", ""),
            path: t.pathname.replace(/^([^\/])/, "/$1"),
            relative: (t.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ""])[1],
            segments: t.pathname.replace(/^\//, "").split("/")
        }
    }

    function t(e) {
        var t = $(e.currentTarget);
        console.warn("IMAGE LOAD ERROR");
        console.warn(t.attr("src"));
        if (!t.attr("src") || t.attr("src") === mpax.img_defaults.empty || t.attr("src") === "undefined") return;
        t.off("error.img_load_error");
        t.attr("src", mpax.img_defaults.missing)
    }

    function n(e) {
        var t = $(e.currentTarget);
        t.removeClass("fade-out").addClass("fade-in")
    }

    function r(e) {
        var r = s(e);
        r.off("load.fadein").on("load.fadein", n).off("error.img_load_error").on("error.img_load_error", t)
    }

    function i(e, t, n) {
        var r = e.filter(function(e) {
            return e[t] === n
        }) || [];
        return r
    }

    function s(e) {
        if (e instanceof jQuery) return e;
        if (typeof e != "object") {
            console.warn(" a non object was passed to is_jquery_obj ");
            return e
        }
        return $(e)
    }

    function o(e) {
        e instanceof jQuery && (e = e[0]);
        var t = e.getBoundingClientRect(),
            n = Math.ceil(t.top),
            r = Math.ceil(t.bottom);
        return n > 0 && r > 0 ? !0 : !1
    }

    function u(e) {
        var t = i(mpax.BCEmbeded, "playerSelector", e) || [],
            n = mpax.BCPlaylistPlayers,
            r = !1,
            s, o;
        if (t.length !== 1) {
            e = parseFloat(e.split("myExperience").join(""));
            for (var u = 0; u < n.length; u++) {
                s = n[u];
                o = s.videos;
                o.indexOf(parseFloat(e)) > -1 && t.push(s)
            }
        }
        if (t.length !== 1) {
            if (t.length < 1) {
                console.warn("A dataholder was not found. No objects in mpax.BCEmbeded had prop playerSelector set to " + e);
                return r
            }
            t.length > 1 && console.warn("More then 1 object was found in mpax.BCEmbeded with a prop of playerSelector set to " + e + ". Returning to first object")
        }
        r = t[0];
        return r
    }

    function a(e) {
        brightcove || console.warn("brightcove is not defined. Make sure http://admin.brightcove.com/js/BrightcoveExperiences_all.js is included ");
        if (!e) {
            console.warn("In return_experience_from_id - An id must be passed as an arguement to this function.");
            return !1
        }
        var t = !1,
            n = u(e);
        if (n.playerType === "FLASH") {
            t = brightcove.getExperience(e);
            return t
        }
        if (n.playerType === "HTML") {
            t = brightcove.api.getExperience(e);
            return t
        }
        t = brightcove.getExperience(e) || brightcove.api.getExperience(e);
        return t
    }

    function f(e) {
        if (!e) {
            console.warn("return_player_from_id - An id must be passed as an arguement to this function.");
            return !1
        }
        var t = a(e),
            n = brightcove.api.modules.APIModules,
            r = t.getModule(n.VIDEO_PLAYER);
        return r
    }

    function l(e) {
        var t = !1,
            n = mpax.BCL;
        if (n.playerType === "HTML") try {
            t = e.target.experience.id
        } catch (r) {
            t = !1
        }
        t || (t = n.lastLoadedPlayerId || !1);
        return t
    }

    function c(e) {
        var t = s(e),
            n = {},
            r = 486,
            i = 25,
            o, u;
        t.css({
            height: "",
            width: ""
        });
        t.find(".play-mod").css({
            height: "",
            width: ""
        });
        o = Math.floor(t.width());
        if (t.hasClass("podcast")) {
            n.h = i - 1;
            n.w = r - 1;
            return n
        }
        n.w = o - 1;
        n.w >= 1024 && (n.w = 1024);
        u = n.w / 16;
        n.h = Math.ceil(u * 9);
        if (!t.hasClass("BC-embed-playlist")) return n;
        if (n.w > 550) {
            t.removeClass("force-list-bottom");
            if (t.hasClass("previously-panel-bottom") || t.hasClass("panel-bottom")) {
                t.removeClass("previously-panel-bottom").addClass("panel-bottom");
                return n
            }
            n.h = Math.ceil(n.h * .6);
            n.w = Math.ceil(n.w * .6);
            return n
        }
        t.addClass("force-list-bottom");
        if (t.hasClass("panel-bottom")) {
            t.find(".panel-contents-wrap, .panel-contents-mask").removeAttr("style");
            t.removeClass("panel-bottom").addClass("previously-panel-bottom")
        }
        return n
    }

    function h(e, t) {
        var n = brightcove.api.modules.APIModules,
            r = e.getModule(n.EXPERIENCE),
            i = s(t),
            o = c(i),
            u = o.w,
            a = o.h;
        r.setSize(u, a);
        i.find(".spinner").remove()
    }

    function p(e, t, n, r) {
        if (!e || e.length < 1) {
            console.warn("A dataholder was not passed as an argument to the scale_player function. ");
            return !1
        }
        var i = s(e.wrapper),
            o = i.find(".play-mod"),
            u = e.playerSelector || "myExperience" + e.id,
            f = a(u);
        if (e.playerType === "HTML") {
            t.css({
                height: r,
                width: n
            });
            i.css({
                "min-height": r,
                width: n
            });
            o.css({
                height: r,
                width: n
            });
            h(f, i)
        } else t.animate({
            height: r,
            width: n
        }, 250)
    }

    function d(e) {
        if (e.length < 1) return;
        for (var t = 0; t < e.length; t++) {
            var n = e[t].wrapper,
                r = $(n).find("object, video, iframe"),
                i = c(n),
                s = $(n).closest(".BC-embed-playlist"),
                o = i.w,
                u = i.h,
                a;
            p(e[t], r, o, u);
            if (s.length > 0) {
                a = s.find(".thumb-panel");
                a.removeClass("hide-me");
                C(a)
            }
        }
    }

    function v() {
        clearInterval(mpax.resize_int);
        var e = mpax.BCEmbeded;
        d(e)
    }

    function m() {
        clearTimeout(mpax.scroll_int)
    }

    function g() {
        clearTimeout(mpax.scroll_int);
        mpax.scroll_int = setTimeout(m, 150)
    }

    function y() {
        clearTimeout(mpax.resize_int);
        mpax.resize_int = setTimeout(v, 150)
    }

    function b(e) {
        if (!e) {
            console.warn("In embed_videos - The players argument must be defined. Exiting embed function. ");
            return !1
        }
        if (typeof e != "object") {
            console.warn("In embed_videos - embed_videos expected the players argument to be an object. Exiting embed function.");
            return !1
        }
        var t = s(e),
            n, r;
        mpax.BCEmbeded = [];
        for (var i = 0; i < t.length; i++) {
            r = t[i];
            n = w(r);
            mpax.BCEmbeded.push(n);
            mpax.BCL.addPlayer(n)
        }
    }

    function w(e) {
        if (typeof e != "object") {
            console.warn("In return_player_params_from_dom_el - argument dom_el needs to be an object. It was either not defined or a not an object.");
            return !1
        }
        var t = s(e),
            n = c(t),
            r = n.w,
            i = n.h,
            o = t.attr("data-vid") || !1,
            u = t.attr("data-playlist-id") || !1,
            a = t.attr("data-playlist-arr") || !1,
            f = mpax.BCParams.vidplayerID,
            l = mpax.BCParams.vidPlayerKey,
            h = "video",
            p = !1,
            d;
        o && (p = "myExperience" + o);
        if (u) {
            t.attr("data-type", "video");
            t.is("[data-disp-style]") || t.attr("data-disp-style", "panel-bottom");
            t.is("[data-thumbnails]") || t.attr("data-thumbnails", "");
            t.addClass(t.attr("data-disp-style")).addClass(t.attr("data-thumbnails"))
        }
        if (t.is("[data-type]")) {
            h = t.attr("data-type").toLowerCase();
            if (h === "podcast") {
                f = mpax.BCParams.audioplayerID;
                l = mpax.BCParams.audioPlayerKey;
                h = "podcast"
            }
        }
        if (t.is("[data-pid]"))
            if (!t.is("[data-pkey]")) console.warn("video " + o + " had a player id set to override the default player id, but a player key was not set. To override the default both values must be set. The default player id and key will be used. ");
            else {
                f = t.attr("data-pid");
                l = t.attr("data-pkey")
            }
        d = {
            id: o,
            playlistid: u,
            playlistarr: a,
            playerSelector: p,
            pid: f,
            pkey: l,
            type: h,
            wrapper: t[0],
            showloading: !0,
            playerData: {
                templateLoaded: !1,
                isPlaying: !1,
                playerType: !1,
                width: r,
                height: i
            }
        };
        return d
    }

    function E(e) {
        var t = $(e.wrapper),
            n = e.lastloaded || e.id,
            r = n.split("myExperience").join(""),
            i, s;
        if (!t.hasClass("BC-embed-playlist")) return !1;
        i = t.find(".thumb-panel");
        s = i.find('.thumb-panel-item[data-vid="' + r + '"]') || !1;
        return s
    }

    function S(e) {
        var t = e.find(".panel-contents-mask"),
            n = e.find(".panel-contents-wrap"),
            r = n.find(".active"),
            i = t.width(),
            s = n.width(),
            o = n.position().left,
            u = r.width(),
            a = r.position().left,
            f = {
                maskW: i,
                panelW: s,
                panelX: o,
                maxX: 20,
                minX: i - (s + 40),
                thumbW: u,
                thumbX: a,
                thumb_center: a + u / 2
            };
        return f
    }

    function x(e, t) {
        var n = s(e),
            r = t.final_pos,
            i = n.closest(".BC-embed-playlist"),
            o = i.find(".advance-btn"),
            u = i.find(".retract-btn");
        if (r <= t.minX) {
            o.addClass("disabled");
            r = t.minX
        } else o.removeClass("disabled"); if (r >= t.maxX) {
            u.addClass("disabled");
            r = t.maxX
        } else u.removeClass("disabled");
        n.animate({
            left: r
        }, 300)
    }

    function T(e) {
        var t = e.currentTarget,
            n = $(t),
            r = n.closest(".thumb-panel"),
            i = r.find(".panel-contents-wrap"),
            s = S(r),
            o = s.panelX,
            u = s.thumbW;
        n.hasClass("retract-btn") ? s.final_pos = o + u : s.final_pos = o - u;
        x(i, s)
    }

    function N(e) {
        var t = S(e),
            n = t.maskW / 2 - t.thumb_center,
            r = e.find(".panel-contents-wrap");
        if (t.maskW > t.panelW) return;
        t.final_pos = n;
        x(r, t)
    }

    function C(e) {
        var t = s(e),
            n = t.closest(".BC-embed-playlist");
        if (n.hasClass("force-list-bottom")) {
            n.find(".panel-contents-wrap, .panel-contents-mask").removeAttr("style");
            return
        }
        if (!n.hasClass("panel-bottom")) return;
        var r = t.find(".retract-btn"),
            i = t.find(".advance-btn"),
            o = t.find(".panel-contents-mask"),
            u = o.find(".panel-contents-wrap"),
            a = u.find(".thumb-panel-item"),
            f = t.width(),
            l = $(a[0]).width() + 10,
            c = l * a.length + 30;
        o.css({
            position: "relative"
        });
        u.css({
            width: c,
            position: "absolute"
        });
        if (c > f) {
            r.removeClass("hide-me");
            i.removeClass("hide-me");
            o.css({
                width: f - i.width() * 2
            })
        } else {
            r.addClass("hide-me");
            i.addClass("hide-me");
            o.css({
                width: "auto",
                display: "block"
            })
        }
        var h = o.width();
        if (c < h) {
            u.removeAttr("style");
            return
        }
        N(t)
    }

    function k(e) {
        var t = s(e),
            n = t.find(".play-mod");
        if (o(n)) return;
        var r = t.position(),
            i = Math.floor(r.top) - 10;
        $("html, body").stop().animate({
            scrollTop: i
        }, "250")
    }

    function L(e) {
        var t = e.currentTarget,
            n = $(t),
            r = n.hasClass("playing"),
            s = n.hasClass("paused"),
            o = n.closest(".thumb-panel"),
            u = o.find(".thumb-panel-item"),
            a = t.getAttribute("data-playlistid"),
            f = t.getAttribute("data-vid"),
            l = i(mpax.BCPlaylistPlayers, "playlistid", a) || [],
            c = brightcove.api.modules.APIModules,
            h, p, d;
        if (l.length !== 1) {
            l.length < 1 && console.warn("Could not locate a playlist player for the video clicked");
            l.length > 1 && console.warn("More then 1 playlist player found for the video clicked. Defaulting to the first one.")
        }
        h = l[0];
        var v = h.playerSelector || "myExperience" + h.id;
        h.lastloaded = f;
        if (h.playerType === "FLASH") {
            p = brightcove.getExperience(v);
            d = p.getModule(c.VIDEO_PLAYER)
        }
        if (h.playerType === "HTML") {
            p = brightcove.api.getExperience(v);
            d = p.getModule(c.VIDEO_PLAYER)
        }
        u.removeClass("active paused playing");
        if (r) {
            d.pause(!0);
            k(h.wrapper);
            return
        }
        if (s) {
            d.play();
            return
        }
        n.addClass("active playing");
        h.playerType === "FLASH" && d.loadVideo(f);
        h.playerType === "HTML" && d.loadVideoByID(f);
        k(h.wrapper);
        N(o)
    }

    function A(e, t) {
        $(t).find(".thumb-panel").remove();
        var n = s(t),
            i = e.playlist.videos,
            o = document.createElement("div"),
            u = "<div class='retract-btn'><i class='fa fa-chevron-left'></i></div>",
            a = "<div class='advance-btn'><i class='fa fa-chevron-right'></i></div>",
            f = "<div class='panel-contents-mask'><ul class='list panel-contents-wrap'></ul></div>",
            l = "<li class='thumb-panel-item' ><div class='thumb'><img class='fade-out'/></div><div class='txt-wrap'><span class='title'> </span><span class='description'></div></span></li>";
        o.setAttribute("class", "thumb-panel hide-me");
        o.innerHTML = u + a + f;
        var c = $(o).find(".panel-contents-wrap");
        for (var h = 0; h < i.length; h++) {
            c.append(l);
            var p = i[h],
                d = c.find(".thumb-panel-item:last"),
                v = d.find(".thumb"),
                m = v.find("img"),
                g = d.find(".title"),
                y = d.find(".description");
            d.attr({
                "data-vid": p.id,
                "data-playlistid": e.playlist.id
            });
            r(m);
            m.attr({
                src: p.thumbnailURL,
                alt: p.name
            });
            g.html(p.name);
            y.html(p.shortDescription);
            h === 0 && d.addClass("active")
        }
        n.append(o).on("click", ".thumb-panel-item", L);
        C(o);
        $(t).on("click.advance_retract_panel", ".advance-btn, .retract-btn", T);
        /*var options = {
            listId : ".panel-contents-wrap",
            liEquiv : ".thumb-panel-item",
            searchInput : ".search",
            listKey1 : ".title",
	        listKey2 : ".description",
	        sortButtonKey1 : ".sort",
	        sortButtonKey2 : ".sort-right",
	        itemsPerPage : 6
        };
        var videosList = new Lister(options);
        console.log("script worked in main");*/
    }

    function O(e) {
        var t = document.createElement("div"),
            n = document.createElement("p");
        n.setAttribute("class", "playlist-empty");
        t.appendChild("p");
        n.innerHTML(mpax.verbiage.playlistEmpty);
        e.put_here.appendChild(t)
    }

    function M() {
        var e = document.createElement("div"),
            t = document.createElement("p");
        t.setAttribute("class", "playlist-error");
        e.appendChild("p");
        t.innerHTML(mpax.verbiage.playlistEmpty)
    }

    function _(e) {
        var t = e.rtnData.playlist.videoIds,
            n = i(mpax.BCPlaylistPlayers, "wrapper", e.put_here)[0];
        n.id = t[0].toString();
        n.lastloaded = n.id;
        n.videos = t;
        n.playlistid = e.playlistid;
        mpax.BCEmbeded.push(n);
        mpax.BCL.addPlayer(n);
        A(e.rtnData, e.put_here)
    }

    function D(e) {
        if (!mpax.BCParams.webServiceUrl) {
            console.warn("In return_playlist_req_obj - A webServiceUrl must be defined in global object mpax.BCParams to retrieve a playlist.");
            return !1
        }
        var t = mpax.BCParams.webServiceUrl,
            n = "GetPlaylistById",
            r = e.playlistid,
            i = e.playlistarr,
            s = ["id", "name", "shortDescription", "thumbnailURL", "videoStillURL", "lastModifiedDate", "publishedDate", "playsTotal", "length"],
            o;
        o = {
            url: t + "/" + n + "?",
            playlistid: r,
            playlistarr: i,
            put_here: e.wrapper,
            handlers: {
                onError: M,
                onEmpty: O,
                onComplete: _
            },
            json: {
                id: r,
                video_fields: s.toString()
            }
        };
        return o
    }

    function P(e) {
        var t = e;
        t.rtnData = {
            result: !1
        };
        $.ajax({
            type: "GET",
            url: e.url,
            dataType: "jsonp",
            data: t.json,
            error: function(e) {
                t.lastStatus = e.status + " : " + e.statusText;
                t.rtnData = e;
                t.handlers.onError(t)
            },
            complete: function(e) {
                e = JSON.parse(e.responseJSON);
                t.rtnData = e;
                if (!e.result) {
                    t.handlers.onError(t);
                    return !1
                }
                if (e.playlist.videoIds.length < 1) {
                    t.handlers.onEmpty(t);
                    return !1
                }
                t.handlers.onComplete(t)
            }
        })
    }

    function H(e) {
        if (!e) {
            console.warn("In embed_playlist_players - The players argument must be defined. Exiting embed function. ");
            return !1
        }
        if (typeof e != "object") {
            console.warn("In embed_playlist_players - embed_playlist_players expected the players argument to be an object. Exiting embed function.");
            return !1
        }
        var t = s(e),
            n, r;
        for (r = 0; r < t.length; r++) {
            var i = t[r],
                o = w(i),
                u = D(o);
            mpax.BCPlaylistPlayers.push(o);
            o.showloading && (n = {
                parent: o.wrapper
            });
            P(u)
        }
    }

    function B() {
        console.log("Brightcove loaded");
        b($(".BC-embed"));
        setTimeout(function() {
            H($(".BC-embed-playlist"))
        }, 1e3);
        setTimeout(function() {
            if (window.addEventListener) {
                window.addEventListener("scroll", g, !1);
                window.addEventListener("resize", y, !1);
                window.addEventListener("orientationchange", y, !1)
            } else if (window.attachEvent) {
                window.attachEvent("scroll", g);
                window.attachEvent("resize", y)
            }
        }, 1e3)
    }
    mpax.BCL.addPlayer = function(e) {
        var t = e.wrapper,
            n = $(t),
            r = e.playerData.width,
            i = e.playerData.height,
            s = "",
            o = mpax.BCL.playerData,
            u, a = "";
        mpax.BCParams.is_https && (a = '<param name="secureConnections" value="true" /><param name="secureHTMLConnections" value="true" />');
        n.css({
            height: i,
            width: r
        });
        e.pid === mpax.BCL.playerData.audioplayerID ? n.addClass("podcast").removeAttr("style") : n.attr("data-type") !== "podcast" && n.removeClass("podcast").removeAttr("style");
        o.videoID = e.id;
        o.playerID = e.pid;
        o.playerKey = e.pkey;
        o.width = e.playerData.width;
        o.height = e.playerData.height;
        mpax.BCL.playerTemplate = '<div class=\'play-mod\'><div style="display:none"></div><object id="myExperience' + e.id + '" class="BrightcoveExperience myExperience' + e.id + '">' + a + '<param name="includeAPI" value="true" /><param name=\'htmlFallback\' value=\'true\'><param name="bgcolor" value="#e1e1e1" /><param name="width" value="' + e.playerData.width + '" /><param name="height" value="' + e.playerData.height + '" /><param name="playerID" value="{{playerID}}" /><param name="playerKey" value="{{playerKey}}" /><param name="isVid" value="true" /><param name="isUI" value="true" /><param name="dynamicStreaming" value="true" /><param name="templateLoadHandler" value="mpax.BCL.onTemplateLoad"/><param name="templateReadyHandler" value="mpax.BCL.onTemplateReady"/> <param name="@videoPlayer" value="{{videoID}}"; /></object></div>';
        s = mpax.BCL.markup(mpax.BCL.playerTemplate, mpax.BCL.playerData);
        n.prepend(s);
        e.showloading && (u = {
            parent: t
        });
        brightcove.createExperiences()
    };
    mpax.BCL.markup = function(e, t) {
        var n, r = 0,
            i = e.match(t instanceof Array ? /{{\d+}}/g : /{{\w+}}/g) || [];
        while (n = i[r++]) e = e.replace(n, t[n.substr(2, n.length - 4)]);
        return e
    };
    mpax.BCL.onTemplateLoad = function(e) {
        function f(t) {
            t === !0 && mpax.BCL.onTemplateReady(!1, e)
        }
        var t = mpax.BCL,
            n = t.exp = a(e),
            r = t.playerType = n.type.toUpperCase(),
            i = t.APIModules = brightcove.api.modules.APIModules,
            s = n.getModule(i.EXPERIENCE),
            o = u(e);
        o.playerType = r;
        o.templateLoaded = !0;
        s.getReady(f);
        t.lastLoadedPlayerId = e;
        typeof myTemplateLoaded == "function" ? myTemplateLoaded() : console.warn("myTemplateLoaded is not a function ")
    };
    mpax.BCL.onTemplateReady = function(e, t) {
        function f(e) {
            p(e, o)
        }

        function c(e) {
            v(e, o)
        }

        function h(e) {
            v(e, o)
        }

        function p(e, n) {
            n.callback ? t = n.callback.split("|||")[0] : t = e.target.experience.id;
            mpax.BCL.onVideoPlay(e, n, t)
        }

        function v(e, n) {
            n.callback ? t = n.callback.split("|||")[0] : t = e.target.experience.id;
            mpax.BCL.onVideoStop(e, n, t)
        }
        t || (t = l(e));
        var n = u(t),
            r = mpax.BCL,
            i = brightcove.api.modules.APIModules,
            s, o;
        s = a("myExperience" + n.id);
        o = s.getModule(i.VIDEO_PLAYER);
        r.videoPlayer = o;
        o.addEventListener(brightcove.api.events.MediaEvent.PLAY, f);
        o.addEventListener(brightcove.api.events.MediaEvent.CHANGE, h);
        o.addEventListener(brightcove.api.events.MediaEvent.STOP, c);
        d([n])
    };
    mpax.BCL.onVideoPlay = function(e, t, n) {
        var r = mpax.BCEmbeded,
            i, s, o, a, l;
        if (!n) try {
            n = e.target.experience.id
        } catch (c) {
            n = t.callback.split("|||")[0]
        }
        a = u(n);
        for (var h = 0; h < r.length; h++) {
            i = r[h];
            s = i.playerSelector || "myExperience" + i.id;
            if (r[h] !== a) {
                o = f(s);
                o.pause(!0)
            } else {
                l = E(i);
                l && l.removeClass("paused").addClass("active playing fade-out")
            }
        }
    };
    mpax.BCL.onVideoStop = function(e, t, n) {
        if (!n) try {
            n = e.target.experience.id
        } catch (r) {
            n = t.callback.split("|||")[0]
        }
        var i = u(n),
            s = $(i.wrapper),
            o;
        if (s.hasClass("BC-embed-playlist")) {
            o = E(i);
            o.removeClass("playing").addClass("active paused")
        }
    };
    $('[placeholder]').focus(function() { //this is a pre-html5 polyfill
        var input = $(this);
        if (input.val() == input.attr('placeholder')) {
        input.val('');
        input.removeClass('placeholder');
        }
        }).blur(function() {
        var input = $(this);
        if (input.val() == '' || input.val() == input.attr('placeholder')) {
        input.addClass('placeholder');
        input.val(input.attr('placeholder'));
    }}).blur();

    $(document).ready(function() {
        var t = e(window.location.href),
            n = mpax.BCParams.adminUrl,
            r = document.createElement("script");
        console.log(t.protocol);
        if (t.protocol === "https") {
            mpax.BCParams.is_https = !0;
            n = mpax.BCParams.sadminUrl
        }
        if (t.protocol === "https" && mpax.BCParams.webServiceUrl.indexOf("http") > 0) {
            mpax.BCParams.webServiceUrl = mpax.BCParams.webServiceUrl.split("https").join("");
            mpax.BCParams.webServiceUrl = mpax.BCParams.webServiceUrl.split("http").join("");
            mpax.BCParams.webServiceUrl = t.protocol + mpax.BCParams.webServiceUrl
        }
        console.log("Attempting to add load listener");
        if ("onload" in r) r.onload = B;
        else {
            r.setAttribute("type", "text/javascript");
            r.onreadystatechange = function() {
                var e = r.readyState;
                if (e === "loaded" || e === "complete") {
                    B();
                    r.onreadystatechange = null
                }
            }
        }
        r.src = n + "?version=" + Math.round(Math.random());
        document.body.appendChild(r)
    });
   })();
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


