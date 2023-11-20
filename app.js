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
              date: student.date,
              country: student.country,
              code: student.code,
              codeQuadrimeter: student.codeQuadrimeter,
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
  MSG_USER_FULL = "No se pueden agregar más de 10 alumnos.";
  MSG_USER_CODE_EXIST = "Código de alumnos ya existe.";
  MSG_USER_DNI_EXIST = "Alumnos con mismo DNI ya existe.";
  MSG_USER_CREATED_SUCCESS = "Alumnos creado exitosamente.";
  MSG_USER_UPDATED_SUCCESS = "Alumnos actualizado exitosamente.";
  MSG_USER_DELETED_SUCCESS = "Alumnos eliminado exitosamente.";

  constructor() {
    super("students");
  }

  addStudent(data) {
    // TODO: VALIDAR SI CODIGO IDENTICO
    // TODO: VALIDAR DNI IDENTICO
    // TODO: VALIDAR CANTIDAD = 10
    // TODO: Validad si el código de usuario existe
    if (this.list.length >= 10) {
      throw new Error(this.MSG_USER_FULL);
    }

    this.list.forEach((student) => {
      if (student.code == data.code) {
        throw new Error(this.MSG_USER_CODE_EXIST);
      }
      if (student.dni == data.dni) {
        throw new Error(this.MSG_USER_DNI_EXIST);
      }
    });

    this.addElementInList(data);
    this.saveListInStorage();
    alert(this.MSG_USER_CREATED_SUCCESS);
  }

  updateStudent(id, newData) {
    this.list.forEach((student) => {
      if (student.id != newData.id) {
        if (student.code == newData.code) {
          throw new Error(this.MSG_USER_CODE_EXIST);
        }
        if (student.dni == newData.dni) {
          throw new Error(this.MSG_USER_DNI_EXIST);
        }
      }
    });

    this.updateElementInList(id, newData);
    this.saveListInStorage();
    alert(this.MSG_USER_UPDATED_SUCCESS);
  }

  deleteStudent(id) {
    this.deleteElementInList(id);
    this.saveListInStorage();
    alert(this.MSG_USER_DELETED_SUCCESS);
  }
}

export class Subjects extends StorageList {
  MSG_USER_ALREADY_ENROLL = "Usuario ya inscripto en la Materia";
  MSG_USER_ENROLL_IN_SUBJECT = "Inscripción exitosamente en la Materia";
  MSG_USER_UNENROLL_IN_SUBJECT = "Desinscripción exitosamente en la Materia";
  MSG_USER_CANNOT_ENROLL_IN_SUBJECT =
    "Usted no esta habilitado para inscribirse.";
  MSG_USER_COUNTRY_NOT_EQUAL_TO_SUBJECT =
    "El huso horario de donde se dicta la materia no es igual al suyo, contactanos para saber como hacer en estos casos.";
  MSG_USER_CANNOT_ENROLL_IN_SUBJECT_BECAUSE_LIMIT =
    "Usted no puede inscribirse ya que llego a su limite.";
  CODE_QUADRIMETER_NOT_ENABLED = "1C23";

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

  amountStudentEnrollSubjects(userId) {
    let amount = 0;

    this.list.forEach((subject) => {
      subject.enrolledStudents.forEach((student) => {
        if (student.userId == userId) {
          amount++;
        }
      });
    });
    return amount;
  }

  enrollStudentInSubject(id, userData) {
    //TODO comprobar que este  habilitado para insctips
    //student.codeQuadrimeter != ""
    if (calculateAge(userData.date) > 35) {
      if (this.amountStudentEnrollSubjects(userData.userId) >= 6) {
        throw new Error(this.MSG_USER_CANNOT_ENROLL_IN_SUBJECT_BECAUSE_LIMIT);
      }
    } else {
      if (this.amountStudentEnrollSubjects(userData.userId) >= 4) {
        throw new Error(this.MSG_USER_CANNOT_ENROLL_IN_SUBJECT_BECAUSE_LIMIT);
      }
    }

    if (userData.codeQuadrimeter == this.CODE_QUADRIMETER_NOT_ENABLED) {
      throw new Error(this.MSG_USER_CANNOT_ENROLL_IN_SUBJECT);
    }

    this.list.map((subject) => {
      if (parseInt(subject.id) == parseInt(id)) {
        if (this.isStudentEnrollInSubject(subject.id, userData.userId)) {
          alert(this.MSG_USER_ALREADY_ENROLL);
          return subject;
        }

        if (userData.country != subject.country) {
          alert(
            this.MSG_USER_COUNTRY_NOT_EQUAL_TO_SUBJECT +
              "\nTu huso horario: " +
              userData.country +
              ", el huso de la materia: " +
              subject.country
          );
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

        const students = new Students();

        // Si el id es -1 significa que no se esta editando un objeto
        try {
          if (formStudent.id.value == "-1") {
            data.id = Math.floor(Math.random() * 100000 + 1);
            students.addStudent(data);
          } else {
            students.updateStudent(data.id, data);
          }
          this.listStudentsFromStorage();
          formStudent.reset();
        } catch (error) {
          alert(error.message);
        }
      };
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
          "date",
          "country",
          "dni",
          "canEnrol",
          "email",
          "code",
          "codeQuadrimeter",
          "password",
        ];

        columns.forEach((column) => {
          var newTableData = document.createElement("td");

          newTableData.innerText = student[column];

          if (column == "canEnrol") {
            newTableData.innerText =
              student.codeQuadrimeter != "1C23" ? "SI" : "NO";
          }

          if (column == "date") {
            newTableData.innerText =
              new Date(student.date).toLocaleDateString() +
              " (" +
              calculateAge(student.date) +
              " años)";
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
    //Limpiar materias
    document
      .querySelectorAll(
        "div#container-subjects>details:not(#to-clone-subject-present)"
      )
      .forEach((e) => e.remove());

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
            .querySelector("div.studentInformation>table>tbody")
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

      var subjectRowForClone = document.getElementById(
        "to-clone-row-subject-enrol"
      );

      subjects.list.forEach((subject) => {
        var cloneOfSubjectRow = subjectRowForClone.cloneNode(true);
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
              try {
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
              } catch (error) {
                e.preventDefault();
                alert(error.message);
              }
            })
        );

        //Agregamos el elemento a el contanedor
        tableBodySubjectToEnrol.appendChild(cloneOfSubjectRow);
      });
    }
  }
}

//Funciones
function calculateAge(birthDate) {
  // Parse the birthdate string to a Date object
  var birthDate = new Date(birthDate);

  // Get the current date
  var currentDate = new Date();

  // Calculate the difference in milliseconds
  var timeDifference = currentDate - birthDate;

  // Calculate the age in years
  var age = Math.floor(timeDifference / (365.25 * 24 * 60 * 60 * 1000));

  return age;
}
