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
    // const [POKEDEX_URL,setURL]=useState("https://pokeapi.co/api/v2/pokemon");
    // const [pokemonList,setPokemonList]=useState([]);
    // const [isLoading,setIsLoading]=useState(true);
    // const [nextUrl,setNEXT]=useState('')
    // const[prev,setPrev]=useState('')
    const [pokemonListState,setPokemonListState]=useState({
        pokemonList:[],
        isLoading:true,
        pokeUrl:"https://pokeapi.co/api/v2/pokemon",
        nextUrl:'',
        prevUrl:''
    });
    async function downloadPokemons(){
        // setIsLoading(true)
        setPokemonListState((state)=>({...state,isLoading:true}));
        const response=await axios.get(pokemonListState.pokeUrl);//this downloads list of 20 pokemons
        console.log(response.data)
        const pokemonResults=response.data.results;//we get the array of pokemons from result
        // setNEXT(response.data.next);
        // setPrev(response.data.previous);
        setPokemonListState((state)=>
            ({...state,nextUrl:response.data.next,prevUrl:response.data.previous}
        ));
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
        // setPokemonList(res);
        setPokemonListState((state)=>
            ({...state,pokemonList:res,isLoading:false}))
        // setIsLoading(false);
        // setPokemoListState({...pokemonListState,isLoading:false})
        
    }
    useEffect(()=>{
        downloadPokemons();
    },[pokemonListState.pokeUrl])
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
            <div className="pokemon-wrapper">
            {(pokemonListState.isLoading)?'Loading...':
                 pokemonListState.pokemonList.map((poke)=>{
                   return <Pokemon name={poke.name} image={poke.image} key={poke.id} id={poke.id}/>
                 })}
            </div>
            <div className="controls">
                <button disabled={pokemonListState.prevUrl==null} onClick={()=>{
                    const urlToSet=pokemonListState.prevUrl
                    setPokemonListState({...pokemonListState,pokeUrl:urlToSet})
                    }}>Prev</button>
                <button disabled={pokemonListState.nextUrl==null} onClick={()=>{
                    const urlToSet=pokemonListState.nextUrl
                    setPokemonListState({...pokemonListState,pokeUrl:urlToSet})
                    }}>Next</button>
            </div>
        </div>
        </>
    )
}
export default  PokemonList;