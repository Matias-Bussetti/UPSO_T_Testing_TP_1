import { Students } from "./Students.js";
import { LocalStorageInterface } from "../src/LocalStorageInterface.js";

export class Auth {
  static getAuthUserInfo() {
    return JSON.parse(LocalStorageInterface.getCollection("auth"));
  }

  static checkLogin() {
    const auth = LocalStorageInterface.getCollection("auth");
    if (auth.length == 0) {
      window.location.href = "/login";
    } else {
      //TODO corroborar que no entren en otras dashboard
    }
  }

  static redirectToDashboard() {
    const auth = LocalStorageInterface.getCollection("auth");
    if (auth.length > 0) {
      const authUser = JSON.parse(auth);
      //Redireccion a cada dashboard
      if (authUser.userId == -1) {
        window.location.href = "/admin-materia";
      } else {
        window.location.href = "/student-dashboard";
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
      window.location.href = "/admin-materia";
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
          window.location.href = "/student-dashboard";
          return true;
        }
      });
    }

    return false;
  }
}
