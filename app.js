let coplas = JSON.parse(localStorage.getItem('coplas')) || [];
let editando = false;
let indiceEditando = null;

const formulario = document.getElementById('formulario');
const coplaInput = document.getElementById('copla');
const tipoInput = document.getElementById('tipo');
const tablaBody = document.getElementById('tabla-body');
const buscadorInput = document.getElementById('buscador');
const paginacion = document.getElementById('paginacion');

let paginaActual = 1;
const coplasPorPagina = 5;

formulario.addEventListener('submit', (e) => {
  e.preventDefault();

  const copla = coplaInput.value.trim();
  const tipo = tipoInput.value.trim();

  if (!copla || !tipo) return;

  if (editando) {
    coplas[indiceEditando] = { copla, tipo };
    editando = false;
    indiceEditando = null;
  } else {
    coplas.push({ copla, tipo });
  }

  actualizarLocalStorage();
  formulario.reset();
  paginaActual = 1;
  renderizarTabla();
});

buscadorInput.addEventListener('input', () => {
  paginaActual = 1;
  renderizarTabla();
});

function renderizarTabla() {
  const filtro = buscadorInput.value.trim().toLowerCase();
  const coplasFiltradas = coplas.filter(item =>
    item.copla.toLowerCase().includes(filtro) ||
    item.tipo.toLowerCase().includes(filtro)
  );

  const inicio = (paginaActual - 1) * coplasPorPagina;
  const fin = inicio + coplasPorPagina;
  const coplasAMostrar = coplasFiltradas.slice(inicio, fin);

  tablaBody.innerHTML = '';

  coplasAMostrar.forEach((item, index) => {
    const realIndex = coplas.indexOf(coplasFiltradas[inicio + index]);
    tablaBody.innerHTML += `
      <tr>
        <td>${item.copla}</td>
        <td>${item.tipo}</td>
        <td class="text-center">
          <button class="btn btn-warning btn-sm me-1" onclick="editar(${realIndex})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminar(${realIndex})">Eliminar</button>
        </td>
      </tr>
    `;
  });

  renderizarPaginacion(coplasFiltradas.length);
}

function renderizarPaginacion(totalCoplas) {
  const totalPaginas = Math.ceil(totalCoplas / coplasPorPagina);
  paginacion.innerHTML = '';

  if (totalPaginas <= 1) return;

  const crearBoton = (numero, texto, activo = false, deshabilitado = false) => {
    return `
      <li class="page-item ${activo ? 'active' : ''} ${deshabilitado ? 'disabled' : ''}">
        <button class="page-link" onclick="cambiarPagina(${numero})">${texto}</button>
      </li>
    `;
  };

  paginacion.innerHTML += crearBoton(paginaActual - 1, '«', false, paginaActual === 1);

  for (let i = 1; i <= totalPaginas; i++) {
    paginacion.innerHTML += crearBoton(i, i, i === paginaActual);
  }

  paginacion.innerHTML += crearBoton(paginaActual + 1, '»', false, paginaActual === totalPaginas);
}

function cambiarPagina(numero) {
  const filtro = buscadorInput.value.trim().toLowerCase();
  const totalFiltradas = coplas.filter(item =>
    item.copla.toLowerCase().includes(filtro) ||
    item.tipo.toLowerCase().includes(filtro)
  );

  const totalPaginas = Math.ceil(totalFiltradas.length / coplasPorPagina);
  if (numero < 1 || numero > totalPaginas) return;

  paginaActual = numero;
  renderizarTabla();
}

function editar(index) {
  const item = coplas[index];
  coplaInput.value = item.copla;
  tipoInput.value = item.tipo;
  editando = true;
  indiceEditando = index;
}

function eliminar(index) {
  if (confirm("¿Deseás eliminar esta copla?")) {
    coplas.splice(index, 1);
    actualizarLocalStorage();
    renderizarTabla();
  }
}

function actualizarLocalStorage() {
  localStorage.setItem('coplas', JSON.stringify(coplas));
}

renderizarTabla();
