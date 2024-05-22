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
      environment {
        CONTAINER_REGISTRY_TOKEN = credentials('digitalocean-token')
      }
      steps {
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

    stage('Deploy') {
      environment {
        CONTAINER_REGISTRY_TOKEN = credentials('digitalocean-token')
        CONTAINER_REGISTRY_USERNAME = credentials('digitalocean-registry-username')
        S3_ACCESS_KEY_ID = credentials('s3-access-key')
        S3_SECRET_ACCESS_KEY = credentials('s3-secret')
        SHORT_COMMIT = "${GIT_COMMIT[0..7]}"
      }
      steps {
        echo 'Checking out code...'
        checkout scm

        sshagent(['ssh-digital-ocean']){
          echo 'Starting connection to server...'
          sh '''
          ssh gus@gusramirez.dev "sudo docker login -u $CONTAINER_REGISTRY_USERNAME -p $CONTAINER_REGISTRY_TOKEN registry.digitalocean.com && sudo docker stop $IMAGE_NAME && sudo docker rm $IMAGE_NAME && docker run -it -d \
		-p 8000:$MSGR_PORT \
		-e PORT=$MSGR_PORT \
		-e CLOUDFLARE_R2_URL=$CLOUDFLARE_R2_URL \
		-e S3_ACCESS_KEY_ID=$S3_ACCESS_KEY_ID \
		-e S3_SECRET_ACCESS_KEY=$S3_SECRET_ACCESS_KEY \
		-e MISA_MAPS_URL=$MISA_MAPS_URL \
		-e KIDS_WORLD_URL=$KIDS_WORLD_URL \
		--name $IMAGE_NAME \
		--cap-add=SYS_ADMIN \
		--restart unless-stopped \
		$REGISTRY/$IMAGE_NAME:$SHORT_COMMIT"
          '''
        }
      }
    }
  }
}
