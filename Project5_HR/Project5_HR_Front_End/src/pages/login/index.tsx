import DeleteIcon from '@mui/icons-material/Delete';
import AlarmIcon from '@mui/icons-material/Alarm';
import { IconButton } from '@mui/material';

const LoginPage = () => (
  <div className='p-5'>
    <div className='h-screen flex flex-col justify-center items-center'>
        <div className='w-fit'>
            <div className='mb-[50px]'>
                <h1>HR Management System</h1>
                <h3>Please login to continue</h3>
            </div>

            <div className='flex flex-col space-y-[10px] mb-[20px]'>
                <input id='staffId' className='w-[400px] h-[37px]' placeholder='Your Staff ID'/>
                <input id='password' className='w-[400px] h-[37px]' placeholder='Your Password'/>
            </div>

            <div className='w-full flex flex-col space-y-[5px]'>
                <button className='bg-accent_blue w-full'><h3 className='text-light_gray'>Log In</h3></button>
                <div className='flex justify-end underline'><div className='caption'>Forgot password</div></div>
            </div>
        </div>
    </div>
  </div>
);

export default LoginPage;
