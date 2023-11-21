import { LocalStorageInterface } from "./LocalStorageInterface.js";

export class StorageList {
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
