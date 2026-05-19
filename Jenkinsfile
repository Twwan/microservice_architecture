pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Create network') {
            steps {
                sh 'docker network inspect lab2-net >/dev/null 2>&1 || docker network create lab2-net'
            }
        }

        stage('Build services') {
            steps {
                dir('service-1') {
                    sh 'docker compose up -d --build'
                }
                dir('service-2') {
                    sh 'docker compose up -d --build'
                }
                dir('gateway') {
                    sh 'docker compose up -d'
                }
            }
        }
    }

    post {
        success {
            echo 'Образы собраны успешно'
        }
        failure {
            echo 'Сборка упала'
        }
    }
}
