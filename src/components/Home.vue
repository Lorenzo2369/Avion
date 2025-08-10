<template>
  <div :class="['app-container', { 'dark-theme': temaOscuro }]">
    <!-- Cámara -->
    <section class="camera-section" ref="camaraContainer">
      <video
        v-if="usarCamaraLocal"
        ref="video"
        autoplay
        playsinline
        muted
        class="camera-video"
      ></video>
      <img
        v-else
        :src="urlCamara"
        alt="Stream cámara ESP32-CAM"
        class="camera-video"
      />

      <button
        class="btn fullscreen-btn"
        @click="toggleFullScreen"
        :aria-label="esPantallaCompleta ? 'Salir de pantalla completa' : 'Entrar en pantalla completa'"
        :title="esPantallaCompleta ? 'Salir de pantalla completa' : 'Entrar en pantalla completa'"
      >
        <svg
          v-if="!esPantallaCompleta"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon"
        >
          <path d="M3 9v-3h3" />
          <path d="M21 15v3h-3" />
          <path d="M16 3h5v5" />
          <path d="M8 21H3v-5" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon"
        >
          <path d="M9 3H5v4" />
          <path d="M15 21h4v-4" />
          <path d="M3 15v6h6" />
          <path d="M21 9v-6h-6" />
        </svg>
      </button>
    </section>

    <!-- Controles de movimiento -->
    <section class="controls-section" aria-label="Controles de movimiento">
      <button class="control-btn" @click="mover('arriba')" aria-label="Mover arriba">
        ▲
      </button>
      <div class="horizontal-controls">
        <button class="control-btn" @click="mover('izquierda')" aria-label="Mover izquierda">◀</button>
        <button class="control-btn" @click="mover('derecha')" aria-label="Mover derecha">▶</button>
      </div>
      <button class="control-btn" @click="mover('abajo')" aria-label="Mover abajo">
        ▼
      </button>
    </section>

    <!-- Telemetría -->
    <section class="telemetry-section" aria-live="polite" aria-atomic="true">
      <h2 class="section-title">Telemetría</h2>
      <div class="coords">
        <p><strong>Latitud:</strong> {{ lat !== null ? lat.toFixed(6) : '—' }}</p>
        <p><strong>Longitud:</strong> {{ lng !== null ? lng.toFixed(6) : '—' }}</p>
      </div>
      <div v-if="lat !== null && lng !== null" class="target-coords">
        <p>📍 Objetivo marcado en:</p>
        <p><strong>Lat:</strong> {{ lat.toFixed(6) }}, <strong>Lng:</strong> {{ lng.toFixed(6) }}</p>
      </div>
    </section>

    <!-- Botones acciones -->
    <section class="actions-section" role="region" aria-label="Acciones principales">
      <button class="action-btn" @click="tomarFoto" aria-label="Marcar objetivo con foto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="btn-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z" />
        </svg>
        Marcar Objetivo
      </button>
      <button class="action-btn" @click="verHistorial" aria-label="Ver historial de fotos">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="btn-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h10a4 4 0 004-4v-4a4 4 0 00-4-4H7a4 4 0 00-4 4v4z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01" />
        </svg>
        Ver Historial
      </button>
      <button
        class="action-btn danger"
        @click="limpiarHistorial"
        aria-label="Limpiar historial de fotos"
        title="Borrar todo el historial"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="btn-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5-4h4a1 1 0 011 1v1H9V4a1 1 0 011-1z" />
        </svg>
        Limpiar Historial
      </button>
    </section>

    <!-- Notificaciones -->
    <transition name="fade">
      <p v-if="mensaje" class="notification" role="alert">{{ mensaje }}</p>
    </transition>

    <!-- Menú configuración -->
    <div
      class="settings-menu"
      @click="toggleMenu"
      tabindex="0"
      @blur="menuAbierto = false"
      aria-haspopup="true"
      :aria-expanded="menuAbierto.toString()"
      role="button"
      aria-label="Abrir menú de opciones"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="settings-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>

      <nav v-if="menuAbierto" class="dropdown" role="menu">
        <a href="#" @click.prevent="irA('infoUsuario')" role="menuitem" tabindex="0">👤 Información de usuario</a>
        <a href="#" @click.prevent="irA('modificarVista')" role="menuitem" tabindex="0">🎨 Cambiar tema</a>
        <a href="#" @click.prevent="accionCerrarSesion" role="menuitem" tabindex="0">🚪 Cerrar sesión</a>
      </nav>
    </div>

    <!-- Modal Info Usuario -->
    <div
      v-if="mostrarModalUsuario"
      class="modal-backdrop"
      @click.self="mostrarModalUsuario = false"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div class="modal">
        <h2 id="modal-title">Información de usuario</h2>
        <p><strong>Nombre:</strong> {{ usuario.nombre }}</p>
        <p><strong>Email:</strong> {{ usuario.email }}</p>
        <button @click="mostrarModalUsuario = false" class="btn cerrar-btn">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lat: null,
      lng: null,
      mensaje: '',
      menuAbierto: false,
      mostrarModalUsuario: false,
      usuario: {
        nombre: 'Tony Heredia',
        email: 'tony@example.com',
      },
      temaOscuro: false,
      usarCamaraLocal: true,
      urlCamara: 'http://192.168.1.50:81/stream',
      esPantallaCompleta: false,
    };
  },
  mounted() {
    if (this.usarCamaraLocal) this.iniciarCamara();
    this.obtenerUbicacion();

    document.addEventListener('fullscreenchange', () => {
      this.esPantallaCompleta = !!document.fullscreenElement;
    });
  },
  methods: {
    iniciarCamara() {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => (this.$refs.video.srcObject = stream))
        .catch(() => this.mostrarMensaje('No se pudo acceder a la cámara'));
    },
    obtenerUbicacion() {
      if (!navigator.geolocation) {
        this.mostrarMensaje('Tu navegador no soporta geolocalización.');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.lat = pos.coords.latitude;
          this.lng = pos.coords.longitude;
        },
        err => {
          this.mostrarMensaje('No se pudo obtener la ubicación: ' + err.message);
        }
      );
    },
    irA(opcion) {
      if (opcion === 'infoUsuario') {
        this.mostrarModalUsuario = true;
        this.menuAbierto = false;
      } else if (opcion === 'modificarVista') {
        this.temaOscuro = !this.temaOscuro;
        this.menuAbierto = false;
        this.mostrarMensaje(`Tema cambiado a ${this.temaOscuro ? 'oscuro' : 'claro'}`);
      }
    },
    tomarFoto() {
      if (this.lat === null || this.lng === null) {
        this.mostrarMensaje('Ubicación no disponible para marcar objetivo');
        return;
      }
      if (this.usarCamaraLocal) {
        const video = this.$refs.video;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const fotoData = canvas.toDataURL('image/png');
        this.guardarFotoHistorial(fotoData);
      } else {
        const fotoData = this.urlCamara + '?capture=' + new Date().getTime();
        this.guardarFotoHistorial(fotoData, true);
      }
    },
    guardarFotoHistorial(fotoData, esURL = false) {
      const registro = {
        fecha: new Date().toISOString(),
        lat: this.lat,
        lng: this.lng,
        foto: fotoData,
        esURL,
      };
      let historial = JSON.parse(localStorage.getItem('historialFotos')) || [];
      historial.push(registro);
      localStorage.setItem('historialFotos', JSON.stringify(historial));
      if (esURL) {
        window.open(fotoData, '_blank');
      } else {
        const link = document.createElement('a');
        link.href = fotoData;
        link.download = `foto_${new Date().toISOString()}.png`;
        link.click();
      }
      this.mostrarMensaje('📸 Foto tomada y guardada en historial');
    },
    verHistorial() {
      this.mostrarMensaje('Función ver historial no implementada. Puedes agregar una galería modal aquí.');
    },
    limpiarHistorial() {
      if (confirm('¿Seguro que quieres borrar todo el historial? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('historialFotos');
        this.mostrarMensaje('Historial borrado');
      }
    },
    cerrarSesion() {
      this.mostrarMensaje('Cerrando sesión...');
      setTimeout(() => {
        this.$router.push('/login');
      }, 1000);
    },
    mostrarMensaje(texto) {
      this.mensaje = texto;
      setTimeout(() => (this.mensaje = ''), 3000);
    },
    mover(direccion) {
      this.mostrarMensaje(`Mover ${direccion}`);
      // Aquí envía comandos al drone o cámara vía API o websocket
    },
    toggleMenu() {
      this.menuAbierto = !this.menuAbierto;
    },
    accionCerrarSesion() {
      this.menuAbierto = false;
      if (confirm('¿Seguro que quieres cerrar sesión?')) {
        this.cerrarSesion();
      }
    },
    toggleFullScreen() {
      const container = this.$refs.camaraContainer;
      if (!document.fullscreenElement) {
        container.requestFullscreen?.() || container.webkitRequestFullscreen?.() || container.msRequestFullscreen?.();
      } else {
        document.exitFullscreen?.() || document.webkitExitFullscreen?.() || document.msExitFullscreen?.();
      }
    },
  },
};
</script>

<style scoped>
/* Reset básico */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.app-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #222;
  background: #f0f2f5;
  min-height: 100vh;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  gap: 2rem;
}
.dark-theme {
  background: #121212;
  color: #eee;
}

/* Cámara */
.camera-section {
  position: relative;
  width: 90vw;
  max-width: 640px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  background: #000;
  aspect-ratio: 16 / 9;
  display: flex;
  justify-content: center;
  align-items: center;
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
}

/* Botón fullscreen */
.fullscreen-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255 255 255 / 0.9);
  border: none;
  border-radius: 50%;
  width: 42px;
  height: 42px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  color: #333;
}

.fullscreen-btn:hover {
  background: #007bff;
  color: #fff;
}

.icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 2;
}

/* Controles de movimiento */
.controls-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.horizontal-controls {
  display: flex;
  gap: 1rem;
}

.control-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 1rem 1.3rem;
  font-size: 1.6rem;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.1s ease;
  user-select: none;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.control-btn:hover {
  background: #0056b3;
  transform: scale(1.05);
}

.control-btn:active {
  transform: scale(0.95);
}

/* Telemetría */
.telemetry-section {
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  width: 90vw;
  max-width: 640px;
  color: #222;
}

.dark-theme .telemetry-section {
  background: #1e1e1e;
  color: #eee;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  user-select: text;
}

.coords p,
.target-coords p {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.target-coords {
  margin-top: 1rem;
  background: #e0f0ff;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  color: #007bff;
  font-weight: 600;
}

.dark-theme .target-coords {
  background: #003766;
  color: #a1d1ff;
}

/* Botones acciones */
.actions-section {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  width: 90vw;
  max-width: 640px;
}

.action-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.8rem 1.3rem;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  user-select: none;
  flex: 1 1 150px;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.action-btn:hover {
  background: #1e7e34;
}

.action-btn .btn-icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 2;
}

.action-btn.danger {
  background: #dc3545;
}

.action-btn.danger:hover {
  background: #a71d2a;
}

/* Notificación */
.notification {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #007bff;
  color: white;
  padding: 0.8rem 1.2rem;
  border-radius: 24px;
  font-weight: 600;
  box-shadow: 0 6px 12px rgba(0,0,0,0.2);
  user-select: none;
  pointer-events: none;
  z-index: 1500;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Menú configuración */
.settings-menu {
  position: fixed;
  top: 16px;
  right: 16px;
  background: transparent;
  cursor: pointer;
  user-select: none;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-icon {
  width: 28px;
  height: 28px;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  color: #007bff;
  transition: color 0.2s ease;
}

.settings-menu:hover .settings-icon {
  color: #0056b3;
}

.dropdown {
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  box-shadow: 0 6px 14px rgba(0,0,0,0.1);
  border-radius: 8px;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  user-select: none;
  z-index: 2100;
  padding: 0.5rem 0;
}

.dark-theme .dropdown {
  background: #1e1e1e;
  color: #eee;
}

.dropdown a {
  padding: 0.8rem 1.2rem;
  color: #222;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dark-theme .dropdown a {
  color: #eee;
}

.dropdown a:hover,
.dropdown a:focus {
  background: #007bff;
  color: white;
  outline: none;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 3000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 2rem 2.5rem;
  border-radius: 16px;
  max-width: 360px;
  width: 90%;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
  color: #222;
  user-select: text;
  text-align: center;
}

.dark-theme .modal {
  background: #2b2b2b;
  color: #eee;
}

.modal h2 {
  margin-bottom: 1rem;
  font-weight: 700;
}

.cerrar-btn {
  margin-top: 1.5rem;
  background: #dc3545;
  border: none;
  padding: 0.8rem 0;
  width: 100%;
  font-weight: 700;
  border-radius: 12px;
  cursor: pointer;
  color: white;
  transition: background-color 0.3s ease;
}

.cerrar-btn:hover {
  background: #a71d2a;
}

/* Responsive */
@media (max-width: 480px) {
  .control-btn {
    width: 48px;
    height: 48px;
    font-size: 1.3rem;
    padding: 0.6rem 0.8rem;
  }

  .actions-section {
    flex-direction: column;
  }

  .action-btn {
    flex: 1 1 100%;
  }

  .camera-section {
    width: 100vw;
    border-radius: 0;
  }

  .telemetry-section {
    width: 100vw;
    border-radius: 0;
  }
}
</style>
