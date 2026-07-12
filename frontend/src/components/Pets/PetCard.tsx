import React from 'react';
import { Pet } from '@types/index';

interface PetCardProps {
  pet: Pet;
  onSelect?: (petId: string) => void;
}

export const PetCard: React.FC<PetCardProps> = ({ pet, onSelect }) => {
  return (
    <div className="pet-card">
      <div className="pet-image">
        <img src={pet.image} alt={pet.name} />
        <span className={`pet-status status-${pet.status}`}>{pet.status}</span>
      </div>
      <div className="pet-info">
        <h3>{pet.name}</h3>
        <p className="breed">{pet.breed}</p>
        <p className="species">{pet.species}</p>
        <p className="age">Tuổi: {pet.age} tuổi</p>
        {pet.description && <p className="description">{pet.description}</p>}
        {onSelect && (
          <button onClick={() => onSelect(pet.id)} className="btn-view">
            Xem chi tiết
          </button>
        )}
      </div>
    </div>
  );
};
