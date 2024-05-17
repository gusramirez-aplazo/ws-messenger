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
  }
}
