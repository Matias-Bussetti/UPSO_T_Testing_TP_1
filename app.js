"use strict";

export class Auth {
  static getAuthUserInfo() {
    return JSON.parse(LocalStorageInterface.getCollection("auth"));
  }

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
          console.log(students);
          LocalStorageInterface.storeCollection(
            "auth",
            JSON.stringify({
              userId: student.id,
              surName: student.surName,
              name: student.name,
              email: student.email,
              code: student.code,
              type: "student",
            })
          );
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
}

export class Subjects extends StorageList {
  MSG_USER_ALREADY_ENROLL = "Usuario ya inscripto en la Materia";
  MSG_USER_ENROLL_IN_SUBJECT = "Inscripción exitosamente en la Materia";
  MSG_USER_UNENROLL_IN_SUBJECT = "Desinscripción exitosamente en la Materia";

  constructor() {
    super("subjects");
  }

  addSubject(data) {
    this.addElementInList(data);
    // TODO: Validad si el código de usuario existe
    this.saveListInStorage();
  }

  updateSubject(id, newData) {
    this.updateElementInList(id, newData);
    this.saveListInStorage();
  }

  deleteSubject(id) {
    this.deleteElementInList(id);
    this.saveListInStorage();
  }

  updateSubjectAttribute(id, attribute, value) {
    this.list.map((subject) => {
      if (parseInt(subject.id) == parseInt(id)) {
        subject[attribute] = value;
      }
      return subject;
    });
    this.saveListInStorage();
  }

  isStudentEnrollInSubject(subjectId, userId) {
    return (
      this.list
        .filter((subject) => subject.id == subjectId)[0]
        ["enrolledStudents"].filter((student) => student.userId == userId)
        .length > 0
    );
  }

  enrollStudentInSubject(id, userData) {
    this.list.map((subject) => {
      if (parseInt(subject.id) == parseInt(id)) {
        if (this.isStudentEnrollInSubject(subject.id, userData.userId)) {
          alert(this.MSG_USER_ALREADY_ENROLL);
          return subject;
        }

        alert(this.MSG_USER_ENROLL_IN_SUBJECT);
        subject["enrolledStudents"].push(userData);
        return subject;
      }
      return subject;
    });
    this.saveListInStorage();
  }

  unEnrollStudentInSubject(id, userData) {
    this.list.map((subject) => {
      if (parseInt(subject.id) == parseInt(id)) {
        if (this.isStudentEnrollInSubject(subject.id, userData.userId)) {
          alert(this.MSG_USER_UNENROLL_IN_SUBJECT);

          subject["enrolledStudents"] = subject["enrolledStudents"].filter(
            (student) => student.userId != userData.userId
          );
          return subject;
        }
      }
      return subject;
    });
    this.saveListInStorage();
  }
}

export class DomManipulator {
  static onWindowLoad() {
    // Students
    this.formStudentAddEvents();
    this.listStudentsFromStorage();

    //Botón Cerrar Sessión
    var btnLogout = document.querySelector(".btn-selector-logout");
    if (btnLogout) {
      btnLogout.onclick = () => Auth.logout();
    }

    // Subjects
    this.formSubjectAddEvents();
    this.listSubjectByCloningSubjectDetailElement();

    //Student Side Dashboard
    this.showPersonalInformation();
    this.listSubjectsInTableOnStudentDashBoard();
  }

  //Students
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
          data.id = Math.floor(Math.random() * 100000 + 1);
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

  //Students
  static listStudentsFromStorage() {
    this.formStudentAddEvents();
    var tableStudents = document.getElementById("table-students");

    if (tableStudents) {
      tableStudents.innerHTML = "";

      const students = new Students();

      let counterIdLiElement = 0;

      students.list.forEach((student) => {
        var newRow = document.createElement("tr");

        newRow.id = "td-student-" + counterIdLiElement++;

        const columns = [
          "id",
          "name",
          "surName",
          "yearBorn",
          "country",
          "dni",
          "canEnrol",
          "email",
          "code",
          "password",
        ];

        columns.forEach((column) => {
          var newTableData = document.createElement("td");

          newTableData.innerText = student[column];

          if (column == "canEnrol") {
            newTableData.innerText = student[column] ? "SI" : "NO";
          }

          newRow.appendChild(newTableData);
        });

        /*
        var studentToArrayOfKeyAttributes = Object.entries(student);
        studentToArrayOfKeyAttributes.forEach((attribute) => {
          newRow.dataset[attribute[0]] = attribute[1];

        });
        */

        //Buscamos el form

        var buttonEditStudent = document.createElement("button");
        buttonEditStudent.onclick = () => {
          this.fillFormWithObjectAttributes("form-student", student);
        };

        buttonEditStudent.innerText = "Editar";

        var buttonDeleteStudent = document.createElement("button");

        buttonDeleteStudent.onclick = () => {
          // TODO Hacer!!

          students.deleteStudent(student.id);

          this.listStudentsFromStorage();
        };

        buttonDeleteStudent.innerText = "Borrar";

        var newTableDataButtons = document.createElement("td");

        newTableDataButtons.appendChild(buttonEditStudent);
        newTableDataButtons.appendChild(buttonDeleteStudent);

        newRow.appendChild(newTableDataButtons);

        tableStudents.appendChild(newRow);
      });
    }
  }

  //Función
  static fillFormWithObjectAttributes(formElementId, DataFill) {
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

  //Subjects
  static formSubjectAddEvents() {
    var formSubject = document.getElementById("form-subject");

    if (formSubject) {
      formSubject.onsubmit = (e) => {
        e.preventDefault();

        let data = {};
        formSubject.querySelectorAll("input, select").forEach((input) => {
          data[input.name] =
            input.type == "checkbox" ? input.checked : input.value;
        });
        data.enrolledStudents = [];

        const subjects = new Subjects();

        // Si el id es -1 significa que no se esta editando un objeto
        if (formSubject.id.value == "-1") {
          data.id = Math.floor(Math.random() * 100000 + 1);
          subjects.addSubject(data);
        } else {
          subjects.updateSubject(data.id, data);
        }

        //this.listStudentsFromStorage();
        formSubject.reset();
        this.listSubjectByCloningSubjectDetailElement();
      };
    }
  }

  //Subjects
  static listSubjectByCloningSubjectDetailElement() {
    var subjectDetailElement = document.getElementById(
      "to-clone-subject-present"
    );

    if (subjectDetailElement) {
      const subjects = new Subjects();

      subjects.list.forEach((subject) => {
        var cloneOfSubjectDetailElement = subjectDetailElement.cloneNode(true);

        cloneOfSubjectDetailElement.removeAttribute("id");
        cloneOfSubjectDetailElement.removeAttribute("style");

        //onChangeMethod
        function updateFieldInSubject(e) {
          subjects.updateSubjectAttribute(
            subject.id,
            e.target.name,
            e.target.value
          );
        }

        //Nombre de materia
        cloneOfSubjectDetailElement.querySelector("summary").innerText =
          subject.name;

        //Nombre Profesor
        var inputTeacherName = cloneOfSubjectDetailElement.querySelector(
          'input[name="teacherName"]'
        );
        inputTeacherName.value = subject.teacherName;
        inputTeacherName.oninput = (e) => updateFieldInSubject(e);

        //Día
        var inputDay =
          cloneOfSubjectDetailElement.querySelector('input[name="day"]');
        inputDay.value = subject.day;
        inputDay.oninput = (e) => updateFieldInSubject(e);

        //Hora inicio
        var inputHourStart = cloneOfSubjectDetailElement.querySelector(
          'input[name="hourStart"]'
        );
        inputHourStart.value = subject.hourStart;
        inputHourStart.oninput = (e) => updateFieldInSubject(e);

        //Hora Final
        var inputHourEnd = cloneOfSubjectDetailElement.querySelector(
          'input[name="hourEnd"]'
        );
        inputHourEnd.value = subject.hourEnd;
        inputHourEnd.oninput = (e) => updateFieldInSubject(e);

        //Pais
        var selectCountry = cloneOfSubjectDetailElement.querySelector(
          'select[name="country"]'
        );
        selectCountry.value = subject.country;
        selectCountry.oninput = (e) => updateFieldInSubject(e);

        //Habilitacion Docente
        var selectTeacherHabilitation =
          cloneOfSubjectDetailElement.querySelector(
            'select[name="teacherHabilitation"]'
          );
        selectTeacherHabilitation.value = subject.teacherHabilitation;
        selectTeacherHabilitation.oninput = (e) => updateFieldInSubject(e);

        //Cantidad de Inscriptos

        cloneOfSubjectDetailElement.querySelector(
          "div.numberRegister"
        ).innerText = subject.enrolledStudents.length;

        subject.enrolledStudents.forEach((student) => {
          var row = document.createElement("tr");
          var tdNull = document.createElement("td");
          var tdName = document.createElement("td");
          tdName.innerText = student.name + " " + student.surName;
          var tdEmail = document.createElement("td");
          tdEmail.innerText = student.email;

          row.appendChild(tdNull);
          row.appendChild(tdName);
          row.appendChild(tdEmail);

          cloneOfSubjectDetailElement
            .querySelector("table>tbody")
            .appendChild(row);
        });

        //Agregamos el elemento a el contanedor
        document
          .getElementById("container-subjects")
          .appendChild(cloneOfSubjectDetailElement);
      });
    }
  }

  //Student Side DashBoard
  static showPersonalInformation() {
    var userInfomationName = document.getElementById("user-information-name");
    var userInfomationSurName = document.getElementById(
      "user-information-surName"
    );
    var userInfomationCode = document.getElementById("user-information-code");
    var userInfomationEmail = document.getElementById("user-information-email");

    if (
      userInfomationName &&
      userInfomationSurName &&
      userInfomationCode &&
      userInfomationEmail
    ) {
      userInfomationName.innerText = Auth.getAuthUserInfo().name;
      userInfomationSurName.innerText = Auth.getAuthUserInfo().surName;
      userInfomationCode.innerText = Auth.getAuthUserInfo().code;
      userInfomationEmail.innerText = Auth.getAuthUserInfo().email;
    }
  }

  //Student Side DashBoard
  static listSubjectsInTableOnStudentDashBoard() {
    var tableBodySubjectToEnrol = document.getElementById(
      "table-body-subject-enrol"
    );

    if (tableBodySubjectToEnrol) {
      const subjects = new Subjects();

      subjects.list.forEach((subject) => {
        var cloneOfSubjectRow = document.getElementById(
          "to-clone-row-subject-enrol"
        );
        cloneOfSubjectRow.removeAttribute("id");
        cloneOfSubjectRow.removeAttribute("style");

        //Nombre de materia
        cloneOfSubjectRow.querySelector("td.subject-info-id").innerText =
          subject.id;

        cloneOfSubjectRow.querySelector("td.subject-info-name").innerText =
          subject.name;

        cloneOfSubjectRow.querySelector(
          "td.subject-info-teacherName"
        ).innerText = subject.teacherName;

        cloneOfSubjectRow.querySelector("td.subject-info-day").innerText =
          subject.day;

        cloneOfSubjectRow.querySelector(
          "td.subject-info-schedule"
        ).innerText = `${subject.hourStart}hrs a ${subject.hourEnd}hrs ${subject.country}`;

        const formEnroll = cloneOfSubjectRow.querySelector("form");
        const inputsEnroll = cloneOfSubjectRow.querySelectorAll(
          'input[type="radio"]'
        );

        formEnroll.enroll.value = subjects.isStudentEnrollInSubject(
          subject.id,
          Auth.getAuthUserInfo().userId
        );

        inputsEnroll.forEach(
          (input) =>
            (input.onclick = (e) => {
              const userWantToEnrol = JSON.parse(formEnroll.enroll.value);
              if (userWantToEnrol) {
                subjects.enrollStudentInSubject(
                  subject.id,
                  Auth.getAuthUserInfo()
                );
              } else {
                subjects.unEnrollStudentInSubject(
                  subject.id,
                  Auth.getAuthUserInfo()
                );
              }
            })
        );

        //Agregamos el elemento a el contanedor
        tableBodySubjectToEnrol.appendChild(cloneOfSubjectRow);
      });
    }
  }
}
