import { ErrorMessage, Field, Formik } from 'formik';
import { RecordSchema } from '../../models/add-record/record.model';

export default function SingleForm() {
  return (
    <div className="m-2 sm:m-0">
      <Formik
        initialValues={{
          title: '',
          issueDate: '',
          credential: '',
          description: '',
        }}
        validationSchema={RecordSchema}
        onSubmit={(values, { setSubmitting }) => {}}
      >
        {({ isSubmitting, handleSubmit }) => {
          return (
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="flex flex-col space-y-6">
                <div className="flex flex-col">
                  <label htmlFor="title" className="font-medium">
                    Title
                  </label>
                  <Field
                    type="text"
                    name="title"
                    className="p-1 border-b focus:border-b-2 focus:outline-none focus:border-slate-950"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="issueDate" className="font-medium">
                    Issue Date
                  </label>
                  <Field
                    type="date"
                    name="issueDate"
                    className="p-1 border-b focus:border-b-2 focus:outline-none focus:border-slate-950"
                  />
                  <ErrorMessage
                    name="issueDate"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="credential" className="font-medium">
                    Credential
                  </label>
                  <Field
                    type="text"
                    name="credential"
                    className="p-1 border-b focus:border-b-2 focus:outline-none focus:border-slate-950"
                  />
                  <ErrorMessage
                    name="credential"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="description" className="font-medium">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="descripton"
                    rows={3}
                    className="p-1 border rounded"
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="text-white text-center  rounded-md bg-slate-900 py-3 w-1/2 hover:bg-opacity-70"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}
