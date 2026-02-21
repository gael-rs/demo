'use client';

import { useEffect, useState } from 'react';
import {
  getAllProperties,
  createProperty,
  updateProperty,
  activateProperty,
  deactivateProperty,
  Property,
  CreatePropertyData,
} from '@/app/services/property.service';
import { AMENITIES, CHILE_CITIES } from '@/app/data';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<CreatePropertyData>({
    name: '',
    description: '',
    address: '',
    city: '',
    region: 'Región Metropolitana de Santiago',
    base_price_clp: 25000,
    amenities: [],
    images: [],
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await getAllProperties();
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingProperty) {
        await updateProperty(editingProperty.id, formData);
      } else {
        await createProperty(formData);
      }

      await loadProperties();
      resetForm();
    } catch (error) {
      console.error('Error saving property:', error);
      alert('Error al guardar la propiedad');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      name: property.name,
      description: property.description || '',
      address: property.address,
      city: property.city,
      region: property.region,
      base_price_clp: property.base_price_clp,
      amenities: property.amenities || [],
      images: property.images || [],
      capacity: property.capacity,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      is_active: property.is_active,
    });
    setShowForm(true);
  };

  const handleToggleActive = async (property: Property) => {
    try {
      if (property.is_active) {
        await deactivateProperty(property.id);
      } else {
        await activateProperty(property.id);
      }
      await loadProperties();
    } catch (error) {
      console.error('Error toggling property status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      address: '',
      city: '',
      region: 'Región Metropolitana de Santiago',
      base_price_clp: 25000,
      amenities: [],
      images: [],
      capacity: 2,
      bedrooms: 1,
      bathrooms: 1,
      is_active: true,
    });
    setEditingProperty(null);
    setShowForm(false);
  };

  const handleAmenityToggle = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities?.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...(prev.amenities || []), amenityId],
    }));
  };

  const handleImageUrlAdd = () => {
    const url = prompt('Ingrese la URL de la imagen:');
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), url],
      }));
    }
  };

  const handleImageRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg className="w-12 h-12 animate-spin text-emerald-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-400">Cargando propiedades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Propiedades</h1>
          <p className="text-slate-400">Gestiona las propiedades disponibles para alquiler</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {showForm ? 'Cancelar' : 'Nueva Propiedad'}
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editingProperty ? 'Editar Propiedad' : 'Nueva Propiedad'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Ej: Departamento Moderno Santiago Centro"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Ciudad *
                </label>
                <select
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Seleccionar ciudad...</option>
                  {CHILE_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Ej: Av. Libertador Bernardo O'Higgins 123"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Región *
                </label>
                <input
                  type="text"
                  required
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Ej: Metropolitana"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Describe la propiedad, ubicación, características destacadas..."
              />
            </div>

            {/* Capacity & Rooms */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Precio Base (CLP/día) *
                </label>
                <input
                  type="number"
                  required
                  min="1000"
                  step="1000"
                  value={formData.base_price_clp}
                  onChange={(e) => setFormData({ ...formData, base_price_clp: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Capacidad *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Dormitorios *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Baños *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-3">
                Amenidades
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {AMENITIES.map((amenity) => (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity.id)}
                    className={`px-4 py-3 rounded-lg border transition-colors text-left flex items-center gap-2 ${
                      formData.amenities?.includes(amenity.id)
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <span className="text-xl">{amenity.icon}</span>
                    <span className="text-sm font-medium">{amenity.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-3">
                Imágenes
              </label>
              <div className="space-y-3">
                {formData.images?.map((url, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                    <img src={url} alt={`Preview ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                    <span className="flex-1 text-slate-300 text-sm truncate">{url}</span>
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleImageUrlAdd}
                  className="w-full px-4 py-3 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Agregar URL de imagen
                </button>
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 text-emerald-500 bg-slate-700 border-slate-600 rounded focus:ring-2 focus:ring-emerald-500"
              />
              <label htmlFor="is_active" className="text-slate-300 font-medium">
                Propiedad activa (visible para clientes)
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
              >
                {submitting ? 'Guardando...' : editingProperty ? 'Actualizar Propiedad' : 'Crear Propiedad'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Properties List */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <p className="text-slate-400">No hay propiedades registradas</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-lg transition-colors"
            >
              Crear primera propiedad
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {properties.map((property) => (
              <div key={property.id} className="p-6 hover:bg-slate-700/30 transition-colors">
                <div className="flex items-start gap-4">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-slate-700 rounded-lg flex items-center justify-center">
                      <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">{property.name}</h3>
                        <p className="text-slate-400 text-sm">
                          {property.address}, {property.city}, {property.region}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {property.is_active ? (
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
                            Activa
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-slate-600/50 text-slate-400 text-xs font-semibold rounded-full border border-slate-600">
                            Inactiva
                          </span>
                        )}
                      </div>
                    </div>

                    {property.description && (
                      <p className="text-slate-300 text-sm mb-3 line-clamp-2">{property.description}</p>
                    )}

                    <div className="flex items-center gap-6 mb-3">
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {property.capacity} personas
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {property.bedrooms} dorm.
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                        {property.bathrooms} baños
                      </div>
                      <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                        ${property.base_price_clp.toLocaleString('es-CL')} CLP/día
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(property)}
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-medium rounded-lg transition-colors text-sm flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </button>
                      <button
                        onClick={() => handleToggleActive(property)}
                        className={`px-4 py-2 font-medium rounded-lg transition-colors text-sm flex items-center gap-2 ${
                          property.is_active
                            ? 'bg-slate-600/50 hover:bg-slate-600 text-slate-300'
                            : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400'
                        }`}
                      >
                        {property.is_active ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
