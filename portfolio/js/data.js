/* ============================================================
   PORTFOLIO DATA LAYER
   Ye file saara content localStorage me store/retrieve karti hai.
   Admin panel (admin.html) isi function ko use karke data save karta hai,
   aur baaki saare pages (index, about, experience, gallery, contact)
   isi se data padhkar page pe dikhate hain.
   ============================================================ */

const STORAGE_KEY = "civilPortfolioData";
const ADMIN_PASSWORD = "admin123"; // <-- Ise yahan se change kar sakte ho

// Default content (100% verified CV data)
const DEFAULT_DATA = {
  version: 6,
  name: "MD RAHIL SHAIKH",
  title: "CIVIL QUALITY & SITE ENGINEER",
  tagline: "Proactive & Quality-Focused Civil Engineer | QC & Site Execution Specialist",
  heroImg: "", // base64 image (admin se upload hoga)
  cvFile: "",  // base64 pdf (admin se upload hoga)
  cvFileName: "MD_RAHIL_SHAIKH_CV.pdf",

  about: {
    heading: "About Me",
    education:
      "Diploma in Civil Engineering (71% - SCTEVT, Rajdhani Engineering College, Odisha, 2024). Secondary School Examination (60% - CBSE, Darbhanga Public School, Bihar, 2021).",
    bio:
      "Proactive and quality-focused Civil Engineer with hands-on experience across railway infrastructure quality assurance and solar power plant civil site execution. Skilled in Quality Control (QC) inspection, concrete testing, structural alignment, site supervision, and compliance verification. Demonstrated expertise in managing site operations strictly according to engineering drawings and technical standards.",
    skills: [
      "Quality Assurance / QC",
      "Concrete Testing (Rebound Hammer, Slump)",
      "Material Inspection & Documentation",
      "Structure Alignment",
      "Excavation & Leveling",
      "Casting & Curing Supervision",
      "Trenching",
      "Construction Drawing Interpretation",
      "Contractor Coordination",
      "Site Safety",
      "NDT Analysis"
    ],
    personalDetails: {
      fatherName: "Md. Ashraf",
      dob: "01/01/2005",
      languages: "Hindi, English",
      maritalStatus: "Unmarried"
    }
  },

  experience: [
    {
      company: "Patil Rail Infrastructure Pvt. Ltd.",
      role: "Quality Control Engineer",
      duration: "9 Months",
      desc: "Executed QA/QC inspections for concrete elements & railway infra. Conducted routine site testing including concrete strength evaluations (Rebound Hammer test), slump tests, raw material checks. Monitored mix proportions, compaction & curing. Maintained quality test logs, inspection checklists & material approval reports as per railway specs."
    },
    {
      company: "Shri Karni Construction (Vendor Partner)",
      role: "Civil Site Engineer",
      duration: "8 Months",
      desc: "Supervised civil development works for solar array sites (earthwork, land leveling, site grading, excavation). Inspected casting, alignment & wet curing of concrete foundation piles/pedestals for MMS. Coordinated marking & alignment according to layout drawings. Oversaw cable trenches, inverter room foundations & perimeter boundary."
    }
  ],

  gallery: [
    { img: "", title: "Railway Concrete Inspection" },
    { img: "", title: "Solar Array Foundation Work" },
    { img: "", title: "Rebound Hammer Testing" }
  ],

  contact: {
    email: "rahilshaikh05505@gmail.com",
    phone: "+91 7257918588",
    location: "Darbhanga, Bihar, India - 846005",
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    linkedin: "https://linkedin.com/"
  },

  emailjs: {
    serviceId: "service_6nrx68j",
    templateId: "template_ihpt477",
    publicKey: "GIbeIviQo1ehc1gxX"
  }
};

// Data load karo localStorage se (ya default do agar kuch save nahi hai)
function getData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return JSON.parse(JSON.stringify(DEFAULT_DATA));
  try {
    const parsed = JSON.parse(raw);
    const defaults = JSON.parse(JSON.stringify(DEFAULT_DATA));
    return {
      ...defaults,
      ...parsed,
      about: {
        ...defaults.about,
        ...(parsed.about || {})
      },
      contact: {
        ...defaults.contact,
        ...(parsed.contact || {})
      },
      emailjs: {
        ...defaults.emailjs,
        ...(parsed.emailjs || {})
      }
    };
  } catch (e) {
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

// Data save karo localStorage me
function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Reset to default (admin panel me "Reset" button ke liye)
function resetData() {
  localStorage.removeItem(STORAGE_KEY);
}

// Synchronize with Cloud Backend (Supabase API)
async function fetchCloudData() {
  try {
    const res = await fetch("/api/get-portfolio");
    if (!res.ok) return null;
    const json = await res.json();
    if (json && json.success && json.data && Object.keys(json.data).length > 0) {
      saveData(json.data);
      return json.data;
    }
  } catch (e) {
    console.warn("Cloud data fetch fallback to local cache:", e);
  }
  return null;
}

async function saveCloudData(data, password) {
  try {
    const res = await fetch("/api/save-portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, data })
    });
    return await res.json();
  } catch (e) {
    console.error("Cloud save failed:", e);
    return { success: false, error: e.message };
  }
}
