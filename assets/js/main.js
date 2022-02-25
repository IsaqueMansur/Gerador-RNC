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
    
    /* if (submit == "enviadas") {
        axios("./criar.html").then((resposta => {
            informarcoes = resposta.data;
            exportarHtmlPainel(informarcoes, submit);
        }))   
    }

    if (submit == "recebidas") {
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
    eventoOrigemRnc();
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