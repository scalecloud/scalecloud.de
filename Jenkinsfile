def lastStage = ''
node() {
  properties([disableConcurrentBuilds()])
  try {
    currentBuild.result = "SUCCESS"

    stage('Clean Workspace') {
     cleanWs()
    }
    stage('Set NodeJS env and may install NodeJS') {
      // Requires https://plugins.jenkins.io/nodejs/
      env.NODEJS_HOME = "${tool 'nodejs'}"
      env.PATH="${env.NODEJS_HOME}/bin:${env.PATH}"
      sh 'npm --version'
    }
    stage('Checkout') {
      lastStage = env.STAGE_NAME
      checkout scm
      echo "Current build result: ${currentBuild.result}"
    }
    stage('Install dependencies') {
        lastStage = env.STAGE_NAME
        sh 'npm install'
    }
    stage('Run Tests') {
        lastStage = env.STAGE_NAME
        try {
          sh 'npm run ng test -- --watch=false --code-coverage'
        }
        catch(err){
            throw err
        }
        finally {
          echo "Running tests done"
        }
    }
    stage('Run e2e Tests') {
        lastStage = env.STAGE_NAME
        try {
          sh 'npm run ng run scalecloud:e2e'
        }
        catch(err){
            throw err
        }
        finally {
          echo "Running e2e done"
        }
    }
    stage('Build') {
        lastStage = env.STAGE_NAME
        sh 'npm run ng build scalecloud'
    }
    stage('Upload') {
        lastStage = env.STAGE_NAME
        echo "Upload implementation needed."
    }
  }
  catch (err) {
    echo "Caught errors! ${err}"
    echo "Setting build result to FAILURE"
    currentBuild.result = "FAILURE"

    mail bcc: '', body: "<br>Project: ${env.JOB_NAME} <br>Build Number: ${env.BUILD_NUMBER} <br> URL de build: ${env.BUILD_URL}", cc: '', charset: 'UTF-8', from: '', mimeType: 'text/html', replyTo: '', subject: "ERROR CI: Project name -> ${env.JOB_NAME}", to: "jenkins@scalecloud.de";
       
    throw err
  }
  finally {
    stage('Clean Workspace') {
      cleanWs()
    }

  }
}