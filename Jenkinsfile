pipeline {
  agent any
  tools {
    nodejs 'node-20.12.2'
  }

  stages {
    stage('Prepare') {
      steps {
        echo 'Preparing..'
        sh 'npm ci && npx semantic-release'
      }
    }

    stage('Build and push') {
      steps {
        withEnv(["CONTAINER_REGISTRY_TOKEN=${CONTAINER_REGISTRY_TOKEN}"]){
          echo 'Checking out code...'
          checkout scm

          echo 'Doctl login...'
          sh 'doctl auth init -t $CONTAINER_REGISTRY_TOKEN'

          echo 'Logging in to Registry..'
          sh 'make login'

          echo 'Remove old images...'
          sh 'if [ ! -z "$(doctl registry repository list | grep "$(echo $IMAGE_NAME)")" ]; then doctl registry repository delete-manifest $(echo $IMAGE_NAME) $(doctl registry repository list-tags $(echo $IMAGE_NAME) | grep -o "sha.*") --force; else echo "No repository"; fi'

          echo 'Building..'
          sh 'make build'

          echo 'Pushing..'
          sh 'make push'
        }
      }
    }
  }
}
