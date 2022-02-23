import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import avatar from "../../assets/avatar.png";
import './header.css';

import { Link } from 'react-router-dom';
import { GiMuscleUp } from "react-icons/gi";
import { FiPower } from 'react-icons/fi';

export default function Header(){
    const { user, signOut } = useContext(AuthContext);

    return(
        <div className="sidebar">
            <div>
                <img src={user.avatarUrl === null ? avatar : user.avatarUrl } alt="Foto avatar"/>
                <h1>fitnessWeb</h1>
            </div>


            <Link to="/dashboard">
                <GiMuscleUp color="#fff" size={24}/>
                Exercicios
            </Link>

            <Link onClick={()=> signOut()}>
                <FiPower color="#fff" size={24}/>
                Sair
            </Link>
        </div>
    )
}