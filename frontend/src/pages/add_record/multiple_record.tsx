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

        {/* data table */}
        <div className="flex rounded-lg">
          <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400  ">
              <tr>
                <th>Title</th>
                <th>Issue Date</th>
                <th>Credential</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="whitespace-normal truncate">
                  asdsadsadasdasdasdasd
                </td>
                <td className="whitespace-normal truncate">dsfdsfds</td>
                <td className="whitespace-normal truncate">sdfdsf</td>
                <td className="whitespace-normal truncate">
                  asjdfkasjf jsafj asjf jsafj sakjdfjdafjdsfnf dsj jfdkgjksdfj
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
