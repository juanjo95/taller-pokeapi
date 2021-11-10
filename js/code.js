class Pokemon {

    url_api = '';
    api;

    constructor(url_api){
        this.url_api = url_api;
    }

    set_url_api(url){
        this.url_api = url;
    }

    consumir_api(){
        this.api = fetch(this.url_api);
        this.interactuar_api();
    }

    interactuar_api(){

        contenedor_pokemones.innerHTML = '';
        disabled_prev = '';
        disabled_next = '';

        this.api.then(res => res.json())
                .then(data => {
                    var indice = 0;
                    for (const pokemon of data.results) {

                        let caracteristicas_pokemon_url = fetch(pokemon.url);
                        caracteristicas_pokemon_url.then(res2 => res2.json())
                                                    .then(caract_pokemon => {

                                                        indice = indice + 1;
                                                        
                                                        var contenedor_abilities = '';
                                                        for (const ability of caract_pokemon.abilities) {          
                                                            contenedor_abilities += `<li class="author">${ability.ability.name}</li>`;
                                                        }
                                                        
                                                        var forma_card = '';
                                                        if(indice % 2 === 0){
                                                            forma_card = 'alt';
                                                        }

                                                        var imagen = '';

                                                        if(caract_pokemon.sprites.back_default == null &&
                                                            caract_pokemon.sprites.back_female == null &&
                                                            caract_pokemon.sprites.back_shiny == null &&
                                                            caract_pokemon.sprites.back_shiny_female == null &&
                                                            caract_pokemon.sprites.front_default == null &&
                                                            caract_pokemon.sprites.front_female == null &&
                                                            caract_pokemon.sprites.front_shiny == null &&
                                                            caract_pokemon.sprites.front_shiny_female == null){
                                                                imagen = 'img/no-image.png';
                                                        } else if(caract_pokemon.sprites.other.dream_world.front_default == null){
                                                            imagen = caract_pokemon.sprites.front_default;
                                                        }else if(caract_pokemon.sprites.front_default == null){
                                                            imagen = caract_pokemon.sprites.back_default;
                                                        }else{
                                                            imagen = caract_pokemon.sprites.other.dream_world.front_default;
                                                        }


                                                        contenedor_pokemones.innerHTML += `
                                                        <div class="col-lg-6">
                                                            <div class="blog-card ${forma_card}">
                                                                <div class="meta">
                                                                    <div class="photo"
                                                                        style="background-image: url(${imagen})">
                                                                    </div>
                                                                    <ul class="details">
                                                                        <p class="text-center">Abilities</p>
                                                                        ${contenedor_abilities}
                                                                    </ul>
                                                                </div>
                                                                <div class="description">
                                                                    <h1>${pokemon.name}</h1>
                                                                    <p></p>
                                                                    <ul class="list-group list-group-horizontal-sm">
                                                                        <li class="list-group-item">Order</li>
                                                                        <li class="list-group-item">Weight</li>
                                                                        <li class="list-group-item">Height</li>
                                                                        <li class="list-group-item">Base_experience</li>
                                                                    </ul>
                                                                    <ul class="list-group list-group-horizontal-sm text-center">
                                                                        <li class="list-group-item" style="min-width:75px">${caract_pokemon.order}</li>
                                                                        <li class="list-group-item" style="min-width:82.5px">${caract_pokemon.height}</li>
                                                                        <li class="list-group-item" style="min-width:79.25px">${caract_pokemon.weight}</li>
                                                                        <li class="list-group-item" style="min-width:156.65px">${caract_pokemon.base_experience}</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        `
                                                    });
                    }

                    if (data.previous == null) {
                        disabled_prev = 'disabled';
                    } else if (data.next == null) {
                        disabled_next = 'disabled';
                    }

                    div_pag.innerHTML = `
                        <button class="btn btn-warning text-white" ${disabled_prev} onclick="paginar('${data.previous}')"><i class="fas fa-backward"></i> Anterior</button>
                        <button class="btn btn-warning text-white" ${disabled_next} onclick="paginar('${data.next}')">Siguiente <i class="fas fa-forward"></i></button>
                    `

                }).catch(error => console.log(error));
    }

}

let contenedor_pokemones = document.getElementById('contenedor-pokemon');

let div_pag = document.querySelector("#paginacion");
let disabled_prev = '';
let disabled_next = '';

var url = "https://pokeapi.co/api/v2/pokemon";
var pokemon = new Pokemon(url);
pokemon.consumir_api();

function paginar(url){
    pokemon.set_url_api(url);
    pokemon.consumir_api();
}