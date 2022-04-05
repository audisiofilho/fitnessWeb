import { useState, useEffect } from "react";
import firebase from "../../services/firebaseConnection";
import { useHistory, useParams } from "react-router-dom";

import { FiPlusCircle, FiUpload, FiEdit2 } from "react-icons/fi";
import Header from "../../components/Header";
import Title from "../../components/Title";

import "./new.css";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function New() {
  const { id } = useParams();
  const history = useHistory();

  const [exercicio, setExercicio] = useState("");
  const [series, setSeries] = useState("");
  const [idCustomer, setIdCustomer] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [imageAvatar, setImageAvatar] = useState(null);
  const [treino, setTreino] = useState("Peito");

  useEffect(() => {
    async function loadId() {
      if (id) {
        await firebase
          .firestore()
          .collection(" exercises")
          .doc(id)
          .get()
          .then((snapshot) => {
            setExercicio(snapshot.data().name);
            setSeries(snapshot.data().series);
            setAvatarUrl(snapshot.data().image);
            setTreino(snapshot.data().treino);

            setIdCustomer(true);
          })
          .catch((err) => {
            console.log("ERRO NO ID PASSADO: ", err);
            setIdCustomer(false);
          });
      }
    }
    loadId();
  }, [id]);

  function handleFile(e) {
    if (e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === "image/jpeg" || image.type === "image/png") {
        setImageAvatar(image);
        setAvatarUrl(URL.createObjectURL(e.target.files[0]));
      } else {
        alert("Envie uma imagem do tipo JPEG ou PNG");
        setImageAvatar(null);
        return null;
      }
    }
  }

  async function handleUpload(e) {
    if (idCustomer) {
      const uploadTask = await firebase
        .storage()
        .ref(`images/${id}/${imageAvatar.name}`)
        .put(imageAvatar)
        .then(async () => {
          console.log("foto enviada com sucesso");

          await firebase
            .storage()
            .ref(`images/${id}`)
            .child(imageAvatar.name)
            .getDownloadURL()
            .then(async (url) => {
              let urlFoto = url;

              await firebase
                .firestore()
                .collection(" exercises")
                .doc(id)
                .update({
                  image: urlFoto,
                  name: exercicio,
                  series: series,
                  treino: treino,
                });

              toast.success("Exercicio editado com sucesso!");
              history.push("/dashboard");
            });
        })
        .catch((err) => {
          toast.error("OPS! Erro ao editar, tente mais tarde.");
          console.log(err);
        });
    }
  }

  async function handleSave(e) {
    e.preventDefault();

    if (id) {
      if (imageAvatar === null && (exercicio !== "" || series !== "")) {
        await firebase
          .firestore()
          .collection(" exercises")
          .doc(id)
          .update({
            name: exercicio,
            series: series,
            treino: treino,
          })
          .then(() => {
            toast.success("Exercicio editado com sucesso!");
            history.push("/dashboard");
          })
          .catch((err) => {
            toast.error("OPS! Erro ao editar, tente mais tarde.");
            console.log(err);
          });
      } else if (exercicio !== "" && imageAvatar !== null) {
        handleUpload();
      }
    }
  }

  async function handleRegister(e) {
    e.preventDefault();

    await firebase
      .firestore()
      .collection(" exercises")
      .add({
        name: exercicio,
        series: series,
        treino: treino,
        image: "",
      })
      .then(() => {
        toast.success("Exercicio criado com sucesso!");
        history.push("/dashboard");
      })
      .catch((error) => {
        toast.error("Ops! Erro ao registrar! Tente mais tarde!");
        console.log(error);
      });
  }

  return (
    <div>
      <Header />
      <div className="content">
        {id ? (
          <Title name="Editar Exercicio">
            <FiEdit2 size={25} />
          </Title>
        ) : (
          <Title name="Novo Exercicio">
            <FiPlusCircle size={25} />
          </Title>
        )}

        <div className="contaier">
          <form className="form-profile" onSubmit={ id ? handleSave : handleRegister}>
            <label>Exercicio</label>
            <input
              type="text"
              value={exercicio}
              onChange={(e) => setExercicio(e.target.value)}
            />

            <label>Series</label>
            <input
              type="text"
              value={series}
              onChange={(e) => setSeries(e.target.value)}
            />

            <label>Treino</label>
            <select value={treino} onChange={(e) => setTreino(e.target.value)}>
              <option value="Peito">Peito</option>
              <option value="Costas">Costas</option>
              <option value="Pernas">Pernas</option>
              <option value="Abdominal">Abdominal</option>
              <option value="Funcional">Funcional</option>
            </select>

            {id ? (
              <label className="label-avatar">
                <span>
                  <FiUpload color="#000" size={50} />
                </span>
                <input type="file" accept="image/*" onChange={handleFile} />
                <br />

                {avatarUrl === "" ? (
                  <div></div>
                ) : (
                  <img
                    src={avatarUrl}
                    width="250"
                    height="250"
                    alt="Foto de perfil de usuario"
                  />
                )}
              </label>
            ) : (
              <div></div>
            )}
            <button type="submit">{id ? "Editar" : "Registrar"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
