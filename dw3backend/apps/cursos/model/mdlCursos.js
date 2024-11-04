const db = require("../../../database/databaseconfig");

const GetAllCursos = async () => {
  return (
    await db.query(
      "SELECT * " + "FROM cursos where deleted = false ORDER BY descricao ASC"
    )
  ).rows;
};

const GetCursoByID = async (cursoIDPar) => {
  return (
    await db.query(
      "SELECT * " +
        "FROM cursos WHERE cursoid = $1 and deleted = false ORDER BY descricao ASC",
      [cursoIDPar]
    )
  ).rows;
};

const InsertCursos = async (registroPar) => {
  //@ Atenção: aqui já começamos a utilizar a variável msg para retornor erros de banco de dados.
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO cursos " + "values(default, $1, $2, $3, $4)",
        [
          registroPar.codigo,
          registroPar.descricao,
          registroPar.ativo,
          registroPar.deleted,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlCursos|insertCursos] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const UpdateCursos = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    // Converte o valor de 'ativo' para booleano, caso venha como string
    registroPar.ativo = (registroPar.ativo === 'true');

    // Verifica se o valor de registroPar.ativo é um booleano
    if (typeof registroPar.ativo !== 'boolean') {
      throw new Error("O valor de 'ativo' deve ser um booleano (true ou false).");
    }

    // Verifica se os campos obrigatórios estão presentes
    if (!registroPar.cursoid || !registroPar.codigo || !registroPar.descricao) {
      throw new Error("Os campos cursoid, codigo e descricao são obrigatórios.");
    }

    linhasAfetadas = (
      await db.query(
        "UPDATE cursos SET " +
          "codigo = $2, " +
          "descricao = $3, " +
          "ativo = $4, " +
          "deleted = false " +          
          "WHERE cursoid = $1",
        [
            registroPar.cursoid,  // cursoid do registro que está sendo atualizado
            registroPar.codigo,    // novo código
            registroPar.descricao, // nova descrição
            registroPar.ativo      // novo status de ativo
        ]
      )
    ).rowCount; // retorna o número de linhas afetadas
  } catch (error) {
    console.error("Erro ao atualizar cursos:", error);
    msg = "[mdlCursos|UpdateCursos] " + (error.detail || error.message || "Erro desconhecido");
    linhasAfetadas = -1; // define linhas afetadas como -1 em caso de erro
  }
  
  return { linhasAfetadas, msg }; // retorna as linhas afetadas e a mensagem
};



const DeleteCursos = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
    
  try {
    linhasAfetadas = (
    await db.query(
      "UPDATE cursos SET " + "deleted = true " + "WHERE cursoid = $1",
      [registroPar.cursoid]
    )
  ).rowCount;
} catch (error) {
  msg = "[mdlCursos|DeleteCursos] " + error.detail;
  linhasAfetadas = -1;
}

return { msg, linhasAfetadas };
};


module.exports = {
  GetAllCursos,
  GetCursoByID,
  InsertCursos,
  UpdateCursos,
  DeleteCursos,
};
