 
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

        
    
    
    // Modal functionality
        const modal = document.getElementById('leadModal');
        const closeBtn = document.getElementById('closeModalBtn');
        const knowMoreBtns = document.querySelectorAll('.btn-know');

        // Function to show the modal
        function showModal() {
            modal.classList.remove('hidden');
        }

        // Function to hide the modal
        function hideModal() {
            modal.classList.add('hidden');
        }

        // Attach click events to all "Know more" buttons
        knowMoreBtns.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault(); // Prevent page jump
                showModal();
            });
        });

        // Test Timer: Pops up after 20 seconds
        setTimeout(function () {
            showModal();
        }, 20000);

        // Close modal when the X is clicked
        closeBtn.addEventListener('click', hideModal);

        // Close modal when clicking on the dark bacKGround outside the white box
        modal.addEventListener('click', function (event) {
            if (event.target === modal) {
                hideModal();
            }
        });

        // Mobile Menu Toggle functionality
        function toggleMenu() {
            document.getElementById('mobile-menu').classList.toggle('hidden');
            document.getElementById('icon-open').classList.toggle('hidden');
            document.getElementById('icon-close').classList.toggle('hidden');
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