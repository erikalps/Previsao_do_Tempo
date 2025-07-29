

/*animação*/
let animacaoAtual = null;
lottie.loadAnimation({
  container: document.getElementById('meerkat'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path:'animations/search.json'
});

const buscar = document.getElementById("buscar")
const res = document.getElementById("res")
const cidade = document.getElementById("cidade")
const apiKey = process.env.KEYAPI; 

console.log(apiKey)
//funçẽs


//faz a requisição da api
const pegarTempo = async(cidadeValor)=>{ //peh
    const apiUrl =`https://api.openweathermap.org/data/2.5/weather?q=${cidadeValor}&units=metric&appid=${apiKey}&lang=pt_br`

    const ans = await fetch(apiUrl)
    const dados = await ans.json()
    console.log("teste" + JSON.stringify(dados,null, 2))
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

  let animacao = document.createElement("div")
  animacao.id = "animation"
  
  res.appendChild(lugar)
  res.appendChild(clima)
  res.appendChild(desc)
  res.appendChild(animacao)

}



const animacoes = async (cidadeValor)=>{
  
  let pathAnimacao = " "
  const dados = await pegarTempo(cidadeValor)
  let clima = dados.weather[0].main
  console.log("Teste animacoes " + clima)
  if (clima === "Clear") {
    console.log("Ta clear mesmo")
     pathAnimacao = 'animations/Sunny.json';
  } else if (clima === "Rain") {
     pathAnimacao = 'animations/Rainy.json';
  } else if (clima === "Clouds") {
     console.log("Ta cloud")
      pathAnimacao = 'animations/Cloud.json';
  } 
  
  if (animacaoAtual) {
    animacaoAtual.destroy();
  }

  // Cria nova animação
  

  animacaoAtual = lottie.loadAnimation({
    container: document.getElementById('animation'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: pathAnimacao
  });


}


//eventos 
buscar.addEventListener("click", async(e)=>{

  e.preventDefault()
  res.innerHTML = " "

  const cidadeValor = cidade.value;

  await mostrarTempo(cidadeValor)
  await animacoes(cidadeValor)

})