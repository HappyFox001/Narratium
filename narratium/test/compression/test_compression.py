import argparse
import json
import os
import sys
import time
from typing import Tuple

import numpy as np
import torch
from sentence_transformers import SentenceTransformer
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))


class HuggingFaceCompressor:
    """
    Story compressor using HuggingFace models directly.
    """

    def __init__(self, model_name: str = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"):
        print(f"Loading model: {model_name}...")
        self.model_name = model_name

        # Load model with lower precision to save memory
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            self.model = AutoModelForCausalLM.from_pretrained(
                model_name, torch_dtype=torch.float16, low_cpu_mem_usage=True, device_map="auto"
            )

            # Create generation pipeline
            self.pipe = pipeline(
                "text-generation",
                model=self.model,
                tokenizer=self.tokenizer,
                max_new_tokens=512,
                temperature=0.7,
                top_p=0.9,
                repetition_penalty=1.1,
            )
            print(f"Model {model_name} loaded successfully")
        except Exception as e:
            print(f"Error loading model {model_name}: {e}")
            raise

    def compress(self, user_input: str, story: str) -> str:
        """
        Compress a story using the loaded model.

        Args:
            user_input: User input associated with the story
            story: Story text to compress

        Returns:
            Compressed version of the story
        """
        # Create compression prompt
        prompt = f"""
        Please compress the following story while preserving key events, characters, and plot points.
        Make it shorter but keep all important information.
        
        User Input: {user_input}
        
        Story to compress:
        {story}
        
        Compressed story:
        """

        try:
            # Generate compressed story
            outputs = self.pipe(prompt, return_full_text=False)
            compressed_text = outputs[0]["generated_text"]

            # Clean up response
            compressed_text = compressed_text.strip()

            return compressed_text
        except Exception as e:
            print(f"Error compressing story: {e}")
            return story


class EmbeddingEvaluator:
    """
    Evaluates story compression using local embedding models.
    """

    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        """
        Initialize with a small sentence transformer model.

        Args:
            model_name: HuggingFace model name for embeddings
        """
        print(f"Loading embedding model: {model_name}...")
        try:
            self.model = SentenceTransformer(model_name)
            self.model_name = model_name
            print("Embedding model loaded successfully")
        except Exception as e:
            print(f"Error loading embedding model: {e}")
            raise

    def get_embedding(self, text: str) -> np.ndarray:
        """
        Get embedding vector for text using the local model.

        Args:
            text: Text to embed

        Returns:
            Embedding vector as numpy array
        """
        try:
            # Get embedding from model
            embedding = self.model.encode(text, normalize_embeddings=True)
            return embedding

        except Exception as e:
            print(f"Error getting embedding: {e}")
            # Return empty embedding in case of error
            return np.zeros(384)

    def cosine_similarity(self, vec1: np.ndarray, vec2: np.ndarray) -> float:
        """
        Calculate cosine similarity between two vectors.

        Args:
            vec1: First vector
            vec2: Second vector

        Returns:
            Cosine similarity score (0-1)
        """
        # Ensure vectors are normalized
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)

        if norm1 > 0:
            vec1 = vec1 / norm1
        if norm2 > 0:
            vec2 = vec2 / norm2

        # Calculate dot product
        dot_product = np.dot(vec1, vec2)

        # Clip to [-1, 1] range to handle floating point errors
        return float(np.clip(dot_product, -1.0, 1.0))

    def evaluate_compression(self, original: str, compressed: str) -> dict:
        """
        Evaluate compression quality based on length and semantic similarity.

        Args:
            original: Original story text
            compressed: Compressed story text

        Returns:
            Dictionary with evaluation metrics
        """
        # Basic metrics
        original_length = len(original)
        compressed_length = len(compressed)
        compression_ratio = compressed_length / original_length if original_length > 0 else 1.0

        # Get embeddings for both texts
        start_time = time.time()
        original_embedding = self.get_embedding(original)
        compressed_embedding = self.get_embedding(compressed)
        embedding_time = time.time() - start_time

        # Calculate semantic similarity
        semantic_similarity = self.cosine_similarity(original_embedding, compressed_embedding)

        # Calculate overall quality score - balance between compression and similarity
        # Higher is better: we want high similarity and low compression ratio
        quality_score = semantic_similarity * (1 - compression_ratio)

        return {
            "original_length": original_length,
            "compressed_length": compressed_length,
            "compression_ratio": compression_ratio,
            "semantic_similarity": semantic_similarity,
            "quality_score": quality_score,
            "embedding_time": embedding_time,
        }


class StoryDataset:
    """Provides test stories for compression benchmarking"""

    @staticmethod
    def get_story(story_id: str = "village_baker") -> Tuple[str, str]:
        """
        Get a test story and related user input.

        Args:
            story_id: ID of the story to retrieve

        Returns:
            Tuple of (story_text, user_input)
        """
        stories = {
            "village_baker": (
                """
                In a small village nestled among rolling hills, there lived a baker named Marco. Marco was famous for his sourdough bread, 
                which had a perfect crust and a soft, airy interior. People from neighboring towns would travel miles just to buy his bread.
                One morning, Marco discovered that his prized sourdough starter, which had been passed down for three generations, had disappeared. 
                He searched his bakery frantically but couldn't find it anywhere. Without the starter, he couldn't make his famous bread.
                The village council called an emergency meeting. The baker's bread was a source of pride and tourism for their small community.
                They organized search parties to look for clues about the missing starter. Children checked their parents' kitchens, and shopkeepers 
                looked through their storerooms.
                After three days of searching, a young girl named Lily found the starter jar in the hollow of an old oak tree. Beside it was a note 
                from the mischievous village cat, who had somehow learned to write. The note explained that the cat had borrowed the starter because 
                it smelled interesting, but didn't find it tasty.
                Marco was overjoyed to have his starter back. To celebrate, he baked special cat-shaped loaves for everyone in the village. 
                From that day forward, he always kept his starter jar tightly sealed and placed high on a shelf where curious cats couldn't reach it.
                """,
                "Tell me what happened next in the village.",
            ),
            "time_traveler": (
                """
                In the year 2050, Dr. Maya Chen developed the world's first functioning time machine. Her breakthrough came after decades of research into quantum entanglement and gravitational waves. The scientific community was skeptical, but Maya was determined to prove them wrong.

                She first traveled to Ancient Egypt in 1500 BCE. The pyramids were still gleaming white, covered in limestone casing. Maya documented the construction techniques and daily life of the workers. She was amazed by the accuracy of their astronomical calculations without modern tools.

                Returning to 2050, Maya published her findings, causing an uproar in the archaeological community. Some called her a fraud, others demanded access to her technology. The government tried to seize her invention, forcing her to go into hiding.

                By 2055, Maya had established a secret network of historians who used her time machine responsibly. They observed key historical events without interfering, creating the most accurate historical records ever compiled.

                In 2075, now an old woman, Maya made one final journey to the year 3000 to glimpse humanity's future. What she saw gave her hope - a peaceful society that had overcome climate change and resource scarcity. Upon returning, she destroyed her time machine, believing some knowledge was too dangerous for her present world.

                Maya died in 2076, taking many secrets with her. However, her detailed journals were discovered in 2120, inspiring a new generation of scientists to restart her work, but with stronger ethical guidelines established by global authorities.
                """,
                "What happened to Maya's research after her death?",
            ),
            "family_winery": (
                """
                In 1925, Giuseppe Martinelli planted his first vineyard in the rolling hills of Sonoma County. Having immigrated from Italy with nothing but farming knowledge and a few grapevine cuttings from his family's estate, he worked tirelessly to establish his winery.

                During Prohibition, Giuseppe managed to keep his business alive by selling "sacramental wine" to churches, a legal loophole that saved many wineries. His son, Lorenzo, learned every aspect of winemaking by his father's side, from tending the vines to bottling.

                When World War II broke out in 1939, Lorenzo joined the army, leaving the vineyard in his father's aging hands. For four years, Giuseppe struggled alone, refusing to sell even as larger companies offered to buy him out during difficult times.

                Lorenzo returned in 1945, bringing with him a French bride, Isabelle, who had knowledge of French winemaking techniques. Together, they modernized the winery, combining Italian and French methods to create unique wines that gained regional recognition.

                By 1965, their son Anthony had graduated with California's first degree in viticulture. He introduced scientific approaches to the family's traditional methods, expanding their operation and winning their first national awards.

                The vineyard suffered a devastating fire in 1977, destroying half their crops and most of the equipment. Many neighboring wineries went bankrupt following this disaster, but three generations of Martinellis worked together to rebuild.

                In 2001, Anthony's daughter Sofia, after working in marketing for global wine distributors, returned home to take over the business. She brought the family winery into the digital age, establishing online sales and wine tourism experiences.

                In 2023, the Martinelli Estate celebrated its centennial anniversary. The 15-acre vineyard had grown to over 500 acres, and their wines were sold in 30 countries. Five generations of the family gathered for the celebration, with Giuseppe's great-great-granddaughter, only five years old, ceremonially planting a new grapevine to begin the family's second century in business.
                """,
                "How did the Martinelli family adapt to modern winemaking challenges?",
            ),
            "cave_adventure": (
                """
                You carefully approach the cave entrance, feeling the temperature drop noticeably. Strange runes are carved into the stone around the opening, emitting a faint blue glow. As you get closer, a cold wind blows out from inside, carrying an ancient scent.

                You examine the peculiar runes more closely. They appear to be some kind of ancient script, but not quite like any language you recognize. When your finger touches one of the runes, its blue light suddenly brightens, and all the runes around the entrance begin to flash in a rhythmic pattern, as if responding to your touch.

                You take out your notebook and carefully record the complex rune patterns. As you document them, you notice the runes seem to follow some mathematical sequence. Just as you finish recording the final rune, the entire cave entrance trembles slightly, and a deep resonance echoes from the darkness within, as if some mechanism has been activated.

                You cautiously step back and observe the entrance. With a grinding sound, the stone walls around the opening begin to move. The blue glow of the runes connects into a continuous line of light. Some of the rocks slowly sink into the ground, revealing a wider passage. Inside, you can now see steps leading deeper underground, with stronger flashes of light occasionally visible from the depths.
                """,
                "I want to step into the cave and follow the stairs downward.",
            ),
        }

        if story_id not in stories:
            story_id = "village_baker"

        return stories[story_id]


def benchmark_huggingface_models(
    story: str,
    user_input: str,
    models: list = ["TinyLlama/TinyLlama-1.1B-Chat-v1.0", "microsoft/phi-2", "EleutherAI/pythia-410m"],
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2",
    output_file: str = None,
):
    """
    Benchmark different HuggingFace models for story compression.

    Args:
        story: Original story to compress
        user_input: User input related to the story
        models: List of small HuggingFace models to test for compression
        embedding_model: Model to use for embedding evaluation
        output_file: Optional file to save results (JSON)

    Returns:
        Dictionary with benchmark results
    """
    results = []

    # Initialize evaluator with local embedding model
    evaluator = EmbeddingEvaluator(embedding_model)

    print(f"Benchmarking {len(models)} HuggingFace models (<1B parameters) for story compression...")
    print(f"Original story length: {len(story)} characters")
    print(f"Using embedding model: {embedding_model}")

    for model_name in models:
        print(f"\nTesting model: {model_name}")

        try:
            # Create compressor with this model
            compressor = HuggingFaceCompressor(model_name)

            # Time the compression
            start_time = time.time()
            compressed = compressor.compress(user_input, story)
            compression_time = time.time() - start_time

            # Evaluate compression
            evaluation = evaluator.evaluate_compression(story, compressed)

            # Add results
            results.append(
                {
                    "model": model_name,
                    "compression_time": compression_time,
                    "evaluation": evaluation,
                    "compressed_text": compressed[:300] + "..." if len(compressed) > 300 else compressed,
                }
            )

            # Print summary
            print(f"  Compression ratio: {evaluation['compression_ratio']:.3f}")
            print(f"  Semantic similarity: {evaluation['semantic_similarity']:.3f}")
            print(f"  Quality score: {evaluation['quality_score']:.3f}")
            print(f"  Time taken: {compression_time:.2f} seconds")

        except Exception as e:
            print(f"  Error testing model {model_name}: {e}")
            results.append({"model": model_name, "error": str(e)})

    # Sort results by quality score (highest first)
    valid_results = [r for r in results if "error" not in r]
    if valid_results:
        valid_results.sort(key=lambda x: x["evaluation"]["quality_score"], reverse=True)
        best_model = valid_results[0]["model"]
        print(f"\nBest performing model: {best_model}")
        print(f"Quality score: {valid_results[0]['evaluation']['quality_score']:.3f}")

    benchmark_results = {
        "original_story_length": len(story),
        "models_tested": len(models),
        "embedding_model": embedding_model,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "results": results,
    }

    # Save results to file if specified
    if output_file:
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(benchmark_results, f, indent=2, ensure_ascii=False)
        print(f"\nResults saved to {output_file}")

    return benchmark_results


def run_single_huggingface_test(model: str, story_id: str, output_dir: str = "test/compression/results"):
    """
    Run a single compression test with a HuggingFace model and print results.

    Args:
        model: HuggingFace model name to use for compression
        story_id: ID of the test story
        output_dir: Directory to save results
    """
    story, user_input = StoryDataset.get_story(story_id)

    print(f"Testing compression with HuggingFace model: {model}")
    print(f"Story: {story_id}")
    print(f"Story length: {len(story)} characters")

    # Create compressor and evaluator
    compressor = HuggingFaceCompressor(model)
    evaluator = EmbeddingEvaluator()

    # Compress story
    start_time = time.time()
    compressed = compressor.compress(user_input, story)
    compression_time = time.time() - start_time

    # Evaluate compression
    evaluation = evaluator.evaluate_compression(story, compressed)

    # Print results
    print("\nCompression Results:")
    print(f"  Original length: {evaluation['original_length']} characters")
    print(f"  Compressed length: {evaluation['compressed_length']} characters")
    print(f"  Compression ratio: {evaluation['compression_ratio']:.3f}")
    print(f"  Semantic similarity: {evaluation['semantic_similarity']:.3f}")
    print(f"  Quality score: {evaluation['quality_score']:.3f}")
    print(f"  Time taken: {compression_time:.2f} seconds")

    print("\nOriginal story (first 200 chars):")
    print(story[:200] + "...")

    print("\nCompressed story:")
    print(compressed)

    # Save results
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        model_name = model.replace("/", "_")
        filename = f"{output_dir}/{story_id}_{model_name}_{timestamp}.json"

        with open(filename, "w", encoding="utf-8") as f:
            json.dump(
                {
                    "model": model,
                    "story_id": story_id,
                    "original_story": story,
                    "user_input": user_input,
                    "compressed_story": compressed,
                    "evaluation": evaluation,
                    "compression_time": compression_time,
                },
                f,
                indent=2,
                ensure_ascii=False,
            )

        print(f"\nResults saved to {filename}")


def main():
    """Parse command line arguments and run tests"""
    parser = argparse.ArgumentParser(
        description="Benchmark story compression with small HuggingFace models (<1B parameters)"
    )

    # Add arguments
    parser.add_argument(
        "--model",
        "-m",
        type=str,
        default="TinyLlama/TinyLlama-1.1B-Chat-v1.0",
        help="HuggingFace model to use for compression (default: TinyLlama/TinyLlama-1.1B-Chat-v1.0)",
    )
    parser.add_argument(
        "--story",
        "-s",
        type=str,
        default="village_baker",
        help="Story ID to use (village_baker, time_traveler, family_winery, cave_adventure)",
    )
    parser.add_argument("--benchmark", "-b", action="store_true", help="Run full benchmark with multiple models")
    parser.add_argument(
        "--models",
        type=str,
        default="TinyLlama/TinyLlama-1.1B-Chat-v1.0,microsoft/phi-2,EleutherAI/pythia-410m",
        help="Comma-separated list of HuggingFace models to benchmark",
    )
    parser.add_argument(
        "--embedding",
        "-e",
        type=str,
        default="sentence-transformers/all-MiniLM-L6-v2",
        help="Embedding model to use for evaluation",
    )
    parser.add_argument(
        "--output", "-o", type=str, default="test/compression/results", help="Directory to save results"
    )

    args = parser.parse_args()

    # Create output directory if it doesn't exist
    os.makedirs(args.output, exist_ok=True)

    if args.benchmark:
        # Run benchmark with multiple models
        model_list = args.models.split(",")
        story, user_input = StoryDataset.get_story(args.story)

        timestamp = time.strftime("%Y%m%d_%H%M%S")
        output_file = f"{args.output}/benchmark_{args.story}_{timestamp}.json"

        benchmark_huggingface_models(
            story=story,
            user_input=user_input,
            models=model_list,
            embedding_model=args.embedding,
            output_file=output_file,
        )
    else:
        # Run single test
        run_single_huggingface_test(args.model, args.story, args.output)


if __name__ == "__main__":
    main()
