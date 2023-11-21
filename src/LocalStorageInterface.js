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
