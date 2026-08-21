(() => {
  "use strict";

  const SB = "https://fqoziqglyrcjttnuismx.supabase.co";
  const KEY = "sb_publishable_2Z_EWufBUdNlSvesyg2bmA_7obNjRsI";
  const BUCKET = "journal-photos";
  const COMMENTS = "journal_comments";
  const NAME_KEY = "hagit60-family-nickname";
  const GEO_KEY = "hagit60-geocode-cache-v24";
  const REFRESH_MS = 30000;
  const BIRTHDAY_DAY = 5;

  const DAYS = [
    [1,"17 AUG 2026","LOS ANGELES","תל אביב → לוס אנג׳לס","טיסה ישירה, הוליווד, תיאטרון דולבי, בוורלי הילס ושוק האיכרים.",["טיסה ישירה ללוס אנג׳לס","Hollywood Walk of Fame","Dolby Theatre","Beverly Hills","Farmers Market"]],
    [2,"18 AUG 2026","SAN DIEGO","סאן דייגו","לה הויה, המרינה, פסל הנשיקה, האי קורונאדו והעיר העתיקה.",["La Jolla","המרינה של סאן דייגו","Unconditional Surrender — פסל הנשיקה","Coronado Island","Old Town San Diego"]],
    [3,"19 AUG 2026","UNIVERSAL · LA","יוניברסל סטודיוז + סנטה מוניקה","יום פארק ואולפנים, אחריו טיילת ומזח סנטה מוניקה.",["Universal Studios Hollywood","סיור האולפנים והמתקנים","Santa Monica","Santa Monica Pier"]],
    [4,"20 AUG 2026","SANTA BARBARA · SOLVANG","סנטה ברברה + סולוונג","צפון קליפורניה, אדריכלות ספרדית ועיירה דנית ציורית.",["Santa Barbara","מרכז העיר והאדריכלות הספרדית","נסיעה צפונה על החוף","Solvang"]],
    [5,"21 AUG 2026","MONTEREY · SAN FRANCISCO","מונטריי + דרך 17 המייל + סן פרנסיסקו","חוף פסיפי, מצוקים, מונטריי והגעה לסן פרנסיסקו בערב.",["Monterey","17-Mile Drive","חוף האוקיינוס הפסיפי","הגעה לסן פרנסיסקו"]],
    [6,"22 AUG 2026","SAN FRANCISCO","סן פרנסיסקו + סוסליטו","גולדן גייט, פישרמנס וורף, אלקטרז מבחוץ, לומבארד, Twin Peaks וצ׳יינה טאון.",["Golden Gate Bridge","Sausalito","Fisherman’s Wharf","Alcatraz — תצפית מבחוץ","Lombard Street","Twin Peaks","Chinatown"]],
    [7,"23 AUG 2026","YOSEMITE","יוסמיטי פארק","אל קפיטן, מפלים, נופי סיירה נבדה ועצי סקוויה.",["Yosemite National Park","El Capitan","מפלים ונקודות תצפית","Sierra Nevada","עצי סקוויה"]],
    [8,"24 AUG 2026","LAS VEGAS","לאס וגאס","נסיעה דרך קליפורניה והגעה לעיר האורות. אפשרות לסיור לילה.",["נסיעה ללאס וגאס","הגעה למלון","Las Vegas Strip","אפשרות לסיור לילה"]],
    [9,"25 AUG 2026","HOOVER DAM · LAS VEGAS","סכר הובר + לאס וגאס","תצפיות על סכר הובר ואגם מיד, חזרה לקניות וזמן בעיר.",["Hoover Dam","Lake Mead","חזרה ללאס וגאס","קניות וזמן חופשי"]],
    [10,"26 AUG 2026","LAS VEGAS","לאס וגאס — יום חופשי + מופע","יום עצמאי בין המלונות והקניות, בערב מופע בידור כלול.",["יום חופשי בלאס וגאס","מלונות ואטרקציות בסטריפ","קניות","מופע בידור בערב"]],
    [11,"27 AUG 2026","ZION · BRYCE","ציון פארק + ברייס קניון","יום של טבע ביוטה: צוקים אדומים, צריחי סלע וגבהים שבהם הערב יכול להיות ממש קריר.",["Zion National Park","צוקים ונופי יוטה","Bryce Canyon","תצפיות על ה-Hoodoos"]],
    [12,"28 AUG 2026","GRAND CANYON","סכר גלן + Horseshoe Bend + גרנד קניון","אגם פאואל, עיקול פרסת הסוס ותצפיות על הגרנד קניון.",["Glen Canyon Dam","Lake Powell","Horseshoe Bend","Grand Canyon","תצפיות שקיעה/אחה״צ"]],
    [13,"29 AUG 2026","PHOENIX → WASHINGTON","פניקס → וושינגטון","פרידה מהמערב וטיסת פנים מפניקס לוושינגטון. הגעה בשעות הערב.",["נסיעה לפניקס","טיסת פנים","Phoenix → Washington D.C.","הגעה למלון בערב"]],
    [14,"30 AUG 2026","WASHINGTON D.C.","וושינגטון די.סי.","הקפיטול, הבית הלבן, אנדרטאות וושינגטון, ג׳פרסון, וייטנאם, רוזוולט ומלחמת העולם השנייה.",["U.S. Capitol","White House","Washington Monument","Jefferson Memorial","Vietnam Veterans Memorial","FDR Memorial","World War II Memorial"]],
    [15,"31 AUG 2026","AMISH COUNTRY · HERSHEY","חבל האמיש + הרשי","אורח החיים של האמיש ועולם השוקולד של הרשי. לינה בפנסילבניה.",["Amish Country","היכרות עם אורח החיים של האמיש","Hershey","Hershey’s Chocolate World"]],
    [16,"01 SEP 2026","WATKINS GLEN · NIAGARA","ווטקינס גלן + מפלי הניאגרה","מסלול טבע בין מפלים וקניון, מעבר לצד הקנדי של ניאגרה ומפלים מוארים בערב.",["Watkins Glen State Park","מסלול קניון ומפלים","נסיעה לניאגרה","מעבר לצד הקנדי","Niagara Falls בלילה"]],
    [17,"02 SEP 2026","NIAGARA · SCRANTON","שייט בניאגרה + Niagara-on-the-Lake","שייט אל המפלים עם מעיל גשם, עיירת ניאגרה און דה לייק והמשך לכיוון סקרנטון.",["שייט אל מפלי הניאגרה","Niagara-on-the-Lake","המשך דרומה","נסיעה לכיוון Scranton"]],
    [18,"03 SEP 2026","NEW YORK CITY","ניו יורק — היכרות ראשונה","רוקפלר, השדרה החמישית, סנט פטריק, סנטרל פארק, לינקולן סנטר והיכרות ערב רגלית.",["Rockefeller Center","Fifth Avenue","St. Patrick’s Cathedral","Central Park","Lincoln Center","סיור ערב רגלי"]],
    [19,"04 SEP 2026","NEW YORK · MANHATTAN","ניו יורק — מנהטן","אמפייר סטייט, גריניץ׳ וילג׳, צ׳לסי מרקט, היי ליין, סוהו, צ׳יינה טאון, וול סטריט וגראונד זירו.",["Empire State Building","Greenwich Village","Chelsea Market","High Line","SoHo","Chinatown","Wall Street","Ground Zero"]],
    [20,"05 SEP 2026","NEW YORK → HOME","ג׳רזי גארדן → טיסה לישראל","קניות אחרונות בג׳רזי גארדן ובהתאם לשעת הטיסה — לשדה ולדרך הביתה.",["The Mills at Jersey Gardens","קניות אחרונות","נסיעה לשדה התעופה","טיסה לישראל"]]
  ].map(x => ({
    d: x[0],
    date: x[1],
    short: x[2],
    title: x[3],
    desc: x[4],
    planned: x[5]
  }));

  const root = document.getElementById("journal");
  if (!root) return;

  const $ = s => document.querySelector(s);

  const esc = v =>
    String(v ?? "").replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[c]);

  const attr = v =>
    esc(v).replace(/`/g, "&#96;");

  let entries = [];
  let groups = new Map();
  let commentsByEntry = new Map();
  let commentsAvailable = true;

  let selectedDay = 1;
  let activePhotoIndex = 0;

  let loading = false;

  let map = null;
  let markers = null;
  let route = null;

  let geocodeBusy = false;
  let geocodeCache = loadGeoCache();

  injectStyles();
  buildShell();
  bindEvents();

  ensureLeaflet()
    .then(() => refresh(true));

  setInterval(
    () => refresh(false),
    REFRESH_MS
  );

  function buildShell() {
    root.innerHTML = `
      <div class="hj-wrap">

        <section class="hj-hero">

          <div>
            <div class="hj-kicker">
              THE JOURNEY BECOMES THE JOURNAL
            </div>

            <h2
              class="hj-title"
              dir="ltr"
            >
              PLANNED ROUTE.<br>
              <em>REAL MEMORIES.</em>
            </h2>

            <p>
              כל יום בטיול הוא עולם אחד:
              מה תוכנן, איפה חגית באמת הייתה,
              מה היא כתבה על הרגע —
              ומה המשפחה ענתה לה.
            </p>
          </div>

          <aside>
            <small>
              HAGIT 60 · LIVE JOURNEY
            </small>

            <b id="hjHeroStatus">
              20 DAYS · ONE STORY
            </b>

            <span id="hjHeroMeta">
              הזיכרונות מגיעים ישר מהאייפון
            </span>
          </aside>

        </section>

        <section class="hj-days">

          <header>
            <b>
              20 DAYS · LIVE ROUTE
            </b>

            <span>
              בחרו יום כדי לפתוח את העולם שלו
            </span>
          </header>

          <div id="hjDays"></div>

        </section>

        <section
          class="hj-world"
          id="hjWorld"
        >

          <section
            class="hj-birthday-banner"
            id="hjBirthdayBanner"
            aria-hidden="true"
          >
            <div class="hj-bday-copy">
              <small>
                DAY 05 · 21 AUG 2026 · HAGIT TURNS 60
              </small>

              <b>
                TODAY, <em>SHE TURNS 60.</em>
              </b>

              <p>
                מונטריי · 17-Mile Drive · סן פרנסיסקו —
                אבל היום המסלול מקבל עוד כוכבית:
                זה יום ההולדת של אמא ✨
              </p>
            </div>

            <div class="hj-bday-60">
              <span>60</span>
              <small>BIRTHDAY GIRL</small>
            </div>

            <div class="hj-bday-balloons" aria-hidden="true">
              <i class="b1"></i>
              <i class="b2"></i>
              <i class="b3"></i>
            </div>
          </section>

          <header class="hj-day-head">

            <strong id="hjDayNum">
              01
            </strong>

            <div>
              <small id="hjDayDate"></small>
              <h3 id="hjDayTitle"></h3>
              <p id="hjDayDesc"></p>
            </div>

          </header>

          <div class="hj-grid">

            <section class="hj-panel">

              <header>
                <b>
                  היום המתוכנן
                </b>

                <small>
                  THE PLAN
                </small>
              </header>

              <div class="hj-plan">

                <div
                  id="hjPlanSummary"
                ></div>

                <div
                  id="hjPlanList"
                ></div>

                <hr>

                <div class="hj-was-title">
                  <b>
                    ● HAGIT WAS HERE ✦
                  </b>

                  <span>
                    לפי התמונות והשעה שבה הן צולמו
                  </span>
                </div>

                <div
                  id="hjStops"
                ></div>

              </div>

            </section>

            <section class="hj-panel">

              <header>
                <b>
                  המפה החיה של היום
                </b>

                <small>
                  PHOTO ROUTE
                </small>
              </header>

              <div class="hj-map-wrap">

                <div id="hjMap"></div>

                <div
                  id="hjMapMessage"
                ></div>

              </div>

            </section>

          </div>

          <section class="hj-memories">

            <header>

              <div>
                <small>
                  MEMORIES FROM TODAY
                </small>

                <b>
                  התמונות הן הסיפור.
                </b>
              </div>

              <span
                id="hjMemoryMeta"
              ></span>

            </header>

            <div
              id="hjPhotoScroll"
            ></div>

          </section>

        </section>

      </div>

      <div
        class="hj-viewer"
        id="hjViewer"
      >

        <div class="hj-view-shell">

          <div class="hj-view-photo">

            <div
              id="hjViewBlur"
            ></div>

            <img
              id="hjViewImg"
              alt=""
            >

            <div
              class="hj-view-shade"
            ></div>

            <button
              class="hj-close"
              id="hjClose"
            >
              ×
            </button>

            <button
              class="hj-arrow prev"
              id="hjPrev"
            >
              ‹
            </button>

            <button
              class="hj-arrow next"
              id="hjNext"
            >
              ›
            </button>

            <div class="hj-view-copy">
              <p id="hjViewCaption"></p>
              <small id="hjViewMeta"></small>
            </div>

            <div id="hjFilm"></div>

          </div>

          <aside class="hj-comments">

            <header>
              <b>
                תגובות
                <span id="hjCommentCount">
                  (0)
                </span>
              </b>

              <small>
                לתמונה הזאת
              </small>
            </header>

            <div
              id="hjCommentList"
            ></div>

            <div class="hj-compose">

              <div>
                <input
                  id="hjCommentInput"
                  maxlength="500"
                  placeholder="כתבו תגובה לתמונה…"
                >

                <button id="hjSend">
                  ↑
                </button>
              </div>

              <footer>

                <span id="hjIdentity">
                  עדיין לא בחרת כינוי
                </span>

                <button id="hjChangeName">
                  בחר כינוי
                </button>

              </footer>

              <small
                id="hjCommentNote"
              ></small>

            </div>

          </aside>

        </div>

      </div>

      <div
        class="hj-name-modal"
        id="hjNameModal"
      >

        <div>

          <small>
            FAMILY COMMENTS
          </small>

          <h3>
            איך קוראים לך?
          </h3>

          <p>
            נשמור את הכינוי בדפדפן הזה
            כדי שבפעם הבאה פשוט יהיה אפשר להגיב.
          </p>

          <input
            id="hjNameInput"
            maxlength="40"
            placeholder="למשל: ניצן"
          >

          <button id="hjSaveName">
            זה אני ✦
          </button>

        </div>

      </div>
    `;
  }

  function bindEvents() {

    $("#hjClose").onclick =
      closeViewer;

    $("#hjPrev").onclick =
      () => stepPhoto(-1);

    $("#hjNext").onclick =
      () => stepPhoto(1);

    $("#hjChangeName").onclick =
      openNameModal;

    $("#hjSaveName").onclick =
      saveName;

    $("#hjSend").onclick =
      submitComment;

    $("#hjCommentInput").onfocus =
      () => {
        if (!getName()) {
          openNameModal();
        }
      };

    $("#hjCommentInput").onclick =
      () => {
        if (!getName()) {
          openNameModal();
        }
      };

    $("#hjCommentInput").onkeydown =
      e => {
        if (e.key === "Enter") {
          submitComment();
        }
      };

    $("#hjNameInput").onkeydown =
      e => {
        if (e.key === "Enter") {
          saveName();
        }
      };

    $("#hjViewer").onclick =
      e => {
        if (
          e.target ===
          $("#hjViewer")
        ) {
          closeViewer();
        }
      };

    document.addEventListener(
      "keydown",
      e => {

        if (
          !$("#hjViewer")
            .classList
            .contains("open")
        ) {
          return;
        }

        if (e.key === "Escape") {
          closeViewer();
        }

        if (e.key === "ArrowLeft") {
          stepPhoto(-1);
        }

        if (e.key === "ArrowRight") {
          stepPhoto(1);
        }
      }
    );
  }

  async function refresh(first) {

    if (loading) {
      return;
    }

    loading = true;

    try {

      entries =
        await fetchEntries();

      groups =
        groupEntries(entries);

      await fetchComments();

      if (first) {
        selectedDay =
          pickInitialDay();
      }

      renderAll();

    } catch (e) {

      console.error(
        "HAGIT JOURNAL",
        e
      );

    } finally {

      loading = false;
    }
  }

  async function fetchEntries() {

    const url =
      `${SB}/rest/v1/journal_entries` +
      `?select=` +
      `id,created_at,taken_at,` +
      `latitude,longitude,location_name,` +
      `day_number,caption,image_path` +
      `&order=taken_at.asc.nullslast,created_at.asc`;

    const r =
      await fetch(
        url,
        {
          headers: {
            apikey: KEY,
            Authorization:
              `Bearer ${KEY}`,
            Accept:
              "application/json"
          },
          cache:
            "no-store"
        }
      );

    if (!r.ok) {
      throw new Error(
        `journal_entries ${r.status}`
      );
    }

    return r.json();
  }

  async function fetchComments() {

    try {

      const r =
        await fetch(
          `${SB}/rest/v1/${COMMENTS}` +
          `?select=` +
          `id,journal_entry_id,` +
          `nickname,comment,created_at` +
          `&order=created_at.asc`,
          {
            headers: {
              apikey:
                KEY,
              Authorization:
                `Bearer ${KEY}`,
              Accept:
                "application/json"
            },
            cache:
              "no-store"
          }
        );

      commentsAvailable =
        r.ok;

      commentsByEntry =
        new Map();

      if (!r.ok) {
        return;
      }

      const rows =
        await r.json();

      rows.forEach(
        c => {

          const key =
            String(
              c.journal_entry_id ||
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
            .push(c);
        }
      );

    } catch {

      commentsAvailable =
        false;

      commentsByEntry =
        new Map();
    }
  }

  function groupEntries(list) {

    const m =
      new Map(
        DAYS.map(
          d => [
            d.d,
            []
          ]
        )
      );

    list.forEach(
      e => {

        let n =
          Number(
            e.day_number ||
            0
          );

        if (!n) {
          n =
            dayFromDate(
              e.taken_at ||
              e.created_at
            );
        }

        if (
          n >= 1 &&
          n <= 20
        ) {
          m.get(n).push(e);
        }
      }
    );

    m.forEach(
      a =>
        a.sort(
          (x,y) =>
            new Date(
              x.taken_at ||
              x.created_at
            ) -
            new Date(
              y.taken_at ||
              y.created_at
            )
        )
    );

    return m;
  }

  function dayFromDate(v) {

    if (!v) {
      return 0;
    }

    const d =
      new Date(
        `${String(v).slice(0,10)}T00:00:00Z`
      );

    const start =
      new Date(
        "2026-08-17T00:00:00Z"
      );

    return Number.isNaN(
      d.getTime()
    )
      ? 0
      : Math.floor(
          (d - start) /
          86400000
        ) + 1;
  }

  function pickInitialDay() {

    const filled =
      DAYS.filter(
        d =>
          (
            groups.get(d.d) ||
            []
          ).length
      );

    return filled.length
      ? filled[
          filled.length - 1
        ].d
      : 1;
  }

  function renderAll() {

    renderHero();
    renderDays();
    renderDay();

    if (
      $("#hjViewer")
        .classList
        .contains("open")
    ) {
      renderViewer();
    }
  }

  function renderHero() {

    const alive =
      DAYS.filter(
        d =>
          (
            groups.get(d.d) ||
            []
          ).length
      ).length;

    const last =
      entries.at(-1);

    $("#hjHeroStatus").textContent =
      entries.length
        ? `${entries.length} MEMORIES · ${alive} DAYS ALIVE`
        : "20 DAYS · ONE STORY";

    $("#hjHeroMeta").textContent =
      last
        ? `עודכן ${formatDateTime(
            last.taken_at ||
            last.created_at
          )}${
            last.location_name
              ? " · " +
                last.location_name
              : ""
          }`
        : "הזיכרונות מגיעים ישר מהאייפון";
  }

  function renderDays() {    $("#hjDays").innerHTML =
      DAYS.map(
        d => {

          const a =
            groups.get(d.d) ||
            [];

          const cover =
            a[0]
              ? imageUrl(
                  a[0].image_path
                )
              : "";

          return `
            <button
              class="
                hj-chip
                ${
                  d.d === selectedDay
                    ? "active"
                    : ""
                }
                ${
                  d.d === BIRTHDAY_DAY
                    ? "birthday"
                    : ""
                }
              "
              data-day="${d.d}"
            >

              ${
                d.d === BIRTHDAY_DAY
                  ? `
                    <span class="hj-bday-ribbon">
                      🎂 HAGIT'S 60TH BIRTHDAY
                    </span>

                    <span class="hj-chip-balloon b1"></span>
                    <span class="hj-chip-balloon b2"></span>
                    <span class="hj-chip-balloon b3"></span>
                  `
                  : ""
              }

              ${
                cover
                  ? `
                    <img
                      src="${attr(cover)}"
                      alt=""
                    >
                  `
                  : `
                    <i>✦</i>
                  `
              }

              <strong>
                ${String(d.d).padStart(
                  2,
                  "0"
                )}
              </strong>

              <span>

                <b>
                  ${esc(d.short)}
                </b>

                <small>
                  ${d.date}
                </small>

                <em>
                  ${
                    d.d === BIRTHDAY_DAY
                      ? (
                          a.length
                            ? `🎂 ${a.length} BIRTHDAY MEMORIES`
                            : "THE BIRTHDAY DAY ✦"
                        )
                      : (
                          a.length
                            ? `▣ ${a.length} MEMORIES`
                            : "WAITING TO BE LIVED"
                        )
                  }
                </em>

              </span>

            </button>
          `;
        }
      ).join("");

    document
      .querySelectorAll(
        ".hj-chip"
      )
      .forEach(
        b =>
          b.onclick =
            () => {

              selectedDay =
                Number(
                  b.dataset.day
                );

              activePhotoIndex =
                0;

              renderAll();

              $("#hjWorld")
                .scrollIntoView({
                  behavior:
                    "smooth",
                  block:
                    "start"
                });
            }
      );
  }

  function renderDay() {

    const d =
      DAYS[
        selectedDay - 1
      ];

    const a =
      groups.get(
        selectedDay
      ) || [];

    $("#hjWorld")
      .classList
      .toggle(
        "birthday-day",
        d.d === BIRTHDAY_DAY
      );

    $("#hjBirthdayBanner")
      .setAttribute(
        "aria-hidden",
        d.d === BIRTHDAY_DAY
          ? "false"
          : "true"
      );

    $("#hjDayNum").textContent =
      String(d.d).padStart(
        2,
        "0"
      );

    $("#hjDayDate").textContent =
      d.d === BIRTHDAY_DAY
        ? `${d.date} · HAGIT'S 60TH BIRTHDAY`
        : d.date;

    $("#hjDayTitle").textContent =
      d.title;

    $("#hjDayDesc").textContent =
      d.desc;

    $("#hjPlanSummary").innerHTML = `
      <small>
        WHAT'S PLANNED
      </small>

      <b>
        ${esc(d.title)}
      </b>

      <p>
        ${esc(d.desc)}
      </p>
    `;

    $("#hjPlanList").innerHTML =
      d.planned
        .map(
          (x,i) => `
            <div
              class="hj-plan-item"
            >
              <span>
                ${i+1}
              </span>

              <b>
                ${esc(x)}
              </b>
            </div>
          `
        )
        .join("");

    renderPhotos(a);
    renderRoute(a);

    resolveGeocodes(a)
      .then(
        changed => {

          if (
            changed &&
            d.d === selectedDay
          ) {
            renderRoute(a);
          }
        }
      );
  }

  function renderPhotos(a) {

    const host =
      $("#hjPhotoScroll");

    $("#hjMemoryMeta").textContent =
      a.length
        ? `${a.length} זיכרונות · ${
            a.length > 4
              ? "החליקו כדי לראות את כולן"
              : "כל התמונות כאן"
          }`
        : "הגלריה מחכה לתמונה הראשונה";

    if (!a.length) {

      host.innerHTML = `
        <div
          class="hj-board c1"
        >
          <div class="hj-empty">
            WAITING TO BE LIVED ✦
          </div>
        </div>
      `;

      return;
    }

    const boards = [];

    for (
      let i = 0;
      i < a.length;
      i += 4
    ) {
      boards.push(
        a.slice(
          i,
          i + 4
        )
      );
    }

    host.innerHTML =
      boards
        .map(
          (
            board,
            bi
          ) => `
            <div
              class="
                hj-board
                c${board.length}
              "
            >

              ${board
                .map(
                  (
                    e,
                    j
                  ) => {

                    const index =
                      bi * 4 + j;

                    const c =
                      cleanCaption(
                        e.caption
                      );

                    const cc =
                      (
                        commentsByEntry.get(
                          String(e.id)
                        ) ||
                        []
                      ).length;

                    return `
                      <button
                        class="
                          hj-card
                          p${j+1}
                        "
                        data-photo="${index}"
                      >

                        ${
                          selectedDay === BIRTHDAY_DAY
                            ? `
                              <span class="hj-photo-birthday">
                                🎂 BIRTHDAY MEMORY
                              </span>

                              <span
                                class="hj-mini-balloons"
                                aria-hidden="true"
                              >
                                <i></i>
                                <i></i>
                                <i></i>
                              </span>
                            `
                            : ""
                        }

                        <img
                          src="${attr(
                            imageUrl(
                              e.image_path
                            )
                          )}"
                          alt=""
                        >

                        <span
                          class="hj-photo-gradient"
                        ></span>

                        <span
                          class="hj-card-copy"
                        >

                          ${
                            c
                              ? `
                                <strong>
                                  ״${esc(c)}״
                                </strong>
                              `
                              : ""
                          }

                          <small>
                            ${esc(
                              formatTime(
                                e.taken_at ||
                                e.created_at
                              )
                            )}

                            ${
                              e.location_name
                                ? " · " +
                                  esc(
                                    e.location_name
                                  )
                                : ""
                            }
                          </small>

                        </span>

                        <span class="hj-cc">
                          💬 ${cc}
                        </span>

                      </button>
                    `;
                  }
                )
                .join("")}

            </div>
          `
        )
        .join("");

    document
      .querySelectorAll(
        ".hj-card[data-photo]"
      )
      .forEach(
        b =>
          b.onclick =
            () => {

              activePhotoIndex =
                Number(
                  b.dataset.photo
                );

              openViewer();
            }
      );
  }

  function buildStops(a) {

    const out = [];

    a.forEach(
      (
        e,
        index
      ) => {

        const c =
          coordinates(e);

        if (!c) {
          return;
        }

        const k =
          `${Number(c.lat).toFixed(4)},` +
          `${Number(c.lng).toFixed(4)}`;

        const prev =
          out.at(-1);

        const item = {
          entry: e,
          index
        };

        if (
          prev &&
          prev.key === k
        ) {

          prev.items.push(
            item
          );

        } else {

          out.push({
            key: k,

            lat:
              Number(c.lat),

            lng:
              Number(c.lng),

            name:
              e.location_name ||
              c.label ||
              "מיקום מהתמונה",

            time:
              e.taken_at ||
              e.created_at,

            items: [
              item
            ]
          });
        }
      }
    );

    return out;
  }

  function renderRoute(a) {

    const stops =
      buildStops(a);

    $("#hjStops").innerHTML =
      stops.length
        ? stops
            .map(
              (
                s,
                i
              ) => `
                <button
                  class="hj-stop"
                  data-lat="${s.lat}"
                  data-lng="${s.lng}"
                >

                  <small>
                    ${esc(
                      formatTime(
                        s.time
                      )
                    )}
                  </small>

                  <b>
                    ${esc(
                      s.name ||
                      `עצירה ${i+1}`
                    )}
                  </b>

                  <span>
                    📸 ${s.items.length}
                  </span>

                </button>
              `
            )
            .join("")
        : `
            <div class="hj-empty">
              ${
                a.some(
                  e =>
                    String(
                      e.location_name ||
                      ""
                    ).trim()
                )
                  ? "מאתר את המקומות שעל התמונות…"
                  : "אין עדיין מיקום לתמונות של היום"
              }
            </div>
          `;

    document
      .querySelectorAll(
        ".hj-stop"
      )
      .forEach(
        b =>
          b.onclick =
            () =>
              map?.flyTo(
                [
                  Number(
                    b.dataset.lat
                  ),

                  Number(
                    b.dataset.lng
                  )
                ],
                15
              )
      );

    renderMap(
      stops,
      a
    );
  }

  function coordinates(e) {

    const lat =
      Number(
        e.latitude
      );

    const lng =
      Number(
        e.longitude
      );

    if (
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      Math.abs(lat) <= 90 &&
      Math.abs(lng) <= 180 &&
      !(
        lat === 0 &&
        lng === 0
      )
    ) {
      return {
        lat,
        lng,

        label:
          e.location_name ||
          ""
      };
    }

    const c =
      geocodeCache[
        normalize(
          e.location_name
        )
      ];

    return (
      c &&
      !c.notFound
    )
      ? c
      : null;
  }

  async function resolveGeocodes(a) {

    if (geocodeBusy) {
      return false;
    }

    const queue = [];
    const seen = new Set();

    a.forEach(
      e => {

        if (coordinates(e)) {
          return;
        }

        const key =
          normalize(
            e.location_name
          );

        if (
          !key ||
          seen.has(key) ||
          geocodeCache[key]
        ) {
          return;
        }

        seen.add(key);

        queue.push({
          key,

          name:
            String(
              e.location_name ||
              ""
            ).trim()
        });
      }
    );

    if (!queue.length) {
      return false;
    }

    geocodeBusy = true;

    let changed = false;

    try {

      for (
        let i = 0;
        i < queue.length;
        i++
      ) {

        if (i) {
          await sleep(1150);
        }

        const x =
          queue[i];

        try {

          const q =
            improveLocation(
              x.name
            );

          const p =
            new URLSearchParams({
              q,

              format:
                "jsonv2",

              limit:
                "1",

              "accept-language":
                "en,he"
            });

          const r =
            await fetch(
              `https://nominatim.openstreetmap.org/search?${p.toString()}`,
              {
                headers: {
                  Accept:
                    "application/json"
                }
              }
            );

          const rows =
            r.ok
              ? await r.json()
              : [];

          geocodeCache[
            x.key
          ] =
            rows[0]
              ? {
                  lat:
                    Number(
                      rows[0].lat
                    ),

                  lng:
                    Number(
                      rows[0].lon
                    ),

                  label:
                    rows[0]
                      .display_name
                }
              : {
                  notFound:
                    true
                };

          saveGeoCache();

          changed =
            true;

        } catch (e) {

          console.warn(
            "geocode",
            x.name,
            e
          );
        }
      }

    } finally {

      geocodeBusy =
        false;
    }

    return changed;
  }

  function improveLocation(q) {

    q =
      String(
        q ||
        ""
      ).trim();

    if (
      /טרמינל\s*3|בן[\s־-]*גוריון|ben\s*gurion|נתב["״']?ג/i.test(
        q
      )
    ) {
      return "Ben Gurion Airport Terminal 3, Israel";
    }

    if (
      /dolby\s*theatre/i.test(
        q
      )
    ) {
      return "Dolby Theatre, 6801 Hollywood Blvd, Los Angeles, CA 90028, USA";
    }

    if (
      /tcl\s*chinese|chinese\s*theatre/i.test(
        q
      )
    ) {
      return "TCL Chinese Theatre, 6925 Hollywood Blvd, Los Angeles, CA 90028, USA";
    }

    if (
      /hollywood\s*walk\s*of\s*fame|6814\s+hollywood/i.test(
        q
      )
    ) {
      return "Hollywood Walk of Fame, Hollywood Boulevard, Los Angeles, CA, USA";
    }

    return q;
  }

  function renderMap(
    stops,
    a
  ) {

    const msg =
      $("#hjMapMessage");

    if (!window.L) {

      msg.className =
        "show";

      msg.innerHTML = `
        <div>
          <b>
            המפה לא נטענה
          </b>

          <span>
            רעננו את הדף ונסו שוב.
          </span>
        </div>
      `;

      return;
    }

    if (!map) {

      map =
        L.map(
          "hjMap",
          {
            scrollWheelZoom:
              false,

            zoomControl:
              true
          }
        );

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom:
            19,

          attribution:
            "&copy; OpenStreetMap"
        }
      )
      .addTo(map);

      map.setView(
        [
          39.5,
          -98.35
        ],
        3
      );
    }

    if (markers) {
      map.removeLayer(
        markers
      );
    }

    if (route) {
      map.removeLayer(
        route
      );
    }

    markers =
      L.layerGroup()
        .addTo(map);

    if (!stops.length) {

      map.setView(
        [
          39.5,
          -98.35
        ],
        3
      );

      msg.className =
        "show";

      msg.innerHTML = `
        <div>
          <b>
            ${
              a.some(
                e =>
                  e.location_name
              )
                ? "מאתר את המקומות…"
                : "המפה מחכה למיקום הראשון"
            }
          </b>

          <span>
            שמות המקומות מהאייפון
            יהפכו אוטומטית לנעצים.
          </span>
        </div>
      `;

      setTimeout(
        () =>
          map.invalidateSize(),
        60
      );

      return;
    }

    msg.className =
      "";

    const points =
      stops.map(
        s => [
          s.lat,
          s.lng
        ]
      );

    stops.forEach(
      (
        s,
        i
      ) => {

        const marker =
          L.circleMarker(
            [
              s.lat,
              s.lng
            ],
            {
              radius:
                9,

              color:
                "#ffe3f1",

              weight:
                2,

              fillColor:
                "#ff5cae",

              fillOpacity:
                1
            }
          )
          .addTo(
            markers
          );

        marker.bindPopup(
          mapPopup(
            s,
            i
          ),
          {
            maxWidth:
              320
          }
        );

        marker.on(
          "popupopen",
          () => {

            document
              .querySelectorAll(
                ".hj-map-photo"
              )
              .forEach(
                b =>
                  b.onclick =
                    () => {

                      activePhotoIndex =
                        Number(
                          b.dataset.photo
                        );

                      openViewer();
                    }
              );
          }
        );
      }
    );

    if (
      points.length >
      1
    ) {

      route =
        L.polyline(
          points,
          {
            color:
              "#b56cff",

            weight:
              4,

            opacity:
              .9,

            dashArray:
              "7 9"
          }
        )
        .addTo(map);

      map.fitBounds(
        points,
        {
          padding: [
            40,
            40
          ]
        }
      );

    } else {

      map.setView(
        points[0],
        14
      );
    }

    setTimeout(
      () =>
        map.invalidateSize(),
      60
    );
  }

  function mapPopup(
    s,
    i
  ) {

    return `
      <div
        class="hj-popup"
        dir="rtl"
      >

        <small>
          עצירה ${i+1}
          ·
          ${esc(
            formatTime(
              s.time
            )
          )}
        </small>

        <b>
          ${esc(s.name)}
        </b>

        <div>

          ${s.items
            .slice(
              0,
              3
            )
            .map(
              it => `
                <button
                  class="hj-map-photo"
                  data-photo="${it.index}"
                >

                  <img
                    src="${attr(
                      imageUrl(
                        it.entry
                          .image_path
                      )
                    )}"
                    alt=""
                  >

                </button>
              `
            )
            .join("")}

        </div>

        <span>
          לחצו על תמונה לפתיחה ותגובה
        </span>

      </div>
    `;
  }
    function openViewer() {

    const a =
      groups.get(
        selectedDay
      ) || [];

    if (!a.length) {
      return;
    }

    activePhotoIndex =
      Math.max(
        0,
        Math.min(
          activePhotoIndex,
          a.length - 1
        )
      );

    $("#hjViewer")
      .classList
      .toggle(
        "birthday-viewer",
        selectedDay === BIRTHDAY_DAY
      );

    $("#hjViewer")
      .classList
      .add("open");

    document.body.style.overflow =
      "hidden";

    renderViewer();
  }

  function closeViewer() {

    $("#hjViewer")
      .classList
      .remove("open");

    document.body.style.overflow =
      "";
  }

  function stepPhoto(delta) {

    const a =
      groups.get(
        selectedDay
      ) || [];

    const n =
      activePhotoIndex +
      delta;

    if (
      n < 0 ||
      n >= a.length
    ) {
      return;
    }

    activePhotoIndex =
      n;

    renderViewer();
  }

  function renderViewer() {

    const a =
      groups.get(
        selectedDay
      ) || [];

    const e =
      a[
        activePhotoIndex
      ];

    if (!e) {
      return;
    }

    const u =
      imageUrl(
        e.image_path
      );

    const c =
      cleanCaption(
        e.caption
      );

    $("#hjViewImg").src =
      u;

    $("#hjViewBlur")
      .style
      .backgroundImage =
        `url("${u}")`;

    $("#hjViewCaption").textContent =
      c
        ? `״${c}״`
        : "";

    $("#hjViewMeta").textContent =
      [
        formatDateTime(
          e.taken_at ||
          e.created_at
        ),
        e.location_name
      ]
      .filter(Boolean)
      .join(" · ");

    $("#hjFilm").innerHTML =
      a.map(
        (
          x,
          i
        ) => `
          <button
            class="
              hj-thumb
              ${
                i === activePhotoIndex
                  ? "active"
                  : ""
              }
            "
            data-thumb="${i}"
          >

            <img
              src="${attr(
                imageUrl(
                  x.image_path
                )
              )}"
              alt=""
            >

          </button>
        `
      )
      .join("");

    document
      .querySelectorAll(
        ".hj-thumb"
      )
      .forEach(
        b =>
          b.onclick =
            () => {

              activePhotoIndex =
                Number(
                  b.dataset.thumb
                );

              renderViewer();
            }
      );

    updateIdentity();
    renderComments(e);
  }

  function renderComments(e) {

    const rows =
      commentsByEntry.get(
        String(e.id)
      ) || [];

    $("#hjCommentCount")
      .textContent =
        `(${rows.length})`;

    $("#hjCommentNote")
      .textContent =
        commentsAvailable
          ? ""
          : "כדי לשמור תגובות אצל כולם צריך להפעיל את journal_comments ב-Supabase.";

    $("#hjCommentList")
      .innerHTML =
        rows.length
          ? rows
              .map(
                c => `
                  <div class="hj-bubble">

                    <div>
                      <b>
                        ${esc(
                          c.nickname
                        )}
                      </b>

                      <small>
                        ${esc(
                          formatDateTime(
                            c.created_at
                          )
                        )}
                      </small>
                    </div>

                    <p>
                      ${esc(
                        c.comment
                      )}
                    </p>

                  </div>
                `
              )
              .join("")
          : `
              <div class="hj-empty">
                עוד אין תגובות לתמונה הזאת ✦
              </div>
            `;
  }

  async function submitComment() {

    const a =
      groups.get(
        selectedDay
      ) || [];

    const e =
      a[
        activePhotoIndex
      ];

    const input =
      $("#hjCommentInput");

    const text =
      input.value.trim();

    if (
      !e ||
      !text
    ) {
      return;
    }

    if (!getName()) {
      openNameModal();
      return;
    }

    if (!commentsAvailable) {

      $("#hjCommentNote")
        .textContent =
          "טבלת journal_comments עדיין לא פעילה ב-Supabase.";

      return;
    }

    const r =
      await fetch(
        `${SB}/rest/v1/${COMMENTS}`,
        {
          method:
            "POST",

          headers: {
            apikey:
              KEY,

            Authorization:
              `Bearer ${KEY}`,

            "Content-Type":
              "application/json",

            Prefer:
              "return=representation"
          },

          body:
            JSON.stringify({
              journal_entry_id:
                e.id,

              nickname:
                getName(),

              comment:
                text
            })
        }
      );

    if (!r.ok) {

      $("#hjCommentNote")
        .textContent =
          "התגובה לא נשלחה. נסו שוב.";

      return;
    }

    const inserted =
      await r.json();

    const current =
      commentsByEntry.get(
        String(e.id)
      ) || [];

    commentsByEntry.set(
      String(e.id),
      current.concat(
        inserted
      )
    );

    input.value =
      "";

    renderComments(e);
    renderPhotos(a);
  }

  function getName() {

    try {

      return (
        localStorage.getItem(
          NAME_KEY
        ) ||
        ""
      );

    } catch {

      return "";
    }
  }

  function updateIdentity() {

    const n =
      getName();

    $("#hjIdentity")
      .textContent =
        n
          ? `מגיב/ה בתור ${n}`
          : "עדיין לא בחרת כינוי";

    $("#hjChangeName")
      .textContent =
        n
          ? "שינוי שם"
          : "בחר כינוי";
  }

  function openNameModal() {

    $("#hjNameInput").value =
      getName();

    $("#hjNameModal")
      .classList
      .add("open");

    setTimeout(
      () =>
        $("#hjNameInput")
          .focus(),
      30
    );
  }

  function saveName() {

    const n =
      $("#hjNameInput")
        .value
        .trim()
        .slice(
          0,
          40
        );

    if (!n) {
      return;
    }

    localStorage.setItem(
      NAME_KEY,
      n
    );

    $("#hjNameModal")
      .classList
      .remove("open");

    updateIdentity();

    setTimeout(
      () =>
        $("#hjCommentInput")
          .focus(),
      30
    );
  }

  function imageUrl(path) {

    return (
      `${SB}/storage/v1/object/public/` +
      `${BUCKET}/` +
      String(
        path ||
        ""
      )
      .split("/")
      .map(
        encodeURIComponent
      )
      .join("/")
    );
  }

  function cleanCaption(v) {

    return String(
      v ||
      ""
    )
      .trim()
      .replace(
        /^["״“”']+|["״“”']+$/g,
        ""
      )
      .trim();
  }

  function formatTime(v) {

    const d =
      new Date(
        v ||
        0
      );

    return Number.isNaN(
      d.getTime()
    )
      ? ""
      : new Intl
          .DateTimeFormat(
            "he-IL",
            {
              hour:
                "2-digit",

              minute:
                "2-digit"
            }
          )
          .format(d);
  }

  function formatDateTime(v) {

    const d =
      new Date(
        v ||
        0
      );

    return Number.isNaN(
      d.getTime()
    )
      ? ""
      : new Intl
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
                "2-digit"
            }
          )
          .format(d);
  }

  function normalize(v) {

    return String(
      v ||
      ""
    )
      .trim()
      .toLowerCase()
      .replace(
        /\s+/g,
        " "
      );
  }

  function sleep(ms) {

    return new Promise(
      resolve =>
        setTimeout(
          resolve,
          ms
        )
    );
  }

  function loadGeoCache() {

    try {

      return JSON.parse(
        localStorage.getItem(
          GEO_KEY
        ) ||
        "{}"
      );

    } catch {

      return {};
    }
  }

  function saveGeoCache() {

    try {

      localStorage.setItem(
        GEO_KEY,
        JSON.stringify(
          geocodeCache
        )
      );

    } catch {}
  }

  async function ensureLeaflet() {

    if (window.L) {
      return;
    }

    if (
      !document.querySelector(
        "link[data-hj-leaflet]"
      )
    ) {

      const link =
        document.createElement(
          "link"
        );

      link.rel =
        "stylesheet";

      link.href =
        "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

      link.dataset.hjLeaflet =
        "1";

      document.head.appendChild(
        link
      );
    }

    await new Promise(
      resolve => {

        const script =
          document.createElement(
            "script"
          );

        script.src =
          "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

        script.onload =
          resolve;

        script.onerror =
          resolve;

        document.head.appendChild(
          script
        );
      }
    );
  }

  function injectStyles() {

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "hj-v25-styles";

    style.textContent = `
          .journal-section{
        overflow-anchor:none!important;
        background:
          radial-gradient(
            circle at 18% 0,
            rgba(137,62,255,.15),
            transparent 28%
          ),
          linear-gradient(
            180deg,
            #07050b,
            #0b0710 55%,
            #060409
          )!important;
        color:#f8f3fb!important;
        padding:78px 0!important;
      }

      .hj-wrap{
        width:min(
          1420px,
          calc(100% - 32px)
        );
        margin:auto;
        font-family:
          Heebo,
          Arial,
          sans-serif;
      }

      .hj-hero{
        display:grid;
        grid-template-columns:
          1fr auto;
        gap:28px;
        align-items:end;
        margin-bottom:28px;
      }

      .hj-kicker,
      .hj-hero aside small{
        font:
          500 9px
          Montserrat,
          sans-serif;
        letter-spacing:.2em;
        color:#b894d5;
      }

      .hj-title{
        margin:7px 0 0;

        font:
          500
          clamp(
            54px,
            7vw,
            104px
          )/.78
          "Cormorant Garamond",
          serif!important;

        letter-spacing:
          -.045em;
      }

      .hj-title em{
        color:#c799ff;
      }

      .hj-hero p{
        max-width:760px;
        color:#b1a6b8;
        line-height:1.7;
      }

      .hj-hero aside{
        min-width:270px;
        padding:17px;

        border:
          1px solid
          rgba(
            221,
            185,
            121,
            .25
          );

        border-radius:18px;
        background:#110d17;
      }

      .hj-hero aside b,
      .hj-hero aside span{
        display:block;
        margin-top:6px;
      }

      .hj-hero aside span{
        font-size:10px;
        color:#aa9db0;
      }

      .hj-days,
      .hj-panel,
      .hj-memories,
      .hj-day-head{
        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .09
          );

        border-radius:22px;

        background:
          rgba(
            12,
            8,
            17,
            .86
          );

        box-shadow:
          0 25px 80px
          rgba(
            0,
            0,
            0,
            .35
          );
      }

      .hj-days{
        padding:20px 22px;
        overflow:hidden;
      }

      .hj-days>header,
      .hj-panel>header,
      .hj-memories>header{
        display:flex;
        justify-content:
          space-between;
        align-items:center;
        gap:14px;
      }

      .hj-days>header b,
      .hj-panel>header small{
        font:
          500 9px
          Montserrat,
          sans-serif;

        letter-spacing:.15em;
        color:#bda6cf;
      }

      .hj-days>header span{
        font-size:11px;
        color:#817687;
      }

      #hjDays{
        display:flex;
        gap:12px;
        overflow:auto;
        scrollbar-width:none;
        padding:16px 2px 8px;
        direction:ltr;
      }

      #hjDays::-webkit-scrollbar,
      #hjPhotoScroll::-webkit-scrollbar,
      #hjFilm::-webkit-scrollbar,
      #hjStops::-webkit-scrollbar{
        display:none;
      }

      .hj-chip{
        flex:0 0 168px;
        height:190px;

        position:relative;

        border:0;
        padding:0;
        overflow:hidden;

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

        background:#15101b;
        color:#fff;
      }

      .hj-chip img,
      .hj-card img{
        position:absolute;
        inset:0;

        width:100%;
        height:100%;

        object-fit:cover;
      }

      .hj-chip:after{
        content:"";
        position:absolute;
        inset:0;
        z-index:1;

        background:
          linear-gradient(
            to top,
            rgba(
              5,
              3,
              8,
              .95
            ),
            transparent 65%
          );
      }

      .hj-chip.active{
        filter:
          drop-shadow(
            0 0 15px
            rgba(
              164,
              85,
              255,
              .5
            )
          );
      }

      .hj-chip>i{
        position:absolute;
        inset:0;

        display:grid;
        place-items:center;

        font-size:28px;
        color:#8d5db7;
      }

      .hj-chip>strong{
        position:absolute;
        z-index:4;

        top:16px;
        left:0;
        right:0;

        text-align:center;

        font:
          300 26px
          "Cormorant Garamond",
          serif;
      }

      .hj-chip>span:not(
        .hj-bday-ribbon
      ):not(
        .hj-chip-balloon
      ){
        position:absolute;
        z-index:4;

        left:10px;
        right:10px;
        bottom:19px;

        text-align:center;
        direction:ltr;
      }

      .hj-chip>span b{
        display:block;

        font:
          500 10px
          Montserrat,
          sans-serif;
      }

      .hj-chip>span small{
        display:block;
        margin-top:4px;

        font:
          500 7px
          Montserrat,
          sans-serif;

        color:#b1a4b7;
      }

      .hj-chip>span em{
        display:block;
        margin-top:7px;

        font:
          500 8px
          Montserrat,
          sans-serif;

        color:#e0bd78;
        font-style:normal;
      }

      /* ============================
         DAY 05 · BIRTHDAY CHIP
         ============================ */

      .hj-chip.birthday{
        isolation:isolate;

        background:
          radial-gradient(
            circle at 50% 8%,
            rgba(
              255,
              220,
              156,
              .20
            ),
            transparent 30%
          ),
          linear-gradient(
            145deg,
            #271132,
            #120918
          );

        filter:
          drop-shadow(
            0 0 18px
            rgba(
              181,
              91,
              255,
              .28
            )
          );
      }

      .hj-chip.birthday.active{
        filter:
          drop-shadow(
            0 0 22px
            rgba(
              206,
              131,
              255,
              .55
            )
          )
          drop-shadow(
            0 0 8px
            rgba(
              255,
              203,
              126,
              .18
            )
          );
      }

      .hj-chip.birthday:before{
        content:"";

        position:absolute;
        z-index:3;

        inset:7px;

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

        border:
          1px solid
          rgba(
            255,
            218,
            153,
            .25
          );

        pointer-events:none;
      }

      .hj-bday-ribbon{
        position:absolute!important;
        z-index:7!important;

        top:48px!important;
        bottom:auto!important;

        left:50%!important;
        right:auto!important;

        width:auto!important;
        max-width:148px;

        transform:
          translateX(-50%);

        padding:5px 8px;

        border:
          1px solid
          rgba(
            255,
            221,
            168,
            .29
          );

        border-radius:999px;

        background:
          rgba(
            80,
            35,
            104,
            .78
          );

        color:#ffe0a2!important;

        text-align:center!important;
        white-space:nowrap;

        font:
          600 6.5px/1
          Montserrat,
          sans-serif!important;

        letter-spacing:.09em;

        backdrop-filter:
          blur(8px);
      }

      .hj-chip-balloon{
        position:absolute!important;
        z-index:3!important;

        width:20px!important;
        height:26px!important;

        left:auto!important;
        right:auto!important;
        bottom:auto!important;

        border-radius:
          55% 55% 50% 50%;

        animation:
          hjBalloonFloat
          4.7s
          ease-in-out
          infinite;

        box-shadow:
          inset
          -4px -6px 9px
          rgba(
            0,
            0,
            0,
            .18
          );
      }

      .hj-chip-balloon:after{
        content:"";

        position:absolute;

        top:24px;
        left:50%;

        width:1px;
        height:35px;

        background:
          linear-gradient(
            rgba(
              236,
              215,
              247,
              .52
            ),
            transparent
          );
      }

      .hj-chip-balloon.b1{
        left:18px!important;
        top:79px!important;

        background:
          linear-gradient(
            145deg,
            #d2a6ff,
            #7a3fd0
          );

        animation-delay:-.5s;
      }

      .hj-chip-balloon.b2{
        right:17px!important;
        top:87px!important;

        background:
          linear-gradient(
            145deg,
            #ff9dce,
            #cf4e99
          );

        animation-delay:-1.9s;
      }

      .hj-chip-balloon.b3{
        right:42px!important;
        top:67px!important;

        width:16px!important;
        height:21px!important;

        background:
          linear-gradient(
            145deg,
            #ffe3a4,
            #cc9848
          );

        animation-delay:-1.1s;
      }

      @keyframes hjBalloonFloat{
        0%,
        100%{
          transform:
            translateY(0)
            rotate(-2deg);
        }

        50%{
          transform:
            translateY(-7px)
            rotate(2deg);
        }
      }

      .hj-world{
        display:grid;
        gap:13px;

        margin-top:18px;

        scroll-margin-top:
          110px;

        position:relative;
      }

      /* ============================
         BIRTHDAY WORLD
         ============================ */

      .hj-birthday-banner{
        display:none;

        position:relative;
        overflow:hidden;

        min-height:180px;

        align-items:center;
        justify-content:
          space-between;

        gap:26px;

        padding:
          30px 34px;

        border:
          1px solid
          rgba(
            232,
            197,
            255,
            .16
          );

        border-radius:24px;

        background:
          radial-gradient(
            circle at 82% 10%,
            rgba(
              255,
              91,
              184,
              .10
            ),
            transparent 24%
          ),
          radial-gradient(
            circle at 15% 5%,
            rgba(
              166,
              83,
              255,
              .15
            ),
            transparent 25%
          ),
          linear-gradient(
            145deg,
            #130a1a,
            #09050e 72%
          );

        box-shadow:
          0 28px 90px
          rgba(
            0,
            0,
            0,
            .36
          );
      }

      .birthday-day
      .hj-birthday-banner{
        display:flex;
      }

      .hj-birthday-banner:before{
        content:"60";

        position:absolute;

        left:25px;
        top:-82px;

        font:
          500 italic
          270px/.8
          "Cormorant Garamond",
          serif;

        color:transparent;

        -webkit-text-stroke:
          1px
          rgba(
            237,
            211,
            255,
            .055
          );

        pointer-events:none;
      }

      .hj-bday-copy{
        position:relative;
        z-index:3;

        max-width:850px;
      }

      .hj-bday-copy>small{
        display:block;

        color:#d4b4ea;

        font:
          600 8px
          Montserrat,
          sans-serif;

        letter-spacing:.18em;
      }

      .hj-bday-copy>b{
        display:block;

        margin-top:6px;

        font:
          500
          clamp(
            39px,
            5.3vw,
            70px
          )/.9
          "Cormorant Garamond",
          serif;

        letter-spacing:
          -.035em;
      }

      .hj-bday-copy>b em{
        color:#ffd18b;
        font-style:italic;
      }

      .hj-bday-copy>p{
        max-width:780px;

        margin:
          10px 0 0;

        color:#b7a8bc;
        font-size:12px;
        line-height:1.7;
      }

      .hj-bday-60{
        position:relative;
        z-index:4;

        flex:0 0 112px;

        width:112px;
        height:112px;

        display:grid;
        place-items:center;

        text-align:center;

        border-radius:50%;

        border:
          1px solid
          rgba(
            255,
            229,
            190,
            .32
          );

        background:
          radial-gradient(
            circle at 30% 22%,
            #fff0ce,
            #d49c4f 34%,
            #8044b2 67%,
            #190d21 100%
          );

        box-shadow:
          0 0 0 8px
          rgba(
            179,
            91,
            255,
            .045
          ),
          0 18px 60px
          rgba(
            92,
            29,
            124,
            .35
          );
      }

      .hj-bday-60 span{
        display:block;

        font:
          600 40px/.8
          "Cormorant Garamond",
          serif;
      }

      .hj-bday-60 small{
        display:block;

        margin-top:6px;

        color:#fff0d2;

        font:
          600 6px
          Montserrat,
          sans-serif;

        letter-spacing:.14em;
      }

      .hj-bday-balloons{
        position:absolute;
        inset:0;

        pointer-events:none;
      }

      .hj-bday-balloons i{
        position:absolute;

        width:36px;
        height:46px;

        border-radius:
          55% 55% 50% 50%;

        opacity:.78;

        animation:
          hjBalloonFloat
          5.3s
          ease-in-out
          infinite;

        box-shadow:
          inset
          -7px -9px 14px
          rgba(
            0,
            0,
            0,
            .18
          );
      }

      .hj-bday-balloons i:after{
        content:"";

        position:absolute;

        left:50%;
        top:44px;

        width:1px;
        height:70px;

        background:
          linear-gradient(
            rgba(
              255,
              255,
              255,
              .42
            ),
            transparent
          );
      }

      .hj-bday-balloons .b1{
        right:4%;
        top:15px;

        background:
          linear-gradient(
            145deg,
            #d6a8ff,
            #7c42c6
          );
      }

      .hj-bday-balloons .b2{
        right:8%;
        top:75px;

        background:
          linear-gradient(
            145deg,
            #ff94c9,
            #cd4d96
          );

        animation-delay:-2s;
      }

      .hj-bday-balloons .b3{
        left:8%;
        top:27px;

        background:
          linear-gradient(
            145deg,
            #ffe1a1,
            #cb9648
          );

        animation-delay:-1.1s;
      }

      .birthday-day
      .hj-day-head,
      .birthday-day
      .hj-panel,
      .birthday-day
      .hj-memories{
        border-color:
          rgba(
            226,
            188,
            255,
            .15
          );
      }

      .birthday-day
      .hj-day-head{
        background:
          radial-gradient(
            circle at 90% 0,
            rgba(
              255,
              197,
              117,
              .08
            ),
            transparent 28%
          ),
          linear-gradient(
            135deg,
            rgba(
              30,
              14,
              38,
              .94
            ),
            rgba(
              11,
              7,
              15,
              .94
            )
          );
      }

      .birthday-day
      .hj-day-head>strong{
        background:
          radial-gradient(
            circle at 30% 20%,
            #fff0cb,
            #d49a4b 32%,
            #884bd0 62%,
            #25122e
          );

        border:
          1px solid
          rgba(
            255,
            225,
            177,
            .3
          );

        box-shadow:
          0 8px 30px
          rgba(
            156,
            73,
            218,
            .22
          );
      }

      .birthday-day
      .hj-day-head small{
        color:#e2bd7d;
      }

      .hj-day-head{
        display:grid;

        grid-template-columns:
          auto 1fr;

        gap:17px;
        align-items:center;

        padding:20px 22px;
      }

      .hj-day-head>strong{
        width:70px;
        height:70px;

        border-radius:50%;

        display:grid;
        place-items:center;

        background:
          radial-gradient(
            circle at 30% 20%,
            #d8bbff,
            #8a4adf 45%,
            #24112f
          );

        font:
          300 24px
          Montserrat,
          sans-serif;
      }

      .hj-day-head small{
        font:
          500 8px
          Montserrat,
          sans-serif;

        letter-spacing:.16em;
        color:#ae8ec5;
      }

      .hj-day-head h3{
        margin:4px 0 0;

        font:
          500
          clamp(
            29px,
            4vw,
            43px
          )/1
          "Cormorant Garamond",
          serif;
      }

      .hj-day-head p{
        margin:6px 0 0;

        color:#9e92a4;
        font-size:11px;
      }

      .hj-grid{
        display:grid;

        grid-template-columns:
          1.03fr .97fr;

        gap:13px;
      }

      .hj-panel{
        overflow:hidden;
      }

      .hj-panel>header{
        padding:16px 18px;

        border-bottom:
          1px solid
          rgba(
            255,
            255,
            255,
            .08
          );
      }

      .hj-plan{
        padding:15px 18px;
      }

      #hjPlanSummary{
        padding:13px;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .07
          );

        border-radius:14px;

        background:
          rgba(
            255,
            255,
            255,
            .025
          );
      }

      #hjPlanSummary small,
      #hjPlanSummary b,
      #hjPlanSummary p{
        display:block;
      }

      #hjPlanSummary small{
        font:
          500 8px
          Montserrat,
          sans-serif;

        color:#9c8ba7;
        letter-spacing:.12em;
      }

      #hjPlanSummary b{
        margin-top:4px;
      }

      #hjPlanSummary p{
        margin:4px 0 0;
        color:#918596;
        font-size:10px;
      }

      .hj-plan-item{
        display:grid;

        grid-template-columns:
          28px 1fr;

        align-items:center;

        gap:9px;
        margin-top:7px;
      }

      .hj-plan-item span{
        width:27px;
        height:27px;

        border-radius:50%;

        display:grid;
        place-items:center;

        border:
          1px solid
          rgba(
            173,
            111,
            255,
            .3
          );

        color:#c99cff;
        font-size:9px;
      }

      .birthday-day
      .hj-plan-item span{
        border-color:
          rgba(
            255,
            205,
            126,
            .3
          );

        color:#ffd18a;
      }

      .hj-plan-item b{
        font-size:11px;
      }

      .hj-plan hr{
        border:0;

        border-top:
          1px solid
          rgba(
            255,
            255,
            255,
            .08
          );

        margin:14px 0;
      }

      .hj-was-title{
        display:flex;
        gap:8px;
        align-items:center;
        flex-wrap:wrap;
      }

      .hj-was-title b{
        font:
          600 9px
          Montserrat,
          sans-serif;

        letter-spacing:.12em;
        color:#e1cfea;
      }

      .birthday-day
      .hj-was-title b{
        color:#ffe0a4;
      }

      .hj-was-title span{
        font-size:9px;
        color:#786d80;
      }

      #hjStops{
        display:flex;
        gap:7px;

        overflow:auto;
        scrollbar-width:none;

        margin-top:9px;
      }

      .hj-stop{
        flex:0 0 auto;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .08
          );

        border-radius:11px;

        background:
          rgba(
            255,
            255,
            255,
            .025
          );

        color:#fff;

        padding:8px 10px;

        text-align:right;
      }

      .hj-stop small,
      .hj-stop b,
      .hj-stop span{
        display:block;
      }

      .hj-stop small{
        font-size:8px;
        color:#897e90;
      }

      .hj-stop b{
        font-size:10px;
        margin-top:2px;
      }

      .hj-stop span{
        font-size:8px;
        color:#cdb2d7;
      }

      .hj-empty{
        padding:12px;

        border:
          1px dashed
          rgba(
            255,
            255,
            255,
            .1
          );

        border-radius:12px;

        color:#887c8e;
        font-size:10px;
      }

      .hj-map-wrap,
      #hjMap{
        height:100%;
        min-height:470px;

        position:relative;

        background:#0a080e;
      }

      .hj-map-wrap
      .leaflet-tile-pane{
        filter:
          invert(100%)
          hue-rotate(180deg)
          brightness(.56)
          saturate(.65);
      }

      #hjMapMessage{
        position:absolute;
        z-index:500;
        inset:0;

        display:none;
        place-items:center;

        padding:20px;

        pointer-events:none;
      }

      #hjMapMessage.show{
        display:grid;
      }

      #hjMapMessage>div{
        max-width:300px;

        text-align:center;

        background:
          rgba(
            8,
            5,
            12,
            .84
          );

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .08
          );

        border-radius:15px;

        padding:16px;
      }

      #hjMapMessage b,
      #hjMapMessage span{
        display:block;
      }

      #hjMapMessage span{
        font-size:10px;
        color:#8c8192;
        margin-top:4px;
      }

      .hj-popup{
        width:245px;
      }

      .hj-popup>small,
      .hj-popup>b,
      .hj-popup>span{
        display:block;
      }

      .hj-popup small{
        font-size:8px;
        color:#9c8fa5;
      }

      .hj-popup b{
        margin:3px 0 7px;
      }

      .hj-popup>span{
        font-size:8px;
        color:#887c90;
        margin-top:5px;
      }

      .hj-popup>div{
        display:grid;

        grid-template-columns:
          repeat(
            3,
            1fr
          );

        gap:5px;
      }

      .hj-map-photo{
        border:0;
        padding:0;

        height:72px;

        border-radius:7px;
        overflow:hidden;
      }

      .hj-map-photo img{
        width:100%;
        height:100%;
        object-fit:cover;
      }

      .hj-memories{
        overflow:hidden;
        position:relative;
      }

      .birthday-day
      .hj-memories{
        background:
          radial-gradient(
            circle at 82% 0,
            rgba(
              255,
              199,
              118,
              .06
            ),
            transparent 21%
          ),
          radial-gradient(
            circle at 7% 15%,
            rgba(
              176,
              86,
              255,
              .08
            ),
            transparent 23%
          ),
          rgba(
            12,
            8,
            17,
            .9
          );

        box-shadow:
          0 28px 90px
          rgba(
            0,
            0,
            0,
            .4
          ),
          inset
          0 1px 0
          rgba(
            255,
            211,
            145,
            .06
          );
      }

      .birthday-day
      .hj-memories:before{
        content:"HAGIT · 60";

        position:absolute;
        z-index:0;

        right:22px;
        top:4px;

        color:
          rgba(
            255,
            220,
            165,
            .035
          );

        font:
          500 italic
          120px/1
          "Cormorant Garamond",
          serif;

        pointer-events:none;
      }

      .hj-memories>header{
        position:relative;
        z-index:2;

        padding:20px 22px;

        border-bottom:
          1px solid
          rgba(
            255,
            255,
            255,
            .08
          );
      }

      .hj-memories>header small{
        font:
          500 8px
          Montserrat,
          sans-serif;

        letter-spacing:.15em;
        color:#aa89c1;
      }

      .birthday-day
      .hj-memories>header small{
        color:#e1ba78;
      }

      .hj-memories>header b{
        display:block;
        margin-top:4px;

        font:
          500
          clamp(
            27px,
            3.5vw,
            43px
          )/1
          "Cormorant Garamond",
          serif;
      }

      .hj-memories>header>span{
        font-size:10px;
        color:#8e8296;
      }

      #hjPhotoScroll{
        position:relative;
        z-index:2;

        display:flex;
        gap:11px;

        overflow:auto;

        scroll-snap-type:
          x proximity;

        scrollbar-width:none;

        padding:11px;

        direction:ltr;
      }

      .hj-board{
        flex:
          0 0
          min(
            1050px,
            88vw
          );

        height:620px;

        display:grid;

        grid-template-columns:
          1.55fr .72fr .72fr;

        grid-template-rows:
          1fr 1fr;

        gap:9px;

        scroll-snap-align:start;
      }

      .hj-board.c1{
        grid-template-columns:1fr;
      }

      .hj-board.c1 .p1{
        grid-column:1;
        grid-row:1/3;
      }

      .hj-board.c2 .p2{
        grid-column:2/4;
        grid-row:1/3;
      }

      .hj-board.c3 .p2{
        grid-column:2/4;
      }

      .hj-board.c3 .p3{
        grid-column:2/4;
      }

      .hj-card{
        position:relative;

        border:0;
        padding:0;

        border-radius:15px;

        overflow:hidden;

        background:#120e17;

        color:#fff;
      }

      .birthday-day
      .hj-card{
        border:
          1px solid
          rgba(
            255,
            217,
            153,
            .10
          );

        box-shadow:
          inset
          0 0 0 1px
          rgba(
            194,
            118,
            255,
            .04
          );
      }

      .hj-card.p1{
        grid-row:1/3;
      }

      .hj-board.c4 .p4{
        grid-column:2/4;
      }

      .hj-photo-gradient{
        position:absolute;
        inset:0;
        z-index:1;

        background:
          linear-gradient(
            to top,
            rgba(
              3,
              2,
              6,
              .94
            ),
            rgba(
              3,
              2,
              6,
              .14
            ) 45%,
            transparent 70%
          );
      }

      .birthday-day
      .hj-photo-gradient{
        background:
          linear-gradient(
            to top,
            rgba(
              6,
              2,
              8,
              .95
            ),
            rgba(
              54,
              20,
              50,
              .08
            ) 47%,
            transparent 70%
          );
      }

      .hj-card-copy{
        position:absolute;
        z-index:3;

        right:14px;
        left:14px;
        bottom:13px;

        text-align:right;
        direction:rtl;
      }

      .hj-card-copy strong{
        display:block;

        font-size:
          clamp(
            13px,
            1.45vw,
            21px
          );

        line-height:1.35;

        text-shadow:
          0 2px 12px #000;
      }

      .hj-card.p1
      .hj-card-copy strong{
        font-size:
          clamp(
            20px,
            2.1vw,
            31px
          );

        font-weight:400;
      }

      .hj-card-copy small{
        display:block;

        margin-top:6px;

        color:#d1c4d6;
        font-size:8px;

        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }

      .hj-cc{
        position:absolute;
        z-index:5;

        left:10px;
        bottom:10px;

        padding:5px 7px;

        border-radius:999px;

        background:
          rgba(
            5,
            3,
            8,
            .7
          );

        font-size:8px;
      }

      /* Birthday badges on photos */

      .hj-photo-birthday{
        position:absolute;
        z-index:6;

        top:11px;
        right:11px;

        display:inline-flex;
        align-items:center;
        gap:5px;

        padding:6px 9px;

        border-radius:999px;

        border:
          1px solid
          rgba(
            255,
            218,
            156,
            .27
          );

        background:
          rgba(
            24,
            10,
            31,
            .76
          );

        color:#ffe0a1;

        font:
          600 7px
          Montserrat,
          sans-serif;

        letter-spacing:.08em;

        backdrop-filter:
          blur(10px);

        box-shadow:
          0 6px 24px
          rgba(
            0,
            0,
            0,
            .16
          );
      }

      .hj-mini-balloons{
        position:absolute;
        z-index:6;

        left:12px;
        top:11px;

        display:flex;
        align-items:flex-end;
        gap:3px;

        pointer-events:none;
      }

      .hj-mini-balloons i{
        display:block;

        width:10px;
        height:14px;

        border-radius:
          55% 55% 50% 50%;

        box-shadow:
          inset
          -2px -3px 5px
          rgba(
            0,
            0,
            0,
            .17
          );
      }

      .hj-mini-balloons i:nth-child(1){
        background:#a75cff;
      }

      .hj-mini-balloons i:nth-child(2){
        height:17px;
        background:#ff68b6;
      }

      .hj-mini-balloons i:nth-child(3){
        height:12px;
        background:#ffd47e;
      }
            .hj-viewer{
        position:fixed;
        inset:0;
        z-index:99999;

        display:none;

        background:
          rgba(
            2,
            1,
            4,
            .92
          );

        backdrop-filter:
          blur(16px);

        padding:18px;
      }

      .hj-viewer.open{
        display:grid;
        place-items:center;
      }

      .hj-view-shell{
        width:min(
          1300px,
          100%
        );

        height:min(
          890px,
          calc(100vh - 36px)
        );

        display:grid;

        grid-template-columns:
          1fr 340px;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .1
          );

        border-radius:20px;
        overflow:hidden;

        background:#09070d;
      }

      .birthday-viewer
      .hj-view-shell{
        border-color:
          rgba(
            255,
            215,
            147,
            .18
          );

        box-shadow:
          0 0 0 1px
          rgba(
            174,
            91,
            255,
            .07
          ),
          0 30px 110px
          rgba(
            85,
            27,
            115,
            .22
          );
      }

      .birthday-viewer
      .hj-view-photo:after{
        content:"🎂  HAGIT 60 · BIRTHDAY MEMORY";

        position:absolute;
        z-index:7;

        top:17px;
        right:17px;

        padding:7px 11px;

        border:
          1px solid
          rgba(
            255,
            218,
            155,
            .25
          );

        border-radius:999px;

        background:
          rgba(
            24,
            10,
            31,
            .72
          );

        color:#ffe0a0;

        font:
          600 7px
          Montserrat,
          sans-serif;

        letter-spacing:.09em;

        backdrop-filter:
          blur(12px);

        pointer-events:none;
      }

      .hj-view-photo{
        position:relative;
        overflow:hidden;
      }

      #hjViewBlur{
        position:absolute;
        inset:-30px;

        background-size:cover;
        background-position:center;

        filter:
          blur(35px)
          brightness(.27);
      }

      #hjViewImg{
        position:absolute;
        inset:0;

        width:100%;
        height:100%;

        object-fit:contain;

        z-index:2;
      }

      .hj-view-shade{
        position:absolute;
        inset:0;
        z-index:3;

        background:
          linear-gradient(
            to top,
            rgba(
              3,
              2,
              6,
              .95
            ),
            transparent 50%
          );
      }

      .birthday-viewer
      .hj-view-shade{
        background:
          linear-gradient(
            to top,
            rgba(
              7,
              2,
              8,
              .96
            ),
            rgba(
              75,
              27,
              66,
              .04
            ) 55%,
            transparent 73%
          );
      }

      .hj-close,
      .hj-arrow{
        position:absolute;
        z-index:8;

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
            5,
            3,
            8,
            .58
          );

        color:#fff;

        border-radius:50%;
      }

      .hj-close{
        top:15px;
        left:15px;

        width:38px;
        height:38px;

        font-size:22px;
      }

      .hj-arrow{
        top:50%;

        transform:
          translateY(-50%);

        width:44px;
        height:44px;

        font-size:27px;
      }

      .hj-arrow.prev{
        left:14px;
      }

      .hj-arrow.next{
        right:14px;
      }

      .hj-view-copy{
        position:absolute;
        z-index:5;

        left:24px;
        right:24px;
        bottom:98px;

        text-align:center;
      }

      .hj-view-copy p{
        font-size:
          clamp(
            19px,
            2vw,
            30px
          );

        margin:0;
      }

      .hj-view-copy small{
        display:block;

        margin-top:6px;

        color:#aaa0b0;
        font-size:9px;
      }

      #hjFilm{
        position:absolute;
        z-index:6;

        left:16px;
        right:16px;
        bottom:16px;

        display:flex;
        gap:6px;

        overflow:auto;
        scrollbar-width:none;
      }

      .hj-thumb{
        flex:0 0 65px;

        height:55px;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .12
          );

        border-radius:7px;

        padding:0;
        overflow:hidden;
        opacity:.5;
      }

      .hj-thumb.active{
        opacity:1;
        border-color:#deb975;
      }

      .birthday-viewer
      .hj-thumb.active{
        border-color:#ffd48e;

        box-shadow:
          0 0 0 1px
          rgba(
            182,
            104,
            255,
            .18
          );
      }

      .hj-thumb img{
        width:100%;
        height:100%;
        object-fit:cover;
      }

      .hj-comments{
        padding:17px;

        background:
          linear-gradient(
            #120f18,
            #0b0910
          );

        display:grid;

        grid-template-rows:
          auto 1fr auto;

        min-height:0;
      }

      .birthday-viewer
      .hj-comments{
        background:
          radial-gradient(
            circle at 100% 0,
            rgba(
              255,
              200,
              126,
              .055
            ),
            transparent 28%
          ),
          linear-gradient(
            #160f1a,
            #0b0810
          );
      }

      .hj-comments>header{
        display:flex;

        justify-content:
          space-between;
      }

      .hj-comments>header small{
        font-size:9px;
        color:#7e7285;
      }

      #hjCommentList{
        overflow:auto;

        display:flex;
        flex-direction:column;

        gap:8px;

        padding:10px 0;
      }

      .hj-bubble{
        padding:10px;

        border-radius:
          14px 14px
          5px 14px;

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
            .06
          );
      }

      .birthday-viewer
      .hj-bubble{
        border-color:
          rgba(
            235,
            199,
            255,
            .09
          );

        background:
          rgba(
            255,
            255,
            255,
            .045
          );
      }

      .hj-bubble div{
        display:flex;

        justify-content:
          space-between;
      }

      .hj-bubble b{
        font-size:11px;
      }

      .hj-bubble small{
        font-size:8px;
        color:#776b7d;
      }

      .hj-bubble p{
        margin:4px 0 0;

        font-size:11px;
        color:#d7cedb;
      }

      .hj-compose{
        border-top:
          1px solid
          rgba(
            255,
            255,
            255,
            .08
          );

        padding-top:10px;
      }

      .hj-compose>div{
        display:grid;

        grid-template-columns:
          1fr 40px;

        gap:6px;
      }

      .hj-compose input{
        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .08
          );

        border-radius:10px;

        background:#17121b;
        color:#fff;

        padding:10px;
      }

      .hj-compose>div>button{
        border:0;
        border-radius:10px;

        background:
          linear-gradient(
            135deg,
            #a455ff,
            #6e30df
          );

        color:#fff;
      }

      .birthday-viewer
      .hj-compose>div>button{
        background:
          linear-gradient(
            135deg,
            #d9a252,
            #9550dd
          );
      }

      .hj-compose footer{
        display:flex;

        justify-content:
          space-between;

        margin-top:6px;

        color:#766b7c;
        font-size:9px;
      }

      .hj-compose footer button{
        border:0;
        background:none;
        color:#bc98e1;
      }

      .hj-compose>small{
        display:block;

        color:#bd7d98;
        font-size:8px;

        min-height:12px;
      }

      .hj-name-modal{
        position:fixed;
        inset:0;
        z-index:120000;

        display:none;
        place-items:center;

        background:
          rgba(
            2,
            1,
            4,
            .8
          );

        backdrop-filter:
          blur(14px);

        padding:18px;
      }

      .hj-name-modal.open{
        display:grid;
      }

      .hj-name-modal>div{
        width:min(
          400px,
          100%
        );

        padding:22px;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .1
          );

        border-radius:20px;

        background:#120e18;
      }

      .hj-name-modal small{
        font:
          500 8px
          Montserrat,
          sans-serif;

        letter-spacing:.15em;
        color:#aa90b7;
      }

      .hj-name-modal h3{
        margin:6px 0;
      }

      .hj-name-modal p{
        font-size:11px;
        color:#94899b;
      }

      .hj-name-modal input{
        width:100%;

        padding:10px;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .09
          );

        border-radius:10px;

        background:#0d0a11;
        color:#fff;
      }

      .hj-name-modal button{
        width:100%;

        margin-top:8px;
        padding:10px;

        border:0;
        border-radius:10px;

        background:
          linear-gradient(
            135deg,
            #a455ff,
            #6e30df
          );

        color:#fff;
        font-weight:700;
      }

      @media(max-width:1050px){

        .hj-grid{
          grid-template-columns:
            1fr;
        }

        .hj-hero{
          grid-template-columns:
            1fr;
        }

        .hj-hero aside{
          display:none;
        }

        .hj-view-shell{
          grid-template-columns:
            1fr;

          grid-template-rows:
            58% 42%;
        }

        .hj-birthday-banner{
          padding:
            27px 25px;
        }

        .hj-bday-balloons .b1{
          right:3%;
        }

        .hj-bday-balloons .b2{
          right:7%;
        }
      }

      @media(max-width:700px){

        .journal-section{
          padding:
            55px 0!important;
        }

        .hj-wrap{
          width:
            calc(
              100% - 16px
            );
        }

        .hj-title{
          font-size:
            clamp(
              47px,
              15vw,
              70px
            )!important;
        }

        .hj-days{
          padding:
            16px 10px;
        }

        .hj-days>header span{
          display:none;
        }

        #hjDays{
          display:grid;

          grid-template-columns:
            1fr 1fr;

          overflow:visible;

          gap:9px;
        }

        .hj-chip{
          width:100%;
          height:auto;

          aspect-ratio:.9;

          flex:none;
        }

        .hj-chip.birthday{
          filter:
            drop-shadow(
              0 0 12px
              rgba(
                187,
                100,
                255,
                .32
              )
            );
        }

        .hj-bday-ribbon{
          top:23%!important;

          max-width:
            calc(
              100% - 38px
            );

          font-size:
            5.8px!important;
        }

        .hj-chip-balloon{
          transform:
            scale(.83);
        }

        .hj-chip-balloon.b1{
          left:12px!important;
          top:43%!important;
        }

        .hj-chip-balloon.b2{
          right:11px!important;
          top:46%!important;
        }

        .hj-chip-balloon.b3{
          right:31px!important;
          top:36%!important;
        }

        .hj-birthday-banner{
          min-height:245px;

          display:none;

          padding:
            24px 18px
            20px;

          align-items:
            flex-start;

          flex-direction:
            column;

          justify-content:
            center;
        }

        .birthday-day
        .hj-birthday-banner{
          display:flex;
        }

        .hj-birthday-banner:before{
          left:-8px;
          top:-40px;

          font-size:215px;
        }

        .hj-bday-copy{
          position:relative;
          z-index:5;

          padding-left:72px;
        }

        .hj-bday-copy>small{
          font-size:6.5px;
          letter-spacing:.12em;
        }

        .hj-bday-copy>b{
          font-size:
            clamp(
              38px,
              13vw,
              55px
            );

          line-height:.87;
        }

        .hj-bday-copy>p{
          max-width:100%;

          font-size:11px;
          line-height:1.55;
        }

        .hj-bday-60{
          position:absolute;
          z-index:6;

          left:15px;
          top:18px;

          width:67px;
          height:67px;

          flex-basis:67px;
        }

        .hj-bday-60 span{
          font-size:27px;
        }

        .hj-bday-60 small{
          font-size:4.5px;
          margin-top:3px;
        }

        .hj-bday-balloons i{
          width:27px;
          height:35px;

          opacity:.62;
        }

        .hj-bday-balloons i:after{
          top:33px;
          height:55px;
        }

        .hj-bday-balloons .b1{
          right:8px;
          top:20px;
        }

        .hj-bday-balloons .b2{
          right:35px;
          top:67px;
        }

        .hj-bday-balloons .b3{
          left:auto;
          right:62px;
          top:28px;
        }

        .hj-day-head{
          padding:15px;
        }

        .hj-day-head>strong{
          width:55px;
          height:55px;
        }

        .birthday-day
        .hj-day-head{
          border-color:
            rgba(
              255,
              216,
              151,
              .16
            );
        }

        .hj-map-wrap,
        #hjMap{
          min-height:380px;
        }

        .hj-memories>header{
          align-items:flex-start;
          flex-direction:column;
        }

        .birthday-day
        .hj-memories:before{
          right:8px;
          top:25px;

          font-size:80px;
        }

        .hj-board{
          flex-basis:
            calc(
              100vw - 38px
            );

          height:700px;

          grid-template-columns:
            1fr 1fr;

          grid-template-rows:
            340px 170px 170px;
        }

        .hj-board .p1{
          grid-column:
            1/3!important;

          grid-row:
            1!important;
        }

        .hj-board.c1{
          grid-template-columns:
            1fr;

          grid-template-rows:
            1fr;
        }

        .hj-board.c1 .p1{
          grid-column:
            1!important;

          grid-row:
            1!important;
        }

        .hj-board.c2 .p2{
          grid-column:1/3;
          grid-row:2/4;
        }

        .hj-board.c3 .p2{
          grid-column:1;
          grid-row:2/4;
        }

        .hj-board.c3 .p3{
          grid-column:2;
          grid-row:2/4;
        }

        .hj-board.c4 .p2{
          grid-column:1;
          grid-row:2;
        }

        .hj-board.c4 .p3{
          grid-column:2;
          grid-row:2;
        }

        .hj-board.c4 .p4{
          grid-column:1/3;
          grid-row:3;
        }

        .hj-photo-birthday{
          top:9px;
          right:9px;

          padding:
            5px 7px;

          font-size:6px;
        }

        .hj-mini-balloons{
          top:9px;
          left:9px;
        }

        .hj-card.p1
        .hj-photo-birthday{
          padding:
            6px 9px;

          font-size:6.5px;
        }

        .hj-viewer{
          padding:0;
        }

        .hj-view-shell{
          width:100%;
          height:100%;

          border-radius:0;
          border:0;

          grid-template-rows:
            58vh 42vh;
        }

        .birthday-viewer
        .hj-view-photo:after{
          top:14px;
          right:14px;

          max-width:190px;

          padding:
            6px 8px;

          font-size:6px;
        }

        .hj-comments{
          padding:13px;
        }
      }

      @media(
        prefers-reduced-motion:
        reduce
      ){

        .hj-chip-balloon,
        .hj-bday-balloons i{
          animation:none!important;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }
})();
