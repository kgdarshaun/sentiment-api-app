from flask import Flask, request
from flask_cors import CORS
import os
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

nltk.downloader.download('vader_lexicon')

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/sentiment', methods=['POST'])
def get_sentiment():
	requestJson = request.get_json(force=True)
	print(requestJson)
	data = requestJson['text']
	sia = SentimentIntensityAnalyzer()
	sentiment_score = sia.polarity_scores(data).get('compound')
	return {'sentiment_score': round(sentiment_score, 2)}

if __name__ == '__main__':
	app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
