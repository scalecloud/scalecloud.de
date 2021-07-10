def lastStage = ''
node() {
  properties([disableConcurrentBuilds()])
  try {
    currentBuild.result = "SUCCESS"

    stage('Clean Workspace') {
     cleanWs()
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
    if (env.BRANCH_NAME == "master") {
        stage('Run Tests') {
            lastStage = env.STAGE_NAME
            try {
              sh 'ng test scalecloud'
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
              sh 'ng run scalecloud:e2e'
            }
            catch(err){
                throw err
            }
            finally {
              echo "Running tests done"
            }
        }
    }
    stage('Build') {
        lastStage = env.STAGE_NAME
        sh 'ng build scalecloud'
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