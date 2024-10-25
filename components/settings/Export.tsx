import { exportToPdf } from "@/lib/utils";

import { Button } from "../ui/button";

export const Export = () => (
  <div className='flex flex-col gap-3 px-5 py-3'>
    <h3 className='text-[10px] uppercase'>Export</h3>
    <Button
      variant='outline'
      className='w-full border border-primary-grey-100 hover:bg-blue-500 hover:text-primary-black'
      onClick={exportToPdf}
    >
      Export to PDF
    </Button>
  </div>
);

 