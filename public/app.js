const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const state = {
  token: localStorage.getItem("stockfacil_token"),
  user: null,
  products: [],
  categories: [],
  movements: [],
  sales: [],
  socket: null,
};
const money = (value) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(
    value || 0,
  );
const date = (value) =>
  new Intl.DateTimeFormat("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character],
  );

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
      ...options.headers,
    },
  });
  const body =
    response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(body.error || "No fue posible completar la operación");
  return body;
}

function formObject(form) {
  return Object.fromEntries(new FormData(form));
}
function showAuth(panel) {
  ["login", "register", "forgot", "reset"].forEach(
    (name) => ($(`#${name}Panel`).hidden = name !== panel),
  );
  $("#authMessage").textContent = "";
}
function message(text, error = false) {
  const node = $("#appMessage");
  node.style.color = error ? "#aa3e32" : "#176b4a";
  node.textContent = text;
  setTimeout(() => {
    if (node.textContent === text) node.textContent = "";
  }, 4000);
}
function setSession(data) {
  state.token = data.token;
  state.user = data.user;
  localStorage.setItem("stockfacil_token", data.token);
  startApp();
}

$("#showRegister").onclick = () => showAuth("register");
$("#showForgot").onclick = () => showAuth("forgot");
$$(".backLogin").forEach(
  (button) => (button.onclick = () => showAuth("login")),
);
$("#loginForm").onsubmit = async (event) => {
  event.preventDefault();
  try {
    setSession(
      await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(formObject(event.target)),
      }),
    );
  } catch (error) {
    $("#authMessage").textContent = error.message;
  }
};
$("#registerForm").onsubmit = async (event) => {
  event.preventDefault();
  try {
    setSession(
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify(formObject(event.target)),
      }),
    );
  } catch (error) {
    $("#authMessage").textContent = error.message;
  }
};
$("#forgotForm").onsubmit = async (event) => {
  event.preventDefault();
  try {
    const result = await api("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(formObject(event.target)),
    });
    $("#authMessage").textContent = result.message;
  } catch (error) {
    $("#authMessage").textContent = error.message;
  }
};
$("#resetForm").onsubmit = async (event) => {
  event.preventDefault();
  try {
    const token = new URLSearchParams(location.search).get("resetToken");
    await api("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, ...formObject(event.target) }),
    });
    history.replaceState({}, "", "/");
    showAuth("login");
    $("#authMessage").textContent =
      "Contraseña actualizada. Ya puedes iniciar sesión.";
  } catch (error) {
    $("#authMessage").textContent = error.message;
  }
};

async function startApp() {
  try {
    if (!state.user) state.user = await api("/auth/me");
  } catch {
    logout();
    return;
  }
  $("#authView").hidden = true;
  $("#appView").hidden = false;
  $("#userName").textContent = state.user.nombre;
  $("#userRole").textContent = state.user.rol;
  $("#avatar").textContent = state.user.nombre[0].toUpperCase();
  $$("[data-admin]").forEach(
    (node) => (node.hidden = state.user.rol !== "administrador"),
  );
  connectRealtime();
  await refreshAll();
}
function logout() {
  state.token = null;
  state.user = null;
  localStorage.removeItem("stockfacil_token");
  state.socket?.disconnect();
  $("#appView").hidden = true;
  $("#authView").hidden = false;
  showAuth("login");
}
$("#logout").onclick = logout;

function connectRealtime() {
  state.socket?.disconnect();
  state.socket = io({ auth: { token: state.token } });
  state.socket.on("connect", () => {
    $("#connection").textContent = "En tiempo real";
    $("#connection").classList.add("online");
  });
  state.socket.on("disconnect", () => {
    $("#connection").textContent = "Reconectando…";
    $("#connection").classList.remove("online");
  });
  [
    "producto:creado",
    "producto:actualizado",
    "inventario:actualizado",
    "venta:registrada",
    "stock:bajo",
  ].forEach((event) => state.socket.on(event, () => refreshAll()));
}

async function refreshAll() {
  try {
    [state.products, state.categories, state.movements, state.sales] =
      await Promise.all([
        api("/productos"),
        api("/categorias"),
        api("/inventario"),
        api("/ventas"),
      ]);
    render();
    if (state.user.rol === "administrador") await loadAdminData();
  } catch (error) {
    message(error.message, true);
  }
}
function optionList(items, label) {
  return `<option value="">Selecciona</option>${items.map((item) => `<option value="${escapeHtml(item._id)}">${escapeHtml(label(item))}</option>`).join("")}`;
}
function render() {
  const active = state.products.filter((p) => p.activo);
  const low = active.filter((p) => p.stock <= p.stockMinimo);
  $("#statProducts").textContent = active.length;
  $("#statStock").textContent = active.reduce((sum, p) => sum + p.stock, 0);
  $("#statLow").textContent = low.length;
  $("#statValue").textContent = money(
    active.reduce((sum, p) => sum + p.stock * p.precio, 0),
  );
  $("#lowStockList").innerHTML = low.length
    ? low
        .map(
          (p) =>
            `<div><div><b>${escapeHtml(p.nombre)}</b><small>${escapeHtml(p.sku)}</small></div><span class="badge">${p.stock} / ${p.stockMinimo}</span></div>`,
        )
        .join("")
    : "<p>No hay productos con stock bajo.</p>";
  renderProducts();
  const productsOptions = optionList(
    active,
    (p) => `${p.nombre} · ${p.stock} disponibles`,
  );
  $("#inventoryProduct").innerHTML = productsOptions;
  $("#saleProduct").innerHTML = productsOptions;
  $("#productCategory").innerHTML = optionList(
    state.categories,
    (c) => c.nombre,
  );
  $("#inventoryTable").innerHTML = state.movements
    .map(
      (m) =>
        `<tr><td>${date(m.createdAt)}</td><td>${escapeHtml(m.producto?.nombre || "Producto eliminado")}</td><td>${escapeHtml(m.tipo)}</td><td>${m.cantidad}</td><td>${m.stockAnterior} → ${m.stockNuevo}</td></tr>`,
    )
    .join("");
  $("#salesTable").innerHTML = state.sales
    .map(
      (sale) =>
        `<tr><td>${date(sale.createdAt)}</td><td>${sale.productos.map((p) => `${p.cantidad}× ${escapeHtml(p.producto?.nombre || "Producto")}`).join(", ")}</td><td>${money(sale.total)}</td><td>${escapeHtml(sale.registradaPor?.nombre || "Sin registro")}</td></tr>`,
    )
    .join("");
}
function renderProducts() {
  const term = $("#productSearch").value.toLowerCase();
  $("#productsTable").innerHTML = state.products
    .filter((p) => `${p.nombre} ${p.sku}`.toLowerCase().includes(term))
    .map(
      (p) =>
        `<tr><td><b>${escapeHtml(p.nombre)}</b></td><td>${escapeHtml(p.sku)}</td><td>${escapeHtml(p.categoria?.nombre || "—")}</td><td>${money(p.precio)}</td><td class="${p.stock <= p.stockMinimo ? "stock-low" : ""}">${p.stock}</td></tr>`,
    )
    .join("");
}
$("#productSearch").oninput = renderProducts;
$("#showProductForm").onclick = () =>
  ($("#productForm").hidden = !$("#productForm").hidden);
$("#newCategory").onclick = async () => {
  const nombre = prompt("Nombre de la nueva categoría");
  if (!nombre) return;
  try {
    await api("/categorias", {
      method: "POST",
      body: JSON.stringify({ nombre }),
    });
    message("Categoría creada");
    await refreshAll();
  } catch (error) {
    message(error.message, true);
  }
};
$("#productForm").onsubmit = async (event) => {
  event.preventDefault();
  const body = formObject(event.target);
  ["precio", "stock", "stockMinimo"].forEach(
    (key) => (body[key] = Number(body[key])),
  );
  try {
    await api("/productos", { method: "POST", body: JSON.stringify(body) });
    event.target.reset();
    message("Producto creado");
    await refreshAll();
  } catch (error) {
    message(error.message, true);
  }
};
$("#inventoryForm").onsubmit = async (event) => {
  event.preventDefault();
  const body = formObject(event.target);
  const tipo = body.tipo;
  delete body.tipo;
  body.cantidad = Number(body.cantidad);
  try {
    await api(`/inventario/${tipo}`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    event.target.reset();
    message("Movimiento registrado");
    await refreshAll();
  } catch (error) {
    message(error.message, true);
  }
};
$("#saleForm").onsubmit = async (event) => {
  event.preventDefault();
  const data = formObject(event.target);
  try {
    await api("/ventas", {
      method: "POST",
      body: JSON.stringify({
        productos: [
          { producto: data.producto, cantidad: Number(data.cantidad) },
        ],
      }),
    });
    event.target.reset();
    message("Venta registrada");
    await refreshAll();
  } catch (error) {
    message(error.message, true);
  }
};

async function loadAdminData() {
  const [salesReport, inventoryReport, users] = await Promise.all([
    api("/reportes/ventas"),
    api("/reportes/inventario"),
    api("/auth/users"),
  ]);
  $("#reportSales").textContent = salesReport.cantidad;
  $("#reportRevenue").textContent = money(salesReport.total);
  $("#reportMovements").textContent = inventoryReport.movimientos;
  $("#usersList").innerHTML = users
    .map(
      (u) =>
        `<div><div><b>${escapeHtml(u.nombre)}</b><small>${escapeHtml(u.email)}</small></div><span class="badge">${escapeHtml(u.rol)}</span></div>`,
    )
    .join("");
}
$("#userForm").onsubmit = async (event) => {
  event.preventDefault();
  try {
    await api("/auth/register", {
      method: "POST",
      body: JSON.stringify(formObject(event.target)),
    });
    event.target.reset();
    message("Usuario creado");
    await loadAdminData();
  } catch (error) {
    message(error.message, true);
  }
};
$("#emailReport").onclick = async () => {
  try {
    const result = await api("/reportes/email", { method: "POST" });
    message(result.message);
  } catch (error) {
    message(error.message, true);
  }
};
$$("nav button").forEach(
  (button) =>
    (button.onclick = () => {
      $$("nav button").forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      $$(".view").forEach((view) => view.classList.remove("active-view"));
      $(`#${button.dataset.view}`).classList.add("active-view");
      $("#viewTitle").textContent = button.textContent;
    }),
);

if (new URLSearchParams(location.search).has("resetToken")) showAuth("reset");
else if (state.token) startApp();
