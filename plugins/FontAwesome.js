import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faTimes,
  faSearch,
  faEnvelope,
  faUser,
  faBriefcase,
} from '@fortawesome/free-solid-svg-icons'

library.add(faTimes, faSearch, faEnvelope, faUser, faBriefcase)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})
