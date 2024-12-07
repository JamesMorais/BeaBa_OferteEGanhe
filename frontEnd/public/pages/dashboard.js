// Função para buscar a quantidade de perfis
async function fetchTotalPerfis() {
    try {
        const response = await fetch('http://localhost:3000/api/dashboard/dashboard/perfis');
        if (!response.ok) {
            throw new Error('Erro ao buscar a quantidade de perfis.');
        }
        const data = await response.json();
        document.getElementById('profileCount').innerText = data.total_perfis || 0;
    } catch (error) {
        console.error(error.message);
    }
}

// Função para buscar a quantidade de usuários
async function fetchTotalUsuarios() {
    try {
        const response = await fetch('http://localhost:3000/api/dashboard/dashboard/usuarios');
        if (!response.ok) {
            throw new Error('Erro ao buscar a quantidade de usuários.');
        }
        const data = await response.json();
        document.getElementById('userCount').innerText = data.total_usuarios || 0;
    } catch (error) {
        console.error(error.message);
    }
}

// Função para buscar a quantidade de lojas
async function fetchTotalLojas() {
    try {
        const response = await fetch('http://localhost:3000/api/dashboard/dashboard/lojas');
        if (!response.ok) {
            throw new Error('Erro ao buscar a quantidade de lojas.');
        }
        const data = await response.json();
        document.getElementById('storeCount').innerText = data.total_lojas || 0;
    } catch (error) {
        console.error(error.message);
    }
}

// Função principal para inicializar o dashboard
async function initDashboard() {
    await fetchTotalPerfis();
    await fetchTotalUsuarios();
    await fetchTotalLojas();
}

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', initDashboard);
