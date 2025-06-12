const { z } = require("zod");
const {
  getTasksFromClickUp,
  createTaskInClickUp,
} = require("../services/clickup.service");
const { db } = require("../db/index");
const { handleServerError, handleValidationError } = require("../utils/errorHandler");
const { tasks } = require("../db/schema");
const { eq } = require("drizzle-orm");

module.exports = {
  syncTasks: async (req, res) => {
    try {
      const listId = process.env.CLICKUP_LIST_ID;

      if (!listId) {
        return handleServerError(
          res,
          null,
          "CLICKUP_LIST_ID não configurado no ambiente."
        );
      }

      const clickupTasks = await getTasksFromClickUp(listId);

      if (!Array.isArray(clickupTasks) || clickupTasks.length === 0) {
        return handleNotFound(res, "Nenhuma tarefa encontrada no ClickUp.");
      }

      for (const t of clickupTasks) {
        await db
          .insert(tasks)
          .values({
            id: t.id,
            title: t.name || "Sem título",
            description: t.description || "",
            status: t.status?.status || "to do",
            startDate: t.start_date ? new Date(parseInt(t.start_date)) : null,
            deadline: t.due_date ? new Date(parseInt(t.due_date)) : null,
          })
          .onConflictDoNothing();
      }

      const allTasks = await db.select().from(tasks);
      res.json(allTasks);
    } catch (err) {
      handleServerError(res, err, "Erro ao sincronizar tarefas com o ClickUp");
    }
  },

  createTask: async (req, res) => {
    try {
      const listId = process.env.CLICKUP_LIST_ID;
      const { title, description, status, startDate, dueDate } = req.body;

      const createTaskSchema = z.object({
        title: z.string().min(1, "O título da tarefa é obrigatório."),
        description: z.string().optional(),
        status: z.string().default("to do"),
        startDate: z
          .number()
          .optional()
          .refine((val) => !val || !isNaN(val), {
            message: "Data de início inválida.",
          }),
        dueDate: z
          .number()
          .optional()
          .refine((val) => !val || !isNaN(val), {
            message: "Data de término inválida.",
          }),
      });

      const parsedBody = createTaskSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return handleValidationError(res, parsedBody.error.errors);
      }

      if (!listId) {
        return handleServerError(res, null, "CLICKUP_LIST_ID não configurado no ambiente.");
      }

      const taskData = {
        name: title,
        description,
        status,
        start_date: startDate ? new Date(startDate).getTime() : undefined,
        due_date: dueDate ? new Date(dueDate).getTime() : undefined,
      };

      const created = await createTaskInClickUp(listId, taskData);

      const drizzleTask = {
        id: created.id,
        title: created.name || title,
        description: created.description || description || "",
        status: created.status?.status || status || "to do",
        startDate: created.start_date
          ? new Date(Number(created.start_date))
          : null,
        deadline: created.due_date ? new Date(Number(created.due_date)) : null,
      };

      await db.insert(tasks).values(drizzleTask);

      res.status(201).json(created);
    } catch (err) {
      return handleServerError
        ? handleServerError(res, err, "Erro ao criar tarefa no ClickUp")
        : res
            .status(500)
            .json({
              error: "Erro ao criar tarefa no ClickUp",
              detail: err.message,
            });
    }
  },

  deleteTask: async (req, res) => {
  try {
    const deleteTaskSchema = z.object({
      id: z.string().min(1, "ID da tarefa é obrigatório.")
        .regex(/^[a-zA-Z0-9]+$/, "ID da tarefa deve ser de caracteres alfanuméricos."),
    });

    const parsedParams = deleteTaskSchema.safeParse(req.params);

    if (!parsedParams.success) {
      return handleValidationError(res, parsedParams.error.errors);
    }

    const { id } = parsedParams.data;

    const deleted = await db.delete(tasks).where(eq(tasks.id, id));

    if (deleted.rowCount === 0) {
      return handleNotFound(res, "Tarefa não encontrada com o ID fornecido.");
    }

    res.status(200).json({ message: "Tarefa removida com sucesso." });

  } catch (err) {
    console.error("Erro inesperado:", err);
    handleServerError(res, err, "Erro ao tentar deletar a tarefa.");
  }
},
};
