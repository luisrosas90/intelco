import bcrypt from 'bcryptjs';

const password = 'Lam1414*$'; // Cambia esta por la contraseña real
const saltRounds = 10;
bcrypt.hash(password, saltRounds).then((hash) => {
  console.log('Password Hash:', hash);
});
