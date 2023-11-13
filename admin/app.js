import { LocalStorageInterface, Student, Auth } from "../app.js";

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
    formStudent.onsubmit = (e) => {
      e.preventDefault();

      // console.log(
      //   formStudent.id.value,
      //   formStudent.name.value,
      //   formStudent.surName.value,
      //   formStudent.canEnrol.checked,
      //   formStudent.email.value,
      //   formStudent.yearBorn.value,
      //   formStudent.code.value,
      //   formStudent.password.value
      // );

      if (formStudent.id.value == "-1") {
        console.log(formStudent.id.value == "-1");

        const newStudent = new Student(
          Math.floor(Math.random() * 10000 + 1),
          formStudent.name.value,
          formStudent.surName.value,
          formStudent.canEnrol.checked,
          formStudent.email.value,
          formStudent.yearBorn.value,
          formStudent.code.value,
          formStudent.password.value
        );

        LocalStorageInterface.storeElementInCollection(newStudent, "students");
        this.listStudentsFromStorage();
        formStudent.reset();

        return;
      }

      const updateStudent = Student.getStudentFromId(formStudent.id.value);
      console.log(updateStudent);

      if (updateStudent) {
        updateStudent.updateAttributesFromObject({
          id: formStudent.id.value,
          name: formStudent.name.value,
          surName: formStudent.surName.value,
          canEnrol: formStudent.canEnrol.checked,
          email: formStudent.email.value,
          yearBorn: formStudent.yearBorn.value,
          code: formStudent.code.value,
          password: formStudent.password.value,
        });
      }

      console.log(updateStudent);

      formStudent.reset();

      this.listStudentsFromStorage();

      //LocalStorageInterface.storeElementInCollection(student, "students", 10);
    };
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

      //Buscamos el form

      var buttonEditStudent = document.createElement("button");
      buttonEditStudent.onclick = () => {
        this.fillFormStudent(student);
      };
      buttonEditStudent.innerText = "edit";
      listStudents.appendChild(buttonEditStudent);

      var buttonDeleteStudent = document.createElement("button");
      buttonDeleteStudent.onclick = () => {
        this.deleteStudent(student);
      };
      buttonDeleteStudent.innerText = "delete";
      listStudents.appendChild(buttonDeleteStudent);
    });
  }

  static deleteStudent(student) {
    Student.studentFromObject(student).delete();
    this.listStudentsFromStorage();
  }

  static fillFormStudent(student) {
    var formStudent = document.getElementById("form-student");
    Object.entries(student).forEach((attribute) => {
      if (formStudent[attribute[0]]) {
        if (formStudent[attribute[0]].type == "checkbox") {
          formStudent[attribute[0]].checked = attribute[1];
        } else {
          // console.log(formStudent[attribute[0]], attribute[1]);
          formStudent[attribute[0]].value = attribute[1];
        }
      }
    });
  }
}

window.onload = DomManipulator.onWindowLoad();
