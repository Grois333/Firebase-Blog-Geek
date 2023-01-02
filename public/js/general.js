$(() => {
  $('.tooltipped').tooltip({ delay: 50 })
  $('.modal').modal()

  firebase.initializeApp(varConfig)

  // Se registra el service worker
  navigator.serviceWorker
    .register('notificaciones-sw.js')
    .then(registro => {
      console.log('service worker registrado')
      firebase.messaging().useServiceWorker(registro)
    })
    .catch(error => {
      console.error(`Error al registrar el service worker => ${error}`)
    })

  const messaging = firebase.messaging()

  // Registrar credenciales web
  messaging.usePublicVapidKey(
    'BOVEhJLVFweFkCFSX1Fn7F-q0Ky2b7AwtrO5Zz6eBWngw0fDPq0V4Wg5fUZdfdDPu6OCpTBJX_ehIOjOO5BkNA4'
  )

  // // Solicitar permisos para las notificaciones
  messaging
    .requestPermission()
    .then(() => {
      console.log('permiso otorgado')
      return messaging.getToken()
    })
    .then(token => {
      console.log('token')
      console.log(token)
      const db = firebase.firestore()
      db.settings({ timestampsInSnapshots: true })
      db
        .collection('tokens')
        .doc(token)
        .set({
          token: token
        })
        .catch(error => {
          console.error(`Error al insertar el token en la BD => ${error}`)
        })
    })
    .catch(error => {
      console.error(`Permiso no otorgado => ${error}`)
    })

  // Obtener el token cuando se refresca
  messaging.onTokenRefresh(() => {
    messaging.getToken().then(token => {
      console.log('token se ha renovado')
      const db = firebase.firestore()
      db.settings({ timestampsInSnapshots: true })
      db
        .collection('tokens')
        .doc(token)
        .set({
          token: token
        })
        .catch(error => {
          console.error(`Error al insertar el token en la BD => ${error}`)
        })
    })
  })

  // Recibir las notificaciones cuando el usuario esta foreground
  messaging.onMessage(payload => {
    console.log('mensaje en foreground')
    Materialize.toast(
      `We already have a new post. Check it out, it's called ${payload.data.titulo}`,
      6000
    )
  })

  const post = new Post()
  post.consultarTodosPost()

  // Firebase observador del cambio de estado de auth
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      $('#btnInicioSesion').text('Exit')
      if (user.photoURL) {
        $('#avatar').attr('src', user.photoURL)
      } else {
        $('#avatar').attr('src', 'imagenes/usuario_auth.png')
      }
    } else {
      $('#btnInicioSesion').text('Sign In')
      $('#avatar').attr('src', 'imagenes/usuario.png')
    }
  })

  // Evento boton inicio sesion
  $('#btnInicioSesion').click(() => {
    const user = firebase.auth().currentUser
    if (user) {
      $('#btnInicioSesion').text('Sign In')
      return firebase
        .auth()
        .signOut()
        .then(() => {
          $('#avatar').attr('src', 'imagenes/usuario.png')
          Materialize.toast(`SignOut Correct`, 4000)
        })
        .catch(error => {
          Materialize.toast(`Error when performing SignOut => ${error}`, 4000)
        })
    }

    $('#emailSesion').val('')
    $('#passwordSesion').val('')
    $('#modalSesion').modal('open')
  })

  $('#avatar').click(() => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        $('#avatar').attr('src', 'imagenes/usuario.png')
        Materialize.toast(`correct SignOut`, 4000)
      })
      .catch(error => {
        Materialize.toast(`Error when performing SignOut ${error}`, 4000)
      })
  })

  $('#btnTodoPost').click(() => {
    $('#tituloPost').text('Community Posts')
    const post = new Post()
    post.consultarTodosPost()
  })

  $('#btnMisPost').click(() => {
    const user = firebase.auth().currentUser
    if (user) {
      const post = new Post()
      post.consultarPostxUsuario(user.email)
      $('#tituloPost').text('My Posts')
    } else {
      Materialize.toast(`You must be authenticated to see your posts`, 4000)
    }
  })
})
