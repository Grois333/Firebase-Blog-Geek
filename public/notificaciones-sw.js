importScripts('https://www.gstatic.com/firebasejs/5.5.8/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/5.5.8/firebase-messaging.js')

firebase.initializeApp({
  projectId: 'blogeek-aab9e',
  messagingSenderId: '404671184578'
})

const messaging = firebase.messaging()

// Función que se ejecuta en background para recibir las notificaciones
messaging.setBackgroundMessageHandler(payload => {
  const tituloNotificacion = 'We already have a new post'
  const opcionesNotificacion = {
    body: payload.data.titulo,
    icon: 'icons/icon_new_post.png',
    click_action: 'https://blogeek-aab9e.web.app/'
  }

  return self.registration.showNotification(
    tituloNotificacion,
    opcionesNotificacion
  )
})
