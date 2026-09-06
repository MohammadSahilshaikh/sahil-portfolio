# Md Rahil Shaikh — Civil Engineer Portfolio

## 📁 Files
- `index.html` — **Poori site ek hi page me** (Home → About → Experience → Gallery → Contact, sab scroll karke aate hain — mobile pe bhi hamburger click nahi karna padega)
- `about.html`, `experience.html`, `gallery.html`, `contact.html` — Ye ab sirf chhote "redirect" files hain jo `index.html` ke sahi section pe le jaate hain (purane bookmark/links kaam karte rahein isliye rakha hai)
- `admin.html` — Admin control panel (password protected)
- `css/style.css` — Saara styling (colors, fonts, animations)
- `js/data.js` — Default content + storage logic
- `js/main.js` — Navbar, scrollspy (scroll karte time active section highlight + navbar color change), footer, animations

## 🧭 Navigation Kaise Kaam Karti Hai Ab
- Nav bar ke links (Home/About/Experience/Gallery/Contact) ab sirf ek hi page ke andar smooth-scroll karte hain — koi naya page load nahi hota.
- Jaise-jaise scroll karoge, sections alternate hote hain **dark blueprint navy** aur **light concrete** background me — isse pata chal jata hai ki naya section shuru hua hai.
- Navbar khud bhi color badalta hai (dark/light) jis section me ho uske hisaab se, aur current section ka nav link highlight (underline) hota hai.
- Mobile pe menu (☰ icon) kisi link pe click karte hi apne aap band ho jata hai.

## 🚀 Kaise Use Karein
1. Poora `portfolio` folder ek jagah rakhein (structure mat todhna — css aur js folders same jagah rehne chahiye).
2. `index.html` ko double-click karke browser me kholein — site turant chalu ho jayegi.
3. Content edit karne ke liye `admin.html` kholein.
   - Default password: **admin123**
   - Ise change karna ho to `js/data.js` file me `ADMIN_PASSWORD` line dhundein.

## ✏️ Admin Panel Se Kya Edit Kar Sakte Hain
- Naam, profession, tagline, hero photo
- CV (PDF) upload — home page ka "Download CV" button isi se link hota hai
- About section (education, bio, skills)
- Experience (jitne chahe add/remove kar sakte ho)
- Gallery images (title ke saath)
- Contact info (email, phone, location, LinkedIn)

Change karne ke baad **"Save Changes"** button dabana zaroori hai.

## ⚠️ Important Limitation (Zaroor Padhein)
Ye site data ko **browser ke localStorage** me save karti hai — matlab:
- Jis browser/computer se aap admin panel me changes save karoge, wahi changes usi browser me dikhenge.
- Agar site online host karoge (Netlify/GitHub Pages) aur duniya ko wahi updated content dikhana hai, to sabko admin se save karna hoga apne apne browser me — jo practical nahi hai.
- **Solution for now:** Apne khud ke computer/laptop pe admin panel se sab kuch final set kar lein, phir site ko wahi se host/upload karein. Jab bhi update karna ho, apne usi browser se admin panel kholke update karein aur re-upload karein.
- Future me agar chahiye to isi site ko free backend (Firebase / Google Sheets API) se connect kiya ja sakta hai taaki changes sabko turant dikhein — tab bataiyega, wo bhi bana denge.

## 🎨 Customize Karna Chahte Ho?
- Colors: `css/style.css` ke top me `:root { }` section me hex codes change karein.
- Fonts: Same file ke `@import` line me Google Fonts link change karein.
- Building animation: `index.html` ke `<svg class="building-scene">` block me hai — floors ke rects edit kar sakte ho.

Good luck Rahil bhai! 🏗️
