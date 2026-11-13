const MESSAGE_TYPE = require("./messages-type.js");

const queryLatest = () => {
  return {
    type: MESSAGE_TYPE.QUERY_LATEST
  };
};

const queryAll = () => {
  return {
    type: MESSAGE_TYPE.QUERY_ALL
  };
};

const blockResponse = (blockchain) => {
  return {
    type: MESSAGE_TYPE.BLOCK_RESPONSE,
    payload: blockchain
  };
};

module.exports = {
  queryLatest,
  queryAll,
  blockResponse
};
