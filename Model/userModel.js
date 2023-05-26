const mongoose = require("mongoose");

/**
 * MongoDB, Redis 같은 nosql 데이터베이스는 정규화를 하지 않는다. 데이터를 자유롭게 작성할 수 있다. 이는 장점이자 단점이다.
 * 그래서 mongoose 는 Schema 를 도입. 작성된 Schema 를 기준으로 mongoose 는 데이터를 DB에 저장하기전에 먼저 검사한다.
 * Schema 에 어긋나는 데이터가 있으면 에러를 발생한다.
 * @type {module:mongoose.Schema}
 */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      minlength: 3,
      maxlength: 100,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      maxlength: 1024,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
