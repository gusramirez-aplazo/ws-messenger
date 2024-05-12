pipeline {
  agent any
  tools {
    nodejs 'node20.12.2'
  }

  stages {
    stage('Prepare') {
      steps {
        echo 'Preparing..'
        sh 'npm install'
      }
    }
  }
}
