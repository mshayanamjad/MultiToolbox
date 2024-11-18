"use strict";

document.getElementById("hamburger").addEventListener("click", function () {
  document.getElementById("navList").classList.add("active");
});

document.getElementById("close_hamburger").addEventListener("click", function () {
  document.getElementById("navList").classList.remove("active");
});

/*---------------------------- Calculator ------------------------ */

let string = "";
const buttons = document.querySelectorAll(".button");
const display = document.querySelector("#display");

Array.from(buttons).forEach((button) => {
  button.addEventListener("click", (e) => {
    let target = e.target.innerHTML;

    // Convert operator symbols for `eval()`
    if (target === "×") {
      target = "*";
    } else if (target === "÷") {
      target = "/";
    } else if (target === "−") {
      // Handle minus symbol if using special character
      target = "-";
    }

    if (target === "=") {
      try {
        // Safely evaluate the string expression
        string = eval(string);
        display.value = string;
      } catch (error) {
        display.value = "Error";
        string = "";
      }
    } else if (target === "%") {
      // Calculate percentage based on the current value
      string = (parseFloat(string) / 100).toString();
      display.value = string;
    } else if (target === "CE") {
      string = string.slice(0, -1);
      display.value = string;
    } else if (target === "AC") {
      string = "";
      display.value = string;
    } else if (target.trim() === "√") {
      string = Math.sqrt(string);
      display.value = string;
    } else {
      // Append other inputs and update the display
      string += target;
      display.value = string;
    }
  });
});

/*---------------------------- Unit Conversion ------------------------ */

const unitOptions = {
  length: [
    { unit: "meter", factorToBase: 1 },
    { unit: "kilometer", factorToBase: 0.001 },
    { unit: "centimeter", factorToBase: 100 },
    { unit: "millimeter", factorToBase: 1000 },
    { unit: "inches", factorToBase: 39.3701 },
    { unit: "feet", factorToBase: 3.28084 },
    { unit: "yards", factorToBase: 1.09361 },
    { unit: "miles", factorToBase: 0.000621371 },
  ],
  area: [
    { unit: "square meters", factorToBase: 1 },
    { unit: "square kilometers", factorToBase: 1e-6 },
    { unit: "square centimeters", factorToBase: 10000 },
    { unit: "square millimeters", factorToBase: 1e6 },
    { unit: "square miles", factorToBase: 3.861e-7 },
    { unit: "acres", factorToBase: 0.000247105 },
    { unit: "hectares", factorToBase: 0.0001 },
  ],
  temperature: [{ unit: "Celsius" }, { unit: "Fahrenheit" }, { unit: "Kelvin" }],
  mass: [
    { unit: "grams", factorToBase: 1 },
    { unit: "kilograms", factorToBase: 0.001 },
    { unit: "milligrams", factorToBase: 1000 },
    { unit: "pounds", factorToBase: 0.00220462 },
    { unit: "ounces", factorToBase: 0.035274 },
  ],
  digital_storage: [
    { unit: "Bit", factorToBase: 1 },
    { unit: "Byte", factorToBase: 8 }, // 1 Byte = 8 Bits
    { unit: "Kilobyte (KB)", factorToBase: 8 * 1024 }, // 1 KB = 1024 Bytes
    { unit: "Megabyte (MB)", factorToBase: 8 * 1024 * 1024 }, // 1 MB = 1024 KB
    { unit: "Gigabyte (GB)", factorToBase: 8 * 1024 * 1024 * 1024 }, // 1 GB = 1024 MB
    { unit: "Terabyte (TB)", factorToBase: 8 * 1024 * 1024 * 1024 * 1024 }, // 1 TB = 1024 GB
    {
      unit: "Petabyte (PB)",
      factorToBase: 8 * 1024 * 1024 * 1024 * 1024 * 1024,
    }, // 1 PB = 1024 TB
  ],
};

function updateUnits() {
  const type = document.getElementById("conversion-type").value;
  const inputUnitSelect = document.getElementById("input-unit");
  const outputUnitSelect = document.getElementById("output-unit");
  inputUnitSelect.innerHTML = "";
  outputUnitSelect.innerHTML = "";

  unitOptions[type].forEach((option) => {
    inputUnitSelect.innerHTML += `<option value="${option.unit}">${option.unit}</option>`;
    outputUnitSelect.innerHTML += `<option value="${option.unit}">${option.unit}</option>`;
  });

  // Trigger conversion immediately when units are updated
  convert();
}

function convert() {
  const type = document.getElementById("conversion-type").value;
  const inputValue = parseFloat(document.getElementById("input-value").value);
  const inputUnit = document.getElementById("input-unit").value;
  const outputUnit = document.getElementById("output-unit").value;
  const inputFactor = unitOptions[type].find((unit) => unit.unit === inputUnit).factorToBase;
  const outputFactor = unitOptions[type].find((unit) => unit.unit === outputUnit).factorToBase;

  let result;

  if (type === "temperature") {
    if (inputUnit === "Celsius" && outputUnit === "Fahrenheit") {
      result = (inputValue * 9) / 5 + 32;
    } else if (inputUnit === "Fahrenheit" && outputUnit === "Celsius") {
      result = ((inputValue - 32) * 5) / 9;
    } else if (inputUnit === "Celsius" && outputUnit === "Kelvin") {
      result = inputValue + 273.15;
    } else if (inputUnit === "Kelvin" && outputUnit === "Celsius") {
      result = inputValue - 273.15;
    } else if (inputUnit === "Fahrenheit" && outputUnit === "Kelvin") {
      result = ((inputValue - 32) * 5) / 9 + 273.15;
    } else if (inputUnit === "Kelvin" && outputUnit === "Fahrenheit") {
      result = ((inputValue - 273.15) * 9) / 5 + 32;
    } else {
      result = inputValue; // Same unit
    }
  } else if (type === "digital_storage") {
    // Correct conversion for length, area, mass, etc.
    const valueInBase = inputValue * inputFactor;
    result = valueInBase / outputFactor;
  } else {
    // Correct conversion for length, area, mass, etc.
    const valueInBase = inputValue / inputFactor;
    result = valueInBase * outputFactor;
  }

  // Remove unnecessary trailing zeros by converting to string and then to float
  document.getElementById("output-value").value = parseFloat(result.toFixed(6)).toString();
}

// Initialize the units when the page loads
window.onload = function () {
  updateUnits();

  // Set up event listeners to trigger conversion on value changes
  document.getElementById("input-value").addEventListener("input", convert);
  document.getElementById("input-unit").addEventListener("change", convert);
  document.getElementById("output-unit").addEventListener("change", convert);
  document.getElementById("conversion-type").addEventListener("change", updateUnits);
};

// Function to switch between tabs
function changeTab(tab) {
  // Remove active class from all tabs
  const tabs = document.querySelectorAll(".tab-button");
  tabs.forEach((tabButton) => tabButton.classList.remove("active"));

  // Hide all tab contents
  const tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach((content) => content.classList.remove("active"));

  // Add active class to the selected tab and its content
  document.querySelector(`#${tab}`).classList.add("active");
  document.querySelector(`.tab-button[onclick="changeTab('${tab}')"]`).classList.add("active");
}

// Event listener for PX to VW conversion
document.getElementById("size_in_px-vw").addEventListener("input", function () {
  const viewportWidth = document.getElementById("viewport-vw").value;
  const sizeInPx = this.value;

  if (viewportWidth && sizeInPx) {
    const sizeInVw = (sizeInPx / viewportWidth) * 100;
    document.getElementById("size_in_vw").value = sizeInVw.toFixed(4); // Output VW value
    document.getElementById("viewport-value-vw").textContent = `In a ${viewportWidth}px viewport, `; // Display viewport width
    document.getElementById("px-value-vw").textContent = `${sizeInPx}px   = `; // Display PX value
    document.getElementById("output-value-vw").textContent = `${sizeInVw.toFixed(2)}vw`; // Display Output in VW
  } else {
    document.getElementById("size_in_vw").value = ""; // Clear VW output if inputs are empty
    document.getElementById("px-value-vw").textContent = ""; // Clear PX display
    document.getElementById("viewport-value-vw").textContent = ""; // Clear viewport display
    document.getElementById("output-value-vw").textContent = ""; // Clear output display
  }
});

// Event listener for PX to VH conversion
document.getElementById("size_in_px-vh").addEventListener("input", function () {
  const viewportHeight = document.getElementById("viewport-vh").value;
  const sizeInPx = this.value;

  if (viewportHeight && sizeInPx) {
    const sizeInVh = (sizeInPx / viewportHeight) * 100;
    document.getElementById("size_in_vh").value = sizeInVh.toFixed(4); // Output VH value
    document.getElementById("viewport-value-vh").textContent = `In a ${viewportHeight} px viewport, `; // Display viewport height
    document.getElementById("px-value-vh").textContent = `= ${sizeInPx} px`; // Display PX value
    document.getElementById("output-value-vh").textContent = `${sizeInVh.toFixed(2)}vh`; // Display Output in VH
  } else {
    document.getElementById("size_in_vh").value = ""; // Clear VH output if inputs are empty
    document.getElementById("px-value-vh").textContent = ""; // Clear PX display
    document.getElementById("viewport-value-vh").textContent = ""; // Clear viewport display
    document.getElementById("output-value-vh").textContent = ""; // Clear output display
  }
});

// Clipboard functionality for both VW and VH
document.querySelectorAll(".output-value").forEach(function (outputValue) {
  outputValue.addEventListener("click", function () {
    // Use the Clipboard API to copy the content to the clipboard
    navigator.clipboard.writeText(outputValue.innerText);
  });
});

// BMi CalCulation

function calculateBMI() {
  // Get the user input values
  const age = document.getElementById("age").value;
  const heightFeet = document.getElementById("height-feet").value;
  const heightInches = document.getElementById("height-inches").value;
  const weight = document.getElementById("weight").value;
  const gender = document.querySelector('input[name="gender"]:checked')?.value;
  const resultSection = document.querySelector(".result-section");
  const inputSection = document.querySelector(".input-section");

  // Check for empty fields and show an alert if any are empty
  if (!age || !heightFeet || !heightInches || !weight || !gender) {
    alert("Please fill in all fields before calculating BMI.");
    return; // Exit the function early if validation fails
  }

  console.log("Gender: " + gender);
  console.log("Age: " + age);

  // Convert height to inches
  const heightInInches = parseInt(heightFeet) * 12 + parseInt(heightInches);

  // Convert inches to meters
  const heightInMeters = heightInInches * 0.0254;

  // Calculate BMI (weight in kg and height in meters)
  const bmi = parseInt(weight) / heightInMeters ** 2;
  const descText = document.getElementById("desc");
  const bmiText = document.getElementById("bmiText");
  const bmiCate = interpretBMI(bmi);

  if (bmi) {
    resultSection.style.display = "block";
    inputSection.style.display = "none";
    descText.textContent = bmiCate.category;
    descText.style.color = bmiCate.color;
    bmiText.textContent = bmi.toFixed(2);
  } else {
    descText.textContent = "N/A";
    resultSection.style.display = "none";
    inputSection.style.display = "block";
  }

  console.log(bmi); // Log BMI result
}

function interpretBMI(bmi) {
  if (bmi < 18.5) {
    return { category: "underweight", color: "orange" };
  } else if (bmi < 25) {
    return { category: "healthy", color: "green" };
  } else if (bmi < 30) {
    return { category: "overweight", color: "lightcoral" };
  } else {
    return { category: "obese", color: "crimson" };
  }
}

function back() {
  const resultSection = document.querySelector(".result-section");
  const inputSection = document.querySelector(".input-section");
  resultSection.style.display = "none";
  inputSection.style.display = "block";
}

// Password Generator

function passwordGenerator() {
  const generateButton = document.getElementById("button");
  const password = document.getElementById("pass");
  const svg = document.getElementById("copy_text");
  const alertMsg = document.getElementById("alert");
  const lengthID = document.getElementById("length");
  // const charset = document.querySelector('input[name="charset"]:checked')?.value;

  alertMsg.style.display = "none";
  let length = lengthID.value;
  lengthID.min = 1;
  lengthID.max = 50;
  // let charset = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$~^'&?"_%/*-+=`;

  let uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let lowercase = "abcdefghijklmnopqrstuvwxyz";
  let numeric = "0123456789";
  let symbols = `!@#$~^'&?"_%/*-+=`;

  // Gather selected character sets based on checked checkboxes
  let charset = "";

  if (document.getElementById("uppercase").checked) {
    charset += uppercase;
  }
  if (document.getElementById("lowercase").checked) {
    charset += lowercase;
  }
  if (document.getElementById("number").checked) {
    charset += numeric;
  }
  if (document.getElementById("symbols").checked) {
    charset += symbols;
  }

  if (charset === "") {
    alert("Please select at least one character set.");
    return;
  }

  if (length > 50 || length < 1) {
    alert("Choose between 1 to 50");
  } else {
    let generatedPassword = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.trunc(Math.random() * charset.length);
      generatedPassword += charset.charAt(randomIndex);
    }

    password.value = generatedPassword;
  }
}

function clipboard() {
  const alertMsg = document.getElementById("alert");
  const password = document.getElementById("pass");
  alertMsg.style.display = "block";
  alertMsg.innerHTML = "Copied Text: " + password.value;
  navigator.clipboard.writeText(password.value);
}
