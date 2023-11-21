import { StorageList } from "./StorageList.js";

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
