const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createItem = {
  body: Joi.object().keys({
    createUserId: Joi.string().custom(objectId).required(),
    ownerId: Joi.string().required(),
    itemAddress: Joi.string().required(),
    identify: Joi.string().required().max(128),
    price: Joi.number().unsafe().required(),
    itemIndex: Joi.number().required(),
    images: Joi.array().required().max(8),
    history: Joi.array().required(),
    description: Joi.string().required().max(255),
    category: Joi.string().required(),
  }),
};

const generateHashString = {
  body: Joi.object().keys({
    identify: Joi.string().required().max(128),
    images: Joi.array().required().max(8),
    description: Joi.string().required().max(255),
  }),
};

const decryptHashedString = {
  body: Joi.object().keys({
    encryptString: Joi.string().required(),
  }),
};

const getItems = {
  query: Joi.object().keys({
    ownerId: Joi.string(),
    itemAddress: Joi.string(),
    identify: Joi.string(),
    state: Joi.number(),
    // price: Joi.number(),
    images: Joi.array(),
    description: Joi.string(),
    status: Joi.object(),
    _destroy: Joi.boolean(),
    category: Joi.string(),

    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getItem = {
  params: Joi.object().keys({
    ownerId: Joi.string(),
  }),
};

const updateItemState = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    state: Joi.number().min(0).max(2),
  }),
};

const updateItemInfo = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      identify: Joi.string(),
      images: Joi.array().max(8),
      description: Joi.string().max(255),
    })
    .min(1),
};

const deleteItem = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  generateHashString,
  decryptHashedString,
  createItem,
  getItems,
  getItem,
  updateItemState,
  updateItemInfo,
  deleteItem,
};
