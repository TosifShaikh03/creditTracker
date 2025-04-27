document.addEventListener('DOMContentLoaded', () => {
    loadCreditEntries();
    document.getElementById('searchInput').addEventListener('input', filterCreditEntries);
});

document.getElementById('creditForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const customerName = document.getElementById('customerName').value;
    const itemPurchased = document.getElementById('itemPurchased').value;
    const creditAmount = parseFloat(document.getElementById('creditAmount').value);
    const creditDate = document.getElementById('creditDate').value;
    const phoneNumber = document.getElementById('phoneNumber').value;

    const id = Date.now().toString();
    const creditEntry = { id, customerName, itemPurchased, creditAmount, creditDate, phoneNumber };
    saveCreditEntry(creditEntry);
    addEntryToCardContainer(creditEntry);
    updateTotalCredit();
    document.getElementById('creditForm').reset();
});

function saveCreditEntry(entry) {
    let entries = JSON.parse(localStorage.getItem('creditEntries')) || [];
    entries.push(entry);
    localStorage.setItem('creditEntries', JSON.stringify(entries));
}

function loadCreditEntries() {
    const entries = JSON.parse(localStorage.getItem('creditEntries')) || [];
    document.getElementById('creditCardContainer').innerHTML = '';
    entries.forEach(entry => addEntryToCardContainer(entry));
    updateTotalCredit();
}

function addEntryToCardContainer(entry) {
    const cardContainer = document.getElementById('creditCardContainer');
    const card = document.createElement('div');
    card.classList.add('bg-gray-50', 'p-4', 'rounded-lg', 'shadow-md', 'border', 'border-gray-200');
    card.dataset.customerName = entry.customerName.toLowerCase();
    card.dataset.id = entry.id;
    card.innerHTML = `
        <h2 class="text-lg font-semibold text-gray-800">${entry.customerName}</h2>
        <p class="text-sm text-gray-600"><strong>Item:</strong> ${entry.itemPurchased}</p>
        <p class="text-sm text-gray-600"><strong>Amount:</strong> ₹${entry.creditAmount.toFixed(2)}</p>
        <p class="text-sm text-gray-600"><strong>Date:</strong> ${entry.creditDate}</p>
        <p class="text-sm text-gray-600"><strong>Phone:</strong> ${entry.phoneNumber}</p>
        <button class="mt-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600" onclick="deleteCreditEntry('${entry.id}', '${entry.customerName}')">Delete</button>
    `;
    cardContainer.appendChild(card);
}

function deleteCreditEntry(id, customerName) {
    if (confirm(`Are you sure you want to delete the entry for ${customerName}?`)) {
        let entries = JSON.parse(localStorage.getItem('creditEntries')) || [];
        entries = entries.filter(entry => entry.id !== id);
        localStorage.setItem('creditEntries', JSON.stringify(entries));
        loadCreditEntries();
    }
}

function filterCreditEntries() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('#creditCardContainer > div');
    cards.forEach(card => {
        card.style.display = card.dataset.customerName.includes(searchTerm) ? 'block' : 'none';
    });
}

function updateTotalCredit() {
    const entries = JSON.parse(localStorage.getItem('creditEntries')) || [];
    const total = entries.reduce((sum, entry) => sum + entry.creditAmount, 0);
    document.getElementById('totalCredit').textContent = total.toFixed(2);
}

window.deleteCreditEntry = deleteCreditEntry;