// ============================================
// PORTFOLIO CONFIGURATION FILE
// ============================================

const CONFIG = {
  // ==================== EMAILJS CONFIGURATION ====================
  // Get free account at https://www.emailjs.com/
  
  EMAILJS_SERVICE_ID: 'your_service_id',      // Replace with your Service ID
  EMAILJS_TEMPLATE_ID: 'your_template_id',    // Replace with your Template ID
  EMAILJS_PUBLIC_KEY: 'your_public_key',      // Replace with your Public Key
  
  // Your email where messages will be received
  YOUR_EMAIL: 'your.email@gmail.com',         // Replace with your email
  
  // ==================== PROFILE PHOTO ====================
  // Upload your photo and paste URL here (optional)
  
  PROFILE_PHOTO: '',  // Leave empty for default avatar
  
  // ==================== SKILL LOGOS ====================
  // Real logo URLs - already configured, no changes needed!
  
  SKILL_LOGOS: {
    cpp: 'https://raw.githubusercontent.com/isocpp/logos/master/cpp_logo.png',
    flask: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg',
    excel: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg',
    word: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Microsoft_Office_Word_%282019%E2%80%93present%29.svg',
    postgresql: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg',
    tally: 'https://companieslogo.com/img/orig/TALLY.NS-7d494922.png',
    tailwind: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg'
  },
  
  // ==================== CERTIFICATE IMAGES ====================
  // Upload your certificates and add URLs here
  
  CERTIFICATES: {
    1: '',  // Add your certificate 1 URL
    2: '',  // Add your certificate 2 URL
    3: '',  // Add your certificate 3 URL
    4: '',  // Add your certificate 4 URL
    5: '',  // Add your certificate 5 URL
    6: ''   // Add your certificate 6 URL
  }
}; 

// Export (keep this line)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}