import { configureStore } from "@reduxjs/toolkit";
import jobSlice from "../features/job/jobSlice";
import toggleSlice from "../features/toggle/toggleSlice";
import filterSlice from "./slices/filterSlice";
import employerSlice from "../features/employer/employerSlice";
import employerFilterSlice from "../features/filter/employerFilterSlice";
import candidateSlice from "../features/candidate/candidateSlice";
import candidateFilterSlice from "../features/filter/candidateFilterSlice";
import shopSlice from "../features/shop/shopSlice";
import authReducer from './slices/authSlice';
import registerReducer from "./slices/registerSlice"; // ← ADD
import servicesReducer from "./slices/servicesSlice";      // NEW
import jobsReducer from "./slices/jobsSlice";              // NEW
import metricsReducer from "./slices/metricsSlice";        // NEW
import applicationsReducer from "./slices/applicationsSlice"; // NEW
import employerProfileReducer from "./slices/employerProfileSlice";
import myJobsReducer from "./slices/myJobsSlice"; // ← NEW
import publicJobsReducer from "@/store/slices/publicJobsSlice";
import allApplicantsReducer from "./slices/allApplicantsSlice";
import jobDetailReducer from "./slices/jobDetailSlice";
import applicantsReducer from "./slices/applicantsSlice";
import shortlistReducer from "./slices/shortlistSlice";
import cleanerProfileReducer from "./slices/cleanerProfileSlice";
import applicationDetailReducer from "./slices/applicationDetailSlice";
import filtersReducer from "./slices/filterSlice";  // <-- NEW registration
import usersReducer from "./slices/usersSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        register: registerReducer,      // ← ADD
        services: servicesReducer,         // NEW
        jobs: jobsReducer,                 // NEW
        metrics: metricsReducer,           // NEW
        applications: applicationsReducer, // NEW
        employerProfile: employerProfileReducer,
        services: servicesReducer,
        allApplicants: allApplicantsReducer,
        myJobs: myJobsReducer, // ← add
        filters: filtersReducer,
        cleanerProfile: cleanerProfileReducer,
        applicationDetail: applicationDetailReducer,
        jobDetail: jobDetailReducer,
        applicants: applicantsReducer,
        shortlist: shortlistReducer,
        job: jobSlice,
        publicJobs: publicJobsReducer,
        toggle: toggleSlice,
        filter: filterSlice,
        employer: employerSlice,
        employerFilter: employerFilterSlice,
        candidate: candidateSlice,
        candidateFilter: candidateFilterSlice,
        shop: shopSlice,
        users: usersReducer, // Add this reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});
