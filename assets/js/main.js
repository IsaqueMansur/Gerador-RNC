document.addEventListener("click", e => {
    const target = e.target.classList[0];
    const encontraSubmit = target.slice(0, 6);

    if (encontraSubmit !== "submit") return

    const tipoSubmit = target.slice(7);
    
    pegarHtmlPainel(tipoSubmit)
})

function pegarHtmlPainel(submit) {
    let informarcoes

    if (submit == "gerar") {
        axios("./criar.html").then((resposta => {
            informarcoes = resposta.data;
            exportarHtmlPainel(informarcoes, submit);
        }))   
    } 
    
    if (submit == "enviadas") {
        axios("./enviadas.html").then((resposta => {
            informarcoes = resposta.data;
            exportarHtmlPainel(informarcoes, submit);
        }))   
    }

    /* if (submit == "recebidas") {
        axios("./criar.html").then((resposta => {
            informarcoes = resposta.data;
            exportarHtmlPainel(informarcoes, submit );
        }))   
    } */
}

function exportarHtmlPainel(html, submit) {
    const local = document.querySelector("#painel-principal");
    local.classList += String(` ${submit}`)
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
        }
        return opcaoSelecionada
    })
}