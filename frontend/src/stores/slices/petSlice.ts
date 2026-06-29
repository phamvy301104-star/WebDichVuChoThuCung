import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Pet } from "@types/index";

interface PetState {
  pets: Pet[];
  selectedPet: Pet | null;
  petsForSale: Pet[];
  petsForAdoption: Pet[];
  loading: boolean;
  error: string | null;
}

const initialState: PetState = {
  pets: [],
  selectedPet: null,
  petsForSale: [],
  petsForAdoption: [],
  loading: false,
  error: null,
};

const petSlice = createSlice({
  name: "pet",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPets: (state, action: PayloadAction<Pet[]>) => {
      state.pets = action.payload;
    },
    setSelectedPet: (state, action: PayloadAction<Pet | null>) => {
      state.selectedPet = action.payload;
    },
    setPetsForSale: (state, action: PayloadAction<Pet[]>) => {
      state.petsForSale = action.payload;
    },
    setPetsForAdoption: (state, action: PayloadAction<Pet[]>) => {
      state.petsForAdoption = action.payload;
    },
    addPet: (state, action: PayloadAction<Pet>) => {
      state.pets.push(action.payload);
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setPets,
  setSelectedPet,
  setPetsForSale,
  setPetsForAdoption,
  addPet,
  setError,
  clearError,
} = petSlice.actions;
export default petSlice.reducer;
