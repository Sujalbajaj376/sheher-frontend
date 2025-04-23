// /api/verify-city.js (Next.js example)
import { verifyAadharCity } from "../../utils/verifyAadharCity";

export default function handler(req, res) {
  const { aadhar, city } = req.body;
  const isValid = verifyAadharCity(aadhar, city);
  res.status(200).json({ valid: isValid });
}
