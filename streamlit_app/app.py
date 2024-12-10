import streamlit as st
import os
import torch
from PIL import Image
import torchvision.transforms as transforms
import sqlite3
from Patchcore import PatchCore
from GAN import GanInference
from AE import AEInference

DB_NAME = r'D:\codePJ\UIT\CS331\lastterm\final-project-backend\database\app.db'
conn = sqlite3.connect(DB_NAME)
cursor = conn.cursor()

def load_image(image_path):
    try:
        transform = transforms.Compose([
            transforms.Resize((96, 96))
        ])
        image = Image.open(image_path)
        # print(image.size)
        image = transform(image)
        return image
    except Exception as e:
        st.error(f"Error loading image: {e}")
        return None

def call_model (model, module):
    if model == 'PatchCore':
        model = PatchCore(ckp_root=r'D:\codePJ\UIT\CS331\lastterm\final-project-backend\pretrained_models', name_module=module, outdir='./output')
    if model == 'GAN':
        model = GanInference(ckp_root=r'D:\codePJ\UIT\CS331\lastterm\final-project-backend\pretrained_models', name_module=module, outdir='./output')
        # pass
    if model == 'AutoEncoder':
        model = AEInference(ckp_root=r'D:\codePJ\UIT\CS331\lastterm\final-project-backend\pretrained_models', name_module=module, outdir='./output')
    if model == 'Classification':
        # model = Classification()
        pass
    return model


def main():
    st.title("Image Inference Application")
    
    if 'selected_image' not in st.session_state:
        st.session_state.selected_image = None
    if 'selected_model' not in st.session_state:
        st.session_state.selected_model = None
    if 'inference_result' not in st.session_state:
        st.session_state.inference_result = None

    input_type = st.sidebar.radio(
        "Choose Image Input Method", 
        ["Upload Image", "Select from Dataset"]
    )
    
    available_models = [
        "Classification",
        "AutoEncoder",
        "GAN",
        "PatchCore",
    ]
    selected_model = st.sidebar.selectbox(
        "Select Inference Model", 
        available_models
    )
    
    if input_type == "Upload Image":
        uploaded_file = st.file_uploader(
            "Choose an image...", 
            type=["jpg", "jpeg", "png"]
        )
        
        if uploaded_file is not None:
            st.image(uploaded_file, caption="Uploaded Image", use_container_width=True)
            
            if st.button("Run Inference"):
                image = Image.open(uploaded_file)
    
    else:
        cursor.execute("SELECT DISTINCT data_module FROM images_test")
        query_res = cursor.fetchall()
        DATA_MODULES = [row[0] for row in query_res]
        selected_module = st.sidebar.selectbox(
            "Choose Dataset", 
            list(DATA_MODULES)
        )
        cursor.execute("SELECT image_path, groundtruth_path, label FROM images_test WHERE data_module = ?", (selected_module,))
        test_images = cursor.fetchall()
        # print(test_images)
        test_paths = [row[0] for row in test_images]
        groundtruth_paths = [row[1] for row in test_images]
        labels = [row[2] for row in test_images]
        st.subheader(f"Images in {selected_module} Dataset")
        
        st.markdown("""
            <style>
            .stImage {
                
                overflow-y: auto;
            }
            .stImage > div > div {
                font-size: 10px !important;
            }
            .stButton > button > div > p {
                font-size: 12px !important; 
                padding: 5px 5px;
            }
            </style>
            """, unsafe_allow_html=True)
        
        with st.container(height=500):
            cols = st.columns(5)
            
            for i, image_path in enumerate(test_paths):
                col = cols[i % 5]
                
                with col:
                    image_name = (image_path.split('\\')[-2]).split('.')[0]+ '_' +image_path.split('\\')[-1]
                    
                    image = load_image(image_path)
                        
                    if image:
                        st.image(image, caption=image_name, use_container_width=True)
                        
                        if st.button(f"Inference", key=f"inf_{image_name}", use_container_width = True):
                            image_info = {
                                "image_name": image_name,
                                "groundtruth_path": groundtruth_paths[i],
                                "label": labels[i],
                                "image_path": image_path
                            }
                            st.session_state.selected_image = image_info
                            if available_models:
                                print(selected_model, selected_module)
                                model = call_model(selected_model, selected_module)
                                model.inference(image_info)
                                model.visualization(image_info['groundtruth_path'], model.result['prediction']['pred_masks'])
                                st.session_state.inference_result = model.result
                                
        if st.session_state.selected_image:
            st.subheader("Selected Image")
            st.markdown(st.session_state.selected_image['image_name'])
            if st.session_state.selected_image['label'] == 0:
                st.write("This is not an anomaly")
            else:
                st.write("This is an anomaly")
            st.image(st.session_state.selected_image['image_path'], width=300)
        if st.session_state.inference_result:
            if st.session_state.inference_result['fig_masks']:
                st.image(st.session_state.inference_result['fig_masks'])
            if st.session_state.inference_result['fig_roc_curve']:
                # with st.container(height=500):
                st.image(st.session_state.inference_result['fig_roc_curve'])
            st.subheader("Inference Result")
            st.write(st.session_state.inference_result)

if __name__ == "__main__":
    main()