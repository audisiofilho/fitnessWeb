import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import avatar from "../../assets/avatar.png";
import "./header.css";

import { Link } from "react-router-dom";
import { GiMuscleUp } from "react-icons/gi";
import { FiPower } from "react-icons/fi";
import { useParams } from "react-router-dom";

export default function Header() {
  const { user, signOut } = useContext(AuthContext);

  const { fit } = useParams();

  return (
    <div className="sidebar">
      <div>
        <img
          src={user.avatarUrl === null ? avatar : user.avatarUrl}
          alt="Foto avatar"
        />
        <h1>fitnessWeb</h1>
      </div>

      {fit === "Todos" || !fit ? (
        <></>
      ) : (
        <Link to="/dashboard/Todos">
          <GiMuscleUp color="#fff" size={24} />
          Exercicios
        </Link>
      )}

      <Link onClick={() => signOut()}>
        <FiPower color="#fff" size={24} />
        Sair
      </Link>
    </div>
  );
}
