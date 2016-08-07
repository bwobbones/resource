@Grab(group='com.gmongo', module='gmongo', version='1.3')
@Grab(group='org.mongodb', module='mongo-java-driver', version='2.12.2')
import com.gmongo.GMongoClient
import com.mongodb.MongoCredential
import com.mongodb.MongoClientURI
import com.mongodb.ServerAddress
import com.mongodb.BasicDBObject
import org.bson.types.ObjectId;

import groovy.json.JsonBuilder

//def mongoURI = new MongoClientURI("mongodb://ip-172-31-20-5:27017/minhr_test")
//def mongoURI = new MongoClientURI("mongodb://minhr:minhr@ds041178.mongolab.com:41178/minhr")
def mongoURI = new MongoClientURI("mongodb://mongo:27017/resourcegreg")
def client = new GMongoClient(mongoURI)

def db = client.getDB("resourcegreg")

println "clearing the database...";
db.personnels.remove([:])
db.users.remove([:])
db.jobDescriptions.remove([:])

println("Sample objectId: " + ObjectId.get());

println "creating personnel"

(0..30).each() {

  List roles = []
  def numRoles = new Random().nextInt(3)
  (0..numRoles).each {
    roles << [_id: ObjectId.get(), roleName: randomRole(), client: randomClient(), projects: [randomProject(), randomProject(), randomProject(), randomProject(), randomProject()]]
  }

  List qualifications = []
  def numQuals = new Random().nextInt(3)
  (0..numQuals).each {
    qualifications << [_id: ObjectId.get(), name: randomQualification(), certificateNumber: randomNumber(), institution: randomInstitution()]
  }

  List trainings = []
  def numTrainings = new Random().nextInt(5)
  (0..numTrainings).each {
    trainings << [_id: ObjectId.get(), name: randomTraining(), certificateNumber: randomNumber(),  institution: randomInstitution()]
  }  

  def personnelName = personnelName()

  def person = [name: personnelName[0], surname: personnelName[1], roles: roles, qualifications: qualifications, trainings: trainings, occupation: randomOccupation()] as BasicDBObject

  println "adding: ${person.surname}, ${person.name}"

  db.personnels << person
}

// Password is 'greg'
def greg = [
  username: 'greg', 
  password: '+FUKgZMEW3YCEYlaEqrfJ+Y/MNDYvVUoxn8oUNtmzd3ylBDReW8QqIYcxdWhFK4h7VTITmnOKr4h7WxvYP7Djw==',
  salt: '5Sl1BtYElakzLqE98jgZsQ==', 
  fullname: 'Greg Lucas-Smith'
] as BasicDBObject

// Password is 'dylan'
def dylan = [
  username: 'dylan',
  password: 'gE3b0/Cfj9e09fKIMEGmIf0ZnVvcur51hVKYwowEZypjjpxG3gs9fcRAhcMGFAlUSbhZ/JsH3zwlo+k+GfHyHw==', 
  salt: 'v/r+uZjCDfvGVBK4SKdMDg==',
  fullname: 'Dylan Watson'
] as BasicDBObject
db.users << greg
db.users << dylan

// functions

def personnelName() {
  def p = 'bob and marc son bert wick ness ton shire step ley ing sley jeff er'.split()

  def firstName = (0..1).collect { p[rand(p.size())] }.join('').capitalize();
  def surname = (0..2).collect { p[rand(p.size())] }.join('').capitalize();

  return [firstName, surname]
}

def projectName() {
  def p = 'mine site que fort es okha frank lin tin gold rould'.split()

  def name = (0..1).collect { p[rand(p.size())] }.join('').capitalize();

  return name;
}

def randomInstitution() {
  List possibleInstitution = []
  possibleInstitution << "AIMS"
  possibleInstitution << "Curtin University"
  possibleInstitution << "TPC Training"
  possibleInstitution << "Edith Cowan University"

  return possibleInstitution[rand(possibleInstitution.size)]
}

def randomRole() {
  List possibleRoles = []
  possibleRoles << "Electrical and Instrument Technician"
  possibleRoles << "Geophysicist"
  possibleRoles << "Mine Geologist"
  possibleRoles << "Chemical Engineer"
  possibleRoles << "Surveyor"
  possibleRoles << "Bogger Operator"
  possibleRoles << "Jumbo Operator" 

  return possibleRoles[rand(possibleRoles.size)]
}

def randomProject() {
  List projects = []

  for ( i in 0..1 ) {
    def name = projectName();

    projects << [id: name, text: name, location: randomLocation(), projectExperience: [randomProjectExperience(), randomProjectExperience()], phaseExperience: [randomPhaseExperience()]]    
  }

  return projects[rand(projects.size)]
}

def randomProjectExperience() {
  List projectExperience = []
  projectExperience << "onOG"
  projectExperience << "fpso"
  projectExperience << "lng"
  projectExperience << "eeha"
  projectExperience << "rpn"
  projectExperience << "other"

  return projectExperience[rand(projectExperience.size)]
}

def randomPhaseExperience() {
  List phaseExperience = []
  phaseExperience << "engineering"
  phaseExperience << "procurement"
  phaseExperience << "construction"
  phaseExperience << "installation"
  phaseExperience << "commissioning"
  phaseExperience << "opsmaint"
  phaseExperience << "decommissioning"
  phaseExperience << "shutdown"

  return phaseExperience[rand(phaseExperience.size)]
}

def randomQualification() {
  List quals = []
  quals << "Electrical Licence"
  quals << "Tropical Basic Offshore Safety Induction and Emergency Training"
  quals << "Maritime Security Identification Card"
  quals << "Gas Test Atmosphere"
  quals << "Working Safely at Heights"
  quals << "Enter Confined space"

  return quals[rand(quals.size)]
}

def randomTraining() {
  List trainings = []
  trainings << "Heavy Vehicle Training"
  trainings << "Work Health & Safety Regulations Updated"
  trainings << "Plant Operator Licensing"
  trainings << "High Risk Licensing"

  return trainings[rand(trainings.size)]
}

def randomClient() {
  List clients = []
  clients << "BHP"
  clients << "Woodside"
  clients << "Rio Tinto"
  clients << "Gold Holdings Pty Ltd"

  return clients[rand(clients.size)]
}

def randomLocation() {
  List locations = []
  locations << "Perth"
  locations << "Northwest Shelf"
  locations << "Sydney"
  locations << "Mt Isa"

  return locations[rand(locations.size)]
}

def randomOccupation() {
  List occupations = []
  occupations << "Worker"
  occupations << "Chemist"
  occupations << "Railway Electrician"
  occupations << "Computer Scientist"

  return occupations[rand(occupations.size)]
}

def randomNumber() {
  return rand(200000);
}

// don't use until i can sort out the dates between groovy and javascript
def randomDate() {
  def dateA = Date.parse("dd-MM-yyyy", "01-12-2013")
  int range = 365
  def randomInterval = new Random().nextInt(range)
  return dateA.plus(randomInterval)
}

def randomOffshore() {
  if (rand(2) == 0) {
    return true;
  }
  return false;
}

def rand(number) {
  return new Random().nextInt(number)
}

// classes

class Role {
  String roleName
  String yearsPerformed
}

class Person {
  String name
}
