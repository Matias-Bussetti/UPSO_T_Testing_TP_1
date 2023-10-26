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
    this.listStudentsFromStorage();
  }

  static formStudentAddEvents() {
    var formStudent = document.getElementById("form-student");
    formStudent.onsubmit = (e) => {
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

    let counterIdLiElement = 0;

    collectionOfStudents.forEach((student) => {
      var newListElement = document.createElement("li");

      newListElement.id = "li-student-" + counterIdLiElement++;

      var studentToArrayOfKeyAttributes = Object.entries(student);

      studentToArrayOfKeyAttributes.forEach((attribute) => {
        newListElement.dataset[attribute[0]] = attribute[1];

        var newAttributeElement = document.createElement("span");

        newAttributeElement.innerText =
          " | " + attribute[0] + ": " + attribute[1];
        newListElement.appendChild(newAttributeElement);
      });

      listStudents.appendChild(newListElement);

      var buttonEditStudent = document.createElement("button");

      //Buscamos el form

      buttonEditStudent.onclick = () => {
        this.fillFormStudent(student);
      };
      buttonEditStudent.innerText = "edit";
      listStudents.appendChild(buttonEditStudent);
    });
  }

  static fillFormStudent(student) {
    var formStudent = document.getElementById("form-student");
    Object.entries(student).forEach((attribute) => {
      if (formStudent[attribute[0]]) {
        if (formStudent[attribute[0]].type == "checkbox") {
          formStudent[attribute[0]].checked = attribute[1];
        } else {
          console.log(formStudent[attribute[0]], attribute[1]);
          formStudent[attribute[0]].value = attribute[1];
        }
      }
    });
  }
}

window.onload = DomManipulator.onWindowLoad();
