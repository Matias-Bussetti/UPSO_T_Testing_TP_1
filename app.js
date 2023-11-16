"use strict";

export class Auth {
  static checkLogin() {
    const auth = LocalStorageInterface.getCollection("auth");
    if (auth.length == 0) {
      window.location.href = "/login";
    }
  }

  static redirectToDashboard() {
    const auth = LocalStorageInterface.getCollection("auth");
    if (auth.length > 0) {
      const authUser = JSON.parse(auth);
      //Redireccion a cada dashboard
      if (authUser.userId == -1) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/students";
      }
    }
  }

  static logout() {
    LocalStorageInterface.deleteCollection("auth");
    window.location.href = "/login";
  }

  static login(username, password) {
    const students = new Students();

    console.log(students);

    if (username == "admin" && password == "c0ntr4s3ñ4") {
      LocalStorageInterface.storeCollection(
        "auth",
        JSON.stringify({ userId: -1, type: "admin" })
      );
      window.location.href = "/admin";
      return true;
    } else {
      students.list.forEach((student) => {
        if (student.code == username && student.password == password) {
          window.location.href = "/student";
          return true;
        }
      });
    }

    return false;
  }
}

export class LocalStorageInterface {
  /**
   *
   * @param {object} element
   * @param {string} storageKeyName
   * @param {int} maxElements
   * @returns
   */
  static storeElementInCollection(storageKeyName, element, maxElements = 0) {
    var collectionFromStorage = localStorage.getItem(storageKeyName)
      ? JSON.parse(localStorage.getItem(storageKeyName))
      : []; //

    if (maxElements && collectionFromStorage.length >= maxElements) {
      return;
    }
    collectionFromStorage.push(element); //Agregamos el elemento al arreglo de lStore

    localStorage.setItem(storageKeyName, JSON.stringify(collectionFromStorage));
  }

  /**
   *
   * @param {Array.<object>} collection
   * @param {string} storageKeyName
   */
  static storeCollection(storageKeyName, collection) {
    localStorage.removeItem(storageKeyName);
    localStorage.setItem(storageKeyName, JSON.stringify(collection));
  }

  /**
   *
   * @param {string} storageKeyName
   * @returns {Array.<object>}List of Elements as Objects
   */
  static getCollection(storageKeyName) {
    return localStorage.getItem(storageKeyName)
      ? JSON.parse(localStorage.getItem(storageKeyName))
      : [];
  }

  /**
   *
   * @param {string} storageKeyName
   */
  static deleteCollection(storageKeyName) {
    localStorage.removeItem(storageKeyName);
  }
}

class StorageList {
  list = [];
  storageKeyName = "";

  /**
   *
   * @param {string} storageKeyName
   */
  constructor(storageKeyName) {
    this.storageKeyName = storageKeyName;
    this.list = LocalStorageInterface.getCollection(storageKeyName);
  }

  /**
   *
   * @param {{}} element
   */
  addElementInList(element) {
    this.list.push(element);
  }

  /**
   *
   * @param {string | number} elementId
   * @param {{}} updatedElement
   */
  updateElementInList(elementId, updatedElement) {
    if (this.list.length > 0) {
      this.list = this.list.map((element) =>
        parseInt(element.id) == parseInt(elementId) ? updatedElement : element
      );
    }
  }

  /**
   *
   * @param {string | number} elementId
   */
  deleteElementInList(elementId) {
    if (this.list.length > 0) {
      this.list = this.list.filter(
        (element) => parseInt(element.id) != parseInt(elementId)
      );
    }
  }

  /**
   *
   */
  saveListInStorage() {
    LocalStorageInterface.storeCollection(this.storageKeyName, this.list);
  }
}

export class Students extends StorageList {
  /*
  id,
  name,
  surName,
  role,
  email,
  yearBorn,
  code,
  password,
  canEnrol
   */
  constructor() {
    super("students");
  }

  addStudent(data) {
    this.addElementInList(data);
    // TODO: Validad si el código de usuario existe
    this.saveListInStorage();
  }

  updateStudent(id, newData) {
    this.updateElementInList(id, newData);
    this.saveListInStorage();
  }

  deleteStudent(id) {
    this.deleteElementInList(id);
    this.saveListInStorage();
  }

  static getStudentFromId(id) {
    /*
    const collectionOfStudents =
      LocalStorageInterface.getCollection("students");

    let returnStudent = null;

    collectionOfStudents.forEach((student) => {
      if (student.id == id) {
        returnStudent = this.studentFromObject(student);
      }
    });

    return returnStudent;
    */
  }
}

export class DomManipulator {
  static onWindowLoad() {
    this.formStudentAddEvents();
    this.listStudentsFromStorage();

    var btnLogout = document.querySelector(".btn-selector-logout");

    if (btnLogout) {
      btnLogout.onclick = () => Auth.logout();
    }
  }

  static formStudentAddEvents() {
    var formStudent = document.getElementById("form-student");
    if (formStudent) {
      formStudent.onsubmit = (e) => {
        e.preventDefault();

        let data = {};
        formStudent.querySelectorAll("input, select").forEach((input) => {
          data[input.name] =
            input.type == "checkbox" ? input.checked : input.value;
        });

        console.log(data);

        const students = new Students();

        // Si el id es -1 significa que no se esta editando un objeto
        if (formStudent.id.value == "-1") {
          data.id = Math.floor(Math.random() * 10000 + 1);
          students.addStudent(data);
        } else {
          students.updateStudent(data.id, data);
        }

        this.listStudentsFromStorage();
        formStudent.reset();
      };

      //Para que no ingresen el mismo code de student
      /*
      const students = new Students();
      //
      let codes = [];
      students.list.forEach((student) => {
        if (student.code) {
          codes.push(student.code + "$");
        }
      });

      //
      let codePattern = `^(?!${codes.join("|")}).+$`;

      formStudent.code.pattern = codePattern;
      console.log(formStudent.code);

      formStudent.code.oninvalid = (e) => {
        if (e.target.validity.patternMismatch) {
          e.target.setCustomValidity("Ingrese otro código.");
        }
      };*/
    }
  }

  static testStudent1() {
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomString(length) {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = getRandomInt(0, characters.length - 1);
        result += characters.charAt(randomIndex);
      }
      return result;
    }

    function getRandomEmail() {
      const username = getRandomString(5);
      const domain = getRandomString(3);
      const tld = getRandomString(2);
      return `${username}@${domain}.${tld}`;
    }

    var student = new Student(
      getRandomInt(1, 1000), // ID
      getRandomString(1), // Nombre
      getRandomString(1), // Apellido
      getRandomInt(1, 10), // Año
      getRandomEmail(), // Correo electrónico
      getRandomInt(2000, 2022), // Año de ingreso
      getRandomString(4), // Código
      getRandomInt(10000000, 99999999), // Número de teléfono
      Math.random() < 0.5 // Estudiante activo (aleatorio 50/50)
    );

    LocalStorageInterface.storeElementInCollection(student, "students", 10);
  }

  static testStudent2() {
    console.log(Student.getStudentFromId(340));
  }

  static listStudentsFromStorage() {
    this.formStudentAddEvents();
    var listStudents = document.getElementById("list-students");

    if (listStudents) {
      listStudents.innerHTML = "";

      const students = new Students();

      let counterIdLiElement = 0;

      students.list.forEach((student) => {
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

        //Buscamos el form

        var buttonEditStudent = document.createElement("button");
        buttonEditStudent.onclick = () => {
          this.fillFormWithObjectAttibutes("form-student", student);
        };

        buttonEditStudent.innerText = "edit";
        listStudents.appendChild(buttonEditStudent);

        var buttonDeleteStudent = document.createElement("button");

        buttonDeleteStudent.onclick = () => {
          // TODO Hacer!!

          students.deleteStudent(student.id);

          this.listStudentsFromStorage();
        };

        buttonDeleteStudent.innerText = "delete";
        listStudents.appendChild(buttonDeleteStudent);
      });
    }
  }

  static fillFormWithObjectAttibutes(formElementId, DataFill) {
    var form = document.getElementById(formElementId);
    if (form) {
      Object.entries(DataFill).forEach((attribute) => {
        if (form[attribute[0]]) {
          if (form[attribute[0]].type == "checkbox") {
            form[attribute[0]].checked = attribute[1];
          } else {
            // console.log(form[attribute[0]], attribute[1]);
            form[attribute[0]].value = attribute[1];
          }
        }
      });
    }
  }
}
