import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function TodoList() {
  const [tarefa, setTarefa] = useState("");
  const [lista, setLista] = useState([]);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const tarefasSalvas = localStorage.getItem("tarefas");
    if (tarefasSalvas) {
      setLista(JSON.parse(tarefasSalvas));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(lista));
  }, [lista]);

  const adicionarOuEditarTarefa = () => {
    if (tarefa.trim() === "") return;

    if (editandoIndex !== null) {
      const novaLista = [...lista];
      novaLista[editandoIndex].texto = tarefa;
      setLista(novaLista);
      setEditandoIndex(null);
    } else {
      setLista([...lista, { texto: tarefa, concluida: false }]);
    }

    setTarefa("");
  };

  const removerTarefa = (index) => {
    const novaLista = lista.filter((_, i) => i !== index);
    setLista(novaLista);
  };

  const editarTarefa = (index) => {
    setTarefa(lista[index].texto);
    setEditandoIndex(index);
  };

  const alternarConclusao = (index) => {
    const novaLista = [...lista];
    novaLista[index].concluida = !novaLista[index].concluida;
    setLista(novaLista);
  };

  const limparTodas = () => {
    if (confirm("Deseja realmente apagar todas as tarefas?")) {
      setLista([]);
    }
  };

  const filtrarTarefas = (tarefas) =>
    tarefas.filter((item) =>
      item.texto.toLowerCase().includes(filtro.toLowerCase())
    );

  const tarefasPendentes = filtrarTarefas(lista.filter((item) => !item.concluida));
  const tarefasConcluidas = filtrarTarefas(lista.filter((item) => item.concluida));

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-yellow-400 text-white py-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Gestão de Tarefa</h1>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-7">📝 Lista de Tarefas</h2>

          {/* Campo de nova tarefa */}
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={tarefa}
              onChange={(e) => setTarefa(e.target.value)}
              placeholder="Digite uma tarefa..."
              className="flex-grow px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={adicionarOuEditarTarefa}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
            >
              {editandoIndex !== null ? "Atualizar" : "Adicionar"}
            </button>
          </div>

          {/* Campo de filtro */}
          <input
            type="text"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Filtrar tarefas..."
            className="w-full px-4 py-2 mb-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Botão Limpar */}
          {lista.length > 0 && (
            <button
              onClick={limparTodas}
              className="w-full mb-4 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600"
            >
              <FaTrash className="inline mr-2" />
              Limpar Todas
            </button>
          )}

          {/* Tarefas Pendentes */}
          <h2 className="text-lg font-semibold mt-4 mb-2 text-gray-700">Pendentes</h2>
          {tarefasPendentes.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhuma tarefa pendente.</p>
          ) : (
            <ul className="space-y-2">
              {tarefasPendentes.map((item, index) => {
                const originalIndex = lista.indexOf(item);
                return (
                  <li
                    key={originalIndex}
                    className="flex justify-between items-center bg-gray-100 p-3 rounded-xl"
                  >
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => alternarConclusao(originalIndex)}
                    >
                      {item.texto}
                    </div>
                    <div className="flex space-x-2 ml-2">
                      <button
                        onClick={() => editarTarefa(originalIndex)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => removerTarefa(originalIndex)}
                        className="text-red-500 hover:text-red-700"
                        title="Remover"
                      >
                        <FaTimesCircle />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Tarefas Concluídas */}
          <h2 className="text-lg font-semibold mt-6 mb-2 text-gray-700">Concluídas</h2>
          {tarefasConcluidas.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhuma tarefa concluída.</p>
          ) : (
            <ul className="space-y-2">
              {tarefasConcluidas.map((item, index) => {
                const originalIndex = lista.indexOf(item);
                return (
                  <li
                    key={originalIndex}
                    className="flex justify-between items-center bg-green-100 p-3 rounded-xl"
                  >
                    <div
                      className="flex-1 line-through text-gray-500 cursor-pointer"
                      onClick={() => alternarConclusao(originalIndex)}
                    >
                      {item.texto}
                    </div>
                    <div className="flex space-x-2 ml-2">
                      <button
                        onClick={() => removerTarefa(originalIndex)}
                        className="text-red-500 hover:text-red-700"
                        title="Remover"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>

      {/* Rodapé */}
      <footer className="bg-gray-200 text-center text-sm text-gray-600 py-4">
        © {new Date().getFullYear()} Joâo Cumbo Muendo Mabiala. Todos os direitos reservados.
      </footer>
    </div>
  );
}