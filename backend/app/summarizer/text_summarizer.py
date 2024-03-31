from backend.utils.helpers import resource_loader, output_funcs, mem_funcs
from clustering import TextClusterer
from feature_extraction import FeatureExtractor
from fuzzy_logic import FuzzyLogicSummarizer
from preprocessing import Preprocessor


class TextSummarizer:
    def __init__(self, text, compression_rate, num_threads):
        self.clusters = None
        self.preprocessed_text = None
        self.text = text
        self.compression_rate = compression_rate
        self.num_threads = num_threads
        self.resources = resource_loader()
        self.preprocessor = Preprocessor()
        self.feature_values = None
        self.summary = ""

    def preprocess_text(self):
        self.preprocessed_text = self.preprocessor.pre_process_text(self.text)

    def extract_features(self):
        title, sentences, words = self.preprocessed_text
        feature_extractor = FeatureExtractor(title, sentences, words, self.resources)
        self.feature_values = feature_extractor.features

    def perform_clustering(self):
        title, sentences, words = self.preprocessed_text
        text_clusterer = TextClusterer(sentences, words, self.compression_rate, self.num_threads)
        text_clusterer.perform_clustering()
        self.clusters = text_clusterer.get_clusters()

    def generate_summary(self):
        fuzzy_summarizer = FuzzyLogicSummarizer(
            self.preprocessed_text[1],
            self.feature_values,
            self.clusters,
            mem_funcs,
            output_funcs
        )
        fuzzy_summarizer.set_fuzzy_ranks()
        fuzzy_summarizer.summarize()
        # Convert each Sentence object in the summary to its text representation
        self.summary = [sentence.original for sentence in fuzzy_summarizer.summary]

    def summarize(self):
        self.preprocess_text()
        self.extract_features()
        self.perform_clustering()
        self.generate_summary()
        # Return the summary as a string joined by spaces
        return ' '.join(self.summary)


# file to be summarized
test_text = open('../../resources/input-text.txt', 'r').read()
summarized_text = TextSummarizer(test_text, 60, 8)  # 50% compression rate, 8 threads
summary_text = summarized_text.summarize()
print("Summary: ", summary_text)



from rouge import Rouge

# Calculate ROUGE scores
reference_text = open('../../resources/reference-text.txt', 'r').read()
rouge = Rouge()
scores = rouge.get_scores(summary_text, reference_text)
print(scores)