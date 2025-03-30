#!/bin/bash

# run ollama
# ollama run gemma3:4b-it-fp16 --keepalive 2562047h47m16.854775807s &
ollama run qwen2.5:14b --keepalive 2562047h47m16.854775807s &
# run python api
python main.py
