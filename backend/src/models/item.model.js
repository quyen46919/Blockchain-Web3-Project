const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
// const { toJSON, paginate } = require('./plugins');

const itemSchema = mongoose.Schema(
  {
    createUserId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
    itemAddress: {
      type: String,
      required: true,
    },
    identify: {
      type: String,
      required: true,
    },
    state: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    history: {
      type: Array,
      default: [],
    },
    itemIndex: {
      type: Number,
      required: true,
    },
    _destroy: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);
itemSchema.plugin(toJSON);
itemSchema.plugin(paginate);

itemSchema.statics.isItemAddressTaken = async function (itemAddress, excludeUserId) {
  const item = await this.findOne({ itemAddress, _id: { $ne: excludeUserId } });
  return !!item;
};

/**
 * @typedef User
 */
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
