const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { itemService } = require('../services');
const pick = require('../utils/pick');
const { encryptRequestBody, decryptHashedString } = require('../utils/hashRequestBody');

const generateHashString = catchAsync(async (req, res) => {
  const hashedString = encryptRequestBody(req.body.identify, req.body.description, req.body.images);
  res.status(httpStatus.CREATED).send(hashedString);
});

const decodeHashedString = catchAsync(async (req, res) => {
  const decryptedInfo = decryptHashedString(req.body.encryptString);
  res.status(httpStatus.CREATED).send(decryptedInfo);
});

const createItem = catchAsync(async (req, res) => {
  const item = await itemService.createItem(req.body);
  res.status(httpStatus.CREATED).send(item);
});

const getAllItem = catchAsync(async (req, res) => {
  // const filter = pick(req.query, ['name', 'role']);
  // const options = pick(req.query, ['sortBy', 'limit', 'page', 'state']);
  // const result = await itemService.queryItems(filter, options);
  const result = await itemService.queryFilterItems(req.query);
  res.send(result);
});

const getItemById = catchAsync(async (req, res) => {
  const result = await itemService.getItemById(req.params.itemId);
  res.send(result);
});

const getItemByOwnerId = catchAsync(async (req, res) => {
  const item = await itemService.getItemByOwnerId(req.params.ownerId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }
  res.send(item);
});

const updateItemState = catchAsync(async (req, res) => {
  const item = await itemService.updateItemState(req.params.itemId, req.body.state);
  res.send(item);
});

const updateItemInfo = catchAsync(async (req, res) => {
  const item = await itemService.updateItemInfo(req.params.itemId, req.body);
  res.send(item);
});

module.exports = {
  generateHashString,
  decodeHashedString,
  createItem,
  getItemById,
  getAllItem,
  getItemByOwnerId,
  updateItemState,
  updateItemInfo,
};
