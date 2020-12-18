pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh '''BUILD_ID=$(cat BUILD_ID)
docker login --username dm874andreas --password 0c55b68b-22df-433d-8f9b-097353b5c1f4
docker build -t dm874andreas/frontend-service:${BUILD_ID} -t dm874andreas/frontend-service:latest .
'''
      }
    }

    stage('Push') {
      steps {
        sh '''BUILD_ID=$(cat BUILD_ID)
docker login --username dm874andreas --password 0c55b68b-22df-433d-8f9b-097353b5c1f4
docker push dm874andreas/frontend-service:latest
docker push dm874andreas/frontend-service:${BUILD_ID}'''
      }
    }

    stage('Deploy') {
      steps {
        sh '''BUILD_ID=$(cat BUILD_ID)
sudo kubectl set image deployment/frontend-service frontend-service=dm874andreas/frontend-service:${BUILD_ID}'''
      }
    }

  }
}