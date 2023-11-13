export class Student {
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

  updateAttributesFromObject({
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
    this.name = name;
    this.surName = surName;
    this.role = role;
    this.email = email;
    this.yearBorn = yearBorn;
    this.code = code;
    this.password = password;
    this.canEnrol = canEnrol;

    const collectionOfStudents =
      LocalStorageInterface.getCollection("students");

    LocalStorageInterface.storeCollection(
      collectionOfStudents.map((student) => {
        if (student.id == id) {
          return this;
        }
        return student;
      }),
      "students"
    );
  }

  delete() {
    const collectionOfStudents =
      LocalStorageInterface.getCollection("students");

    LocalStorageInterface.storeCollection(
      collectionOfStudents.filter((student) => student.id != this.id),
      "students"
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

export class LocalStorageInterface {
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

  static storeCollection(collection, storageKeyName) {
    localStorage.removeItem(storageKeyName);
    localStorage.setItem(storageKeyName, JSON.stringify(collection));
  }

  static getCollection(storageKeyName) {
    return localStorage.getItem(storageKeyName)
      ? JSON.parse(localStorage.getItem(storageKeyName))
      : [];
  }

  static deleteCollection(storageKeyName) {
    localStorage.removeItem(storageKeyName);
  }
}

export class Auth {
  static checkLogin() {
    const auth = LocalStorageInterface.getCollection("auth");
    // console.log("auth", auth, auth.length);
    if (auth.length == 0) {
      window.location.href = "/login";
    }
  }

  static logout() {
    LocalStorageInterface.deleteCollection("auth");
    window.location.href = "/login";
  }

  static login(username, password) {
    const students = LocalStorageInterface.getCollection("students");

    console.log(students);

    if (username == "admin" && password == "c0ntr4s3ñ4") {
      LocalStorageInterface.storeCollection(
        JSON.stringify({ userId: -1, type: "admin" }),
        "auth"
      );
      window.location.href = "/admin";
      return true;
    } else {
      students.forEach((student) => {
        if (student.code == username && student.password == password) {
          window.location.href = "/student";
          return true;
        }
      });
    }

    return false;
  }
}
