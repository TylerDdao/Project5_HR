const HomePage = () => {
  return (
    <div className='p-5'>
      <div className='h-screen flex flex-col justify-center items-center'>
        <div className='w-fit'>
          <div className='mb-[50px] flex flex-col space-y-[10px]'>
            <h1>Welcome to HR Management System</h1>
            <h3>Please login to continue</h3>
            <button className='w-fit bg-accent_blue text-light_gray' onClick={()=>window.location.href="/login"}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
