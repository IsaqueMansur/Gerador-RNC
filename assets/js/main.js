document.querySelector("#tabela-opcoes-menu").addEventListener("click", e => {
    const target = e.target.classList[0];
    const encontraSubmit = target.slice(0, 6);

    if (encontraSubmit !== "submit") return

    const tipoSubmit = target.slice(7);
    
    pegarHtmlPainel(tipoSubmit)
})

function pegarHtmlPainel(submit) {
    let informarcoes

    if (submit == "gerar") {
        axios("../html/criar.html").then((resposta => {
            informarcoes = resposta.data;
            exportarHtmlPainel(informarcoes, submit);
            validaRnc();
        }))   
    } 
    
    if (submit == "enviadas") {
        axios("../html/enviadas.html").then((resposta => {
            informarcoes = resposta.data;
            exportarHtmlPainel(informarcoes, submit);
        }))   
    }

    if (submit == "recebidas") {
        axios("../html/recebidas.html").then((resposta => {
            informarcoes = resposta.data;
            exportarHtmlPainel(informarcoes, submit);
        }))   
    }
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
        return opcaoSelecionada
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
        console.log(rncGerada)
        return
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
        this.receptor = null,
        this.observadores = [],
        this.imgProb = [],
        this.imgSolu = [],
        this.aberta = true,
        this.status = "aguardando apontamento"
    }
}

async function testeBancoUsers() {

    await axios("../../json/users.json").then((resposta => {
        users = resposta.data;
    }))
    console.log(users)
}
