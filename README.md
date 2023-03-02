# sentiment-api-app

## Description
Under Construction

## Modules/Components
1. **polarity**
	- Web API service for finding polarity of a text
	- Written in [Python](https://www.python.org/) with [Flask](https://flask.palletsprojects.com/en/2.2.x/)
	- Request Method and Path => POST {host}/sentiment
	- Request body => {‘text’ : _<input_text>_}
	- Response body => {‘sentiment_score’: _<sentiment_score>_}
		- where sentiment_score is [-1, 1]
		- [-1, 0) => negative 
		- 0 => neutral
		- (0, 1] => positive 
	- Uses a pretrained model to find the sentiment of a text using the library [NLTK](https://www.nltk.org/)
	- The service is hosted using [gunicorn](https://gunicorn.org/)
	- Dependency manager is [pip](https://pip.pypa.io/en/stable/)

2. **subjectivity**
	- Web API service for finding subjectivity of a text
	- Written in [Python](https://www.python.org/) with [Flask](https://flask.palletsprojects.com/en/2.2.x/)
	- Request Method and Path => POST {host}/subjectivity
	- Request body => {‘text’ : _<input_text>_}
	- Response body => {subjectivity: _<subjectivity_score>_}
		- where subjectivity_score is in the range of [0,1]
	- Uses a pretrained model to find the subjectivity of a text using the library [TextBlob](https://textblob.readthedocs.io/en/dev/)
	- The service is hosted using [gunicorn](https://gunicorn.org/)
	- Dependency manager is [pip](https://pip.pypa.io/en/stable/)

3. **frontend**
	- Single page web application to do sentiment analysis on a text - both polarity and subjectivity
	- Written in [React](https://reactjs.org/)
	- The service is hosted using [nginx](https://www.nginx.com/)
	- Dependency manager is [npm](https://www.npmjs.com/)


## Local Deployment
### Pre-requisite
- Download and install [Docker](https://docs.docker.com/get-docker/)
- Create a repository in Artifact Registry in GCP (can be either be done via cnsole or CLI) - [docs](https://cloud.google.com/artifact-registry/docs/repositories/create-repos#docker)

### Steps
0. Make sure docker (service) is running in background

1. Build Images of all 3 services
	```sh
	# Polarity Image
	docker build -t polarity polarity/

	# Subjectivity Image
	docker build -t subjectivity subjectivity/

	# Frontend Image
	docker build -t frontend
	```

2. Run all the 3 services
	```sh
	# Run Polarity image with forwarding port 8081 to port 8080
	docker run -dp 8081:8080 polarity

	# Run Subjectivity image forwarding port 8081 to port 8080
	docker run -dp 8082:8080 subjectivity

	# Run Frontend image forwarding port 3000 to port 8080
	docker run -dp 3000:8080 frontend
	```

3. You can access the hosted webpage and all the apis at respective URLS
	- Webpage : http://localhost:3000/
	- Polarity web API : http://localhost:8081/
	- Subjectivity web API : http://localhost:8082/ 

## GCP Deployment (GKE)
### Pre-requisites
- Download and install [glcoud CLI](https://cloud.google.com/sdk/docs/install)
- Create a repository in Artifact Registry in GCP (can be either be done via cnsole or CLI) - [docs](https://cloud.google.com/artifact-registry/docs/repositories/create-repos#docker)

### Steps
0. Make sure you are authenticated to use gcloud CLI with either your user or IAM user (with required permission)

1. Create GKE cluster (get region details [here](https://cloud.google.com/compute/docs/regions-zones))
	```sh
	gcloud container clusters create-auto <cluster_name> \
	--region <region_name>
	```

2. Build images of the backend web API services and push them to GCP artifact registry
	```sh
	# Build Polarity Image and 
	gcloud builds submit \
	--tag <region_name>-docker.pkg.dev/<project_name>/<artifactory_repo_name>/polarity polarity/

	gcloud builds submit \
	--tag <region_name>-docker.pkg.dev/<project_name>/<artifactory_repo_name>/subjectivity subjectivity/
	```

3. Set up proper image name (used in previous step) in the delpoyment files in the backend services folder ('_image_' parameters)
	- Polarity = polarity/deployment.yaml
	- Subjectivity = polarity/deployment.yaml

4. Deploy the backend web API workflow and service using images pushed in 1 step
	```sh
	# Deploye Polarity Workflow
	kubectl apply -f polarity/deployment.yaml

	# Deploy Polarity Service
	kubectl apply -f polarity/service.yaml


	# Deploy Subjectivity Workflow
	kubectl apply -f subjectivity/deployment.yaml

	# Deploy Subjectivity Service
	kubectl apply -f subjectivity/service.yaml
	```

5. Go to _Kubernetes Engine_ dashboard in GCP web console and get the 'EXTERNAL IP' from the _services_  tab for both the backend services deployed and update them in the Frontend URL references in 'frontend/stc/Main.js' as
	```js
	const sentiment_endpoint = 'http://<polarity_service_EXTERNAL_IP>:8080/sentiment';
	const subjectivity_endpoint = 'http://<subjectivity_service_EXTERNAL_IP>:8080/subjectivity';
	```

6. Build images of the frontend service and push them to GCP artifact registry
	```sh
	# Build Polarity Image and 
	gcloud builds submit \
	--tag <region_name>-docker.pkg.dev/<project_name>/<artifactory_repo_name>/frontend frontend/
	```

7. Set up proper image name (used in previous step) in the delpoyment files in the frontend service folder ('_image_' parameters) - frontend/deployment.yaml

8. Deploy the backend web API workflow and service using images pushed in step 6
	```sh
	# Deploye Frontend Workflow
	kubectl apply -f frontend/deployment.yaml

	# Deploy Frontend Service
	kubectl apply -f frontend/service.yaml
	```

9. Access the web Frontend using the EXTERNAL IP provided in _Kubernetes Engine_ dashboard under _services_ tab


## GCP Deployment (Cloud Run)
### Pre-requisites
- Download and install [glcoud CLI](https://cloud.google.com/sdk/docs/install)

### Steps
0. Make sure you are authenticated to use gcloud CLI with either your user or IAM user (with required permission)
1. Build images of the backend web API services and push them to GCP artifact registry (Skip if already done)
	```sh
	# Build and push Polarity Image
	gcloud builds submit \
	--tag <region_name>-docker.pkg.dev/<project_name>/<artifactory_repo_name>/polarity polarity/

	# Build and push Subjectivity Image
	gcloud builds submit \
	--tag <region_name>-docker.pkg.dev/<project_name>/<artifactory_repo_name>/subjectivity subjectivity/
	```

2. Deploy the cloud run services for the backend services
	```sh
	## Deploy Polarity service
	gcloud run deploy polarity --image <region_name>-docker.pkg.dev/<project_name>/<artifactory_repo_name>/polairty

	## Deploy Subjectivity service
	gcloud run deploy subjectivity --image <region_name>-docker.pkg.dev/<project_name>/<artifactory_repo_name>/subjectivity
	```

3. Go to Cloud Run dashboard in GCP console, get the '_URL_' parameter for the backend services and update the IPs in the frontend URL references
	```js
	const sentiment_endpoint = 'http://<polarity_service_URL>/sentiment';
	const subjectivity_endpoint = 'http://<subjectiry_service_URL>/subjectivity';
	```

4. Build imageof frontend service and push them to GCP artifact registry (Skip if already done)
	```sh
	gcloud builds submit \
	--tag <region_name>-docker.pkg.dev/<project_name>/<artifactory_repo_name>/frontend frontend/
	```

5. Deploy the cloud run services for the frontend service
	```sh
	## Deploy Subjectivity service
	gcloud run deploy subjectivity --image <region_name>-docker.pkg.dev/<project_name>/<artifactory_repo_name>/frontend
	```