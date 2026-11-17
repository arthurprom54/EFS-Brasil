/* EFS Brasil — configuração editável SEM recompilar o site.
   Edite os valores abaixo diretamente no arquivo publicado (js/config.js). */
window.EFS_CONFIG = {
  /* Link da petição pública no Portal e-Cidadania (Senado Federal).
     Deixe vazio ("") até a petição existir: o site mostra um espaço reservado.
     Quando tiver o link, cole aqui, ex.: "https://www12.senado.leg.br/ecidadania/visualizacaoideia?id=XXXXX" */
  PETITION_URL: "",

  /* Enquete (apoio/contra): endereço da API incluída em /server (Node).
     Se a API não responder, a enquete funciona em MODO LOCAL (só neste navegador)
     e avisa isso na tela — nunca exibe números inventados. */
  POLL_API: "/api/poll",

  /* Formulário de contato: endpoint que recebe POST JSON.
     Opções: "/api/contact" (servidor incluído) ou um serviço de formulários (Formspree, Netlify Forms etc.).
     Vazio = o formulário valida, mas avisa que o envio ainda não foi configurado. */
  FORM_ENDPOINT: "/api/contact",

  /* Analytics — só é carregado DEPOIS do consentimento do visitante (banner de cookies).
     provider: "" (desligado) | "plausible" | "umami" | "ga4"
       plausible: { domain: "seudominio.com.br" }
       umami:     { src: "https://SEU-UMAMI/script.js", id: "ID-DO-SITE" }
       ga4:       { id: "G-XXXXXXXXXX" } */
  ANALYTICS: { provider: "", domain: "", src: "", id: "" },

  /* Vídeo opcional de fundo no topo da home (arquivo seu, ex.: "assets/video/floresta.mp4").
     Vazio = usa a cena ilustrada. */
  HERO_VIDEO: ""
};
