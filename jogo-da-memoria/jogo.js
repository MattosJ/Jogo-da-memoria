// Array com todas as imagens das cartas (duplicada, pois representam os pares)
const cartas = [
  'imgs/Binário.png', 'imgs/C.png', 'imgs/cpp.png', 'imgs/cSharp.png', 'imgs/Go.png',
  'imgs/Haskell.png', 'imgs/Java.png', 'imgs/js.png', 'imgs/kotlin.png', 'imgs/Lua.png',
  'imgs/php.png', 'imgs/python.png', 'imgs/Ruby.png', 'imgs/SQL.png', 'imgs/Swift.png',
  'imgs/Binário.png', 'imgs/C.png', 'imgs/cpp.png', 'imgs/cSharp.png', 'imgs/Go.png',
  'imgs/Haskell.png', 'imgs/Java.png', 'imgs/js.png', 'imgs/kotlin.png', 'imgs/Lua.png',
  'imgs/php.png', 'imgs/python.png', 'imgs/Ruby.png', 'imgs/SQL.png', 'imgs/Swift.png'
];

// Implementação  do algoritmo Fisher-Yates
const embaralharCartas = (array) => {
  // Cria uma cópia do array para evitar mutação do original
  const copiaArray = [...array];
  
  // Função recursiva interna para realizar o embaralhamento
  const embaralharRecursivo = (arr, indice) => {
    // Caso base: quando chegamos ao início do array
    if (indice === 0) return arr;
    
    // Gera um índice aleatório de 0 até o índice atual
    const indiceAleatorio = Math.floor(Math.random() * (indice + 1));
    
    // Cria um novo array com os elementos trocados
    const novoArray = arr.slice(0);
    
    // Troca os elementos
    [novoArray[indice], novoArray[indiceAleatorio]] = 
      [novoArray[indiceAleatorio], novoArray[indice]];
    
    // Chama recursivamente para o próximo índice
    return embaralharRecursivo(novoArray, indice - 1);
  };
  
  // Inicia a recursão a partir do último elemento
  return embaralharRecursivo(copiaArray, copiaArray.length - 1)
}

// Função estado inicial do jogo
const gerarEstadoInicial = () => {
  return {
    cartas: [], // Array para armazenar as cartas
    viradas: [], // Array para armazenar as cartas viradas
    paresEncontrados: 0, // Contador de pares encontrados
    movimentos: 0, // Contador de movimentos
  }
}

// Atialiazação do estado do jogo
const atualizarEstado = (estado, cartaId) => {
  // Encontra a carta clicada
  const carta = estado.cartas.find(carta => carta.id === cartaId) 

  // Se a carta já estiver virada, não faz nada
  if (carta.virada || carta.encontrada || estado.bloqueado || estado.viradas.includes(cartaId)) {
    return estado;
  }

// Cria um novo estado com a carta virada
  const novoEstado = {
    ...estado,
    cartas: estado.cartas.map(carta => {
      if (carta.id === cartaId) {
        return { ...carta, virada: true }
      }
      return carta
    }),
    movimentos: estado.movimentos + 1,
  } 
  return novoEstado
}

// Função para virar a carta
const virarCarta = (cartaElemento, callback) => {
  console.log('Carta clicada:', cartaElemento.dataset.id);
  const estado = carregarEstado()
  const cartaId = cartaElemento.dataset.id // Obtém o ID da carta clicada
  
  const novoEstado = atualizarEstado(estado, cartaId) // Atualiza o estado do jogo

  cartaElemento.classList.add('virou') // Adiciona a classe de animação

  const estadoAtualizado = {
    ...novoEstado,
    viradas: [...novoEstado.viradas, cartaId]
  }
  
  if (estadoAtualizado.viradas.length === 2) {
    const estadoComPar = verificaPar(estadoAtualizado)
    salvarEstado(estadoComPar)
    callback(estadoComPar)
    
    if (estadoComPar.viradas.length === 2) { // Se não formou par
      setTimeout(() => {
        const estadoReset = resetarCartasNaoPares(estadoComPar)
        salvarEstado(estadoReset)
        document.querySelectorAll('.card').forEach(el => {
          if (estadoReset.viradas.includes(el.dataset.id)) {
            el.classList.remove('virou')
          }
        })
        callback(estadoReset)
      }, 1000)
    }
  } else {
    salvarEstado(estadoAtualizado)
    callback(estadoAtualizado)
  }

  return estadoAtualizado
}

const atualizarCartasViradas = (estado) => {
  document.querySelectorAll('.card').forEach(el => {
    if (estado.viradas.includes(el.dataset.id)) {
      el.classList.remove('virou');
    }
  });
};

// Função para verificar se as cartas formam um par
const verificaPar = (estado) => {
  if (estado.viradas.length !== 2) return estado;
  const [carta1Id, carta2Id] = estado.viradas;
  
  if (carta1Id === carta2Id) {
    return {...estado, bloqueado: true};
  }
  
  const carta1 = estado.cartas.find(carta => carta.id === carta1Id);
  const carta2 = estado.cartas.find(carta => carta.id === carta2Id);

  if (carta1.src === carta2.src) {
    // Atualiza o contador de pares no HTML
    document.getElementById('pares').textContent = `Pares: ${estado.paresEncontrados + 1}`;
    
    return {
      ...estado,
      cartas: estado.cartas.map(c => 
        [carta1Id, carta2Id].includes(c.id) ? { ...c, encontrada: true } : c
      ),
      viradas: [],
      paresEncontrados: estado.paresEncontrados + 1,
      bloqueado: false,
    };
  }
  return {...estado, bloqueado: true};
};

// Função para resetar as cartas que não formaram um par
const resetarCartasNaoPares = (estado) => {
  return {
    ...estado,
    cartas: estado.cartas.map(c => 
      estado.viradas.includes(c.id) ? {...c, virada: false} : c
    ),
    viradas: [],
    bloqueado: false
  }
}

const verificarFimDoJogo = (estado) => {
  return estado.paresEncontrados === estado.cartas.length / 2
}

// Marca um par como encontrado
const marcarParEncontrado = (estado, carta1Id, carta2Id) => {
  return {
    ...estado,
    cartas: estado.cartas.map(c => 
      [carta1Id, carta2Id].includes(c.id) ? {...c, encontrada: true} : c
    ),
    paresEncontrados: estado.paresEncontrados + 1
  }
}

const ehParCorrespondente = (carta1, carta2) => {
  return carta1.src === carta2.src && carta1.id !== carta2.id
}

// Obtém as cartas atualmente viradas
const obterCartasViradas = (estado) => {
  return estado.cartas.filter(c => c.virada && !c.encontrada)
}

// Inicializa as cartas no estado (adaptado do seu embaralharCartas)
const inicializarCartas = (imagens) => {
  const cartasEmbaralhadas = embaralharCartas([...imagens, ...imagens])
  
  return cartasEmbaralhadas.map((src, index) => ({
    id: `carta-${index}`,
    src,
    virada: false,
    encontrada: false
  }))
}

// Função para configurar os eventos das cartas
const configurarEventosCartas = (estado) => {
  document.querySelectorAll('.card').forEach((elemento, index) => {
    const carta = estado.cartas[index];
    elemento.dataset.id = carta.id;
    
    const imagem = elemento.querySelector('img');
    imagem.src = carta.src
    imagem.alt = carta.src.split('/').pop().split('.')[0]

    elemento.addEventListener('click', () => {
      virarCarta(elemento, (novoEstado) => {
        atualizaUI(novoEstado);
        if (verificarFimDoJogo(novoEstado)) {
          mostrarMensagemFimDoJogo(novoEstado)
        }
      })
    })
  })
}

// Função para distribuir as cartas no tabuleiro
const distribuirCartas = () => {
  document.getElementById('rodadas').textContent = 'Rodadas: 0';
  document.getElementById('movimentos').textContent = 'Movimentos: 0';
  document.getElementById('pares').textContent = 'Pares: 0';
  const cartasEmbaralhadas = embaralharCartas(cartas);
  const novoEstado = {
    ...gerarEstadoInicial(),
    cartas: cartasEmbaralhadas.map((src, index) => ({
      id: `carta-${index}`,
      src,
      virada: false,
      encontrada: false
    }))
  }
  salvarEstado(novoEstado);
  configurarEventosCartas(novoEstado);
  return novoEstado;
};

// Fecha as cartas, removendo a classe 'virou'
const fecharTodasCartas = () => {
  const cartas = document.querySelectorAll('.card')
  cartas.forEach(carta => {
    carta.classList.remove('virou')
  })
}

const reiniciarJogo = () => {
  fecharTodasCartas()
  const novoEstado = distribuirCartas()
  atualizaUI(novoEstado)
  return novoEstado
}

// Adiciona o evento para o botão de reiniciar
document.querySelector('.btn-reiniciar').addEventListener('click', reiniciarJogo)

// Executa a distribuição de cartas quando a página carrega
document.addEventListener('DOMContentLoaded', reiniciarJogo)


const mostrarMensagemFimDoJogo = (estado) => {
  setTimeout(() => {
    alert(`Parabéns! Você completou em ${estado.movimentos} movimentos!`)
    reiniciarJogo()
  }, 500)
}

const atualizaUI = (estado) => {
  document.querySelectorAll('.card').forEach(elemento => {
    const cartaId = elemento.dataset.id
    const carta = estado.cartas.find(c => c.id === cartaId)
    
    if (carta.encontrada) {
      elemento.style.visibility = 'virou'
    } else {
      elemento.classList.toggle('virou', carta.virada)
    }
  })
  document.getElementById('rodadas').textContent = `Rodadas: ${estado.movimentos}`
  document.getElementById('movimentos').textContent = `Movimentos: ${estado.movimentos}`
  document.getElementById('pares').textContent = `Pares: ${estado.paresEncontrados}`
}

// Função para verificar se uma string é um JSON válido
const safeParseJSON = (str) => {
  try {
    return { ok: true, value: JSON.parse(str) };
  } catch {
    return { ok: false, value: null };
  }
};

// Função para carregar o estado do jogo do HTML
const carregarEstado = () => {
  const container = document.getElementById('jogo-memoria');
  const result = safeParseJSON(container.dataset.estado || 'null');
  
  return result.ok && result.value 
    ? result.value 
    : {
        ...gerarEstadoInicial(),
        cartas: embaralharCartas([...cartas, ...cartas])
      };
};

const estado = carregarEstado();

// Função para salvar o estado do jogo no HTML
const salvarEstado = (estado) => {
  const container = document.getElementById('jogo-memoria')
  container.dataset.estado = JSON.stringify(estado)
}

// Função para atualizar estado do jogo no HTML
const atualizarEstadoHTML = (estado) => {
  const container = document.getElementById('jogo-memoria')
  container.dataset.estado = JSON.stringify(estado)
}