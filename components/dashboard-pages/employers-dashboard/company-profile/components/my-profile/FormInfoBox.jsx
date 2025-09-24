// "use client";

// import { useEmployerProfile } from "./ProfileContext";

// export default function FormInfoBox() {
//   const { profile, updateField, saveProfile, saving } = useEmployerProfile();

//   const onSubmit = (e) => {
//     e.preventDefault();
//     saveProfile();
//   };

//   return (
//     <form className="default-form" onSubmit={onSubmit}>
//       <div className="row">
//         {/* First Name */}
//         <div className="form-group col-lg-6 col-md-12">
//           <label>First name</label>
//           <input
//             type="text"
//             name="first_name"
//             placeholder="John"
//             value={profile.first_name}
//             onChange={(e) => updateField("first_name", e.target.value)}
//           />
//         </div>

//         {/* Last Name */}
//         <div className="form-group col-lg-6 col-md-12">
//           <label>Last name</label>
//           <input
//             type="text"
//             name="last_name"
//             placeholder="Doe"
//             value={profile.last_name}
//             onChange={(e) => updateField("last_name", e.target.value)}
//           />
//         </div>

//         {/* Email (read-only; from account) */}
//         <div className="form-group col-lg-6 col-md-12">
//           <label>Email address</label>
//           <input
//             type="text"
//             name="email"
//             placeholder="email@company.com"
//             value={profile.email}
//             disabled
//             title="Email is managed from your account settings"
//           />
//         </div>

//         {/* Phone */}
//         <div className="form-group col-lg-6 col-md-12">
//           <label>Phone</label>
//           <input
//             type="text"
//             name="phone_number"
//             placeholder="0 123 456 7890"
//             value={profile.phone_number}
//             onChange={(e) => updateField("phone_number", e.target.value)}
//           />
//         </div>

//         {/* Company / Business name (Employer) */}
//         <div className="form-group col-lg-6 col-md-12">
//           <label>Company / Business name</label>
//           <input
//             type="text"
//             name="business_name"
//             placeholder="Invisionn"
//             value={profile.business_name}
//             onChange={(e) => updateField("business_name", e.target.value)}
//           />
//         </div>

//         {/* Gender */}
//         <div className="form-group col-lg-6 col-md-12">
//           <label>Gender</label>
//           <select
//             className="chosen-single form-select"
//             value={profile.gender || ""}
//             onChange={(e) => updateField("gender", e.target.value)}
//           >
//             <option value="">Prefer not to say</option>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//             <option value="other">Other</option>
//           </select>
//         </div>

//         {/* Save */}
//         <div className="form-group col-lg-6 col-md-12">
//           <button className="theme-btn btn-style-one" disabled={saving}>
//             {saving ? "Saving…" : "Save"}
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// }
