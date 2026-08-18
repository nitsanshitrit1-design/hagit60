(() => {
  "use strict";

  const SB = "https://fqoziqglyrcjttnuismx.supabase.co";
  const KEY = "sb_publishable_2Z_EWufBUdNlSvesyg2bmA_7obNjRsI";
  const REFRESH_MS = 30000;

  let entries = [];
  let groups = new Map();
  let observer = null;
  let scheduled = false;

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  start();

  async function start() {
    await refreshEntries();
    applyLocalTimes();

    const journal =
      document.getElementById("journal");

    if (journal) {
      observer =
        new MutationObserver(
          scheduleApply
        );

      observer.observe(
        journal,
        {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["class"]
        }
      );
    }

    setInterval(
      async () => {
        await refreshEntries();
        applyLocalTimes();
      },
      REFRESH_MS
    );
  }

  async function refreshEntries() {
    try {
      const url =
        `${SB}/rest/v1/journal_entries` +
        `?select=` +
        `id,created_at,taken_at,` +
        `latitude,longitude,` +
        `location_name,day_number,image_path` +
        `&order=taken_at.asc.nullslast,created_at.asc`;

      const response =
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

      if (!response.ok) {
        return;
      }

      entries =
        await response.json();

      groups =
        groupEntries(entries);

    } catch (error) {
      console.warn(
        "Hagit timezone fix:",
        error
      );
    }
  }

  function groupEntries(list) {
    const map =
      new Map(
        Array.from(
          { length: 20 },
          (_, index) => [
            index + 1,
            []
          ]
        )
      );

    list.forEach(
      entry => {
        const dayNumber =
          Number(
            entry.day_number ||
            0
          );

        if (
          dayNumber >= 1 &&
          dayNumber <= 20
        ) {
          map
            .get(dayNumber)
            .push(entry);
        }
      }
    );

    map.forEach(
      dayEntries => {
        dayEntries.sort(
          (a, b) =>
            new Date(
              a.taken_at ||
              a.created_at ||
              0
            ) -
            new Date(
              b.taken_at ||
              b.created_at ||
              0
            )
        );
      }
    );

    return map;
  }

  function timeZoneForEntry(entry) {
    const location =
      String(
        entry?.location_name ||
        ""
      ).toLowerCase();

    /*
      ISRAEL
    */
    if (
      /israel|ישראל|ben\s*gurion|בן[\s־-]*גוריון|נתב["״']?ג|terminal\s*3|טרמינל\s*3|tel\s*aviv|תל\s*אביב/
        .test(location)
    ) {
      return "Asia/Jerusalem";
    }

    /*
      ARIZONA
    */
    if (
      /arizona|phoenix|פניקס|page\b|horseshoe|grand\s*canyon|lake\s*powell|glen\s*canyon/
        .test(location)
    ) {
      return "America/Phoenix";
    }

    /*
      UTAH
    */
    if (
      /utah|יוטה|zion|ציון|bryce|ברייס/
        .test(location)
    ) {
      return "America/Denver";
    }

    /*
      EAST COAST
    */
    if (
      /washington|district\s*of\s*columbia|virginia|maryland|pennsylvania|hershey|amish|watkins|niagara|scranton|new\s*york|manhattan|jersey|ontario|ניו\s*יורק|וושינגטון|ניאגרה/
        .test(location)
    ) {
      if (
        /ontario|niagara-on-the-lake/
          .test(location)
      ) {
        return "America/Toronto";
      }

      return "America/New_York";
    }

    /*
      CALIFORNIA + NEVADA
    */
    if (
      /california|los\s*angeles|hollywood|san\s*diego|la\s*jolla|santa\s*monica|beverly|anaheim|santa\s*barbara|solvang|monterey|san\s*francisco|sausalito|yosemite|las\s*vegas|nevada|לוס\s*אנג|סן\s*דייגו|סן\s*פרנסיסקו|לאס\s*וגאס/
        .test(location)
    ) {
      return "America/Los_Angeles";
    }

    /*
      FALLBACK לפי GPS,
      במקרה ששם המקום לא ברור.
    */
    const lat =
      Number(entry?.latitude);

    const lng =
      Number(entry?.longitude);

    if (
      Number.isFinite(lat) &&
      Number.isFinite(lng)
    ) {

      /*
        ISRAEL
      */
      if (
        lng > 20 &&
        lng < 40 &&
        lat > 28 &&
        lat < 36
      ) {
        return "Asia/Jerusalem";
      }

      /*
        PACIFIC
      */
      if (
        lng <= -114
      ) {
        return "America/Los_Angeles";
      }

      /*
        UTAH / MOUNTAIN
      */
      if (
        lng > -114 &&
        lng <= -109 &&
        lat >= 37
      ) {
        return "America/Denver";
      }

      /*
        ARIZONA
      */
      if (
        lng > -115 &&
        lng <= -108 &&
        lat < 37.5
      ) {
        return "America/Phoenix";
      }

      /*
        EASTERN USA
      */
      if (
        lng > -90 &&
        lng < -60
      ) {
        return "America/New_York";
      }
    }

    /*
      FALLBACK אחרון לפי day_number.
      שם המקום כמעט תמיד אמור
      לתפוס קודם.
    */
    const day =
      Number(
        entry?.day_number ||
        0
      );

    if (
      day >= 1 &&
      day <= 10
    ) {
      return "America/Los_Angeles";
    }

    if (
      day === 11
    ) {
      return "America/Denver";
    }

    if (
      day === 12 ||
      day === 13
    ) {
      return "America/Phoenix";
    }

    if (
      day >= 14 &&
      day <= 20
    ) {
      return "America/New_York";
    }

    return "UTC";
  }

  function formatLocalTime(entry) {
    const value =
      entry?.taken_at ||
      entry?.created_at;

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
          timeZone:
            timeZoneForEntry(entry),

          hour:
            "2-digit",

          minute:
            "2-digit"
        }
      )
      .format(date);
  }

  function formatLocalDateTime(entry) {
    const value =
      entry?.taken_at ||
      entry?.created_at;

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
          timeZone:
            timeZoneForEntry(entry),

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
      .format(date);
  }

  function selectedDay() {
    return Number(
      $(".hj-chip.active")
        ?.dataset.day ||
      0
    );
  }

  function currentDayEntries() {
    return (
      groups.get(
        selectedDay()
      ) ||
      []
    );
  }

  function scheduleApply() {
    if (scheduled) {
      return;
    }

    scheduled = true;

    requestAnimationFrame(
      () => {
        scheduled = false;
        applyLocalTimes();
      }
    );
  }

  function applyLocalTimes() {
    observer?.disconnect();

    updateCards();
    updateViewer();
    updateStops();
    updateMapPopup();
    updateHero();

    const journal =
      document.getElementById(
        "journal"
      );

    if (
      observer &&
      journal
    ) {
      observer.observe(
        journal,
        {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["class"]
        }
      );
    }
  }

  function updateCards() {
    const dayEntries =
      currentDayEntries();

    $$
      (
        "#hjPhotoScroll .hj-card[data-photo]"
      )
      .forEach(
        card => {

          const entry =
            dayEntries[
              Number(
                card.dataset.photo
              )
            ];

          const meta =
            $(
              ".hj-card-copy small",
              card
            );

          if (
            !entry ||
            !meta
          ) {
            return;
          }

          meta.textContent =
            [
              formatLocalTime(
                entry
              ),

              entry.location_name
            ]
            .filter(Boolean)
            .join(" · ");
        }
      );
  }

  function updateViewer() {
    const viewer =
      $("#hjViewer");

    if (
      !viewer
        ?.classList
        .contains("open")
    ) {
      return;
    }

    const dayEntries =
      currentDayEntries();

    const activeThumb =
      $("#hjFilm .hj-thumb.active");

    const index =
      activeThumb
        ? Number(
            activeThumb
              .dataset.thumb
          )
        : 0;

    const entry =
      dayEntries[index];

    const meta =
      $("#hjViewMeta");

    if (
      !entry ||
      !meta
    ) {
      return;
    }

    meta.textContent =
      [
        formatLocalDateTime(
          entry
        ),

        entry.location_name
      ]
      .filter(Boolean)
      .join(" · ");
  }

  function updateStops() {
    const dayEntries =
      currentDayEntries();

    $$
      (
        "#hjStops .hj-stop"
      )
      .forEach(
        stop => {

          const locationName =
            $(
              "b",
              stop
            )
            ?.textContent
            ?.trim() ||
            "";

          const timeNode =
            $(
              "small",
              stop
            );

          if (!timeNode) {
            return;
          }

          const entry =
            findEntryByLocation(
              dayEntries,
              locationName
            );

          if (!entry) {
            return;
          }

          timeNode.textContent =
            formatLocalTime(
              entry
            );
        }
      );
  }

  function updateMapPopup() {
    const popup =
      $("#hjMap .hj-popup");

    if (!popup) {
      return;
    }

    const locationName =
      $("b", popup)
        ?.textContent
        ?.trim() ||
      "";

    const small =
      $("small", popup);

    if (!small) {
      return;
    }

    const entry =
      findEntryByLocation(
        currentDayEntries(),
        locationName
      );

    if (!entry) {
      return;
    }

    const stopNumber =
      small
        .textContent
        .match(
          /עצירה\s*\d+/
        )
        ?.[0] ||
      "עצירה";

    small.textContent =
      `${stopNumber} · ${formatLocalTime(entry)}`;
  }

  function updateHero() {
    const last =
      entries.at(-1);

    const meta =
      $("#hjHeroMeta");

    if (
      !last ||
      !meta
    ) {
      return;
    }

    meta.textContent =
      [
        `עודכן ${formatLocalDateTime(last)}`,
        last.location_name
      ]
      .filter(Boolean)
      .join(" · ");
  }

  function findEntryByLocation(
    dayEntries,
    visibleName
  ) {
    const needle =
      normalizeLocation(
        visibleName
      );

    if (!needle) {
      return null;
    }

    return (
      dayEntries.find(
        entry =>
          normalizeLocation(
            entry.location_name
          ) === needle
      ) ||

      dayEntries.find(
        entry => {
          const value =
            normalizeLocation(
              entry.location_name
            );

          return (
            value &&
            (
              value.includes(
                needle
              ) ||
              needle.includes(
                value
              )
            )
          );
        }
      ) ||

      null
    );
  }

  function normalizeLocation(value) {
    return String(
      value ||
      ""
    )
      .toLowerCase()
      .replace(
        /[.,]/g,
        " "
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();
  }
})();
