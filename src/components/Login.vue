<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h2>Bienvenido</h2>
      <p class="subtitle">Accede a tu cuenta para continuar</p>
      <form @submit.prevent="onLogin" class="login-form">
        <div class="input-group">
          <span class="icon">@</span>
          <input v-model="email" type="email" placeholder="Correo electrónico" required />
        </div>
        
        <div class="input-group password-group">
          <span class="icon">🔒</span>
          <input 
            :type="showPassword ? 'text' : 'password'" 
            v-model="password" 
            placeholder="Contraseña" 
            required 
          />
          <button type="button" class="toggle-pass" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'">
            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye-off"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5.523 0-10-5.373-10-7 0-1.112 1.627-3.96 4.366-5.73M1 1l18 18"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Cargando...' : 'Entrar' }}
        </button>
      </form>

      <p v-if="error" class="error-msg">{{ error }}</p>

      <p class="register-msg">
        ¿No tienes cuenta?
        <router-link to="/registro" class="register-link">Regístrate aquí</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)

async function onLogin() {
  error.value = ''
  loading.value = true

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    const data = await res.json()

    if (res.ok && data.success) {
      localStorage.setItem('auth', JSON.stringify(data.user))
      router.push('/home')
    } else {
      error.value = data.error || 'Email o contraseña incorrectos.'
    }
  } catch (e) {
    error.value = 'Error en el servidor, intente luego.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(-45deg, #ff416c, #ff4b2b, #1fa2ff, #12d8fa);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  padding: 1rem;
  font-family: 'Poppins', sans-serif;
}

@keyframes gradientBG {
  0% {background-position: 0% 50%;}
  50% {background-position: 100% 50%;}
  100% {background-position: 0% 50%;}
}

.login-card {
  background: #fff;
  border-radius: 30px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.25);
  padding: 3.5rem 3rem 4rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
  color: #333;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.login-card:hover {
  transform: translateY(-8px);
}

h2 {
  font-weight: 800;
  font-size: 2.7rem;
  margin-bottom: 0.4rem;
  color: #ff416c;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-shadow: 0 2px 6px #ff4b2b;
}

.subtitle {
  font-weight: 500;
  font-size: 1.1rem;
  margin-bottom: 2.4rem;
  color: #555;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  align-items: center;
  width: 100%;
}

.input-group {
  position: relative;
  width: 100%;
  max-width: 320px;
}

.input-group .icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.3rem;
  color: #ff416c;
  user-select: none;
  pointer-events: none;
}

.input-group input {
  width: 100%;
  padding: 1rem 3.5rem 1rem 3rem; /* espacio para icono a la izquierda */
  font-size: 1.15rem;
  border-radius: 18px;
  border: 2px solid #ddd;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: inset 0 1px 5px rgba(0,0,0,0.05);
  font-weight: 600;
  color: #444;
}

.input-group input::placeholder {
  color: #bbb;
  font-weight: 400;
}

.input-group input:focus {
  border-color: #ff416c;
  box-shadow: 0 0 8px 2px #ff416c66;
}

.password-group {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  max-width: 320px;
}

.password-group input {
  padding-right: 3.5rem;
  padding-left: 3rem; /* espacio para icono */
}

.toggle-pass {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff416c;
  transition: color 0.3s ease;
  user-select: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.toggle-pass:hover {
  color: #ff4b2b;
  filter: drop-shadow(0 0 3px #ff4b2b);
}

button[type="submit"] {
  background: linear-gradient(45deg, #ff416c, #ff4b2b);
  color: white;
  font-weight: 800;
  font-size: 1.3rem;
  padding: 1.1rem 0;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(255, 75, 43, 0.6);
  transition: box-shadow 0.35s ease, transform 0.3s ease;
  user-select: none;
  width: 100%;
  max-width: 320px;
}

button[type="submit"]:hover:not(:disabled) {
  box-shadow: 0 10px 30px rgba(255, 65, 65, 0.85);
  transform: translateY(-4px);
}

button[type="submit"]:disabled {
  background: #f5a6a6;
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
}

.error-msg {
  margin-top: 2rem;
  color: #ff4141;
  font-weight: 700;
  font-size: 1.1rem;
  text-shadow: 0 0 8px #ff4141cc;
  user-select: none;
}

.register-msg {
  margin-top: 3rem;
  font-size: 1.1rem;
  color: #ff416c;
  font-weight: 600;
  user-select: none;
}

.register-link {
  color: #ff4b2b;
  font-weight: 700;
  text-decoration: none;
  margin-left: 0.3rem;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: #ff1e00;
  text-decoration: underline;
}

/* Responsive */

@media (max-width: 480px) {
  .login-card {
    padding: 2.5rem 1.5rem 3rem;
    width: 100%;
    border-radius: 20px;
  }

  h2 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .input-group, .password-group {
    max-width: 100%;
  }

  .input-group input, .password-group input {
    font-size: 1rem;
    padding: 0.85rem 3rem 0.85rem 3rem;
  }

  button[type="submit"] {
    font-size: 1.15rem;
    padding: 1rem 0;
    max-width: 100%;
  }
}
</style>
