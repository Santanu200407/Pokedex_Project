import {useEffect,useState} from "react";
import axios from 'axios';
import './PokemonList.css'
import Pokemon from "../Pokemon/Pokemon";
function PokemonList(){
    // const [x,setX]=useState(0);
    // const [y,setY]=useState(0);
    // useEffect(()=>{
    //     console.log("effect called")
    // },[x]);
    const POKEDEX_URL="https://pokeapi.co/api/v2/pokemon";
    const [pokemonList,setPokemonList]=useState([]);
    const [isLoading,setIsLoading]=useState(true);
    async function downloadPokemons(){
        const response=await axios.get(POKEDEX_URL);//this downloads list of pokemons
        console.log(response.data)
        const pokemonResults=response.data.results;//we get the array of pokemons from result
        //iterating over the array of pokemons, and using their url, to create an array of promises
        //that will downloads those 20 pokemons
        const pokemonResultPromise=pokemonResults.map((pokemon)=>axios.get(pokemon.url))
        //passing that promise array to axios.all
        const pokemonData=await axios.all(pokemonResultPromise);//array of 20 pokemon detail data
        console.log(pokemonData)
        //now iterate on the data of each pokemon, and extract id,name,image,types
        const res=pokemonData.map((pokeData)=>{
            const pokemon=pokeData.data;
            return{
                id:pokemon.id,
                name:pokemon.name,
                image:(pokemon.sprites.other)?pokemon.sprites.other.dream_world.front_default:pokemon.sprites.front_shiny,
                types:pokemon.types
            }
        })
        console.log(res);
        setPokemonList(res);
        setIsLoading(false);
        
    }
    useEffect(()=>{
        downloadPokemons();
    },[])
    return (
        <>
        {/* <div>
            X:{x} <button onClick={()=>setX(x+1)}>Inc</button>
        </div>
        <div>
            Y:{y} <button onClick={()=>setY(y+1)}>Inc</button>
        </div> */}
        <div className="pokemon-list-wrapper">
            Pokemon List
            <br />
            {(isLoading)?'Loading...':
                 pokemonList.map((poke)=>{
                   return <Pokemon name={poke.name} image={poke.image} key={poke.id}/>
                 })}
        </div>
        </>
    )
}
export default  PokemonList;