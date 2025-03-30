import torch

if torch.cuda.is_available():
    print(torch.cuda.is_available())
    print(torch.__version__)

elif torch.backends.mps.is_available():
    print("MPS is available")
else:
    print("No GPU available")
