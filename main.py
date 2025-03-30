import uvicorn

from narratium.api.api import app

if __name__ == "__main__":
    print("启动 Narratium API服务...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
