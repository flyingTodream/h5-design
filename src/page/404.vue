<template>
  <div>
    <VxHead />
    <div class="wscn-http404-container">
      <div class="wscn-http404">
        <div class="pic-404">
          <img class="pic-404__parent" src="@/assets/image/404.png" alt="404" />
          <img class="pic-404__child left" src="@/assets/image/404_cloud.png" alt="404" />
          <img class="pic-404__child mid" src="@/assets/image/404_cloud.png" alt="404" />
          <img class="pic-404__child right" src="@/assets/image/404_cloud.png" alt="404" />
        </div>
        <div class="bullshit">
          <div class="bullshit__oops">OOPS!</div>
          <div class="bullshit__headline">{{ message }}</div>
          <div
            class="bullshit__info"
          >Please check that the URL you entered is correct, or click the button below to return to the homepage.</div>
          <a href class="bullshit__return-home">
            <router-link class="bullshit__return-home" to="/">Back to home</router-link>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const VxHead = () => import('./head')
export default {
  name: 'vx-404',
  components: {
    VxHead,
  },
  computed: {
    message() {
      return 'The webmaster said that you can not enter this page...'
    },
  },
}
</script>
