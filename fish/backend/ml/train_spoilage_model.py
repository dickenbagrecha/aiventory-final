import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score


def train_model(csv_path="synthetic_spoilage_data.csv"):
    print("\n[STEP 1] Loading dataset...")
    df = pd.read_csv(csv_path)
    print("Dataset shape:", df.shape)
    print("Columns:", df.columns.tolist())

    print("\n[STEP 2] Preparing features and target...")
    X = df.drop("risk", axis=1)
    y = df["risk"]

    print("Feature matrix shape:", X.shape)
    print("Target shape:", y.shape)

    print("\n[STEP 3] Splitting dataset (80% train / 20% test)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print("Train size:", X_train.shape[0])
    print("Test size:", X_test.shape[0])

    print("\n[STEP 4] Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    print("Scaling complete.")

    print("\n[STEP 5] Training Random Forest model...")
    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )

    model.fit(X_train_scaled, y_train)
    print("Model training completed.")

    print("\n[STEP 6] Evaluating model...")
    predictions = model.predict(X_test_scaled)

    mse = mean_squared_error(y_test, predictions)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, predictions)

    print("Evaluation Results:")
    print("MSE  :", round(mse, 5))
    print("RMSE :", round(rmse, 5))
    print("R2   :", round(r2, 5))

    print("\n[STEP 7] Saving model and scaler...")
    joblib.dump(model, "spoilage_model.pkl")
    joblib.dump(scaler, "spoilage_scaler.pkl")

    print("Model saved as spoilage_model.pkl")
    print("Scaler saved as spoilage_scaler.pkl")

    print("\n[STEP 8] Feature importance analysis...")
    importances = model.feature_importances_
    feature_importance = pd.DataFrame({
        "feature": X.columns,
        "importance": importances
    }).sort_values(by="importance", ascending=False)

    print(feature_importance)

    print("\n[SUCCESS] Training pipeline complete.")


if __name__ == "__main__":
    train_model()
