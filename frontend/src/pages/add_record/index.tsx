import { useState } from 'react';
import PageTitle from '../../shared/components/page_title';

import SingleForm from './single_record';
import MultipleForm from './multiple_record';

enum FormType {
  SINGLE,
  MULTIPLE,
}
export default function AddRecord() {
  const [formType, setFormType] = useState<FormType>(FormType.SINGLE);
  PageTitle('Add Record');
  return (
    <>
      <div className="bg-slate-800 h-screen">
        <div className="h-full flex justify-center items-center">
          <div className="h-auto w-full mx-1 sm:w-1/2 xl:w-1/4 sm:p-5 rounded-md shadow-lg bg-white">
            <div className="space-y-6">
              {/* radio  */}
              <div className="flex-col m-2 am:m-0">
                <p className="font-medium mb-2">Form Type</p>
                <div className="flex flex-col items-start sm:flex sm:flex-row sm:space-x-4">
                  <div className="space-x-2">
                    <input
                      type="radio"
                      name="form-type"
                      value={FormType.SINGLE}
                      checked={formType === FormType.SINGLE}
                      onChange={() => {
                        setFormType(FormType.SINGLE);
                        console.log('single');
                      }}
                    />
                    <label htmlFor="singleForm">Single</label>
                  </div>
                  <div className="space-x-2">
                    <input
                      type="radio"
                      name="form-type"
                      value={FormType.MULTIPLE}
                      checked={formType === FormType.MULTIPLE}
                      onChange={() => {
                        setFormType(FormType.MULTIPLE);
                        console.log('multiple');
                      }}
                    />
                    <label htmlFor="multipleForm">Multiple</label>
                  </div>
                </div>
              </div>

              {/* form */}
              <div className="flex">
                <div
                  className={`transition-opacity duration-500 w-full ${
                    formType === FormType.SINGLE
                      ? 'opacity-100'
                      : 'opacity-0 hidden'
                  }`}
                >
                  {formType === FormType.SINGLE && <SingleForm />}
                </div>

                <div
                  className={`transition-all duration-500  w-full ${
                    formType === FormType.MULTIPLE
                      ? 'opacity-100'
                      : 'opacity-0 hidden'
                  }`}
                >
                  {formType === FormType.MULTIPLE && <MultipleForm />}
                </div>
              </div>
            </div>

            <div></div>
          </div>
        </div>
      </div>
    </>
  );
}
