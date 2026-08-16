(() => {
  "use strict";

  const SUPABASE_URL = "https://fqoziqglyrcjttnuismx.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_2Z_EWufBUdNlSvesyg2bmA_7obNjRsI";

  const BUCKET = "journal-photos";
  const REFRESH_MS = 30000;

  const journalSection = document.getElementById("journal");

  if (!journalSection) {
    return;
  }

  const preview =
    journalSection.querySelector(".journal-preview");

  const coming =
    journalSection.querySelector(".journal-coming");

  const cloudNote =
    journalSection.querySelector(".journal-cloud-note");

  if (!preview) {
    return;
  }

  injectStyles();

  if (cloudNote) {
    cloudNote.innerHTML = `
      <span>☁️</span>
      <div>
        <b>יומן חי מהאייפון של חגית</b>
        <small>
          כל זיכרון שחגית משתפת מה־Photos
          מופיע כאן אוטומטית עם התמונה,
          הכיתוב, התאריך והמיקום.
        </small>
      </div>
    `;
  }

  if (coming) {
    coming.innerHTML = `
      <b>📸 HAGIT'S LIVE DIARY</b>
      הזיכרונות מתעדכנים אוטומטית לאורך הטיול —
      בלי העלאה ידנית לאתר.

      <button
        class="journal-refresh-btn"
        type="button"
        id="journalRefreshBtn"
      >
        רענון עכשיו ↻
      </button>
    `;
  }

  preview.id = "journalLiveGallery";
  preview.setAttribute(
    "aria-live",
    "polite"
  );

  let isLoading = false;
  let lastPayload = "";

  const refreshButton =
    document.getElementById(
      "journalRefreshBtn"
    );

  if (refreshButton) {
    refreshButton.addEventListener(
      "click",
      () => loadJournal(true)
    );
  }

  loadJournal(false);

  setInterval(
    () => loadJournal(false),
    REFRESH_MS
  );

  async function loadJournal(
    manual
  ) {
    if (isLoading) {
      return;
    }

    isLoading = true;

    if (
      manual &&
      refreshButton
    ) {
      refreshButton.disabled = true;
      refreshButton.textContent =
        "מרענן…";
    }

    try {
      const endpoint =
        `${SUPABASE_URL}/rest/v1/journal_entries` +
        `?select=id,created_at,taken_at,location_name,day_number,caption,image_path` +
        `&order=taken_at.asc.nullslast,created_at.asc`;

      const response =
        await fetch(
          endpoint,
          {
            headers: {
              apikey:
                SUPABASE_PUBLISHABLE_KEY,

              Accept:
                "application/json",
            },

            cache:
              "no-store",
          }
        );

      if (!response.ok) {
        throw new Error(
          `Journal request failed (${response.status})`
        );
      }

      const entries =
        await response.json();

      const payload =
        JSON.stringify(entries);

      if (
        payload !== lastPayload
      ) {
        render(entries);

        lastPayload =
          payload;
      }
    } catch (error) {
      console.error(
        "Hagit journal:",
        error
      );

      renderError();
    } finally {
      isLoading = false;

      if (
        manual &&
        refreshButton
      ) {
        refreshButton.disabled =
          false;

        refreshButton.textContent =
          "רענון עכשיו ↻";
      }
    }
  }

  function render(entries) {
    if (
      !Array.isArray(entries) ||
      entries.length === 0
    ) {
      preview.className =
        "journal-live-empty";

      preview.innerHTML = `
        <div
          class="journal-empty-orbit"
          aria-hidden="true"
        >
          <span>✦</span>
          <i></i>
          <b>60</b>
        </div>

        <div class="journal-empty-copy">
          <small>
            HAGIT'S USA DIARY ·
            WAITING FOR PAGE ONE
          </small>

          <h3 dir="ltr">
            THE STORY<br>
            <em>STARTS HERE.</em>
          </h3>

          <p>
            הזיכרון הראשון של חגית
            יופיע כאן ברגע שהיא תשתף
            תמונה מהאייפון.
          </p>

          <span
            class="journal-empty-status"
          >
            📸 Waiting for the first memory…
          </span>
        </div>
      `;

      return;
    }

    preview.className =
      "journal-live-days";

    const groups =
      groupEntries(entries);

    preview.innerHTML =
      groups
        .map(renderGroup)
        .join("");

    preview
      .querySelectorAll(
        "[data-journal-image]"
      )
      .forEach(
        (button) => {
          button.addEventListener(
            "click",
            () => {
              openLightbox(
                button.dataset.src ||
                  "",

                button.dataset
                  .caption ||
                  "",

                button.dataset.meta ||
                  ""
              );
            }
          );
        }
      );
  }

  function groupEntries(
    entries
  ) {
    const grouped =
      new Map();

    for (
      const entry of entries
    ) {
      const dateKey =
        getDateKey(
          entry.taken_at ||
            entry.created_at
        );

      const key =
        entry.day_number
          ? `day-${entry.day_number}`
          : `date-${dateKey}`;

      if (
        !grouped.has(key)
      ) {
        grouped.set(
          key,
          {
            dayNumber:
              entry.day_number ||
              null,

            dateKey,

            entries: [],
          }
        );
      }

      grouped
        .get(key)
        .entries
        .push(entry);
    }

    return [
      ...grouped.values(),
    ].sort(
      (a, b) => {
        if (
          a.dayNumber &&
          b.dayNumber
        ) {
          return (
            a.dayNumber -
            b.dayNumber
          );
        }

        if (a.dayNumber) {
          return -1;
        }

        if (b.dayNumber) {
          return 1;
        }

        return a.dateKey.localeCompare(
          b.dateKey
        );
      }
    );
  }

  function renderGroup(
    group
  ) {
    const first =
      group.entries[0];

    const date =
      formatDate(
        first.taken_at ||
          first.created_at
      );

    const location =
      first.location_name ||
      "הרגע של חגית";

    const label =
      group.dayNumber
        ? `DAY ${String(
            group.dayNumber
          ).padStart(
            2,
            "0"
          )}`
        : "MEMORY";

    return `
      <section
        class="journal-day-block"
      >
        <header
          class="journal-day-head"
        >
          <div>
            <span>
              ${escapeHtml(label)}
            </span>

            <h3>
              ${escapeHtml(
                location
              )}
            </h3>
          </div>

          <time>
            ${escapeHtml(date)}
          </time>
        </header>

        <div
          class="
            journal-live-grid
            ${
              group.entries
                .length === 1
                ? "journal-single"
                : ""
            }
          "
        >
          ${
            group.entries
              .map(
                (
                  entry,
                  index
                ) =>
                  renderMemory(
                    entry,
                    index
                  )
              )
              .join("")
          }
        </div>
      </section>
    `;
  }

  function renderMemory(
    entry,
    index
  ) {
    const imageUrl =
      publicImageUrl(
        entry.image_path
      );

    const caption =
      (
        entry.caption ||
        ""
      ).trim();

    const location =
      (
        entry.location_name ||
        ""
      ).trim();

    const dateTime =
      formatDateTime(
        entry.taken_at ||
          entry.created_at
      );

    const meta =
      [
        location,
        dateTime,
      ]
        .filter(Boolean)
        .join(" · ");

    const featured =
      index === 0
        ? "journal-memory-featured"
        : "";

    return `
      <article
        class="
          journal-live-memory
          ${featured}
        "
      >
        <button
          class="journal-live-photo"
          type="button"
          data-journal-image
          data-src="${escapeAttr(
            imageUrl
          )}"
          data-caption="${escapeAttr(
            caption
          )}"
          data-meta="${escapeAttr(
            meta
          )}"
          aria-label="פתיחת התמונה"
        >
          <img
            src="${escapeAttr(
              imageUrl
            )}"
            alt="${escapeAttr(
              caption ||
                location ||
                "זיכרון מהטיול של חגית"
            )}"
            loading="lazy"
          >

          <span
            class="journal-photo-shade"
          ></span>

          <span
            class="journal-photo-open"
          >
            ↗
          </span>
        </button>

        <div
          class="journal-live-copy"
        >
          <div
            class="journal-memory-meta"
          >
            ${
              location
                ? `
                  <span>
                    📍
                    ${escapeHtml(
                      location
                    )}
                  </span>
                `
                : ""
            }

            <span>
              🕒
              ${escapeHtml(
                dateTime
              )}
            </span>
          </div>

          ${
            caption
              ? `
                <p
                  class="journal-memory-caption"
                >
                  ״${escapeHtml(
                    caption
                  )}״
                </p>
              `
              : `
                <p
                  class="
                    journal-memory-caption
                    journal-memory-caption-empty
                  "
                >
                  רגע ששווה לשמור.
                </p>
              `
          }
        </div>
      </article>
    `;
  }

  function renderError() {
    preview.className =
      "journal-live-empty journal-live-error";

    preview.innerHTML = `
      <div
        class="journal-empty-copy"
      >
        <small>
          LIVE DIARY · CONNECTION
        </small>

        <h3 dir="ltr">
          ONE SEC.<br>
          <em>MEMORIES LOADING.</em>
        </h3>

        <p>
          היומן לא הצליח להיטען כרגע.
          התמונות עצמן נשארות
          שמורות בענן.
        </p>

        <button
          class="journal-refresh-btn"
          type="button"
          id="journalRetryBtn"
        >
          נסה שוב ↻
        </button>
      </div>
    `;

    const retry =
      document.getElementById(
        "journalRetryBtn"
      );

    if (retry) {
      retry.addEventListener(
        "click",
        () =>
          loadJournal(true)
      );
    }
  }

  function publicImageUrl(
    path
  ) {
    const encodedPath =
      String(path || "")
        .split("/")
        .map(
          encodeURIComponent
        )
        .join("/");

    return (
      `${SUPABASE_URL}` +
      `/storage/v1/object/public/` +
      `${BUCKET}/` +
      `${encodedPath}`
    );
  }

  function getDateKey(
    value
  ) {
    if (!value) {
      return "9999-99-99";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return String(
        value
      ).slice(
        0,
        10
      );
    }

    return [
      date.getFullYear(),

      String(
        date.getMonth() + 1
      ).padStart(
        2,
        "0"
      ),

      String(
        date.getDate()
      ).padStart(
        2,
        "0"
      ),
    ].join("-");
  }

  function formatDate(
    value
  ) {
    if (!value) {
      return "";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    return new Intl
      .DateTimeFormat(
        "he-IL",
        {
          day:
            "2-digit",

          month:
            "2-digit",

          year:
            "numeric",
        }
      )
      .format(date);
  }

  function formatDateTime(
    value
  ) {
    if (!value) {
      return "";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    return new Intl
      .DateTimeFormat(
        "he-IL",
        {
          day:
            "2-digit",

          month:
            "2-digit",

          year:
            "numeric",

          hour:
            "2-digit",

          minute:
            "2-digit",
        }
      )
      .format(date);
  }

  function openLightbox(
    src,
    caption,
    meta
  ) {
    let lightbox =
      document.getElementById(
        "journalLightbox"
      );

    if (!lightbox) {
      lightbox =
        document.createElement(
          "div"
        );

      lightbox.id =
        "journalLightbox";

      lightbox.className =
        "journal-lightbox";

      lightbox.innerHTML = `
        <button
          class="journal-lightbox-close"
          type="button"
          aria-label="סגירה"
        >
          ×
        </button>

        <div
          class="journal-lightbox-inner"
        >
          <img alt="">

          <div
            class="journal-lightbox-copy"
          >
            <p></p>
            <small></small>
          </div>
        </div>
      `;

      document.body.appendChild(
        lightbox
      );

      lightbox.addEventListener(
        "click",
        (event) => {
          if (
            event.target ===
              lightbox ||
            event.target
              .classList
              .contains(
                "journal-lightbox-close"
              )
          ) {
            closeLightbox();
          }
        }
      );

      document.addEventListener(
        "keydown",
        (event) => {
          if (
            event.key ===
            "Escape"
          ) {
            closeLightbox();
          }
        }
      );
    }

    const img =
      lightbox.querySelector(
        "img"
      );

    const p =
      lightbox.querySelector(
        "p"
      );

    const small =
      lightbox.querySelector(
        "small"
      );

    img.src = src;

    img.alt =
      caption ||
      "זיכרון מהטיול של חגית";

    p.textContent =
      caption
        ? `״${caption}״`
        : "";

    small.textContent =
      meta;

    lightbox.classList.add(
      "is-open"
    );

    document.body.style.overflow =
      "hidden";
  }

  function closeLightbox() {
    const lightbox =
      document.getElementById(
        "journalLightbox"
      );

    if (!lightbox) {
      return;
    }

    lightbox.classList.remove(
      "is-open"
    );

    document.body.style.overflow =
      "";
  }

  function escapeHtml(
    value
  ) {
    return String(
      value ?? ""
    )
      .replaceAll(
        "&",
        "&amp;"
      )
      .replaceAll(
        "<",
        "&lt;"
      )
      .replaceAll(
        ">",
        "&gt;"
      )
      .replaceAll(
        '"',
        "&quot;"
      )
      .replaceAll(
        "'",
        "&#039;"
      );
  }

  const escapeAttr =
    escapeHtml;

  function injectStyles() {
    if (
      document.getElementById(
        "journalLiveStyles"
      )
    ) {
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "journalLiveStyles";

    style.textContent = `
      .journal-refresh-btn{
        margin-inline-start:12px;
        border:1px solid rgba(221,186,255,.18);
        background:rgba(255,255,255,.055);
        color:#f4e9f9;
        border-radius:999px;
        padding:7px 11px;
        font-size:11px;
        font-weight:800;
      }

      .journal-refresh-btn:disabled{
        opacity:.55;
      }

      .journal-live-empty{
        min-height:390px;
        border:1px solid rgba(220,185,255,.14);
        border-radius:30px;

        background:
          radial-gradient(
            circle at 24% 30%,
            rgba(255,98,169,.14),
            transparent 27%
          ),
          radial-gradient(
            circle at 78% 65%,
            rgba(121,168,255,.12),
            transparent 30%
          ),
          rgba(16,9,24,.52);

        display:grid;
        grid-template-columns:.8fr 1.2fr;
        align-items:center;
        gap:30px;
        padding:42px;
        overflow:hidden;
      }

      .journal-empty-orbit{
        height:250px;
        position:relative;
        display:grid;
        place-items:center;
      }

      .journal-empty-orbit b{
        font:
          italic 500 150px/.8
          "Cormorant Garamond",
          serif;

        color:transparent;

        -webkit-text-stroke:
          1px
          rgba(
            225,
            198,
            255,
            .28
          );
      }

      .journal-empty-orbit i{
        position:absolute;
        width:230px;
        height:108px;

        border:
          1px dashed
          rgba(
            255,
            152,
            214,
            .32
          );

        border-radius:50%;
        transform:
          rotate(-18deg);
      }

      .journal-empty-orbit span{
        position:absolute;
        top:31%;
        right:17%;
        color:#ffd8ef;
        font-size:25px;
      }

      .journal-empty-copy small{
        font:
          500 9px
          "Montserrat",
          sans-serif;

        letter-spacing:.19em;
        color:#bca5c8;
      }

      .journal-empty-copy h3{
        margin:16px 0;

        font:
          400
          clamp(
            48px,
            6.8vw,
            92px
          )/.75
          "Cormorant Garamond",
          serif;

        color:#f8efff;
        letter-spacing:-.035em;
      }

      .journal-empty-copy h3 em{
        color:#cf9aff;
        font-style:italic;
      }

      .journal-empty-copy p{
        max-width:540px;
        color:#c5b8ca;
        font-size:16px;
        line-height:1.8;
      }

      .journal-empty-status{
        display:inline-flex;
        margin-top:10px;
        padding:9px 13px;

        border-radius:999px;

        border:
          1px solid
          rgba(
            221,
            186,
            255,
            .14
          );

        color:#bdaec5;
        font-size:12px;
      }

      .journal-live-days{
        display:grid;
        gap:34px;
      }

      .journal-day-block{
        display:grid;
        gap:14px;
      }

      .journal-day-head{
        display:flex;
        justify-content:
          space-between;
        align-items:end;
        gap:15px;

        border-bottom:
          1px solid
          rgba(
            225,
            195,
            255,
            .12
          );

        padding:
          0 4px 12px;
      }

      .journal-day-head span{
        font:
          600 9px
          "Montserrat",
          sans-serif;

        letter-spacing:.19em;
        color:#cf9aff;
      }

      .journal-day-head h3{
        font-size:24px;
        margin:5px 0 0;
        color:#f8efff;
      }

      .journal-day-head time{
        font-size:12px;
        color:#9d90a5;
      }

      .journal-live-grid{
        display:grid;

        grid-template-columns:
          repeat(
            3,
            minmax(
              0,
              1fr
            )
          );

        gap:14px;
      }

      .journal-live-grid.journal-single{
        grid-template-columns:
          minmax(
            0,
            1fr
          );
      }

      .journal-live-memory{
        border:
          1px solid
          rgba(
            225,
            195,
            255,
            .12
          );

        border-radius:24px;
        overflow:hidden;
        background:
          rgba(
            16,
            9,
            24,
            .66
          );

        min-width:0;
      }

      .journal-live-grid:not(
        .journal-single
      )
      .journal-memory-featured{
        grid-column:span 2;
      }

      .journal-live-photo{
        position:relative;
        display:block;
        width:100%;
        border:0;
        padding:0;
        background:#120b19;
        overflow:hidden;
        aspect-ratio:4/5;
      }

      .journal-memory-featured
      .journal-live-photo{
        aspect-ratio:16/10;
      }

      .journal-live-photo img{
        width:100%;
        height:100%;
        object-fit:cover;
        display:block;

        transition:
          transform
          .5s ease;
      }

      .journal-live-photo:hover img{
        transform:
          scale(1.025);
      }

      .journal-photo-shade{
        position:absolute;
        inset:0;

        background:
          linear-gradient(
            to top,
            rgba(
              7,
              3,
              12,
              .34
            ),
            transparent 50%
          );
      }

      .journal-photo-open{
        position:absolute;
        left:14px;
        top:14px;

        width:36px;
        height:36px;

        border-radius:50%;

        display:grid;
        place-items:center;

        background:
          rgba(
            6,
            4,
            10,
            .55
          );

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .16
          );

        color:#fff;
      }

      .journal-live-copy{
        padding:
          17px
          18px
          20px;
      }

      .journal-memory-meta{
        display:flex;
        gap:7px;
        flex-wrap:wrap;
      }

      .journal-memory-meta span{
        font-size:10px;
        color:#c9bacf;

        border:
          1px solid
          rgba(
            221,
            186,
            255,
            .12
          );

        padding:
          5px 8px;

        border-radius:
          999px;
      }

      .journal-memory-caption{
        margin:
          14px 0 0;

        color:#f7eff9;
        font-size:18px;
        line-height:1.55;
        font-weight:600;
      }

      .journal-memory-caption-empty{
        color:#9d90a5;
        font-weight:400;
      }

      .journal-lightbox{
        position:fixed;
        inset:0;
        z-index:99999;

        background:
          rgba(
            4,
            2,
            8,
            .93
          );

        padding:24px;
        display:none;
        place-items:center;

        backdrop-filter:
          blur(14px);
      }

      .journal-lightbox.is-open{
        display:grid;
      }

      .journal-lightbox-inner{
        max-width:
          min(
            1000px,
            94vw
          );

        max-height:90vh;
        display:grid;
        gap:14px;
      }

      .journal-lightbox-inner img{
        max-width:100%;
        max-height:76vh;
        object-fit:contain;
        border-radius:18px;
        margin:auto;

        box-shadow:
          0 30px 100px
          rgba(
            0,
            0,
            0,
            .45
          );
      }

      .journal-lightbox-copy{
        text-align:center;
      }

      .journal-lightbox-copy p{
        margin:0;
        color:#fff;
        font-size:18px;
      }

      .journal-lightbox-copy small{
        display:block;
        margin-top:7px;
        color:#aaa0b1;
      }

      .journal-lightbox-close{
        position:absolute;

        top:
          max(
            18px,
            env(
              safe-area-inset-top
            )
          );

        right:18px;
        width:44px;
        height:44px;

        border-radius:50%;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .18
          );

        background:
          rgba(
            255,
            255,
            255,
            .08
          );

        color:#fff;
        font-size:28px;
        line-height:1;
      }

      @media(
        max-width:800px
      ){
        .journal-live-empty{
          grid-template-columns:1fr;
          padding:28px 20px;
          text-align:center;
        }

        .journal-empty-orbit{
          height:180px;
        }

        .journal-empty-orbit b{
          font-size:115px;
        }

        .journal-empty-orbit i{
          width:190px;
          height:88px;
        }

        .journal-live-grid,
        .journal-live-grid.journal-single{
          grid-template-columns:
            1fr 1fr;
        }

        .journal-live-grid:not(
          .journal-single
        )
        .journal-memory-featured{
          grid-column:1/-1;
        }
      }

      @media(
        max-width:560px
      ){
        .journal-live-grid,
        .journal-live-grid.journal-single{
          grid-template-columns:
            1fr;
        }

        .journal-live-grid:not(
          .journal-single
        )
        .journal-memory-featured{
          grid-column:auto;
        }

        .journal-live-photo,
        .journal-memory-featured
        .journal-live-photo{
          aspect-ratio:4/5;
        }

        .journal-day-head{
          align-items:
            flex-start;
        }

        .journal-day-head h3{
          font-size:20px;
        }

        .journal-day-head time{
          font-size:10px;
        }

        .journal-memory-caption{
          font-size:17px;
        }

        .journal-refresh-btn{
          display:block;
          margin:
            10px 0 0;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }
})();
