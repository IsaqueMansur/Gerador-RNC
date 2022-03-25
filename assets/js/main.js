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
            enviarNotificacoes();
        }
    }))
}));

//finaliza TESTES jsons do servidor


document.querySelector('.submit-direcionar').style.display = 'none';

const userLogado = 0; //TESTANDO COM USER ADM

function avaliarPermissoes() {
    for (let i in users[userLogado].permissoes) {
        if (users[userLogado].permissoes[i] == 'direcionar' || users[userLogado].permissoes[i] == 'global_adm') document.querySelector('.submit-direcionar').style = 'none';
    }
}

function enviarNotificacoes() {
    let notificacoes = 0;
    for (let i in rncs) {
        if (rncs[i].status == "aguardando direcionamento") notificacoes ++;
    }
    document.querySelector("#notifica-direcionar").textContent = notificacoes;
    if (Number(document.querySelector("#notifica-direcionar").textContent) > 0) {
        document.querySelector("#notifica-direcionar").classList += ' notificacao-on';
    };
}


let rncsUsuarioLogado;

function puxarRncsPorUsuario() {
    rncsUsuarioLogado = {
        enviadas: users[userLogado].rnc.enviadas,
        recebidas: users[userLogado].rnc.recebidas,
        observador: users[userLogado].rnc.observador
    }
}

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

        if (submit == "gerar") validarRnc();

        if (submit == "enviadas") {
            let listaPush = [];
            for (let i in rncsUsuarioLogado.enviadas) {
                if (users[userLogado].rnc.enviadas[i] !== undefined) {
                    listaPush.push(users[userLogado].rnc.enviadas[i])
                }  
            }
            setarRncsPorUsuario(listaPush);
            eventoPesquisador();
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
        } 

        if (submit == "direcionar") {
            let listaPush = [];
            for (let i in rncs) {
                if (rncs[i].status == "aguardando direcionamento") listaPush.push(rncs[i].codigo);
            }
            setarRncsPorUsuario(listaPush)
            eventoPesquisador();
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

function validarRnc() {
    document.querySelector("#criar-rnc").addEventListener("submit", e => {
        e.preventDefault();
        const tipo = document.querySelector("#tipo").value;
        const setor = document.querySelector("#setor").value;
        const data = document.querySelector("#data").value;
        let origem = document.querySelector("#origem");
        const descricao = document.querySelector("#descricao").value;
        console.log(descricao.value)
        const quantidade = document.querySelector("#quantidade").value;
        const op = document.querySelector("#op").value;
        const cliche = document.querySelector("#cliche").value;

        if (tipo =='' || setor =='' || data =='' || descricao == undefined || quantidade =='' || op =='' || cliche =='') {
            alert("Campos incompletos");
            return
        }
        if (origem == null) {
            alert ("Defina a origem");
            return
        }
        origem = origem.parentElement.childNodes[2].data; 
        const rncGerada = new Rnc(users[userLogado].user ,tipo, setor, data, origem, quantidade, op, cliche, descricao);
        console.log(rncGerada);
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

        const infos = [rncsUsuario[i].codigo, rncsUsuario[i].op, rncsUsuario[i].criador, rncsUsuario[i].origem, rncsUsuario[i].status];
        const div = document.createElement("div");

        for (let o in infos) {

            let atributoAtual;
            const p = document.createElement("p");

            if (rncsUsuario[i].codigo === infos[o]) atributoAtual = "Código: ";
            if (rncsUsuario[i].op === infos[o]) atributoAtual = "O.P.:"
            if (rncsUsuario[i].criador === infos[o]) {
                atributoAtual = "Criador: ";
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
    eventoSelecionaRnc();
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

function renderizarRncPainel(rnc, direcionar) { 
    try {
        document.querySelector(".div-infos-painel-rnc").remove();
    } catch {
    }
    const local = document.querySelector(".cab-container-control-rncs");
    const listaTitulo = ['O.P.', 'Clichê', 'Criador', 'Setor', 'Descrição'];
    const listaDescricao = [rnc.op, rnc.cliche, rnc.criador, rnc.setorCriador, rnc.descricao];
    const divInfos = document.createElement('div');
    divInfos.classList = 'div-infos-painel-rnc';

    criarTabelaDescricao(listaTitulo, listaDescricao, divInfos, local);
}

function criarTabelaDescricao(lista1, lista2, div, divMain) {
    const table = document.createElement('table');
    const body = document.createElement('tbody');

    for (let i in lista1) {
        const tr = document.createElement('tr');
        let th = document.createElement('th');

        if (lista1[i] == 'Descrição') tr.classList = 'trDescricao';

        const t1 = document.createTextNode(lista1[i]);
        const t2 = document.createTextNode(lista2[i]);

        th.appendChild(t1);
        th.classList = 'thDescricaoTitulo'
        tr.appendChild(th);

        th = document.createElement('th');

        th.appendChild(t2);
        tr.appendChild(th);
        body.appendChild(tr);
    }
    table.appendChild(body);
    div.appendChild(table);
    divMain.appendChild(div);  
    table.classList = 'tabelaDescricaoPadrao';
}

function avaliarDirecionamento() {
    const setorDirecionado = document.querySelector("#setor-receptor");
    const checkxboxDirecionamento = document.querySelector(".checkbox-row");
    const x = document.querySelector(".list-checkbox-row");
    a= x

    if (setorDirecionado.value == '') {
        alert("Por favor, indique qual o setor responsável pela Não conformidade");
        return
    }

    for (let i in checkxboxDirecionamento.childNodes) {
        if (i == 'entries') return;
        if (checkxboxDirecionamento.childNodes[i].childNodes[1] !== undefined) {
            console.log(checkxboxDirecionamento.childNodes[i].childNodes[1].childNodes[1].checked === true);
        }          
    }
}

/* function criarTabelaPadrao(listaHead, listaBody, localDiv, localMae) {
    const table = document.createElement('table');
    const head = document.createElement('thead');
    const body = document.createElement('tbody');
    const trHead = document.createElement('tr');
    const trBody = document.createElement('tr');

    for (let i in listaHead) {
        console.log(listaHead)
        const th = document.createElement('th');
        const titulo = document.createTextNode(listaHead[i]);
        th.appendChild(titulo);
        trHead.appendChild(th);
    }
    head.appendChild(trHead);

    for (let i in listaBody) {
        const th = document.createElement('th');
        const titulo = document.createTextNode(listaBody[i]);
        th.appendChild(titulo);
        trBody.appendChild(th);
    }
    body.appendChild(trBody);

    table.appendChild(head);
    table.appendChild(body);

    localDiv.appendChild(table);
    localMae.appendChild(localDiv);
} */

class Rnc {
    constructor(criador ,tipo, setor, data, origem, quantidade, op, cliche, descricao) {
        this.codigo = "ultima RNC + 1",
        this.criador = criador,
        this.tipo = tipo,
        this.setorCriador = setor,
        this.setorResponsavel,
        this.data = data,
        this.origem = origem, 
        this.op = Number(op),
        this.cliche = cliche,
        this.descricao = descricao,
        this.quantidade = Number(quantidade),
        this.receptor = [],
        this.visto,
        this.observadores = [],
        this.imgProb = [],
        this.imgSolu = [],
        this.aberta = true,
        this.lida = false,
        this.status = "aguardando apontamento",
        this.historico = [],
        this.observacoes = [],
        this.estatisticas = []
    }
}

class AnaliseCausas {
    constructor(objCausa) {
        causa = objCausa
    }
}