import numpy as np
import pandas as pd
import os

def generate_synthetic_spoilage_data(
    samples=5000,
    random_state=42,
    save_csv=True,
    file_path="synthetic_spoilage_data.csv"
):
    np.random.seed(random_state)

    hours_since_catch = np.random.uniform(1, 72, samples)
    hours_before_ice = np.random.uniform(0, 10, samples)
    avg_storage_temp = np.random.uniform(-2, 15, samples)
    temp_variance = np.random.uniform(0, 5, samples)
    species_shelf_life = np.random.uniform(12, 72, samples)
    weight_kg = np.random.uniform(50, 2000, samples)

    # Base nonlinear spoilage dynamics
    risk = (
        0.03 * hours_since_catch +
        0.08 * hours_before_ice +
        0.06 * np.maximum(avg_storage_temp - 4, 0) +
        0.02 * temp_variance -
        0.02 * (species_shelf_life / 24)
    )

    # Add controlled noise
    risk += np.random.normal(0, 0.05, samples)

    # Sigmoid normalization (0–1)
    risk = 1 / (1 + np.exp(-risk))

    df = pd.DataFrame({
        "hours_since_catch": hours_since_catch,
        "hours_before_ice": hours_before_ice,
        "avg_storage_temp": avg_storage_temp,
        "temp_variance": temp_variance,
        "species_shelf_life": species_shelf_life,
        "weight_kg": weight_kg,
        "risk": risk
    })

    if save_csv:
        df.to_csv(file_path, index=False)
        print(f"[INFO] Synthetic dataset saved to: {os.path.abspath(file_path)}")

    return df
if __name__ == "__main__":
    df = generate_synthetic_spoilage_data(
        samples=10000,
        file_path="synthetic_spoilage_data.csv"
    )
    print("[SUCCESS] Synthetic dataset generated.")
