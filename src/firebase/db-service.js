/**
 * Profit Brain Delivery - Database Service
 * Serviços do Firestore usando Firebase (Compat API)
 */

const DB_COLLECTIONS = {
  ORDERS: "pedidos",
  USERS: "usuarios",
  DELIVERIES: "entregas"
};

/**
 * Adiciona um novo pedido ao Firestore
 * @param {Object} data - Dados do pedido
 * @returns {Promise<string>} ID do documento criado
 */
function addOrder(data) {
  return firebaseDB.collection(DB_COLLECTIONS.ORDERS)
    .add({
      ...data,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(function(docRef) {
      return docRef.id;
    });
}

/**
 * Atualiza o status de um pedido
 * @param {string} orderId
 * @param {string} status - "pendente" | "preparando" | "pronto" | "entregue" | "cancelado"
 * @param {Object} [extraData] - Dados extras opcionais
 * @returns {Promise<void>}
 */
function updateOrderStatus(orderId, status, extraData) {
  var update = {
    status: status,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  if (extraData) {
    Object.assign(update, extraData);
  }
  return firebaseDB.collection(DB_COLLECTIONS.ORDERS).doc(orderId).update(update);
}

/**
 * Escuta pedidos em tempo real por status
 * @param {string} status
 * @param {function} callback - Recebe array de pedidos
 * @returns {function} Função de unsubscribe
 */
function listenOrdersByStatus(status, callback) {
  return firebaseDB.collection(DB_COLLECTIONS.ORDERS)
    .where("status", "==", status)
    .orderBy("createdAt", "desc")
    .onSnapshot(function(snapshot) {
      var orders = [];
      snapshot.forEach(function(doc) {
        orders.push({ id: doc.id, ...doc.data() });
      });
      callback(orders);
    }, function(error) {
      console.error("[DB] Erro ao escutar pedidos:", error);
      callback([]);
    });
}

/**
 * Escuta todos os pedidos em tempo real
 * @param {function} callback - Recebe array de pedidos
 * @returns {function} Função de unsubscribe
 */
function listenOrders(callback) {
  return firebaseDB.collection(DB_COLLECTIONS.ORDERS)
    .orderBy("createdAt", "desc")
    .onSnapshot(function(snapshot) {
      var orders = [];
      snapshot.forEach(function(doc) {
        orders.push({ id: doc.id, ...doc.data() });
      });
      callback(orders);
    }, function(error) {
      console.error("[DB] Erro ao escutar pedidos:", error);
      callback([]);
    });
}

/**
 * Busca um pedido pelo ID
 * @param {string} orderId
 * @returns {Promise<Object|null>}
 */
function getOrderById(orderId) {
  return firebaseDB.collection(DB_COLLECTIONS.ORDERS).doc(orderId).get()
    .then(function(doc) {
      return doc.exists ? { id: doc.id, ...doc.data() } : null;
    });
}

/**
 * Adiciona dados do usuário ao Firestore
 * @param {string} uid
 * @param {Object} data
 * @returns {Promise<void>}
 */
function setUserData(uid, data) {
  return firebaseDB.collection(DB_COLLECTIONS.USERS).doc(uid).set(data, { merge: true });
}

/**
 * Busca dados do usuário pelo UID
 * @param {string} uid
 * @returns {Promise<Object|null>}
 */
function getUserData(uid) {
  return firebaseDB.collection(DB_COLLECTIONS.USERS).doc(uid).get()
    .then(function(doc) {
      return doc.exists ? doc.data() : null;
    });
}

/**
 * Adiciona um registro de entrega
 * @param {Object} data
 * @returns {Promise<string>} ID do documento criado
 */
function addDelivery(data) {
  return firebaseDB.collection(DB_COLLECTIONS.DELIVERIES)
    .add({
      ...data,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(function(docRef) {
      return docRef.id;
    });
}

/**
 * Escuta entregas de um entregador específico
 * @param {string} deliveryPersonId
 * @param {function} callback
 * @returns {function} Função de unsubscribe
 */
function listenDeliveriesByPerson(deliveryPersonId, callback) {
  return firebaseDB.collection(DB_COLLECTIONS.DELIVERIES)
    .where("deliveryPersonId", "==", deliveryPersonId)
    .orderBy("createdAt", "desc")
    .onSnapshot(function(snapshot) {
      var deliveries = [];
      snapshot.forEach(function(doc) {
        deliveries.push({ id: doc.id, ...doc.data() });
      });
      callback(deliveries);
    }, function(error) {
      console.error("[DB] Erro ao escutar entregas:", error);
      callback([]);
    });
}
