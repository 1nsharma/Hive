import React, { useState } from 'react';
import { CoreState, CulturalEntity, CulturalEntityType } from '../../types';
import { uuid, nowISO, appendAuditLog } from '../../utils/coreStorage';

interface CoreEntitiesViewProps {
  state: CoreState;
  updateState: (newState: CoreState) => void;
}

export const CoreEntitiesView: React.FC<CoreEntitiesViewProps> = ({ state, updateState }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [entityType, setEntityType] = useState<CulturalEntityType>('FOOD_TRADITION');
  const [geographicScope, setGeographicScope] = useState('Kanpur, Uttar Pradesh');
  const [description, setDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !geographicScope.trim()) return;

    const newEntity: CulturalEntity = {
      entity_id: uuid(),
      entity_type: entityType,
      name: name.trim(),
      geographic_scope: geographicScope.trim(),
      description: description.trim(),
      created_at: nowISO(),
      created_by: 'researcher_01'
    };

    const updatedState: CoreState = {
      ...state,
      entities: [newEntity, ...state.entities]
    };

    const logged = appendAuditLog(
      updatedState,
      'ENTITY',
      newEntity.entity_id,
      'CREATED',
      null,
      { name: newEntity.name },
      'Created via UI form'
    );

    updateState(logged);
    setIsModalOpen(false);
    setName('');
    setDescription('');
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this cultural entity and all linked claims?')) return;
    const target = state.entities.find((e) => e.entity_id === id);
    const updatedState: CoreState = {
      ...state,
      entities: state.entities.filter((e) => e.entity_id !== id),
      claims: state.claims.filter((c) => c.entity_id !== id)
    };

    const logged = appendAuditLog(
      updatedState,
      'ENTITY',
      id,
      'DELETED',
      target,
      null,
      'Deleted entity via UI'
    );
    updateState(logged);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Cultural Entities</h1>
          <p className="text-sm text-stone-600">
            Top-level cultural objects (traditions, crafts, rituals, places)
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors shadow-sm self-start sm:self-auto"
        >
          + New Entity
        </button>
      </div>

      <div className="space-y-3">
        {state.entities.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-stone-200 text-stone-400">
            No cultural entities registered yet. Click &quot;+ New Entity&quot; to begin.
          </div>
        ) : (
          state.entities.map((e) => {
            const linkedClaims = state.claims.filter((c) => c.entity_id === e.entity_id);
            return (
              <div
                key={e.entity_id}
                className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm hover:border-stone-300 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-300">
                        {e.entity_type}
                      </span>
                      <span className="font-mono text-xs text-stone-400">
                        {e.entity_id.substring(0, 16)}&hellip;
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg text-stone-900">{e.name}</h3>
                    <div className="text-sm text-stone-600 mt-1 flex items-center gap-1">
                      <span>📍</span> {e.geographic_scope}
                    </div>
                    {e.description && (
                      <p className="text-sm text-stone-700 mt-2 bg-stone-50 p-2.5 rounded border border-stone-200">
                        {e.description}
                      </p>
                    )}
                    <div className="text-xs text-stone-500 mt-3 flex items-center gap-3">
                      <span>Linked Claims: <strong className="text-stone-800">{linkedClaims.length}</strong></span>
                      <span>&middot;</span>
                      <span>Created: {new Date(e.created_at).toLocaleDateString()}</span>
                      <span>&middot;</span>
                      <span className="font-mono">Author: {e.created_by}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(e.entity_id)}
                    className="text-rose-600 hover:text-rose-800 text-xs font-medium hover:underline ml-4"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-stone-900">Register New Cultural Entity</h2>
            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-sm font-medium text-stone-700">Entity Name *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g., Kanpur Traditional Home-Food Heritage"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">Entity Type *</label>
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value as CulturalEntityType)}
                  required
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  <option value="FOOD_TRADITION">Food Tradition</option>
                  <option value="CRAFT">Craft</option>
                  <option value="RITUAL">Ritual</option>
                  <option value="ORAL_HISTORY">Oral History</option>
                  <option value="PLACE_PRACTICE">Place Practice</option>
                  <option value="LANGUAGE_FORM">Language Form</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">Geographic Scope *</label>
                <input
                  value={geographicScope}
                  onChange={(e) => setGeographicScope(e.target.value)}
                  required
                  placeholder="e.g., Kanpur, Uttar Pradesh"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Provide context, community background, and boundaries..."
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-stone-600 hover:text-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-800"
                >
                  Create Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
