class Student {
  id;
  name;
  surName;
  role;
  email;
  yearBorn;
  code;
  password;
  canEnrol;

  constructor(
    id,
    name,
    surName,
    role,
    email,
    yearBorn,
    code,
    password,
    canEnrol
  ) {
    this.id = id;
    this.name = name;
    this.surName = surName;
    this.role = role;
    this.email = email;
    this.yearBorn = yearBorn;
    this.code = code;
    this.password = password;
    this.canEnrol = canEnrol;
  }

  static studentFromObject({
    id,
    name,
    surName,
    role,
    email,
    yearBorn,
    code,
    password,
    canEnrol,
  }) {
    return new Student(
      id,
      name,
      surName,
      role,
      email,
      yearBorn,
      code,
      password,
      canEnrol
    );
  }

  static getStudentFromId(id) {
    const collectionOfStudents =
      LocalStorageInterface.getCollection("students");

    let returnStudent = null;

    collectionOfStudents.forEach((student) => {
      if (student.id == id) {
        returnStudent = this.studentFromObject(student);
      }
    });

    return returnStudent;
  }
}

class LocalStorageInterface {
  static storeElementInCollection(element, storageKeyName, maxElements = 0) {
    var collectionFromStorage = localStorage.getItem(storageKeyName)
      ? JSON.parse(localStorage.getItem(storageKeyName))
      : []; //

    if (maxElements && collectionFromStorage.length >= maxElements) {
      return;
    }
    collectionFromStorage.push(element); //Agregamos el elemento al arreglo de lStore

    localStorage.setItem(storageKeyName, JSON.stringify(collectionFromStorage));
  }

  static getCollection(storageKeyName) {
    return localStorage.getItem(storageKeyName)
      ? JSON.parse(localStorage.getItem(storageKeyName))
      : [];
  }
}

class DomManipulator {
  static onWindowLoad() {
    this.formStudentAddEvents();
  }

  static formStudentAddEvents() {
    var formStudent = document.getElementById("form-student");
    formStudent.onclick = (e) => {
      e.preventDefault();

      var student = new Student(
        0,
        "N",
        "B",
        1,
        "a@a",
        2020,
        "c1a2",
        "12345678",
        true
      );
      console.log(JSON.stringify(student));
    };
  }

  static testStudent1() {
    var student = new Student(
      Math.floor(Math.random() * 1000),
      "N",
      "B",
      1,
      "a@a",
      2020,
      "c1a2",
      "12345678",
      true
    );

    LocalStorageInterface.storeElementInCollection(student, "students", 10);
  }

  static testStudent2() {
    console.log(Student.getStudentFromId(340));
  }

  static listStudentsFromStorage() {
    var listStudents = document.getElementById("list-students");

    listStudents.innerHTML = "";

    var collectionOfStudents = LocalStorageInterface.getCollection("students");

    collectionOfStudents.forEach((student) => {
      var newListElement = document.createElement("li");

      newListElement.innerText = JSON.stringify(student);
      listStudents.appendChild(newListElement);
    });
  }
}

window.onload = DomManipulator.onWindowLoad();
