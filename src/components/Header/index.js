import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import avatar from "../../assets/avatar.png";
import "./header.css";

import { Link } from "react-router-dom";
import { FiPower, FiUser, FiList } from "react-icons/fi";
import { Router } from "react-router-dom/cjs/react-router-dom.min";


export default function Header() {
  const { user, signOut } = useContext(AuthContext);
  const [ teste, setTeste] = useState(false);


  function reloadRoute(){
    if(teste){

      window.location.href = "/dashboard";
    }
  }

  reloadRoute();

  return (
    <div className="sidebar">
      <div>
        <img
          src={user.avatarUrl === null ? avatar : user.avatarUrl}
          alt="Foto avatar"
        />
        <h1>fitnessWeb</h1>
      </div>

      <Link onClick={() => setTeste(true)}>
        <FiList color="#fff" size={24} />
        Dashboard
      </Link>

      <Link to="/users">
        <FiUser color="#fff" size={24} />
        Usuarios
      </Link>

      <Link onClick={() => signOut()}>
        <FiPower color="#fff" size={24} />
        Sair
      </Link>
    </div>
  );
}
