<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h2>Registro</h2>
      <p class="subtitle">Crea tu cuenta para comenzar</p>

      <form @submit.prevent="registerUser" class="login-form">
        <div class="input-group">
          <span class="icon">👤</span>
          <input v-model="nombre" type="text" placeholder="Nombre completo" required />
        </div>

        <div class="input-group">
          <span class="icon">@</span>
          <input v-model="email" type="email" placeholder="Correo electrónico" required />
        </div>

        <div class="input-group">
          <span class="icon">🔒</span>
          <input v-model="password" type="password" placeholder="Contraseña (mín. 6 caracteres)" required />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Registrando...' : 'Registrarse' }}
        </button>
      </form>

      <p v-if="error" class="error-msg">{{ error }}</p>
      <p v-if="success" class="success-msg">{{ success }}</p>

      <p class="register-msg">
        ¿Ya tienes cuenta?
        <router-link to="/login" class="register-link">Inicia sesión</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nombre = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

async function registerUser() {
  error.value = ''
  success.value = ''

  if (password.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres.'
    return
  }

  loading.value = true
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombre.value, email: email.value, password: password.value })
    })
    const data = await res.json()
    if (data.success) {
      success.value = 'Registro exitoso. Revisa tu correo para verificar tu cuenta.'
      nombre.value = ''
      email.value = ''
      password.value = ''
      setTimeout(() => router.push('/login'), 4000)
    } else {
      error.value = data.error || 'Error desconocido en el registro.'
    }
  } catch (e) {
    error.value = 'Error al conectar con el servidor.'
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
  width: 350px;
  max-width: 100%;
  text-align: center;
  color: #333;
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
  gap: 1.4rem;
}

.input-group {
  position: relative;
  width: 80%;
}

.input-group .icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.3rem;
  color: #ff416c;
  user-select: none;
}

.input-group input {
  width: 100%;
  padding: 0.9rem 1.4rem 0.9rem 3.2rem; /* padding left para espacio del icono */
  font-size: 1.05rem;
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
}

.input-group input:focus {
  border-color: #ff416c;
  box-shadow: 0 0 8px 2px #ff416c66;
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
}

button[type="submit"]:hover:not(:disabled) {
  box-shadow: 0 10px 30px rgba(255, 65, 65, 0.85);
  transform: translateY(-4px);
}

button[type="submit"]:disabled {
  background: #f5a6a6;
  box-shadow: none;
  cursor: not-allowed;
}

.error-msg {
  margin-top: 2rem;
  color: #ff4141;
  font-weight: 700;
  font-size: 1.1rem;
  text-shadow: 0 0 8px #ff4141cc;
}

.success-msg {
  margin-top: 2rem;
  color: #2ecc71;
  font-weight: 700;
  font-size: 1.1rem;
  text-shadow: 0 0 8px #2ecc71cc;
}

.register-msg {
  margin-top: 3rem;
  font-size: 1.1rem;
  color: #ff416c;
  font-weight: 600;
}

.register-link {
  color: #ff4b2b;
  font-weight: 700;
  text-decoration: none;
  margin-left: 0.3rem;
}

.register-link:hover {
  color: #ff1e00;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 480px) {
  .login-card {
    padding: 2.5rem 2rem 3rem;
    width: 100%;
    border-radius: 20px;
  }

  h2 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .login-form {
    gap: 1rem;
  }

  .input-group input {
    font-size: 1rem;
    padding: 0.7rem 1rem 0.7rem 3rem;
  }

  button[type="submit"] {
    font-size: 1.15rem;
    padding: 1rem 0;
  }
}
</style>
