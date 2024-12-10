# Anomaly-Detection-Application

# Streamlit Demonstration

1. Clone this repo
```sh
git clone https://github.com/Ly-Lynn/Anomaly-Detection-Application
```
2. Install necessary packages
```sh
cd final-project-backend
pip install -r requirements.txt
```
3. Download dataset
```sh
python data_download.py
```
4. Build the database
```sh
cd database
python add_imgs.py
```

5. Run streamlit server
```sh
cd ../streamlit_app
streamlit run .\app.py
```

