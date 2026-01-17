# ----------------------
# Superstore Sales Forecasting System
# Built for Business Relevance & Interpretability
# ----------------------


import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error

# Set Professional Visualization Style
sns.set_style("whitegrid")
plt.rcParams["figure.figsize"] = (14, 7)
plt.rcParams["font.size"] = 12

# ----------------------
# Step 1: Load and Inspect Data
# ----------------------
df = pd.read_csv("Sample - Superstore.csv", encoding="latin1")
print(f"Original Dataset Shape: {df.shape}")

# ----------------------
# Step 2: Data Cleaning & Preprocessing
# ----------------------
# 1. Convert dates to datetime format
df["Order Date"] = pd.to_datetime(df["Order Date"], format="%m/%d/%Y")

# 2. Remove returns and invalid transactions (negative sales/quantity)
df = df[(df["Sales"] > 0) & (df["Quantity"] > 0)]

# 3. Aggregate to daily sales (sum all transactions per day)
daily_sales = df.groupby("Order Date")["Sales"].sum().reset_index()

# 4. Fill missing dates (days with no sales) with 0 to maintain continuous time series
full_date_range = pd.date_range(
    start=daily_sales["Order Date"].min(), 
    end=daily_sales["Order Date"].max(), 
    freq="D"
)
daily_sales = daily_sales.set_index("Order Date").reindex(full_date_range).fillna(0).reset_index().rename(columns={"index": "Order Date"})

print(f"Cleaned Daily Sales Shape: {daily_sales.shape}")

# ----------------------
# Step 3: Exploratory Data Analysis (EDA) for Business Insights
# ----------------------
print("\n--- Key Business Insights from Historical Data ---")

# 1. Monthly Sales Trend
monthly_sales = daily_sales.resample("M", on="Order Date")["Sales"].sum().reset_index()

plt.figure()
sns.lineplot(data=monthly_sales, x="Order Date", y="Sales", color="#2563eb", marker="o", linewidth=2)
plt.title("Monthly Total Sales Trend (2014-2017)")
plt.xlabel("Date")
plt.ylabel("Total Monthly Sales ($)")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# 2. Seasonality Analysis: Average Sales by Month
daily_sales["month"] = daily_sales["Order Date"].dt.month
monthly_avg = daily_sales.groupby("month")["Sales"].mean().reset_index()

plt.figure()
sns.barplot(data=monthly_avg, x="month", y="Sales", palette="viridis")
plt.title("Average Daily Sales by Month (Seasonality Pattern)")
plt.xlabel("Month (1=January, 12=December)")
plt.ylabel("Average Daily Sales ($)")
plt.tight_layout()
plt.show()

# 3. Weekly Sales Pattern
daily_sales["day_of_week"] = daily_sales["Order Date"].dt.dayofweek  # 0=Monday, 6=Sunday
day_avg = daily_sales.groupby("day_of_week")["Sales"].mean().reset_index()
day_avg["day_name"] = pd.Categorical(
    day_avg["day_of_week"].map({0:"Mon",1:"Tue",2:"Wed",3:"Thu",4:"Fri",5:"Sat",6:"Sun"}),
    categories=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    ordered=True
)

plt.figure()
sns.barplot(data=day_avg, x="day_name", y="Sales", palette="coolwarm")
plt.title("Average Daily Sales by Day of Week")
plt.xlabel("Day of Week")
plt.ylabel("Average Daily Sales ($)")
plt.tight_layout()
plt.show()

# ----------------------
# Step 4: Feature Engineering for Forecasting
# ----------------------
# Create time-based features that capture trend and seasonality
daily_sales["time_index"] = np.arange(len(daily_sales))  # Linear trend feature
daily_sales["quarter"] = daily_sales["Order Date"].dt.quarter
daily_sales["is_weekend"] = (daily_sales["day_of_week"] >= 5).astype(int)  # 1 = Weekend, 0 = Weekday

# Define feature types (categorical features need one-hot encoding)
categorical_features = ["month", "day_of_week", "quarter"]
numerical_features = ["time_index", "is_weekend"]

# Preprocessing pipeline to handle categorical features correctly
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(drop="first", handle_unknown="ignore"), categorical_features),
        ("num", "passthrough", numerical_features)
    ]
)

# ----------------------
# Step 5: Time-Based Train-Test Split
# Use last 6 months as test data (realistic for business forecasting)
# ----------------------
test_duration = 6  # Months
last_date = daily_sales["Order Date"].max()
test_start = last_date - pd.DateOffset(months=test_duration)

train = daily_sales[daily_sales["Order Date"] < test_start]
test = daily_sales[daily_sales["Order Date"] >= test_start]

print(f"\nTrain Period: {train['Order Date'].min().date()} to {train['Order Date'].max().date()} ({len(train)} days)")
print(f"Test Period: {test['Order Date'].min().date()} to {test['Order Date'].max().date()} ({len(test)} days)")

# Prepare features and target variables
X_train = train[categorical_features + numerical_features]
y_train = train["Sales"]

X_test = test[categorical_features + numerical_features]
y_test = test["Sales"]

# ----------------------
# Step 6: Model Training
# ----------------------
# Create end-to-end pipeline with preprocessing and regression model
model = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("regressor", LinearRegression())
])

model.fit(X_train, y_train)

# ----------------------
# Step 7: Model Evaluation (Business-Friendly Metrics)
# ----------------------
test["predicted_sales"] = model.predict(X_test)

mae = mean_absolute_error(y_test, test["predicted_sales"])
rmse = np.sqrt(mean_squared_error(y_test, test["predicted_sales"]))
avg_test_sales = y_test.mean()

print(f"\n--- Model Performance ---")
print(f"Mean Absolute Error (MAE): ${mae:,.2f}")
print(f"Root Mean Squared Error (RMSE): ${rmse:,.2f}")
print(f"Average Daily Sales in Test Period: ${avg_test_sales:,.2f}")
print(f"Error as % of Average Sales: {(rmse/avg_test_sales)*100:.2f}%")

# Plot Actual vs Predicted Sales for Test Period
plt.figure()
sns.lineplot(data=test, x="Order Date", y="Sales", label="Actual Sales", color="#ef4444")
sns.lineplot(data=test, x="Order Date", y="predicted_sales", label="Predicted Sales", color="#22c55e", linestyle="--")
plt.title("Test Period: Actual vs Predicted Daily Sales")
plt.xlabel("Date")
plt.ylabel("Daily Sales ($)")
plt.legend()
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# ----------------------
# Step 8: 12-Month Future Forecast
# ----------------------
forecast_duration = 12  # Months
future_start = daily_sales["Order Date"].max() + pd.Timedelta(days=1)
future_end = future_start + pd.DateOffset(months=forecast_duration)
future_dates = pd.date_range(start=future_start, end=future_end, freq="D")

# Create feature dataframe for future dates
future_df = pd.DataFrame({"Order Date": future_dates})
future_df["month"] = future_df["Order Date"].dt.month
future_df["day_of_week"] = future_df["Order Date"].dt.dayofweek
future_df["quarter"] = future_df["Order Date"].dt.quarter
future_df["time_index"] = np.arange(len(daily_sales), len(daily_sales) + len(future_df))
future_df["is_weekend"] = (future_df["day_of_week"] >= 5).astype(int)

# Generate forecasts
future_df["forecasted_sales"] = model.predict(future_df[categorical_features + numerical_features])

# ----------------------
# Step 9: Final Business-Friendly Visualization
# ----------------------
plt.figure(figsize=(16, 8))
# Plot historical sales
sns.lineplot(data=daily_sales, x="Order Date", y="Sales", label="Historical Sales", color="#94a3b8", alpha=0.7)
# Plot test predictions
sns.lineplot(data=test, x="Order Date", y="predicted_sales", label="Test Predictions", color="#3b82f6", linestyle="--")
# Plot future forecast
sns.lineplot(data=future_df, x="Order Date", y="forecasted_sales", label="12-Month Forecast", color="#10b981", linewidth=2)

plt.title("Superstore Sales: Historical Data, Test Predictions, and 12-Month Forecast", fontsize=16)
plt.xlabel("Date", fontsize=14)
plt.ylabel("Daily Sales ($)", fontsize=14)
plt.legend(fontsize=12)
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# ----------------------
# EXPORT DATA FOR POWER BI
# ----------------------

# 1. Export Historical Daily Sales with all features
daily_sales_export = daily_sales.copy()
daily_sales_export["data_type"] = "Historical"
daily_sales_export["predicted_sales"] = None  # No predictions for historical
daily_sales_export.to_csv("historical_sales.csv", index=False)
print("✅ Exported: historical_sales.csv")

# 2. Export Test Period with Actual vs Predicted
test_export = test.copy()
test_export["data_type"] = "Test"
test_export.to_csv("test_predictions.csv", index=False)
print("✅ Exported: test_predictions.csv")

# 3. Export Future Forecast
future_export = future_df.copy()
future_export["data_type"] = "Forecast"
future_export["Sales"] = None  # No actual sales for future
future_export.rename(columns={"forecasted_sales": "predicted_sales"}, inplace=True)
future_export.to_csv("future_forecast.csv", index=False)
print("✅ Exported: future_forecast.csv")

# 4. Create COMBINED dataset (Best for Power BI)
combined = pd.concat([
    daily_sales_export[["Order Date", "Sales", "predicted_sales", "data_type", "month", "day_of_week", "quarter", "is_weekend"]],
    test_export[["Order Date", "Sales", "predicted_sales", "data_type", "month", "day_of_week", "quarter", "is_weekend"]],
    future_export[["Order Date", "Sales", "predicted_sales", "data_type", "month", "day_of_week", "quarter", "is_weekend"]]
], ignore_index=True)

# Remove duplicate historical rows (test period exists in both)
combined = combined.drop_duplicates(subset=["Order Date", "data_type"], keep="last")
combined.to_csv("combined_sales_data.csv", index=False)
print("✅ Exported: combined_sales_data.csv")

# 5. Export Monthly Aggregated Data (for summary charts)
monthly_summary = daily_sales.groupby([
    daily_sales["Order Date"].dt.to_period("M")
]).agg({
    "Sales": "sum",
    "time_index": "first"
}).reset_index()
monthly_summary["Order Date"] = monthly_summary["Order Date"].dt.to_timestamp()
monthly_summary.to_csv("monthly_sales_summary.csv", index=False)
print("✅ Exported: monthly_sales_summary.csv")

# 6. Export Model Metrics
metrics = pd.DataFrame({
    "Metric": ["MAE", "RMSE", "Average Daily Sales", "Error Percentage"],
    "Value": [mae, rmse, avg_test_sales, (rmse/avg_test_sales)*100],
    "Unit": ["$", "$", "$", "%"]
})
metrics.to_csv("model_metrics.csv", index=False)
print("✅ Exported: model_metrics.csv")

# 7. Export Seasonality Data
monthly_avg.to_csv("monthly_seasonality.csv", index=False)
day_avg.to_csv("weekly_pattern.csv", index=False)
print("✅ Exported: monthly_seasonality.csv, weekly_pattern.csv")

print("\n🎉 All files exported successfully! Ready for Power BI.")