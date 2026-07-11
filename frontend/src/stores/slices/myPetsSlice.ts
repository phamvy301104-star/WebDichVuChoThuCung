import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MyPet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  weight: string;
  gender: string;
  color: string;
  allergies: string;
  notes: string;
  ownerId: string;
}

function load(): MyPet[] { try { const v = localStorage.getItem('my_pets'); return v ? JSON.parse(v) : []; } catch { return []; } }
function save(v: MyPet[]) { localStorage.setItem('my_pets', JSON.stringify(v)); }

const myPetsSlice = createSlice({
  name: 'myPets',
  initialState: { pets: load() },
  reducers: {
    addMyPet: (state, { payload }: PayloadAction<Omit<MyPet, 'id'>>) => {
      state.pets.unshift({ id: 'mp' + Date.now(), ...payload }); save(state.pets);
    },
    updateMyPet: (state, { payload }: PayloadAction<MyPet>) => {
      const i = state.pets.findIndex(p => p.id === payload.id); if (i >= 0) state.pets[i] = payload; save(state.pets);
    },
    deleteMyPet: (state, { payload }: PayloadAction<string>) => {
      state.pets = state.pets.filter(p => p.id !== payload); save(state.pets);
    },
  },
});
export const { addMyPet, updateMyPet, deleteMyPet } = myPetsSlice.actions;
export default myPetsSlice.reducer;