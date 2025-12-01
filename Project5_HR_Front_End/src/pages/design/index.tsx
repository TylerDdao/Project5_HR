import DeleteIcon from '@mui/icons-material/Delete';
import AlarmIcon from '@mui/icons-material/Alarm';
import { IconButton } from '@mui/material';

const DesignPage = () => (
  <div className='p-5'>
    <div className='flex flex-col space-y-2'>
      <h1>Colors Palette</h1>
      <div className='w-1/2 border border-medium_gray'></div>
        <div className='flex flex-col space-y-2'>
          <div className='flex space-x-2 items-start'>
            <div className='w-[100px] h-[100px] bg-charcoal rounded-lg border-2'></div>
            <div>
              <h2>Charcoal <span className='code'>charcoal</span></h2>
              <p>Use for main text <span className='code'>code</span></p>
            </div>
          </div>

          <div className='flex space-x-2 items-start'>
            <div className='w-[100px] h-[100px] bg-accent_blue rounded-lg border-2'></div>
            <div>
              <h2>Accent Blue <span className='code'>accent_blue</span></h2>
              <p>Use for interactive elements such as buttons, links, etc.</p>
            </div>
          </div>
          
          <div className='flex space-x-2 items-start'>
            <div className='w-[100px] h-[100px] bg-medium_gray rounded-lg border-2'></div>
            <div>
              <h2>Medium Gray <span className='code'>medium_gray</span></h2>
              <p>Use for secondary text, icons</p>
            </div>
          </div>

          <div className='flex space-x-2 items-start'>
            <div className='w-[100px] h-[100px] bg-light_gray rounded-lg border-2'></div>
            <div>
              <h2>Light Gray <span className='code'>light_gray</span></h2>
              <p>Use for main background</p>
            </div>
          </div>

          <div className='flex space-x-2 items-start'>
            <div className='w-[100px] h-[100px] bg-white rounded-lg border-2'></div>
            <div>
              <h2>White <span className='code'>white</span></h2>
              <p>Use for card background</p>
            </div>
          </div>

          <div className='flex space-x-2 items-start'>
            <div className='w-[100px] h-[100px] bg-tomato_red rounded-lg border-2'></div>
            <div>
              <h2>Tomato Red <span className='code'>tomato_red</span></h2>
              <p>Use for buttons which perform destrcutive actions</p>
            </div>
          </div>
        </div>
    </div>

    <div className='flex flex-col space-y-2 mt-5'>
      <h1>Typography</h1>
      <div className='w-1/2 border border-medium_gray'></div>
      <h1>Header 1 <span className='code'>{'<h1></h1>'}</span></h1>
      <h2>Header 2 <span className='code'>{'<h1></h1>'}</span></h2>
      <h3>Header 3 <span className='code'>{'<h1></h1>'}</span></h3>
      <p>Body text <span className='code'>{'<p></p>'}</span></p>
      <p className='label'>Labels <span className='code'>{`<p className='label'></p>`}</span></p>
      <p className='caption'>Caption <span className='code'>{`<p className='caption'></p>`}</span></p>
      <p>To have the text in code style, use <span className='code'>className='code'</span> in your tag</p>
    </div>
  </div>
);

export default DesignPage;
