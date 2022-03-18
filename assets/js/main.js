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
            avaliarPermissoes();
            puxarRncsPorUsuario();
        }
    }))
}));

//finaliza TESTES jsons do servidor


document.querySelector('.submit-apontar').style.display = 'none';

const userLogado = 0; //TESTANDO COM USER ADM

function avaliarPermissoes() {
    for (let i in users[userLogado].permissoes) {
        if (users[userLogado].permissoes[i] == 'apontar') document.querySelector('.submit-apontar').style = 'none';
    }
}

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

    const elementos = document.querySelectorAll(".eventoC1");

    for (var i in elementos) {
        if (elementos[i].type == undefined) return
        if (elementos[i].value !== '') {
            elementos[i].style.background = "white";
            elementos[i].style.color = "green";
        }
        else (elementos[i].style = 'none'); 
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
            setarRncsPorUsuario(listaPush);
            eventoPesquisador();
            eventoSelecionaRnc();
        } 
        
        if (submit == "recebidas") {
            let listaPush = [];
            for (let i in rncsUsuarioLogado.recebidas) {
                if (users[userLogado].rnc.recebidas[i] !== undefined) {
                    listaPush.push(users[userLogado].rnc.recebidas[i])
                }  
            }
            setarRncsPorUsuario(listaPush);
            eventoPesquisador();
            eventoSelecionaRnc();
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
        const descricao = document.querySelector("#descricao").value;
        const quantidade = document.querySelector("#quantidade").value;

        if (tipo == '' || setor == '' || data == '' || descricao == '') {
            alert("Campos incompletos");
            return
        }
        if (origem == null) {
            alert ("Defina a origem");
            return
        }
        origem = origem.parentElement.childNodes[2].data; 
        const rncGerada = new Rnc(users[userLogado].user ,tipo, setor, data, origem, descricao, quantidade);

        console.log(rncGerada)
    })  
    return 
} 

let rncsUsuario;

function setarRncsPorUsuario(recebidas) {
    rncsUsuario = [];
    for (let i in recebidas) {
        const findRnc = rncs.find(element => element.codigo == recebidas[i]);
        rncsUsuario.push(findRnc);
    }
    renderizarRncs(rncsUsuario);
}

function renderizarRncs(rncsUsuario, apagar) { 
    const localTabela = document.querySelector(".cab-padraoEnvRec");

    if (apagar) {
        document.querySelector(".escopo-rncs").remove();
        const div = document.createElement('div');
        div.className = 'escopo-rncs';
        localTabela.appendChild(div);
    }

    const local = document.querySelector(".escopo-rncs");

    for (let i in rncsUsuario)  {
        if (rncsUsuario[i] == undefined) return

        const infos = [rncsUsuario[i].codigo, rncsUsuario[i].criador, rncsUsuario[i].origem, rncsUsuario[i].status];
        const div = document.createElement("div");

        for (let o in infos) {

            let atributoAtual;
            const p = document.createElement("p");

            if (rncsUsuario[i].codigo === infos[o]) atributoAtual = "Código: ";
            if (rncsUsuario[i].criador === infos[o]) {
                atributoAtual = "Criador: ";
                infos[o] = users[infos[o]].user;
            } 
            if (rncsUsuario[i].origem === infos[o]) atributoAtual = "Origem: ";
            if (rncsUsuario[i].status === infos[o]) {
                atributoAtual = '';
                if (infos[o] === "aguardando direcionamento") p.classList = 'statusRncPainel statusRed';
                if (infos[o] === "aguardando posicionamento do responsável") p.classList = 'statusRncPainel statusOrange';
                if (infos[o] === "aguardando verificação da eficácia") p.classList = 'statusRncPainel statusYellow';
                if (infos[o] === "finalizada") p.classList = 'statusRncPainel statusGreen';
            }

            const item = document.createTextNode(`${atributoAtual} ${infos[o]}`);

            p.appendChild(item);
            div.appendChild(p);
            div.classList = `rnc-renderizada ${rncsUsuario[i].codigo}`;  
        }
        local.appendChild(div);
    }
}

function eventoPesquisador() {
    document.querySelector(".searchTerm").addEventListener('keyup', e => {
        const valoresDigitados = document.querySelector(".searchTerm").value;

        if (valoresDigitados == '' || valoresDigitados == 0) {
            renderizarRncs(rncsUsuario, true);
            return
        }

        const findRnc = rncs.find(element => element.codigo == valoresDigitados); 
        const validaBusca = rncsUsuario.find(e => e == findRnc);
        
        if (validaBusca === undefined) renderizarRncs([], true);
        if (validaBusca !== findRnc) return

        const novaLista = [findRnc];

        if (validaBusca === findRnc) renderizarRncs(novaLista, true);
    })
}

function eventoSelecionaRnc() {
    document.querySelector(".escopo-rncs").addEventListener('click', e => {

        if (e.target.classList[0] === 'escopo-rncs') return

        let rncClicada;

        if (e.target.classList[0] === 'rnc-renderizada') {
            rncClicada = e.target.classList[1] 
        }else {
            rncClicada = e.target.parentElement.classList[1]
        }
        
        const findRnc = rncs.find(element => element.codigo == rncClicada);

        renderizarRncPainel(findRnc);
    })
}

function renderizarRncPainel(rnc) {
    
    const local = document.querySelector(".cab-container-control-rncs");
}

class Rnc {
    constructor(criador ,tipo, setor, data, origem, descricao, quantidade) {
        this.codigo = "ultima RNC + 1",
        this.criador = criador,
        this.tipo = tipo,
        this.setor = setor,
        this.data = data,
        this.origem = origem, 
        this.descricao = descricao,
        this.quantidade = Number(quantidade),
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

class AnaliseCausas {
    constructor(objCausa) {
        causa = objCausa
    }
}