async function getCliente() {
  try {
    const response = await fetch("https://localhost:7082/api/Clientes", {
      method: "GET",
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    
    const json = await response.json();
    renderClientes(json);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
  }
}

function renderClientes(clientes) {
  const tableBody = document.getElementById("clienteTable").querySelector("tbody");
  tableBody.innerHTML = ""; 
  const fragment = document.createDocumentFragment();

  clientes.forEach(cliente => {
    const newRow = createRow(cliente);
    fragment.appendChild(newRow);
  });

  tableBody.appendChild(fragment);
}

function createRow(cliente) {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${cliente.id_cliente}</td>
    <td>${cliente.nombre}</td>
    <td>${cliente.apellido}</td>
    <td>${cliente.email}</td>
    <td>${cliente.telefono}</td>
    <td>${cliente.documento_identidad}</td>
    <td>
      <button class="btn btn-warning btn-sm editBtn" data-bs-toggle="modal" data-bs-target="#editModal">Editar</button>
      <button class="btn btn-danger btn-sm deleteBtn" data-id="${cliente.id_cliente}">Eliminar</button>
    </td>`;
  
  newRow.querySelector(".editBtn").addEventListener("click", () => editRow(newRow, cliente));
  newRow.querySelector(".deleteBtn").addEventListener("click", () => showDeleteModal(cliente.id_cliente));
  
  return newRow;
}

async function addCliente(cliente) {
  try {
    const response = await fetch("https://localhost:7082/api/Clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente)
    });

    if (!response.ok) throw new Error(`Error al agregar cliente: ${response.status}`);

    const data = await response.json();
    const newRow = createRow(data);
    document.getElementById("clienteTable").querySelector("tbody").appendChild(newRow);
    
    console.log("Cliente agregado:", data);
  } catch (error) {
    console.error("Error al agregar cliente:", error);
  }
}

async function deleteCliente(id) {
  try {
    const response = await fetch(`https://localhost:7082/api/Clientes/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) throw new Error(`Error al eliminar cliente: ${response.status}`);

    console.log("Cliente eliminado");
    getCliente();
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
  }
}

async function updateCliente(cliente) {
  try {
    const response = await fetch(`https://localhost:7082/api/Clientes/${cliente.id_cliente}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente)
    });
    console.log(response)
    if (!response.ok) throw new Error(`Error al actualizar cliente: ${response.status}`);

    // Comprueba si hay contenido en la respuesta antes de analizarla
    const responseText = await response.text();
    if (responseText) {
      const data = JSON.parse(responseText);
      console.log("Cliente actualizado:", data);
    } else {
      console.log("Actualización completada sin contenido en la respuesta.");
    }

    getCliente(); // Actualiza la lista de clientes
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
  }
  location.reload();
}

document.getElementById("addForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nuevoCliente = {
    nombre: document.getElementById("addNombre").value,
    apellido: document.getElementById("addApellido").value,
    email: document.getElementById("addEmail").value,
    telefono: document.getElementById("addTelefono").value,
    documento_identidad: document.getElementById("addDpi").value
  };

  await addCliente(nuevoCliente);

  bootstrap.Modal.getInstance(document.getElementById("addModal")).hide();
  document.getElementById("addForm").reset();
});

document.getElementById("deleteForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const clienteId = document.getElementById("deleteClienteId").value;
  await deleteCliente(clienteId);

  bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
});

function editRow(row, cliente) {
  document.getElementById("editClienteId").value = cliente.id_cliente;
  document.getElementById("editNombre").value = cliente.nombre;
  document.getElementById("editApellido").value = cliente.apellido;
  document.getElementById("editEmail").value = cliente.email;
  document.getElementById("editTelefono").value = cliente.telefono;
  document.getElementById("editDpi").value = cliente.documento_identidad;

  const editModal = new bootstrap.Modal(document.getElementById("editModal"));
  editModal.show();
}

document.getElementById("editForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const cliente = {
    id_cliente: document.getElementById("editClienteId").value,
    nombre: document.getElementById("editNombre").value,
    apellido: document.getElementById("editApellido").value,
    email: document.getElementById("editEmail").value,
    telefono: document.getElementById("editTelefono").value,
    documento_identidad: document.getElementById("editDpi").value
  };

  await updateCliente(cliente);

  const editModal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
  editModal.hide();
});

function showDeleteModal(clienteId) {
  document.getElementById("deleteRecordInfo").innerText = `ID: ${clienteId}`;
  document.getElementById("deleteClienteId").value = clienteId;
  new bootstrap.Modal(document.getElementById("deleteModal")).show();
}

getCliente();