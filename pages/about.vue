<template>
  <div id="about-page" class="page-wrapper about-page content-page">
    <site-hero
      title="About Me"
      subtitle="Sylvester Carolan"
      image="/uploads/about-hero.jpg"
    ></site-hero>
    <main-section theme="sidebar-right">
      <template #default>
        <div class="content">
          <quote-card />
          <h3>Bio</h3>
          <p>
            Born and raised in London, I moved to the New York in 1993 where I
            met my future wife Lia. We have an awesome, 8th grader, Jaiden, who
            keeps me laughing and loving life. I call Raleigh, North Carolina
            home.
          </p>
          <p>
            Professionally: I'm a solutions engineer and architect — 20+ years
            building regulated, high-concurrency data platforms, most recently a
            production-grade auditable-LLM civic platform. I build the bridge
            between legacy systems and modern AI delivery: LLM extraction that
            feeds code-computed decisions, every claim cited to a source, every
            output reproducible and audit-trailed.
          </p>

          <h3>Why this site?</h3>
          <p>
            I've been a software engineer all my life and wanted to have a place
            where I could experiment with different technology and interests. I
            didn’t really build the site for anyone accept me, so if by chance
            you do find something interesting, or inspiring, let me know.
          </p>

          <h3>What's on the site?</h3>
          <strong>Technology</strong>
          <p>
            Since high school, I have always been drawn to mathematics. I love
            the way it describes the world in both its simplicity, and
            complexity. Mathematics was the springboard for computer science for
            me, from my very first ZX81. You’re bound to come across multiple
            articles, references and links to all things technical. Creativity.
            Building user interfaces led me to animation, design, UI and UX.
            This led to a number of years studying, Motion graphics, Cinema 4D
            and movie making. Eventually I would come full circle, back to
            JavaScript and some of the 3D animation tools and libraries.
          </p>

          <strong>Work Experience</strong>
          <p>
            Twenty-plus years building regulated, high-concurrency data
            platforms — front-to-back trading systems, resilience infrastructure
            for thousands of enterprise applications, and most recently a
            production-grade civic AI platform.
          </p>
          <ul>
            <li>
              <strong>Clued In Democracy (Founder, Principal Engineer):</strong>
              built and operate a grounded-LLM pipeline that turns messy public
              records into verified, deterministic assessments — every claim
              cited to a primary source, scores computed by code (never trusted
              to the model), cross-model verification, human review gates, and
              1,500+ tests.
            </li>
            <li>
              <strong>Wells Fargo (Engineering Lead):</strong> resilience and
              automated-failover infrastructure for 5,000+ enterprise
              applications; governance, security, and observability standards
              for regulated pipelines; led organization-wide adoption of an
              enterprise orchestration platform.
            </li>
            <li>
              <strong>Credit Suisse (SVP &amp; Regional Tech Lead):</strong>
              directed engineering for a high-frequency transaction engine and
              its migration from monolithic legacy code to distributed
              microservices; built and led global teams up to 200+ engineers.
            </li>
          </ul>
          <p>
            <strong>Toolbox:</strong> Go · Python · SQL · PostgreSQL at scale ·
            Kubernetes (Talos, GKE) · LLM orchestration · event-driven
            architectures.
          </p>
          <strong>Politics and Life</strong>
          <p>
            I often to ask myself, “How are you going to change the world
            today?” More on this later.
          </p>
        </div>

        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <article class="tile is-child box">
              <p class="title">Technology</p>
              <p class="subtitle">Science, Mathematics and Computing</p>
              <figure class="image is-1by1">
                <NuxtImg
                  src="/uploads/technology.jpg"
                  width="500"
                  height="500"
                />
              </figure>
            </article>
          </div>
          <div class="tile is-parent">
            <article class="tile is-child box">
              <p class="title">Art and Creativity</p>
              <p class="subtitle">
                Animation, Motion graphics and maybe a little story telling
              </p>
              <figure class="image is-1by1"></figure>
            </article>
          </div>
          <div class="tile is-parent">
            <article class="tile is-child box">
              <p class="title">Politics and Life</p>
              <p class="subtitle">with a little work experience thrown in</p>
              <figure class="image is-1by1"></figure>
            </article>
          </div>
        </div>
      </template>

      <template #sidebar>
        <h3 class="subtitle is-4">Latest Posts</h3>
        <posts-grid :per-row="1" :number="2" />
      </template>
    </main-section>
  </div>
</template>
<script setup>
const { $siteConfig } = useNuxtApp()
useHead({ title: `About | ${$siteConfig.siteName}` })
</script>
