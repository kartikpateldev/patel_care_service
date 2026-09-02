/* ==========================================================================
   Patel Care Service - Interactive Application Logic & WhatsApp Integration
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initDateDefaults();
  updateMessagePreview();
  calculateEstimate();
});

// Mobile Navigation Toggle
function initMobileNav() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
}

// Set default date input to tomorrow
function initDateDefaults() {
  const dateInput = document.getElementById('custDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }
}

// Subscription Toggle Logic (Residential vs Commercial)
function switchPlanType(type) {
  const resBtn = document.getElementById('toggleResidential');
  const comBtn = document.getElementById('toggleCommercial');
  
  const p1 = document.getElementById('p1-price');
  const p2 = document.getElementById('p2-price');
  const p3 = document.getElementById('p3-price');

  if (type === 'residential') {
    resBtn.classList.add('active');
    comBtn.classList.remove('active');
    p1.textContent = '899';
    p2.textContent = '2,399';
    p3.textContent = '3,999';
  } else {
    comBtn.classList.add('active');
    resBtn.classList.remove('active');
    p1.textContent = '1,499';
    p2.textContent = '4,999';
    p3.textContent = '8,999';
  }
}

/* ==========================================================================
   Interactive Pest Cost Estimator Logic
   ========================================================================== */

let selectedProperty = '1bhk';
let selectedPest = 'cockroach';
let selectedFreq = 'quarterly';

// Base Prices Table
const basePrices = {
  '1bhk': 899,
  '2bhk': 1199,
  '3bhk': 1499,
  'villa': 2199,
  'office': 1899
};

const pestMultipliers = {
  'cockroach': 1.0,
  'termite': 2.2,
  'bedbug': 1.8,
  'rodent': 1.2,
  'combo': 2.5
};

const freqMultipliers = {
  'once': { factor: 1.0, discount: 0, label: 'Standard Rate' },
  'quarterly': { factor: 2.4, discount: 600, label: 'Save ₹600 with Quarterly Plan' },
  'amc': { factor: 3.5, discount: 1200, label: 'Best Value! Save ₹1,200 with AMC' }
};

function selectProperty(val) {
  selectedProperty = val;
  updateChipSelection('propertyChipGroup', val);
  calculateEstimate();
}

function selectPest(val) {
  selectedPest = val;
  updateChipSelection('pestChipGroup', val);
  calculateEstimate();
}

function selectFreq(val) {
  selectedFreq = val;
  updateChipSelection('freqChipGroup', val);
  calculateEstimate();
}

function updateChipSelection(groupId, val) {
  const chips = document.querySelectorAll(`#${groupId} .chip`);
  chips.forEach(chip => {
    if (chip.getAttribute('data-value') === val) {
      chip.classList.add('selected');
    } else {
      chip.classList.remove('selected');
    }
  });
}

function calculateEstimate() {
  const base = basePrices[selectedProperty] || 899;
  const pestMult = pestMultipliers[selectedPest] || 1.0;
  const freqObj = freqMultipliers[selectedFreq] || freqMultipliers['quarterly'];

  let total = Math.round(base * pestMult * freqObj.factor);
  
  const priceDisplay = document.getElementById('calcTotalPrice');
  const savingsDisplay = document.getElementById('calcSavingsTag');

  if (priceDisplay) {
    priceDisplay.textContent = `₹ ${total.toLocaleString('en-IN')}`;
  }

  if (savingsDisplay) {
    if (freqObj.discount > 0) {
      savingsDisplay.textContent = `🎁 ${freqObj.label}`;
      savingsDisplay.style.display = 'inline-block';
    } else {
      savingsDisplay.style.display = 'none';
    }
  }
}

function sendCalculatedQuote() {
  const priceDisplay = document.getElementById('calcTotalPrice').textContent;
  
  const propNames = {
    '1bhk': '1 BHK Flat',
    '2bhk': '2 BHK Flat',
    '3bhk': '3 BHK Flat',
    'villa': '4+ BHK / Villa',
    'office': 'Commercial Office'
  };

  const pestNames = {
    'cockroach': 'Cockroach & Ants',
    'termite': 'Anti-Termite Treatment',
    'bedbug': 'Bed Bug Eradication',
    'rodent': 'Rodent & Rat Control',
    'combo': 'Full Home Protection (All Pests)'
  };

  const freqNames = {
    'once': 'One-Time Express',
    'quarterly': 'Quarterly Plan (4 Visits/Yr)',
    'amc': 'Annual AMC (6 Visits/Yr)'
  };

  const message = `Hello Patel Care Service,\n` +
    `I calculated a service estimate on your website:\n\n` +
    `* Property: ${propNames[selectedProperty]}\n` +
    `* Target Pest: ${pestNames[selectedPest]}\n` +
    `* Subscription Plan: ${freqNames[selectedFreq]}\n` +
    `* Estimated Cost: ${priceDisplay}\n\n` +
    `Please confirm technician booking for this estimate.`;

  const whatsappUrl = `https://wa.me/918097060676?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

/* ==========================================================================
   Dynamic Contact Form & Live WhatsApp Message Generator
   ========================================================================== */

function updateMessagePreview() {
  const name = document.getElementById('custName')?.value.trim() || 'Guest Customer';
  const phone = document.getElementById('custPhone')?.value.trim() || 'Not Provided';
  const area = document.getElementById('custArea')?.value.trim() || 'Mumbai';
  const service = document.getElementById('custService')?.value || 'Cockroach & Ant Control';
  const date = document.getElementById('custDate')?.value || 'Tomorrow';

  const preview = `Hello Patel Care Service,\n` +
    `I would like to book a pest control service.\n\n` +
    `* Name: ${name}\n` +
    `* Phone: ${phone}\n` +
    `* Locality/Area: ${area}\n` +
    `* Service Required: ${service}\n` +
    `* Preferred Visit Date: ${date}\n\n` +
    `Please confirm technician availability and slot timing.`;

  const previewBox = document.getElementById('previewText');
  if (previewBox) {
    previewBox.textContent = preview;
  }
}

function sendDirectWhatsappMessage() {
  const previewBox = document.getElementById('previewText');
  if (previewBox) {
    const text = previewBox.textContent;
    const whatsappUrl = `https://wa.me/918097060676?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  }
}

function handleFormSubmit(e) {
  e.preventDefault();
  sendDirectWhatsappMessage();
}

/* ==========================================================================
   FAQ Accordion Logic
   ========================================================================== */

function toggleFaq(element) {
  const allFaqs = document.querySelectorAll('.faq-item');
  allFaqs.forEach(item => {
    if (item !== element) {
      item.classList.remove('active');
    }
  });

  element.classList.toggle('active');
}
