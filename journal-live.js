(() => {
  "use strict";

  const SUPABASE_URL = "https://fqoziqglyrcjttnuismx.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_2Z_EWufBUdNlSvesyg2bmA_7obNjRsI";
  const BUCKET = "journal-photos";
  const REFRESH_MS = 30000;

  const DAY_META = {
    1: { title: "LOS ANGELES", date: "17 AUG 2026" },
    2: { title: "SAN DIEGO", date: "18 AUG 2026" },
    3: { title: "UNIVERSAL · LOS ANGELES", date: "19 AUG 2026" },
    4: { title: "SANTA BARBARA · SOLVANG", date: "20 AUG 2026" },
    5: { title: "MONTEREY · SAN FRANCISCO", date: "21 AUG 2026" },
    6: { title: "SAN FRANCISCO", date: "22 AUG 2026" },
    7: { title: "YOSEMITE", date: "23 AUG 2026" },
    8: { title: "LAS VEGAS", date: "24 AUG 2026" },
    9: { title: "LAS VEGAS · HOOVER DAM", date: "25 AUG 2026" },
    10: { title: "LAS VEGAS", date: "26 AUG 2026" },
    11: { title: "ZION · BRYCE", date: "27 AUG 2026" },
    12: { title: "GRAND CANYON", date: "28 AUG 2026" },
    13: { title: "PHOENIX → WASHINGTON", date: "29 AUG 2026" },
    14: { title: "WASHINGTON D.C.", date: "30 AUG 2026" },
    15: { title: "AMISH COUNTRY · HERSHEY", date: "31 AUG 2026" },
    16: { title: "WATKINS GLEN · NIAGARA", date: "01 SEP 2026" },
    17: { title: "NIAGARA · SCRANTON", date: "02 SEP 2026" },
    18: { title: "NEW YORK CITY", date: "03 SEP 2026" },
    19: { title: "NEW YORK CITY", date: "04 SEP 2026" },
    20: { title: "NEW YORK → HOME", date: "05 SEP 2026" },
  };

  const journalSection = document.getElementById("journal");
  if (!journalSection) return;

  const preview = journalSection.querySelector(".journal-preview");
  const coming = journalSection.querySelector(".journal-coming");
  const cloudNote = journalSection.querySelector(".journal-cloud-note");

  if (!preview) return;

  let isLoading = false;
  let lastPayload = "";
  let journalGroups = [];
  let activeGroupIndex = -1;
  let activeEntryIndex = 0;
  let storyTouchStartX = null;

  preparePageNavigation();
  injectStyles();
  installMobileNavigation();
  bindAnchorNavigation();
  observeSections();

  if (cloudNote) {
    cloudNote.innerHTML = `
      <span>✦</span>
      <div>
        <b>20 פרקים. סיפור אחד.</b>
        <small>
          כל יום בטיול הופך לפרק משלו. התמונות נשמרות בפנים —
          והעמוד הראשי נשאר נקי גם כשהאלבום הולך וגדל.
        </small>
      </div>
    `;
  }

  if (coming) {
    coming.innerHTML = `
      <div class="journal-chapter-footer-copy">
        <b>20 CHAPTERS · ONE JOURNEY ✦</b>
        <span>
          לחצו על פרק כדי להיכנס ל־Story Mode
          ולדפדף בכל הזיכרונות של אותו יום.
        </span>
      </div>

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
  preview.setAttribute("aria-live", "polite");

  const refreshButton =
    document.getElementById("journalRefreshBtn");

  refreshButton?.addEventListener(
    "click",
    () => loadJournal(true)
  );

  loadJournal(false);

  setInterval(
    () => loadJournal(false),
    REFRESH_MS
  );

  async function loadJournal(manual) {
    if (isLoading) return;

    isLoading = true;

    if (manual && refreshButton) {
      refreshButton.disabled = true;
      refreshButton.textContent = "מרענן…";
    }

    try {
      const endpoint =
        `${SUPABASE_URL}/rest/v1/journal_entries` +
        `?select=id,created_at,taken_at,location_name,day_number,caption,image_path` +
        `&order=taken_at.asc.nullslast,created_at.asc`;

      const response = await fetch(
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

      if (payload !== lastPayload) {
        render(entries);
        lastPayload = payload;
      }
    } catch (error) {
      console.error(
        "Hagit journal:",
        error
      );

      renderError();
    } finally {
      isLoading = false;

      if (manual && refreshButton) {
        refreshButton.disabled = false;
        refreshButton.textContent =
          "רענון עכשיו ↻";
      }
    }
  }

  function render(entries) {
    closeStory();

    if (
      !Array.isArray(entries) ||
      entries.length === 0
    ) {
      journalGroups = [];
      renderEmpty();
      return;
    }

    journalGroups =
      groupEntries(entries);

    preview.className =
      "journal-chapters-grid";

    preview.innerHTML =
      journalGroups
        .map(
          (group, groupIndex) =>
            renderChapter(
              group,
              groupIndex
            )
        )
        .join("");

    preview
      .querySelectorAll(
        "[data-journal-chapter]"
      )
      .forEach(
        (button) => {
          button.addEventListener(
            "click",
            () => {
              openStory(
                Number(
                  button.dataset
                    .journalChapter ||
                    0
                ),
                0
              );
            }
          );
        }
      );
  }

  function renderEmpty() {
    preview.className =
      "journal-live-empty journal-book-empty";

    preview.innerHTML = `
      <div
        class="journal-empty-orbit"
        aria-hidden="true"
      >
        <span>✦</span>
        <i></i>
        <b>60</b>
      </div>

      <div
        class="journal-empty-copy"
      >
        <small>
          HAGIT'S USA DIARY ·
          WAITING FOR CHAPTER ONE
        </small>

        <h3 dir="ltr">
          THE STORY<br>
          <em>STARTS HERE.</em>
        </h3>

        <p>
          ברגע שחגית תשתף את התמונה
          הראשונה, הפרק הראשון בספר
          המסע שלה יופיע כאן.
        </p>

        <span
          class="journal-empty-status"
        >
          📸 Waiting for the first memory…
        </span>
      </div>
    `;
  }

  function groupEntries(entries) {
    const grouped =
      new Map();

    for (const entry of entries) {
      const dateKey =
        getDateKey(
          entry.taken_at ||
            entry.created_at
        );

      const key =
        entry.day_number
          ? `day-${entry.day_number}`
          : `date-${dateKey}`;

      if (!grouped.has(key)) {
        grouped.set(
          key,
          {
            key,

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

        return (
          a.dateKey.localeCompare(
            b.dateKey
          )
        );
      }
    );
  }

  function renderChapter(
    group,
    groupIndex
  ) {
    const meta =
      chapterMeta(group);

    const images =
      group.entries
        .slice(0, 3)
        .map(
          (entry) =>
            publicImageUrl(
              entry.image_path
            )
        );

    const cover =
      images[0] || "";

    const second =
      images[1] || cover;

    const third =
      images[2] ||
      second ||
      cover;

    const quote =
      firstCaption(
        group.entries
      );

    const count =
      group.entries.length;

    const countText =
      count === 1
        ? "1 MEMORY"
        : `${count} MEMORIES`;

    const dayNumber =
      group.dayNumber
        ? String(
            group.dayNumber
          ).padStart(
            2,
            "0"
          )
        : "✦";

    return `
      <button
        class="journal-chapter-card"
        type="button"
        data-journal-chapter="${groupIndex}"
        aria-label="פתיחת פרק ${escapeAttr(
          meta.title
        )}"
      >
        <span
          class="journal-chapter-stack"
          aria-hidden="true"
        >

          ${
            count > 2
              ? `
                <span
                  class="
                    journal-chapter-back
                    journal-chapter-back-two
                  "
                  style="${bgStyle(
                    third
                  )}"
                ></span>
              `
              : ""
          }

          ${
            count > 1
              ? `
                <span
                  class="
                    journal-chapter-back
                    journal-chapter-back-one
                  "
                  style="${bgStyle(
                    second
                  )}"
                ></span>
              `
              : ""
          }

          <span
            class="journal-chapter-front"
            style="${bgStyle(
              cover
            )}"
          >
            <span
              class="journal-chapter-image-shade"
            ></span>

            <span
              class="journal-chapter-day"
            >
              ${escapeHtml(
                dayNumber
              )}
            </span>

            <span
              class="journal-chapter-stamp"
            >
              <b>H60</b>
              <small>USA</small>
            </span>
          </span>
        </span>

        <span
          class="journal-chapter-copy"
        >
          <span
            class="journal-chapter-title"
            dir="ltr"
          >
            ${escapeHtml(
              meta.title
            )}
          </span>

          <span
            class="journal-chapter-date"
            dir="ltr"
          >
            ${escapeHtml(
              meta.date
            )}
          </span>

          <span
            class="journal-chapter-count"
            dir="ltr"
          >
            ▣
            ${escapeHtml(
              countText
            )}
          </span>

          ${
            quote
              ? `
                <span
                  class="journal-chapter-quote"
                >
                  ״${escapeHtml(
                    truncate(
                      quote,
                      82
                    )
                  )}״
                </span>
              `
              : `
                <span
                  class="
                    journal-chapter-quote
                    journal-chapter-quote-empty
                  "
                >
                  OPEN CHAPTER →
                </span>
              `
          }
        </span>
      </button>
    `;
  }

  function chapterMeta(group) {
    if (
      group.dayNumber &&
      DAY_META[group.dayNumber]
    ) {
      return DAY_META[
        group.dayNumber
      ];
    }

    const first =
      group.entries[0] ||
      {};

    return {
      title:
        String(
          first.location_name ||
            "TRAVEL MEMORY"
        ).toUpperCase(),

      date:
        formatDateEnglish(
          first.taken_at ||
            first.created_at
        ),
    };
  }

  function firstCaption(entries) {
    const item =
      entries.find(
        (entry) =>
          String(
            entry.caption ||
              ""
          ).trim()
      );

    return item
      ? String(
          item.caption
        ).trim()
      : "";
  }

  function openStory(
    groupIndex,
    entryIndex
  ) {
    const group =
      journalGroups[
        groupIndex
      ];

    if (
      !group ||
      !group.entries.length
    ) {
      return;
    }

    ensureStoryViewer();

    activeGroupIndex =
      groupIndex;

    activeEntryIndex =
      Math.max(
        0,
        Math.min(
          entryIndex,
          group.entries.length -
            1
        )
      );

    const viewer =
      document.getElementById(
        "journalStoryViewer"
      );

    viewer?.classList.add(
      "is-open"
    );

    document.body.classList.add(
      "journal-story-open"
    );

    updateStory();
  }

  function closeStory() {
    document
      .getElementById(
        "journalStoryViewer"
      )
      ?.classList.remove(
        "is-open"
      );

    document.body.classList.remove(
      "journal-story-open"
    );

    activeGroupIndex =
      -1;

    activeEntryIndex =
      0;
  }

  function ensureStoryViewer() {
    if (
      document.getElementById(
        "journalStoryViewer"
      )
    ) {
      return;
    }

    const viewer =
      document.createElement(
        "div"
      );

    viewer.id =
      "journalStoryViewer";

    viewer.className =
      "journal-story-viewer";

    viewer.setAttribute(
      "role",
      "dialog"
    );

    viewer.setAttribute(
      "aria-modal",
      "true"
    );

    viewer.innerHTML = `
      <div
        class="journal-story-shell"
      >

        <header
          class="journal-story-topbar"
        >
          <button
            class="journal-story-back"
            type="button"
            data-story-close
          >
            ← חזרה לפרקים
          </button>

          <div
            class="journal-story-heading"
            dir="ltr"
          >
            <strong
              data-story-title
            ></strong>

            <small
              data-story-date
            ></small>
          </div>

          <span
            class="journal-story-counter"
            data-story-counter
          ></span>
        </header>

        <div
          class="journal-story-stage"
          data-story-stage
        >
          <div
            class="journal-story-bg"
            data-story-bg
          ></div>

          <img
            class="journal-story-image"
            data-story-image
            alt="זיכרון מיומן המסע של חגית"
          >

          <div
            class="journal-story-vignette"
          ></div>

          <button
            class="
              journal-story-arrow
              journal-story-prev
            "
            type="button"
            data-story-prev
            aria-label="תמונה קודמת"
          >
            ‹
          </button>

          <button
            class="
              journal-story-arrow
              journal-story-next
            "
            type="button"
            data-story-next
            aria-label="תמונה הבאה"
          >
            ›
          </button>

          <div
            class="journal-story-copy"
            dir="rtl"
          >
            <div
              class="journal-story-meta"
              data-story-meta
            ></div>

            <blockquote
              data-story-caption
            ></blockquote>
          </div>
        </div>

        <div
          class="journal-story-thumbs"
          data-story-thumbs
        ></div>

      </div>
    `;

    document.body.appendChild(
      viewer
    );

    viewer
      .querySelector(
        "[data-story-close]"
      )
      ?.addEventListener(
        "click",
        closeStory
      );

    viewer
      .querySelector(
        "[data-story-prev]"
      )
      ?.addEventListener(
        "click",
        () =>
          stepStory(-1)
      );

    viewer
      .querySelector(
        "[data-story-next]"
      )
      ?.addEventListener(
        "click",
        () =>
          stepStory(1)
      );

    viewer.addEventListener(
      "click",
      (event) => {
        if (
          event.target ===
          viewer
        ) {
          closeStory();
        }
      }
    );

    const stage =
      viewer.querySelector(
        "[data-story-stage]"
      );

    stage?.addEventListener(
      "touchstart",
      (event) => {
        storyTouchStartX =
          event
            .changedTouches?.[0]
            ?.clientX ??
          null;
      },
      {
        passive: true,
      }
    );

    stage?.addEventListener(
      "touchend",
      (event) => {
        if (
          storyTouchStartX ===
          null
        ) {
          return;
        }

        const endX =
          event
            .changedTouches?.[0]
            ?.clientX ??
          storyTouchStartX;

        const delta =
          endX -
          storyTouchStartX;

        storyTouchStartX =
          null;

        if (
          Math.abs(delta) <
          45
        ) {
          return;
        }

        stepStory(
          delta < 0
            ? 1
            : -1
        );
      },
      {
        passive: true,
      }
    );

    document.addEventListener(
      "keydown",
      (event) => {
        if (
          !document
            .getElementById(
              "journalStoryViewer"
            )
            ?.classList.contains(
              "is-open"
            )
        ) {
          return;
        }

        if (
          event.key ===
          "Escape"
        ) {
          closeStory();
        }

        if (
          event.key ===
          "ArrowLeft"
        ) {
          stepStory(-1);
        }

        if (
          event.key ===
          "ArrowRight"
        ) {
          stepStory(1);
        }
      }
    );
  }

  function stepStory(direction) {
    const group =
      journalGroups[
        activeGroupIndex
      ];

    if (!group) {
      return;
    }

    const nextIndex =
      activeEntryIndex +
      direction;

    if (
      nextIndex < 0 ||
      nextIndex >=
        group.entries.length
    ) {
      return;
    }

    activeEntryIndex =
      nextIndex;

    updateStory();
  }

  function updateStory() {
    const viewer =
      document.getElementById(
        "journalStoryViewer"
      );

    const group =
      journalGroups[
        activeGroupIndex
      ];

    if (
      !viewer ||
      !group
    ) {
      return;
    }

    const entry =
      group.entries[
        activeEntryIndex
      ];

    const meta =
      chapterMeta(group);

    const imageUrl =
      publicImageUrl(
        entry.image_path
      );

    const caption =
      String(
        entry.caption ||
          ""
      ).trim();

    const location =
      String(
        entry.location_name ||
          ""
      ).trim();

    const dateTime =
      formatDateTime(
        entry.taken_at ||
          entry.created_at
      );

    const titleEl =
      viewer.querySelector(
        "[data-story-title]"
      );

    const dateEl =
      viewer.querySelector(
        "[data-story-date]"
      );

    const counterEl =
      viewer.querySelector(
        "[data-story-counter]"
      );

    const imageEl =
      viewer.querySelector(
        "[data-story-image]"
      );

    const bgEl =
      viewer.querySelector(
        "[data-story-bg]"
      );

    const metaEl =
      viewer.querySelector(
        "[data-story-meta]"
      );

    const captionEl =
      viewer.querySelector(
        "[data-story-caption]"
      );

    const thumbsEl =
      viewer.querySelector(
        "[data-story-thumbs]"
      );

    const prev =
      viewer.querySelector(
        "[data-story-prev]"
      );

    const next =
      viewer.querySelector(
        "[data-story-next]"
      );

    if (titleEl) {
      titleEl.textContent =
        meta.title;
    }

    if (dateEl) {
      dateEl.textContent =
        meta.date;
    }

    if (counterEl) {
      counterEl.textContent =
        `${activeEntryIndex + 1} / ${group.entries.length}`;
    }

    if (imageEl) {
      imageEl.src =
        imageUrl;

      imageEl.alt =
        caption ||
        location ||
        `זיכרון ${
          activeEntryIndex +
          1
        }`;
    }

    if (bgEl) {
      bgEl.style.backgroundImage =
        `url("${imageUrl}")`;
    }

    if (metaEl) {
      metaEl.innerHTML =
        [
          location
            ? `
              <span>
                📍
                ${escapeHtml(
                  location
                )}
              </span>
            `
            : "",

          dateTime
            ? `
              <span>
                🕒
                ${escapeHtml(
                  dateTime
                )}
              </span>
            `
            : "",
        ]
          .filter(Boolean)
          .join("");
    }

    if (captionEl) {
      captionEl.textContent =
        caption
          ? `״${caption}״`
          : "רגע ששווה לשמור.";

      captionEl.classList.toggle(
        "is-empty",
        !caption
      );
    }

    if (prev) {
      prev.disabled =
        activeEntryIndex ===
        0;
    }

    if (next) {
      next.disabled =
        activeEntryIndex ===
        group.entries.length -
        1;
    }

    if (thumbsEl) {
      thumbsEl.innerHTML =
        group.entries
          .map(
            (
              thumbEntry,
              index
            ) => {
              const thumbUrl =
                publicImageUrl(
                  thumbEntry.image_path
                );

              return `
                <button
                  class="
                    journal-story-thumb
                    ${
                      index ===
                      activeEntryIndex
                        ? "is-active"
                        : ""
                    }
                  "
                  type="button"
                  data-story-thumb="${index}"
                  aria-label="מעבר לתמונה ${
                    index + 1
                  }"
                >
                  <img
                    src="${escapeAttr(
                      thumbUrl
                    )}"
                    alt=""
                    loading="lazy"
                  >
                </button>
              `;
            }
          )
          .join("");

      thumbsEl
        .querySelectorAll(
          "[data-story-thumb]"
        )
        .forEach(
          (button) => {
            button.addEventListener(
              "click",
              () => {
                activeEntryIndex =
                  Number(
                    button.dataset
                      .storyThumb ||
                      0
                  );

                updateStory();
              }
            );
          }
        );

      const activeThumb =
        thumbsEl.querySelector(
          ".journal-story-thumb.is-active"
        );

      activeThumb?.scrollIntoView(
        {
          behavior:
            "smooth",

          inline:
            "center",

          block:
            "nearest",
        }
      );
    }
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
          <em>
            MEMORIES LOADING.
          </em>
        </h3>

        <p>
          היומן לא הצליח להיטען כרגע.
          התמונות עצמן נשארות שמורות בענן.
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

    document
      .getElementById(
        "journalRetryBtn"
      )
      ?.addEventListener(
        "click",
        () =>
          loadJournal(true)
      );
  }

  function publicImageUrl(path) {
    const encodedPath =
      String(
        path ||
          ""
      )
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

  function bgStyle(url) {
    return (
      `background-image:` +
      `url('${escapeAttr(
        url
      )}')`
    );
  }

  function getDateKey(value) {
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
        date.getMonth() +
          1
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

  function formatDateTime(value) {
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

  function formatDateEnglish(value) {
    if (!value) {
      return "MEMORY";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "MEMORY";
    }

    return new Intl
      .DateTimeFormat(
        "en-GB",
        {
          day:
            "2-digit",

          month:
            "short",

          year:
            "numeric",
        }
      )
      .format(date)
      .toUpperCase();
  }

  function preparePageNavigation() {
    if (
      "scrollRestoration"
      in history
    ) {
      history.scrollRestoration =
        "manual";
    }

    if (
      window.location.hash
    ) {
      history.replaceState(
        null,
        "",
        window.location.pathname +
          window.location.search
      );
    }
  }

  function installMobileNavigation() {
    const nav =
      document.querySelector(
        ".aviation-nav"
      );

    const desktopLinks =
      [
        ...document.querySelectorAll(
          ".nav-links a[href^='#']"
        ),
      ];

    if (
      !nav ||
      desktopLinks.length ===
        0 ||
      nav.querySelector(
        ".hagit-mobile-nav"
      )
    ) {
      return;
    }

    const mobileNav =
      document.createElement(
        "div"
      );

    mobileNav.className =
      "hagit-mobile-nav";

    mobileNav.setAttribute(
      "aria-label",
      "ניווט באתר"
    );

    const links =
      desktopLinks
        .map(
          (link) => {
            const href =
              link.getAttribute(
                "href"
              ) || "";

            const text =
              link.textContent
                ?.trim() ||
              "";

            return `
              <a
                href="${escapeAttr(
                  href
                )}"
                data-mobile-nav-link
              >
                ${escapeHtml(
                  text
                )}
              </a>
            `;
          }
        )
        .join("");

    mobileNav.innerHTML = `
      <div
        class="hagit-mobile-nav-track"
      >
        <a
          href="#top"
          data-mobile-nav-link
        >
          ראשי
        </a>

        ${links}
      </div>
    `;

    nav.appendChild(
      mobileNav
    );
  }

  function bindAnchorNavigation() {
    document.addEventListener(
      "click",
      (event) => {
        const anchor =
          event.target.closest(
            "a[href^='#']"
          );

        if (!anchor) {
          return;
        }

        const href =
          anchor.getAttribute(
            "href"
          ) || "";

        if (
          href === "#" ||
          href.length < 2
        ) {
          return;
        }

        const target =
          document.querySelector(
            href
          );

        if (!target) {
          return;
        }

        event.preventDefault();

        const nav =
          document.querySelector(
            ".aviation-nav"
          );

        const navHeight =
          nav
            ? nav.getBoundingClientRect()
                .height
            : 0;

        const top =
          target.getBoundingClientRect()
            .top +
          window.scrollY -
          navHeight -
          12;

        window.scrollTo(
          {
            top:
              Math.max(
                0,
                top
              ),

            behavior:
              "smooth",
          }
        );

        history.replaceState(
          null,
          "",
          window.location.pathname +
            window.location.search
        );
      }
    );
  }

  function observeSections() {
    if (
      !(
        "IntersectionObserver"
        in window
      )
    ) {
      return;
    }

    const ids = [
      "top",
      "route",
      "journal",
      "weather",
      "hotels",
      "attractions",
      "watch",
      "packing",
    ];

    const sections =
      ids
        .map(
          (id) =>
            document.getElementById(
              id
            )
        )
        .filter(Boolean);

    if (!sections.length) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const visible =
            entries
              .filter(
                (entry) =>
                  entry.isIntersecting
              )
              .sort(
                (a, b) =>
                  b.intersectionRatio -
                  a.intersectionRatio
              )[0];

          if (!visible) {
            return;
          }

          const activeId =
            visible.target.id;

          document
            .querySelectorAll(
              "[data-mobile-nav-link]"
            )
            .forEach(
              (link) => {
                const active =
                  link.getAttribute(
                    "href"
                  ) ===
                  `#${activeId}`;

                link.classList.toggle(
                  "is-active",
                  active
                );

                if (
                  active &&
                  window.innerWidth <=
                    900
                ) {
                  link.scrollIntoView(
                    {
                      behavior:
                        "smooth",

                      inline:
                        "center",

                      block:
                        "nearest",
                    }
                  );
                }
              }
            );
        },

        {
          rootMargin:
            "-28% 0px -60% 0px",

          threshold: [
            0,
            0.05,
            0.15,
          ],
        }
      );

    sections.forEach(
      (section) =>
        observer.observe(
          section
        )
    );
  }

  function injectStyles() {
    document
      .getElementById(
        "hagitJournalLiveStyles"
      )
      ?.remove();

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "hagitJournalLiveStyles";

    style.textContent = `

      /*
        ======================================
        HAGIT 60
        20 CHAPTERS · ONE JOURNEY
        ======================================
      */

      .journal-chapters-grid {
        display:
          grid !important;

        grid-template-columns:
          repeat(
            4,
            minmax(
              0,
              1fr
            )
          ) !important;

        gap:
          24px !important;

        align-items:
          start;
      }

      .journal-chapter-card {
        position:
          relative;

        display:
          block;

        width:
          100%;

        padding:
          11px
          8px
          8px;

        border:
          0;

        background:
          transparent;

        color:
          white;

        text-align:
          inherit;

        overflow:
          visible;

        isolation:
          isolate;
      }

      .journal-chapter-stack {
        position:
          relative;

        display:
          block;

        aspect-ratio:
          .72;

        margin-bottom:
          12px;
      }

      .journal-chapter-front,
      .journal-chapter-back {
        position:
          absolute;

        inset:
          0;

        display:
          block;

        border-radius:
          15px;

        background-position:
          center;

        background-size:
          cover;

        background-color:
          #120b19;

        box-shadow:
          0 24px 70px
          rgba(
            0,
            0,
            0,
            .46
          );

        transition:
          .32s transform,
          .32s border-color,
          .32s filter;
      }

      .journal-chapter-back {
        border:
          1px solid
          rgba(
            228,
            205,
            255,
            .15
          );

        filter:
          saturate(.72)
          brightness(.72);
      }

      .journal-chapter-back-one {
        z-index:
          -1;

        transform:
          translate(
            9px,
            -6px
          )
          rotate(
            3.4deg
          )
          scale(
            .965
          );
      }

      .journal-chapter-back-two {
        z-index:
          -2;

        transform:
          translate(
            -9px,
            -2px
          )
          rotate(
            -3.2deg
          )
          scale(
            .94
          );
      }

      .journal-chapter-front {
        z-index:
          2;

        overflow:
          hidden;

        border:
          1px solid
          rgba(
            229,
            205,
            255,
            .17
          );
      }

      .journal-chapter-image-shade {
        position:
          absolute;

        inset:
          0;

        background:
          linear-gradient(
            to top,
            rgba(
              4,
              2,
              7,
              .96
            )
            0%,

            rgba(
              4,
              2,
              7,
              .62
            )
            27%,

            rgba(
              4,
              2,
              7,
              .05
            )
            62%,

            rgba(
              4,
              2,
              7,
              .18
            )
            100%
          ),

          linear-gradient(
            120deg,
            rgba(
              121,
              58,
              183,
              .08
            ),
            transparent
            48%
          );
      }

      .journal-chapter-day {
        position:
          absolute;

        z-index:
          4;

        top:
          8px;

        left:
          12px;

        font:
          300
          clamp(
            56px,
            5.2vw,
            82px
          )/1
          "Montserrat",
          sans-serif;

        letter-spacing:
          -.08em;

        color:
          rgba(
            247,
            239,
            255,
            .32
          );

        text-shadow:
          0 1px 18px
          rgba(
            0,
            0,
            0,
            .22
          );
      }

      .journal-chapter-stamp {
        position:
          absolute;

        z-index:
          4;

        top:
          14px;

        right:
          14px;

        width:
          51px;

        height:
          51px;

        display:
          grid;

        place-content:
          center;

        gap:
          0;

        border:
          1px solid
          rgba(
            246,
            215,
            157,
            .65
          );

        border-radius:
          50%;

        color:
          #f5d8a4;

        transform:
          rotate(
            8deg
          );

        background:
          rgba(
            10,
            6,
            15,
            .28
          );

        backdrop-filter:
          blur(
            8px
          );

        -webkit-backdrop-filter:
          blur(
            8px
          );
      }

      .journal-chapter-stamp:before {
        content:
          "";

        position:
          absolute;

        inset:
          4px;

        border:
          1px dashed
          rgba(
            246,
            215,
            157,
            .38
          );

        border-radius:
          50%;
      }

      .journal-chapter-stamp b,
      .journal-chapter-stamp small {
        position:
          relative;

        z-index:
          2;

        text-align:
          center;
      }

      .journal-chapter-stamp b {
        font:
          600
          10px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .08em;
      }

      .journal-chapter-stamp small {
        font:
          500
          7px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .18em;
      }

      .journal-chapter-copy {
        position:
          absolute;

        z-index:
          6;

        left:
          22px;

        right:
          22px;

        bottom:
          24px;

        display:
          flex;

        flex-direction:
          column;

        align-items:
          flex-start;

        text-align:
          left;

        pointer-events:
          none;
      }

      .journal-chapter-title {
        max-width:
          100%;

        color:
          #fff;

        font:
          400
          clamp(
            18px,
            1.65vw,
            26px
          )/1.05
          "Montserrat",
          sans-serif;

        letter-spacing:
          -.045em;

        text-shadow:
          0 3px 22px
          rgba(
            0,
            0,
            0,
            .68
          );
      }

      .journal-chapter-date {
        margin-top:
          8px;

        color:
          #dfd4e5;

        font:
          500
          9px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .10em;
      }

      .journal-chapter-count {
        margin-top:
          10px;

        color:
          #f4d79f;

        font:
          500
          9px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .09em;
      }

      .journal-chapter-quote {
        width:
          100%;

        margin-top:
          14px;

        padding-top:
          12px;

        border-top:
          1px solid
          rgba(
            255,
            255,
            255,
            .16
          );

        color:
          #efe4f2;

        font:
          300
          12px/1.55
          "Heebo",
          sans-serif;

        text-align:
          right;

        direction:
          rtl;
      }

      .journal-chapter-quote-empty {
        color:
          #b8a7bf;

        text-align:
          left;

        direction:
          ltr;

        font:
          500
          8px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .16em;
      }

      .journal-chapter-card:hover
      .journal-chapter-front {
        transform:
          translateY(
            -6px
          );

        border-color:
          rgba(
            246,
            215,
            157,
            .78
          );
      }

      .journal-chapter-card:hover
      .journal-chapter-back-one {
        transform:
          translate(
            15px,
            -11px
          )
          rotate(
            5deg
          )
          scale(
            .965
          );
      }

      .journal-chapter-card:hover
      .journal-chapter-back-two {
        transform:
          translate(
            -15px,
            -5px
          )
          rotate(
            -5deg
          )
          scale(
            .94
          );
      }

      .journal-chapter-footer-copy {
        display:
          flex;

        flex-direction:
          column;

        gap:
          3px;
      }

      .journal-chapter-footer-copy span {
        color:
          #a99cad;

        font-size:
          12px;
      }

      .journal-refresh-btn {
        flex:
          0 0 auto;

        border:
          1px solid
          rgba(
            218,
            183,
            255,
            .18
          );

        border-radius:
          999px;

        padding:
          9px
          13px;

        background:
          rgba(
            255,
            255,
            255,
            .04
          );

        color:
          #eee4f5;
      }

      /*
        STORY MODE
      */

      .journal-story-viewer {
        position:
          fixed;

        z-index:
          100000;

        inset:
          0;

        display:
          none;

        padding:
          20px;

        background:
          rgba(
            3,
            2,
            6,
            .96
          );

        backdrop-filter:
          blur(
            20px
          );

        -webkit-backdrop-filter:
          blur(
            20px
          );
      }

      .journal-story-viewer.is-open {
        display:
          grid;

        place-items:
          center;
      }

      body.journal-story-open {
        overflow:
          hidden;
      }

      .journal-story-shell {
        width:
          min(
            1280px,
            100%
          );

        height:
          min(
            920px,
            calc(
              100vh -
              40px
            )
          );

        display:
          grid;

        grid-template-rows:
          auto
          minmax(
            0,
            1fr
          )
          auto;

        overflow:
          hidden;

        border:
          1px solid
          rgba(
            230,
            208,
            255,
            .16
          );

        border-radius:
          18px;

        background:
          #08050d;

        box-shadow:
          0 45px 140px
          rgba(
            0,
            0,
            0,
            .72
          );
      }

      .journal-story-topbar {
        min-height:
          68px;

        display:
          grid;

        grid-template-columns:
          1fr
          auto
          1fr;

        align-items:
          center;

        gap:
          18px;

        padding:
          13px
          18px;

        border-bottom:
          1px solid
          rgba(
            229,
            205,
            255,
            .10
          );

        background:
          rgba(
            8,
            5,
            13,
            .96
          );
      }

      .journal-story-back {
        justify-self:
          start;

        border:
          0;

        background:
          transparent;

        color:
          #c9b9d1;

        font:
          500
          11px
          "Heebo",
          sans-serif;
      }

      .journal-story-heading {
        text-align:
          center;
      }

      .journal-story-heading strong {
        display:
          block;

        color:
          #f8effd;

        font:
          500
          13px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .10em;
      }

      .journal-story-heading small {
        display:
          block;

        margin-top:
          4px;

        color:
          #94869b;

        font:
          500
          8px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .12em;
      }

      .journal-story-counter {
        justify-self:
          end;

        color:
          #d4c2db;

        font:
          500
          10px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .14em;
      }

      .journal-story-stage {
        position:
          relative;

        min-height:
          0;

        overflow:
          hidden;

        background:
          #050307;
      }

      .journal-story-bg {
        position:
          absolute;

        inset:
          -40px;

        background-position:
          center;

        background-size:
          cover;

        filter:
          blur(
            34px
          )
          saturate(
            .62
          )
          brightness(
            .28
          );

        transform:
          scale(
            1.12
          );

        opacity:
          .8;
      }

      .journal-story-image {
        position:
          absolute;

        z-index:
          2;

        inset:
          0;

        width:
          100%;

        height:
          100%;

        object-fit:
          contain;
      }

      .journal-story-vignette {
        position:
          absolute;

        z-index:
          3;

        inset:
          0;

        pointer-events:
          none;

        background:
          linear-gradient(
            to top,
            rgba(
              4,
              2,
              7,
              .94
            )
            0%,

            rgba(
              4,
              2,
              7,
              .55
            )
            20%,

            transparent
            46%
          ),

          linear-gradient(
            to bottom,
            rgba(
              4,
              2,
              7,
              .18
            ),
            transparent
            20%
          );
      }

      .journal-story-copy {
        position:
          absolute;

        z-index:
          5;

        right:
          clamp(
            24px,
            5vw,
            76px
          );

        left:
          clamp(
            24px,
            5vw,
            76px
          );

        bottom:
          28px;

        max-width:
          720px;

        margin:
          auto;

        text-align:
          center;

        text-shadow:
          0 2px 22px
          rgba(
            0,
            0,
            0,
            .7
          );
      }

      .journal-story-meta {
        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        flex-wrap:
          wrap;

        gap:
          8px;

        color:
          #d3c5d8;

        font-size:
          11px;
      }

      .journal-story-meta span {
        padding:
          6px
          9px;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .16
          );

        border-radius:
          999px;

        background:
          rgba(
            5,
            3,
            8,
            .36
          );

        backdrop-filter:
          blur(
            10px
          );

        -webkit-backdrop-filter:
          blur(
            10px
          );
      }

      .journal-story-copy blockquote {
        margin:
          14px
          auto
          0;

        max-width:
          660px;

        color:
          #fff8ff;

        font:
          300
          clamp(
            20px,
            2.1vw,
            32px
          )/1.35
          "Heebo",
          sans-serif;
      }

      .journal-story-copy blockquote:before {
        content:
          "“";

        display:
          block;

        height:
          20px;

        color:
          #f6d79d;

        font:
          500
          44px/1
          "Cormorant Garamond",
          serif;
      }

      .journal-story-copy blockquote.is-empty {
        color:
          #a99bab;

        font-style:
          italic;
      }

      .journal-story-arrow {
        position:
          absolute;

        z-index:
          8;

        top:
          50%;

        transform:
          translateY(
            -50%
          );

        width:
          52px;

        height:
          52px;

        display:
          grid;

        place-items:
          center;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .19
          );

        border-radius:
          50%;

        background:
          rgba(
            8,
            5,
            14,
            .54
          );

        color:
          white;

        font:
          300
          36px/1
          "Montserrat",
          sans-serif;

        backdrop-filter:
          blur(
            14px
          );

        -webkit-backdrop-filter:
          blur(
            14px
          );
      }

      .journal-story-prev {
        left:
          20px;
      }

      .journal-story-next {
        right:
          20px;
      }

      .journal-story-arrow:disabled {
        opacity:
          .14;

        pointer-events:
          none;
      }

      .journal-story-thumbs {
        min-height:
          92px;

        display:
          flex;

        gap:
          8px;

        align-items:
          center;

        overflow-x:
          auto;

        padding:
          10px
          14px;

        background:
          #08050d;

        border-top:
          1px solid
          rgba(
            229,
            205,
            255,
            .09
          );

        scrollbar-width:
          none;
      }

      .journal-story-thumbs::-webkit-scrollbar {
        display:
          none;
      }

      .journal-story-thumb {
        flex:
          0 0 74px;

        width:
          74px;

        height:
          68px;

        padding:
          0;

        overflow:
          hidden;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .12
          );

        border-radius:
          7px;

        background:
          #110a18;

        opacity:
          .58;

        transition:
          .2s opacity,
          .2s border-color,
          .2s transform;
      }

      .journal-story-thumb img {
        width:
          100%;

        height:
          100%;

        object-fit:
          cover;

        display:
          block;
      }

      .journal-story-thumb.is-active {
        opacity:
          1;

        border-color:
          #f4d79f;

        transform:
          translateY(
            -2px
          );
      }

      /*
        EMPTY
      */

      .journal-live-empty {
        min-height:
          330px;

        display:
          grid !important;

        grid-template-columns:
          auto
          minmax(
            0,
            1fr
          ) !important;

        gap:
          34px !important;

        align-items:
          center;

        padding:
          34px;

        border:
          1px solid
          rgba(
            220,
            187,
            255,
            .13
          );

        border-radius:
          24px;

        background:
          radial-gradient(
            circle
            at 18% 50%,
            rgba(
              141,
              70,
              255,
              .16
            ),
            transparent
            28%
          ),

          linear-gradient(
            145deg,
            rgba(
              18,
              9,
              31,
              .92
            ),
            rgba(
              7,
              4,
              13,
              .96
            )
          );
      }

      .journal-empty-orbit {
        position:
          relative;

        width:
          180px;

        height:
          180px;

        display:
          grid;

        place-items:
          center;

        border:
          1px solid
          rgba(
            223,
            194,
            255,
            .10
          );

        border-radius:
          50%;
      }

      .journal-empty-orbit:before,
      .journal-empty-orbit:after {
        content:
          "";

        position:
          absolute;

        inset:
          18px;

        border:
          1px solid
          rgba(
            223,
            194,
            255,
            .08
          );

        border-radius:
          50%;
      }

      .journal-empty-orbit:after {
        inset:
          38px;
      }

      .journal-empty-orbit b {
        font:
          italic
          500
          62px/1
          "Cormorant Garamond",
          serif;

        color:
          #ead9f7;
      }

      .journal-empty-orbit span {
        position:
          absolute;

        top:
          18px;

        right:
          27px;

        color:
          #ff86cc;
      }

      .journal-empty-orbit i {
        position:
          absolute;

        width:
          7px;

        height:
          7px;

        border-radius:
          50%;

        background:
          #cda7ff;

        left:
          24px;

        bottom:
          40px;

        box-shadow:
          0 0 18px
          #9f62ff;
      }

      .journal-empty-copy small {
        color:
          #a590b2;

        font:
          500
          9px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .19em;
      }

      .journal-empty-copy h3 {
        margin:
          10px
          0
          14px;

        font:
          400
          clamp(
            42px,
            7vw,
            80px
          )/.82
          "Cormorant Garamond",
          serif;

        color:
          #f6edfb;
      }

      .journal-empty-copy h3 em {
        color:
          #cf9aff;
      }

      .journal-empty-copy p {
        color:
          #b9aabc;

        max-width:
          620px;
      }

      .journal-empty-status {
        color:
          #cdbbd5;

        font-size:
          12px;
      }

      /*
        MOBILE NAV
      */

      .aviation-nav {
        position:
          sticky;

        top:
          0;

        z-index:
          9000;
      }

      .hagit-mobile-nav {
        display:
          none;
      }

      @media (
        max-width:
          1050px
      ) {

        .journal-chapters-grid {
          grid-template-columns:
            repeat(
              3,
              minmax(
                0,
                1fr
              )
            ) !important;
        }

      }

      @media (
        max-width:
          900px
      ) {

        .aviation-nav .nav-links {
          display:
            none !important;
        }

        .hagit-mobile-nav {
          display:
            block;

          width:
            100%;

          border-top:
            1px solid
            rgba(
              218,
              184,
              255,
              .08
            );

          border-bottom:
            1px solid
            rgba(
              218,
              184,
              255,
              .10
            );

          background:
            rgba(
              8,
              5,
              16,
              .94
            );

          backdrop-filter:
            blur(
              22px
            );

          -webkit-backdrop-filter:
            blur(
              22px
            );
        }

        .hagit-mobile-nav-track {
          direction:
            rtl;

          display:
            flex;

          align-items:
            center;

          gap:
            7px;

          overflow-x:
            auto;

          padding:
            8px
            12px
            9px;

          scrollbar-width:
            none;

          -webkit-overflow-scrolling:
            touch;
        }

        .hagit-mobile-nav-track::-webkit-scrollbar {
          display:
            none;
        }

        .hagit-mobile-nav a {
          flex:
            0 0 auto;

          text-decoration:
            none;

          padding:
            7px
            11px;

          border:
            1px solid
            rgba(
              219,
              188,
              255,
              .11
            );

          border-radius:
            999px;

          background:
            rgba(
              255,
              255,
              255,
              .025
            );

          color:
            #b9a9c5;

          font-size:
            11px;

          font-weight:
            500;

          white-space:
            nowrap;
        }

        .hagit-mobile-nav a.is-active {
          color:
            #160b25;

          background:
            linear-gradient(
              120deg,
              #f2e9ff,
              #d2afff
            );

          border-color:
            transparent;
        }

        .journal-chapters-grid {
          grid-template-columns:
            repeat(
              2,
              minmax(
                0,
                1fr
              )
            ) !important;

          gap:
            20px !important;
        }

      }

      @media (
        max-width:
          620px
      ) {

        .journal-chapters-grid {
          grid-template-columns:
            1fr !important;

          gap:
            20px !important;
        }

        .journal-chapter-card {
          max-width:
            390px;

          margin:
            0 auto;

          padding:
            10px
            13px
            8px;
        }

        .journal-chapter-stack {
          aspect-ratio:
            .84;
        }

        .journal-chapter-copy {
          left:
            26px;

          right:
            26px;

          bottom:
            28px;
        }

        .journal-chapter-title {
          font-size:
            25px;
        }

        .journal-chapter-day {
          font-size:
            72px;
        }

        .journal-story-viewer {
          padding:
            0;
        }

        .journal-story-shell {
          width:
            100%;

          height:
            100%;

          border:
            0;

          border-radius:
            0;

          grid-template-rows:
            auto
            minmax(
              0,
              1fr
            )
            auto;
        }

        .journal-story-topbar {
          min-height:
            64px;

          grid-template-columns:
            1fr
            auto;

          padding:
            max(
              11px,
              env(
                safe-area-inset-top
              )
            )
            12px
            10px;
        }

        .journal-story-heading {
          display:
            none;
        }

        .journal-story-back {
          font-size:
            10px;
        }

        .journal-story-counter {
          font-size:
            9px;
        }

        .journal-story-arrow {
          width:
            40px;

          height:
            40px;

          font-size:
            28px;
        }

        .journal-story-prev {
          left:
            10px;
        }

        .journal-story-next {
          right:
            10px;
        }

        .journal-story-copy {
          left:
            18px;

          right:
            18px;

          bottom:
            22px;
        }

        .journal-story-copy blockquote {
          font-size:
            19px;

          line-height:
            1.35;
        }

        .journal-story-meta {
          font-size:
            9px;

          gap:
            5px;
        }

        .journal-story-meta span {
          padding:
            5px
            7px;
        }

        .journal-story-thumbs {
          min-height:
            82px;

          padding:
            8px
            10px
            calc(
              8px +
              env(
                safe-area-inset-bottom
              )
            );
        }

        .journal-story-thumb {
          flex-basis:
            62px;

          width:
            62px;

          height:
            58px;
        }

        .journal-live-empty {
          grid-template-columns:
            1fr !important;

          text-align:
            center;

          padding:
            30px
            18px;
        }

        .journal-empty-orbit {
          margin:
            auto;

          width:
            150px;

          height:
            150px;
        }

        .journal-coming {
          flex-direction:
            column;

          align-items:
            stretch;
        }

        .journal-refresh-btn {
          width:
            100%;
        }

      }
    `;

    document.head.appendChild(
      style
    );
  }

  function truncate(
    value,
    maxLength
  ) {
    const text =
      String(
        value ||
          ""
      );

    return (
      text.length >
      maxLength
        ? `${text
            .slice(
              0,
              maxLength -
                1
            )
            .trim()}…`
        : text
    );
  }

  function escapeHtml(value) {
    return String(
      value ??
        ""
    ).replace(
      /[&<>"']/g,
      (character) =>
        ({
          "&":
            "&amp;",

          "<":
            "&lt;",

          ">":
            "&gt;",

          '"':
            "&quot;",

          "'":
            "&#39;",
        })[
          character
        ]
    );
  }

  function escapeAttr(value) {
    return escapeHtml(
      value
    ).replace(
      /`/g,
      "&#96;"
    );
  }
})();
