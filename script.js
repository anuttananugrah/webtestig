 
            tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        copper: '#C97C3D',
                        copperlight: '#E8A860',
                        navy: '#0E1C24',
                        amber: '#F2B705',
                        navy2: '#152B36',
                        cream: '#F4F0E6',
                        ink: '#17201F',
                        muted: '#5B6B6E',
                        line: '#E1DBC8',
                        'brand-green': '#10B981',
                        'brand-dark': '#0A3B24'
                    }
                }
            }
        }

        

        // ==========================================
// PRODUCT FILTER
// ==========================================

let selectedVoltage = "all";
let selectedAh = "all";

const productCards = document.querySelectorAll(".product-card");

const voltageButtons = document.querySelectorAll(".voltage-filter");
const ahButtons = document.querySelectorAll(".ah-filter");


// -----------------------------
// Voltage filter
// -----------------------------

voltageButtons.forEach(button => {

    button.addEventListener("click", function () {

        selectedVoltage = this.dataset.voltage;

        // Remove active style from all voltage buttons
        voltageButtons.forEach(btn => {
            btn.classList.remove("active-filter");
        });

        // Add active style to clicked button
        this.classList.add("active-filter");

        applyFilters();
    });

});


// -----------------------------
// Ah filter
// -----------------------------

ahButtons.forEach(button => {

    button.addEventListener("click", function () {

        selectedAh = this.dataset.ah;

        // Remove active style from all Ah buttons
        ahButtons.forEach(btn => {
            btn.classList.remove("active-filter");
        });

        // Add active style to clicked button
        this.classList.add("active-filter");

        applyFilters();
    });

});


// -----------------------------
// Apply both filters
// -----------------------------

function applyFilters() {

    productCards.forEach(product => {

        const productVoltage = product.dataset.voltage;
        const productAh = product.dataset.ah;


        // Check voltage
        const voltageMatch =
            selectedVoltage === "all" ||
            productVoltage === selectedVoltage;


        // Check Ah
        const ahMatch =
            selectedAh === "all" ||
            productAh === selectedAh;


        // Product must match BOTH filters
        if (voltageMatch && ahMatch) {

            product.style.display = "";

        } else {

            product.style.display = "none";

        }

    });

}

// contact form 

document.addEventListener("DOMContentLoaded", () => {
        const toggleBtn = document.getElementById('filterToggleBtn');
        const dropdown = document.getElementById('filterDropdown');

        // Toggle dropdown visibility when the button is clicked
        toggleBtn.addEventListener('click', (event) => {
            dropdown.classList.toggle('hidden');
            // Prevent the click from immediately bubbling up to the window
            event.stopPropagation(); 
        });

        // Close the dropdown if the user clicks outside of it
        window.addEventListener('click', (event) => {
            if (!toggleBtn.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.classList.add('hidden');
            }
        });
        
        // Prevent closing when clicking inside the dropdown itself
        dropdown.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    });
// ==========================================
// CONFIGURATION
// ==========================================
const WEB3FORMS_ACCESS_KEY = "YOUR_ACCESS_KEY_HERE"; 
const COOLDOWN_TIME = 60000; // 60 seconds (in milliseconds)

// ==========================================
// FORM SUBMISSION LOGIC
// ==========================================
async function handleFormSubmit(event, formId, btnId, statusId, successMessage) {
    event.preventDefault(); 

    const form = document.getElementById(formId);
    const submitBtn = document.getElementById(btnId);
    const statusText = document.getElementById(statusId);

    // --- SECURITY 1: Check Cooldown Timer ---
    // Prevents burst requests by forcing a 60-second wait between submissions
    const lastSubmitTime = localStorage.getItem('lastSubmitTime');
    if (lastSubmitTime && (Date.now() - lastSubmitTime < COOLDOWN_TIME)) {
        if (statusText) {
            statusText.innerText = "Please wait 60 seconds before sending another message.";
            statusText.className = "text-center font-bold text-sm text-red-500 block mt-3";
            statusText.classList.remove('hidden');
        }
        return; // Stop the function instantly
    }

    const formData = new FormData(form);
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);

    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;
    if (statusText) statusText.classList.add('hidden'); 

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            // Save the exact time they successfully sent a message
            localStorage.setItem('lastSubmitTime', Date.now());

            if (statusText) {
                statusText.innerText = successMessage;
                statusText.className = "text-center font-bold text-sm text-green-600 block mt-3";
                statusText.classList.remove('hidden');
            }
            form.reset(); 
            
            if (formId === 'modal-lead-form') {
                // --- UX FIX: Remember that they requested a quote! ---
                localStorage.setItem('hasRequestedQuote', 'true');

                setTimeout(() => {
                    const modalEl = document.getElementById('leadModal');
                    if(modalEl) modalEl.classList.add('hidden');
                    if(statusText) statusText.classList.add('hidden'); 
                }, 2500);
            }
        } else {
            if (statusText) {
                statusText.innerText = "Something went wrong. Please try again.";
                statusText.className = "text-center font-bold text-sm text-red-500 block mt-3";
                statusText.classList.remove('hidden');
            }
        }
    } catch (error) {
        if (statusText) {
            statusText.innerText = "Network error. Check your connection.";
            statusText.className = "text-center font-bold text-sm text-red-500 block mt-3";
            statusText.classList.remove('hidden');
        }
    } finally {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
    }
}

// Attach Event Listeners to Forms
const mainForm = document.getElementById('main-contact-form');
if (mainForm) {
    mainForm.addEventListener('submit', (e) => handleFormSubmit(e, 'main-contact-form', 'main-submit-btn', 'main-form-status', 'Message sent! We will contact you soon.'));
}

const modalForm = document.getElementById('modal-lead-form');
if (modalForm) {
    modalForm.addEventListener('submit', (e) => handleFormSubmit(e, 'modal-lead-form', 'modal-submit-btn', 'modal-form-status', 'Request sent! Expect a call shortly.'));
}

// ==========================================
// MODAL & MENU UI LOGIC
// ==========================================
const modal = document.getElementById('leadModal');
const closeBtn = document.getElementById('closeModalBtn');
const quoteBtn = document.getElementById('btn-quote'); 
const knowMoreBtns = document.querySelectorAll('.btn-know'); 

function showModal() {
    // --- UX FIX: Check if they already submitted ---
    // If the browser remembers they filled it out, do nothing and stop.
    if (localStorage.getItem('hasRequestedQuote') === 'true') {
        return; 
    }
    
    if (modal) modal.classList.remove('hidden');
}

function hideModal() {
    if (modal) modal.classList.add('hidden');
}

// Open modal via Homepage button
if (quoteBtn) {
    quoteBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showModal();
    });
}

// Open modal via Product page "Know more" buttons
if (knowMoreBtns.length > 0) {
    knowMoreBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); 
            showModal();
        });
    });
}

// 20-Second Popup Timer
setTimeout(function () {
    showModal();
}, 20000);

// Close modal interactions
if (closeBtn) {
    closeBtn.addEventListener('click', hideModal);
}
if (modal) {
    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            hideModal();
        }
    });
}

// Mobile Menu Logic
window.toggleMenu = function() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
    document.getElementById('icon-open').classList.toggle('hidden');
    document.getElementById('icon-close').classList.toggle('hidden');
}