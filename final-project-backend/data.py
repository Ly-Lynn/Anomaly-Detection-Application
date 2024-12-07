import os
from pathlib import Path
from anomalib import TaskType
from anomalib.data import MVTec, PredictDataset
from PIL import *

dataset_root = Path.cwd() / "datasets" / "MVTec"

class DATASET:
    def __init__(self, name_module):
        self.test_paths = []
        self.name_module = name_module
        self.train_paths = []
        self.datamodule = MVTec(
            root=dataset_root,  
            category=self.name_module,
            image_size=256,     
            train_batch_size=16,  
            eval_batch_size=16,   
            num_workers=4,        
        )
        self.check_test_existed=False
        self.root_test = os.path.join(dataset_root, self.name_module, "test_webp")
        self.datamodule.prepare_data()
    def get_train_paths(self):
        return self.train_paths
    def get_test_paths(self):
        return self.test_paths
    def get_name_module(self):
        return self.name_module
    def set_test_paths(self):
        root = os.path.join(dataset_root, self.name_module, "test")
        self.test_paths = [os.path.join(root, x) for x in os.listdir(root)]
    def set_train_paths(self):
        root = os.path.join(dataset_root, self.name_module, "train")
        self.train_paths = [os.path.join(root, x) for x in os.listdir(root)]
    def get_datamodule(self):
        return self.datamodule
    def convert_images_to_webp(self):
        output_folder = os.path.join(dataset_root, self.name_module, "test_webp")
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)
            self.check_test_existed=True
            for image_path in self.test_paths:
                with Image.open(image_path) as img:
                    image_name = os.path.splitext(os.path.basename(image_path))[0] + '.webp'
                    output_path = os.path.join(output_folder, image_name)
                    img.save(output_path, 'WEBP')
                    print(f"Đã lưu ảnh {image_name} vào {output_path}")
        else:
            self.check_test_existed=True
            print("Thư mục đã tồn tại")
    
       