import joblib
import pandas as pd
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
def get_prediction(store, item, current_stock, base_price):
    store = str(store).replace(" ", "_")
    item = str(item).replace(" ", "_")
    model_path = os.path.join(BASE_DIR, "models", f"{store}_{item}.pkl")
 
    if not os.path.exists(model_path):
        return {"error": f"{model_path} Model not found"}

    model = joblib.load(model_path)
    
    # Next 7 days forecast
    future = model.make_future_dataframe(periods=7)
    future['is_payday'] = future['ds'].apply(lambda x: 1 if (x.day >= 28 or x.day <= 5) else 0)
    future['is_weekend'] = future['ds'].dt.dayofweek.apply(lambda x: 1 if x >= 5 else 0)
    
    forecast = model.predict(future).tail(7)
    
    # Logic for Dashboard
    prediction = forecast.iloc[0]['yhat']
    upper_bound = forecast.iloc[0]['yhat_upper']
    
    status = "Stable"
    color = "green"
    if current_stock < upper_bound:
        status = "Critical: Reorder Now"
        color = "red"
        
    return {
        "demand": round(prediction, 1),
        "status": status,
        "color": color,
        "price": round(base_price * 1.1 if prediction > 100 else base_price, 2)
    }