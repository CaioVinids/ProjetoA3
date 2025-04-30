document.addEventListener("DOMContentLoaded", () => {
    const odsImages = document.querySelectorAll(".ods-images img");
    const modal = document.getElementById("odsModal");
    const closeBtn = modal.querySelector(".close");
    const odsTitle = document.getElementById("ods-title");
    const odsImg = document.getElementById("ods-img");
    const odsDescription = document.getElementById("ods-description");
    const odsGameText = document.getElementById("ods-game-text");
    const odsGameImg = document.getElementById("ods-game-img");
    const odsRecyclingTips = document.getElementById("ods-recycling-tips");

    const odsInfo = {
        "ods4.png": {
            titulo: "ODS 4 - Educação de Qualidade",
            descricao: "Assegurar a educação inclusiva e equitativa de qualidade, e promover oportunidades de aprendizagem ao longo da vida para todos.",
            conexaoJogo: "Nosso jogo educa sobre reciclagem de forma lúdica, mostrando a importância de separar corretamente os resíduos. Cada ponto conquistado representa conhecimento adquirido sobre sustentabilidade.",
            imagemJogo: "../imgs/exemplo2.png",
            dicasReciclagem: [
                "Eduque crianças e adultos sobre a importância da reciclagem",
                "Participe de programas de educação ambiental em sua comunidade",
                "Compartilhe conhecimentos sobre como separar corretamente os resíduos"
            ]
        },
        "ods11.png": {
            titulo: "ODS 11 - Cidades e Comunidades Sustentáveis",
            descricao: "Tornar as cidades e os assentamentos humanos inclusivos, seguros, resilientes e sustentáveis.",
            conexaoJogo: "No jogo, a cobrinha limpa a cidade virtual, representando como pequenas ações individuais contribuem para ambientes urbanos mais limpos. Cada lixo coletado corretamente é um passo para uma cidade mais sustentável.",
            imagemJogo: "../imgs/exemplo1.png",
            dicasReciclagem: [
                "Utilize os pontos de coleta seletiva de sua cidade",
                "Participe de mutirões de limpeza urbana",
                "Denuncie descarte irregular de lixo em sua comunidade"
            ]
        },
        "ods12.png": {
            titulo: "ODS 12 - Consumo e Produção Responsáveis",
            descricao: "Assegurar padrões de produção e de consumo sustentáveis.",
            conexaoJogo: "O jogo ensina sobre consumo consciente - cada item que a cobrinha coleta deve ser destinado ao local correto, assim como na vida real devemos escolher produtos com menor impacto ambiental e descartá-los adequadamente.",
            imagemJogo: "../imgs/exemplo3.png",
            dicasReciclagem: [
                "Prefira produtos com embalagens recicláveis",
                "Reduza o consumo de descartáveis",
                "Repense suas compras - você realmente precisa disso?"
            ]
        },
        "ods13.png": {
            titulo: "ODS 13 - Ação Contra a Mudança Global do Clima",
            descricao: "Tomar medidas urgentes para combater a mudança do clima e seus impactos.",
            conexaoJogo: "A reciclagem correta mostrada no jogo reduz emissões de gases de efeito estufa. Cada acerto na separação do lixo equivale a menos resíduos em aterros, diminuindo a poluição e o impacto climático.",
            imagemJogo: "../imgs/exemplo5.jpg",
            dicasReciclagem: [
                "Recicle para reduzir a extração de matéria-prima virgem",
                "Composte resíduos orgânicos para reduzir metano nos aterros",
                "Escolha produtos com menor pegada de carbono"
            ]
        }
    };

    odsImages.forEach(img => {
        img.addEventListener("click", () => {
            const file = img.getAttribute("src").split("/").pop();
            const info = odsInfo[file];

            if (info) {
                odsTitle.textContent = info.titulo;
                odsImg.src = img.src;
                odsDescription.textContent = info.descricao;
                odsGameText.textContent = info.conexaoJogo;
                odsGameImg.src = info.imagemJogo;

                // Limpar e adicionar novas dicas
                odsRecyclingTips.innerHTML = "";
                info.dicasReciclagem.forEach(dica => {
                    const li = document.createElement("li");
                    li.textContent = dica;
                    odsRecyclingTips.appendChild(li);
                });

                modal.style.display = "block";
            }
        });
    });

    closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = "none";
    };
});