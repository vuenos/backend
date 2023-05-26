const userModel = require("../Model/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const slant = require("figlet/importable-fonts/Slant");

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
