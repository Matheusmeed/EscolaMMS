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

const NOMES = document.getElementById('nomes');
const RA = document.getElementById('ra');
const P1 = document.getElementById('p1');
const P2 = document.getElementById('p2');
const MEDIA = document.getElementById('media');

// Logar

function checkEmail() {
    let email = document.getElementById('email').value;
    let senha = document.getElementById('senha').value;
    if (email == '' || senha == '') {
        alert('Preencha todas as lacunas!');
    } else if (!email.includes('professor')) {
        alert('Conta inválida!');
        window.location.reload();
    } else {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, senha)
            .then(() => {
                // Signed in
                window.location.href = 'teachersArea.html';
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
            window.location.href = 'teacherLogin.html';
        })
        .catch((error) => {
            // An error happened.
            console.log(error);
        });
}

// Atualizar notas

turma.onSnapshot((snapshot) => {
    snapshot.forEach((doc) => {
        let aluno = doc.data();

        NOMES.innerHTML += `<div>${aluno.nome}</div>`;
        RA.innerHTML += `<div>${aluno.ra}</div>`;
        P1.innerHTML += `<div>${aluno.p1}</div>`;
        P2.innerHTML += `<div>${aluno.p2}</div>`;
        MEDIA.innerHTML += `<div>${(aluno.p1 + aluno.p2) / 2}</div>`;
    });
});

// Botões chama essa função para abrir o menu
const menuAlterarNotas = document.getElementsByClassName('botoesMenu')[0];
const menuAdd = document.getElementsByClassName('botoesMenu')[1];
const menuRemover = document.getElementsByClassName('botoesMenu')[2];

function abrirMenuNota() {
    menuAlterarNotas.style.display = 'flex';
}
function abrirMenuAdd() {
    menuAdd.style.display = 'flex';
}
function abrirMenuRemover() {
    menuRemover.style.display = 'flex';
}

// Sair do menu de alteração de nota

function sairDoMenu() {
    menuAlterarNotas.style.display = 'none';
    menuAdd.style.display = 'none';
    menuRemover.style.display = 'none';
}

// Alterar Notas

let inputRA = document.getElementById('inputRA');
let inputP1 = document.getElementById('inputP1');
let inputP2 = document.getElementById('inputP2');

function alterarNotas() {
    inputRA = inputRA.value;
    inputP1 = inputP1.value;
    inputP2 = inputP2.value;

    if (inputRA == '') {
        alert('Você deve colocar um RA válido');
        window.location.reload();
    } else if (inputP1 < 0 || inputP1 > 10 || inputP2 < 0 || inputP2 > 10) {
        alert('Você deve colocar uma nota que esteja entre 0 e 10!');
        window.location.reload();
    } else {
        turma.get().then((snapshot) => {
            snapshot.forEach((doc) => {
                let ra = doc.data().ra;

                if (inputRA == ra) {
                    let alunoref = db.collection('turma').doc(doc.id);

                    return alunoref
                        .update({
                            p1: Number(inputP1),
                            p2: Number(inputP2),
                        })
                        .then()
                        .catch((error) => {
                            console.error(error);
                        });
                }
            });
        });
        menuAlterarNotas.style.display = 'none';
        setInterval(() => {
            window.location.reload();
        }, 100);
    }
}

// Adicionar aluno

function adicionarAluno() {
    let txtNome = document.getElementById('txtNome').value;
    let txtSobrenome = document.getElementById('txtSobrenome').value;
    let txtRA = document.getElementById('txtRA').value;

    if (txtNome == '' || txtSobrenome == '' || txtRA == '') {
        alert('Você deve preencher todos os campos!');
    } else {
        let nomeFormatado =
            txtNome[0].toUpperCase() + txtNome.substr(1).toLowerCase();
        let sobrenomeFormatado =
            txtSobrenome[0].toUpperCase() +
            txtSobrenome.substr(1).toLowerCase();

        db.collection('turma').doc().set({
            nome: nomeFormatado,
            sobrenome: sobrenomeFormatado,
            p1: 0,
            p2: 0,
            ra: txtRA,
        });
        setTimeout(() => {
            window.location.reload();
        }, 300);
    }
}

// Remover Aluno

function removerAluno() {
    let removerRA = document.getElementById('removerRA');

    if (removerRA.value == '') {
        alert('Você deve colocar o RA do aluno na lacuna.');
    } else {
        turma.get().then((snapshot) => {
            snapshot.forEach((doc) => {
                let ra = doc.data().ra;

                if (removerRA.value == ra) {
                    let alunoref = db.collection('turma').doc(doc.id);

                    return alunoref
                        .delete()
                        .then()
                        .catch((error) => {
                            console.error(error);
                        });
                }
            });
        });
        menuAlterarNotas.style.display = 'none';
        setTimeout(() => {
            window.location.reload();
        }, 100);
    }
}
