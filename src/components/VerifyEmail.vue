<template>
  <div class="verify-email-container">
    <h2>Verificación de correo</h2>
    <p v-if="loading">Verificando tu cuenta, por favor espera...</p>
    <p v-if="success" class="success-msg">¡Cuenta verificada correctamente! Ya puedes iniciar sesión.</p>
    <p v-if="error" class="error-msg">{{ error }}</p>
    <router-link v-if="success || error" to="/login">Ir al inicio de sesión</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const loading = ref(false)
const success = ref(false)
const error = ref('')

onMounted(async () => {
  const token = route.query.token
  if (!token) {
    error.value = 'Token de verificación no proporcionado.'
    return
  }
  loading.value = true
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-email?token=${token}`)
    const data = await res.json()
    if (res.ok && data.success) {
      success.value = true
    } else {
      error.value = data.error || 'Error al verificar el correo.'
    }
  } catch (e) {
    error.value = 'Error de red, intenta de nuevo.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.verify-email-container {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  background: linear-gradient(135deg, #4b6cb7, #182848);
  border-radius: 20px;
  color: white;
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  user-select: none;
}

.success-msg {
  color: #4caf50;
  font-weight: 700;
  margin-bottom: 1rem;
}

.error-msg {
  color: #ff6b6b;
  font-weight: 700;
  margin-bottom: 1rem;
}

router-link {
  display: inline-block;
  margin-top: 1.5rem;
  color: #a1c4fd;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.3s ease;
}

router-link:hover {
  color: #63a4ff;
}

/* Media queries para móviles */
@media (max-width: 480px) {
  .verify-email-container {
    max-width: 90%;
    margin: 2rem auto;
    padding: 1.5rem;
    border-radius: 16px;
    font-size: 0.95rem;
  }

  h2 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1rem;
  }

  router-link {
    font-size: 1rem;
    margin-top: 1rem;
  }
}
</style>
