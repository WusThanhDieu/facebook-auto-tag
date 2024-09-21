class Ws {
    static Alert(e, t) {
        let n = document.getElementById("notify");
        n.innerHTML = "";
        let o = document.createElement("div");
        o.classList.add("alert", e);
        let s = document.createElement("span");
        s.classList.add("alertClose"), s.innerHTML = "X", s.onclick = () => {
            n.innerHTML = "", n.style.display = "none"
        };
        let a = document.createElement("span");
        a.classList.add("alertText"), a.innerHTML = t + '<br class="clear"/>', o.appendChild(s), o.appendChild(a), n.appendChild(o), n.style.display = "block", setTimeout(() => {
            n.innerHTML = "", n.style.display = "none"
        }, 2550)
    }
}
const ws_start = document.getElementById("wt-button"),
    ws_pause = document.getElementById("wt-reset"),
    ws_info = document.getElementById("wt-info"),
    ws_content = document.getElementById("wt-content"),
    ws_fast = document.getElementById("fast");
let fast_mod = !1;
ws_fast.addEventListener("change", () => {
    fast_mod = ws_fast.checked
});
const SaveWsInfo = e => {
        chrome.storage.local.get(["ws-info"], t => {
            t["ws-info"] && t["ws-info"] === e ? (chrome.storage.local.remove("ws-info"), chrome.storage.local.set({
                "ws-info": e
            })) : chrome.storage.local.set({
                "ws-info": e
            })
        })
    },
    GetWsInfo = e => {
        chrome.storage.local.get(["ws-info"], t => {
            t["ws-info"] ? e(t["ws-info"]) : e(null)
        })
    },
    SaveWsContent = e => {
        chrome.storage.local.get(["ws-content"], t => {
            t["ws-content"] ? (chrome.storage.local.remove("ws-content"), chrome.storage.local.set({
                "ws-content": e
            })) : chrome.storage.local.set({
                "ws-content": e
            })
        })
    },
    GetWsContent = e => {
        chrome.storage.local.get(["ws-content"], t => {
            t["ws-content"] ? e(t["ws-content"]) : e(null)
        })
    };

function Cookies() {
    document.cookie.split(";").forEach((function(e) {
        document.cookie = e.replace(/^ +/, "").replace(/=.*/, "=;expires=" + (new Date).toUTCString() + ";path=/")
    }))
}
ws_start.addEventListener("click", () => {
    chrome.tabs.query({
        active: !0,
        currentWindow: !0
    }, e => {
        const t = e[0].url;
        var n, o;
        if (/^https:\/\/www\.facebook\.com\/messages\/t\/.+$/.test(t)) {
            const t = ws_info.value.trim(),
                s = ws_content.value.trim();
            if ("" === t) return void alert("Thông tin không được để trống!");
            if (!/^\d+\|.+$/.test(t)) return void alert("Thông tin phải là định dạng: uid|fullname");
            if (s.length > 300) return void alert("Nội dung quá dài! Nội dung không được vượt quá 300 ký tự.");
            const [a, c] = t.split("|"), r = s.split(",").map(e => e.trim()).filter(e => e);
            Tag = !0, o = t, chrome.storage.local.get(["ws-info"], e => {
                e["ws-info"] && e["ws-info"] === o ? (chrome.storage.local.remove("ws-info"), chrome.storage.local.set({
                    "ws-info": o
                })) : chrome.storage.local.set({
                    "ws-info": o
                })
            }), n = s, chrome.storage.local.get(["ws-content"], e => {
                e["ws-content"] ? (chrome.storage.local.remove("ws-content"), chrome.storage.local.set({
                    "ws-content": n
                })) : chrome.storage.local.set({
                    "ws-content": n
                })
            }), Cookies(), Loop(a, c, r.length > 0 ? r : [""], e[0].id)
        } else alert("Hãy đến trang https://www.facebook.com/messages/t/id_group để sử dụng tools.")
    })
});
const Loop = async (e, t, n, o) => {
    let s = 0;
    for (; Tag;) {
        s >= n.length && (s = 0), await chrome.scripting.executeScript({
            target: {
                tabId: o
            },
            func: (e, t, n) => (async (e, t, n) => {
                let o = t,
                    s = e,
                    a = document.querySelector('div[contenteditable="true"][role="textbox"][aria-label="Tin nhắn"]');
                if (a) {
                    function c(e) {
                        let t = new InputEvent("input", {
                            inputType: "insertText",
                            data: e,
                            bubbles: !0,
                            cancelable: !0
                        });
                        a.dispatchEvent(t), (a.firstChild || a.appendChild(document.createElement("p"))).textContent += e
                    }
                    a.focus(), a.innerHTML = "", c("@" + o), await new Promise(e => setTimeout(e, 70));
                    let e = document.querySelector(`li[id="${s} name"] > div[role="presentation"]`);
                    if (e) {
                        e.click(), await new Promise(e => setTimeout(e, 70)), n && n.trim() && (c(" " + n), await new Promise(e => setTimeout(e, 70)));
                        let t = new KeyboardEvent("keydown", {
                            bubbles: !0,
                            cancelable: !0,
                            key: "Enter",
                            keyCode: 13
                        });
                        return a.dispatchEvent(t), !0
                    }
                    return alert("Error code: 0x0000001"), !1
                }
                return alert("Error code: 0x0000002"), !1
            })(e, t, n),
            args: [e, t, n[s]]
        }).catch(e => (console.error("Error: ", e), [!1])), s++;
        const a = fast_mod ? 10 : 1500;
        await new Promise(e => setTimeout(e, a))
    }
};
ws_pause.addEventListener("click", () => {
    Tag = !1, Ws.Alert("success", "Dừng auto tag thành công!")
}), chrome.runtime.onMessage.addListener((e, t, n) => {
    "notify" === e.type && alert(e.message)
}), GetWsContent(e => {
    e && (ws_content.value = e)
}), GetWsInfo(e => {
    e && (ws_info.value = e)
});
