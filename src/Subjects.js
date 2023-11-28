import { StorageList } from "./StorageList.js";

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
    const calculateAge = (birthDate) => {
      return Math.floor(
        (new Date() - new Date(birthDate)) / (365.25 * 24 * 60 * 60 * 1000)
      );
    };

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
