from flask import Flask, request
from flask_cors import CORS
import os
from textblob import TextBlob

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/subjectivity', methods=['POST'])
def get_sentiment():
	requestJson = request.get_json(force=True)
	print(requestJson)
	data = requestJson['text']
	return {'subjectivity': round(TextBlob(data).sentiment.subjectivity*100, 2)}

if __name__ == '__main__':
	app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8081)))
