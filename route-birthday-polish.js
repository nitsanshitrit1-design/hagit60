(() => {
  "use strict";

  const BIRTHDAY_DAY = 5;

  addStyles();

  decorate();

  const observer =
    new MutationObserver(() => {
      decorate();
    });

  const startObserver = () => {
    const timeline =
      document.getElementById("timeline");

    const jump =
      document.getElementById("dayJump");

    if (timeline) {
      observer.observe(
        timeline,
        {
          childList: true,
          subtree: true
        }
      );
    }

    if (jump) {
      observer.observe(
        jump,
        {
          childList: true,
          subtree: true
        }
      );
    }
  };

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        decorate();
        startObserver();
      },
      { once: true }
    );
  } else {
    startObserver();
  }

  setTimeout(
    decorate,
    300
  );

  setTimeout(
    decorate,
    1000
  );

  function decorate() {

    decorateBirthdayDay();
    decorateJumpButton();
  }

  function decorateBirthdayDay() {

    const day =
      document.getElementById(
        `day-${BIRTHDAY_DAY}`
      );

    if (!day) {
      return;
    }

    day.classList.add(
      "h60-route-birthday"
    );

    const head =
      day.querySelector(
        ".day-world-head"
      );

    if (
      head &&
      !head.querySelector(
        ".h60-route-balloons"
      )
    ) {

      const balloons =
        document.createElement(
          "div"
        );

      balloons.className =
        "h60-route-balloons";

      balloons.setAttribute(
        "aria-hidden",
        "true"
      );

      balloons.innerHTML = `
        <i class="b1"></i>
        <i class="b2"></i>
        <i class="b3"></i>
      `;

      head.appendChild(
        balloons
      );
    }

    const title =
      day.querySelector(
        ".day-world-title"
      );

    if (
      title &&
      !title.querySelector(
        ".h60-route-kicker"
      )
    ) {

      const kicker =
        document.createElement(
          "div"
        );

      kicker.className =
        "h60-route-kicker";

      kicker.innerHTML = `
        <span>🎂</span>
        HAGIT'S 60TH BIRTHDAY
        <span>✦</span>
      `;

      title.prepend(
        kicker
      );
    }

    const body =
      day.querySelector(
        ".day-world-body"
      );

    if (
      body &&
      !body.querySelector(
        ".h60-route-birthday-strip"
      )
    ) {

      const strip =
        document.createElement(
          "div"
        );

      strip.className =
        "h60-route-birthday-strip";

      strip.innerHTML = `
        <div class="h60-route-60">
          <strong>60</strong>
          <small>BIRTHDAY GIRL</small>
        </div>

        <div class="h60-route-strip-copy">
          <small>
            21 AUGUST 2026 · THE BIRTHDAY DAY
          </small>

          <b>
            TODAY, MOM TURNS
            <em>60.</em>
          </b>

          <span>
            מונטריי · 17-Mile Drive · סן פרנסיסקו
            —
            והיום כל הדרך הזאת היא גם מסיבת יום ההולדת של אמא ✨
          </span>
        </div>

        <div
          class="h60-route-strip-balloons"
          aria-hidden="true"
        >
          <i></i>
          <i></i>
          <i></i>
        </div>
      `;

      body.prepend(
        strip
      );
    }
  }

  function decorateJumpButton() {

    const host =
      document.getElementById(
        "dayJump"
      );

    if (!host) {
      return;
    }

    const buttons =
      [...host.querySelectorAll(
        "button"
      )];

    const button =
      buttons.find(
        b =>
          b.textContent
            .trim()
            .replace(/[^\d]/g, "") ===
          String(BIRTHDAY_DAY)
      );

    if (!button) {
      return;
    }

    button.classList.add(
      "h60-birthday-jump"
    );

    if (
      !button.querySelector(
        ".h60-jump-cake"
      )
    ) {
      const cake =
        document.createElement(
          "span"
        );

      cake.className =
        "h60-jump-cake";

      cake.textContent =
        "🎂";

      button.appendChild(
        cake
      );
    }
  }

  function addStyles() {

    if (
      document.getElementById(
        "h60-route-birthday-styles"
      )
    ) {
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "h60-route-birthday-styles";

    style.textContent = `

      /* =================================
         ROUTE · DAY 05 · BIRTHDAY
         ================================= */

      .day-world.h60-route-birthday{
        position:relative;
        isolation:isolate;

        border-color:
          rgba(
            194,
            111,
            255,
            .70
          ) !important;

        background:
          radial-gradient(
            circle at 92% 0%,
            rgba(
              255,
              203,
              126,
              .10
            ),
            transparent 25%
          ),
          radial-gradient(
            circle at 7% 20%,
            rgba(
              255,
              87,
              183,
              .09
            ),
            transparent 26%
          ),
          linear-gradient(
            135deg,
            rgba(
              31,
              13,
              42,
              .97
            ),
            rgba(
              12,
              6,
              21,
              .98
            )
          ) !important;

        box-shadow:
          0 0 0 1px
          rgba(
            255,
            205,
            135,
            .055
          ),
          0 24px 90px
          rgba(
            112,
            45,
            181,
            .23
          ) !important;
      }

      .day-world.h60-route-birthday:before{
        opacity:1 !important;

        height:2px !important;

        background:
          linear-gradient(
            90deg,
            transparent,
            #a85fff 20%,
            #ff66b7 52%,
            #ffd284 78%,
            transparent
          ) !important;

        box-shadow:
          0 0 20px
          rgba(
            197,
            105,
            255,
            .4
          );
      }

      .h60-route-birthday
      .day-world-head{
        overflow:hidden;
        min-height:148px;
      }

      .h60-route-birthday
      .day-world-head:after{
        background:
          radial-gradient(
            circle at 80% 20%,
            rgba(
              169,
              88,
              255,
              .20
            ),
            transparent 31%
          ),
          radial-gradient(
            circle at 20% 80%,
            rgba(
              255,
              202,
              124,
              .07
            ),
            transparent 25%
          ) !important;
      }

      /* DAY 5 ORB */

      .h60-route-birthday
      .day-orb{
        position:relative;
        z-index:4;

        border-color:
          rgba(
            255,
            225,
            177,
            .46
          ) !important;

        background:
          radial-gradient(
            circle at 28% 20%,
            #fff1cb,
            #dfa44f 27%,
            #a45aff 61%,
            #3b1558 83%
          ) !important;

        box-shadow:
          0 0 0 7px
          rgba(
            177,
            90,
            255,
            .055
          ),
          0 14px 38px
          rgba(
            157,
            70,
            221,
            .32
          ) !important;

        transform:
          scale(1.06);
      }

      .h60-route-birthday
      .day-orb b{
        color:#fff !important;
        font-weight:500 !important;
      }

      .h60-route-birthday
      .day-orb small{
        color:
          rgba(
            255,
            243,
            221,
            .84
          ) !important;
      }

      /* BIRTHDAY LABEL */

      .h60-route-kicker{
        position:relative;
        z-index:5;

        display:inline-flex;
        align-items:center;
        gap:7px;

        margin-bottom:7px;

        padding:
          6px 10px;

        border:
          1px solid
          rgba(
            255,
            217,
            153,
            .24
          );

        border-radius:
          999px;

        background:
          rgba(
            107,
            45,
            137,
            .34
          );

        color:#ffd997;

        font:
          600 8px/1
          "Montserrat",
          sans-serif;

        letter-spacing:
          .12em;

        box-shadow:
          0 7px 25px
          rgba(
            0,
            0,
            0,
            .12
          );

        backdrop-filter:
          blur(10px);
      }

      .h60-route-birthday
      .day-world-title h3{
        position:relative;
        z-index:4;

        color:#fff8ff;

        font-size:
          clamp(
            23px,
            3vw,
            31px
          );

        text-shadow:
          0 0 30px
          rgba(
            194,
            111,
            255,
            .13
          );
      }

      .h60-route-birthday
      .day-head-meta{
        position:relative;
        z-index:4;
      }

      .h60-route-birthday
      .day-head-meta
      .mini-tag{
        border-color:
          rgba(
            224,
            179,
            255,
            .16
          );

        background:
          rgba(
            176,
            93,
            255,
            .07
          );
      }

      /* FLOATING BALLOONS */

      .h60-route-balloons{
        position:absolute;
        inset:0;

        z-index:2;

        pointer-events:none;
        overflow:hidden;
      }

      .h60-route-balloons i{
        position:absolute;

        width:29px;
        height:37px;

        border-radius:
          55% 55% 50% 50%;

        opacity:.72;

        animation:
          h60RouteFloat
          5s
          ease-in-out
          infinite;

        box-shadow:
          inset
          -5px -7px 10px
          rgba(
            0,
            0,
            0,
            .17
          );
      }

      .h60-route-balloons i:after{
        content:"";

        position:absolute;

        left:50%;
        top:35px;

        width:1px;
        height:62px;

        background:
          linear-gradient(
            rgba(
              246,
              225,
              255,
              .44
            ),
            transparent
          );
      }

      .h60-route-balloons .b1{
        left:5%;
        top:14px;

        background:
          linear-gradient(
            145deg,
            #d6a8ff,
            #7a3fd0
          );

        animation-delay:
          -.8s;
      }

      .h60-route-balloons .b2{
        left:8%;
        top:68px;

        width:24px;
        height:31px;

        background:
          linear-gradient(
            145deg,
            #ff9bce,
            #d34d99
          );

        animation-delay:
          -2.1s;
      }

      .h60-route-balloons .b3{
        left:12%;
        top:27px;

        width:21px;
        height:27px;

        background:
          linear-gradient(
            145deg,
            #ffe3a4,
            #ce9949
          );

        animation-delay:
          -1.4s;
      }

      @keyframes h60RouteFloat{

        0%,
        100%{
          transform:
            translateY(0)
            rotate(-2deg);
        }

        50%{
          transform:
            translateY(-8px)
            rotate(2deg);
        }
      }

      /* OPEN BIRTHDAY BANNER */

      .h60-route-birthday-strip{
        position:relative;
        overflow:hidden;

        display:grid;

        grid-template-columns:
          88px 1fr;

        gap:18px;
        align-items:center;

        min-height:125px;

        margin:
          0 0 16px;

        padding:
          18px 20px;

        border:
          1px solid
          rgba(
            226,
            190,
            255,
            .15
          );

        border-radius:16px;

        background:
          radial-gradient(
            circle at 90% 0,
            rgba(
              255,
              200,
              124,
              .10
            ),
            transparent 27%
          ),
          radial-gradient(
            circle at 10% 100%,
            rgba(
              255,
              91,
              181,
              .09
            ),
            transparent 28%
          ),
          linear-gradient(
            125deg,
            rgba(
              80,
              29,
              108,
              .25
            ),
            rgba(
              14,
              7,
              23,
              .58
            )
          );

        box-shadow:
          inset
          0 1px 0
          rgba(
            255,
            220,
            169,
            .045
          );
      }

      .h60-route-birthday-strip:before{
        content:"60";

        position:absolute;

        right:18px;
        top:-60px;

        color:transparent;

        -webkit-text-stroke:
          1px
          rgba(
            244,
            220,
            255,
            .055
          );

        font:
          500 italic
          200px/.8
          "Cormorant Garamond",
          serif;

        pointer-events:none;
      }

      .h60-route-60{
        position:relative;
        z-index:3;

        width:76px;
        height:76px;

        border-radius:50%;

        display:grid;
        place-content:center;

        text-align:center;

        border:
          1px solid
          rgba(
            255,
            230,
            184,
            .32
          );

        background:
          radial-gradient(
            circle at 30% 20%,
            #fff1cb,
            #daa14d 35%,
            #8d4bd0 68%,
            #25112e
          );

        box-shadow:
          0 12px 35px
          rgba(
            130,
            55,
            184,
            .28
          );
      }

      .h60-route-60 strong{
        font:
          600 30px/.75
          "Cormorant Garamond",
          serif;

        color:#fff;
      }

      .h60-route-60 small{
        margin-top:6px;

        color:#fff0d0;

        font:
          600 5px
          "Montserrat",
          sans-serif;

        letter-spacing:.10em;
      }

      .h60-route-strip-copy{
        position:relative;
        z-index:3;
      }

      .h60-route-strip-copy>small{
        display:block;

        color:#d4b1ec;

        font:
          600 7px
          "Montserrat",
          sans-serif;

        letter-spacing:.15em;
      }

      .h60-route-strip-copy>b{
        display:block;

        margin-top:3px;

        color:#fff8ff;

        font:
          500
          clamp(
            25px,
            3vw,
            39px
          )/.95
          "Cormorant Garamond",
          serif;
      }

      .h60-route-strip-copy>b em{
        color:#ffd286;
        font-style:italic;
      }

      .h60-route-strip-copy>span{
        display:block;

        margin-top:7px;

        color:#b8a9bf;
        font-size:11px;
      }

      .h60-route-strip-balloons{
        position:absolute;
        inset:0;

        pointer-events:none;
      }

      .h60-route-strip-balloons i{
        position:absolute;

        width:24px;
        height:31px;

        border-radius:
          55% 55% 50% 50%;

        opacity:.48;
      }

      .h60-route-strip-balloons i:nth-child(1){
        right:5%;
        top:12px;
        background:#9d56eb;
      }

      .h60-route-strip-balloons i:nth-child(2){
        right:8%;
        top:59px;
        background:#e85ba8;
      }

      .h60-route-strip-balloons i:nth-child(3){
        right:12%;
        top:24px;
        background:#d5a14f;
      }

      /* DAY JUMP BUTTON 5 */

      #dayJump
      .h60-birthday-jump{
        position:relative;

        overflow:visible;

        border-color:
          rgba(
            255,
            205,
            128,
            .55
          ) !important;

        background:
          linear-gradient(
            135deg,
            #7f43db,
            #bb57bf
          ) !important;

        color:#fff !important;

        box-shadow:
          0 6px 25px
          rgba(
            143,
            64,
            202,
            .24
          );
      }

      .h60-jump-cake{
        position:absolute;

        top:-9px;
        right:-7px;

        width:19px;
        height:19px;

        display:grid;
        place-items:center;

        border-radius:50%;

        background:#1a0b22;

        border:
          1px solid
          rgba(
            255,
            220,
            160,
            .28
          );

        font-size:10px;

        box-shadow:
          0 4px 12px
          rgba(
            0,
            0,
            0,
            .25
          );
      }

      /* MOBILE */

      @media(max-width:620px){

        .h60-route-birthday
        .day-world-head{
          min-height:132px;
        }

        .h60-route-kicker{
          font-size:6px;
          padding:5px 7px;
          letter-spacing:.08em;
        }

        .h60-route-balloons .b1{
          left:3px;
          top:5px;
        }

        .h60-route-balloons .b2{
          left:28px;
          top:66px;
        }

        .h60-route-balloons .b3{
          left:43px;
          top:19px;
        }

        .h60-route-birthday-strip{
          grid-template-columns:
            62px 1fr;

          gap:12px;

          padding:
            15px 13px;

          min-height:122px;
        }

        .h60-route-60{
          width:58px;
          height:58px;
        }

        .h60-route-60 strong{
          font-size:25px;
        }

        .h60-route-60 small{
          font-size:4px;
        }

        .h60-route-strip-copy>small{
          font-size:5.5px;
        }

        .h60-route-strip-copy>b{
          font-size:
            clamp(
              23px,
              8vw,
              31px
            );
        }

        .h60-route-strip-copy>span{
          font-size:9px;
          line-height:1.5;
        }
      }

      @media(
        prefers-reduced-motion:
        reduce
      ){

        .h60-route-balloons i{
          animation:none;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }
})();
