class Autenticacion {
  autEmailPass (email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).then(result => {
      if (result.user.emailVerified) {
        $('#avatar').attr('src', 'imagenes/usuario_auth.png')
        Materialize.toast(`Welcome ${result.user.displayName}`, 5000)
      } else {
        firebase.auth().signOut()
        Materialize.toast(
          `Please perform account verification`,
          5000
        )
      }
    })

    $('.modal').modal('close')
  }

  resetPasswordByEmail(email) {
    if (email) {
      const auth = firebase.auth();

      const configuracion = {
        url: 'https://blogeek-aab9e.web.app/'
        //url: "http://localhost:3000/"
      };

      auth
        .sendPasswordResetEmail(email, configuracion)
        .then(result => {
          console.log(result);
          Materialize.toast(
            `A password reset email has been sent`,
            4000
          );

          $(".modal").modal("close");
        })
        .catch(error => {
          console.log(error);
          Materialize.toast(error.message, 4000);
        });
    } else {
      Materialize.toast(`Please enter your email`, 4000);
    }
  }

  crearCuentaEmailPass (email, password, nombres) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(result => {
        result.user.updateProfile({
          displayName: nombres
        })

        const configuracion = {
          url: 'https://blogeek-aab9e.web.app/'
          //url: 'http://localhost:3000/'
        }

        result.user.sendEmailVerification(configuracion).catch(error => {
          console.error(error)
          Materialize.toast(error.message, 4000)
        })

        firebase.auth().signOut()

        Materialize.toast(
          `Welcome ${nombres}, you must go through the verification process`,
          4000
        )

        $('.modal').modal('close')
      })
      .catch(error => {
        console.error(error)
        Materialize.toast(error.message, 4000)
      })
  }

  authCuentaGoogle () {
    const provider = new firebase.auth.GoogleAuthProvider()

    firebase.auth().signInWithPopup(provider).then(result => {
      $('#avatar').attr('src', result.user.photoURL)
      $('.modal').modal('close')
      Materialize.toast(`Welcome ${result.user.displayName} !! `, 4000)
    })
    .catch(error =>{
      console.error(error)
      Materialize.toast(`Failed to authenticate with google: ${error} `, 4000)
    })
  }

  authCuentaFacebook () {
    const provider = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(provider).then(result => {
      $('#avatar').attr('src', result.user.photoURL)
      $('.modal').modal('close')
      Materialize.toast(`Welcome ${result.user.displayName} !! `, 4000)
    })
    .catch(error =>{
      console.error(error)
      Materialize.toast(`Error when authenticating with facebook: ${error} `, 4000)
    })
  }

  authTwitter () {
    // TODO: Crear auth con twitter

    const provider = new firebase.auth.TwitterAuthProvider();

    firebase.auth().signInWithPopup(provider)
    .then(result => {
      $('#avatar').attr('src', result.user.photoURL)
      $('.modal').modal('close')
      Materialize.toast(`Welcome ${result.user.displayName} !! `, 4000)
    })
    .catch(error => {
      console.error(error)
      Materialize.toast(`Error when authenticating with Twitter: ${error} `, 4000)
    })

  }
}
