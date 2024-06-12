export default function MultipleForm() {
  return (
    <div className="m-2 md:m-0">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col items-end">
          <a
            href="../../../public/template/upload_record_template.xlsx"
            download
            className="text-blue-500 text-right underline"
          >
            Download Template
          </a>
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="file" className="font-medium">
            File
          </label>
          <input type="file" />
        </div>

        <div className="flex flex-col items-center pt-8">
          <button className="text-white text-center  rounded-md bg-slate-900 py-3 w-1/2 hover:bg-opacity-70">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
