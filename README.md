# distance Calculator

**for run clone file locally**
for run server : cd server => npm install => npm run start
for client side: cd client => npm install => npm run start


server(Node app) : backed is diployed on Heroku

**run Server with docker Server :**
build command => sudo docker build -t nodecode . 
run command=> docker run --publish 4444:4444 nodecode

**run Client with docker Client :**
build command => sudo docker build -t reactcode .
run command=> sudo docker run -p 3001:3001 reactcode

**pull docker Image from docker hub**
docker pull manish377/newnodetest:version1

**build it**
sudo docker build -t manish377/newnodetest .

**run it**
sudo docker run -p 3001:3001 manish377/newnodetest

