<template>
  <div id="contact-page" class="page-wrapper contact-page content-page">
    <site-hero
      title="Contact Me"
      subtitle="Drop me a note"
      image="/uploads/contact-hero.jpg"
    ></site-hero>
    <main-section theme="sidebar-right">
      <template #default>
        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <article class="tile is-child box">
              <p class="title">Hi!</p>
              <p class="subtitle">Just say hello!</p>
              <figure class="image is-1by1">
                <NuxtImg
                  src="/uploads/meLia&Jaiden.jpg"
                  alt="Illustration of a person waving hello"
                />
              </figure>
            </article>
          </div>
          <div class="tile is-parent is-8">
            <article class="tile is-child box">
              <div class="content">
                <p class="title is-4">Email me</p>
                <p>
                  The best way to reach me is by email. I read everything and
                  reply as soon as I can. Dont' be shy!
                </p>
                <p class="is-size-4">
                  <a href="mailto:sylvester.carolan@cluedindemocracy.ai">
                    sylvester.carolan@cluedindemocracy.ai
                  </a>
                </p>
              </div>
            </article>
          </div>
        </div>
      </template>
      <template #sidebar>
        <h3 class="subtitle is-4">Latest Posts</h3>
        <!-- Latest Posts -->
        <posts-grid :per-row="1" :number="2" />
      </template>
    </main-section>
  </div>
</template>
<script setup>
usePageMeta({
  title: 'Contact Me',
  subtitle: 'Drop me a note',
  image: '/uploads/contact-hero.jpg',
})
</script>
