const userModel = require("../Model/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtkey, { expires: "3d" });
};

/**
 * REGISTER_USER
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await userModel.findOne({ email }); // userModel Schema 에서 email 객체를 찾는다.

    if (user)
      return res.status(400).json("입력한 이메일을 이미 사용 중 입니다.");

    if (!name || !email || !password)
      return res.status(400).json("모든 항목은 필수 입력해야 합니다.");

    if (!validator.isEmail(email))
      return res.status(400).json("유요한 이메일이어야 합니다.");

    if (!validator.isStrongPassword(password))
      return res
        .status(400)
        .json("비밀번호는 대문자, 소문자, 숫자, 특수기호를 혼용해야 합니다.");

    user = new userModel({ name, email, password }); // 검증이 끝나면 name, email, password 객체를 user 에 재할당 한다.

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(user.password, salt); // password = hashing + salt

    await user.save(); // DB 저장

    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

/**
 * LOGIN_USER
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email }); // schema 에서 email 객체를 찾는다.

    if (!user) return res.status(400).json("이메일을 입력 하세요"); // user(email) 객체가 없으면 400 코드를 반환

    const isValidPassword = await bcrypt.compare(password, user.password); // 요청한 password 와 user password 를 비교 검증한다.

    if (!isValidPassword)
      return res.status(400).json("이메일 또는 패스워드가 틀립니다.");
  } catch (error) {
    console.log(error);
    res.status(500).join(error);
  }
};

/**
 * FIND_USER
 * @param req
 * @param res
 * req : /users/<id>
 * @returns {Promise<void>}
 */
const findUser = async (req, res) => {
  const userId = req.param.userId;

  try {
    const user = await userModel.findById(userId);

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).join(error);
  }
};

module.exports = { registerUser, loginUser, findUser };
