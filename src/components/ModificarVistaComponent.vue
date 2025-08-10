<template>
  <div :class="['modificar-vista', { 'tema-oscuro': temaOscuro }]">
    <h2>Modificar Vista</h2>
    <p>Actualmente el tema es: <strong>{{ temaOscuro ? 'Oscuro' : 'Claro' }}</strong></p>
    <button @click="toggleTema" class="btn-tema">
      Cambiar a modo {{ temaOscuro ? 'Claro' : 'Oscuro' }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'ModificarVistaComponent',
  data() {
    return {
      temaOscuro: false,
    }
  },
  mounted() {
    const temaGuardado = localStorage.getItem('temaOscuro')
    this.temaOscuro = temaGuardado === 'true'
    this.aplicarTema()
  },
  methods: {
    toggleTema() {
      this.temaOscuro = !this.temaOscuro
      localStorage.setItem('temaOscuro', this.temaOscuro)
      this.aplicarTema()
    },
    aplicarTema() {
      if (this.temaOscuro) {
        document.body.classList.add('tema-oscuro')
      } else {
        document.body.classList.remove('tema-oscuro')
      }
    },
  },
}
</script>

<style scoped>
.modificar-vista {
  max-width: 500px;
  margin: 3rem auto;
  padding: 2rem;
  background: #f5f7fa;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  color: #222;
  text-align: center;
  user-select: none;
}

.tema-oscuro {
  background: #121212;
  color: #eee;
}

.btn-tema {
  margin-top: 1.5rem;
  padding: 0.7rem 1.5rem;
  font-weight: bold;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-tema:hover {
  background-color: #0056b3;
}
</style>
