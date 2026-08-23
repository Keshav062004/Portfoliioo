<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const educationRef = ref<HTMLElement | null>(null);

let ctx: gsap.Context | null = null;

onMounted(() => {
  if (!educationRef.value) return;

  ctx = gsap.context(() => {
    const section = educationRef.value!;

    const eyebrow =
      section.querySelector<HTMLElement>(".education-eyebrow");

    const title =
      section.querySelector<HTMLElement>(".education-heading h2");

    const description =
      section.querySelector<HTMLElement>(".education-description");

    const cards =
      gsap.utils.toArray<HTMLElement>(".education-card");

    const dots =
      gsap.utils.toArray<HTMLElement>(".education-dot");

    const progress =
      section.querySelector<HTMLElement>(".education-line-progress");

    if (
      !eyebrow ||
      !title ||
      !description ||
      !cards.length ||
      !dots.length ||
      !progress
    ) {
      return;
    }

    /* =====================================================
       INITIAL STATES
    ===================================================== */

    gsap.set(eyebrow, {
      opacity: 0,
      y: 25,
    });

    gsap.set(title, {
      opacity: 0,
      y: 70,
      rotateX: -15,
      transformPerspective: 1000,
    });

    gsap.set(description, {
      opacity: 0,
      y: 30,
    });

    gsap.set(cards, {
      opacity: 0,
      x: 100,
      rotateY: -7,
      transformPerspective: 1200,
    });

    gsap.set(dots, {
      scale: 0,
      opacity: 0,
    });

    gsap.set(progress, {
      scaleY: 0,
      transformOrigin: "top center",
    });

    /* =====================================================
       HEADING ANIMATION
    ===================================================== */

    const headingTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 82%",
        end: "top 55%",
        scrub: 1,
      },
    });

    headingTimeline
      .to(eyebrow, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power3.out",
      })
      .to(
        title,
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          ease: "power4.out",
        },
        "-=0.15",
      )
      .to(
        description,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        },
        "-=0.25",
      );

    /* =====================================================
       EDUCATION TIMELINE
    ===================================================== */

    const educationTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".education-content",
        start: "top 78%",
        end: "bottom 55%",
        scrub: 1.1,
      },
    });

    /* Timeline draws */

    educationTimeline.to(
      progress,
      {
        scaleY: 1,
        duration: 1,
        ease: "none",
      },
      0,
    );

    /* Cards + dots */

    cards.forEach((card, index) => {
      const dot = dots[index];
      if (!dot) return;

      educationTimeline.to(
        dot,
        {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: "back.out(2)",
        },
        0.12 + index * 0.25,
      );

      educationTimeline.to(
        card,
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 0.55,
          ease: "power3.out",
        },
        0.15 + index * 0.22,
      );
    });

    /* =====================================================
       DOT GLOW
    ===================================================== */

    dots.forEach((dot) => {
      ScrollTrigger.create({
        trigger: dot,
        start: "top 65%",

        onEnter: () => {
          gsap.to(dot, {
            boxShadow:
              "0 0 0 7px rgba(255,138,0,0.12), 0 0 32px rgba(255,138,0,0.55)",
            duration: 0.45,
            ease: "power2.out",
          });
        },

        onLeaveBack: () => {
          gsap.to(dot, {
            boxShadow:
              "0 0 0 5px rgba(255,138,0,0.08), 0 0 18px rgba(255,138,0,0.25)",
            duration: 0.4,
          });
        },
      });
    });

    /* =====================================================
       CARD 3D HOVER
    ===================================================== */

    cards.forEach((card) => {
      const content =
        card.querySelector<HTMLElement>(".education-card-content");

      if (!content) return;

      const handleMouseMove = (event: MouseEvent) => {
        const rect = card.getBoundingClientRect();

        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const rotateY =
          ((mouseX / rect.width) - 0.5) * 5;

        const rotateX =
          ((mouseY / rect.height) - 0.5) * -5;

        gsap.to(content, {
          rotateX,
          rotateY,
          translateZ: 12,
          duration: 0.35,
          ease: "power2.out",
          overwrite: true,
        });
      };

      const handleMouseLeave = () => {
        gsap.to(content, {
          rotateX: 0,
          rotateY: 0,
          translateZ: 0,
          duration: 0.6,
          ease: "power3.out",
        });
      };

      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);

      onUnmounted(() => {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      });
    });

    /* =====================================================
       REFRESH
    ===================================================== */

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }, educationRef.value);
});

onUnmounted(() => {
  ctx?.revert();
  ctx = null;
});
</script>

<template>
  <section
    ref="educationRef"
    id="education"
    class="education"
  >
    <!-- =================================================
         LEFT SIDE
    ================================================= -->

    <div class="education-intro">
      <p class="education-eyebrow">
        MY ACADEMIC JOURNEY
      </p>

      <div class="education-heading">
        <h2>
          Education<span>.</span>
        </h2>
      </div>

      <div class="education-accent"></div>

      <p class="education-description">
        My academic journey that built the foundation
        of my knowledge, technical skills, and
        problem-solving abilities.
      </p>

      <div class="education-visual">
        <div class="education-cap">
          <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 27L32 14L56 27L32 40L8 27Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round"
            />

            <path
              d="M17 32V44C17 44 24 51 32 51C40 51 47 44 47 44V32"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />

            <path
              d="M56 27V41"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />

            <circle
              cx="56"
              cy="44"
              r="3"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- =================================================
         RIGHT SIDE
    ================================================= -->

    <div class="education-content">

      <!-- TIMELINE -->

      <div class="education-line">
        <div class="education-line-base"></div>

        <div class="education-line-progress"></div>
      </div>

      <!-- =================================================
           B.TECH
      ================================================= -->

      <article class="education-item">
        <div class="education-dot"></div>

        <div class="education-card">
          <div class="education-card-glow"></div>

          <div class="education-card-content">

            <div class="education-card-top">

              <div class="education-card-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 7L12 3L21 7L12 11L3 7Z"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linejoin="round"
                  />

                  <path
                    d="M6 9V14C6 14 8.5 17 12 17C15.5 17 18 14 18 14V9"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />

                  <path
                    d="M21 7V14"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />
                </svg>
              </div>

              <div class="education-card-heading">
                <h3>
                  B.Tech, Computer Science Engineering
                </h3>

                <h4>
                  Chitkara University, Punjab
                </h4>
              </div>

            </div>

            <div class="education-card-footer">

              <span class="education-date">
                Sep 2022 — Aug 2026
              </span>

              <span class="education-cgpa">
                CGPA: 8.0
              </span>

            </div>

          </div>
        </div>
      </article>

      <!-- =================================================
           12TH
      ================================================= -->

      <article class="education-item">
        <div class="education-dot"></div>

        <div class="education-card">
          <div class="education-card-glow"></div>

          <div class="education-card-content">

            <div class="education-card-top">

              <div class="education-card-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 19H20"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />

                  <path
                    d="M6 19V8L12 5L18 8V19"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linejoin="round"
                  />

                  <path
                    d="M9 19V13H15V19"
                    stroke="currentColor"
                    stroke-width="1.8"
                  />
                </svg>
              </div>

              <div class="education-card-heading">
                <h3>
                  12th Grade
                </h3>

                <h4>
                  DAV Century Public School
                </h4>

                <p>
                  Panipat, Haryana
                </p>
              </div>

            </div>

            <div class="education-card-footer">

              <span class="education-date">
                2022
              </span>

            </div>

          </div>
        </div>
      </article>

      <!-- =================================================
           10TH
      ================================================= -->

      <article class="education-item">
        <div class="education-dot"></div>

        <div class="education-card">
          <div class="education-card-glow"></div>

          <div class="education-card-content">

            <div class="education-card-top">

              <div class="education-card-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 19H20"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />

                  <path
                    d="M6 19V8L12 5L18 8V19"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linejoin="round"
                  />

                  <path
                    d="M9 19V13H15V19"
                    stroke="currentColor"
                    stroke-width="1.8"
                  />
                </svg>
              </div>

              <div class="education-card-heading">
                <h3>
                  10th Grade
                </h3>

                <h4>
                  DAV Century Public School
                </h4>

                <p>
                  Panipat, Haryana
                </p>
              </div>

            </div>

            <div class="education-card-footer">

              <span class="education-date">
                2020
              </span>

            </div>

          </div>
        </div>
      </article>

    </div>
  </section>
</template>

<style scoped lang="scss">

/* =====================================================
   EDUCATION SECTION
===================================================== */

.education {
  position: relative;

  width: 100%;

  min-height: 850px;

  padding:
    150px
    var(--space-outer)
    170px;

  display: grid;

  grid-template-columns:
    minmax(280px, 0.7fr)
    minmax(0, 1.3fr);

  column-gap: 90px;

  background:
    var(
      --color-background-300,
      #f5efe5
    );

  overflow: hidden;
}


/* =====================================================
   LEFT INTRO
===================================================== */

.education-intro {
  position: relative;

  padding-top: 30px;

  z-index: 2;
}

.education-eyebrow {
  margin: 0 0 14px;

  font-size: 0.82rem;

  font-weight: 700;

  letter-spacing: 0.18em;

  text-transform: uppercase;

  color:
    rgba(45, 42, 38, 0.5);
}

.education-heading h2 {
  margin: 0;

  font-size:
    clamp(
      4rem,
      7vw,
      7rem
    );

  line-height: 0.9;

  font-weight: 800;

  letter-spacing: -0.055em;

  color: #292622;

  transform-style: preserve-3d;
}

.education-heading h2 span {
  color: #ff8a00;
}

.education-accent {
  width: 55px;

  height: 3px;

  margin:
    30px 0;

  background: #ff8a00;

  border-radius: 10px;

  box-shadow:
    0 0 15px
    rgba(255, 138, 0, 0.35);
}

.education-description {
  max-width: 340px;

  margin: 0;

  font-size: 1rem;

  line-height: 1.7;

  color:
    rgba(45, 42, 38, 0.68);
}


/* =====================================================
   EDUCATION VISUAL
===================================================== */

.education-visual {
  margin-top: 70px;

  opacity: 0.12;
}

.education-cap {
  width: 170px;

  height: 170px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  border:
    1px solid
    rgba(45, 42, 38, 0.25);

  color: #292622;

  transform: rotate(-8deg);
}

.education-cap svg {
  width: 110px;

  height: 110px;
}


/* =====================================================
   RIGHT CONTENT
===================================================== */

.education-content {
  position: relative;

  width: 100%;

  padding:
    10px
    0
    30px;
}


/* =====================================================
   TIMELINE
===================================================== */

.education-line {
  position: absolute;

  left: 0;

  top: 0;

  bottom: 0;

  width: 3px;

  transform:
    translateX(-50%);

  z-index: 1;
}

.education-line-base {
  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      to bottom,
      transparent,
      rgba(42, 39, 35, 0.18) 8%,
      rgba(42, 39, 35, 0.22) 50%,
      rgba(42, 39, 35, 0.12) 92%,
      transparent
    );
}

.education-line-progress {
  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;

  background:
    linear-gradient(
      to bottom,
      #ff8a00,
      #ff9d24,
      rgba(255, 138, 0, 0.08)
    );

  transform:
    scaleY(0);

  transform-origin:
    top center;

  box-shadow:
    0 0 15px
    rgba(255, 138, 0, 0.4);
}


/* =====================================================
   EDUCATION ITEM
===================================================== */

.education-item {
  position: relative;

  padding-left: 45px;

  margin-bottom: 35px;

  z-index: 2;
}

.education-item:last-child {
  margin-bottom: 0;
}


/* =====================================================
   DOT
===================================================== */

.education-dot {
  position: absolute;

  left: 0;

  top: 35px;

  width: 20px;

  height: 20px;

  transform:
    translateX(-50%);

  border-radius: 50%;

  background: #ff8a00;

  border:
    5px solid
    rgba(255, 255, 255, 0.95);

  box-shadow:
    0 0 0 6px
    rgba(255, 138, 0, 0.08),

    0 0 22px
    rgba(255, 138, 0, 0.35);

  z-index: 5;
}


/* =====================================================
   CARD
===================================================== */

.education-card {
  position: relative;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  padding: 32px;
  border-radius: 22px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.97), rgba(248, 242, 232, 0.9));
  border: 1px solid rgba(42, 39, 35, 0.08);
  box-shadow:
    0 20px 42px rgba(42, 39, 35, 0.11),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  overflow: hidden;
  will-change: transform;
  transition: transform 0.45s ease, box-shadow 0.45s ease;
}

.education-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 138, 0, 0.08), transparent 48%);
  pointer-events: none;
}

.education-card::after {
  content: "";
  position: absolute;
  width: 180px;
  height: 180px;
  top: -90px;
  right: -70px;
  border-radius: 50%;
  background: rgba(255, 138, 0, 0.14);
  filter: blur(28px);
  opacity: 0.7;
  pointer-events: none;
  transition: transform 0.6s ease, opacity 0.6s ease;
}

.education-card:hover {
  transform: translateY(-6px) rotateX(1deg) rotateY(-1deg);
  box-shadow:
    0 26px 52px rgba(42, 39, 35, 0.16),
    0 0 0 1px rgba(255, 138, 0, 0.12);
}

.education-card:hover::after {
  transform: translate(-24px, 24px) scale(1.15);
  opacity: 0.95;
}

.education-card-content {
  position: relative;

  z-index: 2;

  transform-style:
    preserve-3d;

  will-change:
    transform;
}


/* =====================================================
   CARD TOP
===================================================== */

.education-card-top {
  display: flex;

  align-items: flex-start;

  gap: 17px;
}

.education-card-icon {
  flex:
    0 0 auto;

  width: 48px;

  height: 48px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 14px;

  color: #ff8a00;

  background:
    rgba(255, 138, 0, 0.08);

  box-shadow:
    inset 0 0 0 1px
    rgba(255, 138, 0, 0.12),

    0 10px 25px
    rgba(255, 138, 0, 0.07);
}

.education-card-icon svg {
  width: 25px;

  height: 25px;
}


/* =====================================================
   TEXT
===================================================== */

.education-card-heading h3 {
  margin: 0;

  font-size:
    clamp(
      1.15rem,
      1.7vw,
      1.5rem
    );

  line-height: 1.25;

  font-weight: 800;

  color: #292622;
}

.education-card-heading h4 {
  margin:
    7px 0 2px;

  font-size: 1rem;

  font-weight: 700;

  color: #393530;
}

.education-card-heading p {
  margin: 0;

  font-size: 0.9rem;

  color:
    rgba(45, 42, 38, 0.52);
}


/* =====================================================
   CARD FOOTER
===================================================== */

.education-card-footer {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  margin-top: 24px;

  padding-top: 18px;

  border-top:
    1px solid
    rgba(42, 39, 35, 0.1);
}

.education-date {
  font-size: 0.85rem;

  font-weight: 800;

  letter-spacing: 0.03em;

  color:
    rgba(45, 42, 38, 0.68);
}

.education-cgpa {
  padding:
    7px 12px;

  border-radius: 100px;

  font-size: 0.78rem;

  font-weight: 800;

  color: #ff8a00;

  background:
    rgba(255, 138, 0, 0.09);

  border:
    1px solid
    rgba(255, 138, 0, 0.18);

  box-shadow:
    0 5px 15px
    rgba(255, 138, 0, 0.08);
}


/* =====================================================
   TABLET
===================================================== */

@media (max-width: 1100px) {

  .education {
    padding-left: 40px;

    padding-right: 40px;

    column-gap: 55px;
  }

  .education-heading h2 {
    font-size:
      clamp(
        3.5rem,
        7vw,
        6rem
      );
  }

  .education-card {
    padding: 26px;
  }

}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 700px) {

  .education {
    display: block;

    min-height: auto;

    padding:
      90px
      20px
      120px;
  }

  .education-intro {
    padding-top: 0;

    margin-bottom: 65px;
  }

  .education-eyebrow {
    font-size: 0.72rem;
  }

  .education-heading h2 {
    font-size:
      clamp(
        3.2rem,
        15vw,
        5rem
      );
  }

  .education-description {
    max-width: 100%;

    font-size: 0.95rem;
  }

  .education-visual {
    display: none;
  }

  .education-content {
    padding: 0;

    padding-left: 25px;
  }

  .education-line {
    left: 5px;

    width: 2px;
  }

  .education-item {
    padding-left: 25px;

    margin-bottom: 25px;
  }

  .education-dot {
    left: -17px;

    width: 17px;

    height: 17px;

    border-width: 4px;

    top: 28px;
  }

  .education-card {
    padding:
      23px
      20px;

    border-radius: 18px;
  }

  .education-card-top {
    gap: 12px;
  }

  .education-card-icon {
    width: 42px;

    height: 42px;

    border-radius: 11px;
  }

  .education-card-icon svg {
    width: 22px;

    height: 22px;
  }

  .education-card-heading h3 {
    font-size: 1.1rem;
  }

  .education-card-heading h4 {
    font-size: 0.9rem;
  }

  .education-card-heading p {
    font-size: 0.82rem;
  }

  .education-card-footer {
    margin-top: 18px;

    padding-top: 14px;
  }

  .education-date {
    font-size: 0.75rem;
  }

  .education-cgpa {
    font-size: 0.7rem;

    padding:
      6px 9px;
  }

}


/* =====================================================
   SMALL MOBILE
===================================================== */

@media (max-width: 420px) {

  .education {
    padding-left: 15px;

    padding-right: 15px;
  }

  .education-content {
    padding-left: 22px;
  }

  .education-item {
    padding-left: 20px;
  }

  .education-card {
    padding:
      20px
      17px;
  }

  .education-card-heading h3 {
    font-size: 1rem;
  }

  .education-card-heading h4 {
    font-size: 0.82rem;
  }

  .education-card-footer {
    flex-wrap: wrap;
  }

}
</style>
