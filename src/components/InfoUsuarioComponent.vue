<template>
  <div class="info-usuario-page">
    <h2>Información de Usuario</h2>
    <p><strong>Nombre:</strong> {{ usuario.nombre }}</p>
    <p><strong>Email:</strong> {{ usuario.email }}</p>
    <button @click="$router.back()" class="btn">Volver</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      usuario: JSON.parse(localStorage.getItem('auth')) || { nombre: 'Desconocido', email: '' },
    }
  },
};
</script>

<style scoped>
.info-usuario-page {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  color: #2e3a59;
  text-align: center;
  user-select: none;
}
.btn {
  margin-top: 1.5rem;
  padding: 0.6rem 1.2rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  transition: background-color 0.3s ease;
}
.btn:hover {
  background-color: #0056b3;
}
</style>
