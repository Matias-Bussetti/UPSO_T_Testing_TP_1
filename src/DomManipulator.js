import { Auth } from "./Auth.js";
import { Students } from "./Students.js";
import { Subjects } from "./Subjects.js";

export class DomManipulator {
  static onWindowLoad() {
    Auth.checkLogin();
    //Botón Cerrar Sessión
    var btnLogout = document.querySelector(".btn-selector-logout");
    if (btnLogout) {
      btnLogout.onclick = () => Auth.logout();
    }
  }

  static moduleAdminSubjects() {
    // Subjects
    this.onWindowLoad();
    this.formSubjectAddEvents();
    this.listSubjectByCloningSubjectDetailElement();
  }

  static moduleAdminStudents() {
    this.onWindowLoad();
    // Students
    this.formStudentAddEvents();
    this.listStudentsFromStorage();
  }

  static moduleStudentDashboard() {
    this.onWindowLoad();
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
    function fillFormWithObjectAttributes(formElementId, DataFill) {
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
    const calculateAge = (birthDate) =>
      Math.floor(
        new Date() - new Date(birthDate) / (365.25 * 24 * 60 * 60 * 1000)
      );

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
          fillFormWithObjectAttributes("form-student", student);
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
