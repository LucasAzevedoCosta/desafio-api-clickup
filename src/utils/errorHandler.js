function handleValidationError(res, errors) {
  const formattedErrors = errors.map((error) => ({
    message: error.message,
    path: error.path.join("."),
  }));

  res.status(422).json({
    error: "Erro de validação",
    details: formattedErrors,
  });
}

function handleServerError(res, error, message = "Erro interno do servidor") {
  console.error("🔥 Server Error:", error);
  res.status(500).json({ error: message });
}

function handleNotFound(res, message = "Recurso não encontrado") {
  res.status(404).json({ error: message });
}

function handleBadRequest(res, message = "Requisição inválida") {
  res.status(400).json({ error: message });
}

function handleUnauthorized(res, message = "Não autorizado") {
  res.status(401).json({ error: message });
}

function handleForbidden(res, message = "Acesso negado") {
  res.status(403).json({ error: message });
}

function handleConflict(res, message = "Conflito de dados") {
  res.status(409).json({ error: message });
}

module.exports = {
  handleServerError,
  handleNotFound,
  handleBadRequest,
  handleUnauthorized,
  handleForbidden,
  handleConflict,
  handleValidationError,
};

