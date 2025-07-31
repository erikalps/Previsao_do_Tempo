


let animacaoAtual = null;

const buscar = document.getElementById("buscar")
const res = document.getElementById("res")
const cidade = document.getElementById("cidade_input")
const apiKey = "e9daf430b670509c89280b59d1f2e421"; 
const proximos_previsao = document.getElementById("proximos-dias")
//funçẽs


//faz a requisição da api
const pegarTempo = async(cidadeValor)=>{ //peh
    const apiUrl =`https://api.openweathermap.org/data/2.5/weather?q=${cidadeValor}&units=metric&appid=${apiKey}&lang=pt_br`

    const ans = await fetch(apiUrl)
    const dados = await ans.json()
    return dados
  }



const mostrarTempo = async (cidadeValor)=>{ //pega os dados retornados pela função  pegarTempo e mostra na tela 
  const dados = await pegarTempo(cidadeValor)


  const lugar = document.createElement("div")
  lugar.classList.add("cidade")
  

  //span para o nome de cidade
  let cidadeName = document.createElement("h4")
  cidadeName.classList.add("cidadeName")
  cidadeName.textContent = `${dados.name}`

  //span msg antes de cidade

  let spanCidade = document.createElement("p")
  spanCidade.classList.add("spanCidade")
  spanCidade.textContent = `Resultados para: `

  lugar.appendChild(spanCidade)
  lugar.appendChild(cidadeName)


  //clima
  let clima = document.createElement("h2")
  clima.classList.add("clima")

  // Criando o span para a temperatura
  let tempValor = document.createElement("span")
  tempValor.classList.add("temperatura")
  tempValor.textContent = `${dados.main.temp}`

  // Criando o span para o "°C"
  let celsius = document.createElement("span")
  celsius.classList.add("celsius")
  celsius.textContent = " °C"

  //sensação termica
  let sensTermica = document.createElement("p")
  sensTermica.classList.add("sensTermica")
  sensTermica.textContent = `Sensação termica:  ${dados.main.feels_like}`




  // Adicionando os dois spans dentro do h2
  clima.appendChild(tempValor)
  clima.appendChild(celsius)
  clima.appendChild(sensTermica)
  
  
  //DESCRIÇÃO
  let desc = document.createElement("p")
  desc.classList.add("desc")
  desc.textContent = dados.weather[0].description

  //chama a função que cria icones para a previsão do dia e adiciona em desc
  const icon = document.createElement("img")
  const caminhoImg = await iconsPrevisaoHoje(cidadeValor);
  icon.src = caminhoImg + ".png";
  icon.classList.add("icon")
  desc.appendChild(icon)
  

  res.appendChild(lugar)
  res.appendChild(clima)
  res.appendChild(desc)
  


}

//função que vai retornar icones de acordo com a descrição do tempo

const iconsPrevisaoHoje = async(cidadeValor)=>{
  const dados = await pegarTempo(cidadeValor)

  const desc = dados.weather[0].main

  let icon = " "
  
  if (desc === "Clear") {
    icon = "img/sol";
  } else if (desc === "Rain") {
    icon = "img/chuva";
  } else if (desc === "Clouds") {
    icon = "img/nublado";
  } else if (desc == "Thunderstorm"){
    icon = "img/chuvaComtrovao"
  } else {
    icon = "img/padrao"; // caso não reconheça
  }
  return icon
}




//faz requisição para pegar os dados de previsão para os proximos dias

const proximosDias =async(cidadeValor)=>{
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cidadeValor}&units=metric&appid=${apiKey}&lang=pt_br`;
  const resposta = await fetch(url);
  const dados = await resposta.json();
  console.log("teste2" + JSON.stringify(dados,null, 2))
  
 
  


  const previsoes =[] //array que ira armazenar a previsão dos prox dias

  dados.list.forEach(item => {
    if(item.dt_txt.includes("12:00:00")){
      previsoes.push({
        data: item.dt_txt.split(" ")[0],
        temp: item.main.temp.toFixed(1),
        desc: item.weather[0].description,
        main: item.weather[0].main 
    
      })
    }
  });

  return previsoes
}

//função para mostrar a previsão do tempo para os proximos dias

const MostrarPrevisaoProxDias= async(cidadeValor)=>{
   const previsoes = await proximosDias(cidadeValor)

    proximos_previsao.innerHTML = "";
    
    previsoes.forEach(dia=>{
      

      const dataObj = new Date(dia.data + "T00:00:00");
      const diasSemana = [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado"
      ];

      const nomeDoDia = diasSemana[dataObj.getDay()];

        const bloco = document.createElement("div")
        bloco.classList.add("previsao-dia")
        

        const caminhoIcone = obterIconePorMain(dia.main); 

        bloco.innerHTML = `
          <p>${nomeDoDia}</p>
          <img class ="icon"src="${caminhoIcone}"></img>
          <p>${dia.temp} <strong>Cº</strong></p>
          <p><strong>${dia.desc}</strong></p>
          
        `


        proximos_previsao.appendChild(bloco)
      
      })


}
const obterIconePorMain = (main) => {
  if (main === "Clear") return "img/sol.png";
  if (main === "Rain") return "img/chuva.png";
  if (main === "Clouds") return "img/nublado.png";
  if (main === "Thunderstorm") return "img/chuvaComtrovao.png";
  return "img/padrao.png"; // padrão para os demais
};


//evento
buscar.addEventListener("click", async(e)=>{

  e.preventDefault()
  res.innerHTML = " "

  const cidadeValor = cidade.value;


  res.style.setProperty("background-color", "rgba(255, 255, 255, 0.9)", "important");
  proximos_previsao.style.setProperty("background-color", "rgba(255, 255, 255, 0.9)", "important");

  await mostrarTempo(cidadeValor)
  await MostrarPrevisaoProxDias(cidadeValor)
  
 
})