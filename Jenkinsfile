def lastStage = ''
node() {
  properties([disableConcurrentBuilds()])
  try {
    currentBuild.result = "SUCCESS"

    stage('Clean Workspace') {
     cleanWs()
    }
    stage('Set NodeJS env and may install NodeJS') {
      println "Requires: Plugin for NodeJS:"
      println "https://plugins.jenkins.io/nodejs/"
      println "Set up the plugin under jenkinsurl/configureTools/ to install NodeJS if it is missing."
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
          println "Requires: Google Chrome Headless. Could be installed by:"
          println 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" |  tee -a /etc/apt/sources.list'
          println "wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -"
          println "apt-get update"
          println "apt-get -y install libxpm4 libxrender1 libgtk2.0-0 libnss3 libgconf-2-4 google-chrome-stable xvfb gtk2-engines-pixbuf xfonts-cyrillic xfonts-100dpi xfonts-75dpi xfonts-base xfonts-scalable imagemagick x11-apps"
          sh 'npm run ng test -- --watch=false'
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
          println "Requires Docker."
          println "Pull latest image."
          sh "docker pull trion/ng-cli-e2e:latest"
          println "Start e2e test"
          sh "docker run --rm --name ng-cli-e2e -v /volume1/jenkins/jenkins_home/workspace/scalecloud.de/scalecloude.de:/app trion/ng-cli-e2e:latest ng e2e"
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
        sh 'npm i -g firebase-tools'
        sh 'firebase deploy --token"${FIREBASE_TOKEN}" --only hosting -m "Automatic Jenkins release."'
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