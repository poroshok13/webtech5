const ticketForm = document.getElementById('ticket-form');
ticketForm.noValidate = true;

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const eventSelect = document.getElementById('event');
const dateInput = document.getElementById('date');
const typeSelect = document.getElementById('type');
const qtyInput = document.getElementById('quantity');

const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const eventError = document.getElementById('event-error');
const dateError = document.getElementById('date-error');
const typeError = document.getElementById('type-error');
const qtyError = document.getElementById('quantity-error');

const errorSummary = document.getElementById('error-summary');
const resultContainer = document.getElementById('result');

const prevEvent = document.getElementById('prev-event');
const prevName = document.getElementById('prev-name');
const prevEmail = document.getElementById('prev-email');
const prevDate = document.getElementById('prev-date');
const prevType = document.getElementById('prev-type');
const prevQty = document.getElementById('prev-qty');
const prevTotal = document.getElementById('prev-total');

const SEATS = {
  standard: { seats: 10, price: 20 },
  vip: { seats: 3, price: 50 },
  student: { seats: 5, price: 10 }
};

const SOLD_OUT_DATES = ['2026-11-15', '2026-12-01'];

function validateField(input, errorEl, checkFn) {
  const errorMsg = checkFn();
  input.setCustomValidity(errorMsg);
  errorEl.textContent = errorMsg;
  input.setAttribute('aria-invalid', String(Boolean(errorMsg)));
  return !errorMsg;
}

function checkName() {
  const val = nameInput.value.trim();
  if (!val) return 'Full name is required.';
  const words = val.split(/\s+/);
  if (words.length < 2) return 'Enter at least first and last name.';
  const regex = /^[A-Za-zА-Яа-яЁёӘәҒғҚқҢңӨөҰұҮү]+$/;
  if (!words.every((w) => regex.test(w) && w.length >= 2)) {
    return 'Only letters allowed, at least 2 chars each.';
  }
  return '';
}

function checkEmail() {
  const val = emailInput.value.trim();
  if (!val) return 'Email is required.';
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!regex.test(val)) return 'Invalid email address.';
  return '';
}

function checkEvent() {
  return eventSelect.value ? '' : 'Please select an event.';
}

function checkDate() {
  const val = dateInput.value;
  if (!val) return 'Event date is required.';
  const selectedDate = new Date(val);
  selectedDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate <= today) return 'Date must be tomorrow or later.';
  if (SOLD_OUT_DATES.includes(val)) return 'This date is completely sold out.';
  return '';
}

function checkType() {
  return typeSelect.value ? '' : 'Please select a ticket type.';
}

function checkQty() {
  const val = Number(qtyInput.value);
  if (!qtyInput.value) return 'Quantity is required.';
  if (val < 1) return 'Quantity must be at least 1.';
  const selectedType = typeSelect.value;
  if (selectedType && SEATS[selectedType] && val > SEATS[selectedType].seats) {
    return `Only ${SEATS[selectedType].seats} seats left for this tier.`;
  }
  return '';
}

function updatePreview() {
  prevName.textContent = nameInput.value.trim() || '—';
  prevEmail.textContent = emailInput.value.trim() || '—';
  prevEvent.textContent = eventSelect.value || '—';
  prevDate.textContent = dateInput.value || '—';
  prevType.textContent = typeSelect.value ? typeSelect.value.toUpperCase() : '—';

  const qty = Number(qtyInput.value) || 0;
  prevQty.textContent = String(qty);

  const price = typeSelect.value && SEATS[typeSelect.value] ? SEATS[typeSelect.value].price : 0;
  prevTotal.textContent = `$${price * qty}`;
}

const fields = [
  { input: nameInput, error: nameError, check: checkName },
  { input: emailInput, error: emailError, check: checkEmail },
  { input: eventSelect, error: eventError, check: checkEvent },
  { input: dateInput, error: dateError, check: checkDate },
  { input: typeSelect, error: typeError, check: checkType },
  { input: qtyInput, error: qtyError, check: checkQty }
];

for (const f of fields) {
  f.input.addEventListener('blur', () => {
    f.input.dataset.touched = 'true';
    validateField(f.input, f.error, f.check);
  });

  const eventType = f.input.tagName === 'SELECT' ? 'change' : 'input';
  f.input.addEventListener(eventType, () => {
    updatePreview();
    if (f.input.dataset.touched === 'true') {
      validateField(f.input, f.error, f.check);
    }
  });
}

ticketForm.addEventListener('submit', (event) => {
  event.preventDefault();

  let invalidCount = 0;
  let firstInvalid = null;

  for (const f of fields) {
    f.input.dataset.touched = 'true';
    const isValid = validateField(f.input, f.error, f.check);
    if (!isValid) {
      invalidCount += 1;
      if (!firstInvalid) firstInvalid = f.input;
    }
  }

  if (invalidCount > 0) {
    errorSummary.hidden = false;
    errorSummary.textContent = `Form has ${invalidCount} error(s). Please fix highlighted fields.`;
    firstInvalid.focus();
    return;
  }

  errorSummary.hidden = true;
  const bookingCode = `TICKET-${Math.floor(1000 + Math.random() * 9000)}`;

  while (resultContainer.firstChild) {
    resultContainer.removeChild(resultContainer.firstChild);
  }

  const success = document.createElement('div');
  success.className = 'success-card';

  const h3 = document.createElement('h3');
  h3.textContent = 'Ticket Confirmed!';
  const pCode = document.createElement('p');
  pCode.textContent = `Booking Code: ${bookingCode}`;
  const pDetails = document.createElement('p');
  pDetails.textContent = `${nameInput.value} - ${eventSelect.value} (${typeSelect.value.toUpperCase()} x${qtyInput.value})`;

  success.appendChild(h3);
  success.appendChild(pCode);
  success.appendChild(pDetails);
  resultContainer.appendChild(success);

  ticketForm.reset();
  for (const f of fields) {
    delete f.input.dataset.touched;
    f.input.removeAttribute('aria-invalid');
  }
  updatePreview();
});

updatePreview();
