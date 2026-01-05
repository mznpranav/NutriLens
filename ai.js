/* -------------------------------------------------
   NutriSurge AI Logic (Educational, Non-Medical)
-------------------------------------------------- */

function confidenceLabel(level) {
  if (level === "high") return "🔴 Confidence: High impact";
  if (level === "medium") return "🟡 Confidence: Medium impact";
  return "🟢 Confidence: Low impact";
}

/* -------- ENTER KEY SUPPORT -------- */
document.addEventListener("DOMContentLoaded", () => {
  const itemInput = document.getElementById("itemInput");
  if (itemInput) {
    itemInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        runAIWithText();
      }
    });
  }
});

/* -------- FOOD TYPE DETECTION -------- */
function detectFoodType(item) {
  const packaged = [
    "chips","noodles","biscuit","cookie","oreo","maggi",
    "snack","cake","chocolate","namkeen"
  ];
  const dairy = [
    "milk","curd","yogurt","cheese","paneer","buttermilk"
  ];
  const fresh = [
    "apple","banana","fruit","vegetable","salad",
    "orange","grape","spinach","carrot"
  ];
  const beverage = [
    "juice","soft drink","soda","cola","coffee",
    "tea","energy drink"
  ];

  if (packaged.some(f => item.includes(f))) return "packaged";
  if (dairy.some(f => item.includes(f))) return "dairy";
  if (fresh.some(f => item.includes(f))) return "fresh";
  if (beverage.some(f => item.includes(f))) return "beverage";
  return "general";
}

/* -------- TEXT-BASED ANALYSIS -------- */
function runAIWithText() {
  const item = document.getElementById("itemInput").value.toLowerCase();
  const age = document.getElementById("ageInput").value;
  const goal = document.getElementById("goalInput").value;
  const output = document.getElementById("output");
  const followup = document.getElementById("followup");

  followup.classList.add("hidden");

  if (!item.trim()) {
    output.innerText = "Please enter a food item name.";
    return;
  }

  output.innerText = "Analyzing product…";

  setTimeout(() => {
    let impact = "medium";
    let foodType = detectFoodType(item);

    let response = "Here’s a personalized overview:\n\n";
    response += confidenceLabel(impact) + "\n\n";

    /* BASE DESCRIPTION */
    if (foodType === "fresh") {
      response +=
        "• This appears to be a fresh or minimally processed food.\n" +
        "• Generally contributes positively to daily nutrition.\n";
      impact = "low";
    } else if (foodType === "dairy") {
      response +=
        "• This is a dairy-based food.\n" +
        "• Can provide calcium and protein depending on fat content.\n";
    } else if (foodType === "beverage") {
      response +=
        "• This is a beverage.\n" +
        "• Health impact depends on sugar, caffeine, or additives.\n";
    } else if (foodType === "packaged") {
      response +=
        "• This appears to be a packaged or processed food.\n" +
        "• Nutritional quality depends on portion size and frequency.\n";
    } else {
      response +=
        "• This is a commonly consumed food item.\n" +
        "• Health impact depends on preparation and portion size.\n";
    }

    /* PERSONALIZATION */
    if (goal === "digestion") {
      response +=
        "• Digestive response may vary based on individual sensitivity.\n";
      impact = "high";
    }

    if (goal === "energy") {
      response +=
        "• May influence energy levels depending on timing and quantity.\n";
    }

    if (goal === "fitness") {
      response +=
        "• Nutritional value may be limited for muscle recovery goals.\n";
    }

    if (age && age >= 40) {
      response +=
        "• Moderation becomes more important as nutritional needs change with age.\n";
      impact = "high";
    }

    response +=
      "\nOverall takeaway:\n" +
      (foodType === "fresh"
        ? "A healthy choice when included as part of a balanced diet."
        : "Fine occasionally, but balance and moderation are key.");

    output.innerText = response;
    followup.classList.remove("hidden");
  }, 1200);
}

/* -------- IMAGE-BASED ANALYSIS -------- */
function runAIWithImage() {
  const fileInput = document.getElementById("imageInput");
  const preview = document.getElementById("preview");
  const age = document.getElementById("ageInput").value;
  const goal = document.getElementById("goalInput").value;
  const output = document.getElementById("output");
  const followup = document.getElementById("followup");

  followup.classList.add("hidden");

  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    preview.src = reader.result;
    preview.style.display = "block";
  };
  reader.readAsDataURL(file);

  output.innerText = "Reading ingredient label…";

  setTimeout(() => {
    let response = "Here’s a personalized overview:\n\n";
    response += confidenceLabel("high") + "\n\n";

    response +=
      "• Ingredients suggest added sugars, preservatives, or refined oils.\n" +
      "• These are safe in regulated amounts but best limited.\n";

    if (goal === "digestion") {
      response += "• May contribute to gas or acidity in some individuals.\n";
    }

    if (goal === "energy") {
      response += "• May cause short-term energy spikes followed by fatigue.\n";
    }

    if (age && age >= 40) {
      response += "• Frequent intake may not align with long-term wellness goals.\n";
    }

    response +=
      "\nOverall takeaway:\n" +
      "Best consumed occasionally, with preference for whole foods.";

    output.innerText = response;
    followup.classList.remove("hidden");
  }, 1500);
}

/* -------- FOLLOW-UP QUESTIONS (CONTEXT-AWARE) -------- */
function followUp(type) {
  const output = document.getElementById("output");
  const item = document.getElementById("itemInput").value.toLowerCase();
  const foodType = detectFoodType(item);

  if (type === "healthy") {
    let response = "\n\n🥗 Is it healthy?\n";

    if (foodType === "fresh") {
      response +=
        "• Generally considered a healthy choice.\n" +
        "• Rich in natural nutrients when consumed fresh.\n";
    } else if (foodType === "dairy") {
      response +=
        "• Can be healthy depending on fat content and portion size.\n" +
        "• Provides calcium and protein for many people.\n";
    } else if (foodType === "beverage") {
      response +=
        "• Health impact depends on sugar or caffeine levels.\n" +
        "• Unsweetened or low-sugar options are better.\n";
    } else {
      response +=
        "• Healthiness depends on frequency and portion size.\n" +
        "• Minimally processed foods are generally better choices.\n";
    }

    output.innerText += response;
  }

  if (type === "effects") {
    let response = "\n\n🧠 How it may affect you:\n";

    if (foodType === "fresh") {
      response +=
        "• Usually supports digestion and steady energy.\n" +
        "• Benefits increase when part of a balanced diet.\n";
    } else if (foodType === "dairy") {
      response +=
        "• May support bone and muscle health.\n" +
        "• Can cause discomfort for lactose-sensitive individuals.\n";
    } else if (foodType === "beverage") {
      response +=
        "• May affect hydration or energy depending on ingredients.\n" +
        "• Some people experience restlessness or crashes.\n";
    } else {
      response +=
        "• Some people may experience digestion or energy-related effects.\n" +
        "• Individual responses vary — listening to your body is important.\n";
    }

    output.innerText += response;
  }
}

