// Service pour gérer les catégories et statuts de projet via l'API backend

const API_BASE = (typeof window !== 'undefined' && (window as any).REACT_APP_API_URL)
  ? (window as any).REACT_APP_API_URL
  : 'http://localhost:5000/api';

export const ProjectConfigService = {
  // Catégories
  async getCategories() {
    const res = await fetch(`${API_BASE}/project-categories`);
    if (!res.ok) throw new Error('Erreur chargement catégories');
    return await res.json();
  },
  async addCategory(name: string) {
    const res = await fetch(`${API_BASE}/project-categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (!res.ok) throw new Error('Erreur ajout catégorie');
    return await res.json();
  },
  async removeCategory(id: string) {
    const res = await fetch(`${API_BASE}/project-categories/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erreur suppression catégorie');
    return await res.json();
  },

  // Statuts
  async getStatuses() {
    const res = await fetch(`${API_BASE}/project-statuses`);
    if (!res.ok) throw new Error('Erreur chargement statuts');
    return await res.json();
  },
  async addStatus(status: { id: string, label: string, color: string }) {
    const res = await fetch(`${API_BASE}/project-statuses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(status)
    });
    if (!res.ok) throw new Error('Erreur ajout statut');
    return await res.json();
  },
  async removeStatus(id: string) {
    const res = await fetch(`${API_BASE}/project-statuses/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erreur suppression statut');
    return await res.json();
  }
};
