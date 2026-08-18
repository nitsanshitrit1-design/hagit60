(() => {
  "use strict";

  const SB = "https://fqoziqglyrcjttnuismx.supabase.co";
  const KEY = "sb_publishable_2Z_EWufBUdNlSvesyg2bmA_7obNjRsI";
  const COMMENTS = "journal_comments";
  const START = new Date("2026-08-17T00:00:00Z");

  let entriesByDay = new Map();
  let commentsByEntry = new Map();
  let observer = null;
  let journal = null;
  let queued = false;

  const esc = (v) =>
    String(v ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[c]);

  installStyles();
  installMobileCategories();
  startCommentBubbles();

  function installStyles() {
    if (document.getElementById("hagit-polish-v1")) return;

    const style = document.createElement("style");
    style.id = "hagit-polish-v1";

    style.textContent = `
      .hj-mobile-categories{
        display:none
      }

      .hj-comment-preview{
        position:absolute;
        z-index:5;
        top:14px;
        left:14px;
        max-width:min(310px,66%);
        padding:10px 12px 11px;
        border:1px solid rgba(255,255,255,.16);
        border-radius:16px 16px 16px 5px;
        background:rgba(9,6,13,.76);
        -webkit-backdrop-filter:blur(14px);
        backdrop-filter:blur(14px);
        box-shadow:0 12px 38px rgba(0,0,0,.28);
        text-align:right;
        direction:rtl;
        pointer-events:none;
      }

      .hj-comment-preview:after{
        content:"";
        position:absolute;
        left:12px;
        bottom:-6px;
        width:11px;
        height:11px;
        background:rgba(9,6,13,.76);
        border-right:1px solid rgba(255,255,255,.12);
        border-bottom:1px solid rgba(255,255,255,.12);
        transform:rotate(45deg);
      }

      .hj-comment-name{
        display:flex;
        align-items:center;
        gap:6px;
        margin-bottom:3px;
        color:#d7b5ff;
        font:600 10px/1.2 "Heebo",sans-serif;
      }

      .hj-comment-name:before{
        content:"💬";
        font-size:10px;
      }

      .hj-comment-text{
        display:-webkit-box;
        overflow:hidden;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2;
        color:#fff;
        font:400 13px/1.45 "Heebo",sans-serif;
        text-shadow:0 1px 8px rgba(0,0,0,.35);
      }

      .hj-comment-more{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        min-width:22px;
        height:22px;
        margin-top:7px;
        padding:0 7px;
        border-radius:999px;
        background:rgba(184,112,255,.17);
        border:1px solid rgba(210,164,255,.18);
        color:#e8d6f7;
        font:600 9px/1 "Montserrat",sans-serif;
      }

      .hj-card.hj-has-comment-preview .hj-cc,
      .hj-card.hj-no-comments .hj-cc{
        display:none!important;
      }

      @media(max-width:900px){

        .hj-mobile-categories{
          display:block;
          position:sticky;
          top:60px;
          z-index:19;
          width:100%;
          border-bottom:1px solid rgba(218,184,255,.12);
          background:rgba(8,5,16,.88);
          -webkit-backdrop-filter:blur(20px);
          backdrop-filter:blur(20px);
          box-shadow:0 10px 30px rgba(0,0,0,.18);
        }

        .hj-mobile-categories-inner{
          display:flex;
          gap:8px;
          width:100%;
          padding:8px 12px 9px;
          overflow-x:auto;
          scrollbar-width:none;
          overscroll-behavior-x:contain;
          scroll-snap-type:x proximity;
          direction:rtl;
        }

        .hj-mobile-categories-inner::-webkit-scrollbar{
          display:none;
        }

        .hj-mobile-category{
          flex:0 0 auto;
          scroll-snap-align:center;
          padding:8px 12px;
          border:1px solid rgba(220,188,255,.14);
          border-radius:999px;
          background:rgba(255,255,255,.035);
          color:#cdbfd6;
          text-decoration:none;
          white-space:nowrap;
          font:500 11px/1 "Heebo",sans-serif;
          transition:.2s ease;
        }

        .hj-mobile-category.active{
          border-color:rgba(212,164,255,.34);
          background:
            linear-gradient(
              120deg,
              rgba(116,54,235,.30),
              rgba(255,83,182,.16)
            );
          color:#fff;
          box-shadow:0 7px 24px rgba(112,45,201,.20);
        }

        .hj-comment-preview{
          top:11px;
          left:11px;
          max-width:78%;
          padding:9px 10px 10px;
          border-radius:14px 14px 14px 5px;
        }

        .hj-comment-text{
          font-size:12px;
          line-height:1.4;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function installMobileCategories() {
    if (document.querySelector(".hj-mobile-categories")) return;

    const source =
      document.querySelector(".nav-links");

    const mainNav =
      document.querySelector(
        "nav.aviation-nav,nav.nav"
      );

    if (!source || !mainNav) return;

    const links =
      [...source.querySelectorAll(
        "a[href^='#']"
      )];

    if (!links.length) return;

    const bar =
      document.createElement("div");

    bar.className =
      "hj-mobile-categories";

    bar.innerHTML = `
      <div class="hj-mobile-categories-inner">

        ${links.map((a) => `
          <a
            class="hj-mobile-category"
            href="${esc(
              a.getAttribute("href")
            )}"
          >
            ${esc(
              a.textContent.trim()
            )}
          </a>
        `).join("")}

      </div>
    `;

    mainNav.insertAdjacentElement(
      "afterend",
      bar
    );

    const mobileLinks =
      [...bar.querySelectorAll(
        ".hj-mobile-category"
      )];

    mobileLinks.forEach((a) => {
      a.addEventListener(
        "click",
        () => setActive(
          a.getAttribute("href")
        )
      );
    });

    const targets =
      mobileLinks
        .map((a) =>
          document.querySelector(
            a.getAttribute("href")
          )
        )
        .filter(Boolean);

    if ("IntersectionObserver" in window) {

      const io =
        new IntersectionObserver(
          (items) => {

            const visible =
              items
                .filter(
                  (x) =>
                    x.isIntersecting
                )
                .sort(
                  (a,b) =>
                    b.intersectionRatio -
                    a.intersectionRatio
                )[0];

            if (
              visible?.target?.id
            ) {
              setActive(
                `#${visible.target.id}`
              );
            }

          },
          {
            rootMargin:
              "-22% 0px -62% 0px",

            threshold:
              [0,.05,.15,.3]
          }
        );

      targets.forEach(
        (target) =>
          io.observe(target)
      );
    }

    setActive(
      location.hash ||
      "#route"
    );
  }

  function setActive(hash) {

    const links =
      [...document.querySelectorAll(
        ".hj-mobile-category"
      )];

    const active =
      links.find(
        (a) =>
          a.getAttribute("href") ===
          hash
      );

    links.forEach(
      (a) =>
        a.classList.toggle(
          "active",
          a === active
        )
    );

    if (
      active &&
      innerWidth <= 900
    ) {
      active.scrollIntoView({
        behavior:"smooth",
        block:"nearest",
        inline:"center"
      });
    }
  }

  async function startCommentBubbles() {

    await Promise.all([
      refreshEntries(),
      refreshComments()
    ]);

    decorate();

    journal =
      document.getElementById(
        "journal"
      );

    if (journal) {

      observer =
        new MutationObserver(
          queueDecorate
        );

      observeJournal();
    }

    document
      .getElementById("hjSend")
      ?.addEventListener(
        "click",
        () => {

          setTimeout(
            async () => {

              await refreshComments();
              decorate();

            },
            1200
          );
        }
      );

    setInterval(
      async () => {

        await refreshComments();
        decorate();

      },
      15000
    );
  }

  async function refreshEntries() {

    try {

      const r =
        await fetch(
          `${SB}/rest/v1/journal_entries?select=id,created_at,taken_at,day_number&order=taken_at.asc.nullslast,created_at.asc`,
          {
            headers:{
              apikey:KEY,

              Authorization:
                `Bearer ${KEY}`,

              Accept:
                "application/json"
            },

            cache:
              "no-store"
          }
        );

      if (!r.ok) return;

      const rows =
        await r.json();

      const grouped =
        new Map(
          Array.from(
            {length:20},
            (_,i) => [
              i+1,
              []
            ]
          )
        );

      rows.forEach((e) => {

        let d =
          Number(
            e.day_number ||
            0
          ) ||
          dayFromDate(
            e.taken_at ||
            e.created_at
          );

        if (
          d >= 1 &&
          d <= 20
        ) {
          grouped
            .get(d)
            .push(e);
        }
      });

      grouped.forEach(
        (rows) =>
          rows.sort(
            (a,b) =>
              new Date(
                a.taken_at ||
                a.created_at
              ) -
              new Date(
                b.taken_at ||
                b.created_at
              )
          )
      );

      entriesByDay =
        grouped;

    } catch (e) {

      console.warn(
        "Hagit polish entries:",
        e
      );
    }
  }

  async function refreshComments() {

    try {

      const r =
        await fetch(
          `${SB}/rest/v1/${COMMENTS}?select=id,journal_entry_id,nickname,comment,created_at&order=created_at.asc`,
          {
            headers:{
              apikey:KEY,

              Authorization:
                `Bearer ${KEY}`,

              Accept:
                "application/json"
            },

            cache:
              "no-store"
          }
        );

      if (!r.ok) return;

      const rows =
        await r.json();

      const grouped =
        new Map();

      rows.forEach((c) => {

        const key =
          String(
            c.journal_entry_id ||
            ""
          );

        if (
          !grouped.has(key)
        ) {
          grouped.set(
            key,
            []
          );
        }

        grouped
          .get(key)
          .push(c);
      });

      commentsByEntry =
        grouped;

    } catch (e) {

      console.warn(
        "Hagit polish comments:",
        e
      );
    }
  }

  function dayFromDate(value) {

    if (!value) {
      return 0;
    }

    const d =
      new Date(
        `${String(value).slice(0,10)}T00:00:00Z`
      );

    return Number.isNaN(
      d.getTime()
    )
      ? 0
      : Math.floor(
          (d - START) /
          86400000
        ) + 1;
  }

  function queueDecorate() {

    if (queued) return;

    queued = true;

    requestAnimationFrame(
      () => {

        queued = false;
        decorate();

      }
    );
  }

  function observeJournal() {

    if (
      !observer ||
      !journal
    ) {
      return;
    }

    observer.observe(
      journal,
      {
        childList:true,
        subtree:true,
        attributes:true,

        attributeFilter:[
          "class"
        ]
      }
    );
  }

  function decorate() {

    observer?.disconnect();

    const activeDay =
      Number(
        document.querySelector(
          ".hj-chip.active"
        )?.dataset.day ||
        0
      );

    if (!activeDay) {

      observeJournal();
      return;
    }

    const dayEntries =
      entriesByDay.get(
        activeDay
      ) || [];

    document
      .querySelectorAll(
        "#hjPhotoScroll .hj-card[data-photo]"
      )
      .forEach((card) => {

        card
          .querySelector(
            ".hj-comment-preview"
          )
          ?.remove();

        card.classList.remove(
          "hj-has-comment-preview",
          "hj-no-comments"
        );

        const entry =
          dayEntries[
            Number(
              card.dataset.photo
            )
          ];

        if (!entry) return;

        const all =
          commentsByEntry.get(
            String(entry.id)
          ) || [];

        if (!all.length) {

          card.classList.add(
            "hj-no-comments"
          );

          return;
        }

        const last =
          all.at(-1);

        const more =
          all.length - 1;

        const bubble =
          document.createElement(
            "span"
          );

        bubble.className =
          "hj-comment-preview";

        bubble.innerHTML = `
          <span
            class="hj-comment-name"
          >
            ${esc(
              last.nickname ||
              "המשפחה"
            )}
          </span>

          <span
            class="hj-comment-text"
          >
            ${esc(
              last.comment ||
              ""
            )}
          </span>

          ${
            more
              ? `
                <span
                  class="hj-comment-more"
                >
                  +${more} תגובות
                </span>
              `
              : ""
          }
        `;

        card.classList.add(
          "hj-has-comment-preview"
        );

        card.appendChild(
          bubble
        );
      });

    observeJournal();
  }
})();
