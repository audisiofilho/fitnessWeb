import { useState, useEffect } from "react";
import "./dashboard.css";

import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiEdit2, FiPlus, FiTrash, FiImage } from "react-icons/fi";
import { FaRunning } from "react-icons/fa";
import { Link } from "react-router-dom";

import firebase from "../../services/firebaseConnection";
import { toast } from "react-toastify";

const listRef = firebase.firestore().collection(" exercises");

export default function Dashboard() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    async function loadExercices() {
      await listRef
        .get()
        .then((snapshot) => {
          updateState(snapshot);
        })
        .catch((err) => {
          console.log(err);
        });

      setLoading(false);
    }

    loadExercices();

    return () => {};
  }, []);

  async function updateState(snapshot) {
    const isCollectionEmpty = snapshot.size === 0;

    if (!isCollectionEmpty) {
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          name: doc.data().name,
          image: doc.data().image,
          series: doc.data().series,
        });
      });

      setExercises((exercises) => [...exercises, ...lista]);
    } else {
      setIsEmpty(true);
    }
  }

  if (loading) {
    return (
      <div>
        <Header />
        <div className="content">
          <Title name="Exercicios">
            <FaRunning size={25} />
          </Title>

          <div className="container dashboard">
            <span>Buscando exercicios...</span>
          </div>
        </div>
      </div>
    );
  }

  async function handleDelete(item) {
    await listRef
      .doc(item.id)
      .delete()
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        toast.error("algo deu errado");
      });
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Exercicios">
          <FaRunning size={25} />
        </Title>

        {exercises.length === 0 ? (
          <div className="container dashboard">
            <span>Nenhum Exercicio registrado...</span>
            <Link to="/new" className="new">
              <FiPlus size={25} color="#fff" />
              Novo Exercicio
            </Link>
          </div>
        ) : (
          <>
            <Link to="/new" className="new">
              <FiPlus size={25} color="#fff" />
              Novo Exercicio
            </Link>
            <table>
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">Series</th>
                  <th scope="col">Imagem</th>
                  <th scope="col">#</th>
                </tr>
              </thead>
              <tbody>
                {exercises.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td data-label="Nome">{item.name}</td>
                      <td data-label="Series">{item.series}</td>
                      <td data-label="Imagem">
                        {item.image === "" ? (
                          <FiImage color="#000" size={45} />
                        ) : (
                          <img
                            src={item.image}
                            alt="img exercicio"
                            sizes="45x45"
                          />
                        )}
                      </td>
                      <td data-label="#">
                        <button
                          className="action"
                          style={{ backgroundColor: "red" }}
                          onClick={() => handleDelete(item)}
                        >
                          <FiTrash color="#fff" size={17} />
                        </button>
                        <Link
                          className="action"
                          style={{ backgroundColor: "#f6a935" }}
                          to={`/new/${item.id}`}
                        >
                          <FiEdit2 color="#fff" size={17} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
