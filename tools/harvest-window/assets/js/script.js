// ../../tools/harvest-window/assets/js/script.js

// Immediate check to ensure script is loaded
console.log('script.js is loaded and running on ' + window.location.href);

// Load TensorFlow.js for Teachable Machine (ensuring latest version for compatibility)
const tf = window.tf;
if (tf) {
    console.log('TensorFlow.js loaded, checking backend...');
    tf.ready().then(() => {
        console.log('TensorFlow.js backend:', tf.getBackend());
        // Force CPU backend to avoid WebGL issues
        tf.setBackend('cpu').then(() => {
            console.log('Forced CPU backend successfully');
            // Disable WebGL backend to ensure it’s not used
            tf.ENV.set('WEBGL_CPU_FORWARD', false); // Prevent WebGL fallback
            tf.ENV.set('WEBGL_SIZE_UPLOAD_UNIFORM', 0); // Disable WebGL-related optimizations
            // Verify backend is actually CPU
            if (tf.getBackend() !== 'cpu') {
                console.warn('Backend is not CPU after forcing—possible TensorFlow.js issue');
                errorHandler(new Error('Failed to force CPU backend—backend is ' + tf.getBackend()));
            } else {
                console.log('Confirmed CPU backend is active');
                setup(); // Run setup after confirming CPU backend
            }
        }).catch(backendError => {
            console.error('Failed to force CPU backend:', backendError);
            errorHandler(new Error(`Failed to set CPU backend: ${backendError.message}`));
        });
    }).catch(tfError => {
        console.error('TensorFlow.js initialization error:', tfError);
        errorHandler(new Error(`TensorFlow.js initialization failed: ${tfError.message}`));
    });
} else {
    errorHandler(new Error('TensorFlow.js not loaded. Check script includes in harvest-window.html.'));
}

// Teachable Machine model and state variables
let model, maxPredictions;

// Initialize the model when the page loads
async function setup() {
    console.log('Attempting to load model from server URL...');
    const modelUrl = 'https://growappcannabis.guide/tools/harvest-window/assets/js/model.json';
    const metadataUrl = 'https://growappcannabis.guide/tools/harvest-window/assets/js/metadata.json';

    console.log(`Trying URLs: Model - ${modelUrl}, Metadata - ${metadataUrl}`);
    try {
        // Check if tmImage is defined before using it
        if (typeof tmImage === 'undefined') {
            throw new Error('Teachable Machine image library (tmImage) is not loaded. Ensure @teachablemachine/image is included in harvest-window.html.');
        }

        // Verify model.json exists and is accessible
        const modelResponse = await fetch(modelUrl, { mode: 'cors' });
        if (!modelResponse.ok) throw new Error(`Model file HTTP error! status: ${modelResponse.status}`);
        console.log(`Model file exists at ${modelUrl}`);

        // Verify metadata.json exists and is accessible (optional, but recommended for Teachable Machine)
        const metadataResponse = await fetch(metadataUrl, { mode: 'cors' });
        if (!metadataResponse.ok) throw new Error(`Metadata file HTTP error! status: ${metadataResponse.status}`);
        console.log(`Metadata file exists at ${metadataUrl}`);

        // Load the model using Teachable Machine image library
        model = await tmImage.load(modelUrl, metadataUrl);
        maxPredictions = model.getTotalClasses();

        console.log('Teachable Machine model loaded successfully!');
        console.log(`Model has ${maxPredictions} classes:`, model.getClassLabels());
    } catch (e) {
        console.warn(`Failed to initialize model loading:`, e);
        errorHandler(new Error(`General error loading model: ${e.message}`));
    }
}

// Error handler for model loading failures with detailed logging and robust error handling
function errorHandler(err) {
    console.error('Error loading model:', err);
    let errorMessage = 'Error: Failed to load the model. Check console for details.';
    let errorDetails = err ? (typeof err === 'string' ? err : (err.message || JSON.stringify(err, null, 2))) : 'No error details available';

    // Provide specific guidance based on error type or content
    if (errorDetails.includes('404') || errorDetails.includes('Not Found')) {
        errorMessage += ' The model file (model.json), weights.bin, or metadata.json was not found. Verify server URLs and file integrity.';
    } else if (errorDetails.includes('CORS') || errorDetails.includes('Cross-Origin')) {
        errorMessage += ' CORS issue detected. Ensure you’re using a local web server (e.g., localhost:8000) and not opening directly from file://. Verify server headers allow cross-origin requests.';
    } else if (errorDetails.includes('Invalid model') || errorDetails.includes('Format error')) {
        errorMessage += ' The model file may be invalid or incompatible with Teachable Machine. Verify the model was exported correctly from Teachable Machine as a TensorFlow.js model and is compatible with @teachablemachine/image. Check the model JSON structure and re-export if necessary.';
    } else if (errorDetails.includes('Weights file error')) {
        errorMessage += ' The weights.bin file is missing or inaccessible. Ensure it’s in tools/harvest-window/assets/js/ and accessible at https://growappcannabis.guide/tools/harvest-window/assets/js/weights.bin.';
    } else if (errorDetails.includes('NetworkError')) {
        errorMessage += ' Network error detected. Ensure the local web server is running and accessible at localhost:8000, and check your network connection.';
    } else if (errorDetails.includes('Failed to fetch')) {
        errorMessage += ' Fetch error detected. Ensure the local server is running, files exist, and there are no typos in the URL or paths. Verify the server root is C:\Users\User\Desktop\growappcannabis.guide\ and serving all files correctly.';
    } else if (errorDetails.includes('tmImage is not defined')) {
        errorMessage += ' Teachable Machine image library (tmImage) is not loaded. Ensure the script tag for @teachablemachine/image is included in harvest-window.html and loads correctly (https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js). Check for network issues or version compatibility.';
    } else {
        errorMessage += ` Unknown error: ${errorDetails}. This might indicate a compatibility issue or bug in Teachable Machine or TensorFlow.js. Check Teachable Machine documentation or GitHub issues (https://github.com/googlecreativelab/teachablemachine-community) for similar problems.`;
    }
    
    document.getElementById('result').textContent = errorMessage;
    // Safely hide loading spinner if it exists
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
}

// Handle file upload (store image but don’t classify immediately)
document.getElementById('imageUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        console.log('File upload triggered for:', file.name); // Add logging to debug file upload
        document.getElementById('fileName').textContent = file.name;
        const img = new Image();
        const reader = new FileReader();

        reader.onload = function(e) {
            img.src = e.target.result;
            img.onload = function() {
                console.log('Image loaded into memory for classification'); // Add logging
                // Display the image above the buttons
                const imageDisplay = document.getElementById('uploadedImage');
                imageDisplay.src = img.src;
                imageDisplay.style.display = 'block';
                imageDisplay.style.maxWidth = '300px'; // Adjust size as needed
                imageDisplay.style.margin = '20px auto'; // Center the image horizontally with margin

                // Store the image in sessionStorage temporarily
                sessionStorage.setItem('uploadedImage', img.src);
                // Do not call classifyImage() here—wait for "Check My Bud" click
            };
        };
        reader.readAsDataURL(file);
    }
});

// Classify the image using Teachable Machine with image resizing and loading spinner
async function classifyImage(img) {
    if (!model) {
        console.log('Model not loaded, showing error'); // Add logging
        document.getElementById('result').textContent = 'Error: Model not loaded. Please refresh and try again.';
        // Safely hide loading spinner if it exists
        const loadingSpinner = document.getElementById('loadingSpinner');
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
        return;
    }

    // Show loading spinner (safely check if it exists)
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = 'block';
    }
    document.getElementById('result').textContent = ''; // Clear previous result

    // Use TensorFlow.js to resize the image to 224x224 (matching model input shape)
    const tf = window.tf; // Access TensorFlow.js from the global scope
    if (!tf) {
        console.log('TensorFlow.js not loaded'); // Add logging
        document.getElementById('result').textContent = 'Error: TensorFlow.js not loaded. Check script includes.';
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
        return;
    }

    try {
        console.log('Attempting to resize and classify image'); // Add logging
        // Resize the image to 224x224
        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = 224;
        resizedCanvas.height = 224;
        const ctx = resizedCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 224, 224);

        // Predict using Teachable Machine model
        const prediction = await model.predict(resizedCanvas);
        console.log('Prediction results:', prediction);

        // Map the results to our cannabis stages (update based on your trained classes)
        let predictionLabel = 'unknown'; // Default if no match

        // Match predictions to our cannabis stages (ensure this matches your Teachable Machine labels)
        const classMapping = {
            'amber': getRandomFunnyResponse('amber'),
            'clear': getRandomFunnyResponse('clear'),
            'clear-white': getRandomFunnyResponse('clear-white'),
            'white': getRandomFunnyResponse('white'),
            'white-amber': getRandomFunnyResponse('white-amber'),
            'flower': getRandomFunnyResponse('flower'),
            'preflower': getRandomFunnyResponse('preflower'),
            'seedling': getRandomFunnyResponse('seedling'),
            'vegetative': getRandomFunnyResponse('vegetative')
        };

        // Find the best match (highest probability)
        let maxProbability = 0;
        for (let i = 0; i < prediction.length; i++) {
            if (prediction[i].probability > maxProbability) {
                maxProbability = prediction[i].probability;
                predictionLabel = prediction[i].className.toLowerCase();
            }
        }

        const funnyResponse = classMapping[predictionLabel] || "Hmm, I’m not sure—try a clearer pic of those trichomes!";

        console.log('Classification result:', predictionLabel, funnyResponse); // Add logging
        // Display the result below the image and buttons
        document.getElementById('result').innerHTML = `
            <strong>Prediction:</strong> ${predictionLabel}<br>
            <strong>Advice:</strong> ${funnyResponse}
        `;
    } catch (error) {
        console.error('Error resizing or classifying image:', error);
        document.getElementById('result').textContent = 'Error processing image. Check console for details.';
    } finally {
        // Hide loading spinner after classification (whether successful or not)
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
    }
}

// Handle the "Check My Bud" button click (trigger classification)
document.getElementById('checkBud').addEventListener('click', () => {
    console.log('Check My Bud button clicked'); // Add logging
    const uploadedImage = sessionStorage.getItem('uploadedImage');
    if (uploadedImage) {
        const img = new Image();
        img.src = uploadedImage;
        img.onload = () => classifyImage(img);
    } else {
        document.getElementById('result').textContent = 'Please upload an image first!';
        // Safely hide loading spinner if no image is uploaded
        const loadingSpinner = document.getElementById('loadingSpinner');
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
    }
});

// Function to get a random funny response for each class
function getRandomFunnyResponse(className) {
    const responses = {
        'amber': [
            "Perfect timing, dude—your plant’s ready to chop for that sweet, relaxing high!",
            "Dude, it’s harvest o’clock—time to chop those amber trichomes for max chill!",
            "Golden hour, man—your buds are prime for chopping with those amber trichomes!",
            "Yo, your plant’s screaming ‘harvest me!’ with those amber trichomes—chop away!",
            "Amber alert, dude—your plant’s ready to harvest for that smooth, mellow vibe!"
        ],
        'clear': [
            "Way too early, dude—wait until those trichomes turn cloudy or amber before chopping!",
            "Whoa, hold up—those clear trichomes mean it’s not time to chop yet, chill!",
            "Too soon, man—let those trichomes get cloudy or amber before you harvest!",
            "Patience, dude—clear trichomes say your buds need more time before chopping!",
            "Not ready yet, bro—wait for cloudy or amber trichomes before harvesting!"
        ],
        'clear-white': [
            "Too early, dude—wait until those trichomes turn cloudy or amber.",
            "Hang tight, man—those clear-white trichomes need to mature before harvest.",
            "Not quite there, bro—let those trichomes cloud up or amber out before chopping!",
            "Easy, dude—clear-white means wait for cloudy or amber trichomes to harvest.",
            "Hold off, man—those clear-white trichomes aren’t ready, wait for amber or cloudy!"
        ],
        'white': [
            "Hmm, still developing—watch for more amber trichomes before harvest.",
            "Chill, dude—those white trichomes need to turn amber before you chop.",
            "Almost there, but not yet—wait for amber trichomes to peak for harvest.",
            "Patience, man—white trichomes mean hold off until you see more amber.",
            "Not ready, bro—those white trichomes need to amber up before harvesting!"
        ],
        'white-amber': [
            "Transitioning nicely—wait a bit longer for more amber for peak harvest.",
            "Getting close, dude—those white-amber trichomes need more amber before chopping!",
            "Almost prime time, man—wait for more amber trichomes to harvest perfectly.",
            "On the verge, bro—let those white-amber trichomes turn more amber for the best harvest.",
            "Nearly there, dude—hold off until those white-amber trichomes are mostly amber!"
        ],
        'flower': [
            "Your buds are flowering, but not ready to chop—patience, man!",
            "Flowering’s happening, dude—wait for trichomes to mature before chopping!",
            "Nice flowers, but hold off—let the trichomes get cloudy or amber before harvest.",
            "Buds are blooming, bro—don’t chop yet, wait for ripe trichomes!",
            "Flowering’s underway, man—patience until trichomes signal harvest time!"
        ],
        'preflower': [
            "Almost there, but not quite—check back in a couple weeks for harvest vibes.",
            "Getting close, dude—preflower stage means wait a few weeks for harvest readiness.",
            "Not ready yet, man—preflowers need time, check back in a couple weeks for chopping.",
            "Preflower vibes, bro—hang tight for a couple weeks before harvesting.",
            "Nearly harvest time, but not yet—wait a couple weeks for those preflowers to mature!"
        ],
        'seedling': [
            "Dude, we'll see you back in a few weeks—your plant’s just a baby!",
            "Baby plant alert, man—seedlings need weeks before you can even think of harvest!",
            "Way too young, dude—seedlings need time, check back in a few weeks for harvest.",
            "Just a seedling, bro—give it a few weeks before dreaming of chopping!",
            "Tiny seedling, man—patience, it’ll be harvest-ready in a few weeks!"
        ],
        'vegetative': [
            "Whoa, hold up—your plant’s still vegging out, give it some time to flower.",
            "Vegging hard, dude—wait for flowering before thinking about harvest!",
            "Not flowering yet, man—your plant’s vegging, so chill until it blooms.",
            "Still in veggie mode, bro—let it flower before you harvest those buds.",
            "Vegetative stage, dude—patience, wait for flowers before chopping time!"
        ]
    };
    const responsesForClass = responses[className] || ["Hmm, I’m not sure—try a clearer pic of those trichomes!"];
    const randomIndex = Math.floor(Math.random() * responsesForClass.length);
    return responsesForClass[randomIndex];
}

// Clear sessionStorage when the user leaves or refreshes (optional)
// Note: This triggers a deprecation warning, but it’s not critical for now
window.onunload = () => {
    console.log('Page unloading, clearing sessionStorage'); // Add logging
    sessionStorage.removeItem('uploadedImage');
};

// Ensure setup runs when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', setup);