if (!window.dhtmlx) {
    window.dhtmlx = {};
}(function() {
    var j = null;

    function l(q, o) {
        var p = q.callback;
        k(false);
        q.box.parentNode.removeChild(q.box);
        j = q.box = null;
        if (p) {
            p(o);
        }
    }

    function a(p) {
        if (j) {
            p = p || event;
            var o = p.which || event.keyCode;
            if (dhtmlx.message.keyboard) {
                if (o == 13 || o == 32) {
                    l(j, true);
                }
                if (o == 27) {
                    l(j, false);
                }
            }
            if (p.preventDefault) {
                p.preventDefault();
            }
            return !(p.cancelBubble = true);
        }
    }
    if (document.attachEvent) {
        document.attachEvent("onkeydown", a);
    } else {
        document.addEventListener("keydown", a, true);
    }

    function k(p) {
        if (!k.cover) {
            k.cover = document.createElement("DIV");
            k.cover.onkeydown = a;
            k.cover.className = "dhx_modal_cover";
            document.body.appendChild(k.cover);
        }
        var o = document.body.scrollHeight;
        k.cover.style.display = p ? "inline-block" : "none";
    }

    function f(p, o) {
        return "<div class='dhtmlx_popup_button' result='" + o + "' ><div>" + p + "</div></div>";
    }

    function c(p) {
        if (!m.area) {
            m.area = document.createElement("DIV");
            m.area.className = "dhtmlx_message_area";
            m.area.style[m.position] = "5px";
            document.body.appendChild(m.area);
        }
        m.hide(p.id);
        var o = document.createElement("DIV");
        o.innerHTML = "<div>" + p.text + "</div>";
        o.className = "dhtmlx-info dhtmlx-" + p.type;
        o.onclick = function() {
            m.hide(p.id);
            p = null;
        };
        /* 추가 수정 Start */
        o.onmouseover = function() {
            clearInterval(m.timers[p.id]);
        };
        o.onmouseout = function() {
            if (p != null) {
                m.timers[p.id] = window.setTimeout(function() {
                    m.hide(p.id);
                }, p.expire);
            }
        };
        /* 추가 수정 Start */
        if (m.position == "bottom" && m.area.firstChild) {
            m.area.insertBefore(o, m.area.firstChild);
        } else {
            m.area.appendChild(o);
        }
        if (p.expire > 0) {
            m.timers[p.id] = window.setTimeout(function() {
                m.hide(p.id);
            }, p.expire);
        }
        m.pull[p.id] = o;
        o = null;
        return p.id;
    }

    function g(p, r, u) {
        var t = document.createElement("DIV");
        t.className = " dhtmlx_modal_box dhtmlx-" + p.type;
        t.setAttribute("dhxbox", 1);
        var o = "";
        if (p.width) {
            t.style.width = p.width;
        }
        if (p.height) {
            t.style.height = p.height;
        }
        if (p.title) {
            o += '<div class="dhtmlx_popup_title">' + p.title + "</div>";
        }
        o += '<div class="dhtmlx_popup_text"><span>' + (p.content ? "" : p.text) + '</span></div><div  class="dhtmlx_popup_controls">';
        if (r) {
            o += f(p.ok || "확인", true);
        }
        if (u) {
            o += f(p.cancel || "취소", false);
        }
        if (p.buttons) {
            for (var q = 0; q < p.buttons.length; q++) {
                o += f(p.buttons[q], q);
            }
        }
        o += "</div>";
        t.innerHTML = o;
        if (p.content) {
            var s = p.content;
            if (typeof s == "string") {
                s = document.getElementById(s);
            }
            if (s.style.display == "none") {
                s.style.display = "";
            }
            t.childNodes[p.title ? 1 : 0].appendChild(s);
        }
        t.onclick = function(w) {
            w = w || event;
            var v = w.target || w.srcElement;
            if (!v.className) {
                v = v.parentNode;
            }
            if (v.className == "dhtmlx_popup_button") {
                result = v.getAttribute("result");
                result = (result == "true") || (result == "false" ? false : result);
                l(p, result);
            }
        };
        p.box = t;
        if (r || u) {
            j = p;
        }
        return t;
    }

    function n(p, q, s) {
        var r = p.tagName ? p : g(p, q, s);
        if (!p.hidden) {
            k(true);
        }
        document.body.appendChild(r);
        var o = Math.abs(Math.floor(((window.innerWidth || document.documentElement.offsetWidth) - r.offsetWidth) / 2));
        var t = Math.abs(Math.floor(((window.innerHeight || document.documentElement.offsetHeight) - r.offsetHeight) / 2));
        if (navigator.userAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null) {
            if (o == 8) {
                o = 339;
            }
        }
        if (p.position == "top") {
            r.style.top = "-3px";
        } else {
            r.style.top = t + "px";
        }
        r.style.left = o + "px";
        r.onkeydown = a;
        r.focus();
        if (p.hidden) {
            dhtmlx.modalbox.hide(r);
        }
        return r;
    }

    function i(o) {
        return n(o, true, false);
    }

    function b(o) {
        return n(o, true, true);
    }

    function e(o) {
        return n(o);
    }

    function h(p, o, q) {
        if (typeof p != "object") {
            if (typeof o == "function") {
                q = o;
                o = "";
            }
            p = {
                text: p,
                type: o,
                callback: q
            };
        }
        return p;
    }

    function d(q, p, o, r) {
        if (typeof q != "object") {
            q = {
                text: q,
                type: p,
                expire: o,
                id: r
            };
        }
        q.id = q.id || m.uid();
        q.expire = q.expire || m.expire;
        return q;
    }
    dhtmlx.alert = function() {
        text = h.apply(this, arguments);
        text.type = text.type || "confirm";
        return i(text);
    };
    dhtmlx.confirm = function() {
        text = h.apply(this, arguments);
        text.type = text.type || "alert";
        return b(text);
    };
    dhtmlx.modalbox = function() {
        text = h.apply(this, arguments);
        text.type = text.type || "alert";
        return e(text);
    };
    dhtmlx.modalbox.hide = function(o) {
        while (o && o.getAttribute && !o.getAttribute("dhxbox")) {
            o = o.parentNode;
        }
        if (o) {
            o.parentNode.removeChild(o);
            k(false);
        }
    };
    var m = dhtmlx.message = function(r, q, p, s) {
        r = d.apply(this, arguments);
        r.type = r.type || "info";
        var o = r.type.split("-")[0];
        switch (o) {
            case "alert":
                return i(r);
            case "confirm":
                return b(r);
            case "modalbox":
                return e(r);
            default:
                return c(r);
                break;
        }
    };
    m.seed = (new Date()).valueOf();
    m.uid = function() {
        return m.seed++;
    };
    m.expire = 4000;
    m.keyboard = true;
    m.position = "top";
    m.pull = {};
    m.timers = {};
    m.hideAll = function() {
        for (var o in m.pull) {
            m.hide(o);
        }
    };
    m.hide = function(p) {
        var o = m.pull[p];
        if (o && o.parentNode) {
            window.setTimeout(function() {
                o.parentNode.removeChild(o);
                o = null;
            }, 2000);
            o.className += " hidden";
            if (m.timers[p]) {
                window.clearTimeout(m.timers[p]);
            }
            delete m.pull[p];
        }
    };
})();