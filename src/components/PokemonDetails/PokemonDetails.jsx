import axios from "axios";
import { useParams } from "react-router-dom";
import { useState,useEffect } from "react";
import './PokemonDetails.css'
function PokemonDetails(){
    const {id} =useParams();
    const [pokemon,setPokemon]=useState({});
    const [check,setc]=useState(false)
    async function downloadPokemon(){
        setc(false)
        const response=await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
        setPokemon({
            name:response.data.name,
            image:response.data.sprites.other.dream_world.front_default,
            weight:response.data.weight,
            height:response.data.height,
            types:response.data.types.map((t)=>t.type.name)
        })
        setc(true)
    }
    useEffect(()=>{
        downloadPokemon();
    },[]);
    return( 
        
    <div className="pokemon-details-wrapper">
        <img className="pokemon-details-image" src={pokemon.image}/>
        <div className="pokemon-details-name"><span>{pokemon.name}</span></div>
        <div className="pokemon-details-name">Height:{pokemon.height}</div>
        <div className="pokemon-details-name">Weight:{pokemon.weight}</div>
        <div className="pokemon-details-types">
            {check?pokemon.types.map((t)=><div  key={t}>{t}</div>):"Loading"}
        </div>
    </div> 
)
}
export default PokemonDetails;