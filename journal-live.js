(() => {
  "use strict";

  const SUPABASE_URL =
    "https://fqoziqglyrcjttnuismx.supabase.co";

  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_2Z_EWufBUdNlSvesyg2bmA_7obNjRsI";

  const BUCKET = "journal-photos";
  const REFRESH_MS = 30000;

  const journalSection =
    document.getElementById("journal");

  if (!journalSection) {
    return;
  }

  const preview =
    journalSection.querySelector(
      ".journal-preview"
    );

  const coming =
    journalSection.querySelector(
      ".journal-coming"
    );

  const cloudNote =
    journalSection.querySelector(
      ".journal-cloud-note"
    );

  if (!preview) {
    return;
  }

  const carouselPositions =
    new Map();

  let isLoading = false;
  let lastPayload = "";

  preparePageNavigation();
  injectStyles();
  installMobileNavigation();
  bindAnchorNavigation();
  observeSections();

  if (cloudNote) {
    cloudNote.innerHTML = `
      <span>☁️</span>

      <div>
        <b>
          יומן חי מהאייפון של חגית
        </b>

        <small>
          כל תמונה שחגית משתפת
          מופיעה כאן אוטומטית,
          מסודרת לפי יום,
          עם הכיתוב, התאריך
          והמיקום שלה.
        </small>
      </div>
    `;
  }

  if (coming) {
    coming.innerHTML = `
      <div
        class="journal-live-footer-copy"
      >
        <b>
          📸 HAGIT'S LIVE DIARY
        </b>

        <span>
          החליקו בין התמונות בכל יום —
          היומן מתעדכן אוטומטית
          לאורך הטיול.
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

  preview.id =
    "journalLiveGallery";

  preview.setAttribute(
    "aria-live",
    "polite"
  );

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
      refreshButton.disabled =
        true;

      refreshButton.textContent =
        "מרענן…";
    }

    try {
      const endpoint =
        `${SUPABASE_URL}` +
        `/rest/v1/journal_entries` +
        `?select=` +
        `id,created_at,taken_at,` +
        `location_name,day_number,` +
        `caption,image_path` +
        `&order=` +
        `taken_at.asc.nullslast,` +
        `created_at.asc`;

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
        JSON.stringify(
          entries
        );

      if (
        payload !==
        lastPayload
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

  function render(
    entries
  ) {
    if (
      !Array.isArray(
        entries
      ) ||
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

        <div
          class="journal-empty-copy"
        >
          <small>
            HAGIT'S USA DIARY ·
            WAITING FOR PAGE ONE
          </small>

          <h3 dir="ltr">
            THE STORY<br>
            <em>
              STARTS HERE.
            </em>
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

    const groups =
      groupEntries(
        entries
      );

    preview.className =
      "journal-live-days";

    preview.innerHTML =
      groups
        .map(
          renderGroup
        )
        .join("");

    bindCarousels();
    bindLightboxButtons();
  }

  function groupEntries(
    entries
  ) {
    const grouped =
      new Map();

    for (
      const entry of
      entries
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
        !grouped.has(
          key
        )
      ) {
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
        .push(
          entry
        );
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

        if (
          a.dayNumber
        ) {
          return -1;
        }

        if (
          b.dayNumber
        ) {
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

    const label =
      group.dayNumber
        ? `DAY ${String(
            group.dayNumber
          ).padStart(
            2,
            "0"
          )}`
        : "MEMORY";

    const count =
      group.entries.length;

    const countText =
      count === 1
        ? "זיכרון אחד"
        : `${count} זיכרונות`;

    const startIndex =
      Math.min(
        carouselPositions.get(
          group.key
        ) || 0,

        Math.max(
          count - 1,
          0
        )
      );

    return `
      <section
        class="journal-day-block"
        data-carousel-group="${escapeAttr(
          group.key
        )}"
        data-start-index="${startIndex}"
      >
        <header
          class="journal-day-head"
        >
          <div
            class="journal-day-title-row"
          >
            <span
              class="journal-day-label"
            >
              ${escapeHtml(
                label
              )}
            </span>

            <span
              class="journal-day-count"
            >
              ${escapeHtml(
                countText
              )}
            </span>
          </div>

          <div
            class="journal-day-date"
          >
            ${escapeHtml(
              date
            )}
          </div>
        </header>

        <div
          class="journal-carousel-shell"
        >
          <div
            class="journal-carousel-track"
            data-carousel-track
            aria-label="תמונות מהיום הזה"
          >
            ${group.entries
              .map(
                (
                  entry,
                  index
                ) =>
                  renderSlide(
                    entry,
                    index,
                    count
                  )
              )
              .join("")}
          </div>

          ${
            count > 1
              ? `
                <button
                  class="
                    journal-carousel-arrow
                    journal-carousel-prev
                  "
                  type="button"
                  data-carousel-prev
                  aria-label="לתמונה הקודמת"
                >
                  ‹
                </button>

                <button
                  class="
                    journal-carousel-arrow
                    journal-carousel-next
                  "
                  type="button"
                  data-carousel-next
                  aria-label="לתמונה הבאה"
                >
                  ›
                </button>
              `
              : ""
          }
        </div>

        <div
          class="journal-carousel-bottom"
        >
          <div
            class="journal-carousel-dots"
            data-carousel-dots
          >
            ${
              count > 1
                ? group.entries
                    .map(
                      (
                        _,
                        index
                      ) => `
                        <button
                          type="button"
                          class="
                            journal-carousel-dot
                            ${
                              index ===
                              startIndex
                                ? "is-active"
                                : ""
                            }
                          "
                          data-carousel-dot="${index}"
                          aria-label="מעבר לתמונה ${
                            index + 1
                          }"
                        ></button>
                      `
                    )
                    .join("")
                : ""
            }
          </div>

          <span
            class="journal-carousel-counter"
            data-carousel-counter
          >
            ${startIndex + 1} / ${count}
          </span>
        </div>
      </section>
    `;
  }

  function renderSlide(
    entry,
    index,
    count
  ) {
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

    const meta =
      [
        location,
        dateTime,
      ]
        .filter(
          Boolean
        )
        .join(" · ");

    return `
      <article
        class="journal-carousel-slide"
        data-carousel-slide
        aria-label="תמונה ${
          index + 1
        } מתוך ${count}"
      >
        <button
          class="journal-slide-photo"
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
          aria-label="פתיחת התמונה במסך מלא"
        >
          <img
            class="journal-photo-blur"
            src="${escapeAttr(
              imageUrl
            )}"
            alt=""
            aria-hidden="true"
          >

          <img
            class="journal-photo-main"
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
          class="journal-slide-copy"
          dir="rtl"
        >
          <div
            class="journal-memory-meta"
          >
            ${
              location
                ? `
                  <span
                    class="journal-location"
                  >
                    📍
                    ${escapeHtml(
                      location
                    )}
                  </span>
                `
                : ""
            }

            ${
              dateTime
                ? `
                  <span>
                    🕒
                    ${escapeHtml(
                      dateTime
                    )}
                  </span>
                `
                : ""
            }
          </div>

          <p
            class="
              journal-memory-caption
              ${
                caption
                  ? ""
                  : "journal-memory-caption-empty"
              }
            "
          >
            ${
              caption
                ? `״${escapeHtml(
                    caption
                  )}״`
                : "רגע ששווה לשמור."
            }
          </p>
        </div>
      </article>
    `;
  }

  function bindCarousels() {
    preview
      .querySelectorAll(
        "[data-carousel-group]"
      )
      .forEach(
        (
          groupEl
        ) => {
          const key =
            groupEl.dataset
              .carouselGroup ||
            "";

          const track =
            groupEl.querySelector(
              "[data-carousel-track]"
            );

          const slides =
            [
              ...groupEl.querySelectorAll(
                "[data-carousel-slide]"
              ),
            ];

          const prev =
            groupEl.querySelector(
              "[data-carousel-prev]"
            );

          const next =
            groupEl.querySelector(
              "[data-carousel-next]"
            );

          const counter =
            groupEl.querySelector(
              "[data-carousel-counter]"
            );

          const dots =
            [
              ...groupEl.querySelectorAll(
                "[data-carousel-dot]"
              ),
            ];

          if (
            !track ||
            slides.length === 0
          ) {
            return;
          }

          let index =
            Math.min(
              Number(
                groupEl.dataset
                  .startIndex ||
                  0
              ),

              slides.length -
                1
            );

          let raf = 0;

          const updateUi =
            (
              nextIndex
            ) => {
              index =
                Math.max(
                  0,
                  Math.min(
                    nextIndex,
                    slides.length -
                      1
                  )
                );

              carouselPositions.set(
                key,
                index
              );

              if (
                counter
              ) {
                counter.textContent =
                  `${index + 1} / ${slides.length}`;
              }

              dots.forEach(
                (
                  dot,
                  dotIndex
                ) => {
                  dot.classList.toggle(
                    "is-active",
                    dotIndex ===
                      index
                  );
                }
              );

              if (prev) {
                prev.disabled =
                  index === 0;
              }

              if (next) {
                next.disabled =
                  index ===
                  slides.length -
                    1;
              }
            };

          const goTo =
            (
              nextIndex,
              behavior =
                "smooth"
            ) => {
              const safeIndex =
                Math.max(
                  0,
                  Math.min(
                    nextIndex,
                    slides.length -
                      1
                  )
                );

              track.scrollTo(
                {
                  left:
                    safeIndex *
                    track.clientWidth,

                  behavior,
                }
              );

              updateUi(
                safeIndex
              );
            };

          if (prev) {
            prev.addEventListener(
              "click",
              () =>
                goTo(
                  index - 1
                )
            );
          }

          if (next) {
            next.addEventListener(
              "click",
              () =>
                goTo(
                  index + 1
                )
            );
          }

          dots.forEach(
            (dot) => {
              dot.addEventListener(
                "click",
                () => {
                  goTo(
                    Number(
                      dot.dataset
                        .carouselDot ||
                        0
                    )
                  );
                }
              );
            }
          );

          track.addEventListener(
            "scroll",
            () => {
              cancelAnimationFrame(
                raf
              );

              raf =
                requestAnimationFrame(
                  () => {
                    if (
                      !track.clientWidth
                    ) {
                      return;
                    }

                    const visibleIndex =
                      Math.round(
                        track.scrollLeft /
                          track.clientWidth
                      );

                    updateUi(
                      visibleIndex
                    );
                  }
                );
            },
            {
              passive: true,
            }
          );

          window.addEventListener(
            "resize",
            debounce(
              () =>
                goTo(
                  index,
                  "auto"
                ),
              120
            )
          );

          requestAnimationFrame(
            () =>
              goTo(
                index,
                "auto"
              )
          );

          updateUi(index);
        }
      );
  }

  function bindLightboxButtons() {
    preview
      .querySelectorAll(
        "[data-journal-image]"
      )
      .forEach(
        (
          button
        ) => {
          button.addEventListener(
            "click",
            () => {
              openLightbox(
                button.dataset
                  .src ||
                  "",

                button.dataset
                  .caption ||
                  "",

                button.dataset
                  .meta ||
                  ""
              );
            }
          );
        }
      );
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
    if (!src) {
      return;
    }

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

      lightbox.setAttribute(
        "role",
        "dialog"
      );

      lightbox.setAttribute(
        "aria-modal",
        "true"
      );

      lightbox.innerHTML = `
        <button
          type="button"
          class="journal-lightbox-close"
          aria-label="סגירה"
        >
          ×
        </button>

        <div
          class="journal-lightbox-inner"
        >
          <img
            alt="תמונה מיומן המסע של חגית"
          >

          <div
            class="journal-lightbox-copy"
            dir="rtl"
          >
            <p></p>
            <small></small>
          </div>
        </div>
      `;

      document.body.appendChild(
        lightbox
      );

      const closeButton =
        lightbox.querySelector(
          ".journal-lightbox-close"
        );

      if (closeButton) {
        closeButton.addEventListener(
          "click",
          closeLightbox
        );
      }

      lightbox.addEventListener(
        "click",
        (
          event
        ) => {
          if (
            event.target ===
            lightbox
          ) {
            closeLightbox();
          }
        }
      );

      document.addEventListener(
        "keydown",
        (
          event
        ) => {
          if (
            event.key ===
            "Escape"
          ) {
            closeLightbox();
          }
        }
      );
    }

    const image =
      lightbox.querySelector(
        "img"
      );

    const captionEl =
      lightbox.querySelector(
        "p"
      );

    const metaEl =
      lightbox.querySelector(
        "small"
      );

    if (image) {
      image.src = src;
    }

    if (captionEl) {
      captionEl.textContent =
        caption
          ? `״${caption}״`
          : "";
    }

    if (metaEl) {
      metaEl.textContent =
        meta;
    }

    lightbox.classList.add(
      "is-open"
    );

    document.body.classList.add(
      "journal-lightbox-open"
    );
  }

  function closeLightbox() {
    const lightbox =
      document.getElementById(
        "journalLightbox"
      );

    if (lightbox) {
      lightbox.classList.remove(
        "is-open"
      );
    }

    document.body.classList.remove(
      "journal-lightbox-open"
    );
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

    const forceTop =
      () => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior:
            "auto",
        });
      };

    forceTop();

    requestAnimationFrame(
      forceTop
    );

    setTimeout(
      forceTop,
      80
    );
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

    const homeLink = `
      <a
        href="#top"
        data-mobile-nav-link
      >
        ראשי
      </a>
    `;

    const clonedLinks =
      desktopLinks
        .map(
          (
            link
          ) => {
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
        ${homeLink}
        ${clonedLinks}
      </div>
    `;

    nav.appendChild(
      mobileNav
    );
  }

  function bindAnchorNavigation() {
    document.addEventListener(
      "click",
      (
        event
      ) => {
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

        window.scrollTo({
          top:
            Math.max(
              0,
              top
            ),

          behavior:
            "smooth",
        });

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
    const targetIds = [
      "top",
      "route",
      "journal",
      "weather",
      "hotels",
      "attractions",
      "watch",
      "packing",
    ];

    const targets =
      targetIds
        .map(
          (
            id
          ) =>
            document.getElementById(
              id
            )
        )
        .filter(
          Boolean
        );

    if (
      !(
        "IntersectionObserver"
        in window
      ) ||
      targets.length === 0
    ) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (
          entries
        ) => {
          const visible =
            entries
              .filter(
                (
                  entry
                ) =>
                  entry.isIntersecting
              )
              .sort(
                (
                  a,
                  b
                ) =>
                  b.intersectionRatio -
                  a.intersectionRatio
              )[0];

          if (!visible) {
            return;
          }

          const id =
            visible.target.id;

          const links =
            [
              ...document.querySelectorAll(
                "[data-mobile-nav-link]"
              ),
            ];

          links.forEach(
            (
              link
            ) => {
              const active =
                link.getAttribute(
                  "href"
                ) ===
                `#${id}`;

              link.classList.toggle(
                "is-active",
                active
              );

              if (
                active &&
                window.innerWidth <=
                  900
              ) {
                centerMobileLink(
                  link
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

    targets.forEach(
      (
        target
      ) =>
        observer.observe(
          target
        )
    );
  }

  function centerMobileLink(
    link
  ) {
    const track =
      link.closest(
        ".hagit-mobile-nav-track"
      );

    if (!track) {
      return;
    }

    const linkCenter =
      link.offsetLeft +
      link.offsetWidth /
        2;

    const targetLeft =
      linkCenter -
      track.clientWidth /
        2;

    track.scrollTo({
      left:
        Math.max(
          0,
          targetLeft
        ),

      behavior:
        "smooth",
    });
  }

  function injectStyles() {
    const previousStyle =
      document.getElementById(
        "hagitJournalLiveStyles"
      );

    if (previousStyle) {
      previousStyle.remove();
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "hagitJournalLiveStyles";

    style.textContent = `
      /*
        ====================================
        HAGIT 60 — LIVE JOURNAL CAROUSEL
        ====================================
      */

      .journal-live-days {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 28px !important;
      }

      .journal-day-block {
        overflow: hidden;
        border:
          1px solid
          rgba(
            224,
            195,
            255,
            .14
          );

        border-radius:
          24px;

        background:
          radial-gradient(
            circle at 82% 10%,
            rgba(
              174,
              89,
              255,
              .12
            ),
            transparent 32%
          ),
          linear-gradient(
            145deg,
            rgba(
              22,
              11,
              39,
              .94
            ),
            rgba(
              8,
              5,
              16,
              .96
            )
          );

        box-shadow:
          0 28px 90px
          rgba(
            2,
            0,
            10,
            .35
          );
      }

      .journal-day-head {
        display: flex;
        align-items: end;
        justify-content:
          space-between;
        gap: 18px;

        padding:
          18px
          20px
          14px;

        border-bottom:
          1px solid
          rgba(
            222,
            190,
            255,
            .10
          );
      }

      .journal-day-title-row {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }

      .journal-day-label {
        font-family:
          "Montserrat",
          sans-serif;

        font-size:
          12px;

        letter-spacing:
          .22em;

        color:
          #e0c8ff;
      }

      .journal-day-count {
        padding:
          5px
          9px;

        border-radius:
          999px;

        border:
          1px solid
          rgba(
            219,
            185,
            255,
            .14
          );

        color:
          #a99bb6;

        font-size:
          10px;
      }

      .journal-day-date {
        color:
          #9d8eaa;

        font-family:
          "Montserrat",
          sans-serif;

        font-size:
          10px;

        letter-spacing:
          .08em;

        white-space:
          nowrap;
      }

      .journal-carousel-shell {
        position:
          relative;

        overflow:
          hidden;
      }

      .journal-carousel-track {
        direction:
          ltr;

        display:
          flex;

        width:
          100%;

        overflow-x:
          auto;

        overflow-y:
          hidden;

        scroll-snap-type:
          x mandatory;

        scroll-behavior:
          smooth;

        scrollbar-width:
          none;

        -ms-overflow-style:
          none;

        overscroll-behavior-inline:
          contain;

        touch-action:
          pan-x pan-y;
      }

      .journal-carousel-track::-webkit-scrollbar {
        display:
          none;
      }

      .journal-carousel-slide {
        direction:
          rtl;

        flex:
          0 0 100%;

        width:
          100%;

        min-width:
          100%;

        scroll-snap-align:
          start;

        scroll-snap-stop:
          always;
      }

      .journal-slide-photo {
        position:
          relative;

        display:
          block;

        width:
          100%;

        height:
          clamp(
            390px,
            52vw,
            620px
          );

        padding:
          0;

        overflow:
          hidden;

        border:
          0;

        border-radius:
          0;

        background:
          #07040d;

        color:
          white;
      }

      .journal-photo-blur,
      .journal-photo-main {
        position:
          absolute;

        inset:
          0;

        width:
          100%;

        height:
          100%;
      }

      .journal-photo-blur {
        object-fit:
          cover;

        transform:
          scale(
            1.08
          );

        filter:
          blur(28px)
          saturate(.72)
          brightness(.42);

        opacity:
          .82;
      }

      .journal-photo-main {
        object-fit:
          contain;

        z-index:
          2;
      }

      .journal-photo-shade {
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
              8,
              .48
            ),
            transparent 28%
          ),
          linear-gradient(
            to bottom,
            rgba(
              4,
              2,
              8,
              .16
            ),
            transparent 20%
          );
      }

      .journal-photo-open {
        position:
          absolute;

        z-index:
          4;

        top:
          14px;

        left:
          14px;

        width:
          34px;

        height:
          34px;

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
            .22
          );

        border-radius:
          50%;

        background:
          rgba(
            8,
            5,
            14,
            .44
          );

        backdrop-filter:
          blur(
            12px
          );

        -webkit-backdrop-filter:
          blur(
            12px
          );

        font-size:
          15px;
      }

      .journal-slide-copy {
        min-height:
          126px;

        padding:
          18px
          20px
          22px;

        background:
          linear-gradient(
            180deg,
            rgba(
              20,
              10,
              34,
              .96
            ),
            rgba(
              12,
              7,
              22,
              .98
            )
          );
      }

      .journal-memory-meta {
        display:
          flex;

        gap:
          8px;

        align-items:
          center;

        flex-wrap:
          wrap;

        color:
          #ac9ab8;

        font-size:
          11px;
      }

      .journal-memory-meta span {
        padding:
          6px
          9px;

        border:
          1px solid
          rgba(
            219,
            186,
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
      }

      .journal-location {
        color:
          #d9c2e8;
      }

      .journal-memory-caption {
        margin:
          14px 0 0;

        color:
          #f3eaf8;

        font-family:
          "Heebo",
          sans-serif;

        font-size:
          clamp(
            17px,
            2vw,
            22px
          );

        line-height:
          1.55;

        font-weight:
          300;
      }

      .journal-memory-caption-empty {
        color:
          #9d8fa6;

        font-style:
          italic;
      }

      .journal-carousel-arrow {
        position:
          absolute;

        z-index:
          7;

        top:
          calc(
            50% - 58px
          );

        width:
          46px;

        height:
          46px;

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
            .2
          );

        border-radius:
          50%;

        background:
          rgba(
            8,
            5,
            16,
            .58
          );

        color:
          #fff;

        backdrop-filter:
          blur(
            16px
          );

        -webkit-backdrop-filter:
          blur(
            16px
          );

        font:
          300
          34px/1
          "Montserrat",
          sans-serif;

        transition:
          .2s opacity,
          .2s transform,
          .2s background;
      }

      .journal-carousel-arrow:hover {
        transform:
          scale(
            1.06
          );

        background:
          rgba(
            104,
            53,
            178,
            .64
          );
      }

      .journal-carousel-arrow:disabled {
        opacity:
          .18;

        pointer-events:
          none;
      }

      .journal-carousel-prev {
        left:
          16px;
      }

      .journal-carousel-next {
        right:
          16px;
      }

      .journal-carousel-bottom {
        display:
          flex;

        align-items:
          center;

        justify-content:
          space-between;

        min-height:
          42px;

        gap:
          14px;

        padding:
          8px
          16px
          10px;

        border-top:
          1px solid
          rgba(
            220,
            188,
            255,
            .08
          );

        background:
          rgba(
            7,
            4,
            13,
            .88
          );

        direction:
          ltr;
      }

      .journal-carousel-dots {
        display:
          flex;

        align-items:
          center;

        gap:
          7px;

        min-height:
          12px;
      }

      .journal-carousel-dot {
        width:
          6px;

        height:
          6px;

        padding:
          0;

        border:
          0;

        border-radius:
          999px;

        background:
          rgba(
            231,
            211,
            245,
            .25
          );

        transition:
          .2s width,
          .2s background;
      }

      .journal-carousel-dot.is-active {
        width:
          22px;

        background:
          linear-gradient(
            90deg,
            #c89cff,
            #ff78c7
          );
      }

      .journal-carousel-counter {
        color:
          #8f8199;

        font-family:
          "Montserrat",
          sans-serif;

        font-size:
          9px;

        letter-spacing:
          .14em;
      }

      .journal-coming {
        display:
          flex;

        align-items:
          center;

        justify-content:
          space-between;

        gap:
          16px;
      }

      .journal-live-footer-copy {
        display:
          flex;

        flex-direction:
          column;

        gap:
          3px;
      }

      .journal-live-footer-copy span {
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

        font:
          500
          10px
          "Heebo",
          sans-serif;
      }

      .journal-refresh-btn:disabled {
        opacity:
          .5;
      }

      /*
        EMPTY / ERROR
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
            circle at 18% 50%,
            rgba(
              141,
              70,
              255,
              .16
            ),
            transparent 28%
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
        LIGHTBOX
      */

      .journal-lightbox {
        position:
          fixed;

        z-index:
          99999;

        inset:
          0;

        display:
          none;

        place-items:
          center;

        padding:
          24px;

        background:
          rgba(
            3,
            2,
            7,
            .92
          );

        backdrop-filter:
          blur(
            18px
          );

        -webkit-backdrop-filter:
          blur(
            18px
          );
      }

      .journal-lightbox.is-open {
        display:
          grid;
      }

      body.journal-lightbox-open {
        overflow:
          hidden;
      }

      .journal-lightbox-inner {
        width:
          min(
            1100px,
            100%
          );

        max-height:
          92vh;

        display:
          grid;

        grid-template-rows:
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
            231,
            205,
            255,
            .14
          );

        border-radius:
          20px;

        background:
          #08050e;
      }

      .journal-lightbox img {
        width:
          100%;

        height:
          min(
            76vh,
            820px
          );

        object-fit:
          contain;

        background:
          #040207;
      }

      .journal-lightbox-copy {
        padding:
          15px
          18px
          18px;
      }

      .journal-lightbox-copy p {
        margin:
          0 0 5px;

        color:
          #f5edf9;

        font-size:
          17px;
      }

      .journal-lightbox-copy small {
        color:
          #9e90a6;
      }

      .journal-lightbox-close {
        position:
          fixed;

        z-index:
          2;

        top:
          max(
            18px,
            env(
              safe-area-inset-top
            )
          );

        right:
          20px;

        width:
          44px;

        height:
          44px;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .2
          );

        border-radius:
          50%;

        background:
          rgba(
            15,
            10,
            22,
            .76
          );

        color:
          white;

        font-size:
          28px;
      }

      /*
        MOBILE NAVIGATION
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
              .92
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

          -ms-overflow-style:
            none;

          overscroll-behavior-inline:
            contain;
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

          transition:
            .2s color,
            .2s background,
            .2s border-color;
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

        .journal-day-block {
          border-radius:
            18px;
        }

        .journal-slide-photo {
          height:
            min(
              58vh,
              480px
            );

          min-height:
            330px;
        }

        .journal-carousel-arrow {
          width:
            40px;

          height:
            40px;

          font-size:
            29px;
        }

        .journal-carousel-prev {
          left:
            10px;
        }

        .journal-carousel-next {
          right:
            10px;
        }

        .journal-day-head {
          padding:
            15px
            15px
            12px;
        }

        .journal-slide-copy {
          padding:
            15px
            15px
            18px;

          min-height:
            118px;
        }

        .journal-memory-caption {
          font-size:
            17px;
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
          align-items:
            flex-start;
        }
      }

      @media (
        max-width:
          620px
      ) {
        .aviation-nav .nav-in {
          height:
            56px !important;

          padding-inline:
            0;
        }

        .aviation-nav .nav-party {
          padding:
            8px
            10px;

          font-size:
            8px;

          letter-spacing:
            .04em;
        }

        .aviation-brand span {
          font-size:
            15px !important;
        }

        .aviation-brand small {
          font-size:
            7px !important;
        }

        .wrap {
          width:
            min(
              100% - 22px,
              1240px
            ) !important;
        }

        .section {
          padding-top:
            56px !important;

          padding-bottom:
            56px !important;
        }

        .birthday-wrap {
          padding-top:
            20px !important;
        }

        .birthday-grid {
          gap:
            0 !important;
        }

        .birthday-art {
          margin-top:
            -34px !important;
        }

        .journal-hero {
          gap:
            20px !important;
        }

        .journal-title {
          font-size:
            clamp(
              46px,
              16vw,
              68px
            ) !important;
        }

        .journal-intro {
          font-size:
            14px !important;
        }

        .journal-cloud-note {
          padding:
            13px !important;
        }

        .journal-day-head {
          align-items:
            flex-start;

          flex-direction:
            column;

          gap:
            6px;
        }

        .journal-slide-photo {
          height:
            min(
              52vh,
              420px
            );

          min-height:
            300px;
        }

        .journal-carousel-arrow {
          top:
            calc(
              50% - 60px
            );

          width:
            36px;

          height:
            36px;

          font-size:
            26px;
        }

        .journal-carousel-bottom {
          padding-inline:
            12px;
        }

        .journal-memory-meta {
          gap:
            6px;

          font-size:
            10px;
        }

        .journal-memory-meta span {
          padding:
            5px
            8px;
        }

        .journal-coming {
          flex-direction:
            column;
        }

        .journal-refresh-btn {
          width:
            100%;
        }

        .journal-lightbox {
          padding:
            0;
        }

        .journal-lightbox-inner {
          width:
            100%;

          height:
            100%;

          max-height:
            none;

          border:
            0;

          border-radius:
            0;
        }

        .journal-lightbox img {
          height:
            calc(
              100vh -
              120px
            );
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  function escapeHtml(
    value
  ) {
    return String(
      value ??
        ""
    ).replace(
      /[&<>"']/g,
      (
        char
      ) => {
        return {
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
        }[char];
      }
    );
  }

  function escapeAttr(
    value
  ) {
    return escapeHtml(
      value
    ).replace(
      /`/g,
      "&#96;"
    );
  }

  function debounce(
    fn,
    delay
  ) {
    let timer =
      0;

    return (
      ...args
    ) => {
      clearTimeout(
        timer
      );

      timer =
        window.setTimeout(
          () =>
            fn(
              ...args
            ),
          delay
        );
    };
  }
})();
