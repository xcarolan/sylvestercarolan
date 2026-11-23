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
            Born and raised in London, I moved to New York in 1993, where I met
            my future wife, Lia. We have an awesome daughter, Jaiden, who
            keeps me laughing and loving life. These days I call Raleigh, North
            Carolina home.
          </p>
          <p>
            Professionally, I'm a solutions engineer and architect. I build the
            bridge between legacy systems and modern AI delivery: LLM extraction
            that feeds code-computed decisions, every claim cited to a source,
            every output reproducible and audit-trailed.
          </p>

          <h3>Why This Site?</h3>
          <p>
            I simply wanted a place where I could experiment with different
            technologies and interests. I didn't really build it for anyone
            except me, so if you do find something interesting or inspiring, let
            me know.
          </p>

          <h3>What You'll Find Here</h3>

          <h4>Technology</h4>
          <p>
            Ever since high school, I've been drawn to mathematics. I love the
            way it describes the world in both its simplicity and its
            complexity. Mathematics was my springboard into computer science,
            starting with my very first ZX81. You're bound to come across
            articles, references and links to all things technical.
          </p>

          <h4>Creativity</h4>
          <p>
            Building user interfaces led me to animation, design, UI and UX.
            That turned into several years studying motion graphics, Cinema 4D
            and filmmaking. Eventually I came full circle, back to JavaScript
            and the 3D animation tools and libraries built on it.
          </p>

          <h4>Politics and Life</h4>
          <p>
            How are you going to change the world? Find out more at
            <a href="https://restore-democracy.org">restore-democracy.org</a>.
          </p>

          <h3>Work Experience</h3>
          <p>
            Thirty-plus years building regulated, high-concurrency data
            platforms: front-to-back trading systems, resilience infrastructure
            for thousands of enterprise applications, and most recently a
            production-grade civic AI platform.
          </p>
          <ul>
            <li>
              <strong>CluedIn Democracy (Founder, Principal Engineer):</strong>
              Built and operate a grounded-LLM pipeline that turns messy public
              records into verified, deterministic assessments. Every claim is
              cited to a primary source, scores are computed by code (never
              trusted to the model), and the pipeline has cross-model
              verification, human review gates and 1,500+ tests.
            </li>
            <li>
              <strong>Wells Fargo (Engineering Director):</strong> Resilience
              and automated-failover infrastructure for 5,000+ enterprise
              applications; governance, security and observability standards for
              regulated pipelines; led organization-wide adoption of an
              enterprise orchestration platform.
            </li>
            <li>
              <strong>Credit Suisse (SVP &amp; Regional Tech Lead):</strong>
              Directed engineering for a high-frequency transaction engine and
              its migration from monolithic legacy code to distributed
              microservices; built and led global teams of up to 200+ engineers.
            </li>
          </ul>
          <p>
            <strong>Toolbox:</strong> Go · Python · SQL · PostgreSQL at scale ·
            Kubernetes (Talos, GKE) · LLM orchestration · event-driven
            architectures
          </p>
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
usePageMeta({
  title: 'About Me',
  subtitle: 'Sylvester Carolan',
  image: '/uploads/about-hero.jpg',
})
</script>
