import os
from pathlib import Path
from anomalib import TaskType
from anomalib.data import MVTec, PredictDataset
from PIL import *
from tqdm import tqdm

dataset_root = Path.cwd() / "datasets" / "MVTec"

class DATASET:
    def __init__(self, name_module, name_model):
        self.test_paths = [] 
        self.name_model = name_model
        self.name_module = name_module
        self.datamodule = MVTec(
            root=dataset_root,  
            category=self.name_module,
            image_size=256,     
            train_batch_size=16,  
            eval_batch_size=16,   
            num_workers=4,        
        )
        self.root_test_webp = os.path.join(dataset_root, self.name_module, "test_webp")
        if not os.listdir(self.root_test_webp):
            self.convert_images_to_webp()
        if not os.listdir(dataset_root):
            print(f"Download data")
            self.datamodule.prepare_data()
        self.test_dataset = PredictDataset(
                                        root=os.path.join(dataset_root, self.name_module, "test"),
                                        image_size=256,
                                        num_workers=4,)
    
    def convert_img_to_webp(self, img_path, output_folder):
        with Image.open(img_path) as img:
            image_name = os.path.splitext(os.path.basename(img_path))[0] + '.webp'
            output_path = os.path.join(output_folder, image_name)
            img.save(output_path, 'WEBP')
    def convert_images_to_webp(self):
        output_folder = self.root_test_webp
        os.makedirs(output_folder, exist_ok=True)
        for image_path in tqdm(self.test_paths):
            self.convert_img_to_webp(image_path, output_folder)
