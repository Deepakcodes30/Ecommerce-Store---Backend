const paymentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    paymentGateway: {
      type: String,
      enum: ["RAZORPAY", "COD"],
    },
    paymentId: {
      type: String,
    },
    signature: {
      type: String,
    },
    amount: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Created", "Success", "Failed", "Refunded"],
      default: "Created",
    },
  },
  { timestamps: true }
);
