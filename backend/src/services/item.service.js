/* eslint-disable no-param-reassign */
const httpStatus = require('http-status');
const { Item } = require('../models');
const ApiError = require('../utils/ApiError');
const { encryptRequestBody, decryptHashedString } = require('../utils/hashRequestBody');
/**
 * Create a Item
 * @param {Object} userBody
 * @returns {Promise<Item>}
 */
const createItem = async (itemBody) => {
  if (await Item.isItemAddressTaken(itemBody.itemAddress)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Item address đã tồn tại!');
  }
  return Item.create(itemBody);
};

const queryFilterItems = async (query) => {
  const results = await Item.find({ state: { $eq: 0 }, ...query });

  return results;
};

const queryItems = async (filter, options) => {
  // const results = await Item.find({ state: { $ne: 2 } });
  const results = await Item.paginate(filter, options);
  return results;
};

const getAllItemById = async (id) => {
  return Item.findById(id);
};

// const getItemById = async (id) => {
// return Item.findById(id);
// };

const getItemByOwnerId = async (reqOwnerId) => {
  const total = await Item.aggregate([
    {
      $match: {
        ownerId: reqOwnerId,
      },
    },
    {
      $group: {
        _id: '$ownerId',
        totalAmount: { $sum: '$price' },
      },
    },
  ]);
  // console.log('total = ', total);
  const allItems = await Item.find({ ownerId: reqOwnerId });

  return {
    infos: {
      totalPrice: total,
    },
    items: allItems,
  };
};

const getItemById = async (itemId) => {
  return Item.findOne({ _id: itemId });
};

const checkStateChange = (oldState, newState) => {
  if (newState === oldState) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Nothing change to update!');
  }

  if (oldState === 2) {
    throw new ApiError(httpStatus.NOT_FOUND, 'This item was deliveried!');
  }

  if (newState < oldState) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cannot down state!');
  }

  if (newState < 0 || newState > 2) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid state');
  }

  if (newState === oldState + 2) {
    throw new ApiError(httpStatus.NOT_FOUND, `Max state you can update is ${oldState + 1}`);
  }

  return oldState + 1;
};

const updateItemState = async (itemId, state) => {
  const item = await getItemById(itemId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }

  // CHECK IS VALID STATE?
  const newState = checkStateChange(item.state, state);

  const returnValue = await Item.findOneAndUpdate(
    { _id: itemId },
    { state: newState },
    { new: true, useFindAndModify: false }
  );
  return returnValue;
};

const updateItemInfo = async (itemId, updateBody) => {
  const item = await getItemById(itemId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }

  const hashedString = encryptRequestBody(
    updateBody.identify || item.identify,
    updateBody.description || item.description,
    updateBody.images || item.images
  );
  // CHECK HISTORY LAST STRING DUPLICATE
  const lastState = JSON.stringify(decryptHashedString(item.history.slice(-1)[0]));
  const newStateToUpdate = JSON.stringify({
    identify: updateBody.identify,
    description: updateBody.description,
    images: updateBody.images,
  });

  // CHECK IF ANYTHING CHANGE IN THIS REQUEST
  if (lastState === newStateToUpdate) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Nothing change to update!');
  }

  const returnValue = await Item.findOneAndUpdate(
    { _id: itemId },
    {
      identify: updateBody.identify,
      description: updateBody.description,
      images: updateBody.images,
      $push: { history: hashedString },
    },
    { new: true, useFindAndModify: false }
  );
  return returnValue;
};

module.exports = {
  createItem,
  queryItems,
  getAllItemById,
  getItemById,
  getItemByOwnerId,
  updateItemState,
  updateItemInfo,
  queryFilterItems,
};
