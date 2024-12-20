import { randomBytes } from 'crypto';

const secretToken = randomBytes(32).toString('hex');

export default {
  JWT_SECRET: process.env.JWT_SECRET || secretToken,
};

// EMAIL: "arohatechnologies0@gmail.com",
// PASSWORD: "vcyoqyedkredetzn",