from fastapi import FastAPI, HTTPException
from typing import List, Dict
import numpy as np
import pickle
import warnings
warnings.filterwarnings("ignore", category=UserWarning)


filename="model.pkl"
loaded_model = pickle.load(open(filename, 'rb'))

app = FastAPI()


def get_predictions(probabilities, classes):
    top3_indices_per_target_variable = [np.argsort(target_probs)[0][-3:][::-1] for target_probs in probabilities]
    predictions = {}
    for i, indices in enumerate(top3_indices_per_target_variable):
        predictions[f"T{i+1}"] = [
            {"Class": classes[i][index], "Probability": probabilities[i][0][index] * 100} 
            if index < len(classes[i]) 
            else {"Class": "Out of range", "Probability": probabilities[i][0][index] * 100} 
            for index in indices
        ]
    return predictions

@app.get('/')
def access():
    return { "message":"Hello World" }

@app.post("/api/model/predict")
def predict(sample_data: List[Dict[str, float]]):
    # Convert sample_data into a 2D array
    print(sample_data)
    sample_array = [[sample["value"] for sample in sample_data]]
    # Your model prediction code here
    probabilities = loaded_model.predict_proba(sample_array)
    prediction = loaded_model.predict(sample_array)
    
    response = {
        "prediction": get_predictions(probabilities, loaded_model.classes_),
        "Overall": prediction[0].tolist()
    }

    return response
