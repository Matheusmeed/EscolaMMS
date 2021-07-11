var firebaseConfig = {
    apiKey: 'AIzaSyBZJL0YLNtfTNlAkZG_2Yz2yxnli56J4Hw',
    authDomain: 'escola-1766c.firebaseapp.com',
    projectId: 'escola-1766c',
    storageBucket: 'escola-1766c.appspot.com',
    messagingSenderId: '879563371305',
    appId: '1:879563371305:web:8f5602ee66362284adbd38',
    measurementId: 'G-STKL72X916',
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
let db = firebase.firestore();
let turma = db.collection('turma');
turma = turma.orderBy('nome');

// Logar

function checkEmail() {
    let email = document.getElementById('email').value;
    let senha = document.getElementById('senha').value;
    if (email == '' || senha == '') {
        alert('Preencha todas as lacunas!');
    } else if (!email.includes('aluno')) {
        alert('Conta inválida!');
        window.location.reload();
    } else {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, senha)
            .then(() => {
                // Signed in
                window.location.href = 'studentArea.html';
            })
            .catch(() => {
                alert('Essa conta não existe.');
                window.location.reload();
            });
    }
}

// Deslogar

function sair() {
    firebase
        .auth()
        .signOut()
        .then(() => {
            // Sign-out successful.
            window.location.href = 'studentLogin.html';
        })
        .catch((error) => {
            // An error happened.
            console.log(error);
        });
}

//Abrir menu de notas

const menuNotas = document.getElementsByClassName('menuNotas')[0];

function abrirMenu() {
    menuNotas.style.display = 'flex';
}

// Acessa as notas do firebase

let inputRA = document.getElementById('inputRA');
let inputSenha = document.getElementById('inputSenha');

let p1 = document.getElementById('p1');
let p2 = document.getElementById('p2');
let media = document.getElementById('media');

function acessarNotas() {
    inputRA = inputRA.value;
    if (inputRA == '' || inputSenha == '') {
        alert('Você deve preencher todos os campos!');
    } else {
        abrirMenu()
        turma.get().then((snapshot) => {
            snapshot.forEach((doc) => {
                let ra = doc.data().ra;

                if (inputRA == ra) {
                    let p1db = doc.data().p1;
                    let p2db = doc.data().p2;

                    p1.innerHTML = p1db;
                    p2.innerHTML = p2db;
                    media.innerHTML = (p1db + p2db) / 2;
                }
            });
        });
    }
}

//Fechar menu de notas

function sairDoMenu() {
    menuNotas.style.display = 'none';
    window.location.reload()
}
