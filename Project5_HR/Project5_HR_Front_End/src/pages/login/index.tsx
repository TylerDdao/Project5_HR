import { useState } from 'react';
import { verifyLogin } from './script'; // adjust path as needed
import { hashSHA256 } from '../../utils/security';

const LoginPage = () => {
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if(!password){
      alert("Please enter password!");
      return;
    }
    const hashed = await hashSHA256(password);
    verifyLogin(staffId, hashed);
  };

  return (
    <div className='p-5'>
      <div className='h-screen flex flex-col justify-center items-center'>
        <div className='w-fit'>
          <div className='mb-[50px]'>
            <h1>HR Management System</h1>
            <h3>Please login to continue</h3>
          </div>

          <div className='flex flex-col space-y-[10px] mb-[20px]'>
            <input
              id='staffId'
              className='w-[400px] h-[37px]'
              placeholder='Your Staff ID'
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
            />
            <input
              id='password'
              type='password'
              className='w-[400px] h-[37px]'
              placeholder='Your Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className='w-full flex flex-col space-y-[5px]'>
            <button
              className='bg-accent_blue w-full'
              onClick={handleLogin}
            >
              <h3 className='text-light_gray'>Log In</h3>
            </button>
            {/* <div className='flex justify-end underline'>
              <div className='caption'>Forgot password</div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
