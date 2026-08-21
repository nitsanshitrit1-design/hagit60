(() => {
  "use strict";

  const CFG = {
    timeZone: "Asia/Jerusalem", // כרגע לבדיקה. אחר כך נשנה ל-America/Los_Angeles
    date: "2026-08-21",
    duration: 9500
  };

  const SEEN = `h60-birthday-${CFG.date}-v2`;

  const forced =
    new URLSearchParams(location.search)
      .get("birthday") === "1";

  if (!isBirthday() && !forced) return;

  let overlay;
  let canvas;
  let ctx;

  let raf = 0;
  let closingTimer = 0;

  let particles = [];
  let rockets = [];
  let stars = [];

  let running = false;

  const reduce =
    matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  addStyles();
  build();
  bind();
  addReplayButton();

  const auto =
    forced ||
    sessionStorage.getItem(SEEN) !== "1";

  if (auto) {
    const start = () =>
      setTimeout(
        () => openBirthday(true),
        450
      );

    document.readyState === "complete"
      ? start()
      : addEventListener(
          "load",
          start,
          { once: true }
        );
  }

  function isBirthday() {
    const parts =
      new Intl.DateTimeFormat(
        "en-CA",
        {
          timeZone: CFG.timeZone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        }
      ).formatToParts(
        new Date()
      );

    const values =
      Object.fromEntries(
        parts
          .filter(
            p =>
              p.type !== "literal"
          )
          .map(
            p => [
              p.type,
              p.value
            ]
          )
      );

    return (
      `${values.year}-${values.month}-${values.day}` ===
      CFG.date
    );
  }

  function addStyles() {
    if (
      document.getElementById(
        "h60-bday-style"
      )
    ) {
      return;
    }

    const s =
      document.createElement(
        "style"
      );

    s.id =
      "h60-bday-style";

    s.textContent = `
      #h60Birthday{
        position:fixed;
        inset:0;
        z-index:2147483000;
        display:none;
        overflow:hidden;
        isolation:isolate;

        color:#fff;

        opacity:0;

        transition:
          opacity .65s ease;

        background:
          radial-gradient(
            circle at 16% 20%,
            rgba(149,67,255,.20),
            transparent 27%
          ),
          radial-gradient(
            circle at 84% 18%,
            rgba(255,69,173,.18),
            transparent 25%
          ),
          radial-gradient(
            circle at 50% 82%,
            rgba(255,203,113,.10),
            transparent 28%
          ),
          rgba(4,2,8,.975);

        font-family:
          "Heebo",
          Arial,
          sans-serif;
      }

      #h60Birthday.open{
        display:block;
      }

      #h60Birthday.visible{
        opacity:1;
      }

      #h60BdayCanvas{
        position:absolute;
        inset:0;

        width:100%;
        height:100%;

        z-index:2;

        pointer-events:none;
      }

      .h60-noise{
        position:absolute;
        inset:0;

        z-index:1;

        opacity:.18;

        pointer-events:none;

        background-image:
          radial-gradient(
            circle,
            #fff 0 1px,
            transparent 1.2px
          ),
          radial-gradient(
            circle,
            #cfa7ff 0 1px,
            transparent 1.3px
          );

        background-size:
          83px 83px,
          139px 139px;

        background-position:
          0 0,
          31px 27px;

        mask-image:
          linear-gradient(
            #000,
            rgba(0,0,0,.45),
            transparent
          );
      }

      .h60-glow{
        position:absolute;

        z-index:1;

        left:50%;
        top:50%;

        width:min(
          90vw,
          1050px
        );

        height:min(
          90vw,
          1050px
        );

        transform:
          translate(
            -50%,
            -50%
          );

        border-radius:50%;

        background:
          radial-gradient(
            circle,
            rgba(166,83,255,.18),
            rgba(255,71,174,.07) 35%,
            transparent 68%
          );

        filter:
          blur(32px);

        animation:
          h60pulse
          3.7s
          ease-in-out
          infinite;
      }

      .h60-sixty{
        position:absolute;

        z-index:3;

        left:50%;
        top:50%;

        transform:
          translate(
            -50%,
            -54%
          );

        font:
          500 italic
          min(62vw,760px)/.62
          "Cormorant Garamond",
          serif;

        color:transparent;

        -webkit-text-stroke:
          1px
          rgba(
            240,
            218,
            255,
            .09
          );

        pointer-events:none;

        animation:
          h60sixty
          4.8s
          ease-in-out
          infinite;
      }

      .h60-content{
        position:relative;

        z-index:5;

        min-height:100%;

        width:min(
          1080px,
          calc(100% - 34px)
        );

        margin:auto;

        display:flex;
        flex-direction:column;

        align-items:center;
        justify-content:center;

        text-align:center;

        padding:
          58px
          0
          70px;
      }

      .h60-over{
        font:
          600
          10px/1.2
          "Montserrat",
          sans-serif;

        letter-spacing:.3em;

        color:#d7b5f4;

        opacity:0;

        transform:
          translateY(18px);
      }

      .h60-title{
        margin-top:18px;

        font:
          500
          clamp(
            74px,
            12vw,
            176px
          )/.7
          "Cormorant Garamond",
          serif;

        letter-spacing:
          -.055em;

        color:#fbf5ff;

        text-shadow:
          0 0 70px
          rgba(
            187,
            98,
            255,
            .12
          );

        opacity:0;

        transform:
          scale(.82)
          translateY(25px);

        filter:
          blur(10px);
      }

      .h60-title em{
        display:block;

        margin-top:.1em;

        font-style:italic;

        background:
          linear-gradient(
            100deg,
            #fff 2%,
            #d8b1ff 38%,
            #ff76c3 68%,
            #ffd494 100%
          );

        -webkit-background-clip:text;
        background-clip:text;

        color:transparent;
      }

      .h60-line{
        display:flex;

        align-items:center;

        gap:14px;

        width:min(
          680px,
          88vw
        );

        margin:
          30px
          auto
          22px;

        opacity:0;

        transform:
          scaleX(.82);
      }

      .h60-line span{
        height:1px;

        flex:1;

        background:
          linear-gradient(
            90deg,
            transparent,
            rgba(
              223,
              185,
              255,
              .56
            )
          );
      }

      .h60-line span:last-child{
        background:
          linear-gradient(
            90deg,
            rgba(
              223,
              185,
              255,
              .56
            ),
            transparent
          );
      }

      .h60-line b{
        font:
          500
          10px/1
          "Montserrat",
          sans-serif;

        letter-spacing:
          .22em;

        color:
          #ffc3e3;

        white-space:
          nowrap;
      }

      .h60-sub{
        font:
          300
          clamp(
            20px,
            3vw,
            38px
          )/1.15
          "Montserrat",
          sans-serif;

        letter-spacing:
          -.025em;

        color:
          #f4eaff;

        opacity:0;

        transform:
          translateY(18px);
      }

      .h60-sub strong{
        display:block;

        margin-top:6px;

        font-weight:400;

        color:#d5a3ff;
      }

      .h60-he{
        direction:rtl;

        margin-top:22px;

        color:#d8c9dd;

        font-size:
          clamp(
            15px,
            2vw,
            20px
          );

        font-weight:300;

        opacity:0;

        transform:
          translateY(18px);
      }

      .h60-actions{
        display:flex;

        gap:10px;

        flex-wrap:wrap;

        justify-content:center;

        margin-top:30px;

        opacity:0;

        transform:
          translateY(16px);
      }

      .h60-btn{
        border:
          1px solid
          rgba(
            232,
            206,
            255,
            .22
          );

        border-radius:
          999px;

        padding:
          12px 17px;

        background:
          rgba(
            255,
            255,
            255,
            .055
          );

        color:#fff;

        font:
          600
          10px/1
          "Montserrat",
          "Heebo",
          sans-serif;

        letter-spacing:.08em;

        cursor:pointer;

        backdrop-filter:
          blur(12px);

        transition:.2s;
      }

      .h60-btn:hover{
        transform:
          translateY(-2px);

        background:
          rgba(
            176,
            90,
            255,
            .12
          );
      }

      .h60-btn.primary{
        color:#170a20;

        border-color:
          transparent;

        background:
          linear-gradient(
            120deg,
            #f5eaff,
            #d3a9ff 48%,
            #ffb3d9
          );
      }

      .h60-x{
        position:absolute;

        z-index:10;

        top:max(
          18px,
          env(
            safe-area-inset-top
          )
        );

        left:max(
          18px,
          env(
            safe-area-inset-left
          )
        );

        width:42px;
        height:42px;

        border-radius:50%;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .15
          );

        background:
          rgba(
            8,
            4,
            12,
            .58
          );

        color:#fff;

        font-size:21px;

        cursor:pointer;

        backdrop-filter:
          blur(14px);
      }

      .h60-foot{
        position:absolute;

        z-index:5;

        bottom:18px;
        left:50%;

        transform:
          translateX(-50%);

        font:
          500
          8px/1
          "Montserrat",
          sans-serif;

        letter-spacing:
          .25em;

        color:#817487;

        white-space:
          nowrap;
      }

      #h60Replay{
        position:fixed;

        z-index:2147482000;

        right:max(
          16px,
          env(
            safe-area-inset-right
          )
        );

        bottom:max(
          16px,
          env(
            safe-area-inset-bottom
          )
        );

        display:flex;

        align-items:center;

        gap:8px;

        padding:
          11px 14px;

        border:
          1px solid
          rgba(
            221,
            182,
            255,
            .27
          );

        border-radius:
          999px;

        background:
          linear-gradient(
            120deg,
            rgba(
              84,
              35,
              138,
              .9
            ),
            rgba(
              156,
              43,
              113,
              .84
            )
          );

        color:#fff;

        box-shadow:
          0 14px 45px
          rgba(
            45,
            5,
            72,
            .45
          );

        backdrop-filter:
          blur(16px);

        font:
          600
          9px/1
          "Montserrat",
          "Heebo",
          sans-serif;

        letter-spacing:
          .08em;

        cursor:pointer;

        transition:.2s;
      }

      #h60Replay:hover{
        transform:
          translateY(-3px)
          scale(1.02);
      }

      #h60Replay i{
        font-style:normal;
        font-size:16px;
      }

      #h60Birthday.animate
      .h60-over{
        animation:
          h60rise
          .7s
          .22s
          ease
          forwards;
      }

      #h60Birthday.animate
      .h60-title{
        animation:
          h60hero
          1.15s
          .4s
          cubic-bezier(
            .16,
            1,
            .3,
            1
          )
          forwards;
      }

      #h60Birthday.animate
      .h60-line{
        animation:
          h60line
          .75s
          1.02s
          ease
          forwards;
      }

      #h60Birthday.animate
      .h60-sub{
        animation:
          h60rise
          .75s
          1.2s
          ease
          forwards;
      }

      #h60Birthday.animate
      .h60-he{
        animation:
          h60rise
          .75s
          1.42s
          ease
          forwards;
      }

      #h60Birthday.animate
      .h60-actions{
        animation:
          h60rise
          .75s
          1.65s
          ease
          forwards;
      }

      @keyframes h60rise{
        to{
          opacity:1;
          transform:
            translateY(0);
        }
      }

      @keyframes h60hero{
        60%{
          opacity:1;
          filter:blur(0);
        }

        100%{
          opacity:1;

          transform:
            scale(1)
            translateY(0);

          filter:
            blur(0);
        }
      }

      @keyframes h60line{
        to{
          opacity:1;
          transform:
            scaleX(1);
        }
      }

      @keyframes h60pulse{
        0%,
        100%{
          transform:
            translate(
              -50%,
              -50%
            )
            scale(.94);

          opacity:.72;
        }

        50%{
          transform:
            translate(
              -50%,
              -50%
            )
            scale(1.08);

          opacity:1;
        }
      }

      @keyframes h60sixty{
        0%,
        100%{
          opacity:.52;

          transform:
            translate(
              -50%,
              -54%
            )
            scale(.96);
        }

        50%{
          opacity:1;

          transform:
            translate(
              -50%,
              -54%
            )
            scale(1.025);
        }
      }

      @media(max-width:700px){

        .h60-content{
          width:
            calc(100% - 24px);

          padding:
            75px 0 85px;
        }

        .h60-title{
          font-size:
            clamp(
              72px,
              24vw,
              122px
            );
        }

        .h60-line b{
          font-size:8px;

          letter-spacing:
            .15em;
        }

        .h60-sub{
          font-size:20px;
        }

        .h60-he{
          max-width:330px;

          line-height:1.55;
        }

        #h60Replay{
          right:12px;
          bottom:12px;

          padding:
            10px 12px;
        }
      }

      @media(
        prefers-reduced-motion:
        reduce
      ){
        .h60-glow,
        .h60-sixty{
          animation:none!important;
        }
      }
    `;

    document.head.appendChild(
      s
    );
  }

  function build() {
    overlay =
      document.createElement(
        "div"
      );

    overlay.id =
      "h60Birthday";

    overlay.innerHTML = `
      <canvas id="h60BdayCanvas"></canvas>

      <div class="h60-noise"></div>
      <div class="h60-glow"></div>

      <div
        class="h60-sixty"
        aria-hidden="true"
      >
        60
      </div>

      <button
        class="h60-x"
        id="h60Close"
        aria-label="סגירה"
      >
        ×
      </button>

      <div class="h60-content">

        <div class="h60-over">
          ✦ AUGUST 21 · THE BIRTHDAY MOMENT ✦
        </div>

        <div
          class="h60-title"
          dir="ltr"
        >
          HAPPY 60TH
          <br>
          <em>HAGIT!</em>
        </div>

        <div
          class="h60-line"
          dir="ltr"
        >
          <span></span>

          <b>
            60 YEARS · ONE ICON
          </b>

          <span></span>
        </div>

        <div
          class="h60-sub"
          dir="ltr"
        >
          TODAY IS YOUR DAY.

          <strong>
            AMERICA IS YOUR PARTY.
            🇺🇸✨
          </strong>
        </div>

        <div class="h60-he">
          מזל טוב אמא ❤️
          60 מעולם לא נראה
          כל כך טוב.
        </div>

        <div class="h60-actions">

          <button
            class="h60-btn primary"
            id="h60Encore"
          >
            🎆 MORE FIREWORKS
          </button>

          <button
            class="h60-btn"
            id="h60Enter"
          >
            ENTER THE JOURNEY ↓
          </button>

        </div>

      </div>

      <div
        class="h60-foot"
        dir="ltr"
      >
        H60 · BIRTHDAY MODE
      </div>
    `;

    document.body.appendChild(
      overlay
    );

    canvas =
      document.getElementById(
        "h60BdayCanvas"
      );

    ctx =
      canvas.getContext(
        "2d"
      );
  }

  function bind() {
    document
      .getElementById(
        "h60Close"
      )
      .onclick =
        closeBirthday;

    document
      .getElementById(
        "h60Enter"
      )
      .onclick =
        closeBirthday;

    document
      .getElementById(
        "h60Encore"
      )
      .onclick =
        () => {
          finale();

          setTimeout(
            finale,
            420
          );
        };

    addEventListener(
      "keydown",
      e => {
        if (
          e.key === "Escape" &&
          overlay
            .classList
            .contains("open")
        ) {
          closeBirthday();
        }
      }
    );
  }

  function addReplayButton() {
    const b =
      document.createElement(
        "button"
      );

    b.id =
      "h60Replay";

    b.innerHTML = `
      <i>🎂</i>
      <span>
        BIRTHDAY MODE
      </span>
    `;

    b.onclick =
      () =>
        openBirthday(false);

    document.body.appendChild(
      b
    );
  }

  function openBirthday(auto) {
    if (running) return;

    running = true;

    if (auto) {
      sessionStorage.setItem(
        SEEN,
        "1"
      );
    }

    clearTimeout(
      closingTimer
    );

    particles = [];
    rockets = [];
    stars = [];

    overlay
      .classList
      .add("open");

    document
      .documentElement
      .style
      .overflow =
        "hidden";

    document
      .body
      .style
      .overflow =
        "hidden";

    requestAnimationFrame(
      () =>
        overlay
          .classList
          .add(
            "visible",
            "animate"
          )
    );

    resize();

    addEventListener(
      "resize",
      resize,
      { passive:true }
    );

    startLoop();

    reduce
      ? finale()
      : sequence();

    closingTimer =
      setTimeout(
        closeBirthday,
        CFG.duration
      );
  }

  function closeBirthday() {
    if (
      !overlay
        .classList
        .contains("open")
    ) {
      return;
    }

    clearTimeout(
      closingTimer
    );

    overlay
      .classList
      .remove(
        "visible",
        "animate"
      );

    setTimeout(
      () => {

        overlay
          .classList
          .remove("open");

        document
          .documentElement
          .style
          .overflow =
            "";

        document
          .body
          .style
          .overflow =
            "";

        running =
          false;

        cancelAnimationFrame(
          raf
        );

        particles = [];
        rockets = [];
        stars = [];

        ctx.clearRect(
          0,
          0,
          innerWidth,
          innerHeight
        );

      },
      650
    );
  }

  function resize() {
    const dpr =
      Math.min(
        devicePixelRatio ||
        1,
        2
      );

    canvas.width =
      innerWidth * dpr;

    canvas.height =
      innerHeight * dpr;

    canvas.style.width =
      innerWidth + "px";

    canvas.style.height =
      innerHeight + "px";

    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );
  }

  function sequence() {
    rocket(
      .17,
      .22,
      "purple",
      650
    );

    rocket(
      .83,
      .20,
      "pink",
      900
    );

    rocket(
      .34,
      .31,
      "gold",
      1400
    );

    rocket(
      .67,
      .30,
      "lav",
      1700
    );

    setTimeout(
      () => {
        burst(
          innerWidth * .12,
          innerHeight * .43,
          80,
          "pink"
        );

        burst(
          innerWidth * .88,
          innerHeight * .42,
          80,
          "purple"
        );
      },
      2300
    );

    setTimeout(
      () => {
        burst(
          innerWidth * .27,
          innerHeight * .18,
          92,
          "gold"
        );

        burst(
          innerWidth * .73,
          innerHeight * .17,
          92,
          "lav"
        );
      },
      3200
    );

    setTimeout(
      finale,
      4500
    );

    setTimeout(
      finale,
      6100
    );
  }

  function finale() {
    const spots = [
      [.12,.22,"gold"],
      [.28,.31,"purple"],
      [.50,.16,"pink"],
      [.72,.30,"lav"],
      [.88,.22,"gold"]
    ];

    spots.forEach(
      ([x,y,c],i) =>
        setTimeout(
          () =>
            burst(
              innerWidth * x,
              innerHeight * y,
              100,
              c
            ),
          i * 105
        )
    );

    for (
      let i = 0;
      i < 70;
      i++
    ) {
      stars.push({
        x:
          innerWidth *
          (
            .1 +
            Math.random() *
            .8
          ),

        y:
          innerHeight *
          (
            .1 +
            Math.random() *
            .62
          ),

        life:
          55 +
          Math.random() *
          45,

        max:
          100,

        size:
          1 +
          Math.random() *
          2.6,

        p:
          Math.random() *
          6.28
      });
    }
  }

  function rocket(
    px,
    py,
    color,
    delay
  ) {
    setTimeout(
      () => {

        const tx =
          innerWidth * px;

        const ty =
          innerHeight * py;

        const x =
          tx +
          (
            Math.random() -
            .5
          ) *
          50;

        const y =
          innerHeight +
          20;

        rockets.push({
          x,
          y,
          tx,
          ty,

          vx:
            (tx - x) /
            44,

          vy:
            (ty - y) /
            44,

          age:
            0,

          color
        });

      },
      delay
    );
  }

  const sets = {
    purple: [
      "#c895ff",
      "#8c45ff",
      "#ead8ff",
      "#fff"
    ],

    pink: [
      "#ff5caf",
      "#ff9ace",
      "#ffd7ea",
      "#fff"
    ],

    gold: [
      "#ffd17c",
      "#fff0b5",
      "#ffb76a",
      "#fff"
    ],

    lav: [
      "#d8bbff",
      "#ad78ff",
      "#f3e8ff",
      "#fff"
    ]
  };

  function burst(
    x,
    y,
    n = 80,
    color = "purple"
  ) {
    const cs =
      sets[color] ||
      sets.purple;

    for (
      let i = 0;
      i < n;
      i++
    ) {
      const a =
        6.283 *
        i /
        n +
        (
          Math.random() -
          .5
        ) *
        .12;

      const speed =
        2.1 +
        Math.random() *
        5.7;

      particles.push(
        makeParticle(
          x,
          y,
          a,
          speed,
          cs[
            Math.floor(
              Math.random() *
              cs.length
            )
          ],
          false
        )
      );
    }

    for (
      let i = 0;
      i < 16;
      i++
    ) {
      particles.push(
        makeParticle(
          x,
          y,
          Math.random() *
          6.283,
          .7 +
          Math.random() *
          2,
          "#fff",
          true
        )
      );
    }
  }

  function makeParticle(
    x,
    y,
    a,
    speed,
    color,
    glitter
  ) {
    const life =
      65 +
      Math.random() *
      55;

    return {
      x,
      y,

      vx:
        Math.cos(a) *
        speed,

      vy:
        Math.sin(a) *
        speed,

      gravity:
        .045 +
        Math.random() *
        .018,

      drag:
        .984,

      life,
      max:
        life,

      color,

      size:
        glitter
          ? .8 +
            Math.random() *
            1.2
          : 1.3 +
            Math.random() *
            2.3,

      glitter,

      twinkle:
        Math.random() *
        6.28
    };
  }

  function startLoop() {
    cancelAnimationFrame(
      raf
    );

    const frame = () => {
      draw();

      raf =
        requestAnimationFrame(
          frame
        );
    };

    raf =
      requestAnimationFrame(
        frame
      );
  }

  function draw() {
    ctx.clearRect(
      0,
      0,
      innerWidth,
      innerHeight
    );

    ctx.globalCompositeOperation =
      "lighter";

    rockets =
      rockets.filter(
        r => {

          r.age++;

          r.x += r.vx;
          r.y += r.vy;

          r.vy += .012;

          for (
            let i = 0;
            i < 2;
            i++
          ) {
            particles.push(
              makeParticle(
                r.x +
                (
                  Math.random() -
                  .5
                ) *
                3,

                r.y + 7,

                1.57 +
                (
                  Math.random() -
                  .5
                ) *
                .5,

                .4 +
                Math.random(),

                sets[
                  r.color
                ][1],

                true
              )
            );
          }

          ctx.beginPath();

          ctx.arc(
            r.x,
            r.y,
            2.1,
            0,
            6.283
          );

          ctx.fillStyle =
            "#fff";

          ctx.shadowBlur =
            18;

          ctx.shadowColor =
            sets[
              r.color
            ][0];

          ctx.fill();

          ctx.shadowBlur =
            0;

          if (
            r.age > 42 ||
            r.y <= r.ty
          ) {
            burst(
              r.tx,
              r.ty,
              88,
              r.color
            );

            return false;
          }

          return true;
        }
      );

    particles =
      particles.filter(
        p => {

          p.life--;

          if (
            p.life <= 0
          ) {
            return false;
          }

          p.vx *=
            p.drag;

          p.vy *=
            p.drag;

          p.vy +=
            p.gravity;

          p.x +=
            p.vx;

          p.y +=
            p.vy;

          p.twinkle +=
            .24;

          const alpha =
            Math.max(
              0,
              p.life /
              p.max
            ) *
            (
              p.glitter
                ? .55 +
                  .45 *
                  Math.sin(
                    p.twinkle
                  )
                : 1
            );

          ctx.globalAlpha =
            alpha;

          ctx.fillStyle =
            p.color;

          ctx.shadowBlur =
            p.glitter
              ? 8
              : 12;

          ctx.shadowColor =
            p.color;

          ctx.beginPath();

          ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            6.283
          );

          ctx.fill();

          ctx.shadowBlur =
            0;

          return (
            p.y <
            innerHeight +
            40
          );
        }
      );

    stars =
      stars.filter(
        s => {

          s.life--;

          if (
            s.life <= 0
          ) {
            return false;
          }

          s.p += .18;

          ctx.globalAlpha =
            Math.max(
              0,
              s.life /
              s.max
            ) *
            (
              .55 +
              .45 *
              Math.sin(
                s.p
              )
            );

          ctx.strokeStyle =
            "#fff8ff";

          ctx.beginPath();

          ctx.moveTo(
            s.x -
            s.size * 4,
            s.y
          );

          ctx.lineTo(
            s.x +
            s.size * 4,
            s.y
          );

          ctx.moveTo(
            s.x,
            s.y -
            s.size * 4
          );

          ctx.lineTo(
            s.x,
            s.y +
            s.size * 4
          );

          ctx.stroke();

          return true;
        }
      );

    ctx.globalAlpha =
      1;

    ctx.globalCompositeOperation =
      "source-over";
  }
})();
