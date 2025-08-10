<template>
  <div class="historial-container">
    <h2>📸 Historial de Imágenes Tomadas</h2>

    <p v-if="!historial.length" class="sin-registros">
      No hay registros aún. Toma una foto desde el panel principal para empezar.
    </p>

    <table v-if="historial.length" class="historial-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Coordenadas</th>
          <th>Fecha</th>
          <th>Usuario</th>
          <th>Imagen</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in historial" :key="index">
          <td data-label="ID">{{ index + 1 }}</td>
          <td data-label="Coordenadas">{{ formatCoordenadas(item.lat, item.lng) }}</td>
          <td data-label="Fecha">{{ formatearFecha(item.fecha) }}</td>
          <td data-label="Usuario">{{ item.usuario || 'Desconocido' }}</td>
          <td data-label="Imagen">
            <img :src="item.foto" alt="Foto" class="miniatura" />
          </td>
          <td data-label="Acciones" class="acciones">
            <button @click="eliminarRegistro(index)" class="btn-eliminar" title="Eliminar registro">🗑️</button>
            <a :href="item.foto" target="_blank" rel="noopener" class="ver-btn">Ver</a>
            <button @click="descargarImagen(item.foto)" class="btn-descargar" title="Descargar imagen">⬇️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <router-link :to="{ name: 'Home' }" class="volver-btn">🔙 Volver al panel</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const historial = ref([])

onMounted(() => {
  // Cargar historial desde localStorage
  const datos = localStorage.getItem('historialFotos')
  if (datos) {
    try {
      historial.value = JSON.parse(datos)
    } catch (e) {
      historial.value = []
      console.error('Error al parsear historialFotos:', e)
    }
  }
})

function eliminarRegistro(index) {
  if (confirm('¿Seguro que quieres eliminar este registro?')) {
    historial.value.splice(index, 1)
    localStorage.setItem('historialFotos', JSON.stringify(historial.value))
  }
}

function descargarImagen(url) {
  const link = document.createElement('a')
  link.href = url
  link.download = `foto_${new Date().toISOString()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function formatCoordenadas(lat, lng) {
  if (lat != null && lng != null) {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  }
  return '-'
}

function formatearFecha(fechaISO) {
  if (!fechaISO) return '-'
  const fecha = new Date(fechaISO)
  return fecha.toLocaleString()
}
</script>

<style scoped>
.historial-container {
  max-width: 1000px;
  margin: 3rem auto;
  padding: 2rem;
  background: #f5f5f5;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #333;
}

.sin-registros {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.historial-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

.historial-table th,
.historial-table td {
  padding: 1rem;
  border: 1px solid #ddd;
  vertical-align: middle;
}

.historial-table th {
  background-color: #0072ff;
  color: white;
  font-weight: bold;
}

.historial-table tr:nth-child(even) {
  background-color: #f0f8ff;
}

.miniatura {
  width: 80px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(0, 114, 255, 0.3);
}

.ver-btn,
.btn-eliminar,
.btn-descargar {
  background-color: #00c6ff;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 30px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  margin: 0 4px;
  font-size: 1rem;
  transition: 0.3s;
  user-select: none;
}

.btn-eliminar {
  background-color: #ff4d4d;
}

.btn-descargar {
  background-color: #32cd32;
}

.ver-btn:hover {
  background-color: #0096c7;
  transform: scale(1.05);
}

.btn-eliminar:hover {
  background-color: #cc0000;
  transform: scale(1.05);
}

.btn-descargar:hover {
  background-color: #228b22;
  transform: scale(1.05);
}

.volver-btn {
  display: inline-block;
  background: linear-gradient(135deg, #8e2de2, #4a00e0);
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 50px;
  font-weight: bold;
  text-decoration: none;
  box-shadow: 0 5px 20px rgba(138, 43, 226, 0.4);
  transition: all 0.3s ease;
}

.volver-btn:hover {
  transform: scale(1.1);
  background: linear-gradient(135deg, #7b2cbf, #3c096c);
}

/* Responsive para móviles */
@media (max-width: 600px) {
  .historial-table,
  .historial-table thead,
  .historial-table tbody,
  .historial-table th,
  .historial-table td,
  .historial-table tr {
    display: block;
    width: 100%;
  }

  .historial-table thead tr {
    display: none; /* ocultar encabezados en móvil */
  }

  .historial-table tr {
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #0072ff;
    padding-bottom: 10px;
  }

  .historial-table td {
    text-align: right;
    padding-left: 50%;
    position: relative;
    border: none;
    border-bottom: 1px solid #ddd;
  }

  .historial-table td::before {
    content: attr(data-label);
    position: absolute;
    left: 10px;
    width: 45%;
    padding-left: 15px;
    font-weight: bold;
    text-align: left;
    color: #0072ff;
  }

  .miniatura {
    width: 100%;
    height: auto;
    margin-bottom: 0.8rem;
  }

  .acciones {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
  }

  .btn-eliminar,
  .ver-btn,
  .btn-descargar {
    padding: 8px 12px;
    font-size: 1rem;
    margin: 0 4px;
    width: auto;
  }
}
</style>
