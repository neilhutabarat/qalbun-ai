// Inisialisasi Data Keuangan
let financeData = {
    income: 3500000,
    cogs: 1200000,
    expense: 1700000
};

// Format Rupiah
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(number);
}

// Inisialisasi Tampilan Berdasarkan Config
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    loadConfig();
    updateDashboard();

    // Cek API Key di LocalStorage
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
        document.getElementById('input-api-key').value = savedKey;
    }
});

function loadConfig() {
    document.getElementById('txt-app-name').innerText = APP_CONFIG.appName;
    document.getElementById('txt-business-name').innerText = APP_CONFIG.businessName;
    document.getElementById('txt-owner-name').innerText = APP_CONFIG.ownerName;
    document.getElementById('txt-report-biz').innerText = APP_CONFIG.businessName;
    document.getElementById('txt-report-period').innerText = "Periode: " + APP_CONFIG.periodName;
}

function updateDashboard() {
    const grossProfit = financeData.income - financeData.cogs;
    const netProfit = grossProfit - financeData.expense;

    // Update Dashboard Cards
    document.getElementById('val-net-profit').innerText = formatRupiah(netProfit);
    document.getElementById('val-income').innerText = formatRupiah(financeData.income);
    document.getElementById('val-cogs').innerText = formatRupiah(financeData.cogs);
    document.getElementById('val-expense').innerText = formatRupiah(financeData.expense);

    // Update Halaman Laporan
    document.getElementById('rep-income').innerText = formatRupiah(financeData.income);
    document.getElementById('rep-cogs').innerText = formatRupiah(financeData.cogs);
    document.getElementById('rep-gross').innerText = formatRupiah(grossProfit);
    document.getElementById('rep-expense').innerText = formatRupiah(financeData.expense);
    document.getElementById('rep-net').innerText = formatRupiah(netProfit);
}

// Navigasi Tab
function switchTab(tabName) {
    const tabs = ['dashboard', 'scan', 'report'];
    tabs.forEach(t => {
        document.getElementById(`tab-${t}`).classList.add('hidden');
        document.getElementById(`nav-${t}`).classList.remove('text-emerald-600');
        document.getElementById(`nav-${t}`).classList.add('text-gray-400');
    });

    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    document.getElementById(`nav-${tabName}`).classList.add('text-emerald-600');
    document.getElementById(`nav-${tabName}`).classList.remove('text-gray-400');
    lucide.createIcons();
}

// Handle Upload & Scan AI
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Tampilkan preview gambar
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('preview-placeholder').classList.add('hidden');
        const img = document.getElementById('image-preview');
        img.src = e.target.result;
        img.classList.remove('hidden');

        // Simulasi scanning AI
        document.getElementById('ai-loading').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('ai-loading').classList.add('hidden');
            // Mock hasil baca AI
            document.getElementById('form-amount').value = 200000;
            document.getElementById('form-desc').value = "Beli Herba & Alat Praktik";
            document.getElementById('form-category').value = "cogs";
        }, 1200);
    };
    reader.readAsDataURL(file);
}

// Simpan Transaksi Baru
function saveTransaction() {
    const category = document.getElementById('form-category').value;
    const amount = parseFloat(document.getElementById('form-amount').value) || 0;

    if (category === 'cogs') {
        financeData.cogs += amount;
    } else if (category === 'expense') {
        financeData.expense += amount;
    } else if (category === 'income') {
        financeData.income += amount;
    }

    updateDashboard();
    alert("Transaksi berhasil dicatat dan laporan telah diperbarui!");
    switchTab('dashboard');
}

// Download PDF Otomatis menggunakan jsPDF
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const grossProfit = financeData.income - financeData.cogs;
    const netProfit = grossProfit - financeData.expense;

    // Header PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(46, 125, 50); // Emerald color
    doc.text(APP_CONFIG.businessName, 20, 25);

    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text("LAPORAN LABA RUGI", 20, 33);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Periode: " + APP_CONFIG.periodName, 20, 40);
    doc.line(20, 44, 190, 44);

    // Isi Angka
    let y = 55;
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 20);

    doc.text("1. Pendapatan Usaha", 20, y);
    doc.text(formatRupiah(financeData.income), 190, y, { align: "right" });

    y += 10;
    doc.text("2. Harga Pokok Penjualan (HPP)", 20, y);
    doc.text("(" + formatRupiah(financeData.cogs) + ")", 190, y, { align: "right" });

    y += 6;
    doc.line(20, y, 190, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Laba Kotor", 20, y);
    doc.text(formatRupiah(grossProfit), 190, y, { align: "right" });

    y += 12;
    doc.setFont("helvetica", "normal");
    doc.text("3. Beban Operasional", 20, y);
    doc.text("(" + formatRupiah(financeData.expense) + ")", 190, y, { align: "right" });

    y += 6;
    doc.line(20, y, 190, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(46, 125, 50);
    doc.text("LABA BERSIH", 20, y);
    doc.text(formatRupiah(netProfit), 190, y, { align: "right" });

    // Tanda Tangan
    y += 40;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.text("Dibuat oleh:", 140, y);
    y += 20;
    doc.setFont("helvetica", "bold");
    doc.text(APP_CONFIG.ownerName, 140, y);

    // Simpan file
    doc.save("Laporan_Laba_Rugi_" + APP_CONFIG.businessName.replace(/\s+/g, '_') + ".pdf");
}

// Share WhatsApp
function shareReport() {
    const grossProfit = financeData.income - financeData.cogs;
    const netProfit = grossProfit - financeData.expense;
    const msg = `*LAPORAN LABA RUGI - ${APP_CONFIG.businessName}*\nPeriode: ${APP_CONFIG.periodName}\n\n` +
                `1. Pendapatan: ${formatRupiah(financeData.income)}\n` +
                `2. HPP: ${formatRupiah(financeData.cogs)}\n` +
                `*Laba Kotor: ${formatRupiah(grossProfit)}*\n` +
                `3. Beban Operasional: ${formatRupiah(financeData.expense)}\n` +
                `-----------------------------------\n` +
                `*LABA BERSIH: ${formatRupiah(netProfit)}*\n\n` +
                `_Dicatat otomatis oleh ${APP_CONFIG.appName}_`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
}

// Modal API Key
function openApiKeyModal() {
    document.getElementById('modal-api-key').classList.remove('hidden');
}
function closeApiKeyModal() {
    document.getElementById('modal-api-key').classList.add('hidden');
}
function saveApiKey() {
    const key = document.getElementById('input-api-key').value.trim();
    localStorage.setItem('gemini_api_key', key);
    alert('API Key berhasil disimpan!');
    closeApiKeyModal();
}
