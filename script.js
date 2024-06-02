const playlistContainer = document.getElementById("result-playlists");
const resultArtist = document.getElementById("result-artist");
const searchInput = document.getElementById("search-input");

// Adicionar debounce à função de busca
let debounceTimeout;
searchInput.addEventListener("input", function () {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    const searchTerm = searchInput.value.toLowerCase();
    console.log("searchTerm:", searchTerm);

    playlistContainer.classList.add("hidden");

    if (searchTerm === "") {
      resultArtist.classList.add("hidden");
      playlistContainer.classList.remove("hidden");
      return;
    }
    requestApi(searchTerm);
  }, 300); // Ajuste o tempo de debounce conforme necessário
});

function requestApi(searchTerm) {
  console.log("Chamando requestApi com searchTerm:", searchTerm);

  fetch(`http://localhost:3000/artists?name_like=${searchTerm}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro na solicitação API");
      }
      return response.json();
    })
    .then((results) => {
      console.log("Resultados da API:", results);
      console.log("Número de resultados:", results.length);
      displayResults(results);
    })
    .catch((error) => {
      console.error("Erro na solicitação API:", error);
      resultArtist.innerHTML = "<p>Erro ao buscar artistas. Por favor, tente novamente mais tarde.</p>";
      resultArtist.classList.remove("hidden");
    });
}

function displayResults(results) {
  hidePlaylists();

  // Limpar resultados anteriores
  resultArtist.innerHTML = "";

  if (results.length === 0) {
    // Exibir uma mensagem quando não há resultados
    resultArtist.innerHTML = "<p>Nenhum artista encontrado.</p>";
    resultArtist.classList.remove("hidden");
    return;
  }

  results.forEach((element) => {
    // Criar elementos para cada artista
    const artistContainer = document.createElement("div");
    artistContainer.classList.add("artist-container");

    const artistImage = document.createElement("img");
    artistImage.src = element.urlImg;
    artistImage.alt = element.name;

    const artistName = document.createElement("p");
    artistName.innerText = element.name;

    // Adicionar evento de clique para exibir mais informações
    artistContainer.addEventListener("click", () => {
      alert(`Artista: ${element.name}\nMais informações aqui...`);
    });

    // Adicionar elementos ao contêiner
    artistContainer.appendChild(artistImage);
    artistContainer.appendChild(artistName);

    // Adicionar contêiner de artista aos resultados
    resultArtist.appendChild(artistContainer);
  });

  resultArtist.classList.remove("hidden");
}

function hidePlaylists() {
  playlistContainer.classList.add("hidden");
}
