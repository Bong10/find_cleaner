import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  keyword: "",
  location: "",
  destination: { min: 0, max: 100 },
  category: "",
  candidateType: [],
  candidateGender: "",
  datePost: "",
  experiences: [],
  qualifications: [],
  sort: "",
  perPage: { start: 0, end: 0 },
};

export const candidateFilterSlice = createSlice({
  name: "candidateFilter",
  initialState,
  reducers: {
    addKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    addLocation: (state, action) => {
      state.location = action.payload;
    },
    addDestination: (state, action) => {
      state.destination = action.payload;
    },
    addCategory: (state, action) => {
      state.category = action.payload;
    },
    addCandidateType: (state, action) => {
      state.candidateType = action.payload;
    },
    addCandidateGender: (state, action) => {
      state.candidateGender = action.payload;
    },
    addDatePost: (state, action) => {
      state.datePost = action.payload;
    },
    addExperience: (state, action) => {
      state.experiences = action.payload;
    },
    clearExperienceF: (state) => {
      state.experiences = [];
    },
    // NOTE: Keep both plural and singular for backwards compatibility across components
    addQualifications: (state, action) => {
      state.qualifications = action.payload;
    },
    addQualification: (state, action) => {
      // alias of addQualifications for legacy imports
      state.qualifications = action.payload;
    },
    clearQualificationF: (state) => {
      // clear selected qualifications (legacy compatibility)
      state.qualifications = [];
    },
    addSort: (state, action) => {
      state.sort = action.payload;
    },
    addPerPage: (state, action) => {
      state.perPage = action.payload;
    },
    clearAll: (state) => {
      state.keyword = "";
      state.location = "";
      state.destination = { min: 0, max: 100 };
      state.category = "";
      state.candidateType = [];
      state.candidateGender = "";
      state.datePost = "";
      state.experiences = [];
      state.qualifications = [];
      state.sort = "";
      state.perPage = { start: 0, end: 0 };
    },
  },
});

export const {
  addKeyword,
  addLocation,
  addDestination,
  addCategory,
  addCandidateType,
  addCandidateGender,
  addDatePost,
  addExperience,
  clearExperienceF,
  addQualification,
  addQualifications,
  clearQualificationF,
  addSort,
  addPerPage,
  clearAll,
} = candidateFilterSlice.actions;

export default candidateFilterSlice.reducer;
