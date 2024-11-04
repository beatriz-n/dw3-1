const axios = require("axios");
const moment = require("moment");

const manutCursos = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;

  try {
    const resp = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllCursos", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    return res.render("cursos/view/vwCursos.njk", {
      title: "Manutenção de cursos",
      data: resp.data.registro,
      erro: null,
      userName: userName,
    });
  } catch (error) {
    let remoteMSG;
    if (error.code === "ECONNREFUSED") {
      remoteMSG = "Servidor indisponível";
    } else if (error.response && error.response.status === 401) {
      remoteMSG = "Usuário não autenticado";
    } else {
      remoteMSG = error.message;
    }

    return res.render("cursos/view/vwCursos.njk", {
      title: "Manutenção de cursos",
      data: null,
      erro: remoteMSG,
      userName: userName,
    });
  }
};


const insertCursos = async (req, res) => {
  const token = req.session.token;

  if (req.method === "GET") {
    try {
      const cursos = await axios.get(process.env.SERVIDOR_DW3Back + "/GetAllCursos", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      return res.render("cursos/view/vwFCrCursos.njk", {
        title: "Cadastro de cursos",
        data: null,
        erro: null,
        curso: cursos.data.registro,
        userName: req.session.userName,
      });
    } catch (error) {
      return res.render("cursos/view/vwFCrCursos.njk", {
        title: "Cadastro de cursos",
        data: null,
        erro: error.message,
        curso: null,
        userName: req.session.userName,
      });
    }
  } else {
    const regData = req.body;

    try {
      const response = await axios.post(process.env.SERVIDOR_DW3Back + "/insertCursos", regData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        timeout: 5000,
      });
      console.log(response.data);
      return res.json({
        status: response.data.status,
        msg: response.data.status,
        data: response.data,
        erro: null,
      });
    } catch (error) {
      return res.json({
        status: "Error",
        msg: error.message,
        data: null,
        erro: error.message,
      });
    }
  }
};

const ViewCursos = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;

  if (req.method === "GET") {
    const id = parseInt(req.params.id);

    try {
      const response = await axios.post(process.env.SERVIDOR_DW3Back + "/getCursoByID", { cursoid: id }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === "ok") {
        const cursos = await axios.get(process.env.SERVIDOR_DW3Back + "/GetAllCursos", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        response.data.registro[0].datanascimento = moment(response.data.registro[0].datanascimento).format("YYYY-MM-DD");

        return res.render("cursos/view/vwFRUDrCursos.njk", {
          title: "Visualização de cursos",
          data: response.data.registro[0],
          disabled: true,
          curso: cursos.data.registro,
          userName: userName,
        });
      } else {
        console.log("[ctlCursos|ViewCursos] ID de curso não localizado!");
        return res.json({ status: "Error", msg: "Curso não localizado!" });
      }
    } catch (error) {
      console.error("[ctlCursos|ViewCursos] Erro:", error);
      return res.json({ status: "Error", msg: "Erro ao buscar curso!" });
    }
  }
};

const UpdateCurso = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;

  if (req.method === "GET") {
    const id = parseInt(req.params.id);

    try {
      const response = await axios.post(process.env.SERVIDOR_DW3Back + "/getCursoByID", { cursoid: id }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === "ok") {
        const cursos = await axios.get(process.env.SERVIDOR_DW3Back + "/GetAllCursos", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        response.data.registro[0].datanascimento = moment(response.data.registro[0].datanascimento).format("YYYY-MM-DD");

        return res.render("cursos/view/vwFRUDrCursos.njk", {
          title: "Atualização de dados de cursos",
          data: response.data.registro[0],
          disabled: false,
          curso: cursos.data.registro,
          userName: userName,
        });
      } else {
        console.log("[ctlCursos|UpdateCurso] Dados não localizados");
        return res.json({ status: "Error", msg: "Dados não localizados" });
      }
    } catch (error) {
      console.error("[ctlCursos|UpdateCurso] Erro:", error);
      return res.json({ status: "Error", msg: "Erro ao buscar dados" });
    }
  } else {
    const regData = req.body;
    console.log("Valor dos dados: ", JSON.stringify(regData))
    try {
      const response = await axios.post(process.env.SERVIDOR_DW3Back + "/updateCursos", regData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        timeout: 5000,
      });

      return res.json({
        status: response.data.status,
        msg: response.data.status,
        data: response.data,
        erro: null,
      });
    } catch (error) {
      console.error('[ctlCursos|UpdateCurso] Erro ao atualizar dados:', error.message);
      return res.json({
        status: "Error",
        msg: error.message,
        data: null,
        erro: error.message,
      });
    }
  }
};

const DeleteCurso = async (req, res) => {
  const regData = req.body;
  const token = req.session.token;

  try {
    const response = await axios.post(process.env.SERVIDOR_DW3Back + "/DeleteCursos", regData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      timeout: 5000,
    });

    return res.json({
      status: response.data.status,
      msg: response.data.status,
      data: response.data,
      erro: null,
    });
  } catch (error) {
    console.error('[ctlCursos|DeleteCurso] Erro ao deletar dados:', error.message);
    return res.json({
      status: "Error",
      msg: error.message,
      data: null,
      erro: error.message,
    });
  }
};

module.exports = {
  manutCursos,
  insertCursos,
  ViewCursos,
  UpdateCurso,
  DeleteCurso
};
