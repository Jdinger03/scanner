// Check for browser support
if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
    const csvFileInput = document.getElementById('csvFileInput');
    const cameraPreview = document.getElementById('cameraPreview');
    const barcodeResult = document.getElementById('barcodeResult');
    let acceptedBarcodes = [];

    // Handle CSV file upload
    csvFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                    acceptedBarcodes = result.data.map((item) => item.Barcode);
                },
            });
        }
    });

    // Initialize and start the camera for barcode scanning
    Quagga.init({
        inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: cameraPreview,
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
    });

    // Listen for barcode scans
    Quagga.onDetected((result) => {
        const scannedBarcode = result.codeResult.code;
        const isAccepted = acceptedBarcodes.includes(scannedBarcode);

        // Display the scanned barcode and whether it's accepted
        barcodeResult.textContent = `Scanned Barcode: ${scannedBarcode} | Accepted: ${isAccepted ? 'Yes' : 'No'}`;
    });
} else {
    console.error('Camera access is not supported in this browser.');
}
