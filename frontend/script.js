(() => {
  // ✅ URLs fijas (cámbialas si despliegas en la nube)
  const AUTH_BASE = "http://localhost:3001/api";
  const TASKS_BASE = "http://localhost:3002/api";

  const $ = (id) => document.getElementById(id);

  // Elementos del DOM
  const regEmail = $("regEmail");
  const regPass = $("regPass");
  const btnRegister = $("btnRegister");
  const btnQuickAccount = $("btnQuickAccount");
  const regMsg = $("regMsg");

  const logEmail = $("logEmail");
  const logPass = $("logPass");
  const btnLogin = $("btnLogin");
  const btnLogout = $("btnLogout");
  const loginMsg = $("loginMsg");

  const newTask = $("newTask");
  const btnAddTask = $("btnAddTask");
  const taskList = $("taskList");
  const tasksMsg = $("tasksMsg");

  // Estado (solo token)
  let state = {
    token: localStorage.getItem("accessToken") || "",
  };

  // Helpers
  function setToken(t) {
    state.token = t || "";
    if (t) localStorage.setItem("accessToken", t);
    else localStorage.removeItem("accessToken");
    // Mostrar estado en vez del token real
    loginMsg.textContent = state.token ? "✅ Sesión activa" : "❌ Sin sesión";
  }

  async function apiFetch(url, options = {}) {
    const headers = options.headers || {};
    if (state.token) headers["Authorization"] = "Bearer " + state.token;
    headers["Content-Type"] = "application/json";
    const res = await fetch(url, { ...options, headers });
    const text = await res.text();
    try {
      return {
        ok: res.ok,
        status: res.status,
        data: text ? JSON.parse(text) : {},
      };
    } catch {
      return { ok: res.ok, status: res.status, data: text };
    }
  }

  // ==== Auth ====
  btnQuickAccount.addEventListener("click", () => {
    const rnd = Math.floor(Math.random() * 1e6);
    regEmail.value = `demo${rnd}@ex.com`;
    regPass.value = "12345678";
  });

  btnRegister.addEventListener("click", async () => {
    regMsg.textContent = "Registrando...";
    const url = `${AUTH_BASE}/auth/register`;
    const body = { email: regEmail.value.trim(), password: regPass.value };
    const { ok, status, data } = await apiFetch(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
    regMsg.textContent = ok
      ? `✅ Registro exitoso: ${data.email || ""}`
      : `❌ Error (${status}): ${(data && data.error) || "falló"}`;
  });

  btnLogin.addEventListener("click", async () => {
    loginMsg.textContent = "Iniciando sesión...";
    const url = `${AUTH_BASE}/auth/login`;
    const body = { email: logEmail.value.trim(), password: logPass.value };
    const { ok, status, data } = await apiFetch(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (ok) {
      setToken(data.accessToken);
      loginMsg.textContent = "✅ Login exitoso";
      await loadTasks();
    } else {
      setToken("");
      loginMsg.textContent = `❌ Error (${status}): ${
        (data && data.error) || "falló"
      }`;
    }
  });

  btnLogout.addEventListener("click", () => {
    setToken("");
    taskList.innerHTML = "";
    loginMsg.textContent = "👋 Sesión cerrada.";
    setTimeout(() => (loginMsg.textContent = ""), 1200);
  });

  // ==== Tasks ====
  async function loadTasks() {
    tasksMsg.textContent = "Cargando...";
    const url = `${TASKS_BASE}/tasks`;
    const { ok, status, data } = await apiFetch(url);
    if (!ok) {
      tasksMsg.textContent = `❌ Error (${status}): ${
        (data && data.error) || "no autorizado"
      }`;
      return;
    }
    tasksMsg.textContent = "";
    renderTasks(Array.isArray(data) ? data : []);
  }

  function renderTasks(tasks) {
    taskList.innerHTML = "";
    for (const t of tasks) {
      const li = document.createElement("li");

      const left = document.createElement("div");
      left.className = "stack";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = !!t.done;
      cb.addEventListener("change", async () => {
        await updateTask(t._id, { done: cb.checked });
      });

      const span = document.createElement("span");
      span.textContent = t.title;
      span.className = "task-title" + (t.done ? " done" : "");
      left.appendChild(cb);
      left.appendChild(span);

      const right = document.createElement("div");
      right.className = "stack";
      const del = document.createElement("button");
      del.className = "secondary";
      del.textContent = "Borrar";
      del.addEventListener("click", async () => {
        await deleteTask(t._id);
      });
      right.appendChild(del);

      li.appendChild(left);
      li.appendChild(right);
      taskList.appendChild(li);
    }
  }

  btnAddTask.addEventListener("click", async () => {
    const title = newTask.value.trim();
    if (!title) return;
    const url = `${TASKS_BASE}/tasks`;
    const { ok, status, data } = await apiFetch(url, {
      method: "POST",
      body: JSON.stringify({ title }),
    });
    if (!ok) {
      tasksMsg.textContent = `❌ Error (${status}): ${
        (data && data.error) || "falló"
      }`;
      return;
    }
    newTask.value = "";
    await loadTasks();
  });

  async function updateTask(id, patch) {
    const url = `${TASKS_BASE}/tasks/${id}`;
    const { ok, status, data } = await apiFetch(url, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    if (!ok) {
      tasksMsg.textContent = `❌ Error (${status}): ${
        (data && data.error) || "falló"
      }`;
      return;
    }
    await loadTasks();
  }

  async function deleteTask(id) {
    const url = `${TASKS_BASE}/tasks/${id}`;
    const { ok, status } = await apiFetch(url, { method: "DELETE" });
    if (!ok) {
      tasksMsg.textContent = `❌ Error (${status}): no se pudo borrar.`;
      return;
    }
    await loadTasks();
  }

  // Si ya hay token guardado, carga tareas al abrir
  if (state.token) loadTasks();
})();
