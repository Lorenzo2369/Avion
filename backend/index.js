const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

const app = express()
app.use(cors())
app.use(bodyParser.json())

// Configura tu conexión MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Uzumaki22#',
  database: 'Avion'
})

connection.connect(err => {
  if (err) {
    console.error('Error conectando a MySQL:', err)
    process.exit(1)
  }
  console.log('Conectado a MySQL')
})

// Configura nodemailer (ejemplo con Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'antonioheredia2002@gmail.com',
    pass: 'bgzbqqlyhosogbmp' // usa password de aplicación, no tu contraseña normal
  }
})

// Registro
app.post('/api/register', async (req, res) => {
  const { nombre, email, password } = req.body
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const verifyToken = crypto.randomBytes(32).toString('hex')

    const query = 'INSERT INTO usuarios (nombre, email, password, verified, verify_token) VALUES (?, ?, ?, false, ?)'
    connection.query(query, [nombre, email, hashedPassword, verifyToken], (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Email ya registrado' })
        }
        return res.status(500).json({ error: 'Error en la base de datos' })
      }

      const verifyUrl = `http://localhost:5173/verify-email?token=${verifyToken}`

      const mailOptions = {
        from: '"Mi App" <antonioheredia2002@gmail.com>',
        to: email,
        subject: 'Verifica tu correo',
        html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Correo de verificación</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #e6f0ff;
      padding: 40px 15px;
      margin: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: rgb(255, 254, 254);
      border-radius: 14px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      padding: 40px 50px;
      color: #444;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .header img {
      width: 100px;
      margin: 0 auto 25px auto;
      display: block;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 120, 215, 0.3);
      background: #f0f5ff;
      padding: 10px;
    }
    h2 {
      color: #0052cc;
      font-weight: 700;
      font-size: 2rem;
      margin-bottom: 0.3rem;
      letter-spacing: 0.04em;
      margin-left: 35%;
    }
    p {
      font-size: 1rem;
      line-height: 1.6;
      margin: 20px 0;
      color: #555;
    }
    strong {
      color: #222;
    }
    .button {
      display: inline-block;
      background: #0052cc;
      color: white !important;
      font-weight: 700;
      padding: 16px 36px;
      text-decoration: none;
      border-radius: 10px;
      font-size: 1.15rem;
      box-shadow: 0 6px 18px rgba(0,82,204,0.5);
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
      margin: 30px 0;
      margin-left: 30%;
    }
    .button:hover {
      background: #003d99;
      box-shadow: 0 8px 22px rgba(0,61,153,0.6);
    }
    .footer {
      font-size: 0.85rem;
      color: #999;
      text-align: center;
      margin-top: 50px;
      border-top: 1px solid #dde6f3;
      padding-top: 20px;
      user-select: none;
    }
  </style>
</head>
<body>
  <div class="container" role="main">
    <div class="header">
      <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Mi App Logo" />
    </div>
    <h2>Hola ${nombre}</h2>
    <p>Gracias por registrarte en <strong>Mi App</strong>.</p>
    <p>Por favor verifica tu correo haciendo clic en el siguiente botón:</p>
    <a href="${verifyUrl}" class="button" target="_blank" rel="noopener noreferrer">Verificar cuenta</a>
    <p>Si no registraste esta cuenta, simplemente ignora este correo.</p>
    <div class="footer">
      &copy; 2025 Mi App. Todos los derechos reservados.
    </div>
  </div>
</body>
</html>
        `
      }

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error enviando email:', error)
          return res.status(500).json({ error: 'Error enviando email de verificación' })
        }
        res.json({ success: true, message: 'Usuario creado. Revisa tu correo para verificar tu cuenta.' })
      })
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la contraseña' })
  }
})

// Verificación del correo
app.get('/api/verify-email', (req, res) => {
  const { token } = req.query
  if (!token) {
    return res.status(400).json({ error: 'Token requerido' })
  }

  const query = 'UPDATE usuarios SET verified = true, verify_token = NULL WHERE verify_token = ?'
  connection.query(query, [token], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en la base de datos' })
    }
    if (results.affectedRows === 0) {
      return res.status(400).json({ error: 'Token inválido o ya usado' })
    }
    res.json({ success: true, message: 'Cuenta verificada correctamente.' })
  })
})

// Login con validación de verified
app.post('/api/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' })
  }

  const query = 'SELECT * FROM usuarios WHERE email = ?'
  connection.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la base de datos' })

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const user = results[0]

    if (!user.verified) {
      return res.status(401).json({
        success: false,
        error: 'Tu cuenta no está verificada. Revisa tu correo para activar la cuenta.'
      })
    }

    const match = await bcrypt.compare(password, user.password)
    if (match) {
      const { password, verify_token, ...userSafe } = user
      res.json({ success: true, user: userSafe })
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' })
    }
  })
})

const PORT = 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://0.0.0.0:${PORT}`)
})
