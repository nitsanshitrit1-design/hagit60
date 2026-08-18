(() => {
  "use strict";

  const SUPABASE_URL = "https://fqoziqglyrcjttnuismx.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_2Z_EWufBUdNlSvesyg2bmA_7obNjRsI";
  const BUCKET = "journal-photos";
  const COMMENTS_TABLE = "journal_comments";
  const REFRESH_MS = 30000;
  const NICKNAME_KEY = "hagit60-family-nickname";

  const DAYS = [
    {
      d: 1,
      date: "17.08",
      dateLong: "17 AUG 2026",
      title: "תל אביב → לוס אנג׳לס",
      short: "LOS ANGELES",
      desc:
        "טיסה ישירה, הוליווד, תיאטרון דולבי, בוורלי הילס ושוק האיכרים.",
      planned: [
        "טיסה ישירה ללוס אנג׳לס",
        "Hollywood Walk of Fame",
        "Dolby Theatre",
        "Beverly Hills",
        "Farmers Market",
      ],
    },

    {
      d: 2,
      date: "18.08",
      dateLong: "18 AUG 2026",
      title: "סאן דייגו",
      short: "SAN DIEGO",
      desc:
        "לה הויה, המרינה, פסל הנשיקה, האי קורונאדו והעיר העתיקה.",
      planned: [
        "La Jolla",
        "המרינה של סאן דייגו",
        "Unconditional Surrender — פסל הנשיקה",
        "Coronado Island",
        "Old Town San Diego",
      ],
    },

    {
      d: 3,
      date: "19.08",
      dateLong: "19 AUG 2026",
      title:
        "יוניברסל סטודיוז + סנטה מוניקה",
      short: "UNIVERSAL · LA",
      desc:
        "יום פארק ואולפנים, אחריו טיילת ומזח סנטה מוניקה.",
      planned: [
        "Universal Studios Hollywood",
        "סיור האולפנים והמתקנים",
        "Santa Monica",
        "Santa Monica Pier",
      ],
    },

    {
      d: 4,
      date: "20.08",
      dateLong: "20 AUG 2026",
      title: "סנטה ברברה + סולוונג",
      short: "SANTA BARBARA · SOLVANG",
      desc:
        "צפון קליפורניה, אדריכלות ספרדית ועיירה דנית ציורית.",
      planned: [
        "Santa Barbara",
        "מרכז העיר והאדריכלות הספרדית",
        "נסיעה צפונה על החוף",
        "Solvang",
      ],
    },

    {
      d: 5,
      date: "21.08",
      dateLong: "21 AUG 2026",
      title:
        "מונטריי + דרך 17 המייל + סן פרנסיסקו",
      short: "MONTEREY · SAN FRANCISCO",
      desc:
        "חוף פסיפי, מצוקים, מונטריי והגעה לסן פרנסיסקו בערב.",
      planned: [
        "Monterey",
        "17-Mile Drive",
        "חוף האוקיינוס הפסיפי",
        "הגעה לסן פרנסיסקו",
      ],
    },

    {
      d: 6,
      date: "22.08",
      dateLong: "22 AUG 2026",
      title: "סן פרנסיסקו + סוסליטו",
      short: "SAN FRANCISCO",
      desc:
        "גולדן גייט, פישרמנס וורף, אלקטרז מבחוץ, לומבארד, Twin Peaks וצ׳יינה טאון.",
      planned: [
        "Golden Gate Bridge",
        "Sausalito",
        "Fisherman’s Wharf",
        "Alcatraz — תצפית מבחוץ",
        "Lombard Street",
        "Twin Peaks",
        "Chinatown",
      ],
    },

    {
      d: 7,
      date: "23.08",
      dateLong: "23 AUG 2026",
      title: "יוסמיטי פארק",
      short: "YOSEMITE",
      desc:
        "אל קפיטן, מפלים, נופי סיירה נבדה ועצי סקוויה.",
      planned: [
        "Yosemite National Park",
        "El Capitan",
        "מפלים ונקודות תצפית",
        "Sierra Nevada",
        "עצי סקוויה",
      ],
    },

    {
      d: 8,
      date: "24.08",
      dateLong: "24 AUG 2026",
      title: "לאס וגאס",
      short: "LAS VEGAS",
      desc:
        "נסיעה דרך קליפורניה והגעה לעיר האורות. אפשרות לסיור לילה.",
      planned: [
        "נסיעה ללאס וגאס",
        "הגעה למלון",
        "Las Vegas Strip",
        "אפשרות לסיור לילה",
      ],
    },

    {
      d: 9,
      date: "25.08",
      dateLong: "25 AUG 2026",
      title: "סכר הובר + לאס וגאס",
      short: "HOOVER DAM · LAS VEGAS",
      desc:
        "תצפיות על סכר הובר ואגם מיד, חזרה לקניות וזמן בעיר.",
      planned: [
        "Hoover Dam",
        "Lake Mead",
        "חזרה ללאס וגאס",
        "קניות וזמן חופשי",
      ],
    },

    {
      d: 10,
      date: "26.08",
      dateLong: "26 AUG 2026",
      title:
        "לאס וגאס — יום חופשי + מופע",
      short: "LAS VEGAS",
      desc:
        "יום עצמאי בין המלונות והקניות, בערב מופע בידור כלול.",
      planned: [
        "יום חופשי בלאס וגאס",
        "מלונות ואטרקציות בסטריפ",
        "קניות",
        "מופע בידור בערב",
      ],
    },

    {
      d: 11,
      date: "27.08",
      dateLong: "27 AUG 2026",
      title: "ציון פארק + ברייס קניון",
      short: "ZION · BRYCE",
      desc:
        "יום של טבע ביוטה: צוקים אדומים, צריחי סלע וגבהים שבהם הערב יכול להיות ממש קריר.",
      planned: [
        "Zion National Park",
        "צוקים ונופי יוטה",
        "Bryce Canyon",
        "תצפיות על ה-Hoodoos",
      ],
    },

    {
      d: 12,
      date: "28.08",
      dateLong: "28 AUG 2026",
      title:
        "סכר גלן + Horseshoe Bend + גרנד קניון",
      short: "GRAND CANYON",
      desc:
        "אגם פאואל, עיקול פרסת הסוס ותצפיות על הגרנד קניון.",
      planned: [
        "Glen Canyon Dam",
        "Lake Powell",
        "Horseshoe Bend",
        "Grand Canyon",
        "תצפיות שקיעה/אחה״צ",
      ],
    },

    {
      d: 13,
      date: "29.08",
      dateLong: "29 AUG 2026",
      title: "פניקס → וושינגטון",
      short: "PHOENIX → WASHINGTON",
      desc:
        "פרידה מהמערב וטיסת פנים מפניקס לוושינגטון. הגעה בשעות הערב.",
      planned: [
        "נסיעה לפניקס",
        "טיסת פנים",
        "Phoenix → Washington D.C.",
        "הגעה למלון בערב",
      ],
    },

    {
      d: 14,
      date: "30.08",
      dateLong: "30 AUG 2026",
      title: "וושינגטון די.סי.",
      short: "WASHINGTON D.C.",
      desc:
        "הקפיטול, הבית הלבן, אנדרטאות וושינגטון, ג׳פרסון, וייטנאם, רוזוולט ומלחמת העולם השנייה.",
      planned: [
        "U.S. Capitol",
        "White House",
        "Washington Monument",
        "Jefferson Memorial",
        "Vietnam Veterans Memorial",
        "FDR Memorial",
        "World War II Memorial",
      ],
    },

    {
      d: 15,
      date: "31.08",
      dateLong: "31 AUG 2026",
      title: "חבל האמיש + הרשי",
      short: "AMISH COUNTRY · HERSHEY",
      desc:
        "אורח החיים של האמיש ועולם השוקולד של הרשי. לינה בפנסילבניה.",
      planned: [
        "Amish Country",
        "היכרות עם אורח החיים של האמיש",
        "Hershey",
        "Hershey’s Chocolate World",
      ],
    },

    {
      d: 16,
      date: "01.09",
      dateLong: "01 SEP 2026",
      title: "ווטקינס גלן + מפלי הניאגרה",
      short: "WATKINS GLEN · NIAGARA",
      desc:
        "מסלול טבע בין מפלים וקניון, מעבר לצד הקנדי של ניאגרה ומפלים מוארים בערב.",
      planned: [
        "Watkins Glen State Park",
        "מסלול קניון ומפלים",
        "נסיעה לניאגרה",
        "מעבר לצד הקנדי",
        "Niagara Falls בלילה",
      ],
    },

    {
      d: 17,
      date: "02.09",
      dateLong: "02 SEP 2026",
      title:
        "שייט בניאגרה + Niagara-on-the-Lake",
      short: "NIAGARA · SCRANTON",
      desc:
        "שייט אל המפלים עם מעיל גשם, עיירת ניאגרה און דה לייק והמשך לכיוון סקרנטון.",
      planned: [
        "שייט אל מפלי הניאגרה",
        "Niagara-on-the-Lake",
        "המשך דרומה",
        "נסיעה לכיוון Scranton",
      ],
    },

    {
      d: 18,
      date: "03.09",
      dateLong: "03 SEP 2026",
      title: "ניו יורק — היכרות ראשונה",
      short: "NEW YORK CITY",
      desc:
        "רוקפלר, השדרה החמישית, סנט פטריק, סנטרל פארק, לינקולן סנטר והיכרות ערב רגלית.",
      planned: [
        "Rockefeller Center",
        "Fifth Avenue",
        "St. Patrick’s Cathedral",
        "Central Park",
        "Lincoln Center",
        "סיור ערב רגלי",
      ],
    },

    {
      d: 19,
      date: "04.09",
      dateLong: "04 SEP 2026",
      title: "ניו יורק — מנהטן",
      short: "NEW YORK · MANHATTAN",
      desc:
        "אמפייר סטייט, גריניץ׳ וילג׳, צ׳לסי מרקט, היי ליין, סוהו, צ׳יינה טאון, וול סטריט וגראונד זירו.",
      planned: [
        "Empire State Building",
        "Greenwich Village",
        "Chelsea Market",
        "High Line",
        "SoHo",
        "Chinatown",
        "Wall Street",
        "Ground Zero",
      ],
    },

    {
      d: 20,
      date: "05.09",
      dateLong: "05 SEP 2026",
      title:
        "ג׳רזי גארדן → טיסה לישראל",
      short: "NEW YORK → HOME",
      desc:
        "קניות אחרונות בג׳רזי גארדן ובהתאם לשעת הטיסה — לשדה ולדרך הביתה.",
      planned: [
        "The Mills at Jersey Gardens",
        "קניות אחרונות",
        "נסיעה לשדה התעופה",
        "טיסה לישראל",
      ],
    },
  ];

  const journalSection =
    document.getElementById("journal");

  if (!journalSection) {
    return;
  }

  let entries = [];
  let groups = new Map();
  let commentsByEntry =
    new Map();

  let selectedDay = 1;
  let activePhotoIndex = 0;

  let isLoading = false;

  let lastEntriesPayload = "";
  let lastCommentsPayload = "";

  let commentsAvailable = true;

  let map = null;
  let mapRouteLayer = null;
  let mapMarkersLayer = null;

  let viewerTouchX = null;

  installStyles();
  buildJournalShell();
  installMobileNavigation();
  bindAnchorNavigation();
  observeSections();
  bindStaticEvents();

  loadAll(true);

  setInterval(
    () => loadAll(false),
    REFRESH_MS
  );

  function buildJournalShell() {
    journalSection.innerHTML = `
      <div class="hj-wrap">

        <div class="hj-hero">

          <div>
            <div class="hj-kicker">
              THE JOURNEY BECOMES THE JOURNAL
            </div>

            <h2
              class="hj-main-title"
              dir="ltr"
            >
              PLANNED ROUTE.<br>
              <em>REAL MEMORIES.</em>
            </h2>

            <p class="hj-main-copy">
              כל יום בטיול הוא עולם אחד:
              מה תוכנן, איפה חגית באמת הייתה
              לפי התמונות, מה היא ראתה,
              מה היא כתבה — ומה המשפחה
              ענתה לה.
            </p>
          </div>

          <div class="hj-live-card">
            <small>
              HAGIT 60 · LIVE JOURNEY
            </small>

            <b id="hjHeroStatus">
              20 DAYS · ONE STORY
            </b>

            <span id="hjHeroMeta">
              הזיכרונות יתחילו להופיע
              כאן מהאייפון
            </span>
          </div>

        </div>

        <section class="hj-days-shell">

          <div class="hj-days-head">
            <b>
              20 DAYS · LIVE ROUTE
            </b>

            <span>
              בחרו יום כדי לפתוח
              את העולם שלו
            </span>
          </div>

          <button
            class="
              hj-days-arrow
              hj-days-prev
            "
            type="button"
            id="hjDaysPrev"
            aria-label="ימים קודמים"
          >
            ‹
          </button>

          <button
            class="
              hj-days-arrow
              hj-days-next
            "
            type="button"
            id="hjDaysNext"
            aria-label="ימים הבאים"
          >
            ›
          </button>

          <div
            class="hj-days-track"
            id="hjDaysTrack"
          ></div>

        </section>

        <section
          class="hj-day-world"
          id="hjDayWorld"
        >

          <header class="hj-day-header">

            <div class="hj-day-orb">
              <span id="hjDayOrb">
                01
              </span>
            </div>

            <div class="hj-day-title">

              <small id="hjDayDate">
                17 AUG 2026
              </small>

              <h3 id="hjDayTitle">
                לוס אנג׳לס
              </h3>

              <p id="hjDayDesc"></p>

            </div>

            <div
              class="hj-day-live"
              dir="ltr"
            >

              <b id="hjLiveLabel">
                WAITING FOR MEMORIES
              </b>

              <span id="hjLiveMeta"></span>

            </div>

          </header>

          <div class="hj-main-grid">

            <section class="hj-panel">

              <div class="hj-panel-head">

                <b>
                  היום המתוכנן
                </b>

                <small>
                  THE PLAN
                </small>

              </div>

              <div class="hj-plan-body">

                <div
                  class="hj-plan-summary"
                  id="hjPlanSummary"
                ></div>

                <div
                  class="hj-planned-list"
                  id="hjPlannedList"
                ></div>

                <div class="hj-live-route">

                  <div
                    class="hj-live-route-title"
                  >
                    <i></i>

                    <b>
                      HAGIT WAS HERE ✦
                    </b>

                    <span>
                      לפי התמונות והשעה
                      שבה הן צולמו
                    </span>
                  </div>

                  <div
                    class="hj-live-points"
                    id="hjLivePoints"
                  ></div>

                </div>

              </div>

            </section>

            <section
              class="
                hj-panel
                hj-map-panel
              "
            >

              <div class="hj-panel-head">

                <b>
                  המפה החיה של היום
                </b>

                <small>
                  PHOTO ROUTE
                </small>

              </div>

              <div class="hj-map-wrap">

                <div id="hjLiveMap"></div>

                <div
                  class="hj-map-status"
                  id="hjMapStatus"
                ></div>

              </div>

            </section>

          </div>

          <section class="hj-memories">

            <div class="hj-mem-head">

              <div>

                <small>
                  MEMORIES FROM TODAY
                </small>

                <b>
                  התמונות הן הסיפור.
                </b>

              </div>

              <span id="hjMemoryMeta">
                לחצו על תמונה כדי
                לפתוח אותה ולהגיב
              </span>

            </div>

            <div
              class="hj-photo-hive"
              id="hjPhotoHive"
            ></div>

          </section>

        </section>

      </div>

      <div
        class="hj-viewer"
        id="hjViewer"
        aria-hidden="true"
      >

        <div
          class="hj-viewer-shell"
          role="dialog"
          aria-modal="true"
          aria-label="תמונה מיומן המסע"
        >

          <div class="hj-viewer-photo">

            <div
              class="hj-viewer-bg"
              id="hjViewerBg"
            ></div>

            <img
              class="hj-viewer-img"
              id="hjViewerImg"
              alt=""
            >

            <div
              class="hj-viewer-shade"
            ></div>

            <div
              class="hj-viewer-top"
              dir="ltr"
            >

              <button
                class="hj-close"
                type="button"
                id="hjCloseViewer"
                aria-label="סגירה"
              >
                ×
              </button>

              <div>
                <b id="hjViewerTitle"></b>
                <small id="hjViewerDate"></small>
              </div>

              <span id="hjViewerIndex"></span>

            </div>

            <button
              class="
                hj-viewer-arrow
                hj-viewer-prev
              "
              type="button"
              id="hjPhotoPrev"
              aria-label="תמונה קודמת"
            >
              ‹
            </button>

            <button
              class="
                hj-viewer-arrow
                hj-viewer-next
              "
              type="button"
              id="hjPhotoNext"
              aria-label="תמונה הבאה"
            >
              ›
            </button>

            <div class="hj-viewer-copy">

              <p id="hjViewerCaption"></p>

              <small
                id="hjViewerMeta"
              ></small>

            </div>

            <div
              class="hj-filmstrip"
              id="hjFilmstrip"
            ></div>

          </div>

          <aside class="hj-comments">

            <div class="hj-comments-head">

              <h3>
                תגובות
                <span
                  id="hjCommentCount"
                >
                  (0)
                </span>
              </h3>

              <small>
                לתמונה הזאת
              </small>

            </div>

            <div
              class="hj-comment-list"
              id="hjCommentList"
            ></div>

            <div class="hj-composer">

              <div
                class="hj-composer-row"
              >

                <input
                  id="hjCommentInput"
                  maxlength="500"
                  placeholder="כתבו תגובה לתמונה…"
                  autocomplete="off"
                >

                <button
                  type="button"
                  id="hjSendComment"
                >
                  ↑
                </button>

              </div>

              <div class="hj-identity">

                <span
                  id="hjIdentityText"
                >
                  עדיין לא בחרת כינוי
                </span>

                <button
                  type="button"
                  id="hjChangeNickname"
                >
                  שינוי שם
                </button>

              </div>

              <div
                class="hj-comments-note"
                id="hjCommentsNote"
              ></div>

            </div>

          </aside>

        </div>

      </div>

      <div
        class="hj-nickname-modal"
        id="hjNicknameModal"
        aria-hidden="true"
      >

        <div class="hj-nickname-card">

          <small>
            FAMILY COMMENTS
          </small>

          <h3>
            איך קוראים לך?
          </h3>

          <p>
            נשמור את הכינוי בדפדפן
            הזה כדי שלא תצטרך
            לכתוב אותו בכל תגובה.
          </p>

          <input
            id="hjNicknameInput"
            maxlength="40"
            placeholder="למשל: ניצן"
            autocomplete="nickname"
          >

          <button
            type="button"
            id="hjSaveNickname"
          >
            זה אני ✦
          </button>

        </div>

      </div>
    `;
  }

  function bindStaticEvents() {
    document
      .getElementById("hjDaysPrev")
      ?.addEventListener(
        "click",
        () =>
          document
            .getElementById(
              "hjDaysTrack"
            )
            ?.scrollBy({
              left: -620,
              behavior: "smooth",
            })
      );

    document
      .getElementById("hjDaysNext")
      ?.addEventListener(
        "click",
        () =>
          document
            .getElementById(
              "hjDaysTrack"
            )
            ?.scrollBy({
              left: 620,
              behavior: "smooth",
            })
      );

    document
      .getElementById(
        "hjCloseViewer"
      )
      ?.addEventListener(
        "click",
        closeViewer
      );

    document
      .getElementById(
        "hjPhotoPrev"
      )
      ?.addEventListener(
        "click",
        () => stepPhoto(-1)
      );

    document
      .getElementById(
        "hjPhotoNext"
      )
      ?.addEventListener(
        "click",
        () => stepPhoto(1)
      );

    document
      .getElementById(
        "hjSendComment"
      )
      ?.addEventListener(
        "click",
        submitComment
      );

    document
      .getElementById(
        "hjCommentInput"
      )
      ?.addEventListener(
        "keydown",
        (event) => {
          if (
            event.key === "Enter"
          ) {
            submitComment();
          }
        }
      );

    document
      .getElementById(
        "hjChangeNickname"
      )
      ?.addEventListener(
        "click",
        openNicknameModal
      );

    document
      .getElementById(
        "hjSaveNickname"
      )
      ?.addEventListener(
        "click",
        saveNickname
      );

    document
      .getElementById(
        "hjNicknameInput"
      )
      ?.addEventListener(
        "keydown",
        (event) => {
          if (
            event.key === "Enter"
          ) {
            saveNickname();
          }
        }
      );

    document
      .getElementById("hjViewer")
      ?.addEventListener(
        "click",
        (event) => {
          if (
            event.target?.id ===
            "hjViewer"
          ) {
            closeViewer();
          }
        }
      );

    const photoArea =
      document.querySelector(
        ".hj-viewer-photo"
      );

    photoArea?.addEventListener(
      "touchstart",
      (event) => {
        viewerTouchX =
          event.changedTouches?.[0]
            ?.clientX ??
          null;
      },
      {
        passive: true,
      }
    );

    photoArea?.addEventListener(
      "touchend",
      (event) => {
        if (
          viewerTouchX === null
        ) {
          return;
        }

        const endX =
          event.changedTouches?.[0]
            ?.clientX ??
          viewerTouchX;

        const delta =
          endX -
          viewerTouchX;

        viewerTouchX =
          null;

        if (
          Math.abs(delta) >
          48
        ) {
          stepPhoto(
            delta < 0 ? 1 : -1
          );
        }
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
              "hjViewer"
            )
            ?.classList.contains(
              "is-open"
            )
        ) {
          return;
        }

        if (
          event.key === "Escape"
        ) {
          closeViewer();
        }

        if (
          event.key ===
          "ArrowLeft"
        ) {
          stepPhoto(-1);
        }

        if (
          event.key ===
          "ArrowRight"
        ) {
          stepPhoto(1);
        }
      }
    );
  }

  async function loadAll(
    firstLoad
  ) {
    if (isLoading) {
      return;
    }

    isLoading = true;

    try {
      const loadedEntries =
        await fetchEntries();

      const entryPayload =
        JSON.stringify(
          loadedEntries
        );

      const entriesChanged =
        entryPayload !==
        lastEntriesPayload;

      if (entriesChanged) {
        entries =
          loadedEntries;

        groups =
          groupEntries(
            entries
          );

        lastEntriesPayload =
          entryPayload;

        if (firstLoad) {
          selectedDay =
            pickInitialDay();
        }
      }

      await fetchComments();

      if (
        entriesChanged ||
        firstLoad
      ) {
        renderEverything();
      } else {
        renderDays();
        renderMemories();

        if (
          document
            .getElementById(
              "hjViewer"
            )
            ?.classList.contains(
              "is-open"
            )
        ) {
          renderViewer();
        }
      }
    } catch (error) {
      console.error(
        "Hagit live journey:",
        error
      );

      renderFatalError();
    } finally {
      isLoading = false;
    }
  }

  async function fetchEntries() {
    const endpoint =
      `${SUPABASE_URL}` +
      `/rest/v1/journal_entries` +
      `?select=` +
      `id,created_at,taken_at,` +
      `latitude,longitude,` +
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

            Authorization:
              `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,

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

    return response.json();
  }

  async function fetchComments() {
    try {
      const endpoint =
        `${SUPABASE_URL}` +
        `/rest/v1/` +
        `${COMMENTS_TABLE}` +
        `?select=` +
        `id,journal_entry_id,` +
        `nickname,comment,created_at` +
        `&order=created_at.asc`;

      const response =
        await fetch(
          endpoint,
          {
            headers: {
              apikey:
                SUPABASE_PUBLISHABLE_KEY,

              Authorization:
                `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,

              Accept:
                "application/json",
            },

            cache:
              "no-store",
          }
        );

      if (!response.ok) {
        commentsAvailable =
          false;

        return;
      }

      const comments =
        await response.json();

      const payload =
        JSON.stringify(
          comments
        );

      if (
        payload ===
        lastCommentsPayload
      ) {
        return;
      }

      lastCommentsPayload =
        payload;

      commentsAvailable =
        true;

      commentsByEntry =
        new Map();

      comments.forEach(
        (comment) => {
          const key =
            String(
              comment
                .journal_entry_id ||
                ""
            );

          if (
            !commentsByEntry.has(
              key
            )
          ) {
            commentsByEntry.set(
              key,
              []
            );
          }

          commentsByEntry
            .get(key)
            .push(comment);
        }
      );
    } catch (error) {
      commentsAvailable =
        false;

      console.warn(
        "Comments are not available yet:",
        error
      );
    }
  }

  function groupEntries(
    list
  ) {
    const mapByDay =
      new Map();

    DAYS.forEach(
      (day) =>
        mapByDay.set(
          day.d,
          []
        )
    );

    list.forEach(
      (entry) => {
        let dayNumber =
          Number(
            entry.day_number ||
              0
          );

        if (!dayNumber) {
          dayNumber =
            dayNumberFromDate(
              entry.taken_at ||
                entry.created_at
            );
        }

        if (
          dayNumber >= 1 &&
          dayNumber <= 20
        ) {
          mapByDay
            .get(dayNumber)
            .push(entry);
        }
      }
    );

    mapByDay.forEach(
      (dayEntries) =>
        dayEntries.sort(
          (a, b) =>
            timestamp(a) -
            timestamp(b)
        )
    );

    return mapByDay;
  }

  function dayNumberFromDate(
    value
  ) {
    if (!value) {
      return 0;
    }

    const rawDate =
      String(value).slice(
        0,
        10
      );

    const start =
      new Date(
        "2026-08-17T00:00:00Z"
      );

    const current =
      new Date(
        `${rawDate}T00:00:00Z`
      );

    if (
      Number.isNaN(
        current.getTime()
      )
    ) {
      return 0;
    }

    return (
      Math.floor(
        (current - start) /
          86400000
      ) + 1
    );
  }

  function timestamp(entry) {
    const date =
      new Date(
        entry.taken_at ||
          entry.created_at ||
          0
      );

    return Number.isNaN(
      date.getTime()
    )
      ? 0
      : date.getTime();
  }

  function pickInitialDay() {
    const populated =
      DAYS.filter(
        (day) =>
          (
            groups.get(day.d) ||
            []
          ).length > 0
      );

    if (populated.length) {
      return populated[
        populated.length - 1
      ].d;
    }

    const now =
      new Date();

    const start =
      new Date(
        2026,
        7,
        17
      );

    const end =
      new Date(
        2026,
        8,
        5,
        23,
        59,
        59
      );

    if (now < start) {
      return 1;
    }

    if (now > end) {
      return 20;
    }

    return Math.min(
      20,
      Math.max(
        1,
        Math.floor(
          (
            new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate()
            ) -
            start
          ) /
            86400000
        ) + 1
      )
    );
  }

  function renderEverything() {
    renderDays();
    renderSelectedDay();
    updateHeroStatus();
  }

  function renderDays() {
    const track =
      document.getElementById(
        "hjDaysTrack"
      );

    if (!track) {
      return;
    }

    track.innerHTML =
      DAYS.map(
        (day) => {
          const dayEntries =
            groups.get(day.d) ||
            [];

          const cover =
            dayEntries[0]
              ? publicImageUrl(
                  dayEntries[0]
                    .image_path
                )
              : "";

          const hasMemories =
            dayEntries.length > 0;

          const active =
            selectedDay ===
            day.d;

          return `
            <button
              class="
                hj-day-chip
                ${
                  active
                    ? "is-active"
                    : ""
                }
                ${
                  hasMemories
                    ? "has-memories"
                    : "is-waiting"
                }
              "
              type="button"
              data-hj-day="${day.d}"
            >

              ${
                cover
                  ? `
                    <img
                      src="${escapeAttr(
                        cover
                      )}"
                      alt=""
                      loading="lazy"
                    >
                  `
                  : `
                    <span
                      class="hj-day-placeholder"
                    >
                      <i>✦</i>
                    </span>
                  `
              }

              <span
                class="hj-day-chip-shade"
              ></span>

              <span
                class="hj-day-chip-number"
              >
                ${String(
                  day.d
                ).padStart(
                  2,
                  "0"
                )}
              </span>

              <span
                class="hj-day-chip-copy"
                dir="ltr"
              >

                <b>
                  ${escapeHtml(
                    day.short
                  )}
                </b>

                <small>
                  ${day.dateLong}
                </small>

                <span>
                  ${
                    hasMemories
                      ? `▣ ${dayEntries.length} ${
                          dayEntries.length ===
                          1
                            ? "MEMORY"
                            : "MEMORIES"
                        }`
                      : "WAITING TO BE LIVED"
                  }
                </span>

              </span>

            </button>
          `;
        }
      ).join("");

    track
      .querySelectorAll(
        "[data-hj-day]"
      )
      .forEach(
        (button) => {
          button.addEventListener(
            "click",
            () => {
              selectedDay =
                Number(
                  button.dataset
                    .hjDay ||
                    1
                );

              activePhotoIndex =
                0;

              renderEverything();

              document
                .getElementById(
                  "hjDayWorld"
                )
                ?.scrollIntoView(
                  {
                    behavior:
                      "smooth",

                    block:
                      "start",
                  }
                );
            }
          );
        }
      );

    requestAnimationFrame(
      () =>
        track
          .querySelector(
            ".hj-day-chip.is-active"
          )
          ?.scrollIntoView(
            {
              behavior:
                "smooth",

              inline:
                "center",

              block:
                "nearest",
            }
          )
    );
  }

  function renderSelectedDay() {
    const day =
      DAYS[
        selectedDay - 1
      ];

    const dayEntries =
      groups.get(
        selectedDay
      ) || [];

    if (!day) {
      return;
    }

    setText(
      "hjDayOrb",
      String(day.d).padStart(
        2,
        "0"
      )
    );

    setText(
      "hjDayDate",
      day.dateLong
    );

    setText(
      "hjDayTitle",
      day.title
    );

    setText(
      "hjDayDesc",
      day.desc
    );

    const routeStops =
      buildRouteStops(
        dayEntries
      );

    const lastEntry =
      dayEntries[
        dayEntries.length - 1
      ];

    const liveLabel =
      document.getElementById(
        "hjLiveLabel"
      );

    if (dayEntries.length) {
      liveLabel.textContent =
        "● LIVE MEMORY DAY";

      liveLabel.classList.add(
        "is-live"
      );

      setText(
        "hjLiveMeta",
        `${dayEntries.length} photos · ${routeStops.length} places · ${
          lastEntry
            ? `updated ${formatTime(
                lastEntry.taken_at ||
                  lastEntry
                    .created_at
              )}`
            : ""
        }`
      );
    } else {
      liveLabel.textContent =
        "WAITING FOR MEMORIES";

      liveLabel.classList.remove(
        "is-live"
      );

      setText(
        "hjLiveMeta",
        "היום יתחיל להתמלא ברגע שחגית תשתף תמונה"
      );
    }

    const summary =
      document.getElementById(
        "hjPlanSummary"
      );

    if (summary) {
      summary.innerHTML = `
        <small>
          WHAT'S PLANNED
        </small>

        <b>
          ${escapeHtml(
            day.title
          )}
        </b>

        <p>
          ${escapeHtml(
            day.desc
          )}
        </p>
      `;
    }

    const planned =
      document.getElementById(
        "hjPlannedList"
      );

    if (planned) {
      planned.innerHTML =
        day.planned
          .map(
            (
              item,
              index
            ) => `
              <div
                class="hj-plan-item"
              >
                <span>
                  ${index + 1}
                </span>

                <b>
                  ${escapeHtml(
                    item
                  )}
                </b>
              </div>
            `
          )
          .join("");
    }

    renderLivePoints(
      routeStops,
      dayEntries
    );

    renderMap(
      routeStops
    );

    renderMemories();
  }

  function buildRouteStops(
    dayEntries
  ) {
    const stops = [];

    dayEntries
      .filter(
        hasCoordinates
      )
      .forEach(
        (entry) => {
          const lat =
            Number(
              entry.latitude
            );

          const lng =
            Number(
              entry.longitude
            );

          const key =
            `${lat.toFixed(
              3
            )},${lng.toFixed(
              3
            )}`;

          const previous =
            stops[
              stops.length - 1
            ];

          if (
            previous &&
            previous.key ===
              key
          ) {
            previous.entries.push(
              entry
            );

            previous.lastTime =
              entry.taken_at ||
              entry.created_at;

            if (
              !previous.name &&
              entry.location_name
            ) {
              previous.name =
                entry.location_name;
            }
          } else {
            stops.push({
              key,
              lat,
              lng,

              name:
                String(
                  entry.location_name ||
                    ""
                ).trim(),

              firstTime:
                entry.taken_at ||
                entry.created_at,

              lastTime:
                entry.taken_at ||
                entry.created_at,

              entries: [
                entry,
              ],
            });
          }
        }
      );

    return stops;
  }

  function hasCoordinates(
    entry
  ) {
    const lat =
      Number(
        entry.latitude
      );

    const lng =
      Number(
        entry.longitude
      );

    return (
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      Math.abs(lat) <= 90 &&
      Math.abs(lng) <= 180 &&
      !(
        lat === 0 &&
        lng === 0
      )
    );
  }

  function renderLivePoints(
    stops,
    dayEntries
  ) {
    const container =
      document.getElementById(
        "hjLivePoints"
      );

    if (!container) {
      return;
    }

    if (stops.length) {
      container.innerHTML =
        stops
          .map(
            (stop) => `
              <button
                class="hj-live-point"
                type="button"
                data-map-lat="${stop.lat}"
                data-map-lng="${stop.lng}"
              >

                <small>
                  ${escapeHtml(
                    formatTime(
                      stop.firstTime
                    )
                  )}
                </small>

                <b>
                  ${escapeHtml(
                    stop.name ||
                      "מיקום מהתמונה"
                  )}
                </b>

                <span>
                  📸 ${stop.entries.length}
                </span>

              </button>
            `
          )
          .join("");

      container
        .querySelectorAll(
          "[data-map-lat]"
        )
        .forEach(
          (button) =>
            button.addEventListener(
              "click",
              () => {
                if (!map) {
                  return;
                }

                map.flyTo(
                  [
                    Number(
                      button.dataset
                        .mapLat
                    ),

                    Number(
                      button.dataset
                        .mapLng
                    ),
                  ],

                  15,

                  {
                    duration:
                      0.7,
                  }
                );
              }
            )
        );

      return;
    }

    if (dayEntries.length) {
      container.innerHTML = `
        <div class="hj-live-empty">

          <b>
            📍 יש תמונות —
            אבל עדיין אין קואורדינטות
          </b>

          <span>
            כשהקיצור ישלח latitude +
            longitude, המסלול יצויר
            כאן אוטומטית לפי שעת הצילום.
          </span>

        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="hj-live-empty">

          <b>
            המסלול החי עוד לא התחיל
          </b>

          <span>
            התמונה הראשונה של היום
            תדליק את האזור הזה.
          </span>

        </div>
      `;
    }
  }

  function renderMap(
    stops
  ) {
    const mapStatus =
      document.getElementById(
        "hjMapStatus"
      );

    if (!window.L) {
      if (mapStatus) {
        mapStatus.innerHTML = `
          <div>
            <b>
              המפה לא נטענה
            </b>

            <span>
              צריך חיבור לאינטרנט
              כדי להציג את OpenStreetMap.
            </span>
          </div>
        `;
      }

      return;
    }

    if (!map) {
      map =
        L.map(
          "hjLiveMap",
          {
            zoomControl:
              false,

            attributionControl:
              true,

            scrollWheelZoom:
              false,
          }
        );

      L.control
        .zoom({
          position:
            "bottomright",
        })
        .addTo(map);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom:
            19,

          attribution:
            "&copy; OpenStreetMap &copy; CARTO",
        }
      ).addTo(map);

      map.setView(
        [
          39.5,
          -98.35,
        ],
        4
      );
    }

    if (mapRouteLayer) {
      map.removeLayer(
        mapRouteLayer
      );
    }

    if (mapMarkersLayer) {
      map.removeLayer(
        mapMarkersLayer
      );
    }

    mapMarkersLayer =
      L.layerGroup().addTo(
        map
      );

    if (!stops.length) {
      map.setView(
        [
          39.5,
          -98.35,
        ],
        4
      );

      if (mapStatus) {
        mapStatus.classList.add(
          "is-visible"
        );

        mapStatus.innerHTML = `
          <div>

            <small>
              LIVE PHOTO ROUTE
            </small>

            <b>
              המפה מחכה
              למיקום הראשון
            </b>

            <span>
              הנקודות יתחברו לפי
              סדר שעות הצילום.
            </span>

          </div>
        `;
      }

      setTimeout(
        () =>
          map.invalidateSize(),
        80
      );

      return;
    }

    if (mapStatus) {
      mapStatus.classList.remove(
        "is-visible"
      );
    }

    const points =
      stops.map(
        (stop) => [
          stop.lat,
          stop.lng,
        ]
      );

    stops.forEach(
      (
        stop,
        index
      ) => {
        const marker =
          L.circleMarker(
            [
              stop.lat,
              stop.lng,
            ],
            {
              radius: 9,
              color:
                "#ffe4f2",
              weight: 2,

              fillColor:
                "#ff5cae",

              fillOpacity:
                1,
            }
          ).addTo(
            mapMarkersLayer
          );

        marker.bindPopup(
          `
            <div dir="rtl">

              <b>
                ${index + 1}.
                ${escapeHtml(
                  stop.name ||
                    "מיקום מהתמונה"
                )}
              </b>

              <br>

              ${escapeHtml(
                formatTime(
                  stop.firstTime
                )
              )}

              · 📸
              ${stop.entries.length}

            </div>
          `
        );

        L.circleMarker(
          [
            stop.lat,
            stop.lng,
          ],
          {
            radius: 17,

            color:
              "#ff5cae",

            weight: 1,

            fillOpacity:
              0,

            opacity:
              0.42,
          }
        ).addTo(
          mapMarkersLayer
        );
      }
    );

    mapRouteLayer =
      L.polyline(
        points,
        {
          color:
            "#b56cff",

          weight: 4,

          opacity:
            0.9,

          dashArray:
            "7 9",

          lineCap:
            "round",
        }
      ).addTo(map);

    if (
      points.length === 1
    ) {
      map.setView(
        points[0],
        14
      );
    } else {
      map.fitBounds(
        points,
        {
          padding: [
            45,
            45,
          ],
        }
      );
    }

    setTimeout(
      () =>
        map.invalidateSize(),
      80
    );
  }

  function renderMemories() {
    const hive =
      document.getElementById(
        "hjPhotoHive"
      );

    const meta =
      document.getElementById(
        "hjMemoryMeta"
      );

    if (!hive) {
      return;
    }

    const dayEntries =
      groups.get(
        selectedDay
      ) || [];

    if (meta) {
      meta.textContent =
        dayEntries.length
          ? `${dayEntries.length} ${
              dayEntries.length ===
              1
                ? "זיכרון"
                : "זיכרונות"
            } · לחצו על תמונה כדי לפתוח ולהגיב`
          : "הגלריה תתעורר עם התמונה הראשונה";
    }

    if (
      !dayEntries.length
    ) {
      hive.className =
        "hj-photo-hive is-empty";

      hive.innerHTML = `
        <div
          class="hj-memory-empty"
        >

          <span>✦</span>

          <small>
            DAY ${String(
              selectedDay
            ).padStart(
              2,
              "0"
            )}
          </small>

          <b>
            WAITING TO BE LIVED.
          </b>

          <p>
            התמונה הראשונה שחגית
            תשתף היום תהפוך מיד
            לזיכרון הראשי.
          </p>

        </div>
      `;

      return;
    }

    hive.className =
      "hj-photo-hive";

    const visible =
      dayEntries.slice(
        0,
        6
      );

    hive.innerHTML =
      visible
        .map(
          (
            entry,
            index
          ) => {
            const image =
              publicImageUrl(
                entry.image_path
              );

            const comments =
              commentsByEntry.get(
                String(
                  entry.id
                )
              ) || [];

            const more =
              index ===
                visible.length -
                  1 &&
              dayEntries.length >
                visible.length
                ? dayEntries.length -
                  visible.length
                : 0;

            return `
              <button
                class="
                  hj-photo-cell
                  ${
                    index === 0
                      ? "is-featured"
                      : ""
                  }
                  hj-photo-${
                    index + 1
                  }
                "
                type="button"
                data-photo-index="${index}"
              >

                <img
                  src="${escapeAttr(
                    image
                  )}"
                  alt="${escapeAttr(
                    entry.caption ||
                      entry.location_name ||
                      "זיכרון מהטיול"
                  )}"
                  loading="lazy"
                >

                <span
                  class="hj-photo-gradient"
                ></span>

                ${
                  index === 0
                    ? `
                      <span
                        class="hj-featured-label"
                      >
                        FEATURED MEMORY
                      </span>
                    `
                    : ""
                }

                <span
                  class="hj-photo-tag"
                >
                  ${escapeHtml(
                    formatTime(
                      entry.taken_at ||
                        entry.created_at
                    )
                  )}

                  ${
                    entry.location_name
                      ? ` · ${escapeHtml(
                          entry.location_name
                        )}`
                      : ""
                  }
                </span>

                <span
                  class="hj-photo-comments"
                >
                  💬 ${comments.length}
                </span>

                ${
                  more
                    ? `
                      <span
                        class="hj-photo-more"
                      >
                        +${more}
                        <small>
                          MORE
                        </small>
                      </span>
                    `
                    : ""
                }

              </button>
            `;
          }
        )
        .join("");

    hive
      .querySelectorAll(
        "[data-photo-index]"
      )
      .forEach(
        (button) =>
          button.addEventListener(
            "click",
            () => {
              activePhotoIndex =
                Number(
                  button.dataset
                    .photoIndex ||
                    0
                );

              openViewer();
            }
          )
      );
  }

  function openViewer() {
    const dayEntries =
      groups.get(
        selectedDay
      ) || [];

    if (
      !dayEntries.length
    ) {
      return;
    }

    activePhotoIndex =
      Math.max(
        0,
        Math.min(
          activePhotoIndex,
          dayEntries.length -
            1
        )
      );

    const viewer =
      document.getElementById(
        "hjViewer"
      );

    viewer?.classList.add(
      "is-open"
    );

    viewer?.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body
      .classList.add(
        "hj-viewer-open"
      );

    renderViewer();
  }

  function closeViewer() {
    const viewer =
      document.getElementById(
        "hjViewer"
      );

    viewer?.classList.remove(
      "is-open"
    );

    viewer?.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body
      .classList.remove(
        "hj-viewer-open"
      );
  }

  function stepPhoto(
    delta
  ) {
    const dayEntries =
      groups.get(
        selectedDay
      ) || [];

    if (
      !dayEntries.length
    ) {
      return;
    }

    const next =
      activePhotoIndex +
      delta;

    if (
      next < 0 ||
      next >=
        dayEntries.length
    ) {
      return;
    }

    activePhotoIndex =
      next;

    renderViewer();
  }

  function renderViewer() {
    const day =
      DAYS[
        selectedDay - 1
      ];

    const dayEntries =
      groups.get(
        selectedDay
      ) || [];

    const entry =
      dayEntries[
        activePhotoIndex
      ];

    if (
      !entry ||
      !day
    ) {
      return;
    }

    const image =
      publicImageUrl(
        entry.image_path
      );

    const imageEl =
      document.getElementById(
        "hjViewerImg"
      );

    if (imageEl) {
      imageEl.src =
        image;

      imageEl.alt =
        entry.caption ||
        entry.location_name ||
        "זיכרון מהטיול של חגית";
    }

    const bg =
      document.getElementById(
        "hjViewerBg"
      );

    if (bg) {
      bg.style.backgroundImage =
        `url("${image}")`;
    }

    setText(
      "hjViewerTitle",
      `DAY ${String(
        day.d
      ).padStart(
        2,
        "0"
      )} · ${day.short}`
    );

    setText(
      "hjViewerDate",
      day.dateLong
    );

    setText(
      "hjViewerIndex",
      `${
        activePhotoIndex + 1
      } / ${dayEntries.length}`
    );

    setText(
      "hjViewerCaption",
      entry.caption
        ? `״${entry.caption}״`
        : "רגע ששווה לשמור."
    );

    setText(
      "hjViewerMeta",
      [
        formatDateTime(
          entry.taken_at ||
            entry.created_at
        ),

        entry.location_name,
      ]
        .filter(Boolean)
        .join(" · ")
    );

    const prev =
      document.getElementById(
        "hjPhotoPrev"
      );

    const next =
      document.getElementById(
        "hjPhotoNext"
      );

    if (prev) {
      prev.disabled =
        activePhotoIndex ===
        0;
    }

    if (next) {
      next.disabled =
        activePhotoIndex ===
        dayEntries.length -
          1;
    }

    const filmstrip =
      document.getElementById(
        "hjFilmstrip"
      );

    if (filmstrip) {
      filmstrip.innerHTML =
        dayEntries
          .map(
            (
              photo,
              index
            ) => `
              <button
                class="
                  hj-film-thumb
                  ${
                    index ===
                    activePhotoIndex
                      ? "is-active"
                      : ""
                  }
                "
                type="button"
                data-film-index="${index}"
              >

                <img
                  src="${escapeAttr(
                    publicImageUrl(
                      photo.image_path
                    )
                  )}"
                  alt=""
                  loading="lazy"
                >

              </button>
            `
          )
          .join("");

      filmstrip
        .querySelectorAll(
          "[data-film-index]"
        )
        .forEach(
          (button) =>
            button.addEventListener(
              "click",
              () => {
                activePhotoIndex =
                  Number(
                    button.dataset
                      .filmIndex ||
                      0
                  );

                renderViewer();
              }
            )
        );

      requestAnimationFrame(
        () =>
          filmstrip
            .querySelector(
              ".hj-film-thumb.is-active"
            )
            ?.scrollIntoView(
              {
                behavior:
                  "smooth",

                inline:
                  "center",

                block:
                  "nearest",
              }
            )
      );
    }

    renderComments(
      entry
    );

    updateIdentity();
  }

  function renderComments(
    entry
  ) {
    const list =
      document.getElementById(
        "hjCommentList"
      );

    const count =
      document.getElementById(
        "hjCommentCount"
      );

    const note =
      document.getElementById(
        "hjCommentsNote"
      );

    if (
      !list ||
      !entry
    ) {
      return;
    }

    const comments =
      commentsByEntry.get(
        String(
          entry.id
        )
      ) || [];

    if (count) {
      count.textContent =
        `(${comments.length})`;
    }

    if (!commentsAvailable) {
      list.innerHTML = `
        <div
          class="hj-comment-empty"
        >

          <b>
            התגובות עוד לא הופעלו
          </b>

          <span>
            ברגע שניצור את טבלת
            התגובות ב-Supabase,
            הן יעבדו כאן בלי לשנות
            את העיצוב.
          </span>

        </div>
      `;

      if (note) {
        note.textContent =
          "צריך להשלים פעם אחת את הגדרת journal_comments ב-Supabase.";
      }

      return;
    }

    if (note) {
      note.textContent =
        "";
    }

    if (!comments.length) {
      list.innerHTML = `
        <div
          class="hj-comment-empty"
        >

          <b>
            עוד אין תגובות
            לתמונה הזאת
          </b>

          <span>
            תהיו הראשונים שיכתבו
            לחגית ✦
          </span>

        </div>
      `;

      return;
    }

    list.innerHTML =
      comments
        .map(
          (comment) => `
            <div
              class="hj-bubble"
            >

              <div
                class="hj-bubble-head"
              >

                <b>
                  ${escapeHtml(
                    comment.nickname
                  )}
                </b>

                <small>
                  ${escapeHtml(
                    formatCommentTime(
                      comment.created_at
                    )
                  )}
                </small>

              </div>

              <p>
                ${escapeHtml(
                  comment.comment
                )}
              </p>

            </div>
          `
        )
        .join("");

    list.scrollTop =
      list.scrollHeight;
  }

  async function submitComment() {
    const dayEntries =
      groups.get(
        selectedDay
      ) || [];

    const entry =
      dayEntries[
        activePhotoIndex
      ];

    const input =
      document.getElementById(
        "hjCommentInput"
      );

    const button =
      document.getElementById(
        "hjSendComment"
      );

    if (
      !entry ||
      !input
    ) {
      return;
    }

    if (!commentsAvailable) {
      document
        .getElementById(
          "hjCommentsNote"
        )
        .textContent =
          "התגובות עדיין לא מחוברות ל-Supabase.";

      return;
    }

    const text =
      input.value.trim();

    if (!text) {
      return;
    }

    const nickname =
      getNickname();

    if (!nickname) {
      openNicknameModal();
      return;
    }

    if (button) {
      button.disabled =
        true;

      button.textContent =
        "…";
    }

    try {
      const response =
        await fetch(
          `${SUPABASE_URL}/rest/v1/${COMMENTS_TABLE}`,
          {
            method:
              "POST",

            headers: {
              apikey:
                SUPABASE_PUBLISHABLE_KEY,

              Authorization:
                `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,

              "Content-Type":
                "application/json",

              Prefer:
                "return=representation",
            },

            body:
              JSON.stringify({
                journal_entry_id:
                  entry.id,

                nickname,

                comment:
                  text,
              }),
          }
        );

      if (!response.ok) {
        throw new Error(
          `Comment insert failed (${response.status})`
        );
      }

      const inserted =
        await response.json();

      const current =
        commentsByEntry.get(
          String(
            entry.id
          )
        ) || [];

      commentsByEntry.set(
        String(
          entry.id
        ),
        [
          ...current,
          ...(
            Array.isArray(
              inserted
            )
              ? inserted
              : []
          ),
        ]
      );

      input.value = "";

      renderComments(
        entry
      );

      renderMemories();
    } catch (error) {
      console.error(
        "Comment error:",
        error
      );

      document
        .getElementById(
          "hjCommentsNote"
        )
        .textContent =
          "התגובה לא נשלחה. נסו שוב בעוד רגע.";
    } finally {
      if (button) {
        button.disabled =
          false;

        button.textContent =
          "↑";
      }
    }
  }

  function getNickname() {
    try {
      return (
        localStorage.getItem(
          NICKNAME_KEY
        ) || ""
      );
    } catch {
      return "";
    }
  }

  function updateIdentity() {
    const name =
      getNickname();

    setText(
      "hjIdentityText",
      name
        ? `מגיב/ה בתור ${name}`
        : "עדיין לא בחרת כינוי"
    );
  }

  function openNicknameModal() {
    const modal =
      document.getElementById(
        "hjNicknameModal"
      );

    const input =
      document.getElementById(
        "hjNicknameInput"
      );

    if (input) {
      input.value =
        getNickname();
    }

    modal?.classList.add(
      "is-open"
    );

    modal?.setAttribute(
      "aria-hidden",
      "false"
    );

    setTimeout(
      () =>
        input?.focus(),
      50
    );
  }

  function saveNickname() {
    const input =
      document.getElementById(
        "hjNicknameInput"
      );

    const name =
      String(
        input?.value ||
          ""
      )
        .trim()
        .slice(
          0,
          40
        );

    if (!name) {
      return;
    }

    try {
      localStorage.setItem(
        NICKNAME_KEY,
        name
      );
    } catch {}

    document
      .getElementById(
        "hjNicknameModal"
      )
      ?.classList.remove(
        "is-open"
      );

    document
      .getElementById(
        "hjNicknameModal"
      )
      ?.setAttribute(
        "aria-hidden",
        "true"
      );

    updateIdentity();

    document
      .getElementById(
        "hjCommentInput"
      )
      ?.focus();
  }

  function updateHeroStatus() {
    const totalPhotos =
      entries.length;

    const daysWithPhotos =
      DAYS.filter(
        (day) =>
          (
            groups.get(day.d) ||
            []
          ).length
      ).length;

    const latest =
      entries[
        entries.length - 1
      ];

    if (totalPhotos) {
      setText(
        "hjHeroStatus",
        `${totalPhotos} MEMORIES · ${daysWithPhotos} DAYS ALIVE`
      );

      setText(
        "hjHeroMeta",
        latest
          ? `עודכן לאחרונה ${formatDateTime(
              latest.taken_at ||
                latest.created_at
            )}${
              latest.location_name
                ? ` · ${latest.location_name}`
                : ""
            }`
          : ""
      );
    } else {
      setText(
        "hjHeroStatus",
        "20 DAYS · ONE STORY"
      );

      setText(
        "hjHeroMeta",
        "הזיכרונות יתחילו להופיע כאן מהאייפון של חגית"
      );
    }
  }

  function renderFatalError() {
    const hive =
      document.getElementById(
        "hjPhotoHive"
      );

    if (!hive) {
      return;
    }

    hive.className =
      "hj-photo-hive is-empty";

    hive.innerHTML = `
      <div
        class="hj-memory-empty"
      >

        <span>↻</span>

        <small>
          LIVE JOURNEY
        </small>

        <b>
          ONE SEC.
        </b>

        <p>
          היומן לא הצליח להיטען
          כרגע. התמונות עצמן
          נשארות שמורות בענן.
        </p>

        <button
          type="button"
          id="hjRetry"
        >
          נסו שוב
        </button>

      </div>
    `;

    document
      .getElementById(
        "hjRetry"
      )
      ?.addEventListener(
        "click",
        () =>
          loadAll(true)
      );
  }

  function publicImageUrl(
    path
  ) {
    const encoded =
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
      `${encoded}`
    );
  }

  function formatTime(
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
          hour:
            "2-digit",

          minute:
            "2-digit",
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

  function formatCommentTime(
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

          hour:
            "2-digit",

          minute:
            "2-digit",
        }
      )
      .format(date);
  }

  function setText(
    id,
    text
  ) {
    const element =
      document.getElementById(
        id
      );

    if (element) {
      element.textContent =
        text || "";
    }
  }

  function escapeHtml(
    value
  ) {
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

  function installMobileNavigation() {
    const nav =
      document.querySelector(
        ".aviation-nav"
      );

    const links =
      [
        ...document.querySelectorAll(
          ".nav-links a[href^='#']"
        ),
      ];

    if (
      !nav ||
      !links.length ||
      nav.querySelector(
        ".hagit-mobile-nav"
      )
    ) {
      return;
    }

    const mobile =
      document.createElement(
        "div"
      );

    mobile.className =
      "hagit-mobile-nav";

    mobile.innerHTML = `
      <div
        class="hagit-mobile-nav-track"
      >

        <a
          href="#top"
          data-mobile-nav-link
        >
          ראשי
        </a>

        ${links
          .map(
            (link) => `
              <a
                href="${escapeAttr(
                  link.getAttribute(
                    "href"
                  ) || ""
                )}"
                data-mobile-nav-link
              >
                ${escapeHtml(
                  link.textContent
                    ?.trim() ||
                    ""
                )}
              </a>
            `
          )
          .join("")}

      </div>
    `;

    nav.appendChild(
      mobile
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

        let target;

        try {
          target =
            document.querySelector(
              href
            );
        } catch {
          return;
        }

        if (!target) {
          return;
        }

        event.preventDefault();

        const navHeight =
          document
            .querySelector(
              ".aviation-nav"
            )
            ?.getBoundingClientRect()
            .height ||
          0;

        const top =
          target
            .getBoundingClientRect()
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

    const observer =
      new IntersectionObserver(
        (observed) => {
          const visible =
            observed
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
                  `#${visible.target.id}`;

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

  function installStyles() {
    document
      .getElementById(
        "hagitLiveJourneyStyles"
      )
      ?.remove();

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "hagitLiveJourneyStyles";

    style.textContent = `

      .journal-section {
        overflow-anchor: none !important;

        background:
          radial-gradient(
            circle at 16% 6%,
            rgba(129,54,255,.14),
            transparent 26%
          ),
          radial-gradient(
            circle at 90% 35%,
            rgba(219,78,255,.08),
            transparent 24%
          ),
          linear-gradient(
            180deg,
            #07050b,
            #0b0710 58%,
            #060409
          ) !important;

        color:
          #f8f3fb !important;

        padding:
          82px 0 !important;
      }

      .hj-wrap {
        width:
          min(
            1420px,
            calc(100% - 34px)
          );

        margin:
          auto;

        font-family:
          "Heebo",
          Arial,
          sans-serif;
      }

      .hj-hero {
        display:
          grid;

        grid-template-columns:
          minmax(0,1fr)
          auto;

        align-items:
          end;

        gap:
          30px;

        margin-bottom:
          32px;
      }

      .hj-kicker {
        font:
          500 10px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .25em;

        color:
          #c5a5e7;

        direction:
          ltr;

        margin-bottom:
          10px;
      }

      .hj-main-title {
        margin:
          0;

        font:
          500
          clamp(
            55px,
            7vw,
            105px
          )/.78
          "Cormorant Garamond",
          serif !important;

        letter-spacing:
          -.045em;

        color:
          #f8f3fb !important;
      }

      .hj-main-title em {
        display:
          block;

        color:
          #c899ff;

        font-style:
          italic;
      }

      .hj-main-copy {
        max-width:
          800px;

        margin:
          20px 0 0;

        color:
          #b8adbf;

        font-size:
          16px;

        line-height:
          1.82;

        font-weight:
          300;
      }

      .hj-live-card {
        min-width:
          285px;

        padding:
          18px;

        border:
          1px solid
          rgba(
            221,
            185,
            121,
            .28
          );

        border-radius:
          18px;

        background:
          linear-gradient(
            145deg,
            rgba(
              33,
              22,
              44,
              .78
            ),
            rgba(
              12,
              9,
              17,
              .86
            )
          );

        box-shadow:
          0 24px 70px
          rgba(
            0,
            0,
            0,
            .35
          );
      }

      .hj-live-card small {
        display:
          block;

        color:
          #9d8fa8;

        font:
          500 8px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .15em;
      }

      .hj-live-card b {
        display:
          block;

        margin-top:
          6px;

        font:
          500 18px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .02em;
      }

      .hj-live-card span {
        display:
          block;

        margin-top:
          7px;

        color:
          #cdbad5;

        font-size:
          11px;

        line-height:
          1.5;
      }

      .hj-days-shell {
        position:
          relative;

        padding:
          22px 52px 28px;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .09
          );

        border-radius:
          24px;

        background:
          radial-gradient(
            circle at 52% 0%,
            rgba(
              125,
              57,
              255,
              .13
            ),
            transparent 30%
          ),
          rgba(
            10,
            7,
            14,
            .72
          );

        box-shadow:
          0 32px 100px
          rgba(
            0,
            0,
            0,
            .48
          );

        overflow:
          hidden;
      }

      .hj-days-head {
        display:
          flex;

        align-items:
          center;

        justify-content:
          space-between;

        gap:
          18px;

        margin-bottom:
          12px;
      }

      .hj-days-head b {
        font:
          500 11px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .17em;

        color:
          #d8c7e1;

        direction:
          ltr;
      }

      .hj-days-head span {
        font-size:
          11px;

        color:
          #8e8396;
      }

      .hj-days-track {
        display:
          flex;

        gap:
          14px;

        overflow-x:
          auto;

        scroll-snap-type:
          x mandatory;

        scrollbar-width:
          none;

        padding:
          14px 6px 20px;

        direction:
          ltr;
      }

      .hj-days-track::-webkit-scrollbar {
        display:
          none;
      }

      .hj-day-chip {
        flex:
          0 0 174px;

        height:
          194px;

        position:
          relative;

        border:
          0;

        padding:
          0;

        overflow:
          hidden;

        clip-path:
          polygon(
            25% 0,
            75% 0,
            100% 22%,
            100% 78%,
            75% 100%,
            25% 100%,
            0 78%,
            0 22%
          );

        background:
          #16111c;

        scroll-snap-align:
          center;

        isolation:
          isolate;

        transition:
          .25s transform,
          .25s filter;
      }

      .hj-day-chip:hover {
        transform:
          translateY(-6px);
      }

      .hj-day-chip:before {
        content:
          "";

        position:
          absolute;

        inset:
          0;

        padding:
          1px;

        clip-path:
          inherit;

        z-index:
          7;

        pointer-events:
          none;

        background:
          linear-gradient(
            140deg,
            rgba(
              225,
              187,
              120,
              .56
            ),
            rgba(
              162,
              86,
              255,
              .3
            ),
            rgba(
              225,
              187,
              120,
              .36
            )
          );

        -webkit-mask:
          linear-gradient(
            #000 0 0
          )
          content-box,
          linear-gradient(
            #000 0 0
          );

        -webkit-mask-composite:
          xor;

        mask-composite:
          exclude;
      }

      .hj-day-chip.is-active {
        filter:
          drop-shadow(
            0 0 18px
            rgba(
              164,
              85,
              255,
              .52
            )
          );
      }

      .hj-day-chip.is-active:before {
        padding:
          2px;

        background:
          linear-gradient(
            140deg,
            #efd296,
            #ac65ff,
            #efd296
          );
      }

      .hj-day-chip.is-waiting {
        filter:
          saturate(.55)
          brightness(.72);
      }

      .hj-day-chip img {
        position:
          absolute;

        inset:
          0;

        width:
          100%;

        height:
          100%;

        object-fit:
          cover;

        filter:
          saturate(.88)
          brightness(.76);
      }

      .hj-day-placeholder {
        position:
          absolute;

        inset:
          0;

        display:
          grid;

        place-items:
          center;

        background:
          radial-gradient(
            circle at 50% 38%,
            rgba(
              162,
              86,
              255,
              .28
            ),
            transparent 34%
          ),
          linear-gradient(
            145deg,
            #17101e,
            #08060c
          );
      }

      .hj-day-placeholder i {
        font:
          500 35px
          "Cormorant Garamond",
          serif;

        color:
          rgba(
            232,
            203,
            255,
            .36
          );
      }

      .hj-day-chip-shade {
        position:
          absolute;

        inset:
          0;

        z-index:
          2;

        background:
          linear-gradient(
            to top,
            rgba(
              5,
              3,
              8,
              .97
            ),
            rgba(
              5,
              3,
              8,
              .42
            )
            50%,
            rgba(
              5,
              3,
              8,
              .15
            )
          );
      }

      .hj-day-chip-number {
        position:
          absolute;

        z-index:
          4;

        top:
          16px;

        left:
          0;

        right:
          0;

        text-align:
          center;

        font:
          300 27px
          "Cormorant Garamond",
          serif;

        color:
          #f2e8f4;
      }

      .hj-day-chip-copy {
        position:
          absolute;

        z-index:
          4;

        left:
          10px;

        right:
          10px;

        bottom:
          20px;

        text-align:
          center;
      }

      .hj-day-chip-copy b {
        display:
          block;

        font:
          500 11px/1.15
          "Montserrat",
          sans-serif;

        color:
          #fff;
      }

      .hj-day-chip-copy small {
        display:
          block;

        margin-top:
          5px;

        font:
          500 7px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .1em;

        color:
          #b0a3b6;
      }

      .hj-day-chip-copy span {
        display:
          block;

        margin-top:
          8px;

        font:
          500 8px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .08em;

        color:
          #e2c178;
      }

      .hj-days-arrow {
        position:
          absolute;

        top:
          54%;

        transform:
          translateY(-50%);

        z-index:
          10;

        width:
          38px;

        height:
          38px;

        border-radius:
          50%;

        border:
          1px solid
          rgba(
            221,
            185,
            121,
            .3
          );

        background:
          rgba(
            7,
            5,
            11,
            .8
          );

        color:
          #fff;

        font-size:
          25px;

        display:
          grid;

        place-items:
          center;
      }

      .hj-days-prev {
        left:
          10px;
      }

      .hj-days-next {
        right:
          10px;
      }

      .hj-day-world {
        margin-top:
          20px;

        display:
          grid;

        gap:
          14px;

        scroll-margin-top:
          120px;
      }

      .hj-day-header {
        padding:
          22px 24px;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .09
          );

        border-radius:
          22px;

        background:
          linear-gradient(
            135deg,
            rgba(
              28,
              18,
              38,
              .82
            ),
            rgba(
              10,
              7,
              14,
              .9
            )
          );

        display:
          grid;

        grid-template-columns:
          auto
          minmax(0,1fr)
          auto;

        align-items:
          center;

        gap:
          18px;

        box-shadow:
          0 24px 70px
          rgba(
            0,
            0,
            0,
            .28
          );
      }

      .hj-day-orb {
        width:
          76px;

        height:
          76px;

        border-radius:
          50%;

        display:
          grid;

        place-items:
          center;

        border:
          1px solid
          rgba(
            225,
            190,
            255,
            .18
          );

        background:
          radial-gradient(
            circle at 30% 22%,
            #d8bbff,
            #8c4de4 45%,
            #271231 76%
          );

        box-shadow:
          0 14px 40px
          rgba(
            130,
            59,
            220,
            .18
          );
      }

      .hj-day-orb span {
        font:
          300 27px
          "Montserrat",
          sans-serif;
      }

      .hj-day-title small {
        font:
          500 9px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .18em;

        color:
          #b798ce;
      }

      .hj-day-title h3 {
        margin:
          4px 0 0;

        font:
          500
          clamp(
            30px,
            4vw,
            46px
          )/1
          "Cormorant Garamond",
          serif;

        color:
          #fff;
      }

      .hj-day-title p {
        margin:
          7px 0 0;

        color:
          #a99dad;

        font-size:
          12px;
      }

      .hj-day-live {
        text-align:
          left;
      }

      .hj-day-live b {
        display:
          block;

        color:
          #aa9db2;

        font:
          600 9px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .13em;
      }

      .hj-day-live b.is-live {
        color:
          #ff7fbd;
      }

      .hj-day-live span {
        display:
          block;

        margin-top:
          6px;

        color:
          #9d91a3;

        font-size:
          10px;

        max-width:
          260px;
      }

      .hj-main-grid {
        display:
          grid;

        grid-template-columns:
          minmax(0,1.05fr)
          minmax(420px,.95fr);

        gap:
          14px;
      }

      .hj-panel {
        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .09
          );

        border-radius:
          22px;

        background:
          rgba(
            13,
            9,
            18,
            .82
          );

        box-shadow:
          0 28px 90px
          rgba(
            0,
            0,
            0,
            .38
          );

        overflow:
          hidden;
      }

      .hj-panel-head {
        display:
          flex;

        align-items:
          center;

        justify-content:
          space-between;

        gap:
          16px;

        padding:
          17px 18px;

        border-bottom:
          1px solid
          rgba(
            255,
            255,
            255,
            .09
          );
      }

      .hj-panel-head b {
        font-size:
          14px;
      }

      .hj-panel-head small {
        color:
          #877d8f;

        font:
          500 8px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .14em;
      }

      .hj-plan-body {
        padding:
          15px 18px 18px;
      }

      .hj-plan-summary {
        padding:
          14px;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .07
          );

        border-radius:
          15px;

        background:
          rgba(
            255,
            255,
            255,
            .025
          );

        margin-bottom:
          12px;
      }

      .hj-plan-summary small {
        display:
          block;

        color:
          #9687a0;

        font:
          500 8px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .13em;
      }

      .hj-plan-summary b {
        display:
          block;

        margin-top:
          5px;

        font-size:
          16px;
      }

      .hj-plan-summary p {
        margin:
          5px 0 0;

        color:
          #9e92a5;

        font-size:
          11px;

        line-height:
          1.6;
      }

      .hj-planned-list {
        position:
          relative;

        display:
          grid;

        gap:
          7px;
      }

      .hj-planned-list:before {
        content:
          "";

        position:
          absolute;

        right:
          14px;

        top:
          15px;

        bottom:
          15px;

        width:
          1px;

        background:
          linear-gradient(
            #a455ff,
            rgba(
              221,
              185,
              121,
              .2
            )
          );
      }

      .hj-plan-item {
        display:
          grid;

        grid-template-columns:
          30px 1fr;

        gap:
          10px;

        align-items:
          center;

        position:
          relative;
      }

      .hj-plan-item span {
        width:
          29px;

        height:
          29px;

        border-radius:
          50%;

        display:
          grid;

        place-items:
          center;

        z-index:
          2;

        background:
          #17111f;

        border:
          1px solid
          rgba(
            182,
            122,
            255,
            .28
          );

        font-size:
          10px;

        color:
          #c9a1ff;
      }

      .hj-plan-item b {
        font-size:
          12px;

        font-weight:
          500;
      }

      .hj-live-route {
        margin-top:
          16px;

        border-top:
          1px solid
          rgba(
            255,
            255,
            255,
            .09
          );

        padding-top:
          14px;
      }

      .hj-live-route-title {
        display:
          flex;

        align-items:
          center;

        gap:
          8px;

        margin-bottom:
          9px;

        flex-wrap:
          wrap;
      }

      .hj-live-route-title i {
        width:
          6px;

        height:
          6px;

        border-radius:
          50%;

        background:
          #ff4d9c;

        box-shadow:
          0 0 14px
          #ff4d9c;
      }

      .hj-live-route-title b {
        font:
          600 9px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .15em;

        color:
          #d5c5dd;
      }

      .hj-live-route-title span {
        color:
          #756b7c;

        font-size:
          9px;
      }

      .hj-live-points {
        display:
          flex;

        gap:
          7px;

        overflow-x:
          auto;

        scrollbar-width:
          none;
      }

      .hj-live-points::-webkit-scrollbar {
        display:
          none;
      }

      .hj-live-point {
        flex:
          0 0 auto;

        padding:
          8px 10px;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .08
          );

        border-radius:
          12px;

        background:
          rgba(
            255,
            255,
            255,
            .025
          );

        color:
          #fff;

        text-align:
          right;
      }

      .hj-live-point small {
        display:
          block;

        color:
          #8c8293;

        font-size:
          9px;
      }

      .hj-live-point b {
        display:
          block;

        margin-top:
          2px;

        font-size:
          11px;
      }

      .hj-live-point span {
        display:
          block;

        margin-top:
          2px;

        color:
          #d6bbde;

        font-size:
          9px;
      }

      .hj-live-empty {
        width:
          100%;

        padding:
          13px;

        border:
          1px dashed
          rgba(
            255,
            255,
            255,
            .1
          );

        border-radius:
          13px;

        background:
          rgba(
            255,
            255,
            255,
            .018
          );
      }

      .hj-live-empty b,
      .hj-live-empty span {
        display:
          block;
      }

      .hj-live-empty b {
        font-size:
          11px;
      }

      .hj-live-empty span {
        margin-top:
          3px;

        color:
          #84798b;

        font-size:
          10px;
      }

      .hj-map-wrap {
        height:
          100%;

        min-height:
          480px;

        position:
          relative;
      }

      .hj-map-panel {
        min-height:
          480px;
      }

      #hjLiveMap {
        height:
          100%;

        min-height:
          480px;

        background:
          #0b0910;

        z-index:
          1;
      }

      .hj-map-wrap
      .leaflet-container {
        font-family:
          "Heebo",
          Arial,
          sans-serif;

        background:
          #0b0910;
      }

      .hj-map-wrap
      .leaflet-control-attribution {
        font-size:
          8px;

        background:
          rgba(
            5,
            3,
            8,
            .68
          );

        color:
          #8c8192;
      }

      .hj-map-wrap
      .leaflet-control-attribution a {
        color:
          #b69adb;
      }

      .hj-map-wrap
      .leaflet-popup-content-wrapper,
      .hj-map-wrap
      .leaflet-popup-tip {
        background:
          #130f19;

        color:
          #fff;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .09
          );
      }

      .hj-map-status {
        position:
          absolute;

        z-index:
          500;

        inset:
          0;

        display:
          none;

        place-items:
          center;

        padding:
          26px;

        pointer-events:
          none;

        background:
          radial-gradient(
            circle at center,
            rgba(
              111,
              51,
              178,
              .16
            ),
            transparent 42%
          );
      }

      .hj-map-status.is-visible {
        display:
          grid;
      }

      .hj-map-status > div {
        max-width:
          330px;

        padding:
          17px;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .09
          );

        border-radius:
          16px;

        text-align:
          center;

        background:
          rgba(
            8,
            5,
            12,
            .83
          );

        backdrop-filter:
          blur(12px);
      }

      .hj-map-status small,
      .hj-map-status b,
      .hj-map-status span {
        display:
          block;
      }

      .hj-map-status small {
        font:
          500 8px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .15em;

        color:
          #9c8ba8;
      }

      .hj-map-status b {
        margin-top:
          5px;

        font-size:
          14px;
      }

      .hj-map-status span {
        margin-top:
          5px;

        color:
          #8d8294;

        font-size:
          10px;
      }

      .hj-memories {
        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .09
          );

        border-radius:
          24px;

        background:
          rgba(
            11,
            8,
            15,
            .9
          );

        box-shadow:
          0 32px 100px
          rgba(
            0,
            0,
            0,
            .48
          );

        overflow:
          hidden;
      }

      .hj-mem-head {
        padding:
          23px 24px;

        border-bottom:
          1px solid
          rgba(
            255,
            255,
            255,
            .09
          );

        display:
          flex;

        justify-content:
          space-between;

        align-items:
          flex-end;

        gap:
          16px;
      }

      .hj-mem-head small {
        display:
          block;

        color:
          #ad8dc3;

        font:
          500 8px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .17em;
      }

      .hj-mem-head b {
        display:
          block;

        margin-top:
          5px;

        font:
          500
          clamp(
            28px,
            3.6vw,
            45px
          )/1
          "Cormorant Garamond",
          serif;
      }

      .hj-mem-head span {
        color:
          #9b8fa4;

        font-size:
          11px;
      }

      .hj-photo-hive {
        display:
          grid;

        grid-template-columns:
          1.55fr
          .72fr
          .72fr;

        grid-template-rows:
          310px
          310px;

        gap:
          10px;

        padding:
          12px;

        min-height:
          642px;
      }

      .hj-photo-cell {
        position:
          relative;

        border:
          0;

        padding:
          0;

        border-radius:
          16px;

        overflow:
          hidden;

        background:
          #151119;

        color:
          #fff;
      }

      .hj-photo-cell img {
        width:
          100%;

        height:
          100%;

        object-fit:
          cover;

        display:
          block;

        transition:
          .35s transform,
          .35s filter;

        filter:
          saturate(.96)
          contrast(1.02);
      }

      .hj-photo-cell:hover img {
        transform:
          scale(1.025);

        filter:
          saturate(1.04)
          contrast(1.03);
      }

      .hj-photo-cell.is-featured {
        grid-row:
          1/3;
      }

      .hj-photo-4 {
        grid-column:
          2/4;
      }

      .hj-photo-5,
      .hj-photo-6 {
        display:
          none;
      }

      .hj-photo-gradient {
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
              .66
            ),
            rgba(
              4,
              2,
              7,
              .08
            )
            42%,
            transparent 64%
          );
      }

      .hj-featured-label {
        position:
          absolute;

        z-index:
          4;

        top:
          14px;

        left:
          14px;

        padding:
          7px 9px;

        border-radius:
          999px;

        background:
          rgba(
            7,
            4,
            11,
            .6
          );

        border:
          1px solid
          rgba(
            221,
            185,
            121,
            .34
          );

        color:
          #e6c884;

        font:
          500 8px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .14em;
      }

      .hj-photo-tag,
      .hj-photo-comments {
        position:
          absolute;

        z-index:
          4;

        bottom:
          11px;

        padding:
          6px 8px;

        border-radius:
          999px;

        background:
          rgba(
            7,
            4,
            11,
            .7
          );

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .12
          );

        font-size:
          9px;
      }

      .hj-photo-tag {
        right:
          12px;

        max-width:
          70%;

        overflow:
          hidden;

        text-overflow:
          ellipsis;

        white-space:
          nowrap;
      }

      .hj-photo-comments {
        left:
          12px;
      }

      .hj-photo-more {
        position:
          absolute;

        z-index:
          5;

        inset:
          0;

        display:
          grid;

        place-content:
          center;

        background:
          rgba(
            6,
            3,
            10,
            .52
          );

        backdrop-filter:
          blur(3px);

        font:
          500 36px
          "Montserrat",
          sans-serif;
      }

      .hj-photo-more small {
        display:
          block;

        text-align:
          center;

        margin-top:
          2px;

        font-size:
          8px;

        letter-spacing:
          .18em;
      }

      .hj-photo-hive.is-empty {
        display:
          grid;

        grid-template-columns:
          1fr;

        grid-template-rows:
          auto;

        min-height:
          420px;
      }

      .hj-memory-empty {
        display:
          grid;

        place-content:
          center;

        text-align:
          center;

        padding:
          38px;

        background:
          radial-gradient(
            circle at center,
            rgba(
              142,
              65,
              220,
              .16
            ),
            transparent 35%
          ),
          linear-gradient(
            145deg,
            #110b18,
            #07050b
          );
      }

      .hj-memory-empty span {
        color:
          #c895ff;

        font-size:
          32px;
      }

      .hj-memory-empty small {
        margin-top:
          8px;

        color:
          #887990;

        font:
          500 9px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .17em;
      }

      .hj-memory-empty b {
        margin-top:
          5px;

        font:
          500
          clamp(
            38px,
            5vw,
            65px
          )/.9
          "Cormorant Garamond",
          serif;
      }

      .hj-memory-empty p {
        max-width:
          520px;

        margin:
          10px auto 0;

        color:
          #93879a;

        font-size:
          12px;
      }

      .hj-memory-empty button {
        justify-self:
          center;

        margin-top:
          15px;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .12
          );

        border-radius:
          999px;

        padding:
          9px 14px;

        background:
          rgba(
            255,
            255,
            255,
            .05
          );

        color:
          #fff;
      }

      .hj-viewer {
        position:
          fixed;

        inset:
          0;

        z-index:
          100000;

        display:
          none;

        padding:
          18px;

        background:
          rgba(
            3,
            2,
            5,
            .92
          );

        backdrop-filter:
          blur(18px);

        -webkit-backdrop-filter:
          blur(18px);
      }

      .hj-viewer.is-open {
        display:
          grid;

        place-items:
          center;
      }

      .hj-viewer-open {
        overflow:
          hidden !important;
      }

      .hj-viewer-shell {
        width:
          min(
            1320px,
            100%
          );

        height:
          min(
            900px,
            calc(
              100vh - 36px
            )
          );

        display:
          grid;

        grid-template-columns:
          minmax(0,1fr)
          340px;

        overflow:
          hidden;

        border:
          1px solid
          rgba(
            232,
            208,
            255,
            .13
          );

        border-radius:
          22px;

        background:
          #09070d;

        box-shadow:
          0 40px 150px
          rgba(
            0,
            0,
            0,
            .72
          );
      }

      .hj-viewer-photo {
        position:
          relative;

        overflow:
          hidden;

        background:
          #050307;

        min-width:
          0;
      }

      .hj-viewer-bg {
        position:
          absolute;

        inset:
          -30px;

        background-position:
          center;

        background-size:
          cover;

        filter:
          blur(34px)
          brightness(.27)
          saturate(.66);

        transform:
          scale(1.12);
      }

      .hj-viewer-img {
        position:
          absolute;

        inset:
          0;

        width:
          100%;

        height:
          100%;

        object-fit:
          contain;

        z-index:
          2;
      }

      .hj-viewer-shade {
        position:
          absolute;

        inset:
          0;

        z-index:
          3;

        background:
          linear-gradient(
            to top,
            rgba(
              4,
              2,
              7,
              .95
            ),
            rgba(
              4,
              2,
              7,
              .45
            )
            24%,
            transparent 51%
          ),
          linear-gradient(
            to bottom,
            rgba(
              4,
              2,
              7,
              .38
            ),
            transparent 20%
          );
      }

      .hj-viewer-top {
        position:
          absolute;

        z-index:
          7;

        top:
          16px;

        left:
          18px;

        right:
          18px;

        display:
          grid;

        grid-template-columns:
          1fr auto 1fr;

        gap:
          14px;

        align-items:
          center;
      }

      .hj-viewer-top > div {
        text-align:
          center;
      }

      .hj-viewer-top b {
        display:
          block;

        font:
          500 11px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .1em;
      }

      .hj-viewer-top small {
        display:
          block;

        margin-top:
          3px;

        color:
          #8f8397;

        font:
          500 8px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .12em;
      }

      .hj-viewer-top > span {
        justify-self:
          end;

        font:
          500 9px
          "Montserrat",
          sans-serif;

        color:
          #b2a5ba;
      }

      .hj-close {
        justify-self:
          start;

        width:
          38px;

        height:
          38px;

        border-radius:
          50%;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .14
          );

        background:
          rgba(
            6,
            4,
            10,
            .58
          );

        color:
          #fff;

        font-size:
          23px;
      }

      .hj-viewer-copy {
        position:
          absolute;

        z-index:
          6;

        left:
          28px;

        right:
          28px;

        bottom:
          108px;

        text-align:
          center;
      }

      .hj-viewer-copy p {
        margin:
          0;

        color:
          #fff;

        font-size:
          clamp(
            20px,
            2.1vw,
            31px
          );

        font-weight:
          300;
      }

      .hj-viewer-copy small {
        display:
          block;

        margin-top:
          7px;

        color:
          #afa2b6;

        font-size:
          10px;
      }

      .hj-viewer-arrow {
        position:
          absolute;

        z-index:
          8;

        top:
          50%;

        transform:
          translateY(-50%);

        width:
          46px;

        height:
          46px;

        border-radius:
          50%;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .16
          );

        background:
          rgba(
            6,
            4,
            10,
            .58
          );

        color:
          #fff;

        font-size:
          29px;
      }

      .hj-viewer-prev {
        left:
          15px;
      }

      .hj-viewer-next {
        right:
          15px;
      }

      .hj-viewer-arrow:disabled {
        opacity:
          .16;

        pointer-events:
          none;
      }

      .hj-filmstrip {
        position:
          absolute;

        z-index:
          7;

        left:
          18px;

        right:
          18px;

        bottom:
          18px;

        display:
          flex;

        gap:
          7px;

        overflow-x:
          auto;

        scrollbar-width:
          none;
      }

      .hj-filmstrip::-webkit-scrollbar {
        display:
          none;
      }

      .hj-film-thumb {
        flex:
          0 0 72px;

        width:
          72px;

        height:
          62px;

        padding:
          0;

        border-radius:
          8px;

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

        background:
          #111;

        opacity:
          .48;
      }

      .hj-film-thumb.is-active {
        opacity:
          1;

        border-color:
          #e2be79;

        box-shadow:
          0 0 0 1px
          rgba(
            226,
            190,
            121,
            .28
          );
      }

      .hj-film-thumb img {
        width:
          100%;

        height:
          100%;

        object-fit:
          cover;
      }

      .hj-comments {
        border-right:
          1px solid
          rgba(
            255,
            255,
            255,
            .09
          );

        padding:
          18px;

        background:
          linear-gradient(
            180deg,
            #121018,
            #0b0910
          );

        display:
          grid;

        grid-template-rows:
          auto 1fr auto;

        gap:
          12px;

        min-height:
          0;
      }

      .hj-comments-head {
        display:
          flex;

        align-items:
          end;

        justify-content:
          space-between;

        gap:
          10px;
      }

      .hj-comments-head h3 {
        margin:
          0;

        font-size:
          16px;
      }

      .hj-comments-head h3 span {
        color:
          #83788b;

        font-size:
          11px;

        font-weight:
          400;
      }

      .hj-comments-head small {
        color:
          #786d80;

        font-size:
          9px;
      }

      .hj-comment-list {
        overflow-y:
          auto;

        display:
          flex;

        flex-direction:
          column;

        gap:
          9px;

        min-height:
          0;
      }

      .hj-bubble {
        padding:
          11px 12px;

        border-radius:
          15px 15px 5px 15px;

        background:
          rgba(
            255,
            255,
            255,
            .05
          );

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .065
          );
      }

      .hj-bubble-head {
        display:
          flex;

        justify-content:
          space-between;

        align-items:
          center;

        gap:
          8px;

        margin-bottom:
          4px;
      }

      .hj-bubble-head b {
        font-size:
          12px;
      }

      .hj-bubble-head small {
        font-size:
          8px;

        color:
          #776d7e;
      }

      .hj-bubble p {
        margin:
          0;

        color:
          #d7cedb;

        font-size:
          12px;

        line-height:
          1.55;
      }

      .hj-comment-empty {
        margin:
          auto;

        text-align:
          center;

        padding:
          20px;

        color:
          #7d7284;
      }

      .hj-comment-empty b,
      .hj-comment-empty span {
        display:
          block;
      }

      .hj-comment-empty b {
        color:
          #a89bad;

        font-size:
          12px;
      }

      .hj-comment-empty span {
        margin-top:
          4px;

        font-size:
          10px;

        line-height:
          1.5;
      }

      .hj-composer {
        border-top:
          1px solid
          rgba(
            255,
            255,
            255,
            .09
          );

        padding-top:
          11px;
      }

      .hj-composer-row {
        display:
          grid;

        grid-template-columns:
          1fr 42px;

        gap:
          7px;
      }

      .hj-composer-row input {
        width:
          100%;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .09
          );

        border-radius:
          11px;

        background:
          #17131c;

        color:
          #fff;

        padding:
          10px 11px;

        outline:
          none;
      }

      .hj-composer-row input:focus {
        border-color:
          rgba(
            164,
            85,
            255,
            .55
          );
      }

      .hj-composer-row button {
        border:
          0;

        border-radius:
          11px;

        background:
          linear-gradient(
            135deg,
            #a455ff,
            #6d31df
          );

        color:
          #fff;

        font-size:
          17px;
      }

      .hj-composer-row button:disabled {
        opacity:
          .5;
      }

      .hj-identity {
        display:
          flex;

        justify-content:
          space-between;

        gap:
          8px;

        margin-top:
          7px;

        color:
          #786e80;

        font-size:
          9px;
      }

      .hj-identity button {
        border:
          0;

        background:
          none;

        color:
          #bf9ce6;

        padding:
          0;

        font-size:
          9px;
      }

      .hj-comments-note {
        min-height:
          14px;

        margin-top:
          4px;

        color:
          #bd7e98;

        font-size:
          9px;
      }

      .hj-nickname-modal {
        position:
          fixed;

        inset:
          0;

        z-index:
          120000;

        display:
          none;

        place-items:
          center;

        padding:
          18px;

        background:
          rgba(
            2,
            1,
            4,
            .78
          );

        backdrop-filter:
          blur(14px);
      }

      .hj-nickname-modal.is-open {
        display:
          grid;
      }

      .hj-nickname-card {
        width:
          min(
            410px,
            100%
          );

        padding:
          23px;

        border:
          1px solid
          rgba(
            220,
            190,
            255,
            .16
          );

        border-radius:
          21px;

        background:
          #120e18;

        box-shadow:
          0 30px 100px
          rgba(
            0,
            0,
            0,
            .6
          );
      }

      .hj-nickname-card small {
        font:
          500 8px
          "Montserrat",
          sans-serif;

        letter-spacing:
          .18em;

        color:
          #a48bb3;
      }

      .hj-nickname-card h3 {
        margin:
          7px 0 5px;

        font-size:
          24px;
      }

      .hj-nickname-card p {
        margin:
          0 0 14px;

        color:
          #9b90a2;

        font-size:
          12px;
      }

      .hj-nickname-card input {
        width:
          100%;

        padding:
          11px;

        border-radius:
          11px;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .09
          );

        background:
          #0d0a11;

        color:
          #fff;

        outline:
          none;
      }

      .hj-nickname-card > button {
        width:
          100%;

        margin-top:
          9px;

        border:
          0;

        border-radius:
          11px;

        padding:
          11px;

        background:
          linear-gradient(
            135deg,
            #a455ff,
            #6d31df
          );

        color:
          #fff;

        font-weight:
          700;
      }

      .hagit-mobile-nav {
        display:
          none;
      }

      @media (
        max-width:
          1100px
      ) {

        .hj-main-grid {
          grid-template-columns:
            1fr;
        }

        .hj-map-wrap,
        #hjLiveMap {
          min-height:
            430px;
        }

        .hj-hero {
          grid-template-columns:
            1fr;
        }

        .hj-live-card {
          display:
            none;
        }

        .hj-viewer-shell {
          grid-template-columns:
            1fr;

          grid-template-rows:
            minmax(
              420px,
              1.35fr
            )
            minmax(
              280px,
              .65fr
            );
        }

        .hj-comments {
          border-right:
            0;

          border-top:
            1px solid
            rgba(
              255,
              255,
              255,
              .09
            );
        }

      }

      @media (
        max-width:
          900px
      ) {

        .aviation-nav
        .nav-links {
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
              .1
            );

          background:
            rgba(
              8,
              5,
              16,
              .94
            );

          backdrop-filter:
            blur(22px);
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
            8px 12px 9px;

          scrollbar-width:
            none;
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
            7px 11px;

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

      }

      @media (
        max-width:
          700px
      ) {

        .journal-section {
          padding:
            58px 0 !important;
        }

        .hj-wrap {
          width:
            min(
              100% - 16px,
              1420px
            );
        }

        .hj-main-title {
          font-size:
            clamp(
              48px,
              15vw,
              72px
            ) !important;
        }

        .hj-main-copy {
          font-size:
            14px;
        }

        .hj-days-shell {
          padding:
            18px 10px 24px;

          overflow:
            visible;
        }

        .hj-days-arrow {
          display:
            none;
        }

        .hj-days-track {
          display:
            grid;

          grid-template-columns:
            1fr 1fr;

          overflow:
            visible;

          gap:
            10px;

          padding:
            10px 0;
        }

        .hj-day-chip {
          width:
            100%;

          height:
            auto;

          aspect-ratio:
            .9;

          flex:
            none;
        }

        .hj-day-header {
          grid-template-columns:
            auto 1fr;

          padding:
            16px;
        }

        .hj-day-live {
          display:
            none;
        }

        .hj-day-orb {
          width:
            58px;

          height:
            58px;
        }

        .hj-day-orb span {
          font-size:
            21px;
        }

        .hj-day-title h3 {
          font-size:
            28px;
        }

        .hj-main-grid {
          gap:
            10px;
        }

        .hj-panel {
          border-radius:
            18px;
        }

        .hj-map-wrap,
        #hjLiveMap {
          min-height:
            390px;
        }

        .hj-mem-head {
          align-items:
            flex-start;

          flex-direction:
            column;

          padding:
            19px;
        }

        .hj-photo-hive {
          grid-template-columns:
            1fr 1fr;

          grid-template-rows:
            360px
            190px
            190px;

          min-height:
            760px;
        }

        .hj-photo-cell.is-featured {
          grid-column:
            1/3;

          grid-row:
            auto;
        }

        .hj-photo-4 {
          grid-column:
            1/3;
        }

        .hj-viewer {
          padding:
            0;
        }

        .hj-viewer-shell {
          width:
            100%;

          height:
            100%;

          border:
            0;

          border-radius:
            0;

          grid-template-columns:
            1fr;

          grid-template-rows:
            58vh
            42vh;
        }

        .hj-viewer-copy {
          bottom:
            96px;

          left:
            18px;

          right:
            18px;
        }

        .hj-viewer-top {
          top:
            11px;

          left:
            11px;

          right:
            11px;
        }

        .hj-viewer-arrow {
          width:
            39px;

          height:
            39px;

          font-size:
            25px;
        }

        .hj-viewer-prev {
          left:
            8px;
        }

        .hj-viewer-next {
          right:
            8px;
        }

        .hj-comments {
          padding:
            14px;
        }

        .hj-film-thumb {
          flex-basis:
            58px;

          width:
            58px;

          height:
            52px;
        }

      }

      @media (
        max-width:
          440px
      ) {

        .hj-days-track {
          grid-template-columns:
            1fr 1fr;
        }

        .hj-day-chip-copy b {
          font-size:
            9px;
        }

        .hj-photo-hive {
          grid-template-rows:
            330px
            170px
            170px;
        }

        .hj-photo-tag {
          max-width:
            62%;

          font-size:
            8px;
        }

        .hj-photo-comments {
          font-size:
            8px;
        }

      }
    `;

    document.head.appendChild(
      style
    );
  }
})();
