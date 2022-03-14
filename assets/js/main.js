//inicia TESTES jsons do servidor
let rncs;
let users = axios("../../json/users.json").then((resposta => {
    if (resposta.status > 199 && resposta.status < 300) {
        users = [resposta.data];
        users = users[0];
    }
})).then((e => {
    rncs = axios("../../json/rncs.json").then((resposta => {
        if (resposta.status > 199 && resposta.status < 300) {
            rncs = [resposta.data];
            rncs = rncs[0];
            puxarRncsPorUsuario();
        }
    }))
}));

const userLogado = 1; //TESTANDO COM USER ADM

//finaliza TESTES jsons do servidor



//inicia TESTES de pushs de RNCS por usuario

let rncsUsuarioLogado;

function puxarRncsPorUsuario() {
    rncsUsuarioLogado = {
        enviadas: users[userLogado].rnc.enviadas,
        recebidas: users[userLogado].rnc.recebidas,
        observador: users[userLogado].rnc.observador
    }
}

//finaliza TESTES de pushs de RNCS por usuario



document.querySelector("#tabela-opcoes-menu").addEventListener("click", e => {
    const target = e.target.classList[0];
    const encontraSubmit = target.slice(0, 6);

    if (encontraSubmit !== "submit") return

    const tipoSubmit = target.slice(7);
    
    pegarHtmlPainel(tipoSubmit)
})

document.addEventListener("click", e=> {
    if (e.target.classList[1] !== 'eventoC1') return
    console.log('a')
    const elementos = document.querySelectorAll(".eventoC1");
    for (var i in elementos) {
        if (elementos[i].type == undefined) return
        if (elementos[i].value !== '') {
            elementos[i].style.background = "white";
            elementos[i].style.color = "green";
        }
        else (elementos[i].style = 'none') 
    }      
})

function pegarHtmlPainel(submit) {
    axios(`../html/${submit}.html`).then((res => {
        const informarcoes = res.data
        exportarHtmlPainel(informarcoes, submit);
    })).then((e => {

        if (submit == "gerar") validaRnc();

        if (submit == "enviadas") {
            let listaPush = [];
            for (let i in rncsUsuarioLogado.enviadas) {
                if (users[userLogado].rnc.enviadas[i] !== undefined) {
                    listaPush.push(users[userLogado].rnc.enviadas[i])
                }  
            }
            setarRncsPorUsuario(listaPush)
        }   
    }))
}

function exportarHtmlPainel(html, submit) {
    const local = document.querySelector("#painel-principal");
    local.classList = `flex ${String(` ${submit}`)}`;
    local.innerHTML = html;
    if (submit == "gerar") eventoOrigemRnc();
    abaSelecionadaMenu(submit)
}

function abaSelecionadaMenu(submit) {
    try {
        let barraAnterior = document.querySelector("#barra-ativa");
        barraAnterior.removeAttribute("id")
        barraAnterior.style = "none";
    } catch {

    }
    const sub = (`submit-${submit}`);
    const barraSelecionada = document.querySelector(`.${sub}`);
    barraSelecionada.id = "barra-ativa";
}   

function eventoOrigemRnc() {
    const visto = document.querySelector("#visto");
    let opcaoSelecionada;
    let abaSelecionada;
    const listaOpcoes = document.querySelector(".list");
    let filhosListaOp = (new Array(...listaOpcoes.children));
    filhosListaOp.splice(0, 1)
    listaOpcoes.addEventListener('click', (e) => {
        try {
            document.querySelector("#origem").removeAttribute('id');
        } catch {}
        if (e.target.className == 'list') return
        for (let i in filhosListaOp) {
            if (filhosListaOp[i].children[0].children[0].checked) {
                abaSelecionada = filhosListaOp[i];
                filhosListaOp[i].children[0].children[0].checked = false;
            }
            filhosListaOp[i].style = 'none';
        }
        if (e.target.type == "checkbox") {
            e.target.checked = true;
            abaSelecionada.style.background = "white";
            abaSelecionada.style.color = "green"  
            opcaoSelecionada = e.target.parentElement.childNodes[2];
            e.target.id = "origem"; 
        }
        if (visto.value !== '') {
            visto.style.background = 'white';
            visto.style.color = 'green';
        }
    })
}

function validaRnc() {
    document.querySelector("#criar-rnc").addEventListener("submit", e => {
        e.preventDefault();
        const tipo = document.querySelector("#tipo").value;
        const setor = document.querySelector("#setor").value;
        const data = document.querySelector("#data").value;
        let origem = document.querySelector("#origem");
        const emissao = document.querySelector("#emissao").value;
        const descricao = document.querySelector("#descricao").value;

        if (tipo == '' || setor == '' || data == '' || descricao == '') {
            alert("Campos incompletos");
            return
        }
        if (origem == null) {
            alert ("Defina a origem");
            return
        }
        origem = origem.parentElement.childNodes[2].data; 
        const rncGerada = new Rnc(tipo, setor, data, origem, emissao, descricao);
    })  
    return 
} 

class Rnc {
    constructor(tipo, setor, data, origem, criador, descricao) {
        this.codigo = "ultima RNC + 1",
        this.criador = criador,
        this.tipo = tipo,
        this.setor = setor,
        this.data = data,
        this.origem = origem, 
        this.descricao = descricao,
        this.receptor,
        this.visto,
        this.observadores = [],
        this.imgProb = [],
        this.imgSolu = [],
        this.aberta = true,
        this.lida = false,
        this.status = "aguardando apontamento",
        this.historico = [],
        this.observacoes = []
    }
}

function setarRncsPorUsuario(recebidas) {
    let rncsUsuario = [];
    for (let i in recebidas) {
        const findRnc = rncs.find(element => element.codigo == recebidas[i]);
        rncsUsuario.push(findRnc);
    }
    renderizarRncs(rncsUsuario)
}

function renderizarRncs(rncsUsuario) { 
    const local = document.querySelector(".escopo-rncs");
    for (let i in rncsUsuario)  {
        const codigo = document.createTextNode(rncsUsuario[i].descricao)
        const p = document.createElement("p");
        p.appendChild(codigo);
        const div = document.createElement("div");
        div.appendChild(p);
        div.classList = "rnc-renderizada";
        local.appendChild(div);
    }
}