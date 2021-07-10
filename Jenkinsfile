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
    if (env.BRANCH_NAME == "master") {
        stage('Run Versions Test') {
            lastStage = env.STAGE_NAME
            try {
              echo "Running Versions test"
            }
            catch(err){
                throw err
            }
            finally {
              echo "Running tests done"
            }
        }
    }
    stage('Trigger test') {
        echo "Trigger test"
        echo "Current build result: ${currentBuild.result}"
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