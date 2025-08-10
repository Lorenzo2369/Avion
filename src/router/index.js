import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Historial from '../components/Historial.vue'
import Registro from '../components/Registro.vue'
import VerifyEmail from '../components/VerifyEmail.vue'

// Importa tus nuevos componentes para las rutas
import InfoUsuarioComponent from '../components/InfoUsuarioComponent.vue'
import ModificarVistaComponent from '../components/ModificarVistaComponent.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/home', name: 'Home', component: Home },
  { path: '/historial', name: 'Historial', component: Historial },
  { path: '/registro', name: 'Registro', component: Registro },
  { path: '/verify-email', name: 'VerifyEmail', component: VerifyEmail },
  { path: '/info-usuario', name: 'InfoUsuario', component: InfoUsuarioComponent },
  { path: '/modificar-vista', name: 'ModificarVista', component: ModificarVistaComponent },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authData = localStorage.getItem('auth')
  let isAuthenticated = false

  if (authData) {
    try {
      const user = JSON.parse(authData)
      isAuthenticated = user && typeof user.email === 'string' && user.email.length > 0
    } catch (error) {
      isAuthenticated = false
    }
  }

  if (
    to.name !== 'Login' &&
    to.name !== 'Registro' &&
    !isAuthenticated
  ) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
