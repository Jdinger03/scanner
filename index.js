const csvFile = document.getElementById('csv-file');
const scanButton = document.getElementById('scan-button');
const resultsDiv = document.getElementById('results');

scanButton.addEventListener('click', async () => {
  // Get the barcode from the phone's camera.
  const barcode = await getBarcodeFromCamera();

  // Read the .csv file.
  const csvData = await readCSVFile(csvFile.files[0]);

  // Compare the barcode against the .csv file.
  const match = csvData.find(row => row[0] === barcode);

  // Display the results.
  if (match) {
    resultsDiv.innerHTML = `<h1>Match found!</h1><p>Name: ${match[1]}</p>`;
  } else {
    resultsDiv.innerHTML = `<h1>No match found.</h1>`;
  }
});

// Gets the barcode from the phone's camera.
async function getBarcodeFromCamera() {
  // Create a new ZXing barcode scanner.
  const scanner = new ZXing.BrowserBarcodeReader();

  // Start the scanner.
  await scanner.start();

  // Scan the barcode.
  const barcodeResult = await scanner.scan();

  // Stop the scanner.
  await scanner.stop();

  // Return the barcode.
  return barcodeResult.text;
}

// Reads the .csv file.
async function readCSVFile(file) {
  // Use Papa Parse to parse the CSV file.
  const csvData = await Papa.parse(file, {
    header: true,
  });

  // Return the CSV data.
  return csvData.data;
}
