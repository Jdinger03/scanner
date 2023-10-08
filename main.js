const csvFileInput = document.getElementById('csvFileInput');
const accessCameraBtn = document.getElementById('accessCameraBtn');
const cameraPreview = document.getElementById('cameraPreview');
const videoElement = document.getElementById('videoElement');
const scanResult = document.getElementById('scanResult');
const scanText = document.getElementById('scanText');
const acceptedBarcodesSection = document.getElementById('acceptedBarcodes');
const barcodeList = document.getElementById('barcodeList');

let acceptedBarcodes = [];

accessCameraBtn.addEventListener('click', () => {
    // Initialize and start the camera for barcode scanning
    Quagga.init({
        inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: videoElement,
            constraints: {
                facingMode: 'environment', // Use the rear camera (change if needed)
            },
        },
        decoder: {
            readers: ['ean_reader'], // Adjust barcode type as needed
        },
    }, function (err) {
        if (err) {
            console.error(err);
            return;
        }
        Quagga.start();
        accessCameraBtn.style.display = 'none';
        cameraPreview.classList.remove('hidden');
    });
});

// Handle CSV file upload
csvFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                acceptedBarcodes = result.data.map((item) => item.Barcode);
                displayAcceptedBarcodes();
            },
        });
    }
});

// Listen for barcode scans
Quagga.onDetected((result) => {
    const scannedBarcode = result.codeResult.code;
    const isAccepted = acceptedBarcodes.includes(scannedBarcode);
    
    scanText.textContent = `BARCODE SCANNED. OUTPUT: ${scannedBarcode} ${isAccepted ? 'ACCEPTED' : 'DENIED'}`;
    scanResult.classList.remove('hidden');
});

function displayAcceptedBarcodes() {
    if (acceptedBarcodes.length > 0) {
        acceptedBarcodesSection.classList.remove('hidden');
        barcodeList.innerHTML = acceptedBarcodes.map((barcode) => `<li>${barcode}</li>`).join('');
    }
}
